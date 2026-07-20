const configuredSiteUrl = process.env.PUBLIC_SITE_URL?.trim();

export const siteUrl = configuredSiteUrl
  ? new URL(configuredSiteUrl).origin
  : "https://codexguide.ai";

export const siteDescription =
  "CodexGuide 是面向中文用户的 OpenAI Codex 教程，系统整理 Codex 桌面 App、CLI、IDE、Cloud、配置、Skills、AGENTS.md 和实战案例。";

export const siteOgImage = `https://cdn.canghecode.com/codexguide/docs/.vuepress/public/og.svg`;

export const toCleanPath = (path: string): string => {
  const [pathname, suffix = ""] = path.split(/(?=[?#])/u);
  let cleanPath = pathname || "/";

  if (cleanPath === "/index.html") return `/${suffix}`;

  if (cleanPath.endsWith("/index.html")) {
    cleanPath = cleanPath.slice(0, -"index.html".length);
  } else if (cleanPath.endsWith(".html")) {
    cleanPath = cleanPath.slice(0, -".html".length);
  }

  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }

  return `${cleanPath}${suffix}`;
};

export const pageDescriptions: Record<string, string> = {
  "/": siteDescription,
  "/guide/": "CodexGuide 学习路线，总览快速上手、进阶教程、实战案例、参考手册和社区共建的阅读顺序。",
  "/start/": "Codex 快速上手教程，从认识 Codex、安装账号、费用上下文到第一个任务和任务执行闭环。",
  "/advanced/": "Codex 进阶教程，整理 CLI、IDE、Cloud、权限安全、AGENTS.md、Skills、MCP、Hooks、团队协作和排障路径。",
  "/recipes/": "Codex 实战案例库，收录 PPT、Draw.io、Playwright、Obsidian、临床文献综述、Hatch Pet、移动协同、CI 和远程排障案例。",
  "/manual/": "Codex 参考手册，整理 OpenAI 官方资料、Codex 更新记录、参考来源与致谢。",
  "/community/roadmap.html": "CodexGuide 共建路线图，记录文档站骨架、教程、案例、截图、关键词索引和社区传播的后续计划。",
  "/community/tutorials.html": "Codex 社区优秀教程合集，收录社区维护的 Codex 开源教程、在线阅读资料和 PDF。",
  "/community/join.html": "CodexGuide 付费交流群，介绍交流价值、适合人群和服务边界，并支持使用支付宝支付 9.9 元获得长期有效的入群资格。",
  "/sponsors/": "CodexGuide 赞助商页面，集中展示支持本站建设的项目和服务。",

  "/start/01-what-is-codex.html": "Codex 入口地图，比较 CLI、桌面 App、Cloud、IDE、ChatGPT 和集成生态，帮助选择合适工作入口。",
  "/start/02-app-installation.html": "Codex 桌面 App 安装教程，说明 macOS、Windows 下载入口、账号登录和第一次使用 OpenAI Codex 的准备工作。",
  "/start/03-account-plan.html": "ChatGPT Plus 与 Pro 订阅指南，整理 Codex 可用性、账号准备、支付路径和订阅前需要核对的信息。",
  "/start/04-third-party-api.html": "Codex 连接第三方 API 的快速上手说明，比较手动配置、Codex++、CCX 与 CC Switch，并提示密钥和账单风险。",
  "/advanced/01-cost-context.html": "Codex 费用与 Token 入门说明，解释 ChatGPT 计划额度、API token 计费、输入输出 token、缓存 token 和 prompt caching 的省钱方式。",
  "/start/05-app-overview.html": "Codex 桌面 App 基本组成说明，介绍项目工作区、对话、设置入口、任务状态和常见界面区域。",
  "/start/06-first-task.html": "用 Codex 完成第一个任务的入门教程，带你选择工作目录、输入任务、查看结果并完成基础验证。",
  "/start/07-task-design.html": "Codex 任务设计方法，说明如何写清目标、背景、范围、约束、验证和交付格式。",
  "/start/08-task-execution.html": "Codex 任务执行与验证闭环教程，说明如何观察执行过程、检查 diff、验证结果并处理失败。",
  "/start/09-mobile-control.html": "手机端跟进桌面 Codex 任务教程，说明 ChatGPT App 入口、跨设备连接、任务查看和协同边界。",

  "/start/10-cli-installation.html": "Codex CLI 安装教程，覆盖 Node 环境、安装命令、版本检查、登录流程和第一次运行准备。",
  "/start/11-cli-first-run.html": "第一次让 Codex CLI 改代码的教程，说明如何选择低风险任务、让 Codex 读仓库、修改文件并运行验证。",
  "/start/12-cli-options.html": "Codex CLI 选项与命令指南，覆盖交互模式、非交互执行、恢复会话、Slash Commands 和常用启动参数。",
  "/start/13-ide-vscode.html": "在 VS Code 中使用 Codex 的教程，介绍插件入口、文件上下文、局部修改、解释代码和编辑器内协作方式。",
  "/start/14-cloud.html": "Codex Cloud 使用指南，说明云端任务、仓库连接、长任务、PR 工作流和与本地 App、IDE 的差异。",
  "/advanced/02-agents-md.html": "AGENTS.md 项目规则指南，说明如何写入项目命令、代码风格、禁用事项、验证方式和团队约定。",
  "/advanced/03-skills-plugins-mcp.html": "Codex Skills、Plugins 和 MCP 入门说明，介绍技能、插件、MCP 能力的关系和沉淀工作流方式。",
  "/advanced/04-permissions-security.html": "Codex 权限管理指南，说明文件访问、命令审批、网络权限、敏感数据和高风险操作的控制方式。",
  "/advanced/05-automation.html": "Codex 自动化指南，说明定时任务、提醒、监控、后续跟进和适合自动化处理的工作场景。",
  "/advanced/06-hooks.html": "Codex Hooks 入门说明，介绍 Hooks 的作用、配置位置、事件类型、信任机制和安全建议。",
  "/advanced/07-sandbox-approvals.html": "Codex 沙盒、审批与安全边界指南，解释只读、写入、网络、危险命令和人工确认策略。",
  "/advanced/08-thread-management.html": "Codex 线程管理指南，说明 thread、resume、fork、worktree、handoff 和 subagent 的区别。",
  "/advanced/09-config-toml.html": "Codex config.toml 配置指南，说明模型、沙盒、审批、profiles、MCP 和个人本地配置的组织方式。",
  "/advanced/10-team-playbook.html": "Codex 团队实践指南，整理 AGENTS.md、PR、排障、知识库、任务模板和团队推广方法。",
  "/advanced/11-troubleshooting.html": "Codex 排障手册，汇总登录、安装、权限、依赖、命令失败和任务执行异常的定位与恢复路径。",
  "/recipes/00-index.html": "Codex 非开发工作流指南，说明如何用于文档、学习、研究、内容整理、知识库和团队运营任务。",

  "/manual/01-codex-updates.html": "近期 Codex 更新中文摘要，依据 OpenAI 官方 Codex changelog 自 2025 年起整理。",
  "/manual/02-credits.html": "CodexGuide 参考来源与致谢，整理案例中涉及的第三方工具、官方文档、仓库链接和内容来源。",
};

export const getPageDescription = (path: string): string => {
  const cleanPath = toCleanPath(path);
  const htmlPath =
    cleanPath === "/"
      ? "/"
      : cleanPath.endsWith("/")
        ? `${cleanPath.slice(0, -1)}.html`
        : `${cleanPath}.html`;
  const directoryPath = cleanPath === "/" ? "/" : `${cleanPath}/`;

  return (
    pageDescriptions[path] ??
    pageDescriptions[cleanPath] ??
    pageDescriptions[directoryPath] ??
    pageDescriptions[htmlPath] ??
    siteDescription
  );
};

export const toSiteUrl = (path: string): string => {
  const cleanPath = toCleanPath(path.startsWith("/") ? path : `/${path}`);

  return `${siteUrl}${cleanPath}`;
};
