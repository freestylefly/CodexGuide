import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";

import { getPageDescription, siteDescription } from "./seo.js";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  dest: "docs/.vuepress/dist",
  lang: "zh-CN",
  title: "CodexGuide",
  description: siteDescription,

  head: [
    ["meta", { name: "robots", content: "index,follow,max-image-preview:large" }],
    ["meta", { name: "author", content: "canghe" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "CodexGuide,Codex,OpenAI Codex,Codex CLI,AGENTS.md,AI 编程,AI Agent,工作流,实践指南,Codex guide",
      },
    ],
    ["meta", { name: "theme-color", content: "#0f766e" }],
    ["meta", { name: "format-detection", content: "telephone=no" }],
    ["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
    ["link", { rel: "preload", href: "/images/home-hero-background.webp", as: "image", fetchpriority: "high" }],
  ],

  plugins: [
    {
      name: "codexguide-seo-defaults",
      extendsPage: (page) => {
        if (!page.frontmatter.description) {
          page.frontmatter.description = getPageDescription(page.path);
        }
      },
    },
  ],

  bundler: viteBundler(),

  theme,

  pagePatterns: ["**/*.md", "!.vuepress", "!node_modules"],

  shouldPrefetch: false,
  shouldPreload: false,
});
