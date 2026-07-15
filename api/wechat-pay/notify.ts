import { findOrderById, markOrderPaid } from "../../server/db.js";
import { AppError, errorResponse } from "../../server/errors.js";
import { assertMethod } from "../../server/http.js";
import {
  decryptWechatNotification,
  validatePaidTransaction,
  verifyWechatSignature,
  type WechatNotification,
} from "../../server/wechat-pay.js";
import { getWechatConfig } from "../../server/config.js";
import { requireWechatPaymentEnabled } from "../../server/payment-availability.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      requireWechatPaymentEnabled();
      assertMethod(request, ["POST"]);
      const rawBody = await request.text();
      const config = getWechatConfig();
      verifyWechatSignature(rawBody, request.headers, config);

      let notification: WechatNotification;
      try {
        notification = JSON.parse(rawBody) as WechatNotification;
      } catch {
        throw new AppError(400, "invalid_notification_json", "微信支付通知格式无效。" );
      }

      const transaction = decryptWechatNotification(notification, config);
      const orderId = transaction.out_trade_no || "";
      const order = await findOrderById(orderId);
      if (!order) throw new AppError(404, "order_not_found", "未找到对应订单。" );

      const transactionId = validatePaidTransaction(transaction, order, config);
      await markOrderPaid(order.id, transactionId);

      return new Response(null, { status: 204 });
    } catch (error) {
      return errorResponse(error);
    }
  },
};
