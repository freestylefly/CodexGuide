---
description: "Codex 团队实践指南，整理 AGENTS.md、PR、排障、知识库、任务模板和团队推广的协作方法。"
---

# 团队实践

团队使用 Codex 的关键是把规则写清楚、把验证跑起来、把案例沉淀下来。

![Codex 安全边界分层](https://cdn.canghecode.com/codexguide/docs/.vuepress/public/images/codex-safety-layers.svg)

## 团队接入清单

| 项目 | 建议 |
| --- | --- |
| `AGENTS.md` | 写清项目结构、命令、风格、安全边界 |
| 测试命令 | 提供最小相关测试和全量测试命令 |
| PR 模板 | 要求说明 Codex 参与范围、验证结果和风险 |
| 安全规则 | 明确生产数据、密钥、发布、迁移的审批要求 |
| 案例库 | 把成功任务和失败复盘都沉淀下来 |

## 团队版 AGENTS.md 提纲

```markdown
# AGENTS.md

## 项目概览

## 常用命令

## 目录边界

## 代码规范

## 测试要求

## 安全边界

## PR 交付要求
```

## 共享规则与个人偏好

团队的共同规则建议放进 `AGENTS.md`，例如项目结构、命令、测试要求、目录边界和安全红线。个人本机路径、私有工具习惯、临时限制和回复偏好，可以参考 [团队共享规则和本地私有规则](/guide/16-agents-md.html#团队共享规则和本地私有规则) 拆到 `AGENTS.local.md`。

如果团队允许使用社区工具，可以评估 [codex-agents-local](https://github.com/samzong/codex-agents-local)。使用前先确认 `AGENTS.local.md` 和 `AGENTS.override.md` 已加入 ignore，并让 Codex 审查安装步骤对 `~/.local/bin` 与 `~/.codex/hooks.json` 的影响。

## PR 描述模板

```markdown
## 背景

## 改动

## Codex 参与范围

## 验证

## 风险

## 截图或日志
```

## 例会复盘问题

- 哪类任务 Codex 表现稳定？
- 哪类任务容易失控或需要更强约束？
- 哪些命令、规则、截图说明应该写入 `AGENTS.md`？
- 哪些成功案例可以沉淀成模板？
- 哪些失败案例应该写入排障手册？

::: info 截图占位
请补充团队 PR 中 Codex 参与说明的截图。建议文件：`docs/.vuepress/public/screenshots/cloud/03-pr-codex-summary.png`。
:::
