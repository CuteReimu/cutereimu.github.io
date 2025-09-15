---
title: 丝之歌计时器生成器FAQ
shortTitle: 计时器生成器FAQ
icon: clock
order: 1
category: 丝之歌
tags:
  - 丝之歌
  - LiveSplit
date: 2025-09-15
---

::: warning 注意

由于丝之歌目前处于游戏发布初期，很多速通配备内容还不完善，因此本计时器生成器目前也只是一个简化版本，会持续更新完善。

:::

<!-- more -->

::: info 为什么要使用LiveSplit？

在《空洞骑士》速通过程中，考虑到不同玩家的电脑配置不同，speedrun.com 上的空洞骑士排行榜规定：速通耗时的统计应当使用**排除了游戏加载时间的耗时（LRT，Load Removed Time）**，玩家应当将计时器全程放在视频中清晰可见的位置，否则会按照真实耗时进行统计。其中，**LiveSplit** 是 speedrun.com 《空洞骑士》排行榜中最推荐使用的计时器软件，其中的《空洞骑士》计时插件支持排除游戏加载时间的功能。

考虑到《丝之歌》是《空洞骑士》的续作，因此 speedrun.com 上的《丝之歌》排行榜估计也会采用同样的规则，而**LiveSplit**同样是最推荐使用的计时器软件。

你可以前往[**LiveSplit**官网](https://livesplit.org/downloads/)下载最新版本的 **LiveSplit**。

:::

考虑到**LiveSplit**是全英文的，很多国内玩家不方便使用，因此我开发了一个中文版的**计时器生成器**，可以用来快速编辑自动分割插件的配置。

本文中，请注意区分以下两个概念：

- **LiveSplit**：指的是 speedrun.com 《空洞骑士》排行榜推荐使用的计时器软件；
- **计时器生成器**：指的是我开发的用来快速编辑**LiveSplit**自动分割插件的配置的小工具。

## 下载方式

::: important 声明

- 工具适用说明：**LiveSplit**是开源免费软件，**计时器生成器**是针对**LiveSplit**的一个小工具，不含任何破解、盗版或其它侵权内容；
- 兼容性提示：**计时器生成器**使用Go语言开发，仅在 Windows 10 系统进行过基础测试，不保证其他环境下的稳定性；
- 责任声明：使用者应自行测试并承担使用、修改或分发代码产生的全部风险；
- 开源性质：本项目为个人开源工具，作者无义务提供更新或技术支持，改进建议可通过仓库 Issues 提交，但无法承诺响应时效；
- 交流群组：如需讨论，可自愿加入QQ群：901564850，群内须遵守法律法规，违规内容将被清理。

:::

你可以前往[**计时器生成器**的Github仓库](https://github.com/CuteReimu/sssplitmaker)下载，你也可以下载仓库代码后自行编译。

## 如何使用

::: danger 注意

**LiveSplit**一定要把zip/rar压缩包给解压了再用！\
千万不要把`LiveSplit.exe`单独从文件夹里拖出来！\
实在想放在桌面上怎么办？右键 &rarr; 发送到 &rarr; 桌面快捷方式

:::

::: important 重要

由于 wasm 版计时器的离谱设计，**LiveSplit** 的布局文件（\*.lsl）中包含了自动分割插件的配置内容，因此每个布局文件只能对应一个分段文件（\*.lss）。如果你想要使用不同的分段文件，就必须为每个分段文件创建一个独立的布局文件。

简单来说就是：**一个分段文件（*.lss）对应一个布局文件（\*.lsl），每个不同的玩法都要使用单独的这两个文件，换一个新的玩法，以下内容都要完全重新操作一遍。**。

:::

1. 打开LiveSplit后，右键 &rarr; Edit Layout，然后按照你自己喜欢的方式调整计时器窗口的布局，调整好后按`OK`按钮。（如果不会调整，可以跳过这一步）
2. 打开丝之歌**计时器生成器**，点击右上角的`获取wasm文件`按钮，把这个文件保存到本地。（最好记住旁边的这个版本号，如果**计时器生成器**更新后这个版本号变了，强烈建议你重新获取这个文件。）
3. 回到LiveSplit，右键点击 &rarr; Edit Layout，在打开的布局编辑器中，其中包含如 Title、Splits、Timer 等组件。若其中没有名为 Auto Splitting Runtime 的组件，请通过 `+` 添加按钮 -> Control -> Auto Splitting Runtime 进行添加。添加后，点击 Layout Settings -> Auto Splitting Runtime，在 Script Path 旁点击 Browse...，然后找到并选择前面保存的 `.wasm` 文件。看到正常加载后，点击OK按钮关闭此界面即可。
4. 右键 &rarr; Save Layout As...，将布局文件（\*.lsl）文件保存下来。
5. 右键 &rarr; Edit Splits，按照你喜欢的方式编辑分段，编辑好后按`OK`按钮。
6. 右键 &rarr; Edit Splits As...，将分段文件（*.lss）保存下来。
7. 打开丝之歌**计时器生成器**，你可以点击上方的`打开lss文件`和`打开lsl文件`按钮，打开刚刚保存的两个文件进行编辑。（你也可以直接把这两个文件**依次**拖入窗口）
8. 如下图所示，左边一列是分段名称（对应你在 Edit Splits 中编辑的内容），右边一列是触发事件。编辑右边这一列，编辑好之后点击下方的`另存为`按钮保存成新的*.lsl文件。
9. 回到**LiveSplit**，右键 &rarr; Open Layout &rarr; From File...，选择上一步保存的*.lsl文件即可。
10. 右键 &rarr; Edit Layout，双击 Auto Splitting Runtime，简单检查一下内容是否正确即可。
11. 至此，你就可以愉快地使用**LiveSplit**进行《丝之歌》速通了。

![sssplitmaker.png](/hollow-knight/sssplitmaker.png)

## LiveSplit常见问题

参考[这篇文章](../hollowknight/hksplitmaker-faq.md#livesplit常见问题)。

另外值得一提的是，**LiveSplit**的布局文件（\*.lsl）中包含了自动分割插件（\*.wasm）文件的存放路径的配置，因此如果使用别人分享的（\*.lsl）文件，你必须把（\*.wasm）放在和别人一样的路径下，否则会因为找不到文件而无法使用自动分割功能。如果你知道如何使用文本编辑器打开（\*.lsl）文件，也可以直接把里面的路径改成你的路径。