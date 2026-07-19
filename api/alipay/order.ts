import { requireAlipaySession } from "../../server/auth.js";
import {
  closeBuyerAlipayOrder,
  getAlipayBuyerOrderStatus,
  prepareAlipayCommunityOrder,
} from "../../server/alipay-order-service.js";
import { errorResponse } from "../../server/errors.js";
import { assertMethod, assertSameOrigin, noStoreHeaders } from "../../server/http.js";
import {
  requireCommunityPaymentEnabled,
  requireCommunitySiteOrigin,
} from "../../server/payment-availability.js";

const validOrderId = (value: string): boolean => /^CG[A-Z0-9]{20,30}$/u.test(value);

const orderIdFrom = (request: Request): string => {
  const orderId = new URL(request.url).searchParams.get("id") || "";
  if (!validOrderId(orderId)) {
    throw new Error("invalid_order_id");
  }
  return orderId;
};

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["DELETE", "GET", "POST"]);
      const session = requireAlipaySession(request);

      if (request.method === "POST") {
        assertSameOrigin(request);
        requireCommunitySiteOrigin(request);
        requireCommunityPaymentEnabled();
        const result = await prepareAlipayCommunityOrder(session.buyerKey);
        return Response.json(result, { headers: noStoreHeaders() });
      }

      const url = new URL(request.url);
      const orderId = orderIdFrom(request);

      if (request.method === "DELETE") {
        assertSameOrigin(request);
        const order = await closeBuyerAlipayOrder(orderId, session.buyerKey);
        return Response.json({ orderId: order.id, status: order.status }, { headers: noStoreHeaders() });
      }

      const order = await getAlipayBuyerOrderStatus(
        orderId,
        session.buyerKey,
        url.searchParams.get("reconcile") === "1",
      );
      return Response.json(
        { eligible: order.status === "PAID", orderId: order.id, status: order.status },
        { headers: noStoreHeaders() },
      );
    } catch (error) {
      if (error instanceof Error && error.message === "invalid_order_id") {
        return Response.json(
          { error: { code: "invalid_order_id", message: "订单号无效。" } },
          { status: 400, headers: noStoreHeaders() },
        );
      }
      return errorResponse(error);
    }
  },
};
