import { createSign, generateKeyPairSync } from "node:crypto";

import { describe, expect, it, beforeEach } from "vitest";

import type { AlipayConfig } from "../server/config.js";
import type { CommunityOrder } from "../server/db.js";
import {
  createAlipayPaymentForm,
  validateAlipayNotification,
  validateAlipayQueryPayment,
  verifyAlipayNotificationSignature,
  type AlipayNotification,
} from "../server/alipay-pay.js";

const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
const privatePem = keys.privateKey.export({ type: "pkcs1", format: "pem" }).toString();
const privateRaw = privatePem.replace(/-----[^-]+-----|\s/gu, "");
const publicRaw = keys.publicKey
  .export({ type: "spki", format: "pem" })
  .toString()
  .replace(/-----[^-]+-----|\s/gu, "");

const config: AlipayConfig = {
  alipayPublicKey: publicRaw,
  appId: "9021000000000001",
  gateway: "https://openapi-sandbox.dl.alipaydev.com/gateway.do",
  notifyEnabled: false,
  privateKey: privateRaw,
  sellerId: "2088000000000001",
};

const order: CommunityOrder = {
  alipay_buyer_key: null,
  alipay_trade_no: null,
  amount_cents: 990,
  buyer_key: "b".repeat(64),
  created_at: new Date(),
  currency: "CNY",
  id: "CGMTEST00000000000000001",
  paid_at: null,
  payment_provider: "ALIPAY",
  prepay_expires_at: null,
  prepay_id: null,
  refund_request_no: null,
  refunded_at: null,
  status: "PENDING",
  updated_at: new Date(),
  wechat_transaction_id: null,
};

const signNotification = (values: AlipayNotification): AlipayNotification => {
  const content = Object.keys(values)
    .sort()
    .map((key) => `${key}=${values[key]}`)
    .join("&");
  const signer = createSign("RSA-SHA256");
  signer.update(content, "utf8");
  signer.end();
  return { ...values, sign: signer.sign(privatePem, "base64") };
};

describe("Alipay website payment", () => {
  beforeEach(() => {
    process.env.PUBLIC_SITE_URL = "http://localhost:3000";
    process.env.COMMUNITY_BUYER_HMAC_SECRET = "buyer-secret".repeat(4);
  });

  it("creates a POST form for the sandbox gateway with a fixed 9.90 amount", () => {
    const html = createAlipayPaymentForm(order, config);

    expect(html).toContain("<form");
    expect(html).toContain('method="post"');
    expect(html).toContain("openapi-sandbox.dl.alipaydev.com/gateway.do");
    expect(html).toContain("9.90");
    expect(html).toContain("FAST_INSTANT_TRADE_PAY");
    expect(html).toContain(order.id);
  });

  it("accepts only a paid query matching the local order and amount", () => {
    const payment = validateAlipayQueryPayment(
      {
        code: "10000",
        out_trade_no: order.id,
        total_amount: "9.90",
        trade_no: "2026071522000000000001",
        trade_status: "TRADE_SUCCESS",
      },
      order,
      config,
    );

    expect(payment.tradeNo).toBe("2026071522000000000001");
    expect(() =>
      validateAlipayQueryPayment(
        {
          code: "10000",
          out_trade_no: order.id,
          total_amount: "0.01",
          trade_no: "2026071522000000000001",
          trade_status: "TRADE_SUCCESS",
        },
        order,
        config,
      ),
    ).toThrow("不匹配");
  });

  it("verifies a notification before validating merchant, order and amount", () => {
    const notification = signNotification({
      app_id: config.appId,
      buyer_id: "2088123412341234",
      notify_type: "trade_status_sync",
      out_trade_no: order.id,
      seller_id: config.sellerId,
      sign_type: "RSA2",
      total_amount: "9.90",
      trade_no: "2026071522000000000002",
      trade_status: "TRADE_SUCCESS",
    });

    expect(() => verifyAlipayNotificationSignature(notification, config)).not.toThrow();
    const payment = validateAlipayNotification(notification, order, config);
    expect(payment.tradeNo).toBe("2026071522000000000002");
    expect(payment.buyerKey).toMatch(/^[a-f0-9]{64}$/u);

    const forged = { ...notification, total_amount: "0.01" };
    expect(() => verifyAlipayNotificationSignature(forged, config)).toThrow("签名无效");
  });
});
