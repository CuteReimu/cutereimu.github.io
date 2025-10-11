import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

import theme from "./theme.js";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
  alias: {
    "@AbcNonation": path.resolve(__dirname, "components/AbcNonation.vue"),
  },
  base: "/",

  lang: "zh-CN",
  title: "奇葩的灵梦的个人空间",
  description: "超10年经验的资深游戏服务端工程师，Go / Java / Kotlin / Erlang / C++ / Python / TypeScript / Vue 苦手",

  theme,
});
