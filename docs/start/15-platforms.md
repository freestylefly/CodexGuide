---
description: "Codex 平台差异指南，集中说明 macOS、Windows、Linux 与 WSL2 在桌面 App、Shell、路径、沙盒、项目位置和平台限定功能上的区别。"
---

::: tip 最后核对
官方资料最后核对日期：2026-10-13。本文参考 [ChatGPT 桌面 App](https://learn.chatgpt.com/docs/app)、[Windows App](https://learn.chatgpt.com/docs/windows/windows-app)、[Linux App](https://learn.chatgpt.com/docs/linux/linux-app)、[WSL](https://learn.chatgpt.com/docs/windows/wsl)、[Sandbox](https://learn.chatgpt.com/docs/sandboxing)、[Appshots](https://learn.chatgpt.com/docs/appshots)、[Computer History](https://learn.chatgpt.com/docs/customization/computer-history) 与 [Record & Replay](https://learn.chatgpt.com/docs/extend/record-and-replay) 整理。平台支持、Preview 状态和桌面功能会继续变化，请以官方页面与当前客户端为准。
:::

# macOS、Windows、Linux 与 WSL 使用区别

无论使用 macOS、Windows 还是 Linux，Codex 都可以读取项目、修改文件、运行命令并检查结果。不过，不同系统使用的命令、文件路径和运行环境并不完全相同。

例如，一条能在 macOS 中运行的命令，复制到 Windows PowerShell 后可能会报错；在 Windows 中，项目保存在本地磁盘还是 WSL2 中，也会影响运行速度和文件权限。

这一章会带你了解这些差异，帮助你确认 Codex 当前运行在哪个环境、应该使用哪种命令，以及项目文件放在哪里更合适。

---

## 不同平台有什么区别

| 对比项 | macOS | Windows 原生 | Linux | WSL2 |
| --- | --- | --- | --- | --- |
| 桌面 App | 支持 | 支持 | Preview | 通过 Windows App 切换 Agent 环境 |
| 常用 Shell | `zsh`、`bash` | PowerShell | `bash` 等 | `bash` 等 |
| 常见项目路径 | `/Users/<username>/project` | `C:\Users\<username>\project` | `/home/<username>/project` | `/home/<username>/project` |
| 沙盒实现 | macOS Seatbelt | Windows 原生沙盒 | Linux `bubblewrap` | Linux `bubblewrap` |
| Computer Use | 支持，可在后台运行 | 支持，会占用前台桌面 | 以当前官方支持为准 | 由 Windows App 和当前环境决定 |
| Appshots | 支持 | 支持 | 当前官方页面未说明支持 | 由 Windows App 提供 |
| Computer History | 支持，macOS 限定 | 不支持 | 不支持 | 不支持 |
| Record & Replay | 支持，macOS 限定 | 不支持 | 不支持 | 不支持 |

::: warning
WSL2 是 Windows 中的 Linux 运行环境。将 Codex Agent 切换到 WSL2 后，它会按照 Linux 的方式运行，因此需要使用 Linux 命令、文件路径和沙盒，而不是 Windows PowerShell 的运行方式。
:::

---

## Shell 和命令有什么不同

### macOS、Linux 和 WSL2

在 macOS、Linux 和 WSL2 中，我们通常会在终端里输入命令，让电脑完成复制文件、删除文件夹或运行脚本等操作。这些系统常用 `zsh` 或 `bash` 来理解并执行命令。

下面是几条常见命令。

```bash
export API_KEY="example"
cp .env.example .env
rm -rf dist
chmod +x scripts/setup.sh
./scripts/setup.sh
```

它们的作用分别是：

- `export API_KEY="example"`：临时保存一项配置信息，供接下来运行的程序使用。这里的 `example` 只是示例内容。
- `cp .env.example .env`：把 `.env.example` 复制一份，并将复制出来的文件命名为 `.env`。
- `rm -rf dist`：删除 `dist` 文件夹以及里面的所有内容。删除后不会进入回收站，所以执行前一定要检查文件夹名称。
- `chmod +x scripts/setup.sh`：允许电脑运行 `setup.sh` 这个脚本文件。
- `./scripts/setup.sh`：开始运行 `setup.sh` 脚本，让电脑按照脚本中写好的步骤执行操作。

::: tip
这里不需要记住每条命令。先记住一点就可以：macOS、Linux 和 WSL2 通常使用上面这种写法，而 Windows PowerShell 的命令写法会有所不同。
:::

### Windows 原生模式

在 Windows 原生模式中，Codex Agent 默认使用 PowerShell。你可以把 PowerShell 理解成 Windows 用来接收和执行命令的工具。

下面几条命令，与前面的例子用途相近，但写法换成了 PowerShell：

```powershell
$env:API_KEY = "example"
Copy-Item .env.example .env
Remove-Item -Recurse -Force dist
.\scripts\setup.ps1
```

它们分别表示：

- `$env:API_KEY = "example"`：临时保存一项配置信息，供接下来运行的程序使用。
- `Copy-Item .env.example .env`：复制 `.env.example` 文件，并把新文件命名为 `.env`。
- `Remove-Item -Recurse -Force dist`：删除 `dist` 文件夹以及里面的所有内容。删除前要确认文件夹名称是否正确。
- `.\scripts\setup.ps1`：运行 `setup.ps1` 脚本，让电脑按照脚本里的步骤执行操作。

虽然这两组命令完成的事情相近，但 Bash 命令不能直接当作 PowerShell 命令使用。从教程中复制命令时，可以先看脚本文件的结尾：

- 文件名以 `.sh` 结尾，通常需要在 macOS、Linux、WSL2 或 Git Bash 中运行。
- 文件名以 `.ps1` 结尾，通常需要在 Windows PowerShell 中运行。

如果不知道应该使用哪一种，可以直接把命令或脚本文件交给 Codex，让它先判断运行环境，不要急着执行。

---

## 四种环境的沙盒不同

为了保护电脑中的文件，Codex 默认不会直接获得全部权限。它只能在允许的范围内读取文件、修改项目和运行命令。这个受限制的运行范围就叫“沙盒”。

你可以把沙盒理解成一个专门给 Codex 准备的工作区。Codex 可以在工作区内完成任务；如果它想打开工作区之外的文件或访问没有获得许可的网络，可能会先询问你是否允许。

macOS、Windows 和 Linux 都有沙盒，只是使用的技术不同：

- **macOS**：使用系统自带的 Seatbelt。Seatbelt 是 macOS 用来限制程序访问范围的安全功能。
- **Windows 原生模式**：使用 Windows 原生沙盒。Codex 会根据电脑支持的功能和当前设置，选择合适的隔离方式。
- **Linux**：使用名为 `bubblewrap` 的工具创建沙盒。这个工具负责限制 Codex 可以访问的文件和系统功能。
- **WSL2**：Codex Agent 实际运行在 Linux 环境中，所以使用的也是 Linux 沙盒，而不是 Windows 原生沙盒。

它们虽然实现方式不同，但作用相同，都是防止 Codex 随意访问电脑中的其他内容。

因此，当 Codex 无法打开某个文件夹或执行某条命令时，不一定是命令写错了，也可能是当前沙盒没有允许这项操作。遇到这种情况，可以按下面的顺序检查：

1. 查看 Codex 是否正在申请权限。
2. 检查当前权限模式是否允许这项操作。
3. 检查沙盒设置是否限制了目标文件或网络。
4. 如果仍然无法运行，再检查当前系统是否缺少需要的组件，例如 Linux 的 `bubblewrap`。

更完整的权限说明见[沙盒与审批](../advanced/07-sandbox-approvals.md)。

---

## Windows 原生还是 WSL2

在 Windows 电脑上，Codex Agent 有两种运行方式：

- **Windows 原生模式**：Codex 直接在 Windows 中运行，通常使用 PowerShell 和 Windows 路径。
- **WSL2 模式**：Codex 在 Windows 内部的 Linux 环境中运行，使用 Bash、Linux 路径和 Linux 工具。

选择哪一种，主要看你的项目和开发工具目前放在哪里。

### 适合选择 Windows 原生的情况

- 项目主要保存在 `C:\` 盘
- 日常使用 PowerShell、Visual Studio 或 Windows 专用工具
- 项目依赖 Windows SDK、`.NET`、PowerShell 脚本或 Windows 应用
- 不想额外维护一套 Linux 环境

如果你平时没有使用过 WSL2，或者不确定应该选哪个，可以先使用 Windows 原生模式。

### 适合选择 WSL2 的情况

- 项目和开发工具已经安装在 WSL2 中
- 团队主要使用 Linux 部署环境
- 项目依赖 Bash、Linux 包管理器或 Linux 原生工具
- 希望本地环境更接近 Linux 服务器

如果项目本来就保存在 WSL2 中，最好让 Codex Agent 也在 WSL2 中运行。这样可以减少路径、权限和工具不一致带来的问题。

需要切换时，打开 Windows App 设置，找到 **Agent environment**，然后选择 Windows 原生模式或 WSL2。修改后需要重新启动 App，新设置才会生效。

::: tip
Agent 的运行环境和集成终端使用的 Shell 可以分别设置。例如，Agent 可以运行在 WSL2 中，而集成终端仍然打开 PowerShell。

如果你刚开始使用，建议让 Agent 和集成终端使用同一种环境。例如，Agent 使用 WSL2 时，终端也选择 WSL。这样看到的命令和文件路径会保持一致，遇到问题时也更容易排查。
:::

---

## 项目应该放在哪里

### 使用 Windows 原生 Agent

如果 Codex Agent 运行在 Windows 原生模式，建议把项目保存在 Windows 文件系统中，例如：

```text
C:\Users\<username>\Projects\my-app
```

这里的 `<username>` 代表你的 Windows 用户名。项目和 Agent 都在 Windows 环境中，文件路径、权限和开发工具会更容易保持一致。

### 使用 WSL2 Agent

如果 Codex Agent 运行在 WSL2 中，建议把项目保存在 WSL2 自己的 Linux 用户目录中，例如：

```text
/home/<username>/code/my-app
```

这里的 `<username>` 代表你在 WSL2 中使用的 Linux 用户名。

在 WSL2 中也能通过 `/mnt/c/...` 打开 Windows C 盘中的文件，但不建议把大型 Linux 项目长期放在那里运行。因为 Codex 和开发工具需要在 Linux 与 Windows 文件系统之间来回访问，可能出现：

- 文件读写速度较慢
- 修改文件后，开发工具没有及时发现变化
- 项目中的快捷链接无法正常使用
- 文件权限或文件名大小写不一致

项目保存在 WSL2 中，并不代表只能通过 Linux 终端访问。如果想从 Windows 文件资源管理器打开它，可以在地址栏输入：

```text
\\wsl$\
```

然后选择自己安装的 Linux 发行版，再进入 `home` 和对应的用户目录。

::: warning
当前 Codex 已不再支持 WSL1。如果需要在 Windows 中使用 Linux 环境，请安装并使用 WSL2。
:::

---

## 为什么 Windows 和 WSL 的配置没有同步

Windows 原生环境和 WSL2 虽然在同一台电脑上，但可以把它们理解成两个相邻的房间。两个房间都有自己的文件和设置，不会自动把内容同步给对方。

Codex 也会在两个环境中分别建立自己的数据目录。这个目录叫作 `CODEX_HOME`，主要用来保存 Codex 的配置、登录信息和会话记录。默认位置如下：

```text
Windows：C:\Users\<username>\.codex
WSL2：   /home/<username>/.codex
```

例如，你在 Windows 原生模式中登录了 Codex，并修改了 `config.toml`，进入 WSL2 后仍可能需要重新登录，也看不到刚才修改的配置。因为这些数据分别保存在两个目录中。

默认情况下，下面这些内容都可能各自保存一份：

- `config.toml` 中的设置
- Codex 的登录状态
- 以前的会话记录
- 已安装的 Skills 和 Plugins
- MCP 连接配置
- 保存在本地的 Memories

如果经常在 Windows 原生模式和 WSL2 之间切换，也可以让两边共用 Windows 中的 `.codex` 目录。方法是在 WSL2 中把 `CODEX_HOME` 指向 Windows 的目录：

```bash
export CODEX_HOME=/mnt/c/Users/<windows-user>/.codex
```

这条命令相当于告诉 WSL2：“以后不要再使用自己的 Codex 数据目录，改用 Windows 中的这一份。”其中 `<windows-user>` 需要替换成自己的 Windows 用户名。

::: tip
如果刚开始使用，建议先让 Windows 和 WSL2 各自保存配置。这样一边的设置出现问题时，不会影响另一边。

等你确认两边需要使用相同的登录状态、配置和会话后，再考虑统一 `CODEX_HOME`。
:::

---

## Computer Use 的工作方式不同

### macOS

在 macOS 中，Computer Use 可以在后台操作应用。你可以把它理解成一名在旁边工作的助手：它操作自己的任务窗口，你可以通过画中画预览查看进度，同时继续使用其他应用。

例如，让 Codex 打开浏览器检查网页时，你仍然可以在另一个应用中写文档。不过，为了避免相互干扰，最好不要同时操作 Codex 正在使用的应用。

### Windows

在 Windows 中，Computer Use 和你使用的是同一个活动桌面。它会操作当前桌面上的鼠标、键盘和窗口，而不是在后台打开一个独立桌面。

任务执行时，你可能会看到：

- 鼠标自动移动
- Codex 自动输入文字
- 前台窗口自动切换
- 你的操作和 Codex 的操作互相影响

Computer Use 运行时，你仍然可以使用鼠标和键盘，也可以随时停止任务，自己接管电脑。不过，你和 Codex 操作的是同一个桌面，所以同时操作可能会互相干扰。

例如，Codex 正在填写表单时，如果你切换到另一个窗口，它接下来的点击就可能落在错误的位置。为了让任务顺利完成，建议先让 Codex 完成当前操作，再接管电脑。

运行任务时，Windows 电脑还需要保持解锁。如果任务需要较长时间，又不希望影响自己使用电脑，可以让它在另一台 Windows 设备上运行，或者使用 Windows 虚拟机。

虚拟机相当于在电脑里另外运行一个独立的 Windows 桌面，Codex 可以在里面操作，不会占用你正在使用的主桌面。

Linux 和 WSL2 是否支持相同的桌面操作能力，要根据当前安装的 App、账号权限和官方支持范围判断，不能直接按照 macOS 或 Windows 的方式使用。

---

## Appshots 快捷键不同

Appshots 可以把电脑当前打开的窗口发送给 ChatGPT 或 Codex。你可以把它理解成给当前窗口拍一张“带文字信息的快照”：Codex 不仅能看到窗口画面，还可能读取应用提供的文字内容。

![image.png](https://cdn.canghecode.com/yanyan/20261013113220298.png)

例如，程序弹出一条很难描述的错误信息时，你可以先打开错误窗口，再使用 Appshots 把画面交给 Codex 分析，不需要自己逐字复制报错。

macOS 和 Windows 都支持 Appshots，但默认快捷键不同：

- **macOS**：同时按下两个 `Command` 键。
- **Windows**：同时按下两个 `Alt` 键。

第一次在 macOS 中使用时，系统可能要求开启“屏幕与系统音频录制”和“辅助功能”权限。前者让 Appshots 获取窗口画面，后者帮助它读取窗口中可以识别的文字。

![image.png](https://cdn.canghecode.com/yanyan/20261013113120055.png)

::: tip 注意保护隐私
使用 Appshots 前，先检查当前窗口中有没有密码、密钥、聊天记录或其他隐私信息。Appshots 会把窗口画面和其中可读取的文字一起发送给 ChatGPT。

简单来说，如果某个窗口不适合截图发给别人，也不要通过 Appshots 发送。
:::



---

## macOS 当前独有的功能

### Computer History

Computer History 会记录你允许访问的应用和网站活动，并将这些内容整理成时间线和本地记忆，方便以后查找和继续之前的工作。

目前，这项功能只支持 macOS，Windows、Linux 和 WSL2 暂时无法使用。

开启方式、记录范围和隐私提醒，见 [Computer History：找回最近在电脑上做过的事](../advanced/13-computer-history.md)。

![image.png](https://cdn.canghecode.com/yanyan/20261013113605318.png)


### Record & Replay

Record & Replay 可以把你演示的操作步骤记录下来，再将这套流程制作成可以重复使用的 Skill。例如，你演示一次如何整理文件，之后就可以让 Codex 按照相同的步骤再次操作。

目前，这项功能只支持 macOS，使用前还需要安装并开启 Computer Use。

### 锁屏后的 Computer Use

macOS 支持“锁屏后继续使用”功能。开启后，已经获得你许可的 Computer Use 任务，可以在 Mac 锁屏后继续操作应用。

这项功能需要单独开启，而且只适用于符合安全要求的任务。开始任务前，仍要检查 Codex 可以访问哪些应用，以及它准备执行哪些操作。

---

## Linux Desktop 仍是 Preview

Linux Desktop App 目前仍处于 Preview，也就是预览阶段。它已经可以安装和使用，但功能、支持范围和稳定性仍可能继续调整。

目前，官方支持以下 Linux 发行版：

- Ubuntu 24.04 LTS、26.04 LTS
- Debian 13
- Fedora 43、44
- 持续更新的 Arch Linux

这些系统同时支持 x64 和 ARM64 两种处理器架构。安装前需要先确认自己使用的 Linux 发行版和处理器架构，再下载对应的安装文件。

不同发行版的安装方式也不一样：Ubuntu 和 Debian 使用 `.deb` 安装包，Fedora 使用 `.rpm` 安装包，Arch Linux 则需要运行官方提供的安装脚本。

::: tip
Linux App 可以安装，并不代表它已经具备 macOS 和 Windows App 的全部功能。使用 Computer Use、Appshots、远程控制等桌面功能前，建议先查看对应的官方页面，确认 Linux 当前是否支持。
:::

---

## 如何确认 Codex 实际运行在哪里

如果不确定 Codex Agent 当前运行在哪个环境，可以让它执行几条只读取信息的命令。这些命令不会修改文件，只会显示系统类型、正在使用的 Shell 和当前文件夹。

你可以先直接告诉 Codex：

> 请检查当前运行环境，告诉我是 macOS、Windows、Linux 还是 WSL2。只读取系统信息，不要修改文件。

如果想自己检查，可以根据当前终端运行下面的命令。

### macOS 或 Linux

```bash
uname -a
echo "$SHELL"
pwd
```

- `uname -a`：查看当前系统信息。
- `echo "$SHELL"`：查看当前使用的是哪一种 Shell。
- `pwd`：查看当前所在的文件夹。

### WSL2

```bash
echo "$WSL_DISTRO_NAME"
uname -a
pwd
```

第一条命令会显示当前使用的 WSL Linux 发行版，例如 `Ubuntu`。如果能正常显示名称，通常说明 Agent 正在 WSL2 中运行。

### Windows PowerShell

```powershell
$PSVersionTable
$env:OS
Get-Location
```

- `$PSVersionTable`：查看当前 PowerShell 的版本信息。
- `$env:OS`：查看当前操作系统。
- `Get-Location`：查看当前所在的文件夹。

查看结果时，可以重点关注文件路径：

- 出现 `/Users/...`，通常表示 Agent 在 macOS 中运行。
- 出现 `/home/...`，通常表示 Agent 在 Linux 或 WSL2 中运行。可以再查看 `$WSL_DISTRO_NAME`，进一步确认是不是 WSL2。
- 出现 `C:\...`，并且命令由 PowerShell 执行，通常表示 Agent 在 Windows 原生环境中运行。

---

## 选择建议

- **使用 Mac**：选择 macOS 环境即可，一般不需要额外配置其他系统。
- **项目保存在 Windows 中**：优先使用 Windows 原生模式，这样 Codex 使用的路径和工具会与项目保持一致。
- **项目保存在 WSL2 中**：让 Codex Agent 也在 WSL2 中运行，并尽量把项目放在 `/home/...` 目录下。
- **使用 Linux 桌面**：安装前先确认自己的发行版和处理器架构是否受支持。Linux App 目前仍处于 Preview，部分桌面功能可能与 macOS、Windows 不同。
- **团队成员使用不同系统**：尽量把安装、测试和启动项目的步骤写成统一命令。例如，大家都运行 `npm test`，而不是分别记住一套 Bash 和 PowerShell 命令。

如果遇到命令无法运行、路径找不到或没有权限等问题，不要只看当前使用的电脑系统。还需要依次确认四件事：Codex Agent 在哪里运行、集成终端使用什么 Shell、项目实际保存在哪里，以及当前沙盒允许访问哪些内容。

## 下一步

完成快速上手后，可以继续阅读[进阶教程](../advanced/00-index.md)，进一步了解权限、沙盒、配置和团队协作。
