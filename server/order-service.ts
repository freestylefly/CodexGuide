import { randomBytes } from "node:crypto";

import {
  findCurrentOrder,
  findOrderForBuyer,
  insertPendingOrder,
  markOrderClosed,
  markOrderPaid,
  markOrderRefunded,
  savePrepay,
  type CommunityOrder,
} from "./db.js";
import { AppError } from "./errors.js";
import {
  buildJsapiPayment,
  COMMUNITY_PRICE_CENTS,
  createWechatJsapiOrder,
  queryWechatOrder,
  validatePaidTransaction,
  type JsapiPayment,
} from "./wechat-pay.js";

const ORDER_LIFETIME_MS = 10 * 60 * 1000;

const dateValue = (value: string | Date | null): number => (value ? new Date(value).getTime() : 0);

const createOrderId = (): string =>
  `CG${Date.now().toString(36)}${randomBytes(8).toString("hex")}`.toUpperCase();

const orderExpiry = (order: CommunityOrder): Date =>
  new Date(dateValue(order.created_at) + ORDER_LIFETIME_MS);

const hasUsablePrepay = (order: CommunityOrder): order is CommunityOrder & { prepay_id: string } =>
  Boolean(order.prepay_id) && dateValue(order.prepay_expires_at) > Date.now() + 15_000;

export type PreparedOrder =
  | { eligible: true; orderId: string }
  | { eligible: false; orderId: string; payment: JsapiPayment };

export const reconcilePendingOrder = async (order: CommunityOrder): Promise<CommunityOrder> => {
  if (order.status !== "PENDING") return order;

  const transaction = await queryWechatOrder(order.id);

  if (transaction.trade_state === "SUCCESS") {
    const transactionId = validatePaidTransaction(transaction, order);
    await markOrderPaid(order.id, transactionId);
    return { ...order, status: "PAID", wechat_transaction_id: transactionId };
  }

  if (transaction.trade_state === "REFUND") {
    await markOrderRefunded(order.id);
    return { ...order, status: "REFUNDED" };
  }

  if (["CLOSED", "REVOKED", "PAYERROR"].includes(transaction.trade_state || "")) {
    await markOrderClosed(order.id);
    return { ...order, status: "CLOSED" };
  }

  return order;
};

const createOrReusePending = async (openid: string, buyerKey: string): Promise<PreparedOrder> => {
  let current = await findCurrentOrder(buyerKey);

  if (current?.status === "PAID") return { eligible: true, orderId: current.id };

  if (current?.status === "PENDING" && hasUsablePrepay(current)) {
    return {
      eligible: false,
      orderId: current.id,
      payment: buildJsapiPayment(current.prepay_id),
    };
  }

  if (current?.status === "PENDING" && orderExpiry(current).getTime() <= Date.now()) {
    current = await reconcilePendingOrder(current);
    if (current.status === "PAID") return { eligible: true, orderId: current.id };
    if (current.status === "PENDING") {
      await markOrderClosed(current.id);
      current = null;
    }
  }

  if (!current || current.status !== "PENDING") {
    try {
      current = await insertPendingOrder(createOrderId(), buyerKey, COMMUNITY_PRICE_CENTS);
    } catch (error) {
      if ((error as { code?: string }).code !== "23505") throw error;
      current = await findCurrentOrder(buyerKey);
      if (!current) throw error;
      if (current.status === "PAID") return { eligible: true, orderId: current.id };
    }
  }

  const expiresAt = orderExpiry(current);
  const prepayId = await createWechatJsapiOrder(openid, current.id, expiresAt);
  await savePrepay(current.id, prepayId, expiresAt);

  return {
    eligible: false,
    orderId: current.id,
    payment: buildJsapiPayment(prepayId),
  };
};

export const prepareCommunityOrder = async (
  openid: string,
  buyerKey: string,
): Promise<PreparedOrder> => createOrReusePending(openid, buyerKey);

export const getBuyerOrderStatus = async (
  orderId: string,
  buyerKey: string,
  reconcile = false,
): Promise<CommunityOrder> => {
  const order = await findOrderForBuyer(orderId, buyerKey);

  if (!order) throw new AppError(404, "order_not_found", "未找到对应订单。" );
  if (order.status !== "PENDING" || !reconcile) return order;

  return reconcilePendingOrder(order);
};
