---
description: "Codex CLI 选项与命令指南，覆盖交互模式、非交互执行、恢复会话、Slash Commands 和常用启动参数。"
---

::: tip 最后核对
官方资料最后核对日期：2026-10-12。本文参考 [Codex CLI 概览](https://learn.chatgpt.com/docs/codex/cli)、[Developer commands / CLI Reference](https://learn.chatgpt.com/docs/developer-commands?surface=cli) 与 [Codex CLI 官方仓库](https://github.com/openai/codex)。CLI 更新较快，具体参数仍应以当前版本的 `codex --help` 和子命令帮助为准。
:::

# CLI 选项与命令

CLI 是 Codex 最适合练基本功的入口。本页按官方教程的逻辑，把交互模式、非交互模式、会话恢复、Slash Commands 和常用启动参数整理成中文实操版。


## 三种常见使用姿势

| 模式 | 适合任务 | 典型命令 |
| --- | --- | --- |
| 交互模式 | 学习仓库、逐步改代码、需要随时打断 | `codex` |
| 一次性任务 | CI、脚本、批量分析、生成摘要 | `codex exec "任务说明"` |
| 恢复会话 | 延续之前上下文、继续未完成任务 | `codex resume` |

上面列出的是三种最常见的使用方式。除此之外，Codex CLI 还提供 `review`、`fork`、`doctor`、`features`、`mcp`、`plugin`、`sandbox` 等子命令。后文会挑选其中常用的命令进行介绍。

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

## 恢复与继续

长任务经常需要分段推进。`codex resume` 会恢复已保存的交互会话和上下文，不需要手动复制上一轮对话：

```bash
# 打开会话选择器
codex resume

# 恢复当前目录最近一次交互会话
codex resume --last

# 按会话 ID 或会话名称恢复
codex resume <SESSION_ID_OR_NAME>

# 选择其他目录中的会话
codex resume --all
```

如果要继续之前的非交互任务，使用：

```bash
codex exec resume --last "请继续处理下一步，并运行相关测试。"
```

默认情况下，`codex resume --last` 会恢复当前工作目录中最近一次交互会话。如果要查找其他目录中的会话，可以加上 `--all`；如果还要把 `codex exec` 产生的非交互会话包含进来，可以加上 `--include-non-interactive`。

恢复会话时，Codex 会自动带上之前的上下文，通常不需要手动整理。不过，如果任务需要交给别人继续、会暂停较长时间，或者需要留下单独的工作记录，建议在每个阶段结束时让 Codex 总结：

- 已读文件。
- 已改文件。
- 已运行命令。
- 尚未完成的下一步。
- 当前风险。

例如：

```text
继续上一次任务。上一阶段已经完成：
- 已定位失败测试：...
- 已修改文件：...
- 已运行命令：...

请现在只处理下一步：补充边界测试，并运行相关测试。
```

## Slash Commands

Slash Commands 用于在 CLI 会话中快速查看状态、调整行为或执行常用动作。不同版本命令列表可能会变化，最稳妥的方式是在 CLI 内输入 `/` 查看当前可用命令。

可以先按用途理解这些命令：

| 命令类型  | 作用                | 常见命令                                   | 使用建议             |
| ----- | ----------------- | -------------------------------------- | ---------------- |
| 状态与设置 | 查看当前状态，切换模型或调整权限  | `/status`、`/model`、`/permissions`      | 重要修改前先确认当前设置     |
| 上下文管理 | 压缩上下文，或开始一段新会话    | `/compact`、`/clear`                    | 长任务进入下一阶段时使用     |
| 代码检查  | 查看文件改动并检查潜在问题     | `/diff`、`/review`                      | 提交或交付前配合人工检查     |
| 任务管理  | 设置和管理需要持续推进的目标    | `/goal`                                | 适合步骤较多、完成标准明确的任务 |
| 扩展能力  | 查看代理、应用、插件和 Hooks | `/agent`、`/apps`、`/plugins`、`/hooks`   | 需要调用扩展能力时使用      |
| 会话管理  | 复制回答，或整理已经保存的会话   | `/copy`、`/rename`、`/archive`、`/delete` | 复制结果或整理历史会话时使用   |

## 启动参数的理解方式

官方 CLI 版本更新较快，参数名和默认值请以 `codex --help` 与官方文档为准。学习时不必一次记住所有参数，可以先按用途理解：

| 参数类别 | 解决的问题 | 常用参数 | 例子 |
| --- | --- | --- | --- |
| 模型选择 | 当前任务需要更强推理或更快响应 | `--model`、`-m` | 复杂重构用高推理，文档整理用常规设置 |
| 沙盒设置 | 控制文件系统、网络和命令权限 | `--sandbox`、`-s`、`--add-dir` | 只读分析、工作区写入、受限网络 |
| 审批策略 | 控制哪些操作需要人工确认 | `--ask-for-approval`、`-a` | 删除文件、安装依赖或访问外部网络前先确认 |
| 配置覆盖 | 临时覆盖 `config.toml` 中的设置 | `--config`、`-c`、`--profile`、`-p` | 为单次任务选择特殊模型或 Profile |
| 输出格式 | 让执行结果便于脚本继续处理 | `--json`、`--output-last-message`、`--output-schema` | 输出 JSONL、写入文件或按固定结构返回 |

其中，`--sandbox` 支持 `read-only`、`workspace-write` 和 `danger-full-access` 三种模式。如果无人值守任务只需要修改当前项目，优先使用 `--sandbox workspace-write`。

`--dangerously-bypass-approvals-and-sandbox`（别名 `--yolo`）会同时关闭审批和沙盒保护，只有在已经做好隔离的环境中才应使用。

### `codex exec` 常用参数

刚开始使用 `codex exec` 时，可以先记住下面几个常用参数。它们分别用来保存结果、控制输出格式和限制文件权限：

```bash
# 让脚本能够逐行读取 Codex 的执行过程
codex exec --json "请运行测试并总结失败原因"

# 把 Codex 最后的回答保存到 result.md
codex exec -o result.md "请生成项目检查报告"

# 要求 Codex 按 schema.json 中规定的格式返回结果
codex exec --output-schema schema.json "请分析测试结果"

# 只允许读取文件
codex exec --sandbox read-only "请分析当前项目，不要修改文件"

# 本次任务结束后，不在本地保存会话记录
codex exec --ephemeral "请执行一次临时检查"
```

如果只是日常使用，先掌握 `-o` 和 `--sandbox` 就够了。`--json` 和 `--output-schema` 主要用于脚本或 CI 自动化，其中 JSON Schema 是一份用来规定返回内容格式的文件。

另外，`codex e` 是 `codex exec` 的简写。你可能还会在旧教程里看到 `--full-auto`，但这个参数已经不再推荐使用。需要让 Codex 自动修改当前项目时，建议改用 `--sandbox workspace-write`。

## 常用子命令速查

| 命令                                | 作用                                 |
| --------------------------------- | ---------------------------------- |
| `codex review`                    | 非交互检查未提交改动、分支差异或指定提交               |
| `codex fork`                      | 从历史会话创建分支，同时保留原会话                  |
| `codex doctor`                    | 生成安装、配置、认证和运行环境诊断报告                |
| `codex features`                  | 查看、启用或停用功能标志                       |
| `codex mcp`                       | 管理 MCP 服务器                         |
| `codex plugin`                    | 安装、查看或移除插件                         |
| `codex sandbox`                   | 在 Codex 使用的原生沙盒中运行命令               |
| `codex completion`                | 生成 Bash、Zsh、Fish 或 PowerShell 补全脚本 |
| `codex archive`、`codex unarchive` | 归档或恢复已保存的会话                        |
| `codex delete`                    | 永久删除已保存的会话                         |
| `codex update`                    | 在当前安装版本支持时检查并执行更新                  |

CLI 还包含实验性命令。判断一个命令是否适合正式流程时，应同时查看官方命令表中的成熟度标记。

## 交互快捷操作

| 操作 | 作用 |
| --- | --- |
| 输入 `@` | 搜索工作区文件并把路径加入提示词 |
| 以 `!` 开头 | 在当前权限和沙盒设置下运行本地命令 |
| `Ctrl+R` | 搜索输入历史 |
| `Ctrl+O` | 复制最新一条完整回答，效果与 `/copy` 相同 |
| Codex 工作时按 `Tab` | 把消息、Slash Command 或 Shell 命令排到下一轮 |
| Codex 工作时按 `Enter` | 向当前轮即时补充指令 |
| 空输入框连续按两次 `Escape` | 编辑上一条用户消息，并从该位置分叉会话 |
| `Ctrl+C` | 退出会话，效果与 `/exit` 相同 |


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
- `codex resume` 会恢复会话上下文；阶段总结主要用于协作、留档和长期任务交接。
- 参数变化以当前 CLI 帮助和官方文档为准。

## 下一步

下一步：[在 VS Code 中使用 Codex](./13-ide-vscode.md)。
