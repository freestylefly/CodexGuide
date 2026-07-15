import {
  createCipheriv,
  createSign,
  generateKeyPairSync,
  randomBytes,
} from "node:crypto";

import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  findOrderById: vi.fn(),
  markOrderPaid: vi.fn(),
}));

vi.mock("../server/db.js", () => dbMocks);

import handler from "../api/wechat-pay/notify.js";

const merchantKeys = generateKeyPairSync("rsa", { modulusLength: 2048 });
const platformKeys = generateKeyPairSync("rsa", { modulusLength: 2048 });
const merchantPrivatePem = merchantKeys.privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const platformPrivatePem = platformKeys.privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const platformPublicPem = platformKeys.publicKey.export({ type: "spki", format: "pem" }).toString();
const apiV3Key = "12345678901234567890123456789012";
const orderId = "CGMTEST00000000000000001";

const notificationBody = (amount = 990): string => {
  const transaction = {
    appid: "wx-test-app",
    mchid: "1900000001",
    out_trade_no: orderId,
    trade_state: "SUCCESS",
    transaction_id: "4200000000001",
    amount: { currency: "CNY", payer_total: amount, total: amount },
  };
  const nonce = randomBytes(12).toString("base64url").slice(0, 12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(apiV3Key), Buffer.from(nonce));
  cipher.setAAD(Buffer.from("transaction"));
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(transaction), "utf8"),
    cipher.final(),
    cipher.getAuthTag(),
  ]).toString("base64");

  return JSON.stringify({
    id: "notification-id",
    resource: {
      algorithm: "AEAD_AES_256_GCM",
      associated_data: "transaction",
      ciphertext,
      nonce,
    },
  });
};

const signedRequest = (body: string, valid = true): Request => {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = "callback-nonce";
  const signer = createSign("RSA-SHA256");
  signer.update(`${timestamp}\n${nonce}\n${body}\n`);
  signer.end();
  const signature = signer.sign(platformPrivatePem, "base64");

  return new Request("https://codexguide.ai/api/wechat-pay/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Wechatpay-Nonce": nonce,
      "Wechatpay-Serial": "PLATFORM-SERIAL",
      "Wechatpay-Signature": valid ? signature : `x${signature.slice(1)}`,
      "Wechatpay-Timestamp": String(timestamp),
    },
    body,
  });
};

describe("WeChat Pay notification endpoint", () => {
  beforeEach(() => {
    process.env.WECHAT_PAYMENT_ENABLED = "true";
    process.env.PUBLIC_SITE_URL = "https://codexguide.ai";
    process.env.WECHAT_APP_ID = "wx-test-app";
    process.env.WECHAT_APP_SECRET = "app-secret";
    process.env.WECHAT_PAY_API_V3_KEY = apiV3Key;
    process.env.WECHAT_PAY_MCH_ID = "1900000001";
    process.env.WECHAT_PAY_CERT_SERIAL_NO = "MERCHANT-SERIAL";
    process.env.WECHAT_PAY_PRIVATE_KEY = merchantPrivatePem;
    process.env.WECHAT_PAY_VERIFICATION_KEYS = JSON.stringify({
      "PLATFORM-SERIAL": platformPublicPem,
    });
    dbMocks.findOrderById.mockReset();
    dbMocks.markOrderPaid.mockReset();
    dbMocks.findOrderById.mockResolvedValue({
      amount_cents: 990,
      buyer_key: "b".repeat(64),
      created_at: new Date(),
      currency: "CNY",
      id: orderId,
      paid_at: null,
      prepay_expires_at: null,
      prepay_id: null,
      status: "PENDING",
      updated_at: new Date(),
      wechat_transaction_id: null,
    });
  });

  it("marks a fully verified notification paid", async () => {
    const response = await handler.fetch(signedRequest(notificationBody()));
    expect(response.status).toBe(204);
    expect(dbMocks.markOrderPaid).toHaveBeenCalledWith(orderId, "4200000000001");
  });

  it("returns not found without reading payment configuration when WeChat Pay is disabled", async () => {
    process.env.WECHAT_PAYMENT_ENABLED = "false";

    const response = await handler.fetch(signedRequest(notificationBody()));

    expect(response.status).toBe(404);
    expect(dbMocks.findOrderById).not.toHaveBeenCalled();
    expect(dbMocks.markOrderPaid).not.toHaveBeenCalled();
  });

  it("rejects invalid signatures before touching the order", async () => {
    const response = await handler.fetch(signedRequest(notificationBody(), false));
    expect(response.status).toBe(401);
    expect(dbMocks.findOrderById).not.toHaveBeenCalled();
    expect(dbMocks.markOrderPaid).not.toHaveBeenCalled();
  });

  it("rejects a signed notification with the wrong amount", async () => {
    const response = await handler.fetch(signedRequest(notificationBody(1)));
    expect(response.status).toBe(400);
    expect(dbMocks.markOrderPaid).not.toHaveBeenCalled();
  });
});
