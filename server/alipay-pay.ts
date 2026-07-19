import { AlipaySdk } from "alipay-sdk";

import type { AlipayConfig } from "./config.js";
import {
  getAlipayConfig,
  getBuyerHmacSecret,
  getCommunitySiteUrl,
} from "./config.js";
import type { CommunityOrder } from "./db.js";
import { AppError } from "./errors.js";
import {
  COMMUNITY_ORDER_SUBJECT,
  COMMUNITY_PRICE_CENTS,
  COMMUNITY_PRICE_YUAN,
} from "./payment-constants.js";
import { hmacHex } from "./security.js";

export type AlipayTradeResult = {
  buyer_open_id?: string;
  buyer_user_id?: string;
  code?: string;
  fund_change?: string;
  msg?: string;
  out_request_no?: string;
  out_trade_no?: string;
  refund_amount?: string;
  refund_fee?: string;
  refund_status?: string;
  seller_id?: string;
  sub_code?: string;
  sub_msg?: string;
  total_amount?: string;
  trade_no?: string;
  trade_status?: string;
};

export type AlipayNotification = Record<string, string> & {
  app_id?: string;
  buyer_id?: string;
  buyer_open_id?: string;
  notify_type?: string;
  out_trade_no?: string;
  seller_id?: string;
  sign?: string;
  sign_type?: string;
  total_amount?: string;
  trade_no?: string;
  trade_status?: string;
};

const paidStatuses = new Set(["TRADE_FINISHED", "TRADE_SUCCESS"]);

const sdk = (config: AlipayConfig = getAlipayConfig()): AlipaySdk =>
  new AlipaySdk({
    alipayPublicKey: config.alipayPublicKey,
    appId: config.appId,
    camelcase: false,
    gateway: config.gateway,
    keyType: "PKCS1",
    privateKey: config.privateKey,
    signType: "RSA2",
  });

const amountToCents = (value: string | undefined): number | null => {
  if (!value || !/^\d+(?:\.\d{1,2})?$/u.test(value)) return null;
  const [yuan, decimal = ""] = value.split(".");
  const cents = Number(yuan) * 100 + Number(decimal.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
};

const requireApiSuccess = (result: AlipayTradeResult, operation: string): void => {
  if (result.code === "10000") return;
  console.error(`Alipay ${operation} failed`, result.code, result.sub_code);
  throw new AppError(502, "alipay_api_error", "支付宝暂时无法处理该请求，请稍后重试。" );
};

export const createAlipayPaymentForm = (
  order: CommunityOrder,
  config: AlipayConfig = getAlipayConfig(),
): string => {
  if (
    order.payment_provider !== "ALIPAY" ||
    order.amount_cents !== COMMUNITY_PRICE_CENTS ||
    order.currency !== "CNY" ||
    order.status !== "PENDING"
  ) {
    throw new AppError(409, "invalid_alipay_order", "订单状态无法发起支付宝支付。" );
  }

  const returnUrl = new URL("/community/result", getCommunitySiteUrl());
  returnUrl.searchParams.set("orderId", order.id);
  const request: {
    bizContent: Record<string, string>;
    notifyUrl?: string;
    returnUrl: string;
  } = {
    bizContent: {
      out_trade_no: order.id,
      product_code: "FAST_INSTANT_TRADE_PAY",
      subject: COMMUNITY_ORDER_SUBJECT,
      timeout_express: "10m",
      total_amount: COMMUNITY_PRICE_YUAN,
    },
    returnUrl: returnUrl.toString(),
  };

  if (config.notifyEnabled) {
    request.notifyUrl = new URL("/api/alipay/notify", getCommunitySiteUrl()).toString();
  }

  const paymentHtml = sdk(config).pageExec("alipay.trade.page.pay", "POST", request);

  if (!paymentHtml.includes("<form") || !paymentHtml.includes("method=\"post\"")) {
    throw new AppError(502, "invalid_alipay_form", "支付宝未返回有效支付页面，请稍后重试。" );
  }

  return paymentHtml;
};

export const queryAlipayTrade = async (
  orderId: string,
  config: AlipayConfig = getAlipayConfig(),
): Promise<AlipayTradeResult> =>
  (await sdk(config).exec("alipay.trade.query", {
    bizContent: { out_trade_no: orderId },
  })) as AlipayTradeResult;

export const closeAlipayTrade = async (
  orderId: string,
  config: AlipayConfig = getAlipayConfig(),
): Promise<AlipayTradeResult> =>
  (await sdk(config).exec("alipay.trade.close", {
    bizContent: { out_trade_no: orderId },
  })) as AlipayTradeResult;

export const refundAlipayTrade = async (
  order: CommunityOrder,
  refundRequestNo: string,
  reason: string,
  config: AlipayConfig = getAlipayConfig(),
): Promise<AlipayTradeResult> => {
  if (order.payment_provider !== "ALIPAY" || order.status !== "PAID") {
    throw new AppError(409, "order_not_refundable", "该订单当前无法退款。" );
  }

  return (await sdk(config).exec("alipay.trade.refund", {
    bizContent: {
      out_request_no: refundRequestNo,
      out_trade_no: order.id,
      refund_amount: COMMUNITY_PRICE_YUAN,
      refund_reason: reason,
    },
  })) as AlipayTradeResult;
};

export const queryAlipayRefund = async (
  order: CommunityOrder,
  config: AlipayConfig = getAlipayConfig(),
): Promise<AlipayTradeResult> => {
  if (order.payment_provider !== "ALIPAY" || !order.refund_request_no) {
    throw new AppError(409, "refund_not_found", "该订单没有可查询的退款申请。" );
  }

  return (await sdk(config).exec("alipay.trade.fastpay.refund.query", {
    bizContent: {
      out_request_no: order.refund_request_no,
      out_trade_no: order.id,
    },
  })) as AlipayTradeResult;
};

export const isAlipayTradeNotFound = (result: AlipayTradeResult): boolean =>
  result.sub_code === "ACQ.TRADE_NOT_EXIST";

export const validateAlipayQueryPayment = (
  result: AlipayTradeResult,
  order: CommunityOrder,
  config: AlipayConfig = getAlipayConfig(),
): { buyerKey: string | null; tradeNo: string } => {
  requireApiSuccess(result, "trade query");
  const buyerId = result.buyer_open_id || result.buyer_user_id;

  if (
    !paidStatuses.has(result.trade_status || "") ||
    result.out_trade_no !== order.id ||
    amountToCents(result.total_amount) !== order.amount_cents ||
    order.currency !== "CNY" ||
    order.payment_provider !== "ALIPAY" ||
    (result.seller_id !== undefined && result.seller_id !== config.sellerId) ||
    (order.alipay_trade_no !== null && order.alipay_trade_no !== result.trade_no) ||
    !result.trade_no
  ) {
    throw new AppError(400, "alipay_payment_mismatch", "支付宝支付结果与本地订单不匹配。" );
  }

  return {
    buyerKey: buyerId ? hmacHex(`alipay:${buyerId}`, getBuyerHmacSecret()) : null,
    tradeNo: result.trade_no,
  };
};

export const verifyAlipayNotificationSignature = (
  notification: AlipayNotification,
  config: AlipayConfig = getAlipayConfig(),
): void => {
  if (!sdk(config).checkNotifySignV2(notification)) {
    throw new AppError(401, "invalid_alipay_signature", "支付宝通知签名无效。" );
  }
};

export const validateAlipayNotification = (
  notification: AlipayNotification,
  order: CommunityOrder,
  config: AlipayConfig = getAlipayConfig(),
): { buyerKey: string | null; tradeNo: string } => {
  const buyerId = notification.buyer_open_id || notification.buyer_id;

  if (
    notification.notify_type !== "trade_status_sync" ||
    notification.sign_type !== "RSA2" ||
    notification.app_id !== config.appId ||
    notification.seller_id !== config.sellerId ||
    notification.out_trade_no !== order.id ||
    amountToCents(notification.total_amount) !== order.amount_cents ||
    order.currency !== "CNY" ||
    order.payment_provider !== "ALIPAY" ||
    (order.alipay_trade_no !== null && order.alipay_trade_no !== notification.trade_no) ||
    !paidStatuses.has(notification.trade_status || "") ||
    !notification.trade_no
  ) {
    throw new AppError(400, "alipay_notification_mismatch", "支付宝通知与本地订单不匹配。" );
  }

  return {
    buyerKey: buyerId ? hmacHex(`alipay:${buyerId}`, getBuyerHmacSecret()) : null,
    tradeNo: notification.trade_no,
  };
};

export const assertAlipayApiSuccess = requireApiSuccess;
