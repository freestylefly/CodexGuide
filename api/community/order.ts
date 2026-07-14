import { requireCommunitySession } from "../../server/auth.js";
import { errorResponse } from "../../server/errors.js";
import { assertMethod, assertSameOrigin, noStoreHeaders } from "../../server/http.js";
import { getBuyerOrderStatus, prepareCommunityOrder } from "../../server/order-service.js";

const validOrderId = (value: string): boolean => /^CG[A-Z0-9]{20,30}$/.test(value);

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["GET", "POST"]);
      const session = requireCommunitySession(request);

      if (request.method === "POST") {
        assertSameOrigin(request);
        const result = await prepareCommunityOrder(session.openid, session.buyerKey);
        return Response.json(result, { headers: noStoreHeaders() });
      }

      const url = new URL(request.url);
      const orderId = url.searchParams.get("id") || "";
      if (!validOrderId(orderId)) {
        return Response.json(
          { error: { code: "invalid_order_id", message: "订单号无效。" } },
          { status: 400, headers: noStoreHeaders() },
        );
      }

      const order = await getBuyerOrderStatus(
        orderId,
        session.buyerKey,
        url.searchParams.get("reconcile") === "1",
      );
      return Response.json(
        { eligible: order.status === "PAID", orderId: order.id, status: order.status },
        { headers: noStoreHeaders() },
      );
    } catch (error) {
      return errorResponse(error);
    }
  },
};
