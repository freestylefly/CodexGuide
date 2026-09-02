---
description: "使用 codex-profiles 为个人、工作或客户环境选择独立的 CODEX_HOME，并在 macOS 上启动使用独立本地状态的命名 ChatGPT Desktop 窗口。"
---

::: tip 最后核对
本文最后核对日期：2026-07-13，基于
[codex-profiles v0.7](https://github.com/Ducksss/codex-profiles/tree/v0.7.0)。
Codex 和 ChatGPT Desktop 的实际行为仍应以
[OpenAI Codex 文档](https://developers.openai.com/codex/)和当前客户端为准。
:::

# Codex × codex-profiles：分开个人与工作环境

当一台电脑需要处理个人、工作、学校或客户项目时，不同环境的 Codex
配置、会话和登录状态容易混在一起。`codex-profiles` 是一个开源 Bash
CLI：每个名称选择一个独立的 `CODEX_HOME`；在 macOS 上，命名启动还会为
整个 ChatGPT Desktop 窗口选择独立的 Electron 本地状态。

这个工具管理的是**本地状态路径**，不是账号迁移工具，也不是操作系统级
沙箱。它不会读取、复制、打印、解析、上传、比较或迁移令牌。

## 1. 先理解两个作用范围

| 命令 | 名称控制什么 |
| --- | --- |
| `cli`、`login`、`env`、`use` | 所选 `CODEX_HOME` 中的 Codex CLI 本地状态 |
| `app default` | 系统正常安装的 ChatGPT App 和默认 `~/.codex` |
| `app <name>` | 整个命名 ChatGPT 窗口的 Electron 本地状态，以及匹配的 `CODEX_HOME` |
| `status` | Codex CLI 的本地登录状态，不代表窗口当前显示的 ChatGPT 账号 |

`default` 映射到 `~/.codex`，其他名称映射到
`~/.codex-<name>`。例如：

| 名称 | Codex 本地目录 |
| --- | --- |
| `default` | `~/.codex` |
| `personal` | `~/.codex-personal` |
| `work` | `~/.codex-work` |

命名窗口的 Electron 数据位于对应目录下的
`electron-user-data`。同一个名称会复用同一份本地状态，不同名称可以并行
打开。

## 2. 安装并检查环境

使用 npm 安装时，包名是单数：

```bash
npm install -g codex-profile
codex-profile doctor
```

也可以使用 Homebrew：

```bash
brew install Ducksss/tap/codex-profile
codex-profile doctor
```

`doctor` 应能找到上游 Codex CLI。ChatGPT Desktop 命名窗口只支持
macOS；Linux 可以使用 CLI profile。

## 3. 创建并登录两个 CLI profile

```bash
codex-profile init personal
codex-profile init work

codex-profile login personal
codex-profile login work
```

`login` 会把上游 Codex CLI 放在所选 `CODEX_HOME` 中运行。
`codex-profiles` 本身不读取登录结果中的令牌。

分别运行两个环境：

```bash
codex-profile cli personal
codex-profile cli work exec "检查当前仓库并总结测试命令"
```

查看实际路径和 CLI 状态：

```bash
codex-profile path personal
codex-profile path work
codex-profile status personal
codex-profile status work
```

预期两个 `path` 输出不同。`status` 只用于核对 Codex CLI 本地状态，不能
识别 ChatGPT 窗口中当前可见的账号。

## 4. 在 macOS 启动命名 ChatGPT 窗口

```bash
codex-profile app default ~/Dev/personal-project
codex-profile app work ~/Dev/work-project
```

`app default` 使用系统原有的 ChatGPT 会话。`app work` 使用原始签名的
`ChatGPT.app`，但为整个窗口选择独立的 Electron 本地状态。工具不会复制、
修改、重新签名、退出或替换已安装的 App。

命名窗口第一次打开时可能需要登录。请在窗口界面中检查当前可见账号；不要
根据 profile 名称推断账号。CLI 和 Desktop 是否登录同一账号属于未验证
状态，需要用户分别登录并自行核对。

## 5. 验证隔离是否符合预期

完成后检查以下结果：

1. `codex-profile path personal` 与 `path work` 指向不同目录。
2. 两个 CLI profile 能分别启动，并保留各自的 Codex 本地状态。
3. macOS 上的默认窗口和命名窗口能并行打开。
4. 每个 ChatGPT 窗口中显示的账号与工作区符合预期。
5. 切换一个窗口的 Chat、Work 或 Codex 模式时，仍处于该窗口的本地状态。

## 安全边界

| 已分开 | 仍然共享或不受工具控制 |
| --- | --- |
| 每个名称下的 Codex 配置、会话、插件、缓存和日志 | macOS 用户、文件系统权限和网络 |
| 命名 ChatGPT 窗口的本地 Electron 数据 | SSH key、Git 凭证、GitHub CLI、浏览器 cookie、系统钥匙串 |
| CLI 和 Desktop 接收到的匹配 `CODEX_HOME` | 服务端 ChatGPT 历史、memory、workspace、plan、limit 和 cloud task |

因此，profile 隔离不能替代独立操作系统用户或企业安全边界。需要严格隔离
SSH key、Git 凭证或系统钥匙串时，应使用不同的操作系统用户。

## 参考来源

- [codex-profiles README](https://github.com/Ducksss/codex-profiles)
- [codex-profiles 安全模型](https://github.com/Ducksss/codex-profiles/blob/main/SECURITY.md)
- [OpenAI Codex 文档](https://developers.openai.com/codex/)
