---
description: "Computer History 入门指南，介绍如何在 macOS 上记录、查找和清理最近的电脑活动，以及使用时需要注意的隐私与安全问题。"
permalink: /advanced/computer-history/
---

::: tip 最后核对
官方资料最后核对日期：2026-10-14。本文根据 [Computer History 官方文档](https://learn.chatgpt.com/docs/customization/computer-history) 整理。支持计划、地区和设置入口可能继续变化，请以当前客户端和官方页面为准。
:::

# Computer History：找回最近在电脑上做过的事

工作时，你可能会在浏览器、文档、聊天软件和代码编辑器之间来回切换。过了一段时间，很容易忘记刚才打开的文件在哪里，或者上一项工作进行到了哪一步。

Computer History 会在你允许的范围内，把最近的应用和网站活动整理成时间线和本地记忆。之后，你可以用普通的话询问 ChatGPT 或 Codex，例如“我休息前在做什么？”或“帮我整理昨天的工作日报”。

可以把它理解成一本由 Codex 自动整理的“电脑工作日志”。它会根据允许记录的操作和文字信息，生成方便回顾的文字摘要。
::: warning
Computer History 目前只支持 macOS 版 ChatGPT 桌面 App。Windows、Linux 和 WSL2 用户不能按照本章步骤开启。它还需要先开启 Memories，并且不支持通过 API Key 或 Amazon Bedrock 使用。
:::

---

## Computer History 能帮你做什么

### 继续刚才的工作

例如，你上午同时查看了一份方案、一段群聊和几个网页，下午回来时已经记不清上次做到了哪里。可以问：

> 我上次休息前在做什么？还有哪些事没做完？

Computer History 可以根据时间线，帮你找回当时的工作背景。

![image.png](https://cdn.canghecode.com/yanyan/20261014164011147.png)

### 找到最近看过的内容

如果只记得“今天看过一份报价方案”，却忘了文件名和保存位置，可以问：

> 我今天上午看过的报价方案在哪里？

Computer History 可以先利用历史记录找到你指的内容。如果还需要读取原文，ChatGPT 或 Codex 会再访问对应的文件、网页或已连接应用。

![image.png](https://cdn.canghecode.com/yanyan/20261014164121337.png)

### 整理日报和重复流程

你还可以让它整理最近的工作：

> 按项目列出我今天做过的事，并整理成一份简短日报。

![image.png](https://cdn.canghecode.com/yanyan/20261014164150788.png)


如果某套操作经常重复出现，时间线还可能建议把它制作成 Skill 或自动化任务。你需要先检查建议，再决定是否创建。

---

## 开启前需要满足什么条件

在开启 Computer History 之前，先确认以下条件：

- 使用 macOS 版 ChatGPT 桌面 App。
- 使用当前支持的 ChatGPT Pro、Business 或 Enterprise 计划。
- 已经开启 [Codex Memories](./12-memories.md)。
- 所在地区已经支持这项功能。

Pro 用户可以自己决定是否开启。

Business 和 Enterprise 工作区默认不开放这项功能，需要管理员先授权，成员才能在自己的 Mac 上开启。

::: tip
管理员授权只表示“允许使用”，不会自动替成员开启 Computer History。无论使用哪种支持的计划，每位用户都需要自己确认开启。
:::

---

## 如何开启 Computer History

1. 在 Mac 上打开 ChatGPT 桌面 App。
2. 打开 **Settings（设置）**，然后进入 **Integrations（集成）> Computer history（电脑历史）**。
3. 选择 **Turn on（开启）**。开启前，页面会显示隐私、系统权限和本地存储说明，确认可以接受后再继续。
4. Computer History 需要配合 Memories 使用。如果 Memories 还没有开启，按照页面提示先完成开启。
5. 选择哪些应用和网站可以加入历史记录。建议刚开始时只选择少量工作工具，等熟悉后再扩大范围。
6. 如果 macOS 弹出授权窗口，仔细查看申请的权限，再按照提示完成设置。

Computer History 无需获取 macOS 的屏幕录制权限。

![image.png](https://cdn.canghecode.com/yanyan/20261014170522323.png)


::: tip 设置中找不到 Computer history 怎么办
先检查当前的 ChatGPT 套餐和所在地区是否支持这项功能。如果使用 Business 或 Enterprise 工作区，还要请管理员确认是否已经为你开放使用权限。
:::

---

## 它会记录什么

Computer History 需要先了解你最近在电脑上做了什么，才能把这些活动整理成时间线。因此，它会在你允许的应用和网站中，记录一些操作和页面信息。

官方将这些记录称为“交互事件”。可以把一次交互事件理解成一条简单的活动记录，例如你点击了某个按钮，输入了一段文字，或者从一个应用切换到另一个应用。它可能包括：

- 鼠标点击
- 键盘输入和快捷键
- 应用切换
- macOS 辅助功能能够读取的页面文字和相关信息

Computer History 会定期整理这些记录。例如，它可以把“打开项目文档、查看群聊反馈、修改方案”等操作，整理成一条便于回顾的文字摘要，并生成本地记忆。

![image.png](https://cdn.canghecode.com/yanyan/20261014170645011.png)

### 哪些内容不会记录

- Computer History 不会将屏幕截图保存到历史记录中。
- 它不会录制麦克风声音、系统声音或其他音频。
- 使用浏览器的无痕或隐私模式时，其中的活动也不会进入 Computer History。

::: warning 仍然要注意页面上的文字
Computer History 虽然不保存屏幕截图，但它可能通过 macOS 的辅助功能，读取页面上的文字和相关信息。

例如，页面上显示的客户名称、聊天内容或项目资料，都可能进入活动摘要。因此，不要让 Computer History 记录密码管理器、密钥页面以及其他包含敏感信息的应用或网站。
:::

---

## 选择允许记录的应用和网站

进入 **Settings（设置）> Computer history（电脑历史）> Permissions（权限）**，可以选择两种管理方式。

- **Exclude these apps / websites（排除这些应用或网站）** 表示不记录指定的应用或网站，其他允许的来源仍可以记录。
- **Include only these apps / websites（仅包含这些应用或网站）** 表示只记录你明确选中的应用或网站。

![image.png](https://cdn.canghecode.com/yanyan/20261014171106890.png)


对初学者来说，第二种方式更容易控制范围。例如，可以先只允许代码编辑器和项目文档，不要一开始就纳入邮箱、聊天软件和网银。

也可以在时间线中选择某个应用图标，将它从以后的记录中排除。

::: tip
修改允许范围只会影响以后的记录，不会自动删除以前生成的内容。如果还需要清理旧记录，请在 **History（历史记录）** 中手动删除。
:::

---

## 临时暂停或完全关闭

如果只是暂时不希望 Computer History 记录活动，不需要将整个功能关闭。你可以在设置页面中操作，也可以点击 macOS 菜单栏中的 ChatGPT 图标，展开 **Computer History（电脑历史）** 菜单。

- 选择 **Pause（暂停）**，Computer History 会暂停记录新活动。
- 需要继续使用时，选择 **Resume（恢复）**。
- 如果以后都不想继续记录，可以关闭 Computer History。

在这个菜单中，还可以看到 Computer History 当前正在记录哪个应用或哪类活动。

暂停前先看一眼，可以帮助你确认它是否记录了不希望保留的内容。

::: warning
当你与其他人聊天、参加视频会议或共同查看资料时，Computer History 可能记录到对方的信息。得到对方明确同意之前，应先暂停记录。查看健康、财务、个人隐私或公司机密资料时，也建议暂停记录，或者提前排除相关应用。
:::

选择暂停后，Computer History 不会再记录新操作。不过，暂停前收集的内容可能已经进入整理流程，这次整理可能会继续到摘要生成完成。

---

## 查看和删除历史

进入 **Settings > Computer history > History**，可以看到按日期和时间整理的活动摘要。每条记录可能包含：

- 活动标题和文字摘要
- 参与这段活动的应用
- 根据重复流程生成的 Skill 或自动化建议
- 在 Finder 中显示对应记忆文件的入口
- 删除当前记录的操作

可以删除单条记录，也可以清除最近 10 分钟、最近 1 小时、最近 1 天或全部历史。

![image.png](https://cdn.canghecode.com/yanyan/20261014180511707.png)


::: warning
清除历史时，相关的交互事件和由它们生成的 Memories 也会被删除，而且无法恢复。操作前先确认其中没有以后还需要的信息。
:::

---

## 数据保存在哪里

Computer History 会先在 Mac 上临时保存交互事件。这些临时文件会被隔离在 ChatGPT App Group 中，并在 48 小时后删除。

由这些活动生成的 Markdown 记忆会保存在：

```text
$CODEX_HOME/memories/extensions/skysight/
```

如果没有修改过 `CODEX_HOME`，通常就是：

```text
~/.codex/memories/extensions/skysight/
```

这些记忆会一直保留，直到你主动删除或清空对应历史。

::: warning
Computer History 不会额外加密这些记忆文件。同一个 macOS 用户账户下运行的其他程序，也可能读取到它们。不要把不希望保存的应用或网站纳入记录范围，并保护好自己的 Mac 账户。
:::

---

## 哪些数据会发送给 OpenAI

Computer History 会先在本地收集交互事件，然后定期启动一个临时 Codex 会话，将这些信息整理成摘要和记忆。

OpenAI 会在服务器上处理临时事件文件。根据官方说明，除非法律要求，OpenAI 不会在处理完成后继续保留这些临时文件，也不会用它们进行模型训练。生成的记忆会保存回你的 Mac。

以后当 ChatGPT 或 Codex 使用某条记忆时，与当前任务有关的记忆和交互信息可能会被加入聊天上下文。这些聊天是否可用于改进模型，取决于你的 ChatGPT 数据控制设置。

---

## 安全使用建议

### 小范围开始

刚开始使用时，先选择少量、低风险的应用，用一段时间了解它会生成什么内容，再决定是否扩大范围。

### 主动排除敏感来源

建议排除密码管理器、网银、医疗系统、私人邮箱、涉密内部工具以及其他不希望被整理成记忆的来源。

### 注意网页中的恶意指令

Computer History 会读取应用和网站中的文字。如果页面中藏有试图操控 AI 的恶意指令，就可能带来提示词注入风险。

可以把它理解成，有人在你交给 Codex 的资料中夹了一张假指令。如果 Codex 把它当成真正的任务要求，就可能做出不符合你意图的操作。

因此，在让 Codex 根据历史执行删除文件、发送消息、修改账号或其他重要操作前，先检查它找到的来源和即将执行的步骤。

### 定期检查和清理

定期打开 History，检查其中是否出现了不希望保留的内容。如果工作项目、账号权限或公司规则发生变化，也要重新检查允许记录的应用和网站。

---

## 常见问题

### 为什么设置中看不到 Computer History？

先确认正在使用 macOS 版 ChatGPT 桌面 App，并检查计划和地区是否支持。如果使用 Business 或 Enterprise 工作区，还需要管理员先开放权限。

### 为什么开启后没有开始记录？

先检查 Memories 是否已经开启。然后进入 **Settings > Computer history**，根据页面上的状态选择 **Finish setup**、**Resume** 或 **Try again**。如果仍然无法使用，退出并重新打开 ChatGPT 桌面 App。

### 暂停后，以前的历史会被删除吗？

不会。暂停只是阻止继续收集新活动。如果要删除以前的记录，需要在 **History** 中单独清理。

### 关闭 Memories 后还能使用吗？

不能正常使用。Computer History 需要 Memories 来生成和使用跨聊天的活动记忆。

### 它会消耗 Codex 额度吗？

会。Computer History 在整理活动和生成 Memories 时会消耗 token。

## 下一步

如果还不了解本地记忆的开启方式和隐私设置，先阅读 [Codex Memories：让 Codex 记住以前的工作](./12-memories.md)。
