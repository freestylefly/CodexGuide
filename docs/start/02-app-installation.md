---
description: "Codex 桌面 App 下载与安装教程，说明 macOS、Windows 安装入口、账号登录和首次启动前的准备工作。"
---

::: tip 最后核对
官方资料最后核对日期：2026-10-12。下载地址与安装方式以 [OpenAI 桌面 App 官方文档](https://learn.chatgpt.com/docs/app) 为准，不同地区和账号套餐下可用功能可能有所差异。
:::

# Codex 桌面 App 下载与安装


本教程介绍的是 OpenAI 官方推出的电脑客户端，不是手机 App。官方文档现在统称为 **ChatGPT desktop app**，进入应用后可以选择 Codex，用来管理本地项目、发起任务，以及使用 Skills 和 Automations。该应用支持 macOS、Windows 和 Linux，下面将分别介绍安装方法。其中 Linux 版目前仍处于预览阶段。

## 下载

打开 [OpenAI 桌面 App 官方文档](https://learn.chatgpt.com/docs/app)，页面会提供 macOS、Windows 和 Linux 的官方下载入口。

**macOS：**

![image.png](https://cdn.canghecode.com/yanyan/20261012114511688.png)


点击「Download for macOS」下载 `.dmg` 安装包。
1. 打开下载好的 `.dmg` 文件
2. 把 Codex 图标拖进「Applications（应用程序）」文件夹
3. 首次启动时，如果 macOS 弹出「无法验证开发者」，请先确认安装包来自 OpenAI 官方下载地址；来源不明时不要强制打开


**Windows：**

![image.png](https://cdn.canghecode.com/yanyan/20261012114815858.png)

Windows 用户点击对应的下载按钮，下载完成后运行安装程序，按提示完成安装。

![image.png](https://cdn.canghecode.com/yanyan/20261012114918170.png)


如果点击后微软商店打不开、白屏，或一直卡在「获取」/「正在安装」，可以考虑下面的离线安装方式。核心思路是不走微软商店客户端，直接从微软服务器解析 Codex 安装包，再手动安装。

1. 打开 [store.rg-adguard.net](https://store.rg-adguard.net/)，左侧选择 `ProductId`，输入 Codex 的产品 ID：`9PLM9XGG6VKS`，右侧选择 `RP`，点击对勾解析。
2. 在结果里找到文件名包含 `OpenAI.Codex` 的最新安装包。普通 Windows 电脑通常选 `x64` 架构，后缀可能是 `.msix`、`.msixbundle` 或 `.appxbundle`。
3. 如果浏览器直接点击无法下载，可以右键复制安装包链接，粘贴到浏览器地址栏下载，或在 PowerShell 里用 `curl.exe -L "安装包链接" -o Codex.msix` 下载。
4. 下载完成后双击安装包。如果双击无法安装，在安装包所在目录打开 PowerShell，再执行：

```powershell
Add-AppxPackage -Path ".\Codex.msix"
```

::: warning 安全提醒
这个方法只是绕开微软商店客户端，安装包仍应来自微软下载服务器。如果 PowerShell 提示缺少依赖包，再回到解析结果里下载对应架构的 `Microsoft.VCLibs`、`Microsoft.UI.Xaml` 等依赖包并先安装。不要安装网盘、群文件或不明来源的二次打包文件。
:::

**Linux：**

![image.png](https://cdn.canghecode.com/yanyan/20261012115215787.png)

Linux 版目前处于预览阶段，官方支持 Ubuntu 24.04/26.04 LTS、Debian 13、Fedora 43/44 和持续更新的 Arch Linux，同时提供 x64 和 ARM64 版本。请先打开 [Linux 官方安装文档](https://learn.chatgpt.com/docs/linux/linux-app)，按系统和处理器架构下载对应的安装包。

- Ubuntu 或 Debian：下载 `.deb` 安装包，然后执行 `sudo apt install ./安装包文件名.deb`
- Fedora：下载 `.rpm` 安装包，然后执行 `sudo dnf install ./安装包文件名.rpm`
- Arch Linux：使用官方文档提供的安装脚本

安装完成后，可以从应用菜单打开 ChatGPT，或在终端运行 `chatgpt`。

## 登录

安装完成后打开 App，通常使用 ChatGPT / OpenAI 账号登录。部分本地工作流也支持使用 API key，具体以 App 内显示的登录方式为准。

::: warning 注意套餐限制
Codex 已包含在 ChatGPT Free、Go、Plus、Pro、Business、Edu 和 Enterprise 套餐中。不同套餐的可用模型、使用额度和部分功能会有差异；如需了解付费套餐，参考下一章：[订阅 ChatGPT Plus](./03-account-plan.md)。
:::

::: tip
如果登录失败，可以先检查网络、系统时间、App 版本和账号状态，并确认当前地区在 OpenAI 支持范围内。
:::

## 安装后验证

登录成功后，尝试新建聊天、创建项目或打开本地文件夹。如果界面能正常加载并发送消息，说明安装成功。

::: tip
安装完成后，如果不清楚 Windows 原生模式、WSL2、Linux 命令和项目路径有什么区别，可以继续阅读 [macOS、Windows、Linux 与 WSL 使用区别](./15-platforms.md)。
:::

## 下一步

下一步：打开一个本地项目，向 Codex 发送第一条消息。如需了解不同套餐，可参考 [订阅 ChatGPT Plus / Pro](./03-account-plan.md)。
