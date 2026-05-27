# ChatGPT 中的 Codex

ChatGPT 中的 Codex 适合从对话里分派仓库任务、查看任务状态、理解代码库和推动团队协作。具体功能会受到账号计划、组织策略、所在地区和产品更新影响。

::: tip 官方边界
计划可用性、消息限额、连接方式和具体入口请以 [Codex in ChatGPT Help Center](https://help.openai.com/en/articles/11369540-codex-in-chatgpt) 为准。本文最后核对日期：2026-05-27。
:::

## 适用场景

- 连接 GitHub 仓库后发起任务。
- 让 Codex 阅读仓库并总结架构。
- 将 issue 转成可执行任务。
- 生成 PR 摘要或变更说明。
- 面向非开发者解释技术改动。
- 把复杂任务拆成阶段计划。

::: info 截图占位
请补充 ChatGPT 中 Codex 入口截图。建议文件：`docs/.vuepress/public/screenshots/chatgpt/01-codex-entry.png`。
:::

## 第一次任务怎么写

先让 Codex 只读分析：

```text
请阅读这个仓库并帮我理解 [主题]。请先总结相关目录和关键文件，再给出执行建议。暂时不要修改代码。
```

进一步推进时：

```text
请基于刚才的分析，完成第一步最小改动，并创建可审查的结果。请说明改动原因、验证方式和剩余风险。
```

::: info 截图占位
请补充 ChatGPT 中连接仓库或创建任务截图。建议文件：`docs/.vuepress/public/screenshots/chatgpt/02-repo-task.png`。
:::

## 适合非开发者的用法

| 场景 | 任务说明 |
| --- | --- |
| 看懂 PR | “请把这个 PR 改动解释成产品经理能理解的语言。” |
| 写发布说明 | “请基于这些改动生成面向用户的 release notes。” |
| 拆 issue | “请把这个 issue 拆成可交给工程师执行的任务清单。” |
| 读技术方案 | “请解释这个方案涉及哪些模块、风险和验收标准。” |
| 整理知识库 | “请指出这份教程对新手来说缺哪些前置说明。” |

## 和 Cloud 的关系

ChatGPT 更适合发起、讨论和理解任务；Cloud 更适合后台执行长任务和产出 PR。实际使用时可以这样分工：

- 在 ChatGPT 里把需求说清楚。
- 让 Codex 先只读分析仓库。
- 把明确的第一步交给 Cloud 执行。
- 回到 ChatGPT 解释结果、总结风险、生成文档。

## 安全提醒

- 连接仓库前确认组织策略。
- 不要在对话里粘贴真实密钥。
- 让 Codex 修改代码前写清验收标准。
- 对生成的 PR 做人工 review。
- 截图进入开源仓库前遮挡账号、组织名和仓库隐私信息。

## 官方资料

- [Codex in ChatGPT Help Center](https://help.openai.com/en/articles/11369540-codex-in-chatgpt)
- [Codex cloud docs](https://platform.openai.com/docs/codex)
- [OpenAI Codex 产品页](https://openai.com/codex/)
