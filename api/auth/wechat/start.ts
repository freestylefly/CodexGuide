import { randomToken } from "../../../server/security.js";
import { errorResponse } from "../../../server/errors.js";
import { assertMethod } from "../../../server/http.js";
import { oauthStateCookie } from "../../../server/session.js";
import { buildWechatOAuthUrl } from "../../../server/wechat-oauth.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["GET"]);
      const url = new URL(request.url);
      const returnTo = url.searchParams.get("returnTo") === "/community/join" ? "/community/join" : "/community/join";
      const nonce = randomToken();
      const state = { type: "oauth-state" as const, nonce, returnTo, exp: Date.now() + 10 * 60 * 1000 };
      const headers = new Headers({ Location: buildWechatOAuthUrl(nonce) });
      headers.append("Set-Cookie", oauthStateCookie(state));
      headers.set("Cache-Control", "no-store");

      return new Response(null, { status: 302, headers });
    } catch (error) {
      return errorResponse(error);
    }
  },
};
