---
title: ABC记谱法
icon: font
order: 1
category: 音乐
tags:
  - 音乐
article: false
head:
  - - script
    - src: https://unpkg.com/abcjs@6.5.2/dist/abcjs-basic-min.js
  - - link
    - rel: stylesheet
      type: text/css
      href: https://unpkg.com/abcjs@6.5.2/abcjs-audio.css
---

本篇主要介绍如何在网页上显示五线谱。这就要用到上个世纪一直延续至今的一种记谱法：**ABC记谱法**。首先我们来看一个例子：

```abc :no-line-numbers
Q:1/4=120
M:C
L:1/4
K:C
e>d e c | g a g2 | a>g e g | d e d2 |
g e g2 | c' g a2 | g a e2 | d e c2 |]
```

对应以下这个曲谱：

```component AbcNonation
notation: |
  Q:1/4=120
  M:C
  L:1/4
  K:C
  e>d e c | g a g2 | a>g e g | d e d2 |
  g e g2 | c' g a2 | g a e2 | d e c2 |]
```

我们后续会花一些篇幅来详细介绍**ABC记谱法**。

<script setup>
import AbcNonation from "@AbcNonation";
</script>