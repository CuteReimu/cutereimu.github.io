import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
import { CSDN, LeetCode } from "./media.js";

import dotenv from 'dotenv';
import * as path2 from "node:path";

dotenv.config({path: path2.resolve(process.cwd(), '.env.local')});
dotenv.config();

export default hopeTheme({
  hostname: "https://cutereimu.cn",

  author: {
    name: "奇葩的灵梦",
    url: "https://cutereimu.cn",
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
    description: "超10年经验的资深服务端工程师，Go / Java / Kotlin / Erlang / C++ / Python / TypeScript / Vue 苦手",
    intro: "/intro.html",
    medias: {
      Email: "mailto:cutereimu@vip.qq.com",
      Github: "https://github.com/CuteReimu",
      BiliBili: "https://space.bilibili.com/1415334",
      力扣: {link: "https://leetcode.cn/u/FlyingLu/", icon: LeetCode},
      CSDN: {link: "https://blog.csdn.net/qq_44732921", icon: CSDN},
    },
  },

  editLink: false,
  lastUpdated: false,
  contributors: false,
  print: false,

  displayFooter: true,
  footer: process.env.VITE_FOOTER,
  license: "MIT",

  markdown: {
    sup: true,
    imgSize: true,

    codeTabs: true,

    math: {
      type: "katex",
    },

    mermaid: true,

    highlighter: {
      type: "shiki",
      collapsedLines: 20,
      lineNumbers: 4,
      notationWordHighlight: true,
      notationErrorLevel: true,
    },

    stylize: [
      {
        matcher: /^./,
        replacer: ({ tag, attrs, content }) => {
          if (tag === "em")
            return {
              tag: tag,
              attrs: { ...attrs, style: "color: #777" },
              content: content,
            };
          else if (tag === "s")
            return {
              tag: tag,
              attrs: { ...attrs, style: "color: #999" },
              content: content,
            };
        },
      },
    ],

    linksCheck: {
      build: "error",
    }
  },

  // 在这里配置主题提供的插件
  plugins: {
    git: true,
    blog: true,

    icon: {
      assets: "fontawesome-with-brands",
    },

    copyright: {
      author: "",
      global: true,
      license: "",
    },

    components: {
      components: ["Share"],
    },
  },
}, { custom: true });
