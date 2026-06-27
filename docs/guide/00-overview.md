---
description: "Codex 学习路线，从入口认知、任务闭环、工程化验证到团队沉淀，帮助新手建立完整使用路径并选择下一章。"
---

# 学习路线


::: tip 最后核对
官方资料最后核对日期：2026-06-12。核心来源包括 [OpenAI Codex 产品页](https://openai.com/codex/)、[Codex 文档入口](https://developers.openai.com/codex/)、[Codex CLI 官方仓库](https://github.com/openai/codex) 与 [Codex Help Center](https://help.openai.com/en/articles/11369540-codex-in-chatgpt)。
:::

![Codex 使用入口地图](https://cdn.canghecode.com/codexguide/docs/.vuepress/public/images/codex-surfaces.svg?v=20260611)

## Codex 的产品形态

Codex 有桌面 App、命令行、编辑器插件和网页几种形态。

- 桌面 App：我们最熟悉的软件形态，第一次上手推荐用这个。选一个文件夹，让 Codex 读文件、改文档、整理内容，或者直接聊天。
- CLI：终端里的 Codex，在项目文件夹里读代码、改文件、跑命令。
- Cloud / Web / ChatGPT：任务交给云端处理，或在 ChatGPT 里跟进项目。
- IDE：在 VS Code 等编辑器里用 Codex 插件，喜欢集成开发环境的开发者适用。
- GitHub、Slack、Linear、MCP 等集成：偏团队和进阶场景。

第一次用 Codex，推荐从桌面 App 开始。界面直观，功能齐全，对新手友好。


## 快速开始

1. [下载安装 Codex 桌面 App](./01-app-installation.md)，先把软件打开。
2. 按需了解 [订阅 ChatGPT Plus](./02-subscribe-plus.md)，确认账号能不能用 Codex。OpenAI Help Center 说明 Codex 包含在符合条件的 ChatGPT 计划中，包括 Free 档；具体用量限制因计划而异。
3. 阅读 [了解 Codex 基本组成](./03-app-overview.md)，知道项目、对话、设置大概在哪里。
4. 跟着 [用 Codex 完成第一个任务](./06-app-first-task.md)，选一件小任务开始练手。
5. 阅读 [理解费用](./07-understanding-costs.md)，分清 ChatGPT 计划额度、API token 和缓存机制。
6. 如果你常用手机，可以再看 [手机端如何跟进桌面任务](./04-mobile-control-desktop.md)。
7. 如果你需要第三方 API，再看 [连接第三方 API](./05-third-party-api.md)。

第一轮目标：装好 Codex，能跟它正常交流，让它读一个你指定的文件夹，知道大概哪些操作会消耗额度或 token。之后结合真实需求，试着完成一个小任务。

## 使用 Codex 开发

用过 Claude Code 的话，Codex 很容易上手。没用过也没关系，像平时用 AI 一样自然地用就行。

推荐顺序：

1. 先看 [入口地图](/platform/)，知道 CLI、桌面 App、Cloud 和 IDE 分别适合什么。
2. 阅读 [CLI 安装与登录](./13-cli-installation.md)，确认命令能正常运行。
3. 跟着 [第一次让 Codex 改代码](./14-cli-first-run.md)，从文档、测试或一个小 bug 开始。
4. 阅读 [任务执行机制](./08-task-execution.md)，理解它会读哪些文件、运行哪些命令、怎么汇报结果。
5. 了解 [AGENTS.md](./16-agents-md.md)，把项目规则写给 Codex 看。
6. 阅读 [沙盒与审批](./17-sandbox-approvals.md)，知道哪些操作需要先确认。
7. 阅读 [自动线程管理](./18-thread-management.md)，学会继续、分叉、移交和整理任务。

在开发过程中，你会碰到许多专有名词，这里先记住几个词就够了：
- **仓库（repository / repo）**：  
  一个项目的“家”。代码、文档、配置文件通常放这里，一般用 Git 记录变化。

- **diff**：  
  “改了哪里”的对比清单。告诉你文件修改前什么样，修改后变成什么样。

- **PR（Pull Request）**：  
  理解为“我改好了，请你帮我看一下”。  
  团队协作时先提交改动，让别人审核，通过后再合并进主项目。

- **CI（Continuous Integration）**：  
  自动检查流程。  
  提交代码后，系统自动跑测试、检查格式、尝试构建，确认改动有没有明显问题。

- **`AGENTS.md`**：  
  给 AI 编程助手看的“项目说明书”。  
  告诉 Codex / Agent 项目规则、怎么运行、怎么测试、写代码注意什么。每次对话时，Agent 通常把它作为重要上下文参考。

不用强记所有名词。碰到陌生的词，直接让 Codex 解释；用多了自然熟。

## 使用 Codex 完成日常任务

很多人以为 Codex 只能写代码。其实只要有文件、有目标、有结果可检查，它都能帮上忙。比如：

- 把旅游攻略、酒店链接和预算表放在一起，让 Codex 帮你整理成一份行程清单。
- 读几份课程资料或 PDF，提炼重点、整理复习提纲。
- 把会议录音转写稿、聊天记录或零散备忘，整理成待办事项。
- 检查一份报名表、活动通知或教程，看看有没有缺步骤、时间写错、链接没说清楚。
- 把每周报销、周报、资料归档的重复步骤写成模板，下次直接复用。
- 整理家庭账单、购物清单、搬家清单、活动分工表这类零散文件。

从最近实际需要处理的小事开始。任务说得越具体，Codex 解决得越快。

## 下一步从哪里点

- 还没安装？：从 [桌面 App 下载与安装](./01-app-installation.md) 开始。
- 已经装好了：直接做 [第一个任务](./06-app-first-task.md)。
- 想先知道不同入口怎么选：看 [入口地图](/platform/)。
- 准备改真实项目：看 [CLI 安装与登录](./13-cli-installation.md)。
