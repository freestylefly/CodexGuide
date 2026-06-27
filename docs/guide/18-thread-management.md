---
description: "Codex 自动线程管理指南：解释 thread、resume、fork、worktree、handoff 和 subagent 的层级关系，帮助你在正确的地方继续、分叉和移交任务。"
redirectFrom:
  - /guide/17-thread-management.html
---

# 自动线程管理

在 Codex 里，一次对话就是一个 **thread**（会话/线程）。你平时可以手动新建、继续或归档它；在桌面端，Codex 也能通过线程管理工具，主动整理、分叉、移交或跟进多个线程。

这类能力适合处理长期任务、后台跟进和多路线探索。并且线程拥有独立的上下文。这意味着分配任务给子线程将避免受到上下文的干扰，缓解Codex总是写出100%通过的测试的问题。

![Codex 自动线程管理工具示例](https://cdn.canghecode.com/codexguide/docs/images/codex-auto-thread-management-tools-watermarked-small.png)

::: tip 最后核对
官方资料最后核对日期：2026-06-25。本文参考 [Kimi Code Agents and Sub-Agents](https://moonshotai.github.io/kimi-code/en/customization/agents)、[OpenAI Codex Subagents](https://developers.openai.com/codex/subagents)、[Codex CLI features](https://developers.openai.com/codex/cli/features) 和 [Codex App Worktrees](https://developers.openai.com/codex/app/worktrees) 整理。不同版本的 App、CLI 和移动端界面可能会变化，请以当前客户端为准。
:::

## 四个概念

| 概念 | 是什么 | 典型用法 |
| --- | --- | --- |
| **Thread** | 线程。用户可见的会话，有独立历史记录 | 长期任务、后台运行、稍后继续 |
| **Worktree** | Git 工作树，多个并行的代码检出 | 让 Codex 在后台改代码，不打扰当前工作区 |
| **Handoff** | 把 thread 及其 Git 状态移到另一个位置 | 在 local、worktree 或远程 host 之间切换 |
| **Subagent** | 主任务中临时派生的子代理 | 并行分析、审查、验证同一任务的不同方面 |

核心一句话：**thread 是长期任务线，worktree 是并行代码工作区，handoff 负责把任务搬到合适的位置，subagent 是单次任务里的临时协作者。**

## 线程管理工具

下面这组工具来自 Codex APP。主要用于让 Codex 在后台主动查找、继续或管理会话。**它们不是对外公开的 CLI 命令或 API，而是内置的。命名和可用性可能随客户端版本变化。**

| 工具 | 用途 |
| --- | --- |
| `list_threads` | 列出最近线程，可按关键词查找。 |
| `read_thread` | 读取某线程的最近状态、摘要和历史片段。 |
| `send_message_to_thread` | 向已有线程发送后续指令，让它在后台继续。 |
| `set_thread_title` | 重命名线程。 |
| `set_thread_pinned` | 置顶或取消置顶线程。 |
| `set_thread_archived` | 归档或取消归档线程。 |
| `fork_thread` | 从当前或指定线程分叉出新线程；可在同目录，也可新建 worktree。 |
| `handoff_thread` | 把线程及其 Git 状态移交到本机、远程 host 或 worktree。 |
| `get_handoff_status` | 查询移交流程进度。 |
| `list_projects` | 列出可用于创建后台线程的本地/远程项目。 |

你可以试着对 Codex 说：“帮我归档超过一周的线程。”它做的事情和你手动整理会话没有本质区别，只是由 Codex 根据当前目标主动判断下一步。

## 与 Subagent 的区别

自动线程管理和 Subagent 都能让 Codex 同时处理多个任务线，但层级不同。

| 对比项 | Thread | Subagent |
| --- | --- | --- |
| 管理对象 | 用户可见的会话 | 当前任务里临时生成的子代理 |
| 主要用途 | 查找、继续、分叉、移交会话 | 并行探索、审查、验证、拆分复杂问题 |
| 生命周期 | 可长期保留，出现在历史列表里 | 通常随一次主任务创建、汇总、关闭 |
| 文件与沙盒 | 可关联 worktree、branch 或 PR | 继承主任务的沙盒和审批策略 |
| 上下文机制 | 独立 transcript，拥有自己的完整历史 | 接收主 Agent 传入的任务描述，中间过程不会完整混入主上下文 |

一句话：**thread 是你长期整理的任务线，subagent 是 Codex 在单次任务里临时叫来的协作者。**


## 最佳实践

通过以下步骤，配合`/goal`，可以充分发挥自动线程管理的能力：
1. **文档驱动开发。** 新建 `docs/` 文件夹存放`PRD.md`、`TRD.md`、`REQUIREMENT.md` 等项目文档，并用 `AGENTS.md` 告诉 Codex 应该先读哪些文件。
2. **规范工作行为。** 用 `GUIDE.md` 或项目规则写明工作准则，例如“应当在独立 Git 分支工作”“提交前必须跑测试”。
3. **任命主线程。** 让主线程承担调度角色：分配工作给其他线程、撰写提示词，并监控运行情况。
4. **合理设置检查频率。** 如果主线程需要查看后台进展，可以约定检查间隔，例如每 3 分钟一次。频率过高会浪费上下文和 token。
5. **记录日志。** 在提示词里要求 Codex 记录工作日志，尤其是文档之外需要它判断的关键决策。
6. **定期复盘。** 通过查看日志和实际决策，找出卡住或低效的原因，再改进文档、规则。
