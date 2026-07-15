import { inject } from "@vercel/analytics";
import { defineClientConfig } from "vuepress/client";

import PaidCommunity from "./components/PaidCommunity.vue";
import PaidCommunityAdmin from "./components/PaidCommunityAdmin.vue";
import PaidCommunityResult from "./components/PaidCommunityResult.vue";

const analyticsHosts = new Set(["codexguide.ai", "www.codexguide.ai"]);

const navbarDropdownLinks: Record<string, string> = {
  快速上手导航: "/start/",
  进阶教程导航: "/advanced/",
  实战案例导航: "/recipes/",
  参考手册导航: "/manual/",
  社区共建: "/community/roadmap.html",
};

const legacySectionPaths: Record<string, string> = {
  "/guide": "/guide/",
  "/guide.html": "/guide/",
  "/start": "/start/",
  "/start.html": "/start/",
  "/advanced": "/advanced/",
  "/advanced.html": "/advanced/",
  "/recipes": "/recipes/",
  "/recipes.html": "/recipes/",
  "/manual": "/manual/",
  "/manual.html": "/manual/",
  "/sponsors": "/sponsors/",
  "/sponsors.html": "/sponsors/",
};

const normalizeLegacySectionPath = (): void => {
  const target = legacySectionPaths[window.location.pathname];

  if (!target) return;

  window.history.replaceState(
    window.history.state,
    "",
    `${target}${window.location.search}${window.location.hash}`,
  );
};

if (typeof window !== "undefined") {
  normalizeLegacySectionPath();
}

export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("PaidCommunity", PaidCommunity);
    app.component("PaidCommunityAdmin", PaidCommunityAdmin);
    app.component("PaidCommunityResult", PaidCommunityResult);

    if (typeof window !== "undefined") {
      document.addEventListener("click", (event) => {
        if (event.detail === 0) return;

        const target = event.target as Element | null;
        if (target?.closest(".vp-dropdown")) return;

        const button = target?.closest<HTMLButtonElement>(".vp-dropdown-title");
        const link = button ? navbarDropdownLinks[button.getAttribute("aria-label") ?? ""] : null;

        if (link) window.location.assign(link);
      });
    }

    if (
      import.meta.env.PROD &&
      typeof window !== "undefined" &&
      analyticsHosts.has(window.location.hostname)
    ) {
      inject();
    }
  },
});
