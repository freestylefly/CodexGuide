---
description: "Codex 入口地图，比较 CLI、桌面 App、Cloud、IDE、ChatGPT 和集成生态，帮助选择合适工作入口。"
---

# Codex 入口地图

CodexGuide 把 Codex 看成一组入口协同的工作系统。学习时不要只盯着某一个界面；真正影响效率的是：你把什么任务放在哪个入口里处理。

![Codex 使用入口地图](/images/codex-surfaces.svg)

::: tip 最后核对
官方资料最后核对日期：2026-05-27。参考 [OpenAI Codex 产品页](https://openai.com/codex/)、[Codex 文档入口](https://developers.openai.com/codex/)、[Codex CLI 官方仓库](https://github.com/openai/codex) 与 [Codex in ChatGPT Help Center](https://help.openai.com/en/articles/11369540-codex-in-chatgpt)。
:::

## 入口对照表

| 入口 | 更适合 | 典型任务 | 学习优先级 |
| --- | --- | --- | --- |
| [CLI](./cli.md) | 本地快速迭代 | 修 bug、补测试、跑命令、解释仓库 | 新手优先 |
| [桌面 App](./app.md) | 本地多任务工作台 | 多 agent、Skills、Automations、插件协作 | 进阶优先 |
| [Cloud / Web](./cloud.md) | 较长任务和并行任务 | 仓库任务、PR、后台分析 | 团队优先 |
| [IDE](./ide.md) | 编辑器上下文 | 局部修改、解释、代码审查 | 日常高频 |
| [ChatGPT 中的 Codex](./chatgpt.md) | 面向仓库的任务分派 | 连接 GitHub、理解仓库、协作推进 | 按账号能力选择 |

## 如何选择入口

- 任务需要频繁看命令输出：选 CLI。
- 任务需要多个 agent 并行、Skills 或 Automations：选择桌面 App。
- 任务时间较长、希望后台跑、可能生成 PR：选 Cloud / Web。
- 你正在编辑具体文件：选 IDE。
- 你想从对话里分派仓库级任务：选 ChatGPT 中的 Codex。

## 第一次学习建议

1. 从 CLI 建立最小闭环。
2. 用桌面 App 体验本地多任务和技能沉淀。
3. 再进入 Cloud / Web，学习长任务、PR 与团队协作。
4. 阅读 [配置与扩展](/configuration/)，补上 CLI 选项、config.toml、MCP、Skills 和安全边界。
5. 把高频模板沉淀到 `AGENTS.md`、案例库和团队规范。

## 入口和配置的关系

| 配置主题 | 主要影响入口 | 学习页 |
| --- | --- | --- |
| `AGENTS.md` | CLI / 桌面 App / Cloud | [AGENTS.md](/guide/15-agents-md.md) |
| CLI 选项 | CLI | [CLI 选项与命令](/configuration/cli-options.md) |
| `config.toml` | CLI | [配置文件 config.toml](/configuration/config-file.md) |
| Skills | App / CLI | [MCP、Skills 与 Subagents](/configuration/mcp-skills-subagents.md) |
| Worktrees | 桌面 App | [桌面 App](./app.md) |
| Environments | Cloud / App | [Cloud / Web](./cloud.md) |
| Sandbox 与 Approvals | 全部入口 | [安全、审批与管理](/configuration/security-admin.md) |

## 截图补充清单

::: info 截图占位
后续请补充一张“各入口首页/启动界面拼图”。建议文件：`docs/.vuepress/public/screenshots/platform/00-surfaces-collage.png`。
:::
