---
description: "Codex 排障手册，汇总登录、安装、权限、依赖、命令失败和任务执行异常的定位与恢复路径，帮助快速继续工作。"
redirectFrom:
  - /guide/17-troubleshooting.html
---

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
官方资料和 GitHub issue 最后核对日期：2026-06-14。本文参考 OpenAI [Codex app troubleshooting](https://developers.openai.com/codex/app/troubleshooting)、[Environment variables](https://developers.openai.com/codex/environment-variables)、[Use Codex with Amazon Bedrock](https://developers.openai.com/codex/amazon-bedrock)、[Model Context Protocol](https://developers.openai.com/codex/mcp)，以及社区排障库 [Desktop Reconnecting / Proxy Triage](https://github.com/toby-bridges/community-codex-windows-troubleshooting/blob/main/DESKTOP-RECONNECTING-PROXY-GUIDE.md)。
:::

先按三层判断：

| 层级 | 现象 | 先做什么 |
| --- | --- | --- |
| 主连接 | 新线程也一直 `Reconnecting` | 验证 Codex 进程能不能走到正确代理 |
| 会话流 | 偶发 `stream disconnected before completion` | 看是否是旧会话、WebSocket/SSE 或服务端连接问题 |
| 工具 worker | 主界面恢复，但 MCP、Browser、node_repl 仍失败 | 再查 `config.toml` 里的 MCP 环境变量 |

如果你使用 macOS 代理：

```bash
scutil --proxy
launchctl getenv HTTP_PROXY
launchctl getenv HTTPS_PROXY
curl -sS --max-time 10 -x "http://127.0.0.1:<PORT>" "https://api.ipify.org?format=json"
```

端口和协议都验证通过后，再把最小代理变量放进 `~/.codex/.env`，然后完全退出并重新打开 Codex Desktop：

```bash
export HTTP_PROXY="http://127.0.0.1:<PORT>"
export HTTPS_PROXY="http://127.0.0.1:<PORT>"
export ALL_PROXY="http://127.0.0.1:<PORT>"
export NO_PROXY="localhost,127.0.0.1,::1,*.local"
```

如果你使用 Windows 或 WSL：

- Windows 原生 Desktop 优先检查 Windows 用户环境变量。
- WSL 模式不要只写 `~/.bashrc`，因为 Desktop 启动 WSL 进程时不一定经过 login shell。
- 修改环境变量后完全重启 Codex。

```powershell
[Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://127.0.0.1:<PORT>", "User")
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://127.0.0.1:<PORT>", "User")
```

如果主界面已经恢复，但 MCP 或 node_repl 仍然断，再检查 MCP server 是否需要单独配置环境变量：

```toml
[mcp_servers.node_repl.env]
HTTP_PROXY = "http://127.0.0.1:<PORT>"
HTTPS_PROXY = "http://127.0.0.1:<PORT>"
NO_PROXY = "localhost,127.0.0.1,::1,*.local"
```

日志位置：

- macOS app logs：`~/Library/Logs/com.openai.codex/YYYY/MM/DD`
- 会话记录：`$CODEX_HOME/sessions`，默认 `~/.codex/sessions`

发 issue 或群里求助时，只贴脱敏后的错误字符串、时间点、Codex 版本、平台和网络拓扑。不要公开完整日志、邮箱、account id、conversation id、session id、真实出口 IP、本机路径、私有仓库名或 token。

## Windows 桌面 App / CLI 专项排障

如果问题发生在 Windows 桌面 App、Microsoft Store / winget 安装、Windows sandbox、Worktree、Browser / Computer Use 插件、WSL 混合路径或 PowerShell 环境，可以参考社区维护的 Windows 专项排障库：

- [Community Codex Windows Troubleshooting](https://github.com/toby-bridges/community-codex-windows-troubleshooting)
- [Windows Codex Error Guide](https://github.com/toby-bridges/community-codex-windows-troubleshooting/blob/main/WINDOWS-CODEX-ERROR-GUIDE.md)
- [Dogfood Matrix](https://github.com/toby-bridges/community-codex-windows-troubleshooting/blob/main/DOGFOOD-MATRIX.md)

这个项目会把 Windows 报错按证据等级、复现等级和 workaround 状态整理，并提供只读诊断脚本。提交日志、截图或诊断输出前，请先脱敏用户名、路径、私有仓库名、token 和账号信息。

## 切换 provider 后旧会话不可见

可能原因：

- 修改过 `config.toml` 根级 `model_provider`。
- 旧会话文件还在，但会话 metadata、SQLite 状态或项目路径缓存仍指向旧 provider。
- CLI `/resume` 能看到旧会话，但 Codex Desktop 项目侧看不到，可能只是 Desktop 最近 50 条会话的首屏显示限制。

处理方式：

- 先确认 `~/.codex/sessions` 或 `~/.codex/archived_sessions` 里是否还存在旧会话文件。
- 如果只是 Desktop 项目侧不可见，先判断是否被最近 50 条显示限制挡住。
- 如果确认是切换 provider 后 metadata 不一致，再参考 [config.toml 里的社区工具说明](../configuration/config-file.md#切换-provider-后历史会话不可见怎么办)。
- 使用第三方工具前先备份 `~/.codex`，不要把它当成官方认证或账号切换工具。
