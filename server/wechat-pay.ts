import {
  createDecipheriv,
  createSign,
  createVerify,
  randomBytes,
} from "node:crypto";

import type { CommunityOrder } from "./db.js";
import type { WechatConfig } from "./config.js";
import { getCommunitySiteUrl, getWechatConfig } from "./config.js";
import { AppError } from "./errors.js";
import { COMMUNITY_PRICE_CENTS } from "./payment-constants.js";

export { COMMUNITY_PRICE_CENTS } from "./payment-constants.js";
const ORDER_DESCRIPTION = "CodexGuide 付费交流群";

type Fetch = typeof globalThis.fetch;

export type JsapiPayment = {
  appId: string;
  nonceStr: string;
  package: string;
  paySign: string;
  signType: "RSA";
  timeStamp: string;
};

export type WechatTransaction = {
  amount?: { currency?: string; payer_total?: number; total?: number };
  appid?: string;
  mchid?: string;
  out_trade_no?: string;
  trade_state?: string;
  transaction_id?: string;
};

export type WechatNotification = {
  resource?: {
    algorithm?: string;
    associated_data?: string;
    ciphertext?: string;
    nonce?: string;
  };
};

const nonce = (): string => randomBytes(16).toString("hex");

const rsaSign = (message: string, privateKey: string): string => {
  const signer = createSign("RSA-SHA256");
  signer.update(message);
  signer.end();
  return signer.sign(privateKey, "base64");
};

export const createMerchantAuthorization = (
  method: string,
  pathWithQuery: string,
  body: string,
  config: WechatConfig,
  nowSeconds = Math.floor(Date.now() / 1000),
  nonceValue = nonce(),
): string => {
  const message = `${method}\n${pathWithQuery}\n${nowSeconds}\n${nonceValue}\n${body}\n`;
  const signature = rsaSign(message, config.merchantPrivateKey);

  return (
    "WECHATPAY2-SHA256-RSA2048 " +
    `mchid="${config.merchantId}",` +
    `nonce_str="${nonceValue}",` +
    `timestamp="${nowSeconds}",` +
    `serial_no="${config.merchantSerialNumber}",` +
    `signature="${signature}"`
  );
};

export const verifyWechatSignature = (
  body: string,
  headers: Headers,
  config: WechatConfig,
  nowSeconds = Math.floor(Date.now() / 1000),
): void => {
  const serial = headers.get("wechatpay-serial") || "";
  const signature = headers.get("wechatpay-signature") || "";
  const timestamp = headers.get("wechatpay-timestamp") || "";
  const nonceValue = headers.get("wechatpay-nonce") || "";
  const parsedTimestamp = Number(timestamp);

  if (signature.startsWith("WECHATPAY/SIGNTEST/")) {
    throw new AppError(401, "signature_probe", "微信支付签名探测请求已拒绝。" );
  }

  if (
    !serial ||
    !signature ||
    !nonceValue ||
    !Number.isFinite(parsedTimestamp) ||
    Math.abs(nowSeconds - parsedTimestamp) > 300
  ) {
    throw new AppError(401, "invalid_wechat_signature", "微信支付签名无效。" );
  }

  const verificationKey = config.verificationKeys[serial];
  if (!verificationKey) {
    throw new AppError(503, "unknown_wechat_key", "微信支付验签密钥需要更新。" );
  }

  const verifier = createVerify("RSA-SHA256");
  verifier.update(`${timestamp}\n${nonceValue}\n${body}\n`);
  verifier.end();

  if (!verifier.verify(verificationKey, signature, "base64")) {
    throw new AppError(401, "invalid_wechat_signature", "微信支付签名无效。" );
  }
};

const wechatRequest = async <T>(
  method: "GET" | "POST",
  pathWithQuery: string,
  payload: unknown,
  fetchImpl: Fetch,
  config: WechatConfig,
): Promise<T> => {
  const body = method === "POST" ? JSON.stringify(payload) : "";
  const response = await fetchImpl(`https://api.mch.weixin.qq.com${pathWithQuery}`, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: createMerchantAuthorization(method, pathWithQuery, body, config),
      "Content-Type": "application/json",
      "User-Agent": "CodexGuide-Paid-Community/1.0",
    },
    body: method === "POST" ? body : undefined,
  });
  const rawBody = await response.text();

  verifyWechatSignature(rawBody, response.headers, config);

  let data: T & { code?: string; message?: string };
  try {
    data = JSON.parse(rawBody) as T & { code?: string; message?: string };
  } catch {
    throw new AppError(502, "invalid_wechat_response", "微信支付返回了无效响应。" );
  }

  if (!response.ok) {
    console.error("WeChat Pay API error", response.status, data.code);
    throw new AppError(502, "wechat_pay_error", "微信支付暂时不可用，请稍后重试。" );
  }

  return data;
};

export const createWechatJsapiOrder = async (
  openid: string,
  orderId: string,
  expiresAt: Date,
  fetchImpl: Fetch = fetch,
  config: WechatConfig = getWechatConfig(),
): Promise<string> => {
  const data = await wechatRequest<{ prepay_id?: string }>(
    "POST",
    "/v3/pay/transactions/jsapi",
    {
      amount: { currency: "CNY", total: COMMUNITY_PRICE_CENTS },
      appid: config.appId,
      description: ORDER_DESCRIPTION,
      mchid: config.merchantId,
      notify_url: `${getCommunitySiteUrl()}/api/wechat-pay/notify`,
      out_trade_no: orderId,
      payer: { openid },
      time_expire: expiresAt.toISOString().replace(/\.\d{3}Z$/, "+00:00"),
    },
    fetchImpl,
    config,
  );

  if (!data.prepay_id) {
    throw new AppError(502, "missing_prepay_id", "微信支付未返回预支付标识。" );
  }

  return data.prepay_id;
};

export const buildJsapiPayment = (
  prepayId: string,
  config: WechatConfig = getWechatConfig(),
  nowSeconds = Math.floor(Date.now() / 1000),
  nonceValue = nonce(),
): JsapiPayment => {
  const packageValue = `prepay_id=${prepayId}`;
  const timeStamp = String(nowSeconds);
  const message = `${config.appId}\n${timeStamp}\n${nonceValue}\n${packageValue}\n`;

  return {
    appId: config.appId,
    nonceStr: nonceValue,
    package: packageValue,
    paySign: rsaSign(message, config.merchantPrivateKey),
    signType: "RSA",
    timeStamp,
  };
};

export const queryWechatOrder = async (
  orderId: string,
  fetchImpl: Fetch = fetch,
  config: WechatConfig = getWechatConfig(),
): Promise<WechatTransaction> => {
  const path = `/v3/pay/transactions/out-trade-no/${encodeURIComponent(orderId)}?mchid=${encodeURIComponent(config.merchantId)}`;
  return wechatRequest<WechatTransaction>("GET", path, null, fetchImpl, config);
};

export const decryptWechatNotification = (
  notification: WechatNotification,
  config: WechatConfig = getWechatConfig(),
): WechatTransaction => {
  const resource = notification.resource;

  if (
    resource?.algorithm !== "AEAD_AES_256_GCM" ||
    !resource.ciphertext ||
    !resource.nonce
  ) {
    throw new AppError(400, "invalid_notification", "微信支付通知内容无效。" );
  }

  try {
    const encrypted = Buffer.from(resource.ciphertext, "base64");
    const authTag = encrypted.subarray(encrypted.length - 16);
    const ciphertext = encrypted.subarray(0, encrypted.length - 16);
    const decipher = createDecipheriv(
      "aes-256-gcm",
      Buffer.from(config.apiV3Key, "utf8"),
      Buffer.from(resource.nonce, "utf8"),
    );
    decipher.setAuthTag(authTag);
    decipher.setAAD(Buffer.from(resource.associated_data || "", "utf8"));
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");

    return JSON.parse(plaintext) as WechatTransaction;
  } catch {
    throw new AppError(400, "notification_decryption_failed", "微信支付通知解密失败。" );
  }
};

export const validatePaidTransaction = (
  transaction: WechatTransaction,
  order: CommunityOrder,
  config: WechatConfig = getWechatConfig(),
): string => {
  const orderTotal = transaction.amount?.total;

  if (
    transaction.trade_state !== "SUCCESS" ||
    transaction.out_trade_no !== order.id ||
    transaction.appid !== config.appId ||
    transaction.mchid !== config.merchantId ||
    transaction.amount?.currency !== order.currency ||
    orderTotal !== order.amount_cents ||
    !transaction.transaction_id
  ) {
    throw new AppError(400, "payment_mismatch", "支付结果与本地订单不匹配。" );
  }

  return transaction.transaction_id;
};
