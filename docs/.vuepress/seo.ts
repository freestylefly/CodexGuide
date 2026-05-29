export const siteUrl = "https://codexguide.ai";

export const siteDescription =
  "CodexGuide 系统整理 Codex 桌面 App、CLI、IDE、Cloud、Skills 与真实案例，帮助中文用户从入门到团队落地。";

export const siteOgImage = `${siteUrl}/og.svg`;

export const pageDescriptions: Record<string, string> = {
  "/": siteDescription,
  "/community/":
    "CodexGuide 社区共建入口，整理路线图、贡献方向和内容认领方式，方便一起完善 Codex 中文实践知识库。",
  "/community/roadmap.html":
    "CodexGuide 共建路线图，记录文档站骨架、教程、案例、截图、关键词索引和社区传播的后续计划。",
  "/configuration/":
    "Codex 配置与扩展总览，梳理 AGENTS.md、config.toml、Skills、MCP、Subagents、安全审批和团队配置路径。",
  "/configuration/cli-options.html":
    "Codex CLI 选项与命令指南，覆盖交互模式、非交互执行、恢复会话、Slash Commands 和常用启动参数。",
  "/configuration/config-file.html":
    "Codex config.toml 配置指南，说明模型、沙盒、审批、profiles、MCP 和个人本地配置的组织方式。",
  "/configuration/mcp-skills-subagents.html":
    "Codex MCP、Skills 与 Subagents 指南，说明外部工具接入、流程固化和复杂任务拆分的使用场景。",
  "/configuration/security-admin.html":
    "Codex 安全、审批与管理指南，整理沙盒、网络访问、凭据边界、组织策略和团队审计关注点，适合上线前检查。",
  "/guide/":
    "CodexGuide 学习路线目录，汇总入门准备、日常工作流、CLI、IDE、Cloud、AGENTS.md 和排障章节。",
  "/guide/00-overview.html":
    "Codex 学习路线，从入口认知、任务闭环、工程化验证到团队沉淀，帮助新手建立完整使用路径并选择下一章。",
  "/guide/01-app-installation.html":
    "Codex 桌面 App 下载与安装教程，说明 macOS、Windows 安装入口、账号登录和首次启动前的准备工作。",
  "/guide/02-subscribe-plus.html":
    "ChatGPT Plus 与 Pro 订阅指南，整理 Codex 可用性、账号准备、支付路径和订阅前需要核对的信息。",
  "/guide/03-app-overview.html":
    "Codex 桌面 App 基本组成说明，介绍项目工作区、对话、设置入口、任务状态和常见界面区域，方便快速定位功能。",
  "/guide/04-mobile-control-desktop.html":
    "手机端跟进桌面 Codex 任务教程，说明 ChatGPT App 入口、跨设备连接、任务查看和协同边界。",
  "/guide/05-third-party-api.html":
    "Codex 连接第三方 API 的入门说明，比较手动配置、Codex++、CCX 与 CC Switch 三种接入方式，并提示密钥和账单风险。",
  "/guide/06-app-first-task.html":
    "用 Codex 完成第一个任务的入门教程，带你选择工作目录、输入任务、查看结果并完成基础验证，形成操作习惯。",
  "/guide/07-task-execution.html":
    "Codex 任务顺序执行与并行说明，帮助理解读文件、运行命令、修改文件、验证结果和汇报进度的机制，便于复核。",
  "/guide/08-permissions.html":
    "Codex 权限管理指南，说明文件访问、命令审批、网络权限、敏感数据和高风险操作的控制方式，适合任务前核对。",
  "/guide/09-skills-plugins.html":
    "Codex Skills 和 Plugins 入门说明，介绍技能、插件、MCP 能力的关系，以及适合沉淀的工作流类型。",
  "/guide/10-automation.html":
    "Codex 自动化指南，说明定时任务、提醒、监控、后续跟进和适合自动化处理的工作场景，沉淀重复检查流程。",
  "/guide/11-desktop-pet.html":
    "Codex 桌面形象设置教程，记录桌面展示效果、素材准备、配置步骤和适合个性化工作台的用法，便于识别任务状态。",
  "/guide/12-cli-installation.html":
    "Codex CLI 安装与登录教程，覆盖 Node 环境、安装命令、版本检查、登录流程和首次运行准备。",
  "/guide/13-cli-first-run.html":
    "第一次让 Codex CLI 改代码的教程，说明如何选择低风险任务、让 Codex 读仓库、修改文件并运行验证。",
  "/guide/14-ide-vscode.html":
    "在 VS Code 中使用 Codex 的教程，介绍插件入口、文件上下文、局部修改、解释代码和编辑器内协作方式。",
  "/guide/15-agents-md.html":
    "AGENTS.md 项目规则指南，说明如何写入项目命令、代码风格、禁用事项、验证方式和团队约定，让 Codex 更懂仓库。",
  "/guide/16-sandbox-approvals.html":
    "Codex 沙盒、审批与安全边界指南，解释只读、写入、网络、危险命令和人工确认策略，适合高风险任务前检查。",
  "/guide/17-cloud-ide-app.html":
    "Codex Cloud 使用指南，说明云端任务、仓库连接、长任务、PR 工作流和与本地 App、IDE 的差异。",
  "/guide/18-troubleshooting.html":
    "Codex 排障手册，汇总登录、安装、权限、依赖、命令失败和任务执行异常的定位与恢复路径，帮助快速继续工作。",
  "/platform/":
    "Codex 入口地图，比较 CLI、桌面 App、Cloud、IDE、ChatGPT 和集成生态，帮助选择合适工作入口。",
  "/platform/app.html":
    "Codex 桌面 App 入口说明，介绍本地项目、多任务、Skills、Automations、插件和桌面工作台场景。",
  "/platform/chatgpt.html":
    "ChatGPT 中的 Codex 使用说明，介绍仓库任务分派、移动端跟进、账号能力和适合对话入口的工作流。",
  "/platform/cli.html":
    "Codex CLI 入口说明，介绍本地仓库修改、命令执行、测试验证、diff 检查和开发者日常使用场景。",
  "/platform/cloud.html":
    "Codex Cloud 与 Web 入口说明，介绍后台任务、并行处理、GitHub 连接、PR 生成和团队协作场景。",
  "/platform/ide.html":
    "Codex IDE 入口说明，介绍编辑器上下文、局部代码修改、代码解释、审查和高频开发协作场景，提升日常效率。",
  "/practice/":
    "Codex 实践方法总览，整理任务设计、非开发工作流和团队 playbook，帮助把一次任务做成可验证闭环。",
  "/practice/non-dev-workflows.html":
    "Codex 非开发工作流指南，说明如何用于文档、学习、研究、内容整理、知识库和团队运营任务，让交付更清晰。",
  "/practice/task-design.html":
    "Codex 任务设计方法，说明如何写清目标、背景、范围、约束、验证和交付格式，让执行结果更稳定，减少返工。",
  "/practice/team-playbook.html":
    "Codex 团队实践指南，整理 AGENTS.md、PR、排障、知识库、任务模板和团队推广的协作方法。",
  "/recipes/":
    "Codex 实战案例库，收录 PPT、Draw.io、Playwright、Obsidian、飞书、Figma、Notion、CI 和远程排障案例。",
  "/recipes/chrome-browser-plugin.html":
    "Codex Chrome 浏览器插件案例，说明如何让 AI 控制浏览器页面、执行网页任务并保持安全边界。",
  "/recipes/credits.html":
    "CodexGuide 参考来源与致谢，整理案例中涉及的第三方工具、官方文档、仓库链接和内容来源，便于追溯资料。",
  "/recipes/dkfile-deploy-codex.html":
    "Codex 与 DKFile 发布案例，说明如何用 AI 生成网页、构建静态产物并一键发布到公网，同时确认访问结果。",
  "/recipes/drawio-mcp.html":
    "Codex 与 Draw.io MCP 案例，说明如何用 AI 自动绘制架构图、整理节点关系并生成可编辑图形。",
  "/recipes/feishu-cli-codex.html":
    "Codex 与飞书 CLI 案例，说明如何用一句话处理飞书数据、多维表格和团队协作信息，适合自动整理团队数据。",
  "/recipes/figma-mcp-codex.html":
    "Codex 与 Figma MCP 案例，说明如何读取设计稿、理解布局与组件，并辅助前端实现或文档整理。",
  "/recipes/github-actions-ci-fix.html":
    "Codex 与 GitHub Actions 案例，说明 CI 失败后如何读取日志、定位问题、自动修复并生成 PR。",
  "/recipes/hyperframes-animation.html":
    "Codex 与 HyperFrames 案例，说明如何用代码生成动画视频，组织素材、脚本、渲染和结果验证。",
  "/recipes/llm-wiki-codex.html":
    "Codex 与 LLM Wiki 案例，说明如何在 Obsidian 中搭建 AI 知识库、整理目录、引用和更新流程。",
  "/recipes/notion-mcp-codex.html":
    "Codex 与 Notion MCP 案例，说明如何连接 Notion 知识空间、读取页面、整理数据库和生成内容。",
  "/recipes/obsidian-codex.html":
    "Codex 与 Obsidian 案例，说明如何在本地知识库中生成内容、管理图片、组织笔记和保留引用。",
  "/recipes/playwright-mcp.html":
    "Codex 与 Playwright MCP 案例，说明如何让 AI 操作浏览器、点击页面、截图检查并验证网页状态。",
  "/recipes/ppt-skill-walkthrough.html":
    "Codex 与 PPT Skill 案例，说明如何用一句话生成演示文稿，检查结构、视觉一致性和导出效果。",
  "/recipes/remote-bug-fix.html":
    "Codex 与云服务器排障案例，说明如何远程复现问题、读取日志、定位 Python 报错并验证修复结果。",
  "/reference/":
    "Codex 官方资料索引，汇总 OpenAI 产品页、Help Center、开发者文档、GitHub 仓库和安全配置资料。",
};

export const getPageDescription = (path: string): string =>
  pageDescriptions[path] ?? siteDescription;

export const toSiteUrl = (path: string): string =>
  `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
