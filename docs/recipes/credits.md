---
description: "CodexGuide 参考来源与致谢，整理案例中涉及的第三方工具、官方文档、仓库链接和内容来源，便于追溯资料。"
---

# 参考来源与致谢

本站实战案例在创作过程中参考了以下创作者的视频、文章和开源项目。感谢他们的无私分享，让这个知识库得以建立。

> 所有案例截图均为作者本人实际操作所得，文字内容在参考基础上重新整理与二次创作。如有侵权，请联系删除。

---

## GitHub 开源仓库

| 仓库 | 作者 | 用途 | 相关案例 |
|------|------|------|----------|
| [op7418/guizang-ppt-skill](https://github.com/op7418/guizang-ppt-skill) | 藏师傅（op7418） | 案例中使用的 PPT Skill，支持一句话生成演示文稿 | [01 Codex × PPT Skill](./ppt-skill-walkthrough.md) |
| [jgraph/drawio-mcp](https://github.com/jgraph/drawio-mcp) | Draw.io 官方 | Draw.io 官方发布的 MCP，让 Codex 直接绘制架构图 | [02 Codex × Draw.io MCP](./drawio-mcp.md) |
| [larksuite/cli](https://github.com/larksuite/cli/blob/main/README.zh.md) | 飞书官方 | 飞书官方开源 CLI，支持通过命令行操作飞书数据 | [06 Codex × 飞书 CLI](./feishu-cli-codex.md) |
| [wshuyi/remotion-video-skill](https://github.com/wshuyi/remotion-video-skill) | 王老师（wshuyi） | 基于 Remotion 的视频生成 Skill，代码驱动制作视频 | [04 Codex × HyperFrames](./hyperframes-animation.md) |
| [karpathy/llm-wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) | Andrej Karpathy | LLM Wiki 理念原始设计文档，本站案例的核心参考 | [07 Codex × LLM Wiki](./llm-wiki-codex.md) |
| [Dailin521/codex-provider-sync](https://github.com/Dailin521/codex-provider-sync) | Dailin521 | 社区工具，用于 Codex provider metadata 同步与历史会话可见性排障；最后核对日期：2026-05-29 | [配置文件 config.toml](../configuration/config-file.md#切换-provider-后历史会话不可见怎么办) |
| [BigPizzaV3/CodexPlusPlus](https://github.com/BigPizzaV3/CodexPlusPlus) | BigPizzaV3 | 社区工具，用于 Codex 桌面 App 外部 launcher、中转注入和 provider 管理；最后核对日期：2026-05-29 | [连接第三方 API](../guide/05-third-party-api.md) |
| [BenedictKing/ccx](https://github.com/BenedictKing/ccx) | BenedictKing | 社区项目，提供 AI API 代理、协议转换、渠道编排和 Codex Responses 网关能力；最后核对日期：2026-05-29 | [连接第三方 API](../guide/05-third-party-api.md) |
| [farion1231/cc-switch](https://github.com/farion1231/cc-switch) | farion1231 | 社区工具，用于管理 Codex、Claude Code、Gemini CLI 等工具的供应商配置和一键切换；最后核对日期：2026-05-29 | [连接第三方 API](../guide/05-third-party-api.md) |

---

## 哔哩哔哩视频

| 视频 | 相关案例 | 链接 |
|------|----------|------|
| Draw.io MCP 使用教程 | [02 Codex × Draw.io MCP](./drawio-mcp.md) | [BV1865K6gEhZ](https://www.bilibili.com/video/BV1865K6gEhZ/) |
| 保姆级 Claude Code 速成，必学！简单！【附完整文档】 | [03 Codex × Playwright MCP](./playwright-mcp.md) | [b23.tv/xDKx6jX](https://b23.tv/xDKx6jX) |
| Codex 实践 LLM Wiki 知识库搭建教程 | [07 Codex × LLM Wiki](./llm-wiki-codex.md) | [BV1y19hBhEMT](https://www.bilibili.com/video/BV1y19hBhEMT/) |

---

## 微信公众号文章

| 文章 | 作者 | 相关案例 | 链接 |
|------|------|----------|------|
| 在 Obsidian 中使用 Codex 完成内容创作 | 微信公众号 | [05 Codex × Obsidian](./obsidian-codex.md) | [查看原文](https://mp.weixin.qq.com/s/f5HWooI1a8pnSObJ9rSqMw) |
| 飞书 CLI 开源发布介绍 | 数字生命卡斯克 | [06 Codex × 飞书 CLI](./feishu-cli-codex.md) | [查看原文](https://mp.weixin.qq.com/s/fvjxT_GgbEgxgsPCUlo-RQ) |
| 团队如何用飞书 CLI 完成协作任务 | 数字生命卡斯克 | [06 Codex × 飞书 CLI](./feishu-cli-codex.md) | [查看原文](https://mp.weixin.qq.com/s/6vqkEvFYNEtUu3rTQAllzw) |

---

## 工具与平台

| 工具 | 简介 | 相关案例 | 链接 |
|------|------|----------|------|
| DKFile | 小白友好的静态网页托管工具，上传 HTML 即可获得公网链接 | [10 Codex × DKFile](./dkfile-deploy-codex.md) | [dkfile.net](https://dkfile.net) |

---

## OpenAI 官方文档

| 文档 | 相关案例 | 链接 |
|------|----------|------|
| Using Codex with your ChatGPT plan | [12 Codex × Chrome](./chrome-browser-plugin.md) | [查看文档](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan) |
| Codex Skills 官方说明 | [01 Codex × PPT Skill](./ppt-skill-walkthrough.md) | [查看文档](https://developers.openai.com/codex/skills) |
| Codex Use Cases | [12 Codex × Chrome](./chrome-browser-plugin.md) | [查看文档](https://developers.openai.com/codex/explore/) |

---

## 关于本站

本站所有实战案例均由作者亲自操作验证，截图和步骤来自真实使用过程。部分操作思路和工具来源于以上优秀创作者，在此一并致谢。

如果你也发现了值得推荐的 Codex 使用案例、Skill 或 MCP 工具，欢迎通过共建渠道提交。
