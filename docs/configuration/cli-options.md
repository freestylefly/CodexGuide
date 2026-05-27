# CLI 选项与命令

CLI 是 Codex 最适合练基本功的入口。本页按官方教程的逻辑，把交互模式、非交互模式、会话恢复、Slash Commands 和常用启动参数整理成中文实操版。

::: tip 最后核对
官方资料最后核对日期：2026-05-27。本文参考 [Codex CLI features](https://developers.openai.com/codex/cli/features)、[Codex CLI 官方仓库](https://github.com/openai/codex)、[CLI getting started](https://github.com/openai/codex/blob/main/docs/getting-started.md)、[exec 文档](https://github.com/openai/codex/blob/main/docs/exec.md) 与 [slash commands 文档](https://github.com/openai/codex/blob/main/docs/slash_commands.md)。
:::

## 三种使用姿势

| 模式 | 适合任务 | 典型命令 |
| --- | --- | --- |
| 交互模式 | 学习仓库、逐步改代码、需要随时打断 | `codex` |
| 一次性任务 | CI、脚本、批量分析、生成摘要 | `codex exec "任务说明"` |
| 恢复会话 | 延续之前上下文、继续未完成任务 | `codex resume` |

## 交互模式

进入项目根目录后运行：

```bash
codex
```

建议第一句话先限定边界：

```text
请先阅读当前仓库，不要修改文件。请告诉我：
1. 项目用途
2. 入口文件
3. 安装、构建和测试命令
4. 你建议优先补齐的 5 个文档或测试任务
```

交互模式最适合学习 Codex 的思考过程。你可以在它准备执行命令前停下来，确认命令意图，也可以把任务拆成多轮推进。

::: info 截图占位
请补充交互模式启动后的首轮仓库分析截图。建议文件：`docs/.vuepress/public/screenshots/cli/03-interactive-start.png`。
:::

## 非交互模式：`codex exec`

`codex exec` 适合把 Codex 放进脚本、CI 或重复任务里。例如：

```bash
codex exec "请阅读 README 和 package.json，输出本项目的本地启动命令和测试命令。不要修改文件。"
```

适合的场景：

- 批量生成仓库摘要。
- 在 CI 失败后自动收集失败原因。
- 为 release notes 生成初稿。
- 从日志中提取排障建议。
- 为多个模块生成统一格式的文档草稿。

写 `exec` 任务时要更明确，因为它没有交互追问的空间：

```text
请只读分析当前仓库，不要修改文件。

输出格式：
1. 项目概览：不超过 120 字
2. 技术栈：表格
3. 本地启动：列出命令和前置条件
4. 测试命令：按单元测试、集成测试、类型检查分类
5. 风险提示：最多 5 条
```

::: info 截图占位
请补充 `codex exec` 只读输出截图。建议文件：`docs/.vuepress/public/screenshots/cli/04-exec-readonly.png`。
:::

## 恢复与继续

长任务经常需要分段推进。建议在每个阶段结束时让 Codex 输出：

- 已读文件。
- 已改文件。
- 已运行命令。
- 尚未完成的下一步。
- 当前风险。

下次恢复时，把上一段总结作为第一条消息，能显著减少上下文断裂。

示例：

```text
继续上一次任务。上一阶段已经完成：
- 已定位失败测试：...
- 已修改文件：...
- 已运行命令：...

请现在只处理下一步：补充边界测试，并运行相关测试。
```

## Slash Commands

Slash Commands 用于在 CLI 会话中快速查看状态、调整行为或执行常用动作。不同版本命令列表可能会变化，最稳妥的方式是在 CLI 内输入 `/` 查看当前可用命令。

常见使用方式：

| 命令类型 | 作用 | 使用建议 |
| --- | --- | --- |
| 状态类 | 查看模型、审批、工作区状态 | 每次重要修改前看一次 |
| 上下文类 | 查看或压缩上下文 | 长任务进入下一阶段时使用 |
| Git 类 | 查看 diff 或变更摘要 | 提交前配合人工 review |
| 权限类 | 查看审批策略 | 涉及安装、网络、删除前检查 |
| 会话类 | 退出、恢复、重开 | 任务结束时留下清晰总结 |

::: info 截图占位
请补充输入 `/` 后的命令列表截图。建议文件：`docs/.vuepress/public/screenshots/cli/05-slash-commands.png`。
:::

## 启动参数的理解方式

官方 CLI 版本更新较快，参数名和默认值请以 `codex --help` 与官方文档为准。学习时可以按用途理解：

| 参数类别 | 解决的问题 | 例子 |
| --- | --- | --- |
| 模型选择 | 当前任务需要更强推理或更快响应 | 复杂重构用高推理，文档整理用常规设置 |
| 沙盒设置 | 控制文件系统、网络、命令权限 | 只读分析、工作区写入、受限网络 |
| 审批策略 | 控制哪些命令需要人工确认 | 删除、安装依赖、外部网络访问 |
| 配置覆盖 | 临时覆盖 config.toml | 对单次任务使用特殊 profile |
| 输出格式 | 适配脚本或自动化 | `exec` 输出 Markdown、JSON 或固定结构 |

建议在教程截图中保留两张图：

::: info 截图占位
请补充 `codex --help` 输出截图。建议文件：`docs/.vuepress/public/screenshots/cli/06-help.png`。
:::

::: info 截图占位
请补充 `codex exec --help` 输出截图。建议文件：`docs/.vuepress/public/screenshots/cli/07-exec-help.png`。
:::

## 任务设计模板

### 只读分析

```text
请只读分析当前仓库，不要修改文件，不要运行会写入文件的命令。

请输出：
1. 项目结构
2. 关键命令
3. 风险点
4. 适合 Codex 处理的低风险任务清单
```

### 小修复

```text
请修复 [具体问题]。

范围：
- 允许修改：[目录/文件]
- 避免修改：[目录/文件]

要求：
1. 先复现问题。
2. 修改最小必要代码。
3. 运行 [验证命令]。
4. 总结原因、改动、验证和风险。
```

### 自动化摘要

```bash
codex exec "请阅读最近一次测试失败日志，提取失败测试名、关键报错、可能原因和下一步排查建议。不要修改文件。"
```

## 学习重点

- 交互模式适合探索和校准。
- `exec` 适合标准化输出和自动化。
- Slash Commands 是观察 Codex 状态的窗口。
- 会话恢复前先写阶段总结。
- 参数变化以当前 CLI 帮助和官方文档为准。
