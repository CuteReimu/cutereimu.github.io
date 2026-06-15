declare module "@theme-hope/components/blog/ArticleItem" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{ info: any; path: string }>;
  export default component;
}

declare module "@theme-hope/components/blog/Pagination" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{
    current: number;
    perPage: number;
    total: number;
  }>;
  export default component;
}

declare module "@theme-hope/components/transitions/DropTransition" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{ appear?: boolean; delay?: number }>;
  export default component;
}

declare module "@theme-hope/components/base/PageContent" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}>;
  export default component;
}

declare module "@theme-hope/composables/blog/useBlogLocale" {
  import type { ComputedRef } from "vue";
  export function useBlogLocale(): ComputedRef<{
    empty: string;
    article: string;
    [key: string]: string;
  }>;
}

declare module "@theme-hope/composables/blog/useBlogOptions" {
  import type { ComputedRef } from "vue";
  export function useBlogOptions(): ComputedRef<{
    articlePerPage?: number;
    [key: string]: any;
  }>;
}
