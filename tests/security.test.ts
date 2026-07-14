import { describe, expect, it } from "vitest";

import {
  createScryptPasswordHash,
  hashBuyer,
  seal,
  unseal,
  validateGroupQrImage,
  verifyScryptPassword,
} from "../server/security.js";

describe("session security", () => {
  it("round-trips an encrypted payload and rejects tampering", () => {
    const secret = "a".repeat(64);
    const token = seal(
      { type: "community", exp: Date.now() + 60_000, buyerKey: "buyer" },
      secret,
    );

    expect(unseal(token, secret, "community")).toMatchObject({ buyerKey: "buyer" });
    const parts = token.split(".");
    parts[1] = `${parts[1][0] === "A" ? "B" : "A"}${parts[1].slice(1)}`;
    expect(unseal(parts.join("."), secret, "community")).toBeNull();
    expect(unseal(token, secret, "admin")).toBeNull();
  });

  it("rejects expired payloads", () => {
    const token = seal({ type: "community", exp: Date.now() - 1 }, "secret");
    expect(unseal(token, "secret", "community")).toBeNull();
  });

  it("hashes buyers without exposing the openid", () => {
    const first = hashBuyer("openid-123", "secret-a");
    expect(first).toHaveLength(64);
    expect(first).toBe(hashBuyer("openid-123", "secret-a"));
    expect(first).not.toBe(hashBuyer("openid-123", "secret-b"));
    expect(first).not.toContain("openid");
  });
});

describe("administrator password hashing", () => {
  it("verifies scrypt hashes in constant-length form", () => {
    const stored = createScryptPasswordHash("correct horse battery staple");
    expect(verifyScryptPassword("correct horse battery staple", stored)).toBe(true);
    expect(verifyScryptPassword("wrong password", stored)).toBe(false);
  });
});

describe("group QR validation", () => {
  it("detects supported image signatures instead of trusting MIME metadata", () => {
    const png = Buffer.alloc(256);
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png);
    expect(validateGroupQrImage(png).contentType).toBe("image/png");

    const jpeg = Buffer.alloc(256);
    Buffer.from([0xff, 0xd8, 0xff]).copy(jpeg);
    expect(validateGroupQrImage(jpeg).contentType).toBe("image/jpeg");

    const webp = Buffer.alloc(256);
    webp.write("RIFF", 0, "ascii");
    webp.write("WEBP", 8, "ascii");
    expect(validateGroupQrImage(webp).contentType).toBe("image/webp");
  });

  it("rejects unsupported and oversized payloads", () => {
    expect(() => validateGroupQrImage(Buffer.alloc(256))).toThrow("只支持");

    const oversized = Buffer.alloc(2 * 1024 * 1024 + 1);
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(oversized);
    expect(() => validateGroupQrImage(oversized)).toThrow("2 MB");
  });
});
