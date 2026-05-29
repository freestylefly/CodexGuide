---
description: "手机端跟进桌面 Codex 任务教程，说明 ChatGPT App 入口、跨设备连接、任务查看和协同边界。"
---

# 用手机端 Codex 跟进桌面任务

::: tip 最后核对
官方资料最后核对日期：2026-05-27。本文参考 OpenAI 官方文章 [Work with Codex from anywhere](https://openai.com/index/work-with-codex-from-anywhere/)。具体入口、可用地区、系统支持和界面名称会随客户端更新变化，请以当前 ChatGPT 手机 App 和 Codex 桌面 App 为准。
:::

这里说的“手机端 Codex”，更准确地说，是 **ChatGPT 手机 App 里的 Codex 入口**。它不是单独的手机 Codex App，也不是把手机变成远程桌面鼠标键盘。

你可以把它理解成：桌面 App、远程开发机或其他已授权环境里正在运行 Codex，手机端负责连接这些环境，让你在离开电脑时继续查看、回复、审批和调整任务。

你需要更新你的 ChatGPT APP 到最新版本，然后选择连接你电脑里面的 Codex。


![ChatGPT 手机 App 中的 Codex 入口](../images/mobile-codex-ios-app.jpg)


连接桌面 Codex APP：

![手机端连接桌面 Codex App](../images/mobile-codex-connect-desktop.jpg)


在 ChatGPT 中打开 Codex，就可以直接使用了。

![在 ChatGPT 手机 App 中打开 Codex](../images/mobile-codex-chatgpt-entry.jpg)


## 它能做什么

手机端连接到正在运行 Codex 的机器后，可以继续处理这些事情：

- 查看正在进行的线程和任务状态。
- 阅读 Codex 的阶段性输出、终端输出、截图、diff 和测试结果。
- 回复 Codex 的澄清问题。
- 审批命令、网络访问或其他需要人工确认的操作。
- 改变任务方向、切换模型或补充新的上下文。
- 新建任务，让 Codex 从已连接的开发环境里开始工作。

真正执行任务的地方仍然是桌面 App 或远程环境。你的文件、依赖、凭据、权限和本地配置不会因为手机端接入而搬到手机上。

## 使用前提

使用前先确认这些条件：

- 手机上安装并更新 ChatGPT App。
- 电脑上安装并更新 Codex 桌面 App。
- 手机和电脑登录同一个 ChatGPT / OpenAI 账号，且处在支持 Codex 的地区和套餐范围内。
- 桌面 App 已经连接到对应项目，或 Codex 正在某台已授权机器、devbox、远程环境中运行。
- 如果任务会写文件、跑命令、访问网络，仍然需要理解并确认对应权限。

::: info 平台支持
OpenAI 官方文章说明，Codex 手机端能力正在 iOS 和 Android 的 ChatGPT App 中预览推出。连接 macOS 上的 Codex App 可用；连接 Windows 上的 Codex App 支持仍以官方当前说明为准。
:::

## 推荐使用场景

手机端最适合处理“离开电脑但不想让任务停住”的时刻：

- 通勤路上查看长任务进展。
- Codex 需要你选择方案时，快速给出方向。
- 任务卡在权限审批时，从手机上批准或拒绝。
- 会议前让 Codex 汇总最新代码、issue、文档或客户背景。
- 突然想到一个改动点，先发给 Codex 开始探索，回到电脑后再细看 diff。

## 不适合怎么用

手机端不适合替代完整的本地审查流程。下面这些事情最好回到电脑上做：

- 大范围代码合并前的最终 review。
- 涉及生产环境、密钥、账单、发布部署的高风险操作。
- 需要长时间阅读大量 diff 的任务。
- 需要你手动操作 IDE、调试器或本地 GUI 的任务。

如果你在手机上审批命令，建议只批准自己能看懂的操作。遇到删除、覆盖、部署、传输敏感数据等动作，先停下来，回到电脑上确认。

## 一个典型流程

1. 在电脑上打开 Codex 桌面 App，并进入对应项目。
2. 让 Codex 开始一个需要较长时间的任务，例如排查失败测试或整理文档。
3. 离开电脑后，在 ChatGPT 手机 App 中进入 Codex。
4. 打开同一个正在运行的任务线程。
5. 查看 Codex 的输出、截图、终端日志、测试结果或 diff。
6. 如果 Codex 需要确认，直接在手机上回复、审批或调整方向。
7. 回到电脑后，再做完整 diff review、运行验证命令和提交。

## 和 Codex Cloud 的区别

| 对比项 | 手机端连接桌面 App | Codex Cloud |
| --- | --- | --- |
| 执行位置 | 你的电脑、devbox 或远程环境 | OpenAI / ChatGPT 连接的云端任务环境 |
| 文件与凭据 | 留在原机器上 | 依赖云端连接的仓库与授权 |
| 适合任务 | 跟进本地长任务、审批、查看结果 | 不依赖本地电脑的仓库任务 |
| 是否能离开电脑 | 可以，但原执行环境要可连接 | 可以 |

一句话：**手机端 Codex 更像“随身工作台”，Codex Cloud 更像“云端执行环境”。**

下一步：[连接第三方 API](./05-third-party-api.md)
