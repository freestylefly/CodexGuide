import { getAdminSessionSecret, getBuyerHmacSecret } from "./config.js";
import { AppError } from "./errors.js";
import { getClientIp } from "./http.js";
import { hmacHex } from "./security.js";
import { readAdminSession, readCommunitySession, type CommunitySession } from "./session.js";

export const requireCommunitySession = (request: Request): CommunitySession => {
  const session = readCommunitySession(request);

  if (!session) {
    throw new AppError(401, "wechat_auth_required", "请先在微信内完成身份确认。" );
  }

  return session;
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
