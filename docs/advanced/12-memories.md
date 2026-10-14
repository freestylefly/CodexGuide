---
description: "Codex Memories 使用指南，介绍本地记忆的作用、开启方法、聊天级控制、文件位置、配置选项以及隐私注意事项。"
---

::: tip 最后核对
官方资料最后核对日期：2026-10-13。本文依据 [OpenAI Memories](https://learn.chatgpt.com/docs/customization/memories)、[Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference) 与 [Computer History](https://learn.chatgpt.com/docs/customization/computer-history) 整理。Memories 的入口、配置项和可用范围可能继续变化，请以官方页面和当前客户端为准。
:::

# Codex Memories：让 Codex 记住以前的工作

新建聊天后，Codex 不会把以前的所有聊天内容重新读一遍。因此，你可能需要再次告诉它项目背景、自己的使用习惯，以及之前已经完成了哪些工作。

Memories 可以减少这种重复说明。开启后，Codex 会从以前的聊天中整理出以后可能还会用到的信息，并把它们保存成本地记忆。

例如，你多次要求 Codex 使用简短、自然的中文，它可能会把这个习惯记下来。以后开始新的写作任务时，Codex 就可以参考这条记忆，不需要你每次重新说明。

你可以把聊天记录理解成一场会议的完整录像，而 Memories 就像会后整理出的重点笔记。开始新任务时，Codex 不会重新查看所有聊天，而是在需要时参考这些笔记。q

::: warning
Memories 只能帮助 Codex 回忆以前的工作，不能保证每次都会使用。必须遵守的项目规则，例如测试命令、代码规范和禁止修改的文件，仍然要写进 `AGENTS.md` 或正式的项目文档。
:::

---

## Memories 和聊天记录有什么区别

聊天记录和 Memories 都来自以前的工作，但用途不同：

| 对比项      | 聊天记录          | Memories             |
| -------- | ------------- | -------------------- |
| 保存内容     | 一次聊天中的完整对话和过程 | Codex 从以前任务中整理出的重点信息 |
| 主要用途     | 回到原来的聊天继续工作   | 在新的聊天中提供相关背景         |
| 使用方式     | 打开原来的聊天       | Codex 在需要时自动参考相关记忆   |
| 是否等于完整原文 | 是，通常保留完整过程    | 不是，只保存整理后的信息         |

例如，你曾在一段很长的聊天中确定“这个项目使用 `pnpm`，提交前要运行测试”。聊天记录会保留整个讨论过程，Memories 则可能只留下与以后工作有关的简短结论。

---

## Memories、AGENTS.md 和项目文档的区别

Memories、`AGENTS.md` 和项目文档都会向 Codex 提供信息，但它们解决的问题不同。

- **Memories**：保存从以前聊天中整理出来的信息，例如你的表达习惯、常用工具和之前处理过的问题。
- **`AGENTS.md`**：保存 Codex 在项目中必须遵守的规则，例如使用什么命令、哪些文件不能修改、完成后要运行哪些测试。
- **项目文档**：保存项目本身的正式说明，例如怎样安装项目、接口如何使用、生产环境如何发布。

可以把它们想象成办公桌上的三样东西：

- Memories 像你随手整理的个人工作笔记，帮助回忆以前做过什么。
- `AGENTS.md` 像贴在桌前的工作要求，提醒 Codex 做事时要遵守哪些规定。
- 项目文档像团队共同使用的说明书，用来查询项目的正式信息。

例如，如果你希望 Codex 记住“回答时尽量使用简短、自然的中文”，可以使用 Memories；如果项目要求“提交代码前必须运行 `pnpm test`”，应该写进 `AGENTS.md`；如果要记录完整的生产环境发布步骤，则应该写进项目文档。

---

## 哪些客户端可以使用

Codex 的本地 Memories 可以在以下三个入口中使用：

- ChatGPT 桌面 App 中的 Codex
- Codex CLI
- Codex IDE 扩展

这些入口是否能看到同样的记忆，取决于它们是否使用同一个记忆文件夹。

Codex 会把配置、会话和 Memories 等本地数据保存在一个叫作 `CODEX_HOME` 的目录中。

例如，桌面 App、CLI 和 IDE 扩展都连接到同一台电脑，并且使用同一个 `CODEX_HOME`，它们通常可以读取同一套 Memories。如果它们运行在不同电脑，或者 Windows 与 WSL2 分别使用自己的目录，保存的记忆就不会自动同步。

这里还要注意，ChatGPT 网页版中的 Memory 和本地 Codex Memories 是两套不同的功能。ChatGPT 网页版以及 ChatGPT Work 使用账号或工作区提供的记忆设置，不会直接读取电脑中 Codex 的本地记忆文件。

---

## 如何开启 Memories

第一次使用时，本地 Codex Memories 通常处于关闭状态。只有主动开启后，Codex 才会在这台电脑上生成和使用记忆。

### 在桌面 App 中开启

1. 打开 ChatGPT 桌面 App。
2. 打开 **Settings（设置）**。
3. 进入 **Personalization（个性化）**。
4. 找到 **Enable Codex memories**，将它打开。

设置页面中还可能出现 **Allow memories from tool-assisted chats**。这个选项用来决定，使用过外部工具的聊天能不能被整理成新的记忆。

例如，Codex 在一次聊天中通过 MCP 读取了公司文档，或者通过 Web Search 搜索了网页资料。

- 打开这个选项后，这次聊天中的有用信息可以被整理成 Memories。
- 关闭这个选项后，Codex 仍然可以在当前聊天中使用这些工具，但不会根据这次聊天生成新的 Memories。

如果经常处理公司资料、客户信息或其他敏感内容，建议先关闭这个选项。

![image.png](https://cdn.canghecode.com/yanyan/20261014143316162.png)


### 使用 `config.toml` 开启

熟悉配置文件后，也可以在 `config.toml` 中加入：

```toml
[features]
memories = true
```

如果你刚开始使用，优先通过桌面 App 设置即可。需要统一多台设备或多个环境时，再考虑修改配置文件。

---

## 使用 `/memories` 控制当前聊天

在 Codex Desktop 或 Codex CLI 的聊天中输入下面的命令，可以单独设置当前聊天怎样使用 Memories。

```text
/memories
```

![image.png](https://cdn.canghecode.com/yanyan/20261014151120539.png)


打开后，你会看到两个可以分别控制的选项。

1. 是否允许当前聊天读取以前保存的 Memories。
2. 是否允许 Codex 从当前聊天中整理出新的 Memories，供以后使用。

![image.png](https://cdn.canghecode.com/yanyan/20261014151155821.png)

可以把它们理解成两个独立的开关。第一个开关控制“能不能看以前的记忆”，第二个开关控制“要不要记住这次聊天”。你可以只打开其中一个，也可以同时打开或关闭。

例如，你正在使用一份临时的客户资料，希望 Codex 继续按照以前的写作习惯工作，但不希望客户资料被整理进记忆。这时，可以允许当前聊天读取以前的 Memories，同时关闭“根据当前聊天生成新记忆”的选项。

::: tip
桌面 App 中的 Memories 开关管理的是这台电脑，而 `/memories` 管理的只是当前聊天。修改 `/memories` 中的选项，不会影响其他聊天，也不会改变桌面 App 中的总开关。
:::

---

## Codex 会记住哪些内容

开启 Memories 后，Codex 会从符合条件的旧聊天中提取以后可能有用的信息，例如：

- 经常使用的项目和工具
- 重复出现的工作流程
- 已经确认的问题原因
- 常用的输出格式或表达习惯
- 完成某类任务时需要注意的事项

Codex 不会在聊天结束后立即保存记忆。它通常会等待一段时间，再在后台整理聊天中对以后有用的内容。如果聊天太短、还没有结束，或者没有值得保留的信息，Codex 可能不会从中生成记忆。

整理记忆也会消耗 Codex 的使用额度。如果剩余额度低于设定的比例，Codex 可能会先暂停这项工作，尽量把剩余额度留给正在进行的任务。

Memories 只会提取聊天中可能在以后用到的信息，不会像录音或聊天备份那样，把所有内容原样保存下来。

因此，重要的结论不能只依赖 Memories，如果希望长期、准确地保留，还应把它写进项目文档或其他正式文档中。

---

## 记忆文件保存在哪里

Codex 会把 Memories 保存在电脑本地的 `CODEX_HOME` 中。如果没有修改过保存位置，记忆文件通常位于：

```text
~/.codex/memories/
```

这个文件夹中可能保存以下内容：

- 记忆摘要
- 长期保留的信息
- 最近任务的整理结果
- 用来说明这些记忆从何而来的相关记录

这些文件由 Codex 自动创建和维护。你可以打开它们查看内容，但不建议通过直接修改文件来管理 Memories。平时如果想开启、关闭或调整记忆功能，应优先使用 App 中的设置或 `/memories` 命令。

记忆中可能包含项目背景、工作习惯或其他不适合公开的信息。因此，在分享整个 `.codex` 文件夹之前，记得先检查其中的 Memories，避免意外泄露敏感内容。

此外，Windows 原生环境和 WSL2 通常使用不同的 `CODEX_HOME`，因此两边会各自保存一套 Memories，默认不会自动同步。相关区别见 [macOS、Windows、Linux 与 WSL 使用区别](../start/15-platforms.md#为什么-windows-和-wsl-的配置没有同步)。

---

## 如何查看和删除 Memories

### 查看本地记忆

想知道 Codex 已经保存了哪些记忆，可以打开下面的文件夹：

```text
~/.codex/memories/
```

查看时，建议重点检查以下几类内容：

- 是否包含已经过期的项目结论
- 是否记录了不希望长期保存的个人信息
- 是否包含本地路径、客户名称或内部项目资料
- 是否有内容已经与当前项目状态不一致

### 删除 Memories

如果只是不希望当前聊天读取或生成记忆，不需要删除所有 Memories。输入 `/memories`，关闭当前聊天对应的选项即可。

如果确定不再需要当前电脑上保存的记忆，可以在桌面 App 中进入 **Settings > Personalization**，然后选择 **Delete Codex memories**。

![image.png](https://cdn.canghecode.com/yanyan/20261014155644452.png)


删除前，先确认其中没有以后还会用到的内容。删除后，这些记忆无法直接在 Codex 中恢复，与本地 Memories 相关的 Computer History 数据也可能会被一起清除。

---

## 使用 MCP 和网页搜索时要注意什么

Codex 使用 MCP、Web Search 或 Tool Search 时，会从外部获取资料，再把它们带入当前聊天。例如，它可以通过 MCP 读取公司文档，也可以通过 Web Search 查找网页资料。

如果允许 Codex 从这类聊天中生成 Memories，那么外部资料中的一些内容，也可能被整理进本地记忆。比如，Codex 读取了一份客户文档，文档中的客户名称或项目背景就可能进入 Memories。

如果不希望发生这种情况，可以在桌面 App 中关闭 **Allow memories from tool-assisted chats**（允许从使用过工具的聊天中生成记忆）。关闭后，Codex 仍然可以在当前聊天中使用外部工具，但不会根据这次聊天生成新的 Memories。

如果更习惯通过配置文件调整 Codex，也可以在 `config.toml` 中加入：

```toml
[memories]
disable_on_external_context = true
```

设置为 `true` 后，只要某次聊天使用过 MCP、Web Search 或 Tool Search，Codex 就不会从这次聊天中生成新记忆。

在旧版配置中，这个选项可能写成 `memories.no_memories_if_mcp_or_web_search`。这个旧名称目前仍然可用，但新增配置时，建议使用 `disable_on_external_context`。

::: tip 如何选择
如果 Codex 主要搜索公开网页和公开资料，可以根据需要开启这类聊天的记忆功能。
如果 Codex 经常读取公司内部文档、客户资料或其他敏感信息，更建议关闭这项功能。
:::

---

## 常见配置项

除了总开关外，Memories 还有一些更细的配置项：

| 配置项 | 作用 |
| --- | --- |
| `memories.generate_memories` | 控制新的聊天能否用来生成记忆 |
| `memories.use_memories` | 控制新的聊天能否读取已有记忆 |
| `memories.disable_on_external_context` | 使用 MCP、Web Search 等外部内容后，不生成新记忆 |
| `memories.min_rate_limit_remaining_percent` | 额度低于指定比例时，暂停后台记忆生成 |
| `memories.extract_model` | 指定从单次聊天中提取记忆时使用的模型 |
| `memories.consolidation_model` | 指定整理全部记忆时使用的模型 |

如果只是日常使用 Memories，通过桌面 App 中的开关和 `/memories` 命令进行设置就可以了，不需要修改配置文件。

只有在多个环境中统一设置、限制 Memories 消耗的额度，或者严格控制敏感信息时，才需要使用这些高级配置。

---

## 隐私与安全提醒

Memories 会把整理好的信息保存在电脑本地。Codex 会尝试从自动生成的记忆中排除密钥，但这不能保证所有敏感信息都不会被保存。

因此，使用 Memories 时仍然需要注意隐私和数据安全。

可以按照以下方式降低风险：

- 不要让 Codex 记住密码、API Key、身份证号码等敏感信息。
- 处理公司文档、客户资料或医疗资料前，先确认所在组织是否允许 Codex 在本地生成记忆。
- 项目结束或自己的访问权限发生变化后，再检查一次以前的记忆，删除不应继续保留的内容。
- 分享或备份整个 `~/.codex` 文件夹前，先检查其中的 `memories` 文件夹是否包含隐私或内部信息。
- 不要只把项目规则和重要结论保存在 Memories 中，这些内容还应写入 `AGENTS.md` 或正式的项目文档。

::: warning
关闭 Memories 不等于删除以前的记忆。

关闭后，Codex 不再继续使用或生成 Memories，但已经保存的文件可能仍然留在电脑中。如果想彻底清理，需要使用 **Delete Codex memories**，并检查本地的 `memories` 文件夹。
:::

---

## 常见问题

### 为什么开启后没有马上生成记忆？

记忆在后台生成，不会在每次聊天结束后立即出现。Codex 还可能跳过过短、仍在进行或不适合保存的聊天。

### 为什么新聊天没有使用以前的记忆？

可能是没有找到与当前任务相关的内容，也可能是当前聊天禁止使用 Memories。可以输入 `/memories` 检查当前设置。

### Memories 会代替 `AGENTS.md` 吗？

不会。Memories 只用于辅助回忆，可能发生变化，也不保证每次都被采用。必须遵守的项目规则应写入 `AGENTS.md`。

### 多台电脑会自动同步吗？

本地 Codex Memories 保存在当前机器的 `CODEX_HOME` 中。不同电脑通常各自保存一份，不应默认认为它们会自动同步。

### 删除聊天会同时删除 Memories 吗？

聊天记录和 Memories 是不同的数据。不要假设删除聊天就一定会删除已经生成的本地记忆。需要清理时，应单独使用 Memories 的删除功能。

## 下一步

了解 Memories 后，可以继续阅读 [Computer History：找回最近在电脑上做过的事](./13-computer-history.md)。
