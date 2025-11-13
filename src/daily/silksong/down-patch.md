---
title: 丝之歌如何回退版本
icon: code-compare
order: 15
category: 丝之歌
tags:
  - 丝之歌
date: 2025-11-13
article: false
author:
  - SclicheD
  - name: hk-speedrunning
    url: https://github.com/hk-speedrunning
  - name: 奇葩的灵梦
    url: https://cutereimu.cn
toc: false
---

## 降版本方法

1. 按 `Win+R` 打开 `cmd` 窗口
2. 输入 `steam://open/console` 并确定
3. 进入 steam 控制台，在下方输入

```bash
download_depot 1030300 版本补丁号
```

比如要下载1.0.28324版本，那就输入

```bash
download_depot 1030300 1030301 3229726349000518284
```

4. 回车，等待下载
5. 完成后在控制台上找到显示的文件地址，并打开
6. 把 `steam_appid.txt` 文件放进 `depot_103031` 文件夹中（文件内写入 `1030300`）
7. 在 steam 中找到“添加非steam游戏”
8. 浏览
9. 选中 `depot_103031` 文件夹中带有丝之歌图标的 Hollow Knight Silksong.exe
10. 以上步骤结束后就可以在 steam 里使用旧版本了

## 目前已发布版本

### 1.0.28324

AKA Release Patch.

- Windows: `1030301 3229726349000518284`
- MacOS: `1030302 1365730835793684614`
- Linux: `1030303 8384590172287463475`

### 1.0.28497

- Windows: `1030301 539129767115354441`
- MacOS: `1030302 8670159430480702509`
- Linux: `1030303 6701825740120558137`

### 1.0.28561

- Windows: `1030301 8642535143474926050`
- MacOS: `1030302 9022715293716759452`
- Linux: `1030303 6373658714389144408`

### 1.0.28650

- Windows: `1030301 3900764848237536293`
- MacOS: `1030302 7832939953657548180`
- Linux: `1030303 7495630131038458486`

### 1.0.28714

- Windows: `1030301 5977483240701257214`
- MacOS: `1030302 7917356342743942630`
- Linux: `1030303 1617544312110692774`

### 1.0.28891

- Windows: `1030301 3690203822520536668`
- MacOS: `1030302 2374057204384257562`
- Linux: `1030303 5954103139200615141`

### 1.0.29242

AKA Latest Patch. This is the currently live version on Steam.

- Windows: `1030301 426651197780377263`
- MacOS: `1030302 2058007571598677908`
- Linux: `1030303 8078874762924599313`
