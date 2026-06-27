---
description: "Codex CLI 入口说明，介绍本地仓库修改、命令执行、测试验证、diff 检查和开发者日常使用场景。"
---

# CLI

CLI 是最适合建立 Codex 基本功的入口。它贴近本地仓库、终端命令和测试输出，能让你清楚看到 Codex 如何阅读上下文、修改文件、运行验证并解释结果。

::: tip 最后核对
官方资料最后核对日期：2026-05-27。本文参考 [Codex CLI features](https://developers.openai.com/codex/cli/features)、[openai/codex](https://github.com/openai/codex)、[CLI install](https://github.com/openai/codex/blob/main/docs/install.md)、[getting started](https://github.com/openai/codex/blob/main/docs/getting-started.md)、[exec](https://github.com/openai/codex/blob/main/docs/exec.md) 与 [slash commands](https://github.com/openai/codex/blob/main/docs/slash_commands.md)。
:::

## CLI 能做什么

- 只读理解仓库结构、入口、测试命令和风险点。
- 修改代码、文档、配置和测试。
- 运行 lint、typecheck、unit test、build 等验证命令。
- 在终端里查看 diff、调整审批策略、恢复会话。
- 通过 `codex exec` 执行标准化的一次性任务。
- 配合 `AGENTS.md`、`config.toml`、Skills、MCP 构建长期工作流。

## 推荐学习顺序

1. 安装 CLI 并完成登录。
2. 在陌生仓库中做一次只读总结。
3. 学会交互模式中的常用 Slash Commands。
4. 完成一次低风险修改，并运行验证。
5. 学会 `codex exec`，把可重复任务脚本化。
6. 增加 `AGENTS.md` 和本地 `config.toml`。

## 交互模式

进入项目根目录：

```bash
cd path/to/project
codex
```

第一轮建议不要直接让 Codex 改代码。先让它建立地图：

```text
请只读分析当前仓库，不要修改文件。

请输出：
1. 项目用途
2. 主要目录和入口文件
3. 安装、启动、测试、构建命令
4. 当前仓库对 Codex 来说最需要注意的风险
5. 适合第一次交给 Codex 的 5 个低风险任务
```

::: info 截图占位
请补充 CLI 只读仓库总结截图。建议文件：`docs/.vuepress/public/screenshots/cli/02-repo-summary.png`。
:::

## 非交互模式

`codex exec` 更适合批处理和自动化：

```bash
codex exec "请只读分析当前仓库，输出安装、测试和构建命令。不要修改文件。"
```

建议让输出格式稳定：

```text
请读取当前仓库，不要修改文件。

输出格式：
## 项目概览
## 本地运行
## 测试命令
## CI 风险
## 适合 Codex 处理的任务
```

适合脚本化的任务：

| 任务 | 产出 |
| --- | --- |
| 读取失败日志 | 失败测试名、报错摘要、下一步排查 |
| 总结 PR diff | 改动范围、风险、测试建议 |
| 生成 release notes | 用户可读版本说明 |
| 扫描文档 | 过期命令、断链、缺截图 |
| 检查仓库规则 | 是否缺 `AGENTS.md`、测试命令、贡献说明 |

::: info 截图占位
请补充 `codex exec` 执行一次只读任务的截图。建议文件：`docs/.vuepress/public/screenshots/cli/04-exec-readonly.png`。
:::

## Slash Commands

在 CLI 中输入 `/` 可以查看当前版本支持的命令。建议重点掌握：

- 查看状态：确认模型、目录、审批和沙盒。
- 查看 diff：每次准备提交前检查变更。
- 调整模型或审批：把复杂任务和高风险任务分开处理。
- 压缩或整理上下文：长任务进入下一阶段前使用。
- 退出和恢复：给下一轮留下清晰任务总结。

::: info 截图占位
请补充输入 `/` 后的命令列表截图。建议文件：`docs/.vuepress/public/screenshots/cli/05-slash-commands.png`。
:::

## CLI 任务模板

### 修复失败测试

```text
请修复当前仓库中最小范围的一个测试失败。

要求：
1. 先运行测试，确认失败信息。
2. 阅读相关代码和测试，不做无关重构。
3. 修改最少必要文件。
4. 修复后重新运行相关测试。
5. 最后总结失败原因、修改文件、验证命令和剩余风险。
```

### 文档更新

```text
请更新 README 中的本地开发说明。

要求：
1. 先读取 package manager、脚本和现有 README。
2. 不改业务代码。
3. 更新安装、启动、测试和构建命令。
4. 运行文档站构建或 Markdown 检查。
5. 输出改动摘要和需要人工截图的位置。
```

### PR Review

```text
请 review 当前 git diff，不要修改文件。

优先输出：
1. 会导致行为错误的问题
2. 安全和权限风险
3. 缺失测试
4. 文档或迁移遗漏
```

## 和配置专题的关系

CLI 入门后，建议继续读：

- [CLI 选项与命令](/configuration/cli-options.md)
- [配置文件 config.toml](/configuration/config-file.md)
- [沙盒与审批](/guide/17-sandbox-approvals.md)

## 实践判断

- 新仓库先只读，熟悉后再允许写入。
- 每个任务都写清“允许改哪里、不要改哪里、怎么验证”。
- Codex 没有验证成功时，不要把结果当成已完成。
- 复杂任务分阶段，不要一次塞进所有需求。
- 重要变更一定回到 `git diff` 和测试结果。
