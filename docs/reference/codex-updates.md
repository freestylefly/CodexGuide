---
description: "近期 Codex 更新中文摘要，依据 OpenAI 官方 Codex changelog 自 2025 年起整理，包含月份导航、官方原文链接和最后核对日期。"
---

# 近期Codex更新

:::: tip 最后核对
官方资料最后核对日期：2026-06-27。本文依据 [OpenAI Codex changelog](https://developers.openai.com/codex/changelog) 整理，仅提供中文摘要和阅读索引；功能开放范围、账号计划、地区限制、模型可用性与版本号，请以官方原文为准。
::::

本页用于快速了解 Codex 近期变化，涵盖桌面 App、移动端、CLI、模型、插件、权限与远程控制等内容。为保持阅读清晰，本文自 2025 年起整理，并不逐项搬运官方 GitHub PR 清单。

<div class="codex-update-layout">
<nav class="codex-update-months" aria-label="2026 年 Codex 更新月份导航">
  <a href="#june-2026">2026 年 6 月</a>
  <a href="#may-2026">2026 年 5 月</a>
  <a href="#april-2026">2026 年 4 月</a>
  <a href="#march-2026">2026 年 3 月</a>
  <a href="#february-2026">2026 年 2 月</a>
  <a href="#january-2026">2026 年 1 月</a>
  <a href="#december-2025">2025 年 12 月</a>
  <a href="#november-2025">2025 年 11 月</a>
  <a href="#october-2025">2025 年 10 月</a>
  <a href="#september-2025">2025 年 9 月</a>
  <a href="#august-2025">2025 年 8 月</a>
  <a href="#june-2025">2025 年 6 月</a>
  <a href="#may-2025">2025 年 5 月</a>
</nav>

<div class="codex-update-content">

<h2 id="june-2026">2026 年 6 月</h2>

[官方原文：June 2026](https://developers.openai.com/codex/changelog#month-2026-06)

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-25</p>

### Codex Remote 一般可用

Codex Remote 进入一般可用阶段。用户可以从 ChatGPT mobile app 启动或继续连接在 Mac / Windows host 上的 Codex 工作，查看进度，并在手机上审批操作。

Remote Control 改为每台 iOS / Android 设备与每台 host 之间的已认证一对一 QR pairing。官方建议连接前更新 ChatGPT mobile app 与 Codex App；2026-06-08 之后使用过的连接会继续保持配对，更早且不活跃的连接需要重新配对。

本次还新增 DigitalOcean plugin，可让 Codex 创建 DigitalOcean Droplet、配置 SSH 访问，并把它连接到 Codex App 作为 remote workspace。远程连接的设置与排障请继续参考官方 [Remote connections](https://developers.openai.com/codex/remote-connections) 页面。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-22</p>

### ChatGPT for iOS <span class="codex-update-version">1.2026.167</span>

iOS 端新增 per-host personality settings，可在不同 host 上选择 Friendly 或 Pragmatic 风格；goal 现在可直接在 composer 中编辑，forked conversation 也会显示返回原 thread 的链接。

本次还改进了 side chat、composer 自动补全、subagent / task / worktree 创建进度、workspace 文件搜索、code review 草稿、steering 与 host setup / recovery。修复项覆盖长 thread 加载、Face ID 解锁、停止响应、折叠区域以及深色模式 host 指示器等体验细节。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-22</p>

### Codex CLI <span class="codex-update-version">0.142.0</span>

CLI 的 `/usage` 可显示并兑换 earned usage-limit reset credits，包含确认、重试和可用状态刷新。`/plugins` 将 remote plugins 分成 OpenAI Curated、Workspace、Shared with me，并可在合适的 turn 中推荐和安装相关插件。新增 configurable rollout token budgets，可跨 agent threads 跟踪预算、提醒剩余额度，并在耗尽时中止 turn。

本次还加入 indexed web-search mode，用 server-approved URLs 限制直接页面访问；app-server clients 可配置 multi-agent delegation；Codex 也能接收 UTC 定时提醒并查询当前时间。修复重点包括 Linux TUI 挂起恢复、exec-server / stdio MCP 断线恢复、跨系统 remote environment 的路径 / shell / `AGENTS.md` / sandbox 行为、插件加载安装，以及 goal-first threads 的持久化和搜索。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-18</p>

### Codex app <span class="codex-update-version">26.616</span>

桌面端新增 Record & Replay，可在 macOS 上把用户演示过的流程转成可复用 skill；初始开放范围不含 EEA、UK 和 Switzerland，并要求用户或管理员启用 Computer Use。Automations 运行历史新增批量操作，可一键将运行记录标为已读，或归档符合条件的运行记录。Thread handoff 也进入桌面端，可把 thread 移交到已连接 host 上匹配的项目继续处理，必要时也可由 Codex 协调移交。

本次更新还加入用于管理 SSH connections 的 deep links，并改进 Browser Use：当草稿浏览器会话转移到服务器时，visible-tab routing 与 annotations 会继续保留。官方同时标注包含其他性能改进和问题修复。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-18</p>

### Codex CLI <span class="codex-update-version">0.141.0</span>

CLI 远程执行链路继续加强。remote executor 改用经过认证的端到端加密 relay，并在跨平台执行时保留 executor 原生的工作目录、shell 与权限路径。executor plugins 可按 thread 激活 stdio MCP，app-server 也补充了子线程列表、外部 agent import 结果关联，以及 rate-limit reset credits 的读取和兑换能力。

本次更新还改进 realtime、TUI 输入请求和插件发现流程，并修复 hook trust、插件能力路由、Windows sandbox 凭据、SQLite 状态恢复、企业代理 TLS 兼容性等问题。大型工具会话也通过缓存和减少重复请求降低延迟与内存占用。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-16</p>

### EEA、UK 与 Switzerland 区域开放

Codex app 在欧洲经济区、英国和瑞士开放更多能力。Computer Use 可用于 macOS 和 Windows，Codex Chrome extension 可处理需要已登录 Chrome 上下文的浏览器任务。Memories 也可在这些地区使用，用于记住偏好、常见工作流、技术栈和仓库约定，但默认关闭，需要用户主动启用。

Chronicle 同步面向这些地区的 ChatGPT Pro macOS 用户提供 opt-in research preview，可基于近期屏幕上下文帮助 Codex 形成 memories。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-15</p>

### ChatGPT for iOS 与 Codex CLI <span class="codex-update-version">1.2026.160 / 0.140.0</span>

iOS 端新增 workspace file browser、启动新 thread 时的目录选择、diff 展开 / 折叠控制、MCP approval 作用范围选择，以及 Codex 消息和 plan 中的 LaTeX rendering。本轮也改进了运行中 thread、side chat、subagent、profile、activity、settings 和 goal workflow 的显示与恢复体验。

CLI 0.140.0 新增 `/usage` token activity 视图，并增强 `/goal` 对超大文本、粘贴内容和图片附件的保留能力。`codex delete`、`/delete` 与 app-server `thread/delete` 支持带确认保护的永久删除；`/import` 可导入 Claude Code 的 setup、project config 与 recent chats。认证侧加入 managed Amazon Bedrock API-key auth，并将 CLI 与 MCP OAuth 凭据放入本地加密存储。

修复方面，CLI 改善了 SQLite state 重建、`/review`、MCP startup、OAuth 凭据提示、remote plugin uninstall 与后台命令处理。本版本也从 TUI 中移除了实验性的 `/realtime` 语音控制及相关音频依赖。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-11</p>

### Codex app <span class="codex-update-version">26.609</span>

桌面端加入 rate-limit reset banking。Plus / Pro 用户可获得 launch 时的一次免费 reset，并可通过 referral invitations 继续获取；符合条件的 Business 成员也可邀请同事，为 workspace 获取共享 credits。Browser use 新增 Developer mode，可通过 Chrome DevTools Protocol 辅助性能、网络、console、runtime error 与页面状态调试。

本次还把 `/init` 带进 app composer，支持自定义 macOS Dock icons，并为 EEA、UK、Switzerland 之外的 Enterprise 用户开放 Computer Use。Windows Computer Use 增加 per-app access controls；command menu 新增 Unread chats 区域。Browser use 通过 CDP 与 DOM snapshot 优化，官方标注最高可提速约 2 倍。

修复与体验打磨覆盖插件管理、用量限制提示、approval feedback、Browser download / Developer mode recovery、scheduled automations、手动项目排序、Mobile QR pairing、remote-control MFA、SSH 连接和非默认缩放下的 overlay 定位等。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-09</p>

### Codex app、iOS 与 CLI 更新 <span class="codex-update-version">26.608 / 1.2026.153 / 0.139.0</span>

桌面端新增从 Claude Code / Claude Cowork 迁移至 Codex 的流程，并重新设计插件页面，提供标签页、市场入口、分类筛选、键盘导航和更明确的安装操作。

本次更新还包括：

- 移动端支持选择分支、创建 worktree、运行环境 setup script、查看 profile 用量图、使用 `/goal`，以及在变更文件中查看 inline review comments。
- CLI 的 code mode 可直接调用独立 web search；MCP 工具 schema、`codex doctor`、插件市场 JSON 输出、`resume --last` / `fork --last`、沙盒审批与代理网络也获得改进。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-08</p>

### Codex CLI <span class="codex-update-version">0.138.0</span>

`/app` 命令可将当前 CLI thread 移交至 Codex Desktop，支持 macOS 和原生 Windows；Windows workspace 也可直接在桌面端打开。插件命令提供更完整的结构化输出；启动流程增强了对 shell、Linux proxy socket 和 OAuth-backed MCP 凭据的处理。TUI 启动减少重复插件发现，大型 MCP / Ollama stream 与较长历史记录的处理速度也有所提升。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-04</p>

### Codex app 与 CLI 更新 <span class="codex-update-version">26.602 / 0.137.0</span>

桌面端 Profile 新增 activity insights 与 share cards，并修复浏览器、review UI、onboarding 以及插件安装后的配置写入问题。CLI 支持 F13-F24 快捷键、菜单粘贴、企业月度 credit limit 展示、cloud-managed config bundles、remote-control RPC、插件列表 JSON、环境级权限审批，以及 managed MITM proxy CA bundle。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-02</p>

### Sites 预览与 iOS 更新

Codex app 推出 Sites 预览。通过 Sites plugin，可创建、保存、部署和检查网站、dashboard、内部工具、Web App 与游戏，并管理托管环境变量和 secrets。iOS 端新增 Face ID / passcode lock、Windows SSH host 连接与 `/side <prompt>`，同时改进 follow-up prompt、首页和变更文件查看体验。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-06-01</p>

### Amazon Bedrock、终端位置与 CLI <span class="codex-update-version">0.136.0</span>

Codex 可将 Amazon Bedrock 配置为模型 provider，使用 AWS 托管的认证、账号控制和计费运行受支持的 OpenAI 模型。桌面端新增默认终端位置设置。CLI 新增 TUI 可点击链接、会话归档、app-server stdio、远程执行 API key 注册、Windows sandbox alpha provisioning，并对命令安全、Python SDK 文档和 OpenAI Docs skill 做出更新。

</article>

<h2 id="may-2026">2026 年 5 月</h2>

[官方原文：May 2026](https://developers.openai.com/codex/changelog#month-2026-05)

<article class="codex-update-entry">

<p class="codex-update-date">2026-05-29</p>

### Windows Computer Use 与远程控制 <span class="codex-update-version">26.527</span>

Computer Use 开始支持 Windows。Codex 可在前台观察、点击和输入，以操作 Windows 桌面应用。远程控制也扩展至 Windows 设备，用户可从 ChatGPT iOS / Android 或 Mac 端 Codex 发起并跟进 Windows 设备上的任务。桌面端同时扩展历史 thread 搜索、背景 subagent identicon，以及 Google Docs / Sheets / Slides 的 Chrome context capture。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-05-28 / 2026-05-26</p>

### Codex CLI <span class="codex-update-version">0.135.0 / 0.134.0</span>

CLI 的 `codex doctor` 增加环境、Git、终端、app-server 和 thread 诊断信息；`/status` 可显示 remote transport 的连接细节；安装脚本支持通过 `CODEX_NON_INTERACTIVE=1` 使用非交互模式。0.134.0 新增本地会话历史搜索，支持大小写不敏感的内容匹配和结果预览。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-05-25 / 2026-05-21 / 2026-05-18</p>

### Codex Mobile、Appshots 与 goal mode

iOS 支持通过 Spotlight 和 Shortcuts 直接打开 Codex Mobile，也可从 iOS 通知进入已完成的 Codex 任务。桌面端推出 Appshots：按下两个 Command 键，即可将当前 macOS 窗口的截图和可用文本发送给 Codex。Goal mode 不再作为实验功能提供，并进入 Codex app、IDE extension 和 CLI；CLI 同步加入 goal 存储与进度跟踪。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-05-14</p>

### 从手机端远程使用 Codex

ChatGPT mobile app 可连接运行 Codex app 的 Mac，并从手机上发起、跟进任务。官方同时补充 remote connections 文档，并发布 Hooks general availability、Codex access tokens 与 Enterprise admin setup guidance。此更新是手机端跟进桌面任务工作流的重要基础。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-05-11 / 2026-05-08 / 2026-05-07 / 2026-05-05</p>

### Auto-review、Chrome、access tokens 与桌面端改进

官方新增 Auto-review 专页，并更新 approvals / sandbox 文档，以说明自动审查与沙盒边界之间的关系。Chrome extension 发布后，Codex 可在浏览器标签页后台协作。Enterprise workspace 可创建 Codex access tokens，供脚本、调度器和私有 CI 使用。桌面端还加入 hooks trust review、dictation cleanup 和可配置 dictation dictionary。

</article>

<h2 id="april-2026">2026 年 4 月</h2>

[官方原文：April 2026](https://developers.openai.com/codex/changelog#month-2026-04)

<article class="codex-update-entry">

<p class="codex-update-date">2026-04-30 / 2026-04-23</p>

### Goal 工作流、GPT-5.5 与 Bedrock provider

CLI 0.128.0 开始支持持久化 `/goal` 工作流，包含 app-server API、model tools、运行时 continuation 和 TUI 控制。GPT-5.5 进入 Codex，并被官方标注为多数 Codex 任务的推荐模型。同一阶段的 CLI 更新还加入快速 reasoning 控制、Amazon Bedrock provider、remote thread config/store、Unix socket transport，以及更适合分页场景的 resume / fork。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-04-20 / 2026-04-16</p>

### Codex app 扩展为更完整的工作空间

桌面端新增本地分支搜索、composer 粘贴非图片文件、早期 in-app browser、Computer Use for macOS、Chats、side chat、local environments、worktrees、review，以及面向长任务协作的相关能力。此阶段的变化，使 Codex 更接近一个连接本地项目、浏览器、桌面应用与长周期任务的工作空间。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-04-12 至 2026-04-01</p>

### 命令菜单、Windows updater、review 与 workspace settings

桌面端新增命令菜单文件搜索、Windows Store updater、可折叠 inline review comments、inline / detached review 模式，以及 workspace settings。4 月 7 日，官方调整 ChatGPT 登录用户的模型可用性，移除较早的 gpt-5 / gpt-5.1 / gpt-5.2-codex 系列入口，并保留新的可选模型。

</article>

<h2 id="march-2026">2026 年 3 月</h2>

[官方原文：March 2026](https://developers.openai.com/codex/changelog#month-2026-03)

<article class="codex-update-entry">

<p class="codex-update-date">2026-03-25</p>

### 插件系统进入 Codex

Codex 开始支持 plugins。插件是可安装的 bundle，可打包 skills、app integrations 与 MCP server configuration，并可在 Codex app、CLI 和 IDE extensions 中使用。用户既可安装 curated plugins，也可通过本地 marketplace 测试自行 scaffold 的插件。插件结构以 `.codex-plugin/plugin.json` 为核心，并可包含 `skills/`、`.app.json`、`.mcp.json` 与 assets。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-03-24 至 2026-03-11</p>

### 桌面端线程、composer、terminal 与 automations

桌面端新增历史 thread 搜索、Floating Composer v2、composer 中的 skills `@` 菜单、从早期消息 fork conversation、后退/前进按钮、主题自定义、Automations 改版，以及读取当前 thread 集成终端输出的能力。这些更新主要改善上下文查找、任务续接和运行中调试体验。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-03-05 / 2026-03-04 / 2026-03-03</p>

### GPT-5.4 与 Windows 桌面端

GPT-5.4 进入 Codex。官方将其定位为面向专业工作的主力 frontier model，并提供原生 computer-use 能力与实验性 1M context。3 月 4 日，Codex app for Windows 发布，使用 PowerShell 和原生 Windows sandbox，使 Windows 用户无需迁移至 WSL、虚拟机或关闭沙盒，即可使用桌面端。

</article>

<h2 id="february-2026">2026 年 2 月</h2>

[官方原文：February 2026](https://developers.openai.com/codex/changelog#month-2026-02)

<article class="codex-update-entry">

<p class="codex-update-date">2026-02-28 至 2026-02-17</p>

### 桌面端稳定性与操作细节

桌面端修复 streaming 过程中 conversation / task view 可能停止更新的问题，并加入 PR 状态 badge、composer 中的 MCP shortcut、队列消息拖拽排序、branch picker 搜索、command palette 中的 MCP 与 personality actions、文件引用的系统文件管理器打开入口，以及 thread 双击重命名。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-02-12 至 2026-02-05</p>

### GPT-5.3-Codex 与 Codex-Spark

GPT-5.3-Codex 发布，面向复杂、真实的软件工程任务。随后，GPT-5.3-Codex-Spark 作为更小、更实时的研究预览模型推出，目标是提供更低延迟的编码体验。同期 Codex app 增加对应模型支持。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-02-02</p>

### Codex app for macOS 发布

Codex app for macOS 发布。它是一个桌面界面，用于并行运行 agent threads、跨项目管理任务，并通过 review pane 查看结果。此版本也为后续 App、Mobile、Remote Control、Computer Use 和插件体验奠定基础。

</article>

<h2 id="january-2026">2026 年 1 月</h2>

[官方原文：January 2026](https://developers.openai.com/codex/changelog#month-2026-01)

<article class="codex-update-entry">

<p class="codex-update-date">2026-01-28</p>

### 本地任务默认启用 web search

Codex CLI 和 IDE Extension 的本地任务默认启用 web search。默认模式使用 OpenAI 维护的 web search cache；在 `--yolo` 或其他 full access sandbox 设置下，默认使用 live results。用户可通过 `web_search` 配置关闭或切换模式。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-01-23</p>

### Team Config

Team Config 用于集中管理团队共享的 Codex 配置，例如 `config.toml` 默认值、说明文档和团队级工作约定。它适合将个人配置整理为团队可复用的标准。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2026-01-22 / 2026-01-14</p>

### Custom prompts 弃用与 GPT-5.2-Codex API

Custom prompts 已弃用。官方建议改用 skills 承载可复用说明和工作流。GPT-5.2-Codex 开放 API 可用性，也可供使用 API 登录 Codex 的用户选择。

</article>

<h2 id="december-2025">2025 年 12 月</h2>

[官方原文：December 2025](https://developers.openai.com/codex/changelog#month-2025-12)

<article class="codex-update-entry">

<p class="codex-update-date">2025-12-19</p>

### Agent skills in Codex

Codex 开始支持 agent skills。Skill 是可复用的说明包，也可包含脚本、参考资料和资源文件，用于帮助 Codex 更稳定地完成特定任务。该能力可在 Codex CLI 与 IDE extensions 中使用。

Skill 可通过 `$skill-name` 显式调用，也可由 Codex 根据提示词自动选择。官方同时采用基于文件夹的标准结构：`SKILL.md` 为必需文件，`scripts/`、`references/` 与 `assets/` 为可选内容。Skill 可安装在用户级 `~/.codex/skills`，也可随仓库放入 `.codex/skills` 供项目共享。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2025-12-18</p>

### Introducing GPT-5.2-Codex

GPT-5.2-Codex 发布。它是面向 Codex 中 agentic coding 场景优化的 GPT-5.2 版本，重点改进长周期工作、上下文压缩、大型代码变更、Windows 环境表现与网络安全能力。

自该版本起，使用 ChatGPT 登录的 CLI 与 IDE Extension 用户默认使用 `gpt-5.2-codex`。用户也可以通过 `codex --model gpt-5.2-codex`、CLI 中的 `/model`，或更新 `config.toml` 中的 `model` 字段来切换模型。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2025-12-04</p>

### Introducing Codex for Linear

Codex 支持 Linear 集成。用户可以在 Linear issue 中分配或提及 `@Codex`，从而启动 Codex cloud task。Codex 工作期间会将进度更新回 Linear，并在任务完成后提供链接，便于继续 review、打开 PR 或接着处理后续工作。

</article>

<h2 id="november-2025">2025 年 11 月</h2>

[官方原文：November 2025](https://developers.openai.com/codex/changelog#month-2025-11)

<article class="codex-update-entry">

<p class="codex-update-date">2025-11-24</p>

### Usage and credits fixes

官方对 Codex usage 与 credits 展示做出小幅修正。所有用量 dashboard 统一显示“limits remaining”，以保持表达一致；此前 CLI 显示的是“limits used”。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2025-11-18</p>

### Introducing GPT-5.1-Codex-Max

GPT-5.1-Codex-Max 发布。它是新的 frontier agentic coding model，基于基础 reasoning model 的更新，并面向软件工程、数学、研究等 agentic tasks 训练。

使用 ChatGPT 登录的 CLI 与 IDE Extension 用户默认切换至 `gpt-5.1-codex-max`。官方同时新增 Extra High（`xhigh`）reasoning effort，用于对延迟不敏感、需要更长思考时间的任务；日常任务仍建议使用 medium。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2025-11-13</p>

### Introducing GPT-5.1-Codex and GPT-5.1-Codex-Mini

Codex 引入 `gpt-5.1-codex` 与 `gpt-5.1-codex-mini`。它们是针对长时间运行、agentic coding tasks 以及 Codex 或类似 agent harness 场景优化的 GPT-5.1 模型选项。

当时，CLI 与 IDE Extension 在 macOS 和 Linux 上默认使用 `gpt-5.1-codex`，Windows 上默认使用 `gpt-5.1`。用户也可通过 CLI 参数、`/model` 命令、IDE 下拉菜单或 `config.toml` 切换。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2025-11-07 / 2025-11-06</p>

### GPT-5-Codex-Mini 与 GPT-5-Codex 小幅更新

Codex CLI 与 IDE Extension 新增 `gpt-5-codex-mini` 模型选项。该模型是 `gpt-5-codex` 的较小版本，成本更低、能力也更轻量，并在 ChatGPT 订阅内提供约 4 倍可用量。用户接近 5 小时用量限制时，CLI 与 IDE Extension 会建议切换至该模型，以延长可用时间。

随后，GPT-5-Codex 也收到一次小幅更新，重点改进通过 `apply_patch` 进行文件编辑的可靠性。

</article>

<h2 id="october-2025">2025 年 10 月</h2>

[官方原文：October 2025](https://developers.openai.com/codex/changelog#month-2025-10)

<article class="codex-update-entry">

<p class="codex-update-date">2025-10-30</p>

### Credits on ChatGPT Pro and Plus

ChatGPT Plus 与 Pro 用户可使用 on-demand credits 获取更多 Codex 用量，用于补充计划内包含的使用额度。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2025-10-22</p>

### Tag @Codex on GitHub Issues and PRs

GitHub PR 与 Issues 支持提及 `@codex`。用户可以在队友的 pull request 中向 Codex 提问、请求补充修改，或让 Codex 继续处理变更；也可以直接从 GitHub Issue 启动任务，不必离开原有工作流。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2025-10-06</p>

### Codex is now GA

Codex 正式进入一般可用阶段，并同时发布三项能力：Slack 中的 `@Codex`、Codex SDK，以及新的管理员工具。

本次发布包括：

- Slack 集成：可直接在 Slack 中向 Codex 提问或分配任务。
- Codex SDK：可将驱动 Codex CLI 的同一 agent 集成到自有工具和工作流中，并可配合 Codex GitHub Action 接入 CI/CD。
- 管理员控制与 analytics：ChatGPT workspace 管理员可编辑或删除 Codex Cloud environments，通过 managed config files 设置 CLI 与 IDE 的安全默认值，并查看使用情况和 code review feedback。

</article>

<h2 id="september-2025">2025 年 9 月</h2>

[官方原文：September 2025](https://developers.openai.com/codex/changelog#month-2025-09)

<article class="codex-update-entry">

<p class="codex-update-date">2025-09-23</p>

### GPT-5-Codex in the API

GPT-5-Codex 在 Responses API 中开放，也可通过 API Key 在 Codex CLI 中使用。官方表示将持续更新该模型 snapshot；价格与 GPT-5 相同，具体价格和 rate limits 以模型页面为准。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2025-09-15</p>

### Introducing GPT-5-Codex

GPT-5-Codex 发布。它是进一步针对 Codex 中 agentic coding 优化的 GPT-5 版本，可在使用 ChatGPT 登录的 IDE extension 和 CLI 中使用，并驱动 cloud agent 与 GitHub 中的 Code Review。

本次更新还包括：

- Cloud 前端工程任务支持 image outputs，可在 Codex web 中显示 UI 截图，便于不在本地 checkout 分支的情况下迭代设计。
- Codex CLI 新增 `codex resume`，可从上次位置恢复会话。

</article>

<h2 id="august-2025">2025 年 8 月</h2>

[官方原文：August 2025](https://developers.openai.com/codex/changelog#month-2025-08)

<article class="codex-update-entry">

<p class="codex-update-date">2025-08-27</p>

### Late August update

Codex 进入 IDE，提供适用于 VS Code、Cursor 与 Windsurf 的交互式界面，用于更快的本地迭代。用户可以在 IDE 中切换模式与 reasoning effort，并通过 ChatGPT 登录 IDE 与 CLI，减少对 API key 的依赖。

本次更新也支持在本地与 cloud 之间移动工作：用户可从 IDE 将任务移交至 Codex web，并将变更应用回本地。Code Reviews 也获得扩展，不只做静态分析，而是结合 PR 意图、代码库上下文、依赖关系，并可运行代码验证行为变化。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2025-08-21</p>

### Mid August update

Codex web 支持在提示中附加图片，适合前端修改、白板内容跟进等场景。容器缓存能力也上线，可让新任务和 follow-up 的启动速度明显提升，官方给出的中位启动时间从 48 秒降至 5 秒。

同时，未配置手动 setup script 的环境会自动运行常见包管理器的标准安装命令，包括 yarn、pnpm、npm、go mod、gradle、pip、poetry、uv 与 cargo，以减少新环境中的测试失败。

</article>

<h2 id="june-2025">2025 年 6 月</h2>

[官方原文：June 2025](https://developers.openai.com/codex/changelog#month-2025-06)

<article class="codex-update-entry">

<p class="codex-update-date">2025-06-13</p>

### Best of N

Codex 可为同一个任务同时生成多个响应，帮助用户快速比较不同方案，并选择更合适的实现路径。官方同时加入快捷键页面，可通过 macOS 上的 `Command-/` 或其他平台上的 `Ctrl+/` 打开。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2025-06-03</p>

### June update

Codex 支持在任务执行期间访问互联网，用于安装依赖、升级包、运行需要外部资源的测试等场景。互联网访问默认关闭；Plus、Pro 与 Business 用户可按环境启用，并细化控制允许访问的域名和 HTTP 方法。官方当时说明 Enterprise 用户的互联网访问随后开放。

本次更新还支持在 follow-up 任务中更新已有 pull request，并新增语音听写任务。Profile 菜单中也加入了指向 changelog 的链接。

</article>

<h2 id="may-2025">2025 年 5 月</h2>

[官方原文：May 2025](https://developers.openai.com/codex/changelog#month-2025-05)

<article class="codex-update-entry">

<p class="codex-update-date">2025-05-22</p>

### Reworked environment page

环境页面经过重新设计，使 code execution 的设置更快、更清晰。官方同时加入重试失败任务的按钮。

</article>

<article class="codex-update-entry">

<p class="codex-update-date">2025-05-19</p>

### Codex in the ChatGPT iOS app

Codex 进入 ChatGPT iOS app。用户离开桌面时，也可以从手机端启动任务、查看 diffs，并推送 PR。

</article>

</div>
</div>
