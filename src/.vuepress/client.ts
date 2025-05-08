import { defineClientConfig } from "vuepress/client";
import Layout from "./layouts/Layout.vue";

export default defineClientConfig({
  // 你可以在这里添加或覆盖布局
  layouts: {
    Layout: Layout,
  },
});