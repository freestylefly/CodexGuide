import { getAdminSessionSecret, getBuyerHmacSecret } from "./config.js";
import { AppError } from "./errors.js";
import { getClientIp } from "./http.js";
import { hmacHex } from "./security.js";
import {
  readAdminSession,
  readAlipaySession,
  readCommunitySession,
  type AlipaySession,
  type CommunitySession,
} from "./session.js";

export const requireCommunitySession = (request: Request): CommunitySession => {
  const session = readCommunitySession(request);

  if (!session) {
    throw new AppError(401, "wechat_auth_required", "请先在微信内完成身份确认。" );
  }

  return session;
};

export const requireAlipaySession = (request: Request): AlipaySession => {
  const session = readAlipaySession(request);

  if (!session) {
    throw new AppError(401, "alipay_session_required", "支付会话已失效，请刷新页面后重试。" );
  }

  return session;
};

export type PaidCommunityBuyer = {
  buyerKey: string;
  provider: "ALIPAY" | "WECHAT";
};

export const readPaidCommunityBuyers = (request: Request): PaidCommunityBuyer[] => {
  const buyers: PaidCommunityBuyer[] = [];
  const alipay = readAlipaySession(request);
  if (alipay) buyers.push({ buyerKey: alipay.buyerKey, provider: "ALIPAY" });

  const wechat = readCommunitySession(request);
  if (wechat) buyers.push({ buyerKey: wechat.buyerKey, provider: "WECHAT" });

  return buyers;
};

export const requirePaidCommunityBuyers = (request: Request): PaidCommunityBuyer[] => {
  const buyers = readPaidCommunityBuyers(request);
  if (buyers.length === 0) {
    throw new AppError(401, "community_session_required", "支付会话已失效，请刷新页面后重试。" );
  }
  return buyers;
};

export const requireAdminSession = (request: Request): void => {
  if (!readAdminSession(request)) {
    throw new AppError(401, "admin_auth_required", "请先登录管理页。" );
  }
};

export const adminLoginBucket = (request: Request): string =>
  hmacHex(`admin-login:${getClientIp(request)}`, getAdminSessionSecret());

export const buyerKeyForOpenid = (openid: string): string =>
  hmacHex(openid, getBuyerHmacSecret());
