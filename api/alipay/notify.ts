import { findOrderById, markAlipayOrderPaid } from "../../server/db.js";
import { AppError, errorResponse } from "../../server/errors.js";
import { assertMethod } from "../../server/http.js";
import {
  validateAlipayNotification,
  verifyAlipayNotificationSignature,
  type AlipayNotification,
} from "../../server/alipay-pay.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["POST"]);
      const contentType = request.headers.get("content-type")?.toLowerCase() || "";
      if (!contentType.includes("application/x-www-form-urlencoded")) {
        throw new AppError(415, "invalid_content_type", "支付宝通知格式无效。" );
      }

      const params = Object.fromEntries(new URLSearchParams(await request.text())) as AlipayNotification;
      verifyAlipayNotificationSignature(params);

      const orderId = params.out_trade_no || "";
      const order = await findOrderById(orderId);
      if (!order) throw new AppError(404, "order_not_found", "未找到对应订单。" );

      const payment = validateAlipayNotification(params, order);
      await markAlipayOrderPaid(order.id, payment.tradeNo, payment.buyerKey);

      return new Response("success", {
        headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
      });
    } catch (error) {
      return errorResponse(error);
    }
  },
};
