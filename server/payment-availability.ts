import {
  getCommunitySiteUrl,
  isCommunityPaymentEnabled,
  isWechatPaymentEnabled,
} from "./config.js";
import { AppError } from "./errors.js";

export const requireCommunityPaymentEnabled = (): void => {
  if (!isCommunityPaymentEnabled()) {
    throw new AppError(503, "payment_not_open", "支付宝正式收款尚未开放，请稍后再来。");
  }
};

export const requireCommunitySiteOrigin = (request: Request): void => {
  if (new URL(request.url).origin !== getCommunitySiteUrl()) {
    throw new AppError(409, "wrong_payment_origin", "请从正式交流群页面重新发起支付。");
  }
};

export const requireWechatPaymentEnabled = (): void => {
  if (!isWechatPaymentEnabled()) {
    throw new AppError(404, "not_found", "未找到对应页面。" );
  }
};
