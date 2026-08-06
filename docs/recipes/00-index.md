---
description: "Codex 实战案例库，收录 PPT、Draw.io、Playwright、Obsidian、临床文献综述、Hatch Pet、安卓手机远程操控、命名本地环境、飞书、Figma、Notion、CI 和远程排障案例。"
permalink: /recipes/
---

::: tip 最后核对
资料最后核对日期：2026-06-29。本页是实战案例索引，Codex 官方能力请以 [Codex 文档入口](https://developers.openai.com/codex/)、[Codex Skills](https://developers.openai.com/codex/skills)、[Codex Plugins](https://developers.openai.com/codex/plugins) 与 [Codex use cases](https://developers.openai.com/codex/use-cases/) 为准；第三方工具以各案例中的原仓库和官方页面为准。
:::

# 实战案例库

这里收集可复现、可改写、可迁移到真实工作流里的 Codex 使用案例。当前版本已收录 18 个案例，覆盖 Skill、MCP、浏览器自动化、知识库、临床文献综述、移动端协同、命名本地环境、个性化工作台、设计稿、团队协作、远程排障和 CI 自动修复。

## 当前案例概览

| 类型 | 已收录案例 | 适合学习什么 |
| --- | --- | --- |
| 内容生产与表达 | PPT Skill、Draw.io MCP、HyperFrames | 把一句话需求转成演示文稿、架构图和动画视频 |
| 知识库与个人工作台 | Obsidian、LLM Wiki、Notion MCP | 在笔记、Wiki、知识空间中组织资料和生成内容 |
| 医学科研与证据整理 | 临床文献综述 | 把研究问题拆成 PICO、证据表、局限性和安全边界 |
| 移动协同与个性化工作台 | 安卓手机远程操控、Hatch Pet、桌面宠物 | 在手机端跟进桌面任务，并用自定义宠物和桌面状态反馈优化工作台体验 |
| 浏览器与前端自动化 | Playwright MCP、Chrome 浏览器插件 | 让 Codex 操作网页、检查页面、执行浏览器任务 |
| 设计与协作平台 | Figma MCP、飞书 CLI | 读取设计稿、处理飞书数据、连接团队工具 |
| 本地环境与身份边界 | codex-profiles | 为 CLI 和命名 Desktop 窗口选择独立本地状态，并理解仍然共享的 OS 与服务端边界 |
| 发布与工程运维 | DKFile、云服务器远程修 Bug、GitHub Actions CI 修复 | 从本地/远程环境到自动修复流程的完整闭环 |

## 18 个案例清单

| 编号 | 案例 | 核心场景 | 推荐入口 | 验证重点 |
| --- | --- | --- | --- | --- |
| 01 | [Codex × PPT Skill：一句话生成演示文稿](../recipes/01-ppt-skill-walkthrough.md) | 用 Skill 生成 PPT 初稿 | 桌面 App / Skills | 结构、视觉一致性、导出效果 |
| 02 | [Codex × Draw.io MCP：AI 自动绘制架构图](../recipes/02-drawio-mcp.md) | 通过 MCP 生成架构图 | App / MCP | 图形层级、节点关系、可编辑性 |
| 03 | [Codex × Playwright MCP：让 AI 操控浏览器](../recipes/03-playwright-mcp.md) | 用 Playwright 驱动浏览器操作 | App / MCP | 点击路径、页面状态、截图结果 |
| 04 | [Codex × HyperFrames：用代码生成动画视频](../recipes/04-hyperframes-animation.md) | 生成可视化动画视频 | App / CLI | 动画脚本、渲染结果、素材路径 |
| 05 | [Codex × Obsidian：在知识库中自动生成配图](../recipes/05-obsidian-codex.md) | 在本地笔记库中调用 Codex | CLI / Obsidian | 文件路径、图片生成、笔记引用 |
| 06 | [Codex × 飞书 CLI：一句话处理飞书数据](../recipes/06-feishu-cli-codex.md) | 处理飞书多维表格或协作数据 | CLI | 应用凭证、字段映射、写回权限 |
| 07 | [Codex × LLM Wiki：在 Obsidian 中搭建 AI 知识库](../recipes/07-llm-wiki-codex.md) | 构建 AI 主题知识库 | Obsidian / CLI | 目录结构、引用来源、更新流程 |
| 08 | [Codex × Figma MCP：读懂设计稿](../recipes/08-figma-mcp-codex.md) | 读取设计稿并辅助实现 | MCP / IDE | 设计 token、布局还原、组件边界 |
| 09 | [Codex × Notion MCP：打通知识空间](../recipes/09-notion-mcp-codex.md) | 连接 Notion 做知识管理 | MCP | 数据库权限、页面结构、同步范围 |
| 10 | [Codex × DKFile：网页一键发布到公网](../recipes/10-dkfile-deploy-codex.md) | 快速发布静态网页 | CLI / API | 构建产物、上传结果、访问地址 |
| 11 | [Codex × 云服务器：远程定位并修复 Bug](../recipes/11-remote-bug-fix.md) | 在远程容器里排查 Python 报错 | CLI / Remote | 连接方式、复现命令、修复验证 |
| 12 | [Codex × Chrome：让 AI 直接控制浏览器](../recipes/12-chrome-browser-plugin.md) | 通过浏览器插件执行网页任务 | Browser Plugin | 页面可见状态、动作确认、安全边界 |
| 13 | [Codex × GitHub Actions：CI 失败自动修复](../recipes/13-github-actions-ci-fix.md) | CI 失败后自动触发 Codex 修复并开 PR | GitHub Actions | 权限配置、失败提交、测试通过、PR 内容 |
| 14 | [Codex × 临床文献综述：把医学问题整理成可复核证据表](../recipes/14-clinical-literature-review.md) | 整理临床科研问题和文献证据 | App / CLI / Obsidian | PICO、证据来源、局限性、医疗安全边界 |
| 15 | [Codex × Hatch Pet：用一张照片生成专属宠物](../recipes/15-hatch-pet-photo.md) | 生成并安装自定义桌面宠物 | 桌面 App / Hatch Pet | 素材质量、生成进度、宠物包路径 |
| 16 | [Codex × 安卓手机：扫码连接，远程操控](../recipes/16-android-remote-control.md) | 手机端配对并管理桌面任务 | ChatGPT App / Desktop App | 账号一致、网络、防火墙、连接状态 |
| 17 | [Codex × 桌面宠物：显示任务状态](../recipes/17-desktop-pet.md) | 用桌面宠物显示任务进度和完成状态 | 桌面 App | 宠物唤醒、任务状态、提醒反馈 |
| 18 | [Codex × codex-profiles：分开个人与工作环境](../recipes/18-codex-profiles.md) | 为不同 Codex 场景选择独立本地状态 | CLI / macOS App | CODEX_HOME、命名窗口、账号与安全边界 |

## 怎么选择先看哪个

如果你刚开始看实战案例，建议按目标选：

- 想快速看到效果：先看 [PPT Skill](../recipes/01-ppt-skill-walkthrough.md)、[Draw.io MCP](../recipes/02-drawio-mcp.md)、[DKFile](../recipes/10-dkfile-deploy-codex.md)。
- 想学习 MCP：先看 [Playwright MCP](../recipes/03-playwright-mcp.md)、[Figma MCP](../recipes/08-figma-mcp-codex.md)、[Notion MCP](../recipes/09-notion-mcp-codex.md)。
- 想把 Codex 放进知识工作流：先看 [Obsidian](../recipes/05-obsidian-codex.md)、[LLM Wiki](../recipes/07-llm-wiki-codex.md)、[飞书 CLI](../recipes/06-feishu-cli-codex.md)。
- 想做医学科研资料整理：先看 [临床文献综述](../recipes/14-clinical-literature-review.md)，重点学习如何把事实、推断和安全边界分开。
- 想优化桌面工作台体验：先看 [Hatch Pet](../recipes/15-hatch-pet-photo.md) 和 [桌面宠物](../recipes/17-desktop-pet.md)，了解如何生成自定义宠物并查看任务状态。
- 想用手机跟进桌面任务：先看 [安卓手机远程操控](../recipes/16-android-remote-control.md)，重点检查账号、网络和授权状态。
- 想分开个人与工作环境：先看 [codex-profiles](../recipes/18-codex-profiles.md)，重点理解本地状态、账号与操作系统边界。
- 想做工程自动化：先看 [云服务器远程修 Bug](../recipes/11-remote-bug-fix.md)、[GitHub Actions CI 自动修复](../recipes/13-github-actions-ci-fix.md)。
- 想理解浏览器控制能力：先看 [Playwright MCP](../recipes/03-playwright-mcp.md) 和 [Chrome 浏览器插件](../recipes/12-chrome-browser-plugin.md)。

## 案例成熟度

| 状态 | 案例 | 说明 |
| --- | --- | --- |
| 已形成完整流程 | PPT Skill、Playwright MCP、Obsidian、飞书 CLI、临床文献综述、Hatch Pet、桌面宠物、安卓手机远程操控、codex-profiles、远程修 Bug、GitHub Actions CI 修复 | 有明确安装、使用步骤或完整操作链路 |
| 偏工具接入教程 | Draw.io MCP、Figma MCP、Notion MCP、DKFile、Chrome 浏览器插件 | 重点在接入方式、典型任务和安全边界 |
| 偏场景展示 | HyperFrames、LLM Wiki | 重点展示 Codex 与创作/知识库场景的组合方式 |

## 每个案例建议补齐什么

后续继续完善案例时，建议统一补齐这些信息：

- 背景：为什么要做这个案例。
- 环境：系统、工具版本、账号权限、依赖。
- 输入：原始 prompt、配置文件或数据源。
- 过程：Codex 做了哪些关键动作。
- 结果：截图、PR、网页地址、导出文件或日志。
- 验证：如何判断案例成功。
- 风险：权限、凭证、外部服务、写回操作、成本和失败场景。

## 参考来源

案例中涉及的第三方工具、仓库和文章来源统一整理在 [参考来源与致谢](../manual/02-credits.md)。
