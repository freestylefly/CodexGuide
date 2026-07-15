import { findCurrentOrder, hasActiveGroupQr } from "../../server/db.js";
import { readPaidCommunityBuyers } from "../../server/auth.js";
import { errorResponse } from "../../server/errors.js";
import { assertMethod, noStoreHeaders } from "../../server/http.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["GET"]);
      const buyers = readPaidCommunityBuyers(request);

      if (buyers.length === 0) {
        return Response.json(
          {
            authenticated: false,
            eligible: false,
            sessionUrl: "/api/auth/alipay/session",
          },
          { headers: noStoreHeaders() },
        );
      }

      const [buyerOrders, groupQr] = await Promise.all([
        Promise.all(
          buyers.map(async (buyer) => ({
            buyer,
            order: await findCurrentOrder(buyer.buyerKey, buyer.provider),
          })),
        ),
        hasActiveGroupQr(),
      ]);
      const selected =
        buyerOrders.find(({ order }) => order?.status === "PAID") ||
        buyerOrders.find(({ order }) => order?.status === "PENDING") ||
        buyerOrders[0];
      const { buyer, order } = selected;

      return Response.json(
        {
          authenticated: true,
          eligible: order?.status === "PAID",
          groupQrReady: groupQr,
          orderId: order?.id ?? null,
          orderStatus: order?.status ?? null,
          paymentProvider: order?.payment_provider ?? buyer.provider,
        },
        { headers: noStoreHeaders() },
      );
    } catch (error) {
      return errorResponse(error);
    }
  },
};
