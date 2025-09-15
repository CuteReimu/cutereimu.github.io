---
title: 空洞骑士wasm版计时器使用指南
shortTitle: wasm版计时器使用指南
isOriginal: true
icon: clock
order: 4
category: 空洞骑士
tags:
  - 空洞骑士
  - 速通
date: 2023-06-15
lastUpdate: true
toc: false
---

wasm版计时器支持Windows、Mac、Linux等多个平台运行，其开发者以及本文的原作者为[AlexKnauth](https://github.com/AlexKnauth)，本文中的“我”均指代文章原作者。你可以[点击这里跳转到原文](https://github.com/AlexKnauth/hollowknight-autosplit-wasm/blob/1.5.0/README.md) 。

::: note 注意

如果在Windows电脑速通空洞骑士，还是强烈建议直接使用 LiveSplit，具体参考[我的另一篇文章](hksplitmaker-faq.md)。

不过，目前丝之歌只有wasm版计时器，并且其**尚在开发阶段，难免有很多bug**，使用时应当注意。

:::

你可以前往[空洞骑士wasm版计时器的Github下载页](https://github.com/AlexKnauth/hollowknight-autosplit-wasm/releases/latest)、[丝之歌wasm版计时器的Github下载页](https://github.com/AlexKnauth/silksong-autosplit-wasm/releases/latest)下载 `.wasm` 文件。保存好这个 `.wasm` 文件，在下文中会被使用。

[[toc]]

## LiveSplit Windows 版使用说明

原版 LiveSplit 仅支持 **Windows** 系统。若您使用 Mac 或 Linux，请参阅下文的其他选项。

LiveSplit 通过布局文件 (`.lsl`) 连接此自动切分器及其设置。请确保为此自动切分器使用的每一个不同的分段文件都配置一个独立的布局副本。

右键点击 -> `Edit Layout...`，您将看到布局编辑器，其中包含如 `Title`、`Splits`、`Timer` 等组件。若其中没有名为 `Auto Splitting Runtime` 的组件，请通过 `+` 添加按钮 -> `Control` -> `Auto Splitting Runtime` 进行添加。添加后，点击 `Layout Settings` -> `Auto Splitting Runtime`，在 `Script Path` 旁点击 `Browse...`，然后找到并选择前面下载的 `.wasm` 文件。随后点击 `Import Splits` 并选择您的分段文件。

点击 `Ok`，并通过 `Save Layout As...` 保存此布局，为其命名时应体现您正在运行的具体分段内容。

停用现有的 Hollow Knight 自动切分器：右键点击 -> `Edit Splits...`，在 `Configurable Load Remover / Auto Splitter. (By DevilSquirrel)` 旁点击 `Deactivate`。

然后通过您刚才保存的布局文件添加此自动切分器。在同一个分段编辑器（通过右键点击 -> `Edit Splits...` 打开）中，在原来显示 `Configurable Load Remover / Auto Splitter. (By DevilSquirrel)` 的位置下方，勾选 `Use Layout` 复选框，点击旁边的 `Browse`，找到并选择之前的布局文件。选择后点击 `Ok`。

最后，在使用此自动切分器运行时，请勿手动切分或跳过，除非该节点明确标记为 `ManualSplit` 或是最终节点。在任何其他情况下，请不要手动切分、跳过或撤销分段。自动切分器将无法感知您的这些操作，其状态会与 LiveSplit 的状态失去同步。

## OBS LiveSplit One 使用说明

OBS LiveSplit One 在 **Windows** 或 **Linux** 系统上运行效果最佳。若您使用 Mac，我推荐使用下文所述的 [LiveSplit One Druid](#instructions-for-livesplit-one-druid)。

请确保使用 `obs-livesplit-one` 的 v0.3.5 或更高版本。

前往 [obs-livesplit-one 发布页面](https://github.com/LiveSplit/obs-livesplit-one/releases)，在 `Assets` 部分下载与您系统架构和操作系统相匹配的文件。请按照 `obs-livesplit-one` 自述文件中[`How to install`](https://github.com/LiveSplit/obs-livesplit-one/blob/master/README.md#how-to-install)部分的说明进行操作。在 Windows 系统上，请将 `obs-livesplit-one.dll` 解压至 `C:\Program Files\obs-studio\obs-plugins\64bit` 或`C:\Program Files (x86)\obs-studio\obs-plugins\64bit` 目录。

在 OBS 中添加 Livesplit One 来源。

属性设置：
- Splits: 选择您的分段文件
- Use local autosplitter: 勾选
- Local Auto Splitter file: 选择前面下载的 `.wasm` 文件
- Custom auto splitter settings: 选择 `Import Splits`
- Select a file: 选择您的分段文件

运行时，OBS 需要具有读取其他进程内存的权限。
- 在 Mac 上，我尚未找到完善的实现方法。我*不推荐*使用 `sudo` 权限运行 OBS。
- 在 Linux 上，可通过以下方式之一授予权限：
    - 将 `/proc/sys/kernel/yama/ptrace_scope` 的值设置为 0，可通过命令 `echo "0"|sudo tee /proc/sys/kernel/yama/ptrace_scope` 实现
    - 设置包含 `CAP_SYS_PTRACE` 的能力值，可通过命令 `sudo setcap CAP_SYS_PTRACE=+eip /usr/bin/obs` 或其变体实现
- 在 Windows 上，此功能应可直接使用。Windows 默认允许读取内存。

## LiveSplit One Druid 使用说明

主仓库 `livesplit-one-druid` 的版本可能无法满足运行此自动切分器的新度要求。
- 若 [https://github.com/CryZe/livesplit-one-druid](https://github.com/CryZe/livesplit-one-druid) 包含 2023 年 12 月或之后的提交，则通常可满足要求。
- 但如果最新提交仍为 2023 年 4 月，则需要使用更新版本，例如我的复刻版本 [https://github.com/AlexKnauth/livesplit-one-druid](https://github.com/AlexKnauth/livesplit-one-druid)。

安装复刻版本：请访问 [AlexKnauth LiveSplit One Druid 最新发布页](https://github.com/AlexKnauth/livesplit-one-druid/releases/latest)，在 `Assets` 部分下载适用于您系统架构和操作系统的版本。

运行时，LiveSplit One Druid 需要具有读取其他进程内存的权限。
- 在 Mac 上，可能需要使用 `sudo` 权限运行。
- 在 Linux 上，可通过以下方式之一授予权限：
    - 将 `/proc/sys/kernel/yama/ptrace_scope` 的值设置为 0，可通过命令 `echo "0"|sudo tee /proc/sys/kernel/yama/ptrace_scope` 实现
    - 设置包含 `CAP_SYS_PTRACE` 的能力值，可通过命令 `sudo setcap CAP_SYS_PTRACE=+eip LiveSplitOne` 或其变体实现
    - 使用 `sudo` 权限运行
- 在 Windows 上可直接使用，系统默认允许读取内存。

通过右键点击或 Control 点击唤出上下文菜单：
- Splits, Open...：选择您的 `.lss` 分段文件
- Layout, Open...：对于布局文件，建议为 LiveSplit One Druid 使用 `.ls1l` 格式文件而非 `.lsl` 文件。您可通过 LiveSplit One 网页版 [https://one.livesplit.org/](https://one.livesplit.org/) 创建 `.ls1l` 文件，或使用本资源库内置的 `layout-lso.ls1l` 文件作为起点
- Open Auto-splitter...：选择前面下载的 `.wasm` 文件
- Compare Against：选择 Game Time
- Settings：配置所需的热键

最后请注意：在使用此自动切分器运行时，请勿手动切分或跳过，除非该节点明确标记为 `ManualSplit` 或是最终节点。在任何其他情况下，请不要手动切分、跳过或撤销分段。自动切分器将无法感知这些操作，其状态会与 LiveSplit One Druid 的状态失去同步。

### 仅限 LiveSplit One Druid 的不稳定版本

如果您计划仅在 LiveSplit One Druid 0.4.1 或更高版本中使用此自动切分器，可以从[最新发布版](https://github.com/AlexKnauth/hollowknight-autosplit-wasm/releases/latest)下载 `hollowknight_autosplit_wasm_unstable.wasm` 文件来替代稳定版本。

此不稳定版本在 LiveSplit One Druid 中支持手动切分/跳过/撤销操作，但若尝试在其他计时器中使用将会崩溃。

## livesplit-one-desktop 使用说明

请注意：主仓库 `livesplit-one-desktop` 的版本可能无法满足运行此自动切分器的新度要求。
- 若 [https://github.com/CryZe/livesplit-one-desktop](https://github.com/CryZe/livesplit-one-desktop) 包含 2023 年 12 月或之后的提交，则通常可满足要求。
- 但如果最新提交仍为 2023 年 7 月，则需要使用更新版本，例如我的复刻版本 [https://github.com/AlexKnauth/livesplit-one-desktop](https://github.com/AlexKnauth/livesplit-one-desktop)。

您可以通过以下命令克隆我的复刻版本：
```sh
git clone https://github.com/AlexKnauth/livesplit-one-desktop.git
```

根据 [`rust_minifb` 构建说明](https://github.com/emoon/rust_minifb#build-instructions)，在 Linux 系统上可能需要先安装这些依赖项：
```sh
sudo apt install libxkbcommon-dev libwayland-cursor0 libwayland-dev
```

在 `livesplit-one-desktop` 代码库中，修改 `config.yaml` 文件内容为：
```yaml :no-line-numbers
# [!code word:<分段文件路径.lss>]
# [!code word:<.wasm 文件路径>]
general:
  splits: <分段文件路径.lss>
  timing-method: GameTime
  auto-splitter: <.wasm 文件路径>
```
请将 `<分段文件路径.lss>` 替换为您的分段文件实际路径，并将 `<.wasm 文件路径>` 替换为前面下载的 `.wasm` 文件的实际路径。

如需配置布局文件，请将 `config.yaml` 文件修改为：
```yaml
# [!code word:<布局文件路径.lsl>]
general:
  layout: <布局文件路径.lsl>
```
并将 `<布局文件路径.lsl>` 替换为您的布局文件路径。`livesplit-one-desktop` 支持使用 `.lsl` 或 `.ls1l` 格式的布局文件。

配置热键时，请将 `config.yaml` 文件修改为：
```yaml :no-line-numbers
hotkeys:
  split: Numpad1
  reset: Numpad3
  undo: Numpad8
  skip: Numpad2
  pause: null
  undo_all_pauses: null
  previous_comparison: Numpad4
  next_comparison: Numpad6
  toggle_timing_method: null
```
您可以根据 [`livesplit_hotkey::KeyCode`](https://docs.rs/livesplit-hotkey/latest/livesplit_hotkey/enum.KeyCode.html) 中的选项替换这些热键值。

运行 `livesplit-one-desktop` 时需要具有读取其他进程内存的权限。在 Mac 上可能需要使用 `sudo` 权限运行，例如在 `livesplit-one-desktop` 代码库中执行：
```sh
cargo build --release
sudo ./target/release/livesplit-one
```

最后请注意：在使用此自动切分器运行时，请勿手动切分或跳过，除非该节点明确标记为 `ManualSplit` 或是最终节点。在任何其他情况下，请不要手动切分、跳过或撤销分段。自动切分器将无法感知这些操作，其状态会与 `livesplit-one-desktop` 的状态失去同步。

`livesplit-one-desktop` 的热键绑定基于 Qwerty 键盘布局设计，因此您可能需要按 Qwerty 布局中对应键位的位置进行操作。例如保存分段的快捷键在 Qwerty 布局中是 "Control S"，但在 Dvorak 键盘上，Qwerty 的 "S" 键位对应 Dvorak 的 "O" 键，因此需要使用 Dvorak 布局的 "Control O" 进行保存。

在 Mac 上保持窗口在全屏游戏上方的方法：开始拖动 livesplit-one-desktop 窗口，在拖动过程中使用多指滑动手势切换到全屏游戏界面，然后停止拖动。只要之后不再进行任何屏幕切换操作，窗口将暂时保持在全屏游戏上方。
