---
title: 速通社区关于快递Mod的公告
isOriginal: true
icon: mug-hot
order: 16
category: 丝之歌
tags:
  - 丝之歌
  - 速通
date: 2026-05-15
article: false
author:
  - name: Sad小杰
    url: https://space.bilibili.com/1336917935
---

以下内容来自《空洞骑士》速通社区公告。

28891 之前版本的快递任务中，可能会刷新已经送完的快递的 RNG，这将导致在真结局速通中可能由于糟糕的 RNG 导致前一个小时的努力全部浪费，28891 之后的版本修复了这个问题。

社区投票决定同意在 28891 之前的版本使用 Mod 来修复这个 RNG 问题，但需注意：这个 Mod 是 beta 版本，因此如果后续发现有问题可能会导致记录不过审。

该 Mod 不可与 BepInEx 共存，所以如果需要同时使用 Debug Mod 进行练习，建议自行安装两个不同版本的丝之歌，一个用于安装 Debug Mod 进行练习，另一个用于安装此 Mod 进行速通。

具体步骤：
1. [点击这里下载【快递补丁beta.zip】](/dl/快递补丁beta.zip)，然后将其解压
2. 在 Steam 中右键丝之歌 &rarr; 管理 &rarr; 浏览本地文件，打开游戏目录。将上述解压后的文件拖进游戏根目录，然后启动游戏，之后你会看到左上角显示 speedpatchV0.10
3. 回到游戏的文件夹找到`hksr_patches.json`然后把`CourierRNGFix`改成`true`
