---
description: "Codex CLI 安装与登录教程，覆盖 Node 环境、安装命令、版本检查、登录流程和首次运行准备。"
redirectFrom:
  - /guide/11-cli-installation.html
---

# 安装与登录

本页先覆盖 Codex CLI 的安装与登录。桌面端、ChatGPT、Cloud 和 IDE 入口会在 [入口地图](/platform/) 中分别展开。

::: tip 最后核对
官方资料最后核对日期：2026-05-27。CLI 系统要求与安装方式参考 [openai/codex 官方仓库](https://github.com/openai/codex)、[CLI install 文档](https://github.com/openai/codex/blob/main/docs/install.md) 和 [Codex CLI Help Center](https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started)。
:::

## 安装前检查

官方仓库当前给出的 CLI 运行环境建议：

| 项目 | 建议 |
| --- | --- |
| 操作系统 | macOS 12+、Ubuntu 20.04+/Debian 10+、Windows 11 通过 WSL2 |
| Git | 推荐 2.23+，便于 PR 辅助能力 |
| 内存 | 4GB 起步，8GB 更稳 |

本地先确认：

```bash
node -v
npm -v
git --version
```

![image-20260511165250308](../images/image-20260511165250308.png)

## 安装 CLI

常见安装方式：

```bash
npm install -g @openai/codex
```

更新到最新版本：

```bash
npm install -g @openai/codex@latest
```

检查版本：

```bash
codex --version
```

![image-20260511165422384](../images/image-20260511165422384.png)

## 登录方式

运行：

```bash
codex
```

根据终端提示完成登录。官方资料说明 Codex 可以通过 ChatGPT 账号在多个入口中使用，具体可用计划、限额和组织策略以 [Codex in ChatGPT Help Center](https://help.openai.com/en/articles/11369540-codex-in-chatgpt) 为准。

![image-20260511165455390](../images/image-20260511165455390.png)

## 第一次只读任务

进入一个本地项目根目录：

```bash
cd path/to/your/project
codex
```

先让 Codex 只读仓库：

```text
请先阅读这个仓库的目录结构、README、包管理器配置和测试配置。不要修改文件。请总结：
1. 项目用途
2. 主要技术栈
3. 如何安装依赖和运行测试
4. 你建议我下一步交给你的 3 个低风险任务
```

![image-20260511165723872](../images/image-20260511165723872.png)

## 安装失败时怎么判断

| 现象 | 可能原因 | 处理方式 |
| --- | --- | --- |
| `codex` 命令找不到 | npm global bin 未进 PATH | 查看 `npm bin -g`，把目录加入 shell PATH |
| 登录后仍提示无权限 | 账号计划、组织策略或会话状态问题 | 重新登录，并查看 Help Center 中的计划说明 |
| Windows 运行异常 | 未使用 WSL2 或 shell 环境不完整 | 按官方建议使用 Windows 11 + WSL2 |
| 仓库命令跑不起来 | 项目依赖未安装或本地环境缺失 | 先安装项目依赖，再让 Codex 读取测试配置 |

完成后继续：[第一次让 Codex 改代码](./13-cli-first-run.md)。
