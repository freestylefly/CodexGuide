import { errorResponse } from "../../server/errors.js";
import { assertMethod, noStoreHeaders } from "../../server/http.js";
import { readAdminSession } from "../../server/session.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["GET"]);
      return Response.json(
        { authenticated: Boolean(readAdminSession(request)) },
        { headers: noStoreHeaders() },
      );
    } catch (error) {
      return errorResponse(error);
    }
  },
};
