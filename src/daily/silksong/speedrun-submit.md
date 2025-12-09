---
title: 丝之歌速通投稿问题
icon: book
order: 3
date: 2025-09-27
category: 丝之歌
tags:
  - 丝之歌
  - 速通
toc: false
isOriginal: true
copy: false
---

本篇主要介绍 [speedrun.com 上面《丝之歌》游戏](https://www.speedrun.com/zh-CN/silksong)的投稿问题和NMG规则。

丝之歌排行榜的投稿于2025年10月1日正式开放。

::: warning 注意

规则的英文原文见：[https://github.com/hk-speedrunning/Silksong-Rules](https://github.com/hk-speedrunning/Silksong-Rules)

本文旨在帮助国内速通玩家了解速通投稿规则，以意译为主，附带本人的解释，方便国内速通玩家理解，难免有翻译错误，**最终请以英文原文为准**。下面的每一段翻译都附带了英文原文，方便比对。

规则随时可能变化，但**本文档更新可能滞后，最终请以上方链接的规则原文为准**。

:::

<!-- more -->

[[toc]]

## 新规则：允许跳过开场动画

*来自速通社区公告*

:::: tabs

@tab 个人翻译

现在，允许使用丝之歌自带的回档功能跳过开场动画。

操作方法是：在存档选择界面，在任意一个现有存档下方点击回档按钮，下滑到最下方，选择`第一幕开启`。

同时你需要对计时器做出以下改动：

::: info 译者注

以下步骤已经集成入[计时器生成器](sssplitmaker-faq.md)（v1.17.0版本开始）中，你可以使用[计时器生成器](sssplitmaker-faq.md)打开你原来的板子（.lss文件），勾选`跳过开局动画`后，另存为，重新用 **LiveSplit** 打开即可。

:::

- 打开 **LiveSplit** &rarr; 右键 &rarr; Edit Splits &rarr; 右边的 Settings 按钮 &rarr; 将开始计时的触发条件从 `Start New Game (Start)` 改为 `Act 1 Start (Start)` 。
- 打开 **LiveSplit** &rarr; 右键 &rarr; Edit Splits &rarr; 将 `Start Timer at:` 从 `0.000` 改为 `21.760` ，如下图所示。\
    ![skip-cutscene.png](/hollow-knight/skip-cutscene.png)

::: note 说明

- 为什么是 `21.760` 这个时间？因为这个就是按照TAS计算可以开始移动的时间（如果你开局向左走）。如果你开局向右走的话，TAS还会在这个基础上快 0.6 秒（但按照目前规则，即使你开局向右走你也必须填 `21.760` 这个时间）。
- 这个规则可能会变动，因为将来可能会禁止使用回档功能，改为用另外的方案代替。不过，在规则修改之前提交的记录都会保留在排行榜上。

:::

@tab 英文原文

**Starting runs from autosaves**

Starting runs from the new-game wakeup autosave is now legal, provided you are using the autosplitter. If you decide to start runs from the autosave, you MUST set your LiveSplit "Start Timer at" option to 21.76.

**Setup guide**
- Change your starting split from "Start New Game (Start)" to "Act 1 Start (Start)" in your layout's Auto Splitting Runtime settings (or on HK Split Maker).
- Change "Start Timer at:" from 0.000 to 21.760 in your splits settings
- You can also make splits starting from [this template on HK Split Maker](https://hksplitmaker.com/?game=silksong&builtin=blank-act1start)

**Other notes**
- This time was chosen to exactly match TAS (i.e. a perfect bind input) when going left. It loses 0.6 to TAS when going right.
- We have some concerns about this decision and aren't confident it will be the permanent solution. If autosave starts are disallowed in the future we will propose another method to skip the cutscenes, and runs using autosave starts prior to that change will be allowed to remain on the leaderboards.

::::

## 速通投稿

速通投稿相关目前参照[空洞骑士速通投稿](../hollowknight/speedrun-submit.md#速通投稿)即可，这里就不再进行翻译了。

帧率方面倒是有个值得注意的要求：

::: tabs

@tab 个人翻译

- 如果你在速通期间调整了垂直同步或者帧率限制的设置，你必须将FPS清晰地显示在你的录像中。

@tab 英文原文

- If you change either the VSync or Frame Rate Cap setting during the run, you must have a clearly visible FPS display in your recording.

:::

还有一些值得一提的内容，我列在这里：
- 允许降级至任何官方发布版本，但基于`public-beta`的版本仍被禁止
- 暂停规则将遵循《空洞骑士》的规则体系；任何进入第三幕的速通，在前三小时内可进行两次10分钟的暂停，三小时之后暂停次数无限制。更多信息请查阅[空洞骑士的中途暂停说明](../hollowknight/speedrun-submit.md#关于中途暂停)
- 不能安装任何Mod
- **不能使用屏幕分辨率超过 2:1 的超宽屏，并且你的整个游戏窗口都应当在你的录像中，不能进行裁剪**
- 一定要用新版的计时器，旧的wasm过图时会在屏幕还未完全变黑的情况下就暂停计时了
- Judgement（末日裁决者）速通类别**不是以打完末日裁决者作为结束**，而是应当在进入第二幕的过场动画后，弹出“任务目标变更”时结束

## 关于NMG

::: info 关于邪道

NMG是No Major Glitches的缩写，意为无主要邪道。游戏中的大部分bug和部分影响速通平衡的特性被定义为“邪道”，这是NMG规则中不被允许的。但是，到底哪些被算作是“邪道”，这很难有一个明确的定义。因此，《丝之歌》速通社区给出了定义，并且对有争议的内容进行了投票。

:::

::: tabs

@tab 个人翻译

若某项邪道未列入此列表，则默认禁止使用，直至其被正式收录。您可在Discord频道咨询管理员，或于论坛发帖确认。

任何意外触发且没有受益的主要邪道，可根据审核人员的判断酌情予以豁免。

@tab 英文原文

If a glitch is not listed here, assume it is banned until it is listed. You can check with a mod in the Discord or create a forum post.

Any accidentally performed major glitch that does not save time may be allowed by verifier's discretion.

:::

### 允许的邪道

::: tabs

@tab 个人翻译

- 下劈后摇取消
  - 跳跃 &rarr; 下劈 &rarr; 松开方向键（不输入任何方向），在落地前完成。此技巧能消除猎手纹章下劈攻击的落地后摇，从而让你能更早开始移动。
- 野兽蓄力斩
  - 使用野兽纹章时，在上升阶段释放蓄力斩。这能让你在向前突进的同时，获得显著的高度提升。
  - 如果你在下降阶段释放蓄力斩，则会导致蓄力斩的高度显著降低。*并且你会保持这个糟糕的蓄力斩，直到使用一次地面蓄力斩或者SL之后*。
- 缚丝冲刺刷新
  - 缚丝 &rarr; 缓冲输入冲刺。通过缓冲输入冲刺指令，即使你在空中已经用过了冲刺，也还能进行空中冲刺。
  - 注意：此技巧的实用性尚待进一步研究，我们将在后续对其重新评估。
- 工具下劈（掘洞钻/陷阱 + 电枢球，以及其它工具）
  - 投掷电枢球 &rarr; 在电枢球上方使用掘洞钻
  - 掘洞钻允许你在自己的电枢球上进行下劈跳跃。你可以在电枢球爆炸前使用上劈攻击电枢球，使其移动到更好的位置
- 隔墙打开开关（包括隔墙打开宝箱）

@tab 英文原文

- Pogo Endlag Cancels
    - Jump -> Attack -> Neutral (no directional input) before hitting the ground. Removes end lag from the Hunter's Crest pogo, allowing moving early.
- Beast Boosts
    - Using Beast Crest, Release Needlestrike while ascending. You gain a significant amount of height as you lunge forwards.
    - If you release while descending, you will get a version of the attack that gives you less height. *You will keep getting this worse version until you do a grounded needlestrike or save&quit*.
- Bind Dash Refresh
    - Bind -> Buffered Dash. Buffering a dash input allows you to dash even if you have exhausted your midair dash.
    - NB: this will revisited on at a later time, once we understand the extent of its utility.
- Tool Pogos (Drill/Snare w/ Voltvessels & others)
    - Throw Voltvessels > Use Delver's Drill above them
    - Delver's Drill allows you to pogo off your own Voltvessels. You can upslash the Voltvessel before it detonates to reposition it favourably.
- Lever Skips (including hitting chests through walls)

:::

### 禁止的邪道

::: tabs

@tab 个人翻译

- Deep Docks Bridge Hazard Respawn（不懂）
- 电枢球开启单向墙———从腐汁泽到管风琴的捷径
  - 电枢球的伤害可以击中单向墙的背面
- 通过以下方式跳过第四咏唱团
  - 完成披风任务 &rarr; 立即按ESC退出重进
  - 完成披风任务本应该进行一次自动存档，在自动存档前退出游戏重进，就回到了上一个椅子（如果你没在披风任务处坐椅子）。
- 特罗比奥skip，这里列举了两种不同的方式
  - 利用丝之矛存储进行特罗比奥skip（*下文有详细解释*）
  - 符文之怒skip
  - *文档中没有提到护佑钟skip，但已确定在最新的NMG规则禁止使用*
- 三段跳
  - 在下劈后的一个特定时间（取决于不同纹章）使用二段跳，会刷新两次二段跳，下劈本应该只刷新一次二段跳。
  - 如果无意中触发，不会被直接拒绝，而是给一个2秒的时间惩罚。
- Scuttlebrace Jump Reset（不懂）
- 浮空冲刺
  - 浮空后立即取消浮空，然后冲刺。你就可以在没有获得冲刺的情况下使用冲刺。
- 丝之矛存储（用于特罗比奥skip）
  - 在施展"丝之矛"技能的特定帧数，故意让一个"高伤害"陷阱击中自己。然后行走（待确认：是否必须行走？）至障碍物旁，大致站在 x=46.00 的位置，再次施展技能。此时，障碍物会受到错误方向的攻击判定。
- 任何导致出界的邪道
- 主菜单存储
- 房间复制
- 任何导致隐身的邪道
- 任何导致敌人AI变得无响应的邪道

@tab 英文原文

- Deep Docks Bridge Hazard Respawn
- Voltvessel One-way Wallbreak @ Bilewater->Ducts shortcut
    - The damage from Voltvessels can hit the backside of one-way breakable walls.
- Fourth Chorus Skip Skip
    - Hand in Flexile Spines quest -> Press pause immediately after finishing the dialogue
    - Avoids the hardsave when obtaining Drifter's Cloak, allowing you to save&quit to a bench before Fourth Chorus while keeping Drifter's Cloak.
- Trobbio Skips
    - Trobbio Skip - Silkspear Storage
    - Trobbio Skip - Rune Rage
- Triple Jump
    - Inputting wings at a specific time after pogoing, dependent on crest, gives 2 wings refreshes instead of one.
    - If accidental, a 2s penalty may be applied instead of rejection.
- Scuttlebrace Jump Reset
- Float Sprint
    - Float -> Cancel float & immediately dash. Allows you to airdash without sprint.
- Silkspear Storage
    - Get hit by a 'hard' hazard on a specific frame of the Silkspear animation. Walk (todo: required?) to the block & stand around x=46.00, then cast again. Block gets hit the wrong way.
- Any glitch that results in going Out of Bounds.
- Main Menu Storage
- Room Dupes
- Any glitch that results in invincibility
- Any glitch that results in enemy AI becoming unresponsive

:::
