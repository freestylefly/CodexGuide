---
home: true
icon: home
title: OpenAI Codex 中文教程与实战指南
description: "CodexGuide 是面向中文用户的 OpenAI Codex 教程，帮助你从第一次任务快速上手Codex，并通过进阶教程与社区实践掌握实用的技巧。"
pageClass: codex-home-page
heroImage: https://cdn.canghecode.com/codexguide/docs/.vuepress/public/logo.svg
heroText: CodexGuide
tagline: 一站式掌握 Codex App、CLI、配置与实战。让 AI 编程助手真正进入你的日常工作
actions:
  - text: 从快速上手开始
    link: /start/
    type: primary
  - text: 阅读学习路线
    link: /guide/
    type: default
  - text: 加入付费交流群
    link: /community/join.md
    type: default
---

<div class="codex-home">

<section class="home-section home-core">

<div class="home-section-kicker">核心内容</div>

## 选择适合你的教程

CodexGuide 提供分层次的精细教学。助力你快速入门 Codex，并通过进阶教程掌握实用的技巧。

<div class="home-core-layout">
  <div class="home-core-card home-core-card-primary">
    <span class="home-core-index">入门</span>
    <strong>快速上手</strong>
    <span>从认识 Codex、安装账号、桌面 App 到第一个任务，先让 Codex 真正完成一次可验证的工作。</span>
    <ul>
      <li>安装与账号准备</li>
      <li>了解桌面 App 基本组成</li>
      <li>跑通第一个任务</li>
    </ul>
    <a class="home-core-link" href="/start/">进入快速上手</a>
    <em>适合第一次使用 Codex 的读者</em>
  </div>
  <div class="home-core-stack">
    <div class="home-core-card">
      <span class="home-core-index">进阶</span>
      <strong>进阶教程</strong>
      <span>助力更进一步了解 Codex，学习AI业内广受认可的规范与技巧，并掌握 Codex 的独家功能。</span>
      <ul>
        <li>理解费用与上下文</li>
        <li>AGENTS.md、Skills 和 Plugins</li>
        <li>权限管理、Hooks、沙盒与审批</li>
      </ul>
      <a class="home-core-link" href="/advanced/">查看进阶教程</a>
      <em>适合准备长期使用和希望进一步理解Codex的人</em>
    </div>
    <div class="home-core-card">
      <span class="home-core-index">实战</span>
      <strong>实战案例</strong>
      <span>观摩大神如何使用Codex，帮助你在了解理论知识后如何快速提高工作效率。</span>
      <ul>
        <li>浏览器、PPT、Obsidian 和飞书</li>
        <li>Figma、CI、远程排障和代码审查</li>
        <li>把案例改成自己的任务模板</li>
      </ul>
      <a class="home-core-link" href="/recipes/">浏览实战案例</a>
      <em>适合寻找灵感和可复用模板的人</em>
    </div>
  </div>
</div>

</section>

<section class="home-section home-final">

## 提供优质的教学资源

更适合国人的阅读习惯，用中文拆解 Codex 的安装、配置、权限边界和真实工作流，帮你更快从“会打开”走到“能落地、能复用、能交付”。


<div class="home-random-card" id="home-random-advanced-card">
  <strong>AGENTS.md</strong>
  <em>AGENTS.md 是面向 coding agent 的 README。README 主要给人看，讲项目是什么、怎么上手；AGENTS.md 给 Codex 和其他 coding agent 看，告诉它们改代码前应该遵守哪些项目规则。</em>
  <a class="home-random-card-link" href="/advanced/02-agents-md" aria-label="打开这篇随机进阶教学">↗</a>
</div>

<p class="home-gallery-label">更多优质教程：</p>

<div class="home-gallery-frame" aria-label="CodexGuide 优质教程节选">
  <div class="home-gallery-track">
    <a class="home-gallery-card" href="/start/06-first-task">
      <span>快速上手</span>
      <strong>用 Codex 完成第一个任务</strong>
      <em>任务完成后，Codex 会在对话中展示结果，同时将生成的文件写入工作目录。如果生成的是网页文件，可以直接点击 Codex 弹出的“打开”按钮，在 App 内置浏览器中预览效果。</em>
    </a>
    <a class="home-gallery-card" href="/start/07-task-design">
      <span>快速上手</span>
      <strong>任务设计</strong>
      <em>把目标、范围、上下文、禁止事项和验收方式写清楚，Codex 才能知道该改哪里、不能碰哪里，以及什么时候算完成。</em>
    </a>
    <a class="home-gallery-card" href="/advanced/02-agents-md">
      <span>进阶教程</span>
      <strong>AGENTS.md</strong>
      <em>AGENTS.md 是面向 coding agent 的 README。README 主要给人看，讲项目是什么、怎么上手；AGENTS.md 给 Codex 和其他 coding agent 看，告诉它们改代码前应该遵守哪些项目规则。</em>
    </a>
    <a class="home-gallery-card" href="/advanced/03-skills-plugins-mcp">
      <span>进阶教程</span>
      <strong>Skills 和 Plugins</strong>
      <em>AGENTS.md 像是项目里的通用工作规则，Skill 则是某一类任务的专项流程。写 PR Review、整理飞书文档、生成 PPT、修复 CI、做安全扫描，这些流程如果经常重复，就适合沉淀成 Skill。</em>
    </a>
    <a class="home-gallery-card" href="/advanced/07-sandbox-approvals">
      <span>进阶教程</span>
      <strong>沙盒与审批</strong>
      <em>沙盒就是实验室的墙和门禁：它规定 Codex 能碰哪些设备、能不能连外网、能不能写入项目外文件夹。墙内的常规操作可以自己做，墙外的事情需要先获得许可。</em>
    </a>
    <a class="home-gallery-card" href="/advanced/08-thread-management">
      <span>进阶教程</span>
      <strong>自动线程管理</strong>
      <em>在 Codex 里，一次对话就是一个 thread。线程拥有独立上下文，适合处理长期任务、后台跟进和多路线探索，也能缓解复杂任务里的上下文干扰。</em>
    </a>
    <a class="home-gallery-card" href="/recipes/03-playwright-mcp">
      <span>实战案例</span>
      <strong>让 Codex 操控浏览器</strong>
      <em>Playwright MCP 把打开浏览器、访问网页、点击按钮、填写输入框、读取页面内容、截图、验证结果等浏览器操作，封装成 AI 可以调用的工具。</em>
    </a>
    <a class="home-gallery-card" href="/recipes/05-obsidian-codex">
      <span>实战案例</span>
      <strong>连接 Obsidian 知识库</strong>
      <em>把 Codex 接进本地笔记，可以让资料整理、结构重写、配图和引用检查都沉淀在同一个知识库里，后续复用更稳定。</em>
    </a>
    <a class="home-gallery-card" href="/recipes/13-github-actions-ci-fix">
      <span>实战案例</span>
      <strong>CI 失败自动修复</strong>
      <em>从失败日志定位问题，让 Codex 先读 CI 输出，再回到仓库里修改代码、补验证，并把修复过程整理成可以审查的 PR。</em>
    </a>
    <a class="home-gallery-card" href="/start/06-first-task" aria-hidden="true" tabindex="-1">
      <span>快速上手</span>
      <strong>用 Codex 完成第一个任务</strong>
      <em>任务完成后，Codex 会在对话中展示结果，同时将生成的文件写入工作目录。如果生成的是网页文件，可以直接点击 Codex 弹出的“打开”按钮，在 App 内置浏览器中预览效果。</em>
    </a>
    <a class="home-gallery-card" href="/start/07-task-design" aria-hidden="true" tabindex="-1">
      <span>快速上手</span>
      <strong>任务设计</strong>
      <em>把目标、范围、上下文、禁止事项和验收方式写清楚，Codex 才能知道该改哪里、不能碰哪里，以及什么时候算完成。</em>
    </a>
    <a class="home-gallery-card" href="/advanced/02-agents-md" aria-hidden="true" tabindex="-1">
      <span>进阶教程</span>
      <strong>AGENTS.md</strong>
      <em>AGENTS.md 是面向 coding agent 的 README。README 主要给人看，讲项目是什么、怎么上手；AGENTS.md 给 Codex 和其他 coding agent 看，告诉它们改代码前应该遵守哪些项目规则。</em>
    </a>
    <a class="home-gallery-card" href="/advanced/03-skills-plugins-mcp" aria-hidden="true" tabindex="-1">
      <span>进阶教程</span>
      <strong>Skills 和 Plugins</strong>
      <em>AGENTS.md 像是项目里的通用工作规则，Skill 则是某一类任务的专项流程。写 PR Review、整理飞书文档、生成 PPT、修复 CI、做安全扫描，这些流程如果经常重复，就适合沉淀成 Skill。</em>
    </a>
    <a class="home-gallery-card" href="/advanced/07-sandbox-approvals" aria-hidden="true" tabindex="-1">
      <span>进阶教程</span>
      <strong>沙盒与审批</strong>
      <em>沙盒就是实验室的墙和门禁：它规定 Codex 能碰哪些设备、能不能连外网、能不能写入项目外文件夹。墙内的常规操作可以自己做，墙外的事情需要先获得许可。</em>
    </a>
    <a class="home-gallery-card" href="/advanced/08-thread-management" aria-hidden="true" tabindex="-1">
      <span>进阶教程</span>
      <strong>自动线程管理</strong>
      <em>在 Codex 里，一次对话就是一个 thread。线程拥有独立上下文，适合处理长期任务、后台跟进和多路线探索，也能缓解复杂任务里的上下文干扰。</em>
    </a>
    <a class="home-gallery-card" href="/recipes/03-playwright-mcp" aria-hidden="true" tabindex="-1">
      <span>实战案例</span>
      <strong>让 Codex 操控浏览器</strong>
      <em>Playwright MCP 把打开浏览器、访问网页、点击按钮、填写输入框、读取页面内容、截图、验证结果等浏览器操作，封装成 AI 可以调用的工具。</em>
    </a>
    <a class="home-gallery-card" href="/recipes/05-obsidian-codex" aria-hidden="true" tabindex="-1">
      <span>实战案例</span>
      <strong>连接 Obsidian 知识库</strong>
      <em>把 Codex 接进本地笔记，可以让资料整理、结构重写、配图和引用检查都沉淀在同一个知识库里，后续复用更稳定。</em>
    </a>
    <a class="home-gallery-card" href="/recipes/13-github-actions-ci-fix" aria-hidden="true" tabindex="-1">
      <span>实战案例</span>
      <strong>CI 失败自动修复</strong>
      <em>从失败日志定位问题，让 Codex 先读 CI 输出，再回到仓库里修改代码、补验证，并把修复过程整理成可以审查的 PR。</em>
    </a>
  </div>
</div>

</section>

<section class="home-section home-community">

<div class="home-community-copy">

<div class="home-section-kicker">付费交流群</div>

## 和认真使用 Codex 的人一起进步

当教程无法覆盖你的真实场景，可以在群里交流配置、工作流、Skills、Plugins、自动化和项目实战。智能体每天汇总各群精华，加入任一群也能了解整个 Codex 社区当天的重点。9.9 元一次付费，入群资格长期有效。

<p class="home-community-scale"><strong>已有 5 个 Codex 交流群满员</strong><span>新成员将加入当前开放群，并持续收到整个社区的每日精华。</span></p>

<ul class="home-community-benefits">
  <li>围绕真实问题交流，减少泛泛讨论</li>
  <li>智能体每日汇总多个群的核心话题</li>
  <li>持续获取实战案例与重要更新</li>
  <li>认识同样在长期使用 Codex 的伙伴</li>
</ul>

<div class="home-action-row">
  <a class="home-primary-link" href="/community/join.md">¥9.9 了解并加入</a>
  <a href="/community/roadmap.md">参与社区共建</a>
</div>

<p class="home-community-note">支付宝支付 · 付款后当前浏览器自动保存入群资格</p>

</div>

<aside class="home-community-panel">
  <span>适合这些读者</span>
  <strong>你已经开始使用 Codex，并希望把它真正融入工作</strong>
  <ul>
    <li>手上有具体问题或项目</li>
    <li>愿意分享过程和有效经验</li>
    <li>希望获得长期、稳定的中文交流环境</li>
  </ul>
  <a href="/community/join.md">查看完整介绍</a>
</aside>

</section>

</div>
