import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://cutereimu.github.io",

  author: {
    name: "奇葩の灵梦",
    url: "https://github.com/CuteReimu",
  },

  logo: "https://avatars.githubusercontent.com/CuteReimu?v=4",
  favicon: "https://avatars.githubusercontent.com/CuteReimu?v=4",

  darkmode: "toggle",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 博客相关
  blog: {
    description: "Go / Java / Kotlin / Erlang / C++ / Python / TypeScript / Vue 苦手",
    intro: "/intro.html",
    medias: {
      Github: "https://github.com/CuteReimu",
      BiliBili: "https://space.bilibili.com/1415334",
      Email: "mailto:cutereimu@vip.qq.com"
    },
  },

  breadcrumb: false,
  editLink: false,
  lastUpdated: false,
  contributors: false,
  print: false,

  markdown: {
    sup: true,
    imgSize: true,

    math: {
      type: "katex",
    },

    mermaid: true,

    highlighter: {
      type: "shiki",
      collapsedLines: 15,
    },
  },

  // 在这里配置主题提供的插件
  plugins: {
    blog: true,

    icon: {
      assets: "fontawesome",
    },

    redirect: false,
  },
});
