---
description: "Codex 排障手册，汇总登录、安装、权限、依赖、命令失败和任务执行异常的定位与恢复路径，帮助快速继续工作。"
---

::: tip 最后核对
官方资料最后核对日期：2026-10-12。本文参考 [ChatGPT 与 Codex 文档](https://learn.chatgpt.com/docs/)、[Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox)、[Codex CLI 官方仓库](https://github.com/openai/codex) 与 [Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security)。排障命令、路径和界面名称会随系统、客户端和 CLI 版本变化。
:::

# 排障手册

本页收集 Codex 使用中的常见问题。欢迎通过 PR 持续补充。

## Codex 找不到项目上下文

可能原因：

- 你不在项目根目录。
- 仓库缺少 README、测试命令或项目说明。
- monorepo 没有说明包边界。

处理方式：

- 先让 Codex 只读目录并总结项目结构。
- 添加或更新 `AGENTS.md`。
- 在任务说明里指定相关目录。

## Codex 改动范围太大

处理方式：

- 明确“只修改这些文件”。
- 要求“先输出计划，不要动手”。
- 把任务拆成更小的步骤。
- 在 review 时拒绝无关重构。

## 测试跑不起来

处理方式：

- 让 Codex 先定位测试命令。
- 检查依赖是否安装。
- 区分环境问题和代码问题。
- 如果是环境问题，让 Codex 记录阻塞，而不是继续乱改。

## 生成内容不准确

处理方式：

- 要求 Codex 引用它依据的文件。
- 对官方事实要求附链接。
- 让它区分“已确认”和“推测”。
- 让它先读代码再写文档。

## 登录或权限问题

处理方式：

- 更新 Codex CLI 到最新版本。
- 重新运行登录流程。
- 检查当前账号计划和组织策略。
- 查看官方 Help Center 的 Codex 相关文章。

## Desktop 一直显示 Reconnecting

`Reconnecting` 不是一个具体根因。它可能是主连接、会话恢复、WebSocket / SSE 流、代理协议、MCP worker 或服务端临时问题。不要一开始就重装 Codex、覆盖 `config.toml`，或者直接换账号。

::: tip 最后核对
官方资料和 GitHub issue 最后核对日期：2026-10-12。本节是结合 OpenAI [Troubleshooting](https://learn.chatgpt.com/docs/reference/troubleshooting)、[Environment variables](https://learn.chatgpt.com/docs/config-file/environment-variables)、[Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) 与 [Codex CLI 官方仓库](https://github.com/openai/codex) 整理的排障顺序，不是官方对 `Reconnecting` 的固定分类。
:::

先按三层判断：

| 层级 | 现象 | 先做什么 |
| --- | --- | --- |
| 主连接 | 新线程也一直 `Reconnecting` | 验证 Codex 进程能不能走到正确代理 |
| 会话流 | 偶发 `stream disconnected before completion` | 看是否是旧会话、WebSocket/SSE 或服务端连接问题 |
| 工具 worker | 主界面恢复，但 MCP、Browser 或 Node REPL 仍失败 | 分别检查对应工具的连接、认证和运行环境 |

如果你使用 macOS 代理：

```bash
scutil --proxy
launchctl getenv HTTP_PROXY
launchctl getenv HTTPS_PROXY
curl -sS --max-time 10 -x "http://127.0.0.1:<PORT>" "https://api.ipify.org?format=json"
```

先检查系统代理或 PAC 是否把 Codex 请求导向了正确端口。当系统代理解析不可用，或者需要显式覆盖时，再把最小代理变量放进 `~/.codex/.env`，然后完全退出并重新打开 Codex Desktop：

```bash
export HTTP_PROXY="http://127.0.0.1:<PORT>"
export HTTPS_PROXY="http://127.0.0.1:<PORT>"
export ALL_PROXY="http://127.0.0.1:<PORT>"
export NO_PROXY="localhost,127.0.0.1,::1,*.local"
```

网上有 macOS 一键脚本会自动读取 `scutil --proxy` 并更新 `~/.codex/.env`。可以把这类脚本当模板，但运行前至少确认它会备份原 `.env`、用 `curl -x` 验证代理协议、不会覆盖其他 secret，并且明确只适用于 macOS。

如果你使用 Windows 或 WSL：

- Windows 原生 Desktop 优先检查 Windows 用户环境变量。
- WSL 模式不要只写 `~/.bashrc`，因为 Desktop 启动 WSL 进程时不一定经过 login shell。
- 修改环境变量后完全重启 Codex。

```powershell
[Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://127.0.0.1:<PORT>", "User")
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://127.0.0.1:<PORT>", "User")
```

如果主界面已经恢复，但某个 STDIO MCP server 仍然断开，再检查它是否需要单独配置环境变量：

```toml
[mcp_servers.example_server.env]
HTTP_PROXY = "http://127.0.0.1:<PORT>"
HTTPS_PROXY = "http://127.0.0.1:<PORT>"
NO_PROXY = "localhost,127.0.0.1,::1,*.local"
```

这个配置只会传给对应的 STDIO MCP 进程，不代表内置 Browser、Node REPL 或插件 worker 也会继承相同变量。这些工具需要分别验证。

日志位置：

- macOS app logs：`~/Library/Logs/com.openai.codex/YYYY/MM/DD`
- 会话记录：`$CODEX_HOME/sessions`，默认 `~/.codex/sessions`

发 issue 或群里求助时，只贴脱敏后的错误字符串、时间点、Codex 版本、平台和网络拓扑。不要公开完整日志、邮箱、account id、conversation id、session id、真实出口 IP、本机路径、私有仓库名或 token。

## Windows 桌面 App / CLI 专项排障

排查前，先确认 Codex Agent 运行在 Windows 原生环境还是 WSL2。判断方法见 [如何确认 Codex 实际运行在哪里](../start/15-platforms.md#如何确认-codex-实际运行在哪里)。

如果问题发生在 Windows 桌面 App、Microsoft Store / winget 安装、Windows sandbox、Worktree、Browser / Computer Use 插件、WSL 混合路径或 PowerShell 环境，优先查看官方资料：

- [Windows desktop app](https://learn.chatgpt.com/docs/windows/windows-app)
- [Windows sandbox](https://learn.chatgpt.com/docs/windows/windows-sandbox)
- [WSL](https://learn.chatgpt.com/docs/windows/wsl)

当前 Windows 原生沙盒包括推荐的 `mxc`，以及 `elevated` 和 `unelevated` 两种兼容实现。如果官方文档未覆盖具体报错，再参考社区维护的专项排障库：

- [Community Codex Windows Troubleshooting](https://github.com/toby-bridges/community-codex-windows-troubleshooting)
- [Windows Codex Error Guide](https://github.com/toby-bridges/community-codex-windows-troubleshooting/blob/main/WINDOWS-CODEX-ERROR-GUIDE.md)
- [Dogfood Matrix](https://github.com/toby-bridges/community-codex-windows-troubleshooting/blob/main/DOGFOOD-MATRIX.md)

这个项目会把 Windows 报错按证据等级、复现等级和 workaround 状态整理，并提供只读诊断脚本。提交日志、截图或诊断输出前，请先脱敏用户名、路径、私有仓库名、token 和账号信息。

## 切换 provider 后旧会话不可见

可能原因：

- 修改过 `config.toml` 根级 `model_provider`。
- 旧会话文件还在，但会话 metadata、SQLite 状态或项目路径缓存仍指向旧 provider。
- CLI `/resume` 能看到旧会话，但 Codex Desktop 项目侧看不到，可能是会话已归档、侧边栏加载或本地索引状态不一致。

处理方式：

- 先在 Desktop 的 Settings 中检查 Archived，再确认 `~/.codex/sessions` 或 `~/.codex/archived_sessions` 里是否还存在旧会话文件。
- 使用 CLI `/resume` 的会话选择器，或运行 `codex resume --all` 搜索其他目录下的会话。
- 如果能找到会话文件，但 Desktop 仍不显示，先把 provider、metadata 或索引不一致视为待验证原因，再参考 [config.toml 里的社区工具说明](../advanced/09-config-toml.md#切换-provider-后历史会话不可见怎么办)。
- 使用第三方工具前先备份 `~/.codex`，不要把它当成官方认证或账号切换工具。

## 下一步

下一步：[Codex Memories：让 Codex 记住以前的工作](./12-memories.md)。
