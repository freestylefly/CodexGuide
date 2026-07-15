import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  findCurrentOrder: vi.fn(),
  getActiveGroupQr: vi.fn(),
}));

vi.mock("../server/db.js", () => dbMocks);

import handler from "../api/community/qr.js";
import { alipaySessionCookie, communitySessionCookie } from "../server/session.js";

const requestWithSession = (): Request => {
  const setCookie = communitySessionCookie("openid", "b".repeat(64));
  const cookieHeader = setCookie.split(";")[0];
  return new Request("https://codexguide.ai/api/community/qr", {
    headers: { Cookie: cookieHeader },
  });
};

const requestWithBothSessions = (): Request => {
  const alipay = alipaySessionCookie("a".repeat(64)).split(";")[0];
  const wechat = communitySessionCookie("openid", "b".repeat(64)).split(";")[0];
  return new Request("https://codexguide.ai/api/community/qr", {
    headers: { Cookie: `${alipay}; ${wechat}` },
  });
};

describe("protected group QR endpoint", () => {
  beforeEach(() => {
    process.env.COMMUNITY_SESSION_SECRET = "session-secret".repeat(4);
    dbMocks.findCurrentOrder.mockReset();
    dbMocks.getActiveGroupQr.mockReset();
  });

  it("rejects an unauthenticated request", async () => {
    const response = await handler.fetch(new Request("https://codexguide.ai/api/community/qr"));
    expect(response.status).toBe(401);
    expect(dbMocks.getActiveGroupQr).not.toHaveBeenCalled();
  });

  it("does not return the image to an unpaid buyer", async () => {
    dbMocks.findCurrentOrder.mockResolvedValue({ status: "PENDING" });
    const response = await handler.fetch(requestWithSession());
    expect(response.status).toBe(403);
    expect(dbMocks.getActiveGroupQr).not.toHaveBeenCalled();
  });

  it("returns the current private image only to a paid buyer", async () => {
    dbMocks.findCurrentOrder.mockResolvedValue({ status: "PAID" });
    dbMocks.getActiveGroupQr.mockResolvedValue({
      content_type: "image/png",
      image_base64: Buffer.from("private-qr").toString("base64"),
    });
    const response = await handler.fetch(requestWithSession());

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(await response.text()).toBe("private-qr");
  });

  it("keeps a paid WeChat entitlement when an unpaid Alipay cookie also exists", async () => {
    dbMocks.findCurrentOrder.mockImplementation(async (_buyerKey: string, provider: string) =>
      provider === "WECHAT" ? { status: "PAID" } : { status: "PENDING" },
    );
    dbMocks.getActiveGroupQr.mockResolvedValue({
      content_type: "image/png",
      image_base64: Buffer.from("private-qr").toString("base64"),
    });

    const response = await handler.fetch(requestWithBothSessions());

    expect(response.status).toBe(200);
    expect(dbMocks.findCurrentOrder).toHaveBeenCalledWith("a".repeat(64), "ALIPAY");
    expect(dbMocks.findCurrentOrder).toHaveBeenCalledWith("b".repeat(64), "WECHAT");
  });
});
