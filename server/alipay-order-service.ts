import { randomBytes } from "node:crypto";

import {
  findCurrentOrder,
  findOrderForBuyer,
  insertPendingOrder,
  markAlipayOrderPaid,
  markOrderClosed,
  markOrderRefunded,
  saveRefundRequest,
  type CommunityOrder,
} from "./db.js";
import { AppError } from "./errors.js";
import {
  assertAlipayApiSuccess,
  closeAlipayTrade,
  createAlipayPaymentForm,
  isAlipayTradeNotFound,
  queryAlipayRefund,
  queryAlipayTrade,
  refundAlipayTrade,
  validateAlipayQueryPayment,
} from "./alipay-pay.js";
import { COMMUNITY_PRICE_CENTS } from "./payment-constants.js";

const ORDER_LIFETIME_MS = 10 * 60 * 1000;

const dateValue = (value: string | Date | null): number => (value ? new Date(value).getTime() : 0);

const createOrderId = (): string =>
  `CG${Date.now().toString(36)}${randomBytes(8).toString("hex")}`.toUpperCase();

const orderExpired = (order: CommunityOrder): boolean =>
  dateValue(order.created_at) + ORDER_LIFETIME_MS <= Date.now();

export type PreparedAlipayOrder =
  | { eligible: true; orderId: string }
  | { eligible: false; orderId: string; paymentHtml: string };

export const reconcilePendingAlipayOrder = async (
  order: CommunityOrder,
): Promise<CommunityOrder> => {
  if (order.payment_provider !== "ALIPAY" || order.status !== "PENDING") return order;

  const result = await queryAlipayTrade(order.id);
  if (isAlipayTradeNotFound(result)) return order;

  if (["TRADE_SUCCESS", "TRADE_FINISHED"].includes(result.trade_status || "")) {
    const payment = validateAlipayQueryPayment(result, order);
    await markAlipayOrderPaid(order.id, payment.tradeNo, payment.buyerKey);
    return {
      ...order,
      alipay_buyer_key: payment.buyerKey,
      alipay_trade_no: payment.tradeNo,
      status: "PAID",
    };
  }

  if (result.code === "10000" && result.trade_status === "TRADE_CLOSED") {
    await markOrderClosed(order.id);
    return { ...order, status: "CLOSED" };
  }

  if (result.code && result.code !== "10000") {
    assertAlipayApiSuccess(result, "trade query");
  }

  return order;
};

export const prepareAlipayCommunityOrder = async (
  buyerKey: string,
): Promise<PreparedAlipayOrder> => {
  let current = await findCurrentOrder(buyerKey, "ALIPAY");

  if (current?.status === "PAID") return { eligible: true, orderId: current.id };

  if (current?.status === "PENDING" && orderExpired(current)) {
    current = await reconcilePendingAlipayOrder(current);
    if (current.status === "PAID") return { eligible: true, orderId: current.id };

    if (current.status === "PENDING") {
      const closed = await closeAlipayTrade(current.id);
      if (closed.code === "10000" || isAlipayTradeNotFound(closed)) {
        await markOrderClosed(current.id);
        current = null;
      } else {
        assertAlipayApiSuccess(closed, "trade close");
      }
    }
  }

  if (!current || current.status !== "PENDING") {
    try {
      current = await insertPendingOrder(createOrderId(), buyerKey, COMMUNITY_PRICE_CENTS, "ALIPAY");
    } catch (error) {
      if ((error as { code?: string }).code !== "23505") throw error;
      current = await findCurrentOrder(buyerKey, "ALIPAY");
      if (!current) throw error;
      if (current.status === "PAID") return { eligible: true, orderId: current.id };
    }
  }

  return {
    eligible: false,
    orderId: current.id,
    paymentHtml: createAlipayPaymentForm(current),
  };
};

export const getAlipayBuyerOrderStatus = async (
  orderId: string,
  buyerKey: string,
  reconcile = false,
): Promise<CommunityOrder> => {
  const order = await findOrderForBuyer(orderId, buyerKey);
  if (!order || order.payment_provider !== "ALIPAY") {
    throw new AppError(404, "order_not_found", "未找到对应支付宝订单。" );
  }
  if (!reconcile || order.status !== "PENDING") return order;
  return reconcilePendingAlipayOrder(order);
};

export const closeBuyerAlipayOrder = async (
  orderId: string,
  buyerKey: string,
): Promise<CommunityOrder> => {
  let order = await getAlipayBuyerOrderStatus(orderId, buyerKey, true);
  if (order.status !== "PENDING") return order;

  const result = await closeAlipayTrade(order.id);
  if (result.code !== "10000" && !isAlipayTradeNotFound(result)) {
    assertAlipayApiSuccess(result, "trade close");
  }
  await markOrderClosed(order.id);
  order = { ...order, status: "CLOSED" };
  return order;
};

export const refundAlipayCommunityOrder = async (
  order: CommunityOrder,
  reason: string,
): Promise<{ refundRequestNo: string; status: "PROCESSING" | "REFUNDED" }> => {
  const refundRequestNo = order.refund_request_no || `AR${order.id}`;
  await saveRefundRequest(order.id, refundRequestNo);
  const result = await refundAlipayTrade(order, refundRequestNo, reason);
  assertAlipayApiSuccess(result, "trade refund");

  if (result.fund_change === "Y") {
    await markOrderRefunded(order.id, refundRequestNo);
    return { refundRequestNo, status: "REFUNDED" };
  }

  return { refundRequestNo, status: "PROCESSING" };
};

export const queryAlipayCommunityRefund = async (
  order: CommunityOrder,
): Promise<{ refundRequestNo: string; status: "PROCESSING" | "REFUNDED" }> => {
  const result = await queryAlipayRefund(order);
  assertAlipayApiSuccess(result, "refund query");

  if (result.refund_status === "REFUND_SUCCESS") {
    await markOrderRefunded(order.id, order.refund_request_no);
    return { refundRequestNo: order.refund_request_no!, status: "REFUNDED" };
  }

  return { refundRequestNo: order.refund_request_no!, status: "PROCESSING" };
};
