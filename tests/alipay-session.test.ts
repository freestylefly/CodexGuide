import { beforeEach, describe, expect, it } from "vitest";

import handler from "../api/auth/alipay/session.js";
import { readAlipaySession } from "../server/session.js";

describe("Alipay browser session", () => {
  beforeEach(() => {
    process.env.COMMUNITY_BUYER_HMAC_SECRET = "buyer-secret".repeat(4);
    process.env.COMMUNITY_SESSION_SECRET = "session-secret".repeat(4);
  });

  it("creates a signed HttpOnly session without exposing the buyer key", async () => {
    const response = await handler.fetch(
      new Request("https://codexguide.ai/api/auth/alipay/session"),
    );
    const setCookie = response.headers.get("set-cookie") || "";
    expect(response.status).toBe(200);
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");

    const request = new Request("https://codexguide.ai/api/community/status", {
      headers: { Cookie: setCookie.split(";")[0] },
    });
    const session = readAlipaySession(request);
    expect(session?.buyerKey).toMatch(/^[a-f0-9]{64}$/u);
    expect(setCookie).not.toContain(session!.buyerKey);
  });
});
