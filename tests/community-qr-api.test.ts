import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  findCurrentOrder: vi.fn(),
  getActiveGroupQr: vi.fn(),
}));

vi.mock("../server/db.js", () => dbMocks);

import handler from "../api/community/qr.js";
import { communitySessionCookie } from "../server/session.js";

const requestWithSession = (): Request => {
  const setCookie = communitySessionCookie("openid", "b".repeat(64));
  const cookieHeader = setCookie.split(";")[0];
  return new Request("https://codexguide.ai/api/community/qr", {
    headers: { Cookie: cookieHeader },
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
});
