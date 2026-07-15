import { isWechatPaymentEnabled } from "./config.js";
import { AppError } from "./errors.js";

export const requireWechatPaymentEnabled = (): void => {
  if (!isWechatPaymentEnabled()) {
    throw new AppError(404, "not_found", "未找到对应页面。" );
  }
};
