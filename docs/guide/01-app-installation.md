---
description: "Codex 桌面 App 下载与安装教程，说明 macOS、Windows 安装入口、账号登录和首次启动前的准备工作。"
---

# Codex 桌面 App 下载与安装

::: tip 最后核对
官方资料最后核对日期：2026-06-13。下载地址与安装方式以 [OpenAI Codex 产品页](https://openai.com/codex/) 和 [chatgpt.com/codex/get-started](https://chatgpt.com/codex/get-started/) 为准，不同地区和账号套餐下可用功能可能有所差异。
:::

本教程里说的 **Codex 桌面 App**，是电脑上的客户端，不是手机 App。它由 OpenAI 官方发布，支持 macOS 和 Windows，安装后你可以在本地管理项目、发起任务、使用 Skills 和 Automations。

## 下载

打开 [chatgpt.com/codex/get-started](https://chatgpt.com/codex/get-started/)，页面中央会显示对应系统的下载按钮。


**macOS：**

![Codex 桌面 App 下载页 macOS](../images/codex-app-download-macos-options.png)

点击「Download for macOS」下载 `.dmg` 安装包。
1. 打开下载好的 `.dmg` 文件
2. 把 Codex 图标拖进「Applications（应用程序）」文件夹
3. 首次启动时，macOS 可能弹出「无法验证开发者」——无需担心，打开「系统设置 → 隐私与安全性」，点击「仍要打开」即可


**Windows：**

![Codex 桌面 App 下载页 Windows](../images/chatgpt-codex-get-started-clean.png)

Windows 用户点击对应的下载按钮，下载完成后运行安装程序，按提示完成安装。

如果点击后微软商店打不开、白屏，或一直卡在「获取」/「正在安装」，可以改用离线安装方式。核心思路是：不走微软商店客户端，直接从微软服务器解析 Codex 安装包，再手动安装。

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


## 登录

安装完成后打开 App，使用 ChatGPT / OpenAI 账号登录。

::: warning 注意套餐限制
Codex 桌面 App 的完整功能（多 agent 并行、Skills、Automations 等）需要 **Plus 及以上套餐**。免费账号登录后部分功能会受限或无法使用。如需升级，参考下一章：[订阅 ChatGPT Plus](./02-subscribe-plus.md)。
:::

::: tip
如果登录失败，可以尝试切换代理节点，比如非美国节点。
:::

## 安装后验证

登录成功后，左侧栏会出现「Projects」和「Chats」两个入口，顶部显示当前账号信息。如果界面正常加载，说明安装成功。

下一步：[订阅 ChatGPT Plus / Pro](./02-subscribe-plus.md)
