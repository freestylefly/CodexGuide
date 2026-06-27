import { navbar } from "vuepress-theme-hope";

const configurationItems = [
  { text: "配置总览", icon: "map", link: "/configuration/" },
  { text: "CLI 选项与命令", icon: "terminal", link: "/configuration/cli-options.md" },
  { text: "config.toml", icon: "config", link: "/configuration/config-file.md" },
];

const resourceItems = [
  { text: "实践方法", icon: "tool", link: "/practice/" },
  { text: "官方资料", icon: "link", link: "/reference/" },
  { text: "近期Codex更新", icon: "time", link: "/reference/codex-updates.md" },
  { text: "共建路线图", icon: "people", link: "/community/roadmap.md" },
];

const guideItems = [
  { text: "01 Codex 桌面 App 下载与安装", icon: "desktop", link: "/guide/01-app-installation.md" },
  { text: "02 订阅 ChatGPT Plus", icon: "star", link: "/guide/02-subscribe-plus.md" },
  { text: "03 了解 Codex 桌面 App", icon: "layout", link: "/guide/03-app-overview.md" },
  { text: "04 手机端协同桌面任务", icon: "mobile", link: "/guide/04-mobile-control-desktop.md" },
  { text: "05 连接第三方 API", icon: "link", link: "/guide/05-third-party-api.md" },
  { text: "06 用 Codex 完成第一个任务", icon: "code", link: "/guide/06-app-first-task.md" },
  { text: "07 理解费用", icon: "coins", link: "/guide/07-understanding-costs.md" },
  { text: "08 任务顺序执行与并行", icon: "list", link: "/guide/08-task-execution.md" },
  { text: "09 权限管理", icon: "safe", link: "/guide/09-permissions.md" },
  { text: "10 技能与插件", icon: "plugin", link: "/guide/10-skills-plugins.md" },
  { text: "11 自动化", icon: "time", link: "/guide/11-automation.md" },
  { text: "12 桌面宠物", icon: "cat", link: "/guide/12-desktop-pet.md" },
  { text: "13 CLI 安装与登录", icon: "download", link: "/guide/13-cli-installation.md" },
  { text: "14 第一次让 Codex 改代码", icon: "edit", link: "/guide/14-cli-first-run.md" },
  { text: "15 在 VS Code 中使用 Codex", icon: "code", link: "/guide/15-ide-vscode.md" },
  { text: "16 AGENTS.md", icon: "file", link: "/guide/16-agents-md.md" },
  { text: "17 沙盒与审批", icon: "lock", link: "/guide/17-sandbox-approvals.md" },
  { text: "18 自动线程管理", icon: "branch", link: "/guide/18-thread-management.md" },
  { text: "19 Codex Cloud：使用云端模式", icon: "cloud", link: "/guide/19-cloud-ide-app.md" },
  { text: "20 Hooks", icon: "tool", link: "/guide/20-hooks.md" },
  { text: "21 排障手册", icon: "debug", link: "/guide/21-troubleshooting.md" },
];

const recipeItems = [
  { text: "案例总览", icon: "layout", link: "/recipes/" },
  { text: "01 Codex × PPT Skill：一句话生成演示文稿", icon: "slides", link: "/recipes/ppt-skill-walkthrough.md" },
  { text: "02 Codex × Draw.io MCP：AI 自动绘制架构图", icon: "diagram", link: "/recipes/drawio-mcp.md" },
  { text: "03 Codex × Playwright MCP：让 AI 操控浏览器", icon: "chrome", link: "/recipes/playwright-mcp.md" },
  { text: "04 Codex × HyperFrames：用代码生成动画视频", icon: "video", link: "/recipes/hyperframes-animation.md" },
  { text: "05 Codex × Obsidian：在知识库中自动生成配图", icon: "edit", link: "/recipes/obsidian-codex.md" },
  { text: "06 Codex × 飞书 CLI：一句话处理飞书数据", icon: "message", link: "/recipes/feishu-cli-codex.md" },
  { text: "07 Codex × LLM Wiki：在 Obsidian 中搭建 AI 知识库", icon: "note", link: "/recipes/llm-wiki-codex.md" },
  { text: "08 Codex × Figma MCP：读懂设计稿", icon: "palette", link: "/recipes/figma-mcp-codex.md" },
  { text: "09 Codex × Notion MCP：打通知识空间", icon: "note", link: "/recipes/notion-mcp-codex.md" },
  { text: "10 Codex × DKFile：网页一键发布到公网", icon: "launch", link: "/recipes/dkfile-deploy-codex.md" },
  { text: "11 Codex × 云服务器：远程定位并修复 Bug", icon: "server", link: "/recipes/remote-bug-fix.md" },
  { text: "12 Codex × Chrome：让 AI 直接控制浏览器", icon: "chrome", link: "/recipes/chrome-browser-plugin.md" },
  { text: "13 Codex × GitHub Actions：CI 失败自动修复", icon: "actions", link: "/recipes/github-actions-ci-fix.md" },
  { text: "14 Codex × 临床文献综述：把医学问题整理成证据表", icon: "table", link: "/recipes/clinical-literature-review.md" },
  { text: "15 Codex × Hatch Pet：用一张照片生成专属宠物", icon: "image", link: "/recipes/hatch-pet-photo.md" },
  { text: "16 Codex × 安卓手机：扫码连接，远程操控", icon: "mobile", link: "/recipes/android-remote-control.md" },
  { text: "参考来源与致谢", icon: "heart", link: "/recipes/credits.md" },
];

const communityItems = [
  { text: "关注苍何公众号，回复 codex交流群 进入群交流", icon: "message", link: "/community/roadmap.md" },
];

export default navbar([
  { text: "首页", icon: "home", link: "/" },
  { text: "学习路线", icon: "map", link: "/guide/00-overview.md" },
  { text: "入口地图", icon: "layout", link: "/platform/" },
  {
    text: "配置",
    icon: "gear",
    ariaLabel: "配置导航",
    children: configurationItems,
  },
  {
    text: "资源",
    icon: "box",
    ariaLabel: "资源导航",
    children: resourceItems,
  },
  {
    text: "教程",
    icon: "book",
    ariaLabel: "教程导航",
    children: guideItems,
  },
  {
    text: "实战案例",
    icon: "lightbulb",
    ariaLabel: "实战案例导航",
    children: recipeItems,
  },
  {
    text: "更多",
    icon: "more",
    ariaLabel: "更多导航",
    children: [
      { text: "配置", icon: "gear", link: "/configuration/" },
      { text: "资源", icon: "box", link: "/reference/" },
      { text: "教程", icon: "book", link: "/guide/01-app-installation.md" },
      { text: "实战案例", icon: "lightbulb", link: "/recipes/" },
      { text: "交流群", icon: "message", link: "/community/roadmap.md" },
    ],
  },
  {
    text: "交流群",
    icon: "message",
    ariaLabel: "交流群",
    children: communityItems,
  },
]);
