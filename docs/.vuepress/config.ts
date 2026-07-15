import { existsSync, readFileSync, writeFileSync } from "node:fs";

import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";

import { getPageDescription, siteDescription, siteUrl, toSiteUrl } from "./seo.js";
import theme from "./theme.js";

const rewriteSitemapCleanUrlsPlugin = {
  name: "codexguide-clean-sitemap-urls",
  onGenerated: (app) => {
    const sitemapPath = app.dir.dest("sitemap.xml");

    if (!existsSync(sitemapPath)) return;

    const sitemap = readFileSync(sitemapPath, "utf-8");
    const escapedSiteUrl = siteUrl.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    const locationPattern = new RegExp(`<loc>(${escapedSiteUrl}[^<]*)<\\/loc>`, "gu");
    const cleanedSitemap = sitemap.replace(
      locationPattern,
      (_, url: string) => {
        const { pathname, search, hash } = new URL(url);

        return `<loc>${toSiteUrl(`${pathname}${search}${hash}`)}</loc>`;
      },
    );

    writeFileSync(sitemapPath, cleanedSitemap);
  },
};

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
          "CodexGuide,Codex 教程,Codex教程,OpenAI Codex 中文教程,Codex 使用教程,Codex CLI 教程,Codex 桌面 App,AGENTS.md,AI 编程,AI Agent,工作流,实战指南",
      },
    ],
    ["meta", { name: "theme-color", content: "#0f766e" }],
    ["meta", { name: "format-detection", content: "telephone=no" }],
    ["link", { rel: "icon", href: "https://cdn.canghecode.com/codexguide/docs/.vuepress/public/logo.svg", type: "image/svg+xml" }],
  ],

  plugins: [
    {
      name: "codexguide-seo-defaults",
      extendsPage: (page) => {
        page.frontmatter.description = getPageDescription(page.path);
      },
    },
    rewriteSitemapCleanUrlsPlugin,
  ],

  bundler: viteBundler(),

  theme,

  pagePatterns: ["**/*.md", "!.vuepress", "!node_modules"],

  shouldPrefetch: false,
  shouldPreload: false,
});
