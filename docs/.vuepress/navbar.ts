import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { navbar } from "vuepress-theme-hope";

import {
  advancedItemsSource,
  manualItemsSource,
  recipeItemsSource,
  startItemsSource,
  type NavbarDocItem,
} from "./navbar-source.js";

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const markdownTitle = (file: string): string => {
  const content = readFileSync(resolve(docsRoot, file), "utf8");
  const match = content.match(/^#\s+(.+)$/m);

  if (!match) {
    throw new Error(`Missing H1 title in docs/${file}`);
  }

  return match[1].trim();
};

const pageLink = (file: string): string =>
  `/${file}`.replace(/00-index\.md$/, "").replace(/\.md$/, ".md");

const docItems = (items: NavbarDocItem[]) =>
  items.map((item) => ({
    text: markdownTitle(item.file),
    icon: item.icon,
    link: pageLink(item.file),
  }));

const startItems = docItems(startItemsSource);
const advancedItems = docItems(advancedItemsSource);
const recipeItems = docItems(recipeItemsSource);
const manualItems = docItems(manualItemsSource);

const moreItems = [
  { text: "快速上手", icon: "rocket", link: "/start/" },
  { text: "进阶教程", icon: "book", link: "/advanced/" },
  { text: "实战案例", icon: "lightbulb", link: "/recipes/" },
  { text: "参考手册", icon: "gear", link: "/manual/" },
  { text: "社区共建", icon: "people", link: "/community/roadmap.md" },
  { text: "赞助商", icon: "star", link: "/sponsors/" },
];

const communityItems = [
  { text: "社区共建图", icon: "message", link: "/community/roadmap.md" },
  { text: "社区教程合集", icon: "book", link: "/community/tutorials.md" },
];

const publicSiteUrl = process.env.PUBLIC_SITE_URL?.trim();
const configuredCommunitySiteUrl = process.env.COMMUNITY_SITE_URL?.trim();
const isSeparateCommunitySite =
  configuredCommunitySiteUrl &&
  (!publicSiteUrl ||
    new URL(configuredCommunitySiteUrl).origin !== new URL(publicSiteUrl).origin);
const communityJoinLink = isSeparateCommunitySite
  ? new URL("/community/join", configuredCommunitySiteUrl).toString()
  : "/community/join.md";

export default navbar([
  { text: "首页", icon: "home", link: "/" },
  { text: "学习路线", icon: "map", link: "/guide/" },
  {
    text: "快速上手",
    icon: "rocket",
    link: "/start/",
    ariaLabel: "快速上手导航",
    children: startItems,
  },
  {
    text: "进阶教程",
    icon: "book",
    link: "/advanced/",
    ariaLabel: "进阶教程导航",
    children: advancedItems,
  },
  {
    text: "实战案例",
    icon: "lightbulb",
    link: "/recipes/",
    ariaLabel: "实战案例导航",
    children: recipeItems,
  },
  {
    text: "参考手册",
    icon: "gear",
    link: "/manual/",
    ariaLabel: "参考手册导航",
    children: manualItems,
  },
  {
    text: "赞助商",
    icon: "star",
    link: "/sponsors/",
    ariaLabel: "赞助商",
  },
  {
    text: "皮肤",
    icon: "palette",
    link: "https://theme.codexguide.ai/",
    ariaLabel: "CodexGuide 主题皮肤",
  },
  {
    text: "更多",
    icon: "more",
    ariaLabel: "更多导航",
    children: moreItems,
  },
  {
    text: "社区共建",
    icon: "people",
    link: "/community/roadmap.md",
    ariaLabel: "社区共建",
    children: communityItems,
  },
  {
    text: "交流群",
    icon: "message",
    link: communityJoinLink,
    ariaLabel: "交流群",
  },
]);
