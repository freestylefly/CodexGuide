---
description: "Codex 配置与扩展总览，梳理 AGENTS.md、CLI 选项、config.toml、requirements.toml 和团队配置路径。"
---

# 配置与扩展总览

Codex 的学习曲线有两个阶段：先会用，再会配置。会用解决单次任务，会配置能把 Codex 变成稳定的个人工作台和团队协作工具。

::: tip 最后核对
官方资料最后核对日期：2026-06-27。本文参考 [Codex 文档入口](https://developers.openai.com/codex/)、[Codex CLI features](https://developers.openai.com/codex/cli/features)、[基础配置](https://developers.openai.com/codex/config-basic)、[高级配置](https://developers.openai.com/codex/config-advanced)、[Configuration Reference](https://developers.openai.com/codex/config-reference)、[AGENTS.md](https://developers.openai.com/codex/guides/agents-md) 与 [Managed configuration](https://developers.openai.com/codex/enterprise/managed-configuration)。
:::

![Codex 配置地图](https://cdn.canghecode.com/codexguide/docs/.vuepress/public/images/codex-config-map.svg)

## 先理解四层配置

| 层级 | 典型文件或入口 | 解决的问题 | 初学者建议 |
| --- | --- | --- | --- |
| 项目规则 | `AGENTS.md`、`.codex/config.toml` | 让 Codex 理解仓库约定、测试命令、目录边界 | 每个重要仓库都写一份；项目级 `.codex/` 只在信任项目后加载 |
| 本地配置 | `~/.codex/config.toml`、profile config | 设置模型、profiles 和常用默认项 | 先保守，再按任务调整 |
| CLI 入口 | 命令参数、Slash Commands | 控制交互模式、非交互模式和会话状态 | 先掌握少量高频命令 |
| 组织约束 | `requirements.toml`、managed configuration、Admin policy | 固定团队默认项和不可覆盖的项目底线 | 团队上线前先定义统一配置 |

## 本专题怎么读

1. 先读 [CLI 选项与命令](./cli-options.md)，理解交互模式、非交互模式、恢复会话和 Slash Commands。
2. 再读 [配置文件 config.toml](./config-file.md)，知道哪些设置适合个人、profile 或项目级覆盖。

## 配置前的四条原则

- 先写任务规则，再调工具开关。任务描述、AGENTS.md、测试命令经常比复杂配置更能提升结果质量。
- 先小范围验证，再推广到团队。一个人的配置习惯直接复制到团队仓库，容易带来权限和环境差异问题。
- 先保守配置，再逐步自动化。高风险设置要有明确理由和可回溯记录。
- 先区分“偏好”和“底线”。个人偏好放在 `config.toml` 或 profile，团队不可绕过的安全要求放在 `requirements.toml` 或 managed configuration。

## 推荐的最小配置路线

### 第 1 天：个人可用

- 安装 CLI。
- 登录并完成一次只读仓库总结。
- 创建项目级 `AGENTS.md`。
- 学会 `/status`、`/model`、`/approvals`、`/diff`、`/quit` 等常用命令。

::: info 截图占位
请补充 CLI 状态命令截图。建议文件：`docs/.vuepress/public/screenshots/config/01-cli-status.png`。
:::

### 第 1 周：稳定实践

- 为常用仓库写清测试命令和代码风格。
- 在 `~/.codex/config.toml` 中配置适合自己的默认 profile。
- 把修测试、代码审查、文档更新沉淀成任务模板。
- 记录每次失败案例，补到排障手册。

### 第 1 个月：团队知识库

- 把项目规则合并到仓库。
- 把团队流程沉淀成任务模板。
- 为 Cloud / App / CLI / IDE 制定统一截图、演示和 PR 模板。
- 对发布、凭据、数据库变更设置复核要求。
- 用 `requirements.toml` 或云端 managed requirements 固定团队默认配置。

## 常见误区

| 误区 | 更好的做法 |
| --- | --- |
| 只调模型，不写上下文 | 给 Codex 明确仓库结构、任务范围、验收标准 |
| 只让它改代码，不让它验证 | 每个任务都指定最小验证命令 |
| 直接放开全部权限 | 先用只读和审批模式，确认命令意图后再执行 |
| 把所有规则塞进提示词 | 长期规则放到 `AGENTS.md` 或任务模板 |
| 团队成员各配各的 | 关键规则进仓库，个人偏好留在本地 |
| 只写 `config.toml` 当安全策略 | 需要强制约束时使用 `requirements.toml` 或 managed configuration |

## 官方资料延伸

- [Codex CLI features](https://developers.openai.com/codex/cli/features)
- [Codex config basic](https://developers.openai.com/codex/config-basic)
- [Codex config advanced](https://developers.openai.com/codex/config-advanced)
- [Codex config reference](https://developers.openai.com/codex/config-reference)
- [AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md)
- [Managed configuration](https://developers.openai.com/codex/enterprise/managed-configuration)
- [Permissions](https://developers.openai.com/codex/permissions)
