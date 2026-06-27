import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/guide/": [
    { text: "学习路线", icon: "map", link: "/guide/00-overview.md" },
    {
      text: "入门准备",
      icon: "desktop",
      prefix: "/guide/",
      collapsible: true,
      expanded: false,
      children: [
        { text: "01 桌面 App 安装", link: "01-app-installation.md" },
        { text: "02 订阅 Plus", link: "02-subscribe-plus.md" },
        { text: "03 桌面 App 总览", link: "03-app-overview.md" },
        { text: "04 手机端协同", link: "04-mobile-control-desktop.md" },
        { text: "05 连接第三方 API", link: "05-third-party-api.md" },
        { text: "06 第一个任务", link: "06-app-first-task.md" },
        { text: "07 理解费用", link: "07-understanding-costs.md" },
      ],
    },
    {
      text: "日常工作流",
      icon: "tool",
      prefix: "/guide/",
      collapsible: true,
      expanded: false,
      children: [
        { text: "08 任务执行", link: "08-task-execution.md" },
        { text: "09 权限管理", link: "09-permissions.md" },
        { text: "10 技能与插件", link: "10-skills-plugins.md" },
        { text: "11 自动化", link: "11-automation.md" },
        { text: "12 桌面宠物", link: "12-desktop-pet.md" },
      ],
    },
    {
      text: "CLI 与 IDE",
      icon: "terminal",
      prefix: "/guide/",
      collapsible: true,
      expanded: false,
      children: [
        { text: "13 CLI 安装与登录", link: "13-cli-installation.md" },
        { text: "14 CLI 改代码", link: "14-cli-first-run.md" },
        { text: "15 VS Code 插件", link: "15-ide-vscode.md" },
      ],
    },
    {
      text: "进阶与团队",
      icon: "rocket",
      prefix: "/guide/",
      collapsible: true,
      expanded: false,
      children: [
        { text: "16 AGENTS.md", link: "16-agents-md.md" },
        { text: "17 沙盒与审批", link: "17-sandbox-approvals.md" },
        { text: "18 自动线程管理", link: "18-thread-management.md" },
        { text: "19 Codex Cloud", link: "19-cloud-ide-app.md" },
        { text: "20 Hooks", link: "20-hooks.md" },
        { text: "21 排障手册", link: "21-troubleshooting.md" },
      ],
    },
  ],

  "/recipes/": [
    {
      text: "实战案例",
      icon: "lightbulb",
      prefix: "/recipes/",
      children: [
        { text: "案例总览", link: "index.md" },
        { text: "01 Codex × PPT Skill：一句话生成演示文稿", link: "ppt-skill-walkthrough.md" },
        { text: "02 Codex × Draw.io MCP：AI 自动绘制架构图", link: "drawio-mcp.md" },
        { text: "03 Codex × Playwright MCP：让 AI 操控浏览器", link: "playwright-mcp.md" },
        { text: "04 Codex × HyperFrames：用代码生成动画视频", link: "hyperframes-animation.md" },
        { text: "05 Codex × Obsidian：在知识库中自动生成配图", link: "obsidian-codex.md" },
        { text: "06 Codex × 飞书 CLI：一句话处理飞书数据", link: "feishu-cli-codex.md" },
        { text: "07 Codex × LLM Wiki：在 Obsidian 中搭建 AI 知识库", link: "llm-wiki-codex.md" },
        { text: "08 Codex × Figma MCP：读懂设计稿", link: "figma-mcp-codex.md" },
        { text: "09 Codex × Notion MCP：打通知识空间", link: "notion-mcp-codex.md" },
        { text: "10 Codex × DKFile：网页一键发布到公网", link: "dkfile-deploy-codex.md" },
        { text: "11 Codex × 云服务器：远程定位并修复 Bug", link: "remote-bug-fix.md" },
        { text: "12 Codex × Chrome：让 AI 直接控制浏览器", link: "chrome-browser-plugin.md" },
        { text: "13 Codex × GitHub Actions：CI 失败自动修复", link: "github-actions-ci-fix.md" },
        { text: "14 Codex × 临床文献综述：把医学问题整理成证据表", link: "clinical-literature-review.md" },
        { text: "15 Codex × Hatch Pet：用一张照片生成专属宠物", link: "hatch-pet-photo.md" },
        { text: "16 Codex × 安卓手机：扫码连接，远程操控", link: "android-remote-control.md" },
        { text: "参考来源与致谢", link: "credits.md" },
      ],
    },
  ],

  "/platform/": [
    {
      text: "入口地图",
      icon: "layout",
      prefix: "/platform/",
      children: ["index.md", "cli.md", "app.md", "cloud.md", "ide.md", "chatgpt.md"],
    },
  ],

  "/configuration/": [
    {
      text: "配置与扩展",
      icon: "gear",
      prefix: "/configuration/",
      children: [
        "index.md",
        "cli-options.md",
        "config-file.md",
      ],
    },
  ],

  "/practice/": [
    {
      text: "实践方法",
      icon: "tool",
      prefix: "/practice/",
      children: ["index.md", "task-design.md", "non-dev-workflows.md", "team-playbook.md"],
    },
  ],

  "/reference/": [
    {
      text: "资料索引",
      icon: "link",
      prefix: "/reference/",
      children: ["index.md", "codex-updates.md"],
    },
  ],

  "/community/": [
    {
      text: "社区共建",
      icon: "people",
      prefix: "/community/",
      children: ["roadmap.md"],
    },
  ],

  "/": [
    {
      text: "CodexGuide",
      icon: "home",
      children: [
        "/guide/00-overview.md",
        "/guide/01-app-installation.md",
        "/guide/04-mobile-control-desktop.md",
        "/guide/05-third-party-api.md",
        "/guide/06-app-first-task.md",
        "/guide/07-understanding-costs.md",
        "/platform/",
        "/configuration/",
        "/practice/",
        "/recipes/",
        "/reference/",
        "/community/roadmap.md",
      ],
    },
  ],
});
