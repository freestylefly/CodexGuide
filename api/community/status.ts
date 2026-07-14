import { findCurrentOrder, hasActiveGroupQr } from "../../server/db.js";
import { errorResponse } from "../../server/errors.js";
import { assertMethod, noStoreHeaders } from "../../server/http.js";
import { readCommunitySession } from "../../server/session.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["GET"]);
      const session = readCommunitySession(request);

      if (!session) {
        return Response.json(
          {
            authenticated: false,
            authUrl: "/api/auth/wechat/start?returnTo=%2Fcommunity%2Fjoin",
            eligible: false,
          },
          { headers: noStoreHeaders() },
        );
      }

      const [order, groupQr] = await Promise.all([
        findCurrentOrder(session.buyerKey),
        hasActiveGroupQr(),
      ]);

      return Response.json(
        {
          authenticated: true,
          eligible: order?.status === "PAID",
          groupQrReady: groupQr,
          orderId: order?.id ?? null,
          orderStatus: order?.status ?? null,
        },
        { headers: noStoreHeaders() },
      );
    } catch (error) {
      return errorResponse(error);
    }
  },
};
