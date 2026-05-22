import { defineClientConfig } from "vuepress/client";
import "vuepress-theme-hope/presets/bounce-icon.scss";
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

function syncElDarkClass() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
}

export default defineClientConfig({
  setup() {
    if (typeof window !== 'undefined') {
      syncElDarkClass();
      const observer = new MutationObserver(syncElDarkClass);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
  },
});