---
description: "Codex 学习路线，从入口认知、任务闭环、工程化验证到团队沉淀，帮助新手建立完整使用路径并选择下一章。"
---

# 学习路线


::: tip 最后核对
官方资料最后核对日期：2026-06-12。核心来源包括 [OpenAI Codex 产品页](https://openai.com/codex/)、[Codex 文档入口](https://developers.openai.com/codex/)、[Codex CLI 官方仓库](https://github.com/openai/codex) 与 [Codex Help Center](https://help.openai.com/en/articles/11369540-codex-in-chatgpt)。
:::

![Codex 使用入口地图](/images/codex-surfaces.svg?v=20260611)

## Codex 的产品形态

Codex 可以出现在桌面软件里，也可以出现在命令行、编辑器插件和网页里。

- 桌面 App：我们最熟悉的软件形态。最适合第一次上手。你可以选择一个文件夹，让 Codex 帮你读文件、改文档、整理内容。或者直接开始聊天。
- CLI：终端里的 Codex，更适合开发者在项目文件夹里读代码、改文件、运行命令。
- Cloud / Web / ChatGPT：适合把任务交给云端处理，或者从 ChatGPT 里跟进项目问题。
- IDE：在 VS Code 这类编辑器里使用 Codex 插件。适合更喜欢集成开发环境的开发者们。
- GitHub、Slack、Linear、MCP 等集成：更偏团队和开发进阶场景。

如果你刚开始接触 Codex，桌面 App 通常是最容易上手的入口。它有图形界面、项目列表、设置入口和快捷键支持，不需要先熟悉终端。


## 快速开始

1. [下载安装 Codex 桌面 App](./01-app-installation.md)，先把软件打开。
2. 按需了解 [订阅 ChatGPT Plus](./02-subscribe-plus.md)，确认自己的账号能不能使用 Codex。根据 OpenAI Help Center，Codex 包含在符合条件的 ChatGPT 计划中，其中包括 Free；具体用量限制会因计划而异。
3. 阅读 [了解 Codex 基本组成](./03-app-overview.md)，知道项目、对话、设置大概在哪里。
4. 跟着 [用 Codex 完成第一个任务](./06-app-first-task.md)，选一个不容易出错的小任务。
5. 如果你常用手机，可以再看 [手机端如何跟进桌面任务](./04-mobile-control-desktop.md)。
6. 如果你需要第三方 API，再看 [连接第三方 API](./05-third-party-api.md)。

第一轮的目标很简单：把 Codex 安装好，能和它正常交流，并让它尝试阅读一个你指定的文件夹。之后再结合最近的真实需求，试着让 Codex 完成一个小任务。

## 使用 Codex 开发

这条路适合已经会一点终端、项目文件夹或 Git 的读者。如果你还不熟，也没关系，先从 App 路线开始会轻松很多。

推荐顺序：

1. 先看 [入口地图](/platform/)，知道 CLI、桌面 App、Cloud 和 IDE 分别适合什么。
2. 阅读 [CLI 安装与登录](./12-cli-installation.md)，确认命令能正常运行。
3. 跟着 [第一次让 Codex 改代码](./13-cli-first-run.md)，从文档、测试或一个小 bug 开始。
4. 阅读 [任务执行机制](./07-task-execution.md)，理解它会读哪些文件、运行哪些命令、怎么汇报结果。
5. 补上 [AGENTS.md](./15-agents-md.md)，把项目规则写给 Codex 看。
6. 阅读 [沙盒与审批](./16-sandbox-approvals.md)，知道哪些操作需要先确认。

在开发过程中，你会碰到许多专有名词，这里先记住几个词就够了：

- 仓库：一个完整项目文件夹，通常由 Git 管理。
- diff：改动前后的对比。
- PR：把改动交给别人审核的一种方式。
- CI：自动运行测试或构建的检查流程。
- `AGENTS.md`：写给 Codex 看的项目说明书。

不必强求记住所有专有名词。碰到陌生的词，可以直接让 Codex 解释；用得多了，自然就熟了。

## 使用 Codex 完成日常任务

很多人第一次听到 Codex，会以为它只是写代码用的。其实只要你的任务里有文件、有目标、有可以检查的结果，它就可能帮上忙。比如：

- 整理一堆旅游攻略、酒店链接和预算表，帮你做成一份行程清单。
- 读几份课程资料或 PDF，帮你提炼重点、整理复习提纲。
- 把会议录音转写稿、聊天记录或零散备忘，整理成待办事项。
- 检查一份报名表、活动通知或教程，看看有没有缺步骤、时间写错、链接没说清楚。
- 把每周都要做的报销、周报、资料归档步骤写成模板，下次直接复用。
- 帮你整理家庭账单、购物清单、搬家清单、活动分工表这类零散文件。

你可以从自己最近真的需要处理的小事开始试。任务说得越具体，Codex 越容易给出能检查的结果。

## 下一步从哪里点

- 还没安装：从 [桌面 App 下载与安装](./01-app-installation.md) 开始。
- 已经装好了：直接做 [第一个任务](./06-app-first-task.md)。
- 想先知道不同入口怎么选：看 [入口地图](/platform/)。
- 准备改真实项目：看 [CLI 安装与登录](./12-cli-installation.md)。
