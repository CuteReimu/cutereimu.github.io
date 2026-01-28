---
title: 速通社区新允许的Mod
isOriginal: true
icon: mug-hot
order: 48
category: 空洞骑士
tags:
  - 空洞骑士
  - 速通
date: 2025-12-31
article: false
---

以下内容来自《空洞骑士》速通社区公告。

截至目前，《空洞骑士》速通社区正在允许使用下方的这个 Mod 进行《空洞骑士》速通。但需注意几点：
1. 如果发现使用这些组件会带来在原版《空洞骑士》游戏中不存在的意外优势，那么利用这些优势的速通将根据严重程度被重新计时或拒绝，且在修复之前，该 Mod 将被禁用。我们希望这种情况不会发生，但我们想明确一点，仅仅因为我们已对这些组件进行了初步测试，并不意味着完全没有问题，我们也意识到存在一些漏洞的可能性。
2. 该组件允许用户设置配置变量。这些变量的允许设置如下：
   - **ScreenShakeModifier**（屏幕抖动） 可设置为`true`或`false`；
   - **FasterIntroSkip**（跳过报幕过场动画） 对于报幕过场动画不会计时的任何速通，可设置为`true`或`false`。对于报幕过场动画会计时的速通（例如全成就、Any%允许所有邪道），此项必须设置为`false`；
   - **MiniSaveStates** 应当设置为`false`，除非该速通类别允许使用 MiniSaveStates。

---

以下是来自速通社区的 peekawoo! 大佬提供的`Assembly-CSharp.dll`。你需要在将其**放入游戏目录覆盖同名文件**后（覆盖前记得先备份），先运行一次游戏后关闭，此时会在**存档目录**下生成一个`assemblyPatchesConfiguration.json`配置文件，根据自己的需要修改此配置文件后重新启动游戏即可生效。

peekawoo! 大佬表示，此 Mod 只是做了简单的测试，希望大家在使用前多多测试。此 Mod 只支持在 Windows 系统使用。

[::file:: 对应游戏1.4.3.2版本的`Assembly-CSharp.dll`](/dl/assembly1432/Assembly-CSharp.dll)\
[::file:: 对应游戏1.5.7.8版本的`Assembly-CSharp.dll`](/dl/assembly1578/Assembly-CSharp.dll)