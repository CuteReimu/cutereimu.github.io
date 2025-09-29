---
title: 丝之歌速通投稿问题
icon: book
order: 3
date: 2025-09-27
category: 丝之歌
tags:
  - 丝之歌
  - 速通
lastUpdated: true
toc: false
isOriginal: true
copy: false
---

本篇主要介绍 [speedrun.com 上面《丝之歌》游戏](https://www.speedrun.com/zh-CN/silksong)的投稿问题和NMG规则。

丝之歌排行榜的投稿将于2025年10月1日正式开放。

::: warning 注意

规则的英文原文见：[https://github.com/hk-speedrunning/Silksong-Rules](https://github.com/hk-speedrunning/Silksong-Rules)

本文旨在帮助国内速通玩家了解速通投稿规则，难免有翻译错误，**最终请以英文原文为准**。在**每一段右下角有个小按钮**可以展开查看英文原文，方便比对。

规则随时可能变化，但**本文档更新可能滞后，最终请以上方链接的英文原文为准**。

:::

<!-- more -->

## 速通投稿

速通投稿相关目前参照[空洞骑士速通投稿](../hollowknight/speedrun-submit.md#速通投稿)即可，仅中途暂停规则有一些区别：仅限进入第三幕的速通项目允许暂停，前三小时允许2次不超过10分钟的暂停，如何暂停请参照[空洞骑士的中途暂停说明](../hollowknight/speedrun-submit.md#关于中途暂停)，这里就不再进行翻译了。

## 关于NMG

::: info 关于邪道

NMG是No Major Glitches的缩写，意为无主要邪道。游戏中的大部分bug和部分影响速通平衡的特性被定义为“邪道”，这是NMG规则中不被允许的。但是，到底哪些被算作是“邪道”，这很难有一个明确的定义。因此，《丝之歌》速通社区给出了定义，并且对有争议的内容进行了投票。

:::

<VPPreview>
<template #code>

```md :no-line-numbers
If a glitch is not listed here, assume it is banned until it is listed. You can check with a mod in the Discord or create a forum post.

Any accidentally performed major glitch that does not save time may be allowed by verifier's discretion.
```

</template>
<template #content>

若某项邪道未列入此列表，则默认禁止使用，直至其被正式收录。您可在Discord频道咨询管理员，或于论坛发帖确认。

任何意外触发且未缩短通关时间的主要邪道，可根据审核人员的酌情判断予以豁免。

</template>
</VPPreview>

### 允许的邪道

<VPPreview title="允许的邪道">
<template #code>

```md :no-line-numbers
- Pogo Endlag Cancels
  - Jump -> Attack -> Neutral (no directional input) before hitting the ground. Removes end lag from the Hunter's Crest pogo, allowing moving early.
- Beast Boosts
  - Using Beast Crest, Release Needlestrike while ascending. You gain a significant amount of height as you lunge forwards.
  - If you release while descending, you will get a version of the attack that gives you less height. *You will keep getting this worse version until you do a grounded needlestrike or save&quit*.
- Bind Dash Refresh
  - Bind -> Buffered Dash. Buffering a dash input allows you to dash even if you have exhausted your midair dash.
  - NB: this will revisited on at a later time, once we understand the extent of its utility.
```
    
</template>
<template #content>

- 下劈后摇取消
  - 跳跃 &rarr; 下劈 &rarr; 松开方向键（不输入任何方向），在落地前完成。此技巧能消除猎手纹章下劈攻击的落地后摇，从而让你能更早开始移动。
- 野兽蓄力斩
  - 使用野兽纹章时，在上升阶段释放蓄力斩。这能让你在向前突进的同时，获得显著的高度提升。
  - 如果你在下降阶段释放蓄力斩，则会获得让你的蓄力斩的高度显著降低。*并且你会保持这个糟糕的蓄力斩，直到使用一次地面蓄力斩或者SL之后*。
- 缚丝冲刺刷新
  - 缚丝 &rarr; 缓冲输入冲刺。通过缓冲输入冲刺指令，即使你在空中已经用过了冲刺，也还能进行空中冲刺。
  - 注意：此技巧的实用性尚待进一步研究，我们将在后续对其重新评估。

</template>
</VPPreview>

### 禁止的邪道

<VPPreview title="投票后被禁止的邪道">
<template #code>

```md :no-line-numbers
- Triple Jump
  - Inputting wings at a specific time after pogoing, dependent on crest, gives 2 wings refreshes instead of one.
  - If accidental, a 2s penalty may be applied instead of rejection.
- Scuttlebrace Jump Reset
- Float Sprint
  - Float -> Cancel float & immediately dash. Allows you to airdash without sprint.
- Volt Vessel Skips
  - NB: this will be revisited at a later time.
```

</template>
<template #content>

- 三段跳
  - 在下劈后的一个特定时间（取决于不同纹章）使用二段跳，会刷新两次二段跳，下劈本应该只刷新一次二段跳。
  - 如果无意中触发，不会被直接拒绝，而是给一个2秒的时间惩罚。
- 舷窗支架跳跃重置
- 浮空冲刺
  - 浮空后立即取消浮空，然后冲刺。你就可以在没有获得冲刺的情况下使用冲刺。
- 电枢球skip
  - 注意：这个邪道会在将来重新评估。

</template>
</VPPreview>

<VPPreview title="显然被禁止的邪道">
<template #code>

```md :no-line-numbers
- Silkspear Storage
  - Get hit by a 'hard' hazard on a specific frame of the Silkspear animation. Walk (todo: required?) to the block & stand around x=46.00, then cast again. Block gets hit the wrong way.
- Any glitch that results in going Out of Bounds.
- Main Menu Storage
- Room Dupes
- Any glitch that results in invincibility
- Any glitch that results in enemy AI becoming unresponsive
```

</template>
<template #content>

- 丝之矛存储（用于特罗比奥skip）
  - 在施展"丝之矛"技能的特定帧数，故意让一个"高伤害"陷阱击中自己。然后行走（待确认：是否必须行走？）至障碍物旁，大致站在 x=46.00 的位置，再次施展技能。此时，障碍物会受到错误方向的攻击判定。
- 任何导致出界的邪道
- 主菜单存储
- 房间复制
- 任何导致隐身的邪道
- 任何导致敌人AI变得无响应的邪道

</template>
</VPPreview>

<style scoped>
.shiki {
  text-wrap: auto;
}
</style>