import { defineClientConfig } from "vuepress/client";

const analyticsHosts = new Set(["codexguide.ai", "www.codexguide.ai"]);

export default defineClientConfig({
  enhance: () => {
    if (
      import.meta.env.PROD &&
      typeof window !== "undefined" &&
      analyticsHosts.has(window.location.hostname)
    ) {
      void import("@vercel/analytics").then(({ inject }) => {
        inject();
      });
    }
  },
});
