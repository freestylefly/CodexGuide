# Cloud / Web

Cloud / Web 入口适合处理耗时更长、需要后台运行或需要与 GitHub 协作的任务。它把 Codex 任务放进可管理的云端环境，适合团队分派、长任务跟踪和 PR 工作流。

::: tip 最后核对
官方资料最后核对日期：2026-05-27。本文参考 [Codex cloud docs](https://platform.openai.com/docs/codex)、[Codex 文档入口](https://developers.openai.com/codex/)、[Codex in ChatGPT Help Center](https://help.openai.com/en/articles/11369540-codex-in-chatgpt) 与 [Introducing Codex](https://openai.com/index/introducing-codex/)。
:::

## Cloud 适合什么

- 连接 GitHub 仓库后分派任务。
- 在后台处理长时间修复、迁移或分析。
- 基于 issue 或需求生成分支和 PR。
- 团队成员共同查看任务进度。
- 为大型仓库做结构分析和风险扫描。

::: info 截图占位
请补充 Cloud/Web 新建任务界面截图。建议文件：`docs/.vuepress/public/screenshots/cloud/01-new-task.png`。
:::

## 提交任务前的清单

| 检查项 | 为什么重要 |
| --- | --- |
| 仓库权限 | Codex 需要读取代码，并可能创建分支或 PR |
| 环境配置 | 缺依赖、缺服务、缺环境变量会影响验证 |
| Internet Access | 需要下载依赖或查资料时要明确网络边界 |
| 任务范围 | 长任务更需要明确目录、模块和排除项 |
| 验证命令 | 明确测试命令能提高结果可审查性 |
| 安全边界 | 凭据、生产数据、发布部署需要人工确认 |

## Environments

Cloud 任务是否可靠，很大程度取决于环境是否可复现。建议为仓库准备：

- 包管理器和版本要求。
- 安装依赖命令。
- 单元测试、类型检查、构建命令。
- 需要的服务，例如数据库、缓存、浏览器。
- 环境变量占位说明。
- secret 权限说明。

任务说明中可以直接写：

```text
运行环境说明：
- 使用 pnpm 安装依赖。
- 测试命令：pnpm test
- 构建命令：pnpm build
- 不需要访问生产数据库。
- 如遇缺失环境变量，请先列出变量名和用途，不要自行猜测真实值。
```

::: info 截图占位
请补充 Cloud environment 配置截图。建议文件：`docs/.vuepress/public/screenshots/cloud/03-environment.png`。
:::

## Internet Access

有些任务需要联网，例如安装依赖、读取官方文档、访问包 registry。联网任务要写清楚目的和范围：

```text
如果需要访问互联网，请只用于：
1. 安装项目依赖。
2. 查询官方文档。
3. 下载测试所需的公开资源。

不要访问生产服务、内部系统或非任务相关站点。
```

对于开源知识库，建议把所有引用来源写进页面底部，尤其是 OpenAI 官方文档、Help Center、官方 GitHub 仓库。

## 推荐任务说明

```text
请分析这个仓库中 [模块/问题] 的实现，并完成最小可验证修复。

要求：
1. 先定位相关文件和测试。
2. 提交实现前说明计划。
3. 修改范围限制在 [目录/模块]。
4. 运行 [测试命令]。
5. 输出 PR 摘要、验证结果和剩余风险。
```

## 适合 Cloud 的案例

| 案例 | 任务目标 | 验收标准 |
| --- | --- | --- |
| 修复 CI 失败 | 根据日志定位失败原因并提交修复 | PR 中包含验证命令 |
| 大型仓库导览 | 生成模块地图和学习路线 | 输出目录、入口和风险点 |
| 依赖升级 | 小范围升级并处理兼容问题 | 锁文件、测试和迁移说明齐全 |
| 文档站补齐 | 补教程、截图占位、链接索引 | 构建通过，来源可追溯 |
| PR 摘要 | 把 diff 转成审查说明 | 风险、测试、回滚说明清楚 |

::: info 截图占位
请补充 Cloud/Web 任务结果或 PR 页面截图。建议文件：`docs/.vuepress/public/screenshots/cloud/02-task-result.png`。
:::

## 团队实践建议

- 为常见任务准备模板，例如“修 CI”“补测试”“更新文档”。
- 把仓库规则写到 `AGENTS.md`。
- 用最小权限连接仓库。
- 重要 PR 仍由人类 reviewer 合并。
- 长任务结束后把失败原因和经验补进知识库。

## 官方资料

- [Codex cloud docs](https://platform.openai.com/docs/codex)
- [Codex in ChatGPT Help Center](https://help.openai.com/en/articles/11369540-codex-in-chatgpt)
- [Introducing Codex](https://openai.com/index/introducing-codex/)
