import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/guide/": [
    {
      text: "学习路线",
      icon: "map",
      prefix: "/guide/",
      children: ["index.md"],
    },
  ],

  "/start/": [
    {
      text: "快速上手",
      icon: "rocket",
      prefix: "/start/",
      children: [
        "00-index.md",
        "01-what-is-codex.md",
        "02-app-installation.md",
        "03-account-plan.md",
        "04-third-party-api.md",
        "05-app-overview.md",
        "06-first-task.md",
        "07-task-design.md",
        "08-task-execution.md",
        "09-mobile-control.md",
      ],
    },
    {
      text: "给开发者",
      icon: "code",
      prefix: "/start/",
      children: [
        "10-cli-installation.md",
        "11-cli-first-run.md",
        "12-cli-options.md",
        "13-ide-vscode.md",
        "14-cloud.md",
      ],
    },
  ],

  "/advanced/": [
    {
      text: "进阶教程",
      icon: "book",
      prefix: "/advanced/",
      children: [
        "00-index.md",
        "01-cost-context.md",
        "02-agents-md.md",
        "03-skills-plugins-mcp.md",
        "04-permissions-security.md",
        "05-automation.md",
        "06-hooks.md",
        "07-sandbox-approvals.md",
        "08-thread-management.md",
        "09-config-toml.md",
        "10-team-playbook.md",
        "11-troubleshooting.md",
      ],
    },
  ],

  "/recipes/": [
    {
      text: "实战案例",
      icon: "lightbulb",
      prefix: "/recipes/",
      children: [
        "00-index.md",
        "01-ppt-skill-walkthrough.md",
        "02-drawio-mcp.md",
        "03-playwright-mcp.md",
        "04-hyperframes-animation.md",
        "05-obsidian-codex.md",
        "06-feishu-cli-codex.md",
        "07-llm-wiki-codex.md",
        "08-figma-mcp-codex.md",
        "09-notion-mcp-codex.md",
        "10-dkfile-deploy-codex.md",
        "11-remote-bug-fix.md",
        "12-chrome-browser-plugin.md",
        "13-github-actions-ci-fix.md",
        "14-clinical-literature-review.md",
        "15-hatch-pet-photo.md",
        "16-android-remote-control.md",
        "17-desktop-pet.md",
        "18-codex-profiles.md",
      ],
    },
  ],

  "/manual/": [
    {
      text: "参考手册",
      icon: "gear",
      prefix: "/manual/",
      children: ["00-index.md", "01-codex-updates.md", "02-credits.md"],
    },
  ],

  "/community/": [
    {
      text: "社区共建",
      icon: "people",
      prefix: "/community/",
      children: ["roadmap.md", "tutorials.md"],
    },
  ],

  "/sponsors/": [
    {
      text: "赞助商",
      icon: "star",
      prefix: "/sponsors/",
      children: ["00-index.md"],
    },
  ],

  "/": [
    {
      text: "CodexGuide",
      icon: "home",
      children: [
        "/guide/",
        "/start/",
        "/advanced/",
        "/recipes/",
        "/manual/",
        "/community/roadmap.md",
        "/sponsors/",
      ],
    },
  ],
});
