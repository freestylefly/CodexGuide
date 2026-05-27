# 配置与扩展总览

Codex 的学习曲线有两个阶段：先会用，再会配置。会用解决单次任务，会配置能把 Codex 变成稳定的个人工作台和团队协作工具。

::: tip 最后核对
官方资料最后核对日期：2026-05-27。本文参考 [Codex 文档入口](https://developers.openai.com/codex/)、[Codex CLI features](https://developers.openai.com/codex/cli/features)、[基础配置](https://developers.openai.com/codex/config-basic)、[AGENTS.md](https://developers.openai.com/codex/guides/agents-md)、[Codex Skills](https://developers.openai.com/codex/skills) 与 [Codex security](https://developers.openai.com/codex/agent-approvals-security)。
:::

![Codex 配置地图](/images/codex-config-map.svg)

## 先理解四层配置

| 层级 | 典型文件或入口 | 解决的问题 | 初学者建议 |
| --- | --- | --- | --- |
| 项目规则 | `AGENTS.md` | 让 Codex 理解仓库约定、测试命令、目录边界 | 每个重要仓库都写一份 |
| 本地配置 | `~/.codex/config.toml` | 设置模型、沙盒、审批、profiles、MCP | 先保守，再按任务放开权限 |
| 扩展能力 | Skills、MCP、Plugins、Subagents | 复用流程、连接外部工具、拆分复杂任务 | 先沉淀高频流程 |
| 安全边界 | Sandbox、Approvals、Admin policy | 管控命令、网络、敏感文件、组织策略 | 把高风险操作留给人工确认 |

## 本专题怎么读

1. 先读 [CLI 选项与命令](./cli-options.md)，理解交互模式、非交互模式、恢复会话和 Slash Commands。
2. 再读 [配置文件 config.toml](./config-file.md)，知道哪些设置适合个人、哪些适合团队模板。
3. 接着读 [MCP、Skills 与 Subagents](./mcp-skills-subagents.md)，把重复流程变成可复用能力。
4. 最后读 [安全、审批与管理](./security-admin.md)，建立权限边界和审计意识。

## 配置前的三条原则

- 先写任务规则，再调工具开关。任务描述、AGENTS.md、测试命令经常比复杂配置更能提升结果质量。
- 先小范围验证，再推广到团队。一个人的配置习惯直接复制到团队仓库，容易带来权限和环境差异问题。
- 先保留审批，再逐步自动化。删除文件、访问网络、安装依赖、写入系统目录、读取敏感数据都应有明确理由。

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
- 把团队流程沉淀成 Skills。
- 为 Cloud / App / CLI 制定统一截图、演示和 PR 模板。
- 对网络访问、凭据、发布、数据库变更设置审批要求。

## 常见误区

| 误区 | 更好的做法 |
| --- | --- |
| 只调模型，不写上下文 | 给 Codex 明确仓库结构、任务范围、验收标准 |
| 只让它改代码，不让它验证 | 每个任务都指定最小验证命令 |
| 直接放开全部权限 | 先用只读和审批模式，确认命令意图后再执行 |
| 把所有规则塞进提示词 | 长期规则放到 `AGENTS.md` 或 Skill |
| 团队成员各配各的 | 关键规则进仓库，个人偏好留在本地 |

## 官方资料延伸

- [Codex CLI features](https://developers.openai.com/codex/cli/features)
- [Codex config basic](https://developers.openai.com/codex/config-basic)
- [Codex config advanced](https://developers.openai.com/codex/config-advanced)
- [Codex config reference](https://developers.openai.com/codex/config-reference)
- [AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md)
- [Codex skills](https://developers.openai.com/codex/skills)
- [Codex security](https://developers.openai.com/codex/agent-approvals-security)
