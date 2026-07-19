import {
  getCommunitySiteUrl,
  isCommunityPaymentEnabled,
} from "../../server/config.js";
import { errorResponse } from "../../server/errors.js";
import { assertMethod, noStoreHeaders } from "../../server/http.js";
import { COMMUNITY_PRICE_CENTS } from "../../server/payment-constants.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["GET"]);

      return Response.json(
        {
          communityOrigin: getCommunitySiteUrl(),
          paymentEnabled: isCommunityPaymentEnabled(),
          paymentProvider: "ALIPAY",
          priceCents: COMMUNITY_PRICE_CENTS,
        },
        { headers: noStoreHeaders() },
      );
    } catch (error) {
      return errorResponse(error);
    }
  },
};
