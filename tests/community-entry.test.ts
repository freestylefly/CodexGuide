import { describe, expect, it } from "vitest";

import {
  COMMUNITY_JOIN_PATH,
  COMMUNITY_PAY_PATH,
  normalizeCommunityReturnTo,
} from "../server/community-entry.js";

describe("community entry routing", () => {
  it("allows only the introduction and direct payment return paths", () => {
    expect(normalizeCommunityReturnTo(COMMUNITY_JOIN_PATH)).toBe(COMMUNITY_JOIN_PATH);
    expect(normalizeCommunityReturnTo(COMMUNITY_PAY_PATH)).toBe(COMMUNITY_PAY_PATH);
  });

  it("falls back safely instead of accepting an open redirect", () => {
    expect(normalizeCommunityReturnTo(null)).toBe(COMMUNITY_JOIN_PATH);
    expect(normalizeCommunityReturnTo("https://attacker.example/path")).toBe(COMMUNITY_JOIN_PATH);
    expect(normalizeCommunityReturnTo("//attacker.example/path")).toBe(COMMUNITY_JOIN_PATH);
    expect(normalizeCommunityReturnTo("/community/pay?next=https://attacker.example")).toBe(
      COMMUNITY_JOIN_PATH,
    );
  });
});
