import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
import { CSDN, LeetCode } from "./media.js";
import langs from "./highlighter.js";

import dotenv from 'dotenv';
import * as path2 from "node:path";

dotenv.config({path: path2.resolve(process.cwd(), '.env.local'), override: true});
dotenv.config();

export default hopeTheme({
  hostname: "https://cutereimu.cn",

  author: {
    name: "奇葩的灵梦",
    url: "https://cutereimu.cn",
    email: "cutereimu@vip.qq.com",
  },

  logo: "/CuteReimu.jpg",
  favicon: "/CuteReimu.jpg",

  darkmode: "toggle",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 博客相关
  blog: {
    description: "超10年经验的资深游戏服务端工程师，Go / Java / Kotlin / Erlang / C++ / Python / TypeScript / Vue 苦手",
    intro: "/intro.html",
    medias: {
      Email: "mailto:cutereimu@vip.qq.com",
      Github: "https://github.com/CuteReimu",
      BiliBili: "https://space.bilibili.com/1415334",
      力扣: {link: "https://leetcode.cn/u/FlyingLu/", icon: LeetCode},
      CSDN: {link: "https://blog.csdn.net/qq_44732921", icon: CSDN},
    },
    timeline: "行到水穷处，坐看云起时",
  },

  locales: {
    "/": {
      metaLocales: {
        origin: "个人翻译",
      },
    },
  },

  editLink: false,
  lastUpdated: false,
  contributors: false,
  print: false,

  footer: process.env.VITE_FOOTER,
  license: "CC BY-SA 4.0",

  copyright: '© 2025 奇葩的灵梦 | 基于 <a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="noopener noreferrer" target="_blank">CC BY-SA 4.0</a> 共享',

  markdown: {
    sup: true,
    imgSize: true,

    spoiler: true,

    codeTabs: true,

    math: {
      type: "katex",
    },

    mermaid: true,

    highlighter: {
      type: "shiki",
      langs,
      collapsedLines: 15,
      lineNumbers: 4,
      whitespace: true,
      notationWordHighlight: true,
      notationErrorLevel: true,
      notationDiff: true,
      themes: {
        light: "github-light-default",
        dark: "github-dark-default",
      },
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
    blog: true,

    icon: {
      assets: "/@fortawesome/fontawesome-free@6/js/all.min.js",
    },

    copyright: {
      global: true,
      locales: {
        "/": {
          author: "作者：:author"
        },
      }
    },

    components: {
      components: ["Badge", "VPCard"],
    }
  },
});
