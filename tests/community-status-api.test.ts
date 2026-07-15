import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  findCurrentOrder: vi.fn(),
  hasActiveGroupQr: vi.fn(),
}));

vi.mock("../server/db.js", () => dbMocks);

import handler from "../api/community/status.js";
import { alipaySessionCookie, communitySessionCookie } from "../server/session.js";

const cookies = (): string => {
  const alipay = alipaySessionCookie("a".repeat(64)).split(";")[0];
  const wechat = communitySessionCookie("openid", "b".repeat(64)).split(";")[0];
  return `${alipay}; ${wechat}`;
};

describe("community status endpoint", () => {
  beforeEach(() => {
    process.env.COMMUNITY_SESSION_SECRET = "session-secret".repeat(4);
    dbMocks.findCurrentOrder.mockReset();
    dbMocks.hasActiveGroupQr.mockReset();
    dbMocks.hasActiveGroupQr.mockResolvedValue(true);
  });

  it("exposes only the Alipay session bootstrap to unauthenticated users", async () => {
    const response = await handler.fetch(
      new Request("https://codexguide.canghecode.com/api/community/status"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.sessionUrl).toBe("/api/auth/alipay/session");
    expect(body.authUrl).toBeUndefined();
  });

  it("prefers a paid legacy WeChat entitlement over an unpaid Alipay order", async () => {
    dbMocks.findCurrentOrder.mockImplementation(async (_buyerKey: string, provider: string) =>
      provider === "WECHAT"
        ? { id: "wechat-paid", payment_provider: "WECHAT", status: "PAID" }
        : { id: "alipay-pending", payment_provider: "ALIPAY", status: "PENDING" },
    );

    const response = await handler.fetch(
      new Request("https://codexguide.canghecode.com/api/community/status", {
        headers: { Cookie: cookies() },
      }),
    );
    const body = await response.json();

    expect(body.eligible).toBe(true);
    expect(body.orderId).toBe("wechat-paid");
    expect(body.paymentProvider).toBe("WECHAT");
  });
});
