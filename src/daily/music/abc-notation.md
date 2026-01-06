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
date: 2025-10-16
---

本篇主要介绍如何在网页上显示五线谱。这就要用到上个世纪一直延续至今的一种记谱法：**ABC记谱法**。首先我们来看一个例子：

```abc :no-line-numbers :no-collapsed-lines
Q:1/4=140
M:4/4
L:1/4
K:D
%%score { V:1 V:2 }
V:1
!mp! .d .a e3/2 e//f// | (g/f/e/d/ A>)F | .G .f c>d | !p!.[FA] .[DF] .[EG] .[FA] |
.B .a (c3/2 e///d///c///B///) | (A e !<(!^d3/2) e//f//!<)! | !mf! .Lg3/2 (g//f//) .=d .e | .d z z2 |
V:2
!p! A .D [Ac] .D | [DGA] .A, [DF] .A, [K:bass] | E, .[B,E] A, ([EA]/.A,/) | .D, .D, .E, .F, |
.G, .[DG] G, ([EA]/.G,/) | F, ([CE]/.F,/) ([B,A]/^D/ .F) | .L[F,G,B,=D] z .[A,CE] .[A,EG] | .[D,F,A,D] .A,, .D,, z | 
```

对应以下这个曲谱：

```component AbcNonation
notation: |
  Q:1/4=140
  M:4/4
  L:1/4
  K:D
  %%score { V:1 V:2 }
  V:1
  !mp! .d .a e3/2 e//f// | (g/f/e/d/ A>)F | .G .f c>d | !p!.[FA] .[DF] .[EG] .[FA] |
  .B .a (c3/2 e///d///c///B///) | (A e !<(!^d3/2) e//f//!<)! | !mf! .Lg3/2 (g//f//) .=d .e | .d z z2 |
  V:2
  !p! A .D [Ac] .D | [DGA] .A, [DF] .A, [K:bass] | E, .[B,E] A, ([EA]/.A,/) | .D, .D, .E, .F, |
  .G, .[DG] G, ([EA]/.G,/) | F, ([CE]/.F,/) ([B,A]/^D/ .F) | .L[F,G,B,=D] z .[A,CE] .[A,EG] | .[D,F,A,D] .A,, .D,, z | 
```

我们后续会花一些篇幅来详细介绍**ABC记谱法**。

<script setup>
import AbcNonation from "@AbcNonation";
</script>