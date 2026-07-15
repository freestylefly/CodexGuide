import { adminLoginBucket } from "../../server/auth.js";
import { getAdminPasswordHash } from "../../server/config.js";
import { clearAdminLoginAttempts, consumeAdminLoginAttempt } from "../../server/db.js";
import { AppError, errorResponse } from "../../server/errors.js";
import { assertMethod, assertSameOrigin, noStoreHeaders, parseJson } from "../../server/http.js";
import { verifyScryptPassword } from "../../server/security.js";
import { adminSessionCookie } from "../../server/session.js";

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["POST"]);
      assertSameOrigin(request);
      const body = await parseJson<{ password?: unknown }>(request);
      const password = typeof body.password === "string" ? body.password : "";
      const bucket = adminLoginBucket(request);
      const attempts = await consumeAdminLoginAttempt(bucket);

      if (attempts > 5) {
        throw new AppError(429, "too_many_attempts", "登录尝试过多，请 15 分钟后重试。" );
      }

      if (password.length > 256 || !verifyScryptPassword(password, getAdminPasswordHash())) {
        throw new AppError(401, "invalid_credentials", "管理员密码错误。" );
      }

      await clearAdminLoginAttempts(bucket);
      const headers = noStoreHeaders({ "Set-Cookie": adminSessionCookie() });
      return Response.json({ authenticated: true }, { headers });
    } catch (error) {
      return errorResponse(error);
    }
  },
};
