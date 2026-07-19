export class ConfigError extends Error {
  constructor(name: string) {
    super(`Missing or invalid environment variable: ${name}`);
    this.name = "ConfigError";
  }
}

const required = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) throw new ConfigError(name);

  return value;
};

const secret = (name: string): string => {
  const value = required(name);
  if (Buffer.byteLength(value, "utf8") < 32) throw new ConfigError(name);
  return value;
};

const pem = (value: string): string => value.replace(/\\n/g, "\n");

export const getDatabaseUrl = (): string => required("DATABASE_URL");

const origin = (name: string, fallback: string): string => {
  let url: URL;

  try {
    url = new URL(process.env[name]?.trim() || fallback);
  } catch {
    throw new ConfigError(name);
  }

  if (url.protocol !== "https:" && process.env.NODE_ENV === "production") {
    throw new ConfigError(name);
  }

  return url.origin;
};

const booleanValue = (name: string, fallback = false): boolean => {
  const value = process.env[name]?.trim().toLowerCase();
  if (!value) return fallback;
  if (!["true", "false"].includes(value)) throw new ConfigError(name);
  return value === "true";
};

export const getPublicSiteUrl = (): string =>
  origin("PUBLIC_SITE_URL", "https://codexguide.ai");

export const getCommunitySiteUrl = (): string =>
  origin("COMMUNITY_SITE_URL", getPublicSiteUrl());

export const getSiteUrl = getCommunitySiteUrl;

export const getCommunitySessionSecret = (): string => secret("COMMUNITY_SESSION_SECRET");
export const getBuyerHmacSecret = (): string => secret("COMMUNITY_BUYER_HMAC_SECRET");
export const getAdminSessionSecret = (): string => secret("ADMIN_SESSION_SECRET");
export const getAdminPasswordHash = (): string => required("ADMIN_PASSWORD_HASH");

export const isCommunityPaymentEnabled = (): boolean =>
  booleanValue("COMMUNITY_PAYMENT_ENABLED");

export const isWechatPaymentEnabled = (): boolean =>
  booleanValue("WECHAT_PAYMENT_ENABLED");

export type AlipayConfig = {
  alipayPublicKey: string;
  appId: string;
  gateway: string;
  notifyEnabled: boolean;
  privateKey: string;
  sellerId: string;
};

const ALIPAY_SANDBOX_GATEWAY = "https://openapi-sandbox.dl.alipaydev.com/gateway.do";
const ALIPAY_PRODUCTION_GATEWAY = "https://openapi.alipay.com/gateway.do";

export const getAlipayConfig = (): AlipayConfig => {
  const environment = process.env.ALIPAY_ENV?.trim() || "production";

  if (!['production', 'sandbox'].includes(environment)) {
    throw new ConfigError("ALIPAY_ENV");
  }

  const expectedGateway =
    environment === "sandbox" ? ALIPAY_SANDBOX_GATEWAY : ALIPAY_PRODUCTION_GATEWAY;
  const gateway = process.env.ALIPAY_GATEWAY?.trim() || expectedGateway;

  if (gateway !== expectedGateway) {
    throw new ConfigError("ALIPAY_GATEWAY");
  }

  return {
    alipayPublicKey: required("ALIPAY_PUBLIC_KEY"),
    appId: required("ALIPAY_APP_ID"),
    gateway,
    notifyEnabled: booleanValue("ALIPAY_NOTIFY_ENABLED"),
    privateKey: required("ALIPAY_PRIVATE_KEY"),
    sellerId: required("ALIPAY_SELLER_ID"),
  };
};

export type WechatConfig = {
  appId: string;
  appSecret: string;
  apiV3Key: string;
  merchantId: string;
  merchantPrivateKey: string;
  merchantSerialNumber: string;
  verificationKeys: Record<string, string>;
};

export const getWechatConfig = (): WechatConfig => {
  const rawVerificationKeys = required("WECHAT_PAY_VERIFICATION_KEYS");
  let verificationKeys: Record<string, string>;

  try {
    const parsed = JSON.parse(rawVerificationKeys) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Expected an object");
    }

    verificationKeys = Object.fromEntries(
      Object.entries(parsed).map(([serial, publicKey]) => {
        if (!serial || typeof publicKey !== "string" || !publicKey.includes("BEGIN")) {
          throw new Error("Invalid verification key entry");
        }

        return [serial, pem(publicKey)];
      }),
    );
  } catch {
    throw new ConfigError("WECHAT_PAY_VERIFICATION_KEYS");
  }

  if (Object.keys(verificationKeys).length === 0) {
    throw new ConfigError("WECHAT_PAY_VERIFICATION_KEYS");
  }

  const apiV3Key = required("WECHAT_PAY_API_V3_KEY");

  if (Buffer.byteLength(apiV3Key, "utf8") !== 32) {
    throw new ConfigError("WECHAT_PAY_API_V3_KEY");
  }

  return {
    appId: required("WECHAT_APP_ID"),
    appSecret: required("WECHAT_APP_SECRET"),
    apiV3Key,
    merchantId: required("WECHAT_PAY_MCH_ID"),
    merchantPrivateKey: pem(required("WECHAT_PAY_PRIVATE_KEY")),
    merchantSerialNumber: required("WECHAT_PAY_CERT_SERIAL_NO"),
    verificationKeys,
  };
};
