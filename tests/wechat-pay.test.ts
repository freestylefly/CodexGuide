import {
  createCipheriv,
  createSign,
  createVerify,
  generateKeyPairSync,
  randomBytes,
} from "node:crypto";

import { describe, expect, it } from "vitest";

import type { WechatConfig } from "../server/config.js";
import type { CommunityOrder } from "../server/db.js";
import {
  buildJsapiPayment,
  createMerchantAuthorization,
  decryptWechatNotification,
  validatePaidTransaction,
  verifyWechatSignature,
  type WechatNotification,
  type WechatTransaction,
} from "../server/wechat-pay.js";

const merchantKeys = generateKeyPairSync("rsa", { modulusLength: 2048 });
const platformKeys = generateKeyPairSync("rsa", { modulusLength: 2048 });
const privatePem = merchantKeys.privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const publicPem = merchantKeys.publicKey.export({ type: "spki", format: "pem" }).toString();
const platformPrivatePem = platformKeys.privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const platformPublicPem = platformKeys.publicKey.export({ type: "spki", format: "pem" }).toString();

const config: WechatConfig = {
  appId: "wx-test-app",
  appSecret: "secret",
  apiV3Key: "12345678901234567890123456789012",
  merchantId: "1900000001",
  merchantPrivateKey: privatePem,
  merchantSerialNumber: "MERCHANT-SERIAL",
  verificationKeys: { "PLATFORM-SERIAL": platformPublicPem },
};

const signedHeaders = (body: string, timestamp = 1_800_000_000): Headers => {
  const nonce = "callback-nonce";
  const signer = createSign("RSA-SHA256");
  signer.update(`${timestamp}\n${nonce}\n${body}\n`);
  signer.end();

  return new Headers({
    "Wechatpay-Nonce": nonce,
    "Wechatpay-Serial": "PLATFORM-SERIAL",
    "Wechatpay-Signature": signer.sign(platformPrivatePem, "base64"),
    "Wechatpay-Timestamp": String(timestamp),
  });
};

describe("WeChat Pay signatures", () => {
  it("signs merchant API requests using the exact API v3 message", () => {
    const authorization = createMerchantAuthorization(
      "POST",
      "/v3/pay/transactions/jsapi",
      "{\"amount\":990}",
      config,
      1_800_000_000,
      "merchant-nonce",
    );
    const signature = authorization.match(/signature="([^"]+)"/)?.[1];
    const verifier = createVerify("RSA-SHA256");
    verifier.update(
      "POST\n/v3/pay/transactions/jsapi\n1800000000\nmerchant-nonce\n{\"amount\":990}\n",
    );
    verifier.end();

    expect(signature).toBeTruthy();
    expect(verifier.verify(publicPem, signature!, "base64")).toBe(true);
  });

  it("verifies platform responses and rejects probes or stale timestamps", () => {
    const body = "{\"id\":\"notification\"}";
    expect(() => verifyWechatSignature(body, signedHeaders(body), config, 1_800_000_000)).not.toThrow();

    const probe = signedHeaders(body);
    probe.set("Wechatpay-Signature", "WECHATPAY/SIGNTEST/fake");
    expect(() => verifyWechatSignature(body, probe, config, 1_800_000_000)).toThrow("探测");
    expect(() => verifyWechatSignature(body, signedHeaders(body), config, 1_800_001_000)).toThrow("签名无效");
  });

  it("signs JSAPI client parameters with the merchant key", () => {
    const payment = buildJsapiPayment("prepay-123", config, 1_800_000_000, "client-nonce");
    const verifier = createVerify("RSA-SHA256");
    verifier.update("wx-test-app\n1800000000\nclient-nonce\nprepay_id=prepay-123\n");
    verifier.end();

    expect(payment.package).toBe("prepay_id=prepay-123");
    expect(verifier.verify(publicPem, payment.paySign, "base64")).toBe(true);
  });
});

describe("WeChat Pay notifications", () => {
  const transaction: WechatTransaction = {
    appid: config.appId,
    mchid: config.merchantId,
    out_trade_no: "CGMTEST00000000000000001",
    trade_state: "SUCCESS",
    transaction_id: "4200000000001",
    amount: { currency: "CNY", payer_total: 990, total: 990 },
  };

  const order: CommunityOrder = {
    alipay_buyer_key: null,
    alipay_trade_no: null,
    amount_cents: 990,
    buyer_key: "a".repeat(64),
    created_at: new Date(),
    currency: "CNY",
    id: transaction.out_trade_no!,
    paid_at: null,
    payment_provider: "WECHAT",
    prepay_expires_at: null,
    prepay_id: null,
    refund_request_no: null,
    refunded_at: null,
    status: "PENDING",
    updated_at: new Date(),
    wechat_transaction_id: null,
  };

  it("decrypts AES-256-GCM resources and validates all order invariants", () => {
    const nonce = randomBytes(12).toString("base64url").slice(0, 12);
    const associatedData = "transaction";
    const cipher = createCipheriv(
      "aes-256-gcm",
      Buffer.from(config.apiV3Key),
      Buffer.from(nonce),
    );
    cipher.setAAD(Buffer.from(associatedData));
    const ciphertext = Buffer.concat([
      cipher.update(JSON.stringify(transaction), "utf8"),
      cipher.final(),
      cipher.getAuthTag(),
    ]).toString("base64");
    const notification: WechatNotification = {
      resource: {
        algorithm: "AEAD_AES_256_GCM",
        associated_data: associatedData,
        ciphertext,
        nonce,
      },
    };

    const decrypted = decryptWechatNotification(notification, config);
    expect(decrypted).toEqual(transaction);
    expect(validatePaidTransaction(decrypted, order, config)).toBe("4200000000001");
  });

  it("rejects mismatched amounts and merchant identities", () => {
    expect(() =>
      validatePaidTransaction(
        { ...transaction, amount: { currency: "CNY", payer_total: 1, total: 1 } },
        order,
        config,
      ),
    ).toThrow("不匹配");
    expect(() =>
      validatePaidTransaction({ ...transaction, mchid: "attacker" }, order, config),
    ).toThrow("不匹配");
  });
});
