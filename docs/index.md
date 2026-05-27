---
home: true
icon: home
title: CodexGuide
pageClass: codex-home-page
heroImage: /logo.svg
heroText: CodexGuide
tagline: 面向全球初学者、创作者、开发者与团队的 Codex 实践指南。从第一次上手，到把 Codex 接入真实工作流。
actions:
  - text: 从学习路线开始
    link: /guide/00-overview.html
    type: primary
  - text: 选择使用入口
    link: /platform/
    type: default
  - text: 浏览实战案例
    link: /recipes/
    type: default
features:
  - title: 桌面 App 入门路径
    icon: desktop
    details: 从电脑端安装到第一次任务，帮助新手先跑通完整闭环。
  - title: CLI 工程实践
    icon: terminal
    details: 覆盖本地仓库、命令执行、测试验证、提交说明和排障流程。
  - title: Skills 与插件
    icon: plugin
    details: 梳理 MCP、Skills、Subagents、浏览器和自动化能力的组合方式。
  - title: 安全与权限
    icon: lock
    details: 解释沙盒、审批、网络、凭据和团队使用时的边界设置。
  - title: 移动协同
    icon: mobile
    details: 说明如何用手机端发起 Codex 任务，并把进展接回桌面端工作流。
  - title: 真实案例库
    icon: lightbulb
    details: 收录 13 个可迁移案例，覆盖内容生产、知识库、浏览器、CI 与远程排障。
  - title: 团队沉淀
    icon: people
    details: 提供 AGENTS.md、任务模板、复盘结构和团队推广方法。
  - title: 配置与排障
    icon: wrench
    details: 汇总配置文件、CLI 选项、常见错误和恢复路径，方便遇到问题时快速定位。
---

<div class="codex-home">

<section class="home-section home-intro">

## 这份教程适合谁

CodexGuide 不是一份命令速查表，而是一份围绕真实工作流组织的实践指南。它帮助不同背景的人回答三个问题：我该从哪个入口开始，怎样把需求交给 Codex，怎样确认它交付的是可靠结果。

<div class="home-metric-grid">
  <a class="home-metric-card" href="/guide/00-overview.html" data-tone="teal">
    <strong>17 节系统指南</strong>
    <span>从桌面 App、CLI、IDE 到 Cloud，按阶段建立完整使用习惯。</span>
  </a>
  <a class="home-metric-card" href="/recipes/" data-tone="blue">
    <strong>13 个实战案例</strong>
    <span>把 Codex 放进 PPT、Draw.io、Playwright、Obsidian、飞书、CI 等真实场景。</span>
  </a>
  <a class="home-metric-card" href="/configuration/" data-tone="amber">
    <strong>4 类配置主题</strong>
    <span>覆盖 CLI 选项、config.toml、MCP/Skills/Subagents 与安全管理。</span>
  </a>
  <a class="home-metric-card" href="/practice/" data-tone="violet">
    <strong>3 组实践方法</strong>
    <span>任务设计、非开发工作流、团队 playbook，帮助你把经验沉淀下来。</span>
  </a>
</div>

</section>

<section class="home-section">

## 三条推荐学习路径

不同起点不需要读同一条路。先选与你当前工作最贴近的路径，再回头补全基础概念。

<div class="home-path-grid">
  <a class="home-path-card" href="/guide/01-app-installation.html" data-step="01">
    <strong>第一次使用 Codex</strong>
    <span>安装电脑端客户端，了解界面，完成第一个低风险任务。</span>
    <em>适合初学者、产品、运营、技术写作者</em>
  </a>
  <a class="home-path-card" href="/guide/11-cli-installation.html" data-step="02">
    <strong>开发者本地提效</strong>
    <span>在 CLI 中读项目、改代码、跑测试，形成可验证的工程闭环。</span>
    <em>适合前端、后端、全栈、开源维护者</em>
  </a>
  <a class="home-path-card" href="/practice/team-playbook.html" data-step="03">
    <strong>团队落地与规范</strong>
    <span>用 AGENTS.md、权限边界、案例库和复盘模板统一协作方式。</span>
    <em>适合技术负责人、团队 Lead、内部工具负责人</em>
  </a>
</div>

</section>

<section class="home-section home-split">

<div>

## 先选对入口

Codex 的能力会出现在 App、CLI、Cloud、IDE、ChatGPT 和集成生态里。入口不同，任务节奏也不同：本地小步修改适合 CLI，长任务和并行任务适合 Cloud，贴近编辑器的解释与局部改动适合 IDE，跨工具流程适合 App 和插件体系。

<div class="home-link-row">
  <a href="/platform/">查看入口地图</a>
  <a href="/guide/03-app-overview.html">了解桌面 App</a>
  <a href="/guide/13-ide-vscode.html">VS Code 使用方式</a>
</div>

</div>

<img class="home-visual" src="/images/codex-surfaces.svg" alt="Codex 使用入口地图" loading="lazy" />

</section>

<section class="home-section">

## 把一次任务做成闭环

好用 Codex 的关键不是把 prompt 写得花哨，而是让它始终知道目标、范围、约束、验证方式和交付格式。教程会反复训练这一套闭环。

<div class="home-loop-grid">
  <a href="/practice/task-design.html" class="home-loop-item" data-tone="teal">
    <strong>说明</strong>
    <span>写清目标、范围、禁止事项、上下文和期望输出。</span>
  </a>
  <a href="/guide/06-task-execution.html" class="home-loop-item" data-tone="blue">
    <strong>执行</strong>
    <span>理解 Codex 如何读文件、运行命令、小步修改和汇报状态。</span>
  </a>
  <a href="/guide/15-sandbox-approvals.html" class="home-loop-item" data-tone="rose">
    <strong>控制</strong>
    <span>设置沙盒、审批、网络和凭据边界，让任务可控。</span>
  </a>
  <a href="/recipes/github-actions-ci-fix.html" class="home-loop-item" data-tone="amber">
    <strong>验证</strong>
    <span>用测试、构建、截图、日志和 PR 检查结果是否可靠。</span>
  </a>
  <a href="/practice/team-playbook.html" class="home-loop-item" data-tone="violet">
    <strong>沉淀</strong>
    <span>把成功任务整理成模板、案例和团队规则。</span>
  </a>
</div>

<img class="home-wide-visual" src="/images/codex-workflow-loop.svg" alt="Codex 高质量任务闭环" loading="lazy" />

</section>

<section class="home-section">

## 精选实战场景

案例库不是展示清单，而是可改写的任务样本。你可以直接换成自己的项目、工具、账号和验证方式。

<div class="home-case-grid">
  <a class="home-case-card" href="/recipes/ppt-skill-walkthrough.html">
    <strong>一句话生成演示文稿</strong>
    <span>学习如何调用 Skill，把主题变成结构化 slide deck。</span>
  </a>
  <a class="home-case-card" href="/recipes/playwright-mcp.html">
    <strong>让 Codex 操控浏览器</strong>
    <span>用 Playwright MCP 打开页面、点击、截图、检查状态。</span>
  </a>
  <a class="home-case-card" href="/recipes/obsidian-codex.html">
    <strong>连接 Obsidian 知识库</strong>
    <span>在本地笔记中生成内容、配图和可追踪引用。</span>
  </a>
  <a class="home-case-card" href="/recipes/github-actions-ci-fix.html">
    <strong>CI 失败自动修复</strong>
    <span>从失败日志定位问题，让 Codex 修复并生成 PR。</span>
  </a>
</div>

</section>

<section class="home-section home-split home-split-reverse">

<img class="home-visual" src="/images/codex-safety-layers.svg" alt="Codex 安全边界分层" loading="lazy" />

<div>

## 为真实项目准备

当 Codex 进入团队项目，真正重要的是边界、复现和共识。教程会把每次任务拆成可检查的输入与输出，帮助你减少“看起来完成了，但没人敢合并”的尴尬时刻。

<ul class="home-check-list">
  <li>用 <a href="/guide/14-agents-md.html">AGENTS.md</a> 写清项目命令、代码风格和禁止事项。</li>
  <li>用 <a href="/guide/15-sandbox-approvals.html">沙盒与审批</a> 管理文件、网络、凭据和高风险命令。</li>
  <li>用 <a href="/practice/team-playbook.html">团队 playbook</a> 统一任务模板、复盘结构和案例沉淀。</li>
  <li>用 <a href="/guide/17-troubleshooting.html">排障手册</a> 快速定位登录、权限、依赖和执行异常。</li>
</ul>

</div>

</section>

<section class="home-section home-final">

## 建议从这里开始

如果你只有二十分钟，先完成桌面 App 路线的前五节；如果你已经在项目里写代码，直接从 CLI 安装和第一次本地任务开始。读完第一轮后，再回到配置、权限和案例库，把真实流程固化为可复用的工作方法。

<div class="home-action-row">
  <a class="home-primary-link" href="/guide/00-overview.html">进入学习路线</a>
  <a href="/configuration/">查看配置专题</a>
  <a href="/community/roadmap.html">参与共建</a>
</div>

::: tip 最后核对
基础资料最后核对日期：2026-05-27。涉及功能、价格、可用性和安全策略时，请优先以 OpenAI 官方资料为准。
:::

</section>

</div>
