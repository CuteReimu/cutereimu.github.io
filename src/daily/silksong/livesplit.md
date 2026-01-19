---
title: LiveSplit 常见问题
icon: clock
order: 2
date: 2025-09-29
category: LiveSplit
tags:
  - 速通
  - LiveSplit
---

本文主要收录了一些LiveSplit在使用过程中为了美化计时器所涉及的常见问题。有关于计时器怎么用、怎么生成、怎么自动计时等基础问题，请参考[空洞骑士计时器生成器FAQ](../hollowknight/hksplitmaker-faq.md)和[丝之歌计时器生成器FAQ](sssplitmaker-faq.md)。

## 如何设置对比目标

打开**LiveSplit** &rarr; 右键 &rarr; Compare Against，下面有几个选项：
- 黑屏加载期间是否计时：
   - Game Time：黑屏加载期间不计时
   - Real Time：全程计时
- 对比目标：
   - Personal Best：和个人PB对比
   - Best Segments：和各分段最佳对比（各分段最佳加起来就是SOB：sum of best）
   - Average Segments：和各分段平均值对比

## 如何在LiveSplit上显示丝之歌完成度和受击次数

这是**LiveSplit**的《丝之歌》计时插件自带的功能，你需要确保已经[激活插件](sssplitmaker-faq.md#首次使用)。接下来按照以下步骤执行：
1. 打开**LiveSplit** &rarr; 右键 &rarr; Edit Layout
2. 点击加号 &rarr; Information &rarr; Text ，这将会增加一个 Text 组件
3. 根据你的喜好调整组件的顺序
4. 双击 Text ，打开它的设置界面，勾选 Custom Variable ，在 Custom Variable Name 中填上 `percent` 就可以显示完成度，填上 `hits` 就可以显示受击次数。如果你想同时显示完成度和受击次数，可以新建两个 Text 组件。
5. 一切设置完成后，按`OK`按钮关闭界面，右键**LiveSplit** &rarr; Save Layout 保存你的设置

值得一提的是，完成度并不是绝对地实时更新，只会在特定的时候（例如SL、游戏中触发某个事件）才会更新。

默认情况下，计时插件的完成度计数功能是开启的，而**受击次数并没有默认开启**，你需要手动在插件设置中开启它，方法如下：
1. 首先在**LiveSplit**中加载好你的计时板子，然后右键**LiveSplit** &rarr; Edit Splits
2. 在弹出的窗口里点击 Settings 按钮
3. 在弹出的窗口中，确保已经勾选上了 Hit Counter（受击次数计数器）

## 如何让LiveSplit窗口变得半透明

首先要明确，你是想自己看起来半透明，还是直播/录的视频看起来窗口半透明。
- 如果想让自己看起来窗口半透明，打开LiveSplit &rarr; 右键 &rarr; Edit Layout &rarr; 点击下方的Layout按钮 &rarr; 调节`Opacity`。
- 如果想让直播/录的视频中看起来窗口半透明，应当去录屏软件（例如OBS）里面找对应的设置进行调节。

## LiveSplit每次开启都很慢

在防火墙中设置禁止 `LiveSplit.exe` 联网即可。

::: details Windows如何禁止某个应用程序联网？

1. 在控制面板中找到 Windows Defender 防火墙的设置页面，点击`高级设置`。\
   ![](/hollow-knight/windows-defender-1.png)
2. 在`出站规则`中，点击`新建规则`。\
   ![](/hollow-knight/windows-defender-2.png)
3. 勾选`程序` &rarr; 下一步 &rarr; 选择程序的路径 &rarr; 下一步 &rarr; 勾选`阻止连接` &rarr; 后面一直点下一步即可。

:::

## 窗口遮挡

在LiveSplit设置中设置了“总在最前”，但游戏全屏了仍然会挡住LiveSplit窗口怎么办？
1. 将游戏切换成窗口模式（按`Alt + Enter`），窗口大小设置为与你的屏幕分辨率相同，就解决了游戏窗口挡住LiveSplit的问题。但窗口会有标题栏和边框，并不美观。
2. 在 Steam 中找到《空洞骑士》游戏，右键 &rarr; 属性 &rarr; 常规，在启动选项中添加`-popupwindow`。重新启动游戏，会发现窗口的标题栏和边框都消失了。

《丝之歌》自带**无边框窗口模式**，可以在游戏设置中开启，省去了上述第2步操作。
