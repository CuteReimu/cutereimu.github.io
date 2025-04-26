import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "奇葩の灵梦的个人空间",
  description: "Go / Java / Kotlin / Erlang / C++ / Python / TypeScript / Vue 苦手",

  theme,
});
