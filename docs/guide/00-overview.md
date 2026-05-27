# 学习路线

CodexGuide 按“认识入口、跑通任务、建立方法、团队沉淀”四层组织。你可以从 CLI 入门，也可以从桌面端、ChatGPT 或云端任务开始；关键在于先理解每个入口适合承载的任务节奏。

::: tip 最后核对
官方资料最后核对日期：2026-05-27。核心来源包括 [OpenAI Codex 产品页](https://openai.com/codex/)、[Codex 文档入口](https://developers.openai.com/codex/)、[Codex CLI 官方仓库](https://github.com/openai/codex) 与 [Codex Help Center](https://help.openai.com/en/articles/11369540-codex-in-chatgpt)。
:::

![Codex 使用入口地图](/images/codex-surfaces.svg)

## 你要先建立的全局理解

Codex 是 OpenAI 面向软件工程与知识工作场景的代理式工作流。它可以在多个入口中出现：

- CLI：贴近终端和本地仓库，适合快速修改、运行命令、排障和验证。
- 桌面 App：适合本地多任务、Skills、Automations、子代理和插件化工作流。
- Web / Cloud / ChatGPT：适合连接仓库、分派长任务、并行处理、生成 PR 或回答代码问题。
- IDE：适合贴近编辑器上下文的解释、修改、审查和局部任务。
- 集成生态：GitHub、Slack、Linear、MCP 等入口让 Codex 接入团队协作链路。

## 四阶段路线

| 阶段 | 目标 | 推荐页面 | 验收标准 |
| --- | --- | --- | --- |
| 入门 | 跑通一个低风险任务 | [桌面 App 下载与安装](./01-app-installation.md)、[手机端协同](./04-mobile-control-desktop.md)、[用 Codex 完成第一个任务](./05-app-first-task.md) | 能用 Codex 桌面 App 完成一次完整的任务闭环 |
| 进阶 | 形成稳定任务方法 | [了解 Codex 基本组成](./03-app-overview.md)、[实践方法](/practice/) | 能写清楚目标、范围、约束、验证和交付 |
| 工程化 | 进入真实项目流程 | [任务执行机制](./06-task-execution.md)、[配置与扩展](/configuration/) | 每次改动都有 diff、测试结果和风险说明 |
| 团队化 | 沉淀规则和案例 | [AGENTS.md](./14-agents-md.md)、[团队实践](/practice/team-playbook.md) | 项目有规则文件、案例库、排障手册和贡献路径 |

## 新手推荐路径

**从 App 开始（推荐）：**

1. [下载安装 Codex 桌面 App](./01-app-installation.md)，完成登录。
2. 按需 [订阅 ChatGPT Plus](./02-subscribe-plus.md)，解锁完整功能。
3. 阅读 [了解 Codex 基本组成](./03-app-overview.md)，认识界面结构。
4. 了解 [手机端如何跟进桌面任务](./04-mobile-control-desktop.md)，避免把它误解成远程桌面。
5. 跟着 [用 Codex 完成第一个任务](./05-app-first-task.md) 走完一次完整操作闭环。

**从 CLI 开始（适合开发者）：**

1. 阅读 [入口地图](/platform/)。
2. [安装 CLI](./11-cli-installation.md)，完成一次登录和版本检查。
3. 用”只读仓库总结”任务确认 Codex 能理解项目。
4. 执行一个低风险修改，例如修文档、补测试或修复单个失败用例。
5. 建立第一个 `AGENTS.md`，写入项目命令和禁止事项。
6. 阅读 [配置与扩展](/configuration/)，准备 `config.toml`、Skills 和安全边界。
7. 把成功任务整理成案例，放进团队知识库。

## 非开发者也可以怎么用

Codex 的核心能力是“理解一组文件、执行有边界的任务、产出可复核结果”。这让它也适合：

- 阅读陌生代码库，输出学习路线。
- 整理项目文档、README、迁移说明和发布说明。
- 审阅配置、依赖、脚本和 CI 失败原因。
- 把重复流程沉淀成模板、Skill 或自动化提醒。
- 辅助产品、运营、技术写作和团队知识管理。

下一步建议读：[入口地图](/platform/)。
