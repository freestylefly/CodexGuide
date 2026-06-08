import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import { getPageDescription, siteOgImage, siteUrl, toSiteUrl } from "./seo.js";
import sidebar from "./sidebar/index.js";

const addMeta = (
  head: unknown[][],
  attribute: "name" | "property",
  name: string,
  content: string,
): void => {
  if (head.some(([tag, attrs]) => tag === "meta" && attrs?.[attribute] === name)) return;
  head.push(["meta", { [attribute]: name, content }]);
};

export default hopeTheme({
  hostname: `${siteUrl}/`,
  logo: "/logo.svg",
  favicon: "/logo.svg",

  author: {
    name: "canghe",
    url: "https://github.com/freestylefly",
  },

  repo: "https://github.com/freestylefly/CodexGuide",
  docsDir: "docs",

  navbar,
  sidebar,

  print: false,
  pure: true,
  focus: false,
  breadcrumb: true,
  displayFooter: true,
  footer: "MIT Licensed | Copyright © 2026 canghe",
  pageInfo: ["Author", "Category", "Tag", "Date", "Original", "Word", "ReadingTime"],

  blog: false,

  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    gfm: true,
    mark: true,
    imgLazyload: true,
    tasklist: true,
    tabs: true,
  },

  plugins: {
    copyCode: true,
    icon: {
      assets: "/vendor/iconify-icon/index.js",
    },
    copyright: {
      author: "CodexGuide(codexguide.ai)",
      license: "MIT",
      triggerLength: 100,
      maxLength: 700,
      canonical: "https://codexguide.ai/",
      global: true,
    },
    feed: {
      atom: true,
      json: true,
      rss: true,
    },
    seo: {
      fallBackImage: siteOgImage,
      canonical: (page) => toSiteUrl(page.path),
      ogp: (ogp, page) => ({
        ...ogp,
        "og:description": getPageDescription(page.path),
        "og:image": page.frontmatter.cover || page.frontmatter.banner ? ogp["og:image"] : siteOgImage,
        "og:image:alt": `${page.title} - CodexGuide`,
        "og:locale": "zh_CN",
      }),
      jsonLd: (jsonLD, page) => ({
        ...jsonLD,
        description: getPageDescription(page.path),
        url: toSiteUrl(page.path),
        image: [siteOgImage],
        inLanguage: "zh-CN",
        isPartOf: {
          "@type": "WebSite",
          name: "CodexGuide",
          url: `${siteUrl}/`,
        },
        publisher: {
          "@type": "Organization",
          name: "CodexGuide",
          url: `${siteUrl}/`,
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/logo.svg`,
          },
        },
      }),
      customHead: (head, page) => {
        const description = getPageDescription(page.path);
        const title = `${page.title} | CodexGuide`;

        addMeta(head, "name", "twitter:card", "summary_large_image");
        addMeta(head, "name", "twitter:title", title);
        addMeta(head, "name", "twitter:description", description);
        addMeta(head, "name", "twitter:image", siteOgImage);
        addMeta(head, "name", "twitter:image:alt", `${page.title} - CodexGuide`);
      },
    },
    sitemap: {
      hostname: `${siteUrl}/`,
      changefreq: "weekly",
      excludePaths: ["/404.html", "/guide/", "/community/"],
    },
    slimsearch: {
      maxSuggestions: 10,
      locales: {
        "/": {
          placeholder: "搜索 CodexGuide",
        },
      },
    },
  },
});
