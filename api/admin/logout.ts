import { errorResponse } from "../../server/errors.js";
import { assertMethod, assertSameOrigin, deleteCookie, noStoreHeaders } from "../../server/http.js";
import { ADMIN_SESSION_COOKIE } from "../../server/session.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["POST"]);
      assertSameOrigin(request);
      return Response.json(
        { authenticated: false },
        { headers: noStoreHeaders({ "Set-Cookie": deleteCookie(ADMIN_SESSION_COOKIE) }) },
      );
    } catch (error) {
      return errorResponse(error);
    }
  },
};
