---
description: "Codex Cloud 使用指南，说明云端任务、仓库连接、长任务、PR 工作流和与本地 App、IDE 的差异。"
redirectFrom:
  - /guide/16-cloud-ide-app.html
---

# Codex Cloud：使用云端模式

Codex Cloud 是一种不依赖本地环境的使用方式。你不需要在自己电脑上打开 App 或 CLI，直接在浏览器里连接 GitHub 仓库，让 Codex 在云端完成任务。

::: tip
CLI 的使用方式见 [CLI 安装与登录](./12-cli-installation.md)，IDE 插件见 [在 VS Code 中使用 Codex](./14-ide-vscode.md)，桌面 App 的使用见 [Codex 桌面 App 下载与安装](./01-app-installation.md)。
:::

---

## 适合场景

- 较长的任务，不想占用本地资源
- 多个任务并行推进
- 让 Codex 在独立环境里分析仓库、提出 PR
- 不在电脑旁、只有浏览器时临时使用

---

## 如何使用

### 第 1 步：打开 Codex Cloud

访问：[https://chatgpt.com/codex/cloud](https://chatgpt.com/codex/cloud)

![image-20260513124118871](../images/image-20260513124118871.png)

连接成功后会跳转到任务页面：

![image-20260513124234976](../images/image-20260513124234976.png)

### 第 2 步：授权并选择仓库

Cloud 模式直接在 GitHub 仓库中运行，需要先完成授权。你可以授权全部仓库，也可以只选择特定仓库：

![image-20260513124426627](../images/image-20260513124426627.png)

### 第 3 步：下达指令，查看任务进度

下达指令后，Codex 会在云端执行任务，进度显示在页面下方的任务列表里：

![image-20260513124638212](../images/image-20260513124638212.png)

点击任务可以查看每一步的执行过程和中间状态。任务完成后也可以查看最终回答和产出内容：

![image-20260513124727322](../images/image-20260513124727322.png)

---

## 与桌面 App 模式的区别

| | Codex 桌面 App | Codex Cloud |
|---|---|---|
| 运行环境 | 本地电脑 | 云端（GitHub 环境） |
| 是否需要安装 | 需要下载电脑端客户端 | 不需要，浏览器直接访问 |
| 适合任务 | 本地代码、插件、自动化 | 远程仓库分析、PR 生成 |
| 并行任务 | 支持 | 支持 |
