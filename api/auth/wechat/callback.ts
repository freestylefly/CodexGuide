import { buyerKeyForOpenid } from "../../../server/auth.js";
import { AppError, errorResponse } from "../../../server/errors.js";
import { assertMethod, deleteCookie } from "../../../server/http.js";
import {
  COMMUNITY_SESSION_COOKIE,
  OAUTH_STATE_COOKIE,
  communitySessionCookie,
  readOAuthState,
} from "../../../server/session.js";
import { exchangeWechatOAuthCode } from "../../../server/wechat-oauth.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["GET"]);
      const url = new URL(request.url);
      const code = url.searchParams.get("code") || "";
      const returnedState = url.searchParams.get("state") || "";
      const state = readOAuthState(request);

      if (!code || !state || state.nonce !== returnedState) {
        throw new AppError(400, "invalid_oauth_state", "微信授权状态已失效，请重新扫码。" );
      }

      const openid = await exchangeWechatOAuthCode(code);
      const buyerKey = buyerKeyForOpenid(openid);
      const headers = new Headers({ Location: state.returnTo });
      headers.append("Set-Cookie", communitySessionCookie(openid, buyerKey));
      headers.append("Set-Cookie", deleteCookie(OAUTH_STATE_COOKIE));
      headers.set("Cache-Control", "no-store");

      return new Response(null, { status: 302, headers });
    } catch (error) {
      const response = errorResponse(error);
      const headers = new Headers(response.headers);
      headers.append("Set-Cookie", deleteCookie(COMMUNITY_SESSION_COOKIE));
      headers.append("Set-Cookie", deleteCookie(OAUTH_STATE_COOKIE));
      return new Response(response.body, { status: response.status, headers });
    }
  },
};
