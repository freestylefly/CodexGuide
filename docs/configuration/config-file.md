# 配置文件 config.toml

`config.toml` 用来保存 Codex CLI 的本地默认行为。你可以把它理解为“个人驾驶舱”：模型、审批、沙盒、profiles、MCP 服务等偏好都可以在这里集中管理。

::: tip 最后核对
官方资料最后核对日期：2026-05-27。本文参考 [Codex config basic](https://developers.openai.com/codex/config-basic)、[Codex config advanced](https://developers.openai.com/codex/config-advanced)、[Codex config reference](https://developers.openai.com/codex/config-reference) 与 [openai/codex config docs](https://github.com/openai/codex/blob/main/docs/config.md)。
:::

## 配置文件放在哪里

通常位于：

```text
~/.codex/config.toml
```

项目长期规则建议写到仓库内的 `AGENTS.md`，个人偏好放到本机 `config.toml`。这样团队成员能共享项目规则，又能保留自己的 CLI 使用习惯。

::: info 截图占位
请补充本机 `~/.codex/config.toml` 文件位置截图，注意遮挡敏感路径和 token。建议文件：`docs/.vuepress/public/screenshots/config/02-config-location.png`。
:::

## 最小配置示例

下面是一个学习用示例，实际字段请以官方 config reference 和当前 CLI 版本为准：

```toml
model = "gpt-5.1-codex-max"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[profiles.readonly]
approval_policy = "on-request"
sandbox_mode = "read-only"

[profiles.build]
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

这个示例表达三件事：

- 默认允许在当前工作区写文件。
- 高风险命令仍需要审批。
- 额外保留一个只读 profile，适合新仓库分析。

## 常见配置项按用途理解

| 用途 | 你要决定什么 | 建议 |
| --- | --- | --- |
| 模型 | 速度、成本、推理深度的取舍 | 用默认配置起步，复杂任务再临时调整 |
| 沙盒 | Codex 能读写哪些位置 | 新手先只读或工作区写入 |
| 审批 | 哪些命令需要你确认 | 涉及网络、删除、安装、发布时保留审批 |
| profiles | 不同任务使用不同组合 | 准备 readonly、coding、review 三类 profile |
| MCP | 接入外部工具和知识源 | 只接可信服务，明确权限范围 |
| 环境 | 传递必要变量或隔离敏感变量 | 凭据用最小权限，避免写进教程截图 |

## 推荐 profiles

### 只读学习

适合打开陌生仓库、生成项目地图、梳理测试命令。

```toml
[profiles.readonly]
sandbox_mode = "read-only"
approval_policy = "on-request"
```

任务示例：

```bash
codex --profile readonly
```

```text
请只读分析当前仓库。不要修改文件，不要运行会写入文件的命令。
```

### 日常编码

适合修测试、补文档、小范围实现。

```toml
[profiles.coding]
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

任务示例：

```text
请修复这个失败测试。修改范围限制在 `src/parser` 和对应测试文件，修复后运行 `pnpm test parser`。
```

### 审查与发布前检查

适合 PR review、发布前风险扫描、diff 总结。

```toml
[profiles.review]
sandbox_mode = "read-only"
approval_policy = "on-request"
```

任务示例：

```text
请 review 当前 diff，优先指出 bug、回归风险和缺失测试。不要修改文件。
```

## 配置变更的验证方法

每次改完配置，不要直接上复杂任务。用一个短任务验证：

```text
请告诉我当前工作区、审批策略和你准备采用的验证方式。不要修改文件。
```

再检查：

- Codex 是否能正确读取当前目录。
- 是否会在执行命令前解释意图。
- 是否遵守只读或工作区写入边界。
- 是否按预期触发审批。

::: info 截图占位
请补充切换 profile 后的状态截图。建议文件：`docs/.vuepress/public/screenshots/config/03-profile-status.png`。
:::

## 团队配置建议

适合进仓库的内容：

- `AGENTS.md`
- 推荐测试命令
- 代码风格和目录说明
- PR 模板
- 文档截图规范

适合留在个人机器的内容：

- 默认模型偏好
- 本地路径
- token、密钥、私有服务地址
- 个人 MCP 服务
- 私有 automation 配置

## 排障清单

| 现象 | 检查 |
| --- | --- |
| 配置没生效 | 文件路径、TOML 语法、CLI 版本、启动时是否选择 profile |
| Codex 权限超出预期 | 检查 `sandbox_mode` 和 `approval_policy` |
| 某个命令一直被拒绝 | 检查沙盒限制、网络权限和组织策略 |
| MCP 无法连接 | 检查服务命令、环境变量、端口、认证方式 |
| 团队成员行为不一致 | 把项目共同规则写进 `AGENTS.md` |

## 官方资料延伸

- [Config basic](https://developers.openai.com/codex/config-basic)
- [Config advanced](https://developers.openai.com/codex/config-advanced)
- [Config reference](https://developers.openai.com/codex/config-reference)
- [openai/codex config docs](https://github.com/openai/codex/blob/main/docs/config.md)
