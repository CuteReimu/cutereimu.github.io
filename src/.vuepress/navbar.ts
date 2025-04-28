import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/programming/",
  {
    text: "日常随记",
    icon: "pencil",
    link: "/daily/hollowknight/",
    prefix: "/daily/",
  },
]);
