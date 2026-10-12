---
description: "Codex config.toml 配置指南，说明模型、沙盒、审批、配置 profiles、权限 profiles、MCP 和个人本地配置的组织方式。"
---

::: tip 最后核对
官方资料最后核对日期：2026-10-12。本文参考 [Codex config basic](https://developers.openai.com/codex/config-basic)、[Codex config advanced](https://developers.openai.com/codex/config-advanced)、[Codex config reference](https://developers.openai.com/codex/config-reference) 与 [openai/codex config docs](https://github.com/openai/codex/blob/main/docs/config.md)整理。
:::

# 配置文件 config.toml

`config.toml` 用来保存 Codex 本地客户端的默认行为。你可以把它理解为“个人驾驶舱”：模型、审批、沙盒、profiles、MCP 服务等偏好都可以在这里集中管理。


## 配置文件放在哪里

用户级配置通常位于：

```text
~/.codex/config.toml
```

如果某些设置只想对当前项目或子目录生效，可以在仓库中增加：

```text
.codex/config.toml
```

Codex 只会在你信任项目后加载项目级 `.codex/` 配置。它会从项目根目录向当前工作目录逐层读取配置，同一个字段离当前目录越近，优先级越高。

项目长期规则仍建议写到仓库内的 `AGENTS.md`，项目默认行为可以写进 `.codex/config.toml`，个人偏好放到本机 `~/.codex/config.toml`。这样团队成员能共享项目规则和必要的配置，又能保留自己的使用习惯。

### 配置优先级

当多个位置设置了同一个字段时，Codex 按下面的顺序取值，越靠前优先级越高：

1. CLI 参数和 `--config` 临时覆盖。
2. 项目内的 `.codex/config.toml`，离当前工作目录最近的文件优先。
3. 通过 `--profile <name>` 选择的 `~/.codex/<name>.config.toml`。
4. 用户级 `~/.codex/config.toml`。
5. 工作区下发的云端默认配置。
6. 系统配置，例如 Unix 上的 `/etc/codex/config.toml`。
7. Codex 内置默认值。

项目级配置不能覆盖所有机器级字段。例如 provider、通知、遥测和 profile 选择等设置应留在用户级配置中。受管理设备还可能通过 `requirements.toml` 限制可选值，这类组织策略不是用户配置可以绕过的。

## `.env` 和 `config.toml` 不要混用

`config.toml` 保存 Codex 的持久配置，例如模型、沙盒、审批、profiles 和 MCP server。`~/.codex/.env` 用来补充 Desktop app 或 IDE extension 启动时必须读取、但没有从当前 shell 继承到的环境变量，例如 provider 明确要求的区域变量。

OpenAI [Amazon Bedrock provider 文档](https://developers.openai.com/codex/amazon-bedrock)提醒：Desktop app 和 VS Code extension 可能不会继承当前 shell 里的环境变量；如果这些入口需要某些变量，可以把值放进 `~/.codex/.env`，然后重启 app 或 extension。

写入前先确认两件事：

- 变量确实是当前入口需要的，不要把所有 shell 变量都复制进去。
- 文件里可能包含 secret，截图、发 issue 或提交仓库前必须脱敏。

如果需要配置代理，不要直接照搬示例或猜测端口。先查看系统代理设置，并用 `curl -x` 验证代理地址是否可用；确认 Desktop app 或 IDE extension 确实需要这些变量后，再写入 `~/.codex/.env`：

```bash
export HTTP_PROXY="http://127.0.0.1:<PORT>"
export HTTPS_PROXY="http://127.0.0.1:<PORT>"
export NO_PROXY="localhost,127.0.0.1,::1,*.local"
```


## 最小配置示例

下面是一个学习用示例，实际字段请以官方 config reference 和当前 CLI 版本为准：

```toml
model = "gpt-6.1-sol" # 如果当前账号或工作区不可用，请改成你可以使用的模型
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

这个示例表达三件事：

- Codex 可以在当前工作区内读写文件。
- 当操作需要突破沙盒限制，或 Rules、MCP、Skill 要求审批时，Codex 会向你请求确认。
- `model` 字段可以省略，Codex 会改用当前账号或工作区的默认模型。

`approval_policy` 决定 Codex 何时暂停并请求确认，`sandbox_mode` 则决定命令可以访问哪些文件和网络资源。设置为 `on-request`，只是允许 Codex 在需要时发起确认，并不代表所有高风险命令都会弹窗，也不会改变沙盒的权限边界。

## 常见配置项按用途理解

| 用途 | 你要决定什么 | 建议 |
| --- | --- | --- |
| 模型 | 速度、成本、推理深度的取舍 | 用默认配置起步，复杂任务再临时调整 |
| 沙盒 | Codex 能读写哪些位置 | 新手先只读或工作区写入 |
| 审批 | 哪些审批请求可以交给你确认 | 交互式使用优先从 `on-request` 起步 |
| 配置 profiles | 不同任务使用不同配置组合 | 为 readonly、coding、review 准备独立配置文件 |
| 权限 profiles | 可复用的文件系统和网络边界 | 优先理解内置权限，再按需自定义 |
| MCP | 接入外部工具和知识源 | 只接可信服务，明确权限范围 |
| 环境 | 传递必要变量或隔离敏感变量 | 凭据用最小权限，避免写进教程截图 |

## 推荐配置 profiles

配置 profile 用来保存一组可以重复使用的设置。从 Codex 0.134.0 开始，profile 不再写在 `config.toml` 的 `[profiles.<name>]` 中，顶层的 `profile = "<name>"` 也不再受支持。你需要为每个 profile 单独创建一个 TOML 文件，并在启动时通过 `--profile <name>` 选择。

### 只读学习

适合打开陌生仓库、生成项目地图、梳理测试命令。

```toml
# ~/.codex/readonly.config.toml
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
# ~/.codex/coding.config.toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

任务示例：

```bash
codex --profile coding
```

```text
请修复这个失败测试。修改范围限制在 `src/parser` 和对应测试文件，修复后运行 `pnpm test parser`。
```

### 审查与发布前检查

适合 PR review、发布前风险扫描、diff 总结。

```toml
# ~/.codex/review.config.toml
sandbox_mode = "read-only"
approval_policy = "on-request"
```

任务示例：

```bash
codex --profile review
```

```text
请 review 当前 diff，优先指出 bug、回归风险和缺失测试。不要修改文件。
```

### 配置 profile 和权限 profile 不要混用

前面示例中的 `readonly`、`coding` 和 `review` 都属于“配置 profile”。每个 profile 保存在独立的 TOML 文件中，可以分别设置模型、推理强度、审批策略和沙盒模式。

除此之外，Codex 还提供“权限 profile”，专门用来管理文件系统和网络权限。你可以直接使用内置的 `:read-only`、`:workspace` 和 `:danger-full-access`，也可以在 `[permissions.<name>]` 中自定义权限，再通过 `default_permissions` 选用。

需要注意的是，这两种 profile 用途不同：配置 profile 管理一整套运行设置，权限 profile 只管理权限边界。编写配置时，应把配置 profile 放在独立文件中，把自定义权限写在 `[permissions]` 下，不要再使用旧的 `[profiles.<name>]` 写法。

## Web Search 和可选功能

### 设置 Web Search

Web Search 和命令行联网是两项独立的能力。要设置本地对话使用哪种搜索方式，可以在 `config.toml` 中加入：

```toml
web_search = "cached" # 也可以使用 indexed、live 或 disabled
```

`cached` 使用 OpenAI 维护的搜索索引，`live` 直接获取最新网页，`disabled` 则关闭 Web Search。命令行即使不能联网，也不代表 Web Search、MCP 或 apps 一定不可用，因为这些能力各有自己的权限和审批设置。

### 开启或关闭可选功能

可选或实验性功能通常配置在 `[features]` 下。例如：

```toml
[features]
apps = true
hooks = true
memories = false
```

这些功能的名称、默认值和成熟度可能随版本变化，修改前应先查看最新的 config reference。如果只想临时启用某项功能，也可以运行：

```bash
codex --enable <feature_name>
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

## 切换 provider 后历史会话不可见怎么办

有些用户在修改根级 `model_provider` 后，会发现旧会话在 Codex Desktop 或 CLI 的 `/resume` 里突然不可见。常见原因不是会话文件丢失，而是 `~/.codex` 里的会话 metadata、SQLite 状态和项目路径缓存仍停留在旧 provider。

::: warning 第三方社区工具
下面介绍的是社区项目 [Dailin521/codex-provider-sync](https://github.com/Dailin521/codex-provider-sync)，不是 OpenAI 官方工具。社区资料最后核对日期：2026-05-29。使用前请先备份 `~/.codex`，并确认你理解它会修改本机 Codex 状态文件。
:::

这个工具主要同步这些位置里的 provider / 可见性 metadata：

- `~/.codex/sessions`
- `~/.codex/archived_sessions`
- `~/.codex/state_5.sqlite`
- `.codex-global-state.json` 中的项目根路径缓存

先做两个判断：

- 如果 CLI `/resume` 能看到旧会话，但 Desktop 项目侧仍为空，可能是 Codex Desktop 最近 50 条会话的首屏显示限制，不一定是 provider metadata 问题。
- 如果最近刚切换过 `model_provider`，并且多个入口都找不到旧会话，再考虑使用同步工具。

### Windows GUI 流程

Windows 用户可以优先使用上游 Release 里的图形界面版本：

1. 打开 [codex-provider-sync Releases](https://github.com/Dailin521/codex-provider-sync/releases)，下载 `CodexProviderSync.exe`。
2. 双击运行后，先确认顶部 `Codex Home` 路径指向你的 `.codex` 目录。
3. 点击 `Refresh`，查看当前 provider、rollout、SQLite 和项目可见性诊断。
4. 在 provider 列表里选择目标 Provider。
5. 如果希望同时改写 `config.toml` 根级 `model_provider`，再勾选右侧对应选项。
6. 点击 `Execute` 执行同步。
7. 如果结果不符合预期，用 `Restore Backup` 从工具生成的备份目录恢复。

GUI 会默认保留最近几份由本工具创建的备份。若 `state_5.sqlite` 被占用，先关闭 Codex、Codex App 或 app-server 后再重试。

### macOS 或 CLI 流程

CLI 版本需要 Node.js `24+`。如果你使用 Node 20/22，可能会遇到 `node:sqlite` 不存在的问题。

```bash
npm install -g git+https://github.com/Dailin521/codex-provider-sync.git
codex-provider status
```

建议先只运行 `status`，确认它看到的 provider、rollout、SQLite 和项目可见性诊断符合预期。确认后再选择操作：

```bash
codex-provider sync
codex-provider sync --provider openai
codex-provider switch <provider-id>
codex-provider restore <backup-dir>
```

常用命令含义：

| 命令 | 作用 |
| --- | --- |
| `codex-provider status` | 只检查当前 provider、rollout、SQLite 和项目可见性，不执行同步 |
| `codex-provider sync` | 不切换登录状态，只把历史会话 metadata 同步到当前 provider |
| `codex-provider sync --provider openai` | 指定目标 provider 后同步 metadata |
| `codex-provider switch <provider-id>` | 修改 `config.toml` 根级 `model_provider`，然后执行同步 |
| `codex-provider restore <backup-dir>` | 从备份恢复，适合结果不符合预期时回滚 |

### 能力边界

它只处理“历史会话可见性”相关 metadata，不是账号切换器，也不是认证修复工具：

- 不处理登录、认证、`auth.json` 或第三方切号工具。
- 不修改消息历史、会话标题和对话内容。
- 不修改 `updated_at`，也不会通过改变历史排序绕过 Desktop 最近 50 条限制。
- 含 `encrypted_content` 的旧会话跨 provider 或 account 后，通常只能恢复列表可见性；继续对话或 compact 仍可能报 `invalid_encrypted_content`。

上游说明请看 [README](https://github.com/Dailin521/codex-provider-sync) 和 [GUI 中文说明](https://github.com/Dailin521/codex-provider-sync/blob/main/docs/README_GUI_ZH.md)。如果你只是想稳定使用 Codex，优先理解本页前面的 `config.toml` 配置方式；遇到 provider 切换后的历史会话不可见，再把这个工具作为排障选项。

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
| 配置没生效 | 配置优先级、文件路径、TOML 语法、客户端版本、项目是否可信、启动时是否选择 profile |
| Codex 权限超出预期 | 检查 `sandbox_mode` 和 `approval_policy` |
| 某个命令一直被拒绝 | 检查沙盒限制、网络权限和组织策略 |
| MCP 无法连接 | 检查服务命令、环境变量、端口、认证方式 |
| Desktop 不继承代理变量 | 先验证真实代理端口和协议，再把最小变量放进 `~/.codex/.env` 并重启 |
| 切换 provider 后旧会话不可见 | 先判断是否是 Desktop 最近 50 条显示限制，再检查 provider metadata 是否需要同步 |
| 团队成员行为不一致 | 把项目共同规则写进 `AGENTS.md` |

## 官方资料延伸

- [Config basic](https://developers.openai.com/codex/config-basic)
- [Config advanced](https://developers.openai.com/codex/config-advanced)
- [Config reference](https://developers.openai.com/codex/config-reference)
- [Environment variables](https://developers.openai.com/codex/environment-variables)
- [Use Codex with Amazon Bedrock](https://developers.openai.com/codex/amazon-bedrock)
- [openai/codex config docs](https://github.com/openai/codex/blob/main/docs/config.md)

## 下一步

下一步：[团队实践](./10-team-playbook.md)。
