import { defineClientConfig } from "vuepress/client";
import "vuepress-theme-hope/presets/bounce-icon.scss";
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus';
import Intro from "./layouts/Intro.vue";

function syncElDarkClass() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
}

export default defineClientConfig({
  layouts: {
    Intro
  },
  enhance({ app }) {
    app.provide(ID_INJECTION_KEY, { prefix: Math.floor(Math.random() * 100000000), current: 0 });
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 });
  },
  setup() {
    if (typeof window !== 'undefined') {
      syncElDarkClass();
      const observer = new MutationObserver(syncElDarkClass);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
  },
});