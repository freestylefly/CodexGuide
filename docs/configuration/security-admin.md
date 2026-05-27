# 安全、审批与管理

Codex 能读代码、改文件、运行命令，也可能接触凭据、内部系统和生产资源。真正适合长期使用的 Codex 工作流，一定要把权限边界写清楚。

::: tip 最后核对
官方资料最后核对日期：2026-05-27。本文参考 [Codex security](https://developers.openai.com/codex/agent-approvals-security)、[sandbox 文档](https://github.com/openai/codex/blob/main/docs/sandbox.md)、[exec policy 文档](https://github.com/openai/codex/blob/main/docs/execpolicy.md) 与 [Codex 文档入口](https://developers.openai.com/codex/)。
:::

![Codex 安全分层](/images/codex-safety-layers.svg)

## 先分清风险等级

| 风险等级 | 例子 | 建议策略 |
| --- | --- | --- |
| 低 | 读取 README、解释函数、生成文档草稿 | 可只读自动执行 |
| 中 | 修改代码、运行测试、格式化文件 | 限定工作区写入，保留 diff review |
| 高 | 安装依赖、访问外网、删除文件、迁移数据库 | 每一步都需要明确审批 |
| 极高 | 生产发布、账单、权限、客户数据、凭据轮换 | 保留人工操作或双人复核 |

## 沙盒模式怎么理解

沙盒控制 Codex 能访问什么位置、能不能写文件、能不能联网。学习时按三种场景理解：

| 场景 | 推荐边界 | 用途 |
| --- | --- | --- |
| 陌生仓库分析 | 只读 | 了解结构、生成学习路线 |
| 日常实现 | 工作区写入 | 修测试、补文档、改局部代码 |
| 自动化脚本 | 精确放权 | 只允许必要命令和目录 |

配置变更前，先问 Codex：

```text
请说明你当前准备运行哪些命令、这些命令会读写哪些路径、是否需要网络访问。先不要执行。
```

::: info 截图占位
请补充一次命令审批弹窗或权限提示截图。建议文件：`docs/.vuepress/public/screenshots/security/01-approval-prompt.png`。
:::

## 审批策略

审批策略决定 Codex 在执行某些命令前是否需要你确认。建议把以下行为列为需要确认：

- 删除、移动大量文件。
- 修改锁文件或依赖版本。
- 安装全局工具。
- 访问外部网络。
- 读取 `.env`、证书、密钥文件。
- 执行数据库迁移。
- 创建 release、tag、部署或推送生产分支。

推荐提示词：

```text
涉及删除文件、安装依赖、访问网络、读取敏感文件、推送代码或部署时，请先说明理由、命令和影响范围，等我确认后再执行。
```

## 敏感信息处理

教程截图和开源知识库尤其要注意遮挡：

- 邮箱、用户名、组织名。
- 本地绝对路径中的隐私信息。
- token、API key、session、cookie。
- 内网域名、仓库私有地址。
- 客户数据、订单号、日志中的用户标识。

截图占位建议写清楚“需要遮挡哪些信息”，避免贡献者直接上传原图。

::: info 截图占位
请补充一张经过遮挡处理的安全示例截图。建议文件：`docs/.vuepress/public/screenshots/security/02-redacted-example.png`。
:::

## Cloud 与团队管理

Cloud / Web 场景下，安全重点从“本机命令”扩展到“仓库权限和环境配置”：

- Codex 连接了哪些 GitHub 仓库。
- 能否创建分支、提交 commit、打开 PR。
- 运行环境是否包含 secret。
- 是否允许访问互联网。
- 任务日志中是否出现敏感输出。
- 谁能查看任务和结果。

团队接入建议：

1. 先用示例仓库跑通流程。
2. 为真实仓库准备最小权限环境。
3. 把测试命令写进 `AGENTS.md`。
4. 对高风险目录写清楚禁改或需审批规则。
5. 定期 review automation、MCP、Skills 和组织策略。

## 发布前安全检查模板

```text
请对当前 diff 做发布前安全检查，不要修改文件。

重点检查：
1. 是否新增或暴露凭据、token、cookie、内部域名。
2. 是否放宽权限、CORS、认证或网络访问。
3. 是否修改数据库迁移、账单、权限、删除逻辑。
4. 是否缺少测试、回滚说明或人工确认步骤。
5. 是否有需要在 PR 描述中明确标注的风险。
```

## 审计记录怎么留

每次高风险任务建议记录：

- 任务目标。
- Codex 执行的命令。
- 人工批准的命令。
- 修改文件列表。
- 验证命令和结果。
- 未验证的风险。
- 回滚方式。

这些信息可以放到 PR 描述、release notes 或团队复盘文档中。

## 官方资料延伸

- [Codex security](https://developers.openai.com/codex/agent-approvals-security)
- [openai/codex sandbox docs](https://github.com/openai/codex/blob/main/docs/sandbox.md)
- [openai/codex exec policy docs](https://github.com/openai/codex/blob/main/docs/execpolicy.md)
