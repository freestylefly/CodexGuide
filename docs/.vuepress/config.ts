import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  dest: "docs/.vuepress/dist",
  lang: "zh-CN",
  title: "CodexGuide",
  description: "面向全球初学者、创作者、开发者与团队的 Codex 实践指南。",

  head: [
    ["meta", { name: "robots", content: "all" }],
    ["meta", { name: "author", content: "canghe" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "CodexGuide,Codex,OpenAI Codex,Codex CLI,AGENTS.md,AI 编程,AI Agent,工作流,实践指南,Codex guide",
      },
    ],
    ["meta", { property: "og:site_name", content: "CodexGuide" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh_CN" }],
    ["meta", { property: "og:url", content: "https://codexguide.ai/" }],
    ["meta", { property: "og:title", content: "CodexGuide" }],
    [
      "meta",
      {
        property: "og:description",
        content: "面向全球初学者、创作者、开发者与团队的 Codex 实践指南。",
      },
    ],
    ["meta", { property: "og:image", content: "https://codexguide.ai/og.svg" }],
    ["meta", { name: "theme-color", content: "#0f766e" }],
    ["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
  ],

  bundler: viteBundler(),

  theme,

  pagePatterns: ["**/*.md", "!.vuepress", "!node_modules"],

  shouldPrefetch: false,
  shouldPreload: false,
});
