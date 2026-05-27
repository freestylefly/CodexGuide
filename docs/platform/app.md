# 桌面 App（电脑端）

这里的桌面 App 指电脑端客户端，不是手机 App。它更像一个本地 Codex 工作台，适合在一个项目里管理多条任务线：你可以让不同 agent 并行探索、实现、验证，也可以用 Skills、Automations、Worktrees 和插件化能力沉淀长期流程。

::: tip 最后核对
官方资料最后核对日期：2026-05-27。本文参考 [Codex 桌面 App 文档](https://developers.openai.com/codex/app)、[Codex 文档入口](https://developers.openai.com/codex/)、[Codex Skills](https://developers.openai.com/codex/skills) 与 [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/)。
:::

## 桌面 App 适合什么

- 本地仓库中的长任务和多阶段任务。
- 同时推进多个不互相阻塞的任务。
- 使用 Worktrees 隔离不同实现分支。
- 把重复流程写成 Skills。
- 用 Automations 做提醒、定期检查或后续跟进。
- 配合浏览器、文档、表格、演示文稿等插件做跨工具工作。

::: info 截图占位
请补充桌面 App 项目工作区截图。建议文件：`docs/.vuepress/public/screenshots/app/01-workspace.png`。
:::

## 核心能力地图

| 能力 | 用途 | 学习重点 |
| --- | --- | --- |
| Projects | 组织本地工作区和任务历史 | 每个项目都先确认 Git 状态 |
| Agents | 分配探索、实现、验证任务 | 并行任务要有清晰边界 |
| Worktrees | 隔离不同分支的文件改动 | 适合多方案对比和长任务 |
| Local Environments | 为任务准备依赖、命令、环境 | 写清安装、构建、测试步骤 |
| Review | 检查 diff 和结果 | 先看风险，再看风格 |
| Skills | 固化复杂流程 | 把高频提示词变成可复用能力 |
| Automations | 延迟或周期性任务 | 输出要自包含，避免静默改动 |
| In-app Browser / Computer Use | 检查页面、点击操作、截图验证 | 适合前端和资料核对任务 |

## 一个推荐的本地任务流

1. 打开项目，确认分支和未提交改动。
2. 让 Codex 只读总结仓库结构。
3. 把任务拆成探索、实现、验证。
4. 需要并行时，为每个 agent 指定文件范围。
5. 修改后运行验证命令。
6. Review diff，并要求 Codex 输出风险和剩余问题。
7. 把成功流程沉淀为 Skill 或案例。

::: info 截图占位
请补充一次多 agent 分工截图。建议文件：`docs/.vuepress/public/screenshots/app/02-agents-skills.png`。
:::

## Worktrees 的使用场景

Worktrees 适合处理“多个方向都值得试”的任务：

- 两种实现方案对比。
- 修复同一个 bug 的不同思路。
- 同时推进文档和代码改动。
- 长任务中保留一个干净分支。

实践建议：

- 每个 worktree 只处理一个目标。
- 分支名体现任务，例如 `codex/fix-login-test`。
- 合并前让 Codex 总结两个方案差异。
- 不要让多个任务同时修改同一批核心文件。

::: info 截图占位
请补充 Worktrees 列表或创建截图。建议文件：`docs/.vuepress/public/screenshots/app/03-worktrees.png`。
:::

## Local Environments

Local Environments 关注“Codex 在哪里运行、有哪些依赖、能运行哪些命令”。对于知识库教程，你可以把它理解为任务可复现性的基础。

建议为项目整理：

- 依赖安装命令。
- 测试命令。
- 构建命令。
- 需要的系统服务。
- 必需环境变量的占位说明。
- 禁止暴露的 secret 清单。

::: info 截图占位
请补充 Local Environments 设置截图。建议文件：`docs/.vuepress/public/screenshots/app/04-local-environments.png`。
:::

## Skills 与 Automations

桌面 App 很适合把经验固化下来。

适合写 Skill：

- PR review。
- 文档站构建检查。
- 前端截图验证。
- 案例收集。
- 发布前 checklist。

适合做 Automation：

- 每周检查文档断链。
- 每天汇总失败 CI。
- 任务完成后隔天提醒补复盘。
- 定期检查官方文档更新。

::: info 截图占位
请补充 Skills 或 Automations 页面截图。建议文件：`docs/.vuepress/public/screenshots/app/05-skills-automations.png`。
:::

## 适合非开发者的任务

- 把技术 PR 改写成产品发布说明。
- 梳理项目文档缺口。
- 生成会议前技术背景材料。
- 从 issue 中提取行动项。
- 检查知识库结构是否适合新手阅读。

## 风险边界

- 并行 agent 写文件前必须划清文件范围。
- 涉及删除、安装依赖、网络访问、发布部署时保留人工确认。
- 截图和日志进入开源仓库前要遮挡敏感信息。
- Automation 要有明确输出，不要默认写回外部系统。

## 官方资料

- [Codex 桌面 App 文档](https://developers.openai.com/codex/app)
- [Codex Skills](https://developers.openai.com/codex/skills)
- [Codex security](https://developers.openai.com/codex/agent-approvals-security)
