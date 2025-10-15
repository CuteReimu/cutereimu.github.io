---
title: 空洞骑士主题曲
icon: music
order: -200
date: 2025-10-11
category: 空洞骑士
tags:
  - 空洞骑士
head:
  - - script
    - src: https://unpkg.com/abcjs@6.5.2/dist/abcjs-basic-min.js
  - - link
    - rel: stylesheet
      type: text/css
      href: https://unpkg.com/abcjs@6.5.2/abcjs-audio.css
article: false
---

```component AbcNonation
notation: |
  X:1
  T:Hollow Knight Main Theme
  C:Christopher Larkin
  Q:1/4=55
  M:3/4
  L:1/8
  K:Eb
  %%score { V:1 V:2 }
  V:1
  (c2 c2 de | d6) | (cG A2 GF | G6) | (c2 c2 de | f6) |
  (ge dc B2 | c6) | z8 | ([Cc]2 [Cc]2 [Dd][Ee] | [Dd]6) |
  ([Cc][G,G] [A,A]2 [G,G][F,F] | [G,G]6) | ([Cc]2 [Cc]2 [Dd][Ee] | [Ff]4) z ([Gg]/2[Aa]/2 | [Gg]2 [Ee]3 [B,B] |
  [Cc]2 [B,B]3 F | G2) C4 | [g']6- | [g']2 G4- | G4 z (=B |
  =B6 | c4 (3zde | f6) | g4 Hb2 | [Hc']6 |]
  V:2
  CG A4 | CF G4 | CE F4 | CD ED [B,]2 | CG A4 | B,G F4 |
  A,E F4 | F,B, CF CB, | [!arpeggio!F,=A,CF]4 \
  K:bass
  E,2 | C,G, A,4 | C,F, G,4 |
  C,E, F,2 z2 | B,,E, D,2 B,,2 | A,,E, F,4 | F,,C, F,G, A,C | E,,C, E,G, C2 |
  A,,E, B,,F, D,2 | C,G, A,G, A,G, | C,F, G,F, G,F, | C,E, F,E, F,E, | [!arpeggio!F,,B,,D,]2 F,,2 [B,,D,]2 |
  C,G, A,G, A,G, | C,F, G,F, G,F, | C,E, F,E, F,E, | B,,D, F,B, HD2 | HC6 |]
```

<script setup>
import AbcNonation from "@AbcNonation";
</script>