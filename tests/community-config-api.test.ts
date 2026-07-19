import { afterEach, describe, expect, it } from "vitest";

import handler from "../api/community/config.js";
import {
  requireCommunityPaymentEnabled,
  requireCommunitySiteOrigin,
} from "../server/payment-availability.js";

const originalEnvironment = { ...process.env };

describe("community production runtime configuration", () => {
  afterEach(() => {
    process.env = { ...originalEnvironment };
  });

  it("separates the documentation origin from the payment origin", async () => {
    process.env.PUBLIC_SITE_URL = "https://codexguide.ai";
    process.env.COMMUNITY_SITE_URL = "https://codexguide.canghecode.com";
    process.env.COMMUNITY_PAYMENT_ENABLED = "false";

    const response = await handler.fetch(
      new Request("https://codexguide.ai/api/community/config"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.communityOrigin).toBe("https://codexguide.canghecode.com");
    expect(body.paymentEnabled).toBe(false);
    expect(body.priceCents).toBe(990);
  });

  it("blocks new payments until the rollout switch is enabled", () => {
    process.env.COMMUNITY_PAYMENT_ENABLED = "false";
    expect(() => requireCommunityPaymentEnabled()).toThrow("尚未开放");

    process.env.COMMUNITY_PAYMENT_ENABLED = "true";
    expect(() => requireCommunityPaymentEnabled()).not.toThrow();
  });

  it("accepts payment creation only on the canonical community origin", () => {
    process.env.COMMUNITY_SITE_URL = "https://pay.example.com";

    expect(() =>
      requireCommunitySiteOrigin(new Request("https://pay.example.com/api/alipay/order")),
    ).not.toThrow();
    expect(() =>
      requireCommunitySiteOrigin(new Request("https://codexguide.ai/api/alipay/order")),
    ).toThrow("正式交流群页面");
  });
});
