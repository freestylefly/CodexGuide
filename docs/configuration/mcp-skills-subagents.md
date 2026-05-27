# MCP、Skills 与 Subagents

当你已经能稳定完成单次任务，下一步就是把 Codex 变成可扩展的工作系统：用 MCP 连接工具和数据源，用 Skills 固化流程，用 Subagents 拆分复杂工作。

::: tip 最后核对
官方资料最后核对日期：2026-05-27。本文参考 [Codex Skills](https://developers.openai.com/codex/skills)、[Codex 文档入口](https://developers.openai.com/codex/)、[openai/codex skills docs](https://github.com/openai/codex/blob/main/docs/skills.md) 与官方 MCP、Plugins、Subagents 相关页面。
:::

## 三个概念

| 能力 | 解决的问题 | 适合沉淀什么 |
| --- | --- | --- |
| MCP | 让 Codex 访问外部工具、系统或知识源 | GitHub、浏览器、内部文档、数据库只读查询 |
| Skills | 把一套流程写成可复用说明和脚本 | 代码审查、发布检查、文档生成、案例收集 |
| Subagents | 把一个复杂任务拆给多个 agent 并行处理 | 大型重构、多模块分析、验证与实现分离 |

## 什么时候用 MCP

当任务需要“当前工作区之外”的上下文时，优先考虑 MCP。

典型例子：

- 读 GitHub issue、PR、review comments。
- 打开浏览器检查本地页面。
- 查询内部知识库。
- 读取日历、邮件、文档、表格。
- 连接设计稿或项目管理系统。

使用前先问四个问题：

1. 这个工具是否真的需要接入 Codex？
2. Codex 需要读权限、写权限，还是只需要搜索？
3. 是否会接触凭据、客户数据或生产资源？
4. 输出是否需要人工复核后再写回外部系统？

::: info 截图占位
请补充 MCP 工具列表或配置截图，注意遮挡 token、内部域名和账号信息。建议文件：`docs/.vuepress/public/screenshots/config/04-mcp-list.png`。
:::

## 什么时候写 Skill

当你第三次复制同一段长提示词，就该考虑写 Skill。

适合写成 Skill 的流程：

- PR review：要求输出严重级别、文件行号、复现步骤、测试建议。
- 文档站更新：先读目录、再补内容、再跑构建、最后检查禁用句式。
- 案例收集：搜索、筛选、下载素材、去重、生成索引。
- 发布检查：版本号、变更日志、构建、冒烟测试、回滚说明。
- 数据分析：读取表格、清洗字段、生成图表、导出报告。

一个好的 Skill 通常包含：

- 触发场景。
- 工作步骤。
- 工具使用优先级。
- 输入和输出格式。
- 安全提醒。
- 示例任务。

## Skill 模板

```markdown
---
name: codex-pr-review
description: 当用户要求审查 PR、diff 或提交时使用，重点发现 bug、回归风险和缺失测试。
---

# Codex PR Review

## 触发场景

用户要求 review、审查、检查 diff、检查 PR。

## 工作流程

1. 先读取 git diff 和相关测试。
2. 优先找行为 bug、数据丢失、权限问题和缺失测试。
3. 输出 findings，按严重程度排序。
4. 没有问题时明确说明，并列出剩余风险。

## 输出格式

- Findings
- Open questions
- Test gaps
```

::: info 截图占位
请补充一个 Skill 文件结构截图。建议文件：`docs/.vuepress/public/screenshots/config/05-skill-structure.png`。
:::

## 什么时候用 Subagents

Subagents 适合边界明确、能并行推进的任务。关键是拆分职责，而不是简单地“多开几个 agent”。

适合：

- 一个 agent 分析后端接口，另一个 agent 分析前端调用。
- 一个 agent 实现文档页面，另一个 agent 检查官方来源。
- 一个 agent 做代码修改，另一个 agent 跑验证和整理失败日志。
- 大型迁移中按目录分配写入范围。

不适合：

- 下一个动作依赖某个分析结果。
- 修改同一批文件。
- 需求仍然模糊。
- 高风险操作需要人工连续判断。

## Subagents 分工模板

```text
请开启两个独立子任务：

Agent A：只读分析 `src/api`，输出接口变更风险，不修改文件。
Agent B：只读分析 `src/ui`，输出前端调用点，不修改文件。

主任务等待两个结果后，再决定是否实现。
```

如果允许写文件，要写清所有权：

```text
Agent A 只负责 `docs/platform/cli.md`。
Agent B 只负责 `docs/configuration/config-file.md`。

不要修改对方负责的文件。完成后列出改动文件、验证命令和剩余风险。
```

## Automations 放在哪里

Automations 适合周期性或延迟型任务：

- 每周检查文档死链。
- 每天汇总 failing CI。
- 30 分钟后回到当前线程继续跟进。
- 发布后第二天提醒补复盘。

写 automation prompt 时要让它自包含：

```text
检查 CodexGuide 仓库中的 Markdown 链接、VuePress 构建结果和禁用句式。输出发现的问题、涉及文件、建议修复方式和验证命令。
```

::: info 截图占位
请补充创建 automation 的截图。建议文件：`docs/.vuepress/public/screenshots/automation/01-create-automation.png`。
:::

## 安全清单

- 外部工具优先只读接入。
- 写回 GitHub、邮件、文档、数据库前保留人工确认。
- Skill 中不要写入 token、密钥、内部账号。
- MCP 服务要记录来源、权限和维护人。
- Subagents 写入文件时必须划清边界。
- Automation 要有明确输出，不要让它静默修改关键资源。

## 官方资料延伸

- [Codex skills](https://developers.openai.com/codex/skills)
- [openai/codex skills docs](https://github.com/openai/codex/blob/main/docs/skills.md)
- [Codex 文档入口](https://developers.openai.com/codex/)
