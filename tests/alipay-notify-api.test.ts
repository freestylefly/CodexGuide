import { createSign, generateKeyPairSync } from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  findOrderById: vi.fn(),
  markAlipayOrderPaid: vi.fn(),
}));

vi.mock("../server/db.js", () => dbMocks);

import handler from "../api/alipay/notify.js";

const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
const privatePem = keys.privateKey.export({ type: "pkcs1", format: "pem" }).toString();
const privateRaw = privatePem.replace(/-----[^-]+-----|\s/gu, "");
const publicRaw = keys.publicKey
  .export({ type: "spki", format: "pem" })
  .toString()
  .replace(/-----[^-]+-----|\s/gu, "");
const orderId = "CGMTEST00000000000000001";

const signedRequest = (amount = "9.90", tamper = false): Request => {
  const params: Record<string, string> = {
    app_id: "9021000000000001",
    buyer_id: "2088123412341234",
    notify_type: "trade_status_sync",
    out_trade_no: orderId,
    seller_id: "2088000000000001",
    sign_type: "RSA2",
    total_amount: amount,
    trade_no: "2026071522000000000002",
    trade_status: "TRADE_SUCCESS",
  };
  const content = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signer = createSign("RSA-SHA256");
  signer.update(content, "utf8");
  signer.end();
  params.sign = signer.sign(privatePem, "base64");
  if (tamper) params.trade_status = "TRADE_CLOSED";

  return new Request("https://codexguide.ai/api/alipay/notify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
};

describe("Alipay notification endpoint", () => {
  beforeEach(() => {
    process.env.ALIPAY_APP_ID = "9021000000000001";
    process.env.ALIPAY_ENV = "sandbox";
    process.env.ALIPAY_NOTIFY_ENABLED = "false";
    process.env.ALIPAY_PRIVATE_KEY = privateRaw;
    process.env.ALIPAY_PUBLIC_KEY = publicRaw;
    process.env.ALIPAY_SELLER_ID = "2088000000000001";
    process.env.COMMUNITY_BUYER_HMAC_SECRET = "buyer-secret".repeat(4);
    dbMocks.findOrderById.mockReset();
    dbMocks.markAlipayOrderPaid.mockReset();
    dbMocks.findOrderById.mockResolvedValue({
      alipay_buyer_key: null,
      alipay_trade_no: null,
      amount_cents: 990,
      buyer_key: "b".repeat(64),
      created_at: new Date(),
      currency: "CNY",
      id: orderId,
      paid_at: null,
      payment_provider: "ALIPAY",
      prepay_expires_at: null,
      prepay_id: null,
      refund_request_no: null,
      refunded_at: null,
      status: "PENDING",
      updated_at: new Date(),
      wechat_transaction_id: null,
    });
  });

  it("returns the exact success body after a verified idempotent update", async () => {
    const response = await handler.fetch(signedRequest());
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("success");
    expect(dbMocks.markAlipayOrderPaid).toHaveBeenCalledWith(
      orderId,
      "2026071522000000000002",
      expect.stringMatching(/^[a-f0-9]{64}$/u),
    );
  });

  it("rejects a forged notification before reading the order", async () => {
    const response = await handler.fetch(signedRequest("9.90", true));
    expect(response.status).toBe(401);
    expect(dbMocks.findOrderById).not.toHaveBeenCalled();
    expect(dbMocks.markAlipayOrderPaid).not.toHaveBeenCalled();
  });

  it("rejects a correctly signed notification with the wrong amount", async () => {
    const response = await handler.fetch(signedRequest("0.01"));
    expect(response.status).toBe(400);
    expect(dbMocks.markAlipayOrderPaid).not.toHaveBeenCalled();
  });
});
