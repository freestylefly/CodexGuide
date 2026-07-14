import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  getActiveGroupQr: vi.fn(),
  replaceActiveGroupQr: vi.fn(),
}));

vi.mock("../server/db.js", () => dbMocks);

import handler from "../api/admin/group-qr.js";
import { adminSessionCookie } from "../server/session.js";

const adminCookie = (): string => adminSessionCookie().split(";")[0];

describe("group QR administrator endpoint", () => {
  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = "admin-session-secret".repeat(3);
    dbMocks.getActiveGroupQr.mockReset();
    dbMocks.replaceActiveGroupQr.mockReset();
  });

  it("requires an administrator session", async () => {
    const response = await handler.fetch(new Request("https://codexguide.ai/api/admin/group-qr"));
    expect(response.status).toBe(401);
  });

  it("returns the current image without public caching", async () => {
    dbMocks.getActiveGroupQr.mockResolvedValue({
      content_type: "image/webp",
      image_base64: Buffer.from("current-qr").toString("base64"),
    });
    const response = await handler.fetch(
      new Request("https://codexguide.ai/api/admin/group-qr", {
        headers: { Cookie: adminCookie() },
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(await response.text()).toBe("current-qr");
  });

  it("sniffs and replaces an uploaded image atomically", async () => {
    const png = Buffer.alloc(256);
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png);
    const form = new FormData();
    form.append("groupQr", new File([png], "group.png", { type: "text/plain" }));
    dbMocks.replaceActiveGroupQr.mockResolvedValue(7);

    const response = await handler.fetch(
      new Request("https://codexguide.ai/api/admin/group-qr", {
        method: "POST",
        headers: { Cookie: adminCookie(), Origin: "https://codexguide.ai" },
        body: form,
      }),
    );

    expect(response.status).toBe(200);
    expect(dbMocks.replaceActiveGroupQr).toHaveBeenCalledWith(
      "image/png",
      expect.any(Buffer),
    );
  });
});
