---
description: "用 Codex 完成第一个任务的入门教程，带你选择工作目录、输入任务、查看结果并完成基础验证，形成操作习惯。"
---

::: tip 最后核对
官方资料最后核对日期：2026-10-12。本章以 ChatGPT 桌面应用中的 Codex 第一个任务为例。项目、聊天、文件夹、权限和任务执行入口请以 [ChatGPT desktop app](https://learn.chatgpt.com/docs/app)、[Projects and chats](https://learn.chatgpt.com/docs/projects)、[Settings](https://learn.chatgpt.com/docs/reference/settings) 与 [Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security) 为准。界面可能随版本更新而变化，请以实际客户端为准。
:::

# 用 Codex 完成第一个任务


本章以“在 ChatGPT 桌面应用中使用 Codex 开发一个关于 AI 发展历史的简单网页”为例，走完一次完整的任务闭环，帮助你快速上手 Codex 的基本用法。

## 第一步：创建本地工作文件夹

在本地新建一个空文件夹，作为 Codex 的工作目录。Codex 生成的所有文件都会保存在这里。

::: warning
文件夹路径中尽量不要包含中文，避免部分工具出现兼容性问题。
:::

![新建本地文件夹](https://cdn.canghecode.com/codexguide/docs/images/codex-first-task-local-folder.png)

## 第二步：选择工作位置和聊天方式

打开 ChatGPT 桌面应用并切换到 Codex 后，你可以直接新建聊天、创建项目，或者打开本地文件夹开始任务。

- **普通聊天或 Quick chat**：适合目标明确、一次就能完成的独立任务。
- **本地项目（local project）**：连接电脑上的一个或多个文件夹，项目中的多个聊天可以访问相同文件，但各自保留独立的聊天记录。
- **ChatGPT 项目**：用于集中管理聊天、上传文件、项目指令和连接的来源，但它本身不等于本地工作目录，也不会自动获得电脑文件夹的访问权限。

如果任务会持续一段时间、产生多个结果，或者多个聊天都要使用同一批本地文件，优先使用本地项目。一次性的简单任务直接新建聊天即可。

## 第三步：添加工作目录

选择使用项目后，点击项目旁边的“+”按钮，进入创建项目窗口。

![image.png](https://cdn.canghecode.com/yanyan/20261012151724897.png)

选择“在此电脑上添加文件夹”，然后选中第一步创建的文件夹。

![image.png](https://cdn.canghecode.com/yanyan/20261012151834078.png)

确认文件夹无误后，点击“创建项目”。

![image.png](https://cdn.canghecode.com/yanyan/20261012151941760.png)

项目创建完成后，对话框左下角会显示当前工作目录。确认路径正确，就可以开始输入任务了。

![image.png](https://cdn.canghecode.com/yanyan/20261012152122277.png)


## 第四步：输入任务描述，开始执行

在对话框中输入你的需求，点击发送，Codex 就会开始执行任务。

![image.png](https://cdn.canghecode.com/yanyan/20261012152320084.png)

任务完成后，Codex 会在对话中展示结果，同时将生成的文件写入工作目录。

![image.png](https://cdn.canghecode.com/yanyan/20261012152929132.png)

如果生成的是网页文件，可以通过文件预览或浏览器打开结果。具体入口和是否需要浏览器权限，以当前客户端显示为准。

![image.png](https://cdn.canghecode.com/yanyan/20261012152840402.png)


## 第五步：逐步迭代

对结果不满意时，直接在当前对话框中继续描述修改需求，Codex 会在已有基础上进行调整。

随着对话内容增加，Codex 会持续管理当前聊天的上下文。

![image.png](https://cdn.canghecode.com/yanyan/20261012152456394.png)


::: info 什么是上下文窗口？
上下文窗口决定模型在当前任务中一次能够处理多少内容。长对话中的历史消息、文件内容和工具结果都会占用上下文，但 Codex 也可能对较早内容进行整理。与其等到上下文接近上限，更推荐为每个独立目标创建一个新聊天，让任务保持聚焦。在同一个本地项目中，新聊天仍可访问项目连接的文件夹，但不会继承其他聊天的完整对话记录。
:::

![image.png](https://cdn.canghecode.com/yanyan/20261012152547086.png)


如果使用的是"对话"模式而非项目，新建对话时需要重新指定工作目录，两个对话之间也是相互隔离的，不方便统一管理。这也是推荐使用项目的主要原因之一。

## 下一步

下一步：[任务设计](./07-task-design.md)。
