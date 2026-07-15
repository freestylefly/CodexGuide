import { refundAlipayCommunityOrder } from "../../server/alipay-order-service.js";
import { requireAdminSession } from "../../server/auth.js";
import { findOrderById } from "../../server/db.js";
import { AppError, errorResponse } from "../../server/errors.js";
import { assertMethod, assertSameOrigin, noStoreHeaders, parseJson } from "../../server/http.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["POST"]);
      assertSameOrigin(request);
      requireAdminSession(request);
      const body = await parseJson<{ orderId?: unknown; reason?: unknown }>(request);
      const orderId = typeof body.orderId === "string" ? body.orderId : "";
      const reason = typeof body.reason === "string" ? body.reason.trim() : "用户申请退款";

      if (!/^CG[A-Z0-9]{20,30}$/u.test(orderId) || reason.length < 1 || reason.length > 256) {
        throw new AppError(400, "invalid_refund_request", "退款请求内容无效。" );
      }

      const order = await findOrderById(orderId);
      if (!order) throw new AppError(404, "order_not_found", "未找到对应订单。" );
      const result = await refundAlipayCommunityOrder(order, reason);
      return Response.json(result, { headers: noStoreHeaders() });
    } catch (error) {
      return errorResponse(error);
    }
  },
};
