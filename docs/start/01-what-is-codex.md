---
description: "Codex 入口地图，比较 CLI、桌面 App、Cloud、IDE、ChatGPT 和集成生态，帮助选择合适工作入口。"
---

::: tip 最后核对
官方资料最后核对日期：2026-10-12。参考 [ChatGPT 与 Codex 文档入口](https://learn.chatgpt.com/docs)、[ChatGPT 桌面 App](https://learn.chatgpt.com/docs/app)、[Codex CLI](https://learn.chatgpt.com/docs/codex/cli)、[Codex IDE 集成](https://learn.chatgpt.com/docs/codex/ide) 与 [Codex Cloud](https://learn.chatgpt.com/docs/cloud)。
:::

# Codex 是什么

Codex 是 OpenAI 的编程 Agent，提供多种使用入口，涵盖 ChatGPT 桌面 App、CLI、Cloud 和 IDE。你也可以从 ChatGPT 网页端或移动端查看并继续 Cloud 任务。

![Codex 使用入口地图](../images/codex-entry-map-illustrated.png)

## 入口对照表

| 入口                                            | 更适合              | 典型任务                     | 学习优先级   |
| --------------------------------------------- | ---------------- | ------------------------ | ------- |
| [CLI](../start/10-cli-installation.md)        | 本地快速迭代和自动化       | 修 bug、补测试、跑命令、代码审查       | 新手优先    |
| [ChatGPT 桌面 App](../start/05-app-overview.md) | 本地多任务工作台         | 多 agent、Skills、定时任务、插件协作 | 进阶优先    |
| [Cloud / Web](../start/14-cloud.md)           | 较长任务和并行任务        | 仓库任务、PR、后台分析             | 团队优先    |
| [IDE](../start/13-ide-vscode.md)              | 编辑器上下文           | 局部修改、解释、代码审查             | 日常高频    |
| [ChatGPT Web / Mobile](../start/14-cloud.md)  | 随时查看和继续 Cloud 任务 | 连接仓库、检查结果、协作推进           | 按账号能力选择 |

## 如何选择入口

- 任务需要频繁看命令输出：选 CLI。
- 任务需要多个 agent 并行、Skills 或定时任务：选择 ChatGPT 桌面 App。
- 任务时间较长、希望后台跑、可能生成 PR：选 Cloud / Web。
- 你正在编辑具体文件：选 IDE。VS Code、Cursor、Windsurf 使用 Codex 扩展，Xcode 和 JetBrains 使用各自的集成。
- 你想随时查看或继续 Cloud 任务：选 ChatGPT Web / Mobile。

## 第一次学习建议

1. 从 CLI 建立最小闭环。
2. 用 ChatGPT 桌面 App 体验本地多任务和技能沉淀。
3. 再进入 Cloud / Web，学习长任务、PR 与团队协作。
4. 阅读 [CLI 选项](/start/12-cli-options.md) 和 [config.toml](/advanced/09-config-toml.md)，补上配置基本功。
5. 把高频模板沉淀到 `AGENTS.md`、案例库和团队规范。

## 入口和配置的关系

| 配置主题 | 主要影响入口 | 学习页 |
| --- | --- | --- |
| `AGENTS.md` | CLI / 桌面 App / IDE / Cloud | [AGENTS.md](/advanced/02-agents-md.md) |
| CLI 选项 | CLI | [CLI 选项与命令](/start/12-cli-options.md) |
| `config.toml` | CLI / 桌面 App / IDE | [配置文件 config.toml](/advanced/09-config-toml.md) |
| Skills | 桌面 App / CLI / IDE | [技能与插件](/advanced/03-skills-plugins-mcp.md) |
| Worktrees | 桌面 App | [桌面 App](../start/05-app-overview.md) |
| Environments | Cloud / App | [Cloud / Web](../start/14-cloud.md) |
| Sandbox 与 Approvals | 全部入口 | [沙盒与审批](/advanced/07-sandbox-approvals.md) |


## 下一步

下一步：[ChatGPT 桌面 App 下载与安装](./02-app-installation.md)。
