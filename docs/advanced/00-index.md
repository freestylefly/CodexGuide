---
pageClass: cg-directory
description: "Codex 进阶教程总览，整理费用上下文、AGENTS.md、Skills、权限管理、自动化、Hooks、沙盒、配置、团队协作和排障路径。"
permalink: /advanced/
---

<SectionIntro section="advanced" />

::: tip 最后核对
官方资料最后核对日期：2026-10-12。本页是进阶教程索引，涉及费用、上下文、AGENTS.md、Skills、Plugins、权限、自动化、Hooks、沙盒、线程管理、配置和团队实践的细节，请以 [ChatGPT 与 Codex 文档入口](https://learn.chatgpt.com/docs) 与各章节引用的官方资料为准。
:::

# 进阶教程

相信你已经通过[快速上手](../start/00-index.md)，完成了自己的第一个 Codex 任务。

如果你仍有好奇心，可以按照下面的顺序，深入了解 Codex 的各个方面。其中关于任务拆分、上下文管理、项目规则和安全边界的方法，也可以迁移到 Claude Code、Kimi Code 等其他 Agent 工具；具体的配置项和功能入口则以 Codex 为准。


## 推荐顺序

1. [理解费用与上下文](./01-cost-context.md)
2. [AGENTS.md](./02-agents-md.md)
3. [Skills 和 Plugins](./03-skills-plugins-mcp.md)
4. [权限管理](./04-permissions-security.md)
5. [Scheduled tasks（计划任务）](./05-automation.md)
6. [Hooks](./06-hooks.md)
7. [沙盒与审批](./07-sandbox-approvals.md)
8. [自动线程管理](./08-thread-management.md)
9. [配置文件 config.toml](./09-config-toml.md)
10. [团队实践](./10-team-playbook.md)
11. [排障手册](./11-troubleshooting.md)

## 按需求阅读

你不必严格按顺序读完所有章节，也可以根据当前问题直接选择：

- 想理解费用，避免上下文失控：先看[理解费用与上下文](./01-cost-context.md)。
- 想让 Codex 遵守项目规范：先看 [AGENTS.md](./02-agents-md.md)。
- 想设置权限与安全边界：连续阅读[权限管理](./04-permissions-security.md)和[沙盒与审批](./07-sandbox-approvals.md)。
- 想自动执行重复工作：阅读 [Scheduled tasks（计划任务）](./05-automation.md)和 [Hooks](./06-hooks.md)。
- 想组织长期或并行任务：阅读[自动线程管理](./08-thread-management.md)。
- 想在团队中推广 Codex：阅读[团队实践](./10-team-playbook.md)。

## 学完能做到什么

- 理解 token、上下文、缓存和成本。更清楚 Codex 是如何计费的。
- 了解 `AGENTS.md` 。知晓其作为常驻提示词的重要性。
- 了解 Skills 和 Plugins。了解规范，并能在实际项目中灵活运用这些强大的拓展工具。
- 了解APP页面的权限管理。明白为什么`Auto-Review`如此实用。
- 了解自动化。让 Codex 定时帮你干活。
- 了解 Hooks。让你能在 Codex 执行过程中插入自定义逻辑。
- 了解沙盒与审批。更进一步了解 Codex 的安全边界。
- 了解自动线程管理。明白作为Codex APP的一大特色功能如何重新改变工作流。
- 了解配置文件 `config.toml`。了解核心字段的影响
- 提供团队实践。让 Codex 进入生产环境开发的团队开发。
- 提供排障手册。帮助你快速定位和解决问题。

## 下一步

下一步：[理解费用与上下文](./01-cost-context.md)。
