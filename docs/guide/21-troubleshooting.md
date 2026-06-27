---
description: "Codex 排障手册，汇总登录、安装、权限、依赖、命令失败和任务执行异常的定位与恢复路径，帮助快速继续工作。"
redirectFrom:
  - /guide/20-troubleshooting.html
  - /guide/17-troubleshooting.html
  - /guide/18-troubleshooting.html
  - /guide/19-troubleshooting.html
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
