---
description: "Codex CLI 安装与登录教程，覆盖安装命令、版本检查、登录流程和首次运行准备。"
---

::: tip 最后核对
官方资料最后核对日期：2026-09-03。系统要求参考 [CLI install 文档](https://github.com/openai/codex/blob/main/docs/install.md)；安装方式参考 [openai/codex 官方仓库](https://github.com/openai/codex)、[Codex CLI 官方文档](https://learn.chatgpt.com/docs/codex/cli) 和 [Codex CLI Help Center](https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started)。
:::

# 安装CLI

本页先覆盖 Codex CLI 的安装与登录。桌面端、ChatGPT、Cloud 和 IDE 入口会在 [入口地图](/start/01-what-is-codex.md) 中分别展开。

## 安装前检查

官方仓库当前给出的 CLI 运行环境建议：

| 项目 | 建议 |
| --- | --- |
| 操作系统 | macOS 12+、Ubuntu 20.04+/Debian 10+、Windows 11 通过 WSL2 |
| Git | 推荐 2.23+，便于 PR 辅助能力 |
| 内存 | 4GB 起步，8GB 更稳 |

本地先确认：

```bash
node -v
npm -v
git --version
```

独立安装脚本不依赖 Node.js。只有选择 npm 安装时，才需要 Node 和 npm。

![codex-cli-prerequisite-version-check](https://cdn.canghecode.com/codexguide/docs/images/codex-cli-prerequisite-version-check.png)

## 安装 CLI

官方当前推荐独立安装脚本：

macOS / Linux：

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

Windows（PowerShell）：

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"
```

GitHub 仓库的系统要求仍写 Windows 11 通过 WSL2。如果原生安装遇到问题，可在 WSL2 里改用上面的 macOS / Linux 命令。

也可以用包管理器：

```bash
npm install -g @openai/codex
```

```bash
brew install --cask codex
```

更新时：独立安装脚本和 npm 再执行同一条安装命令。Homebrew 使用：

```bash
brew upgrade --cask codex
```

检查版本：

```bash
codex --version
```

![codex-cli-version-check](https://cdn.canghecode.com/codexguide/docs/images/codex-cli-version-check.png)

## 登录方式

运行：

```bash
codex
```

根据终端提示完成登录。官方资料说明 Codex 可以通过 ChatGPT 账号在多个入口中使用，具体可用计划、限额和组织策略以 [Codex in ChatGPT Help Center](https://help.openai.com/en/articles/11369540-codex-in-chatgpt) 为准。

![codex-cli-login-account-selection](https://cdn.canghecode.com/codexguide/docs/images/codex-cli-login-account-selection.png)

## 第一次只读任务

进入一个本地项目根目录：

```bash
cd path/to/your/project
codex
```

先让 Codex 只读仓库：

```text
请先阅读这个仓库的目录结构、README、包管理器配置和测试配置。不要修改文件。请总结：
1. 项目用途
2. 主要技术栈
3. 如何安装依赖和运行测试
4. 你建议我下一步交给你的 3 个低风险任务
```

![codex-cli-readonly-first-task](https://cdn.canghecode.com/codexguide/docs/images/codex-cli-readonly-first-task.png)

## 安装失败时怎么判断

| 现象 | 可能原因 | 处理方式 |
| --- | --- | --- |
| `codex` 命令找不到 | 安装目录未进 PATH | 独立安装默认在 `~/.local/bin`；npm 安装查看 `npm bin -g`，把目录加入 shell PATH |
| 登录后仍提示无权限 | 账号计划、组织策略或会话状态问题 | 重新登录，并查看 Help Center 中的计划说明 |
| Windows 运行异常 | 未使用 WSL2，或原生安装后 PATH 不完整 | 仓库系统要求仍是 Windows 11 + WSL2；若使用官方 PowerShell 安装，确认 `%LOCALAPPDATA%\Programs\OpenAI\Codex\bin` 已加入 PATH |
| 仓库命令跑不起来 | 项目依赖未安装或本地环境缺失 | 先安装项目依赖，再让 Codex 读取测试配置 |

## 下一步

下一步：[第一次让 Codex 改代码](./11-cli-first-run.md)。
