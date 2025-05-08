import { defineClientConfig } from "vuepress/client";
import Layout from "./layouts/Layout.vue";
import { setupRunningTimeFooter } from "vuepress-theme-hope/presets/footerRunningTime.js";
import "vuepress-theme-hope/presets/bounce-icon.scss";

export default defineClientConfig({
  // 你可以在这里添加或覆盖布局
  layouts: {
    Layout: Layout,
  },
  setup() {
    setupRunningTimeFooter(
      new Date("2025-05-01"),
      {
        "/": "已运行 :day 天 :hour 小时 :minute 分钟 :second 秒",
      },
      true,
    );
  },
});