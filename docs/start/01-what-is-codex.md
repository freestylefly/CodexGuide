---
description: "Codex 入口地图，比较 CLI、桌面 App、Cloud、IDE、ChatGPT 和集成生态，帮助选择合适工作入口。"
---

::: tip 最后核对
官方资料最后核对日期：2026-09-02。参考 [Codex 产品介绍](https://openai.com/codex/)、[Codex 官方文档总览](https://learn.chatgpt.com/docs/)、[openai/codex 源代码仓库](https://github.com/openai/codex) 与 [Codex 与 ChatGPT 套餐帮助中心](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)。
:::

# Codex 是什么

Codex 是一个具备多个产品形态的Agent。涵盖桌面端APP，CLI，Web云端，IDE。

![Codex 使用入口地图](https://cdn.canghecode.com/codexguide/docs/.vuepress/public/images/codex-surfaces.svg?v=20260611)

## 入口对照表

| 入口 | 更适合 | 典型任务 | 学习优先级 |
| --- | --- | --- | --- |
| [CLI](../start/10-cli-installation.md) | 本地快速迭代 | 修 bug、补测试、跑命令、解释仓库 | 新手优先 |
| [桌面 App](../start/05-app-overview.md) | 本地多任务工作台 | 多 agent、Skills、Automations、插件协作 | 进阶优先 |
| [Cloud / Web](../start/14-cloud.md) | 较长任务和并行任务 | 仓库任务、PR、后台分析 | 团队优先 |
| [IDE](../start/13-ide-vscode.md) | 编辑器上下文 | 局部修改、解释、代码审查 | 日常高频 |
| [ChatGPT 中的 Codex](../start/01-what-is-codex.md) | 面向仓库的任务分派 | 连接 GitHub、理解仓库、协作推进 | 按账号能力选择 |

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
4. 阅读 [CLI 选项](/start/12-cli-options.md) 和 [config.toml](/advanced/09-config-toml.md)，补上配置基本功。
5. 把高频模板沉淀到 `AGENTS.md`、案例库和团队规范。

## 入口和配置的关系

| 配置主题 | 主要影响入口 | 学习页 |
| --- | --- | --- |
| `AGENTS.md` | CLI / 桌面 App / Cloud | [AGENTS.md](/advanced/02-agents-md.md) |
| CLI 选项 | CLI | [CLI 选项与命令](/start/12-cli-options.md) |
| `config.toml` | CLI | [配置文件 config.toml](/advanced/09-config-toml.md) |
| Skills | App / CLI | [技能与插件](/advanced/03-skills-plugins-mcp.md) |
| Worktrees | 桌面 App | [桌面 App](../start/05-app-overview.md) |
| Environments | Cloud / App | [Cloud / Web](../start/14-cloud.md) |
| Sandbox 与 Approvals | 全部入口 | [沙盒与审批](/advanced/07-sandbox-approvals.md) |


## 下一步

下一步：[Codex 桌面 App 下载与安装](./02-app-installation.md)。
