---
description: "手机端跟进 Codex 任务教程，说明 ChatGPT App 入口、跨设备连接、任务查看和协同边界。"
---

::: tip 最后核对
官方资料最后核对日期：2026-10-12。本文参考 OpenAI 官方的 [Codex on mobile](https://learn.chatgpt.com/docs/mobile)、[Remote connections](https://learn.chatgpt.com/docs/remote-connections) 和 [Mastering remote engineering work from your phone](https://developers.openai.com/blog/mastering-codex-remote-for-engineering)。具体入口、可用地区、系统支持和界面名称会随客户端更新变化，请以当前 ChatGPT 手机 App 和桌面 App 为准。
:::

# 用手机远程操控 Codex

Codex 现在支持通过 Android 和 iOS 上的 ChatGPT App 跟进任务。你可以选择 Codex Cloud，也可以连接一台 Mac、Windows 电脑或远程开发环境。

简单说：手机是控制端。离开电脑时，你仍然可以新建任务，也可以查看、回复、审批和调整已有任务。

把 ChatGPT App 更新到最新版，然后在手机端打开 **Codex**。如果你的客户端还显示旧名称 **Remote**，就从 Remote 进入。

![ChatGPT 手机 App 中的 Codex 入口](https://cdn.canghecode.com/codexguide/docs/images/mobile-codex-ios-app-watermarked-small.jpg)

连接电脑上的 ChatGPT 桌面 App：

![手机端连接 ChatGPT 桌面 App](https://cdn.canghecode.com/codexguide/docs/images/mobile-codex-connect-desktop-watermarked-small.jpg)

连接成功后，在 ChatGPT 里打开 Codex，选择对应的电脑和项目就能用。

![在 ChatGPT 手机 App 中打开 Codex](https://cdn.canghecode.com/codexguide/docs/images/mobile-codex-chatgpt-entry-watermarked-small.jpg)

## 它能做什么

手机连上电脑后，你可以在以下场景派上用场：

- 查看正在进行的线程和任务状态。
- 阅读 Codex 的阶段性输出、终端输出、截图、diff 和测试结果。
- 回复 Codex 的进一步提问。
- 审批命令、网络访问或其他需要人工确认的操作。
- 改变任务方向、切换模型或补充新的上下文。
- 新建任务，让 Codex 从已连接的开发环境里开始工作。
- 在 Codex Cloud 和不同的已连接电脑之间切换。
- 任务完成或需要你介入时，通过手机通知快速返回对话。

如果你选择的是已连接电脑，仓库文件、Shell 命令、依赖、凭据、MCP、Skills、浏览器和本地工具仍由那台电脑提供。手机主要用来发送指令、审批操作和查看结果，连接由 ChatGPT 的安全中继层协调。

## 使用前提

使用前先确认：

- 手机上安装并更新 ChatGPT App。
- 电脑上安装并更新 ChatGPT 桌面 App。手机远程连接不能从 Codex CLI 或 IDE 扩展中完成初始设置。
- 手机和电脑登录同一个 ChatGPT 账号和 workspace，且当前账号与 workspace 可以使用 Codex。
- 如果组织要求 MFA、SSO 或 Passkey，需要先完成验证；管理员也可能需要先开启 Remote Control。
- 作为宿主的 Mac 或 Windows 电脑需要保持唤醒、联网，并持续运行 ChatGPT 桌面 App。
- 如果任务会写文件、跑命令、访问网络，仍然需要理解并确认对应权限。

## 首次连接手机

1. 在要连接的电脑上打开 ChatGPT 桌面 App。
2. 进入 `Settings > Connections > Control this Mac or PC`。
3. 选择 `Set up` 或 `Add`，允许远程访问，并完成界面上要求的验证。
4. 用手机扫描电脑上显示的二维码。
5. 确认手机和电脑使用同一个 ChatGPT 账号和 workspace，然后完成配对。
6. 在手机 ChatGPT App 中打开 Codex（旧版可能显示为 Remote），选择已连接的电脑和项目。

每台手机都需要和每台要控制的宿主分别配对。配对后，可以在桌面 App 的 `Settings > Connections` 中管理已连接设备。

## 推荐使用场景

手机端适合「离开电脑但不想让任务停住」的场景：

- 通勤路上查看长任务进展。
- Codex 需要你选择方案时，快速给出方向。
- 任务卡在权限审批时，从手机上批准或拒绝。
- 会议前让 Codex 汇总最新代码、issue、文档或客户背景。
- 突然想到一个改动点，先发给 Codex 开始探索，回到电脑后再细看 diff。

## 不适合怎么用

手机端不能替代完整的本地审查。下面这些事情最好回电脑上做：

- 大范围代码合并前的最终 review。
- 涉及生产环境、密钥、账单、发布部署的高风险操作。
- 需要长时间阅读大量 diff 的任务。
- 需要你手动操作 IDE、调试器或本地 GUI 的任务。

毕竟电脑的大屏优势仍然是不可替代的。

## 一个典型流程

1. 在电脑上打开 ChatGPT 桌面 App，进入 Codex 和对应项目。
2. 让 Codex 开始一个需要较长时间的任务，例如排查失败测试或整理文档。
3. 离开电脑，在 ChatGPT 手机 App 中进入 Codex。
4. 打开同一个正在运行的任务线程。
5. 查看 Codex 的输出、截图、终端日志、测试结果或 diff。
6. Codex 需要确认时，直接在手机上回复、审批或调整方向。
7. 回到电脑后，再做完整 diff review、运行验证命令和提交。

## 本地宿主、远程环境和 Codex Cloud 的区别

在手机端，Cloud 和已连接的电脑是同一个 Codex 界面中的不同执行位置，不是两个完全独立的手机入口。

| 对比项 | 已连接的 Mac / Windows 电脑 | 通过宿主连接的远程环境 | Codex Cloud |
| --- | --- | --- | --- |
| 执行位置 | 你的电脑 | SSH 主机、devbox 或托管开发环境 | ChatGPT 连接的云端任务环境 |
| 文件与工具 | 来自本地电脑 | 来自远程环境 | 依赖云端仓库、环境和授权 |
| 适合任务 | 需要本地项目、凭据或工具的任务 | 项目本来就位于远程机器的任务 | 不依赖当前本地电脑的任务 |
| 离开电脑后 | 可继续控制，但宿主必须保持唤醒、联网并运行桌面 App | 需要桌面宿主与远程环境都保持可连接 | 不依赖当前本地电脑持续在线 |

::: warning 不要把 Cloud 和本地权限混在一起
部分 workspace 还可能开启 **Local computer access with Work Cloud**。这类任务由云端协调，但在线电脑可以执行需要本地资源的步骤。它和普通的 Codex 宿主连接不是同一种模式，实际能力以 workspace 配置为准。
:::

## 下一步

下一步：[安装与登录](./10-cli-installation.md)。
