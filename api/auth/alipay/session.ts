import { getBuyerHmacSecret } from "../../../server/config.js";
import { errorResponse } from "../../../server/errors.js";
import { assertMethod, noStoreHeaders } from "../../../server/http.js";
import { hmacHex, randomToken } from "../../../server/security.js";
import {
  alipaySessionCookie,
  readAlipaySession,
} from "../../../server/session.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["GET"]);
      const existing = readAlipaySession(request);
      if (existing) {
        return Response.json({ authenticated: true }, { headers: noStoreHeaders() });
      }

      const buyerKey = hmacHex(`alipay-session:${randomToken(32)}`, getBuyerHmacSecret());
      const headers = noStoreHeaders({ "Set-Cookie": alipaySessionCookie(buyerKey) });
      return Response.json({ authenticated: true }, { headers });
    } catch (error) {
      return errorResponse(error);
    }
  },
};
