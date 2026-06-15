<template>
  <div id="article-list" class="vp-article-list" role="feed">
    <template v-if="currentArticles.length > 0">
      <div
          ref="containerRef"
          class="masonry-container"
          :style="{
          position: 'relative',
          height: containerHeight != null ? `${containerHeight}px` : undefined,
        }"
      >
        <div
            v-for="({ info, path }, index) in currentArticles"
            :key="path"
            :ref="(el) => setItemRef(el, index)"
            class="masonry-item"
            :style="
            itemPositions[index]
              ? {
                  position: 'absolute',
                  left: `${itemPositions[index].left}px`,
                  top: `${itemPositions[index].top}px`,
                  width: `${itemPositions[index].width}px`,
                }
              : { visibility: 'hidden' }
          "
        >
          <DropTransition :appear="true" :delay="index * 0.04">
            <ArticleItem :info="info" :path="path">
              <template v-for="(_, name) in $slots" #[name]="slotData">
                <slot :name="name" v-bind="slotData ?? {}" />
              </template>
            </ArticleItem>
          </DropTransition>
        </div>
      </div>
      <Pagination
          :current="currentPage"
          :per-page="articlePerPage"
          :total="items.length"
          @update-current-page="updatePage"
      />
    </template>
    <h2 v-else class="vp-empty-hint">
      {{ blogLocale.empty.replace("$text", blogLocale.article.toLocaleLowerCase()) }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vuepress/client";
import ArticleItem from "@theme-hope/components/blog/ArticleItem";
import Pagination from "@theme-hope/components/blog/Pagination";
import DropTransition from "@theme-hope/components/transitions/DropTransition";
import { useBlogLocale } from "@theme-hope/composables/blog/useBlogLocale";
import { useBlogOptions } from "@theme-hope/composables/blog/useBlogOptions";

const DEFAULT_ARTICLES_PER_PAGE = 10;
const GAP = 16;
const BREAKPOINT = 612;

const props = defineProps<{
  items: Array<{ info: any; path: string }>;
}>();

const route = useRoute();
const router = useRouter();
const blogLocale = useBlogLocale();
const blogOptions = useBlogOptions();

const currentPage = ref(1);
const articlePerPage = computed(
  () => blogOptions.value.articlePerPage ?? DEFAULT_ARTICLES_PER_PAGE
);
const currentArticles = computed(() =>
  props.items.slice(
    (currentPage.value - 1) * articlePerPage.value,
    currentPage.value * articlePerPage.value
  )
);

// --- Masonry ---

interface ItemPos {
  left: number;
  top: number;
  width: number;
}

const containerRef = ref<HTMLElement | null>(null);
const itemEls = ref<(HTMLElement | null)[]>([]);
const itemPositions = ref<ItemPos[]>([]);
const containerHeight = ref<number | null>(null);

const setItemRef = (el: unknown, index: number) => {
  itemEls.value[index] = el as HTMLElement | null;
};

const computeMasonry = () => {
  const container = containerRef.value;
  if (!container) return;
  const w = container.clientWidth;
  if (!w) return;

  const cols = w < BREAKPOINT ? 1 : 2;
  const colWidth = (w - GAP * (cols - 1)) / cols;
  const colHeights = Array<number>(cols).fill(0);
  const positions: ItemPos[] = [];

  for (const el of itemEls.value) {
    if (!el) continue;
    const h = el.offsetHeight;
    const minH = Math.min(...colHeights);
    const col = colHeights.indexOf(minH);
    positions.push({ left: col * (colWidth + GAP), top: colHeights[col], width: colWidth });
    colHeights[col] += h + GAP;
  }

  itemPositions.value = positions;
  containerHeight.value = Math.max(...colHeights, 0) - GAP;
};

let ro: ResizeObserver | null = null;

const setupObserver = () => {
  ro?.disconnect();
  ro = new ResizeObserver(computeMasonry);
  if (containerRef.value) ro.observe(containerRef.value);
  for (const el of itemEls.value) {
    if (el) ro.observe(el);
  }
};

watch(currentArticles, async () => {
  itemEls.value = [];
  itemPositions.value = [];
  containerHeight.value = null;
  await nextTick();
  setupObserver();
  computeMasonry();
});

onMounted(async () => {
  await nextTick();
  setupObserver();
  computeMasonry();
});

onUnmounted(() => {
  ro?.disconnect();
});

// --- Pagination ---

const updatePage = async (page: number) => {
  currentPage.value = page;
  const query = { ...route.query };
  const needUpdate = !(
    query.page === page.toString() ||
    (page === 1 && !query.page)
  );
  if (needUpdate) {
    if (page === 1) delete query.page;
    else query.page = page.toString();
    await router.push({ path: route.path, query });
  }
};

onMounted(() => {
  const { page } = route.query;
  void updatePage(page ? Number(page) : 1);
  watch(currentPage, () => {
    const el = document.querySelector("#article-list");
    if (!el) return;
    const distance = el.getBoundingClientRect().top + window.scrollY;
    setTimeout(() => window.scrollTo(0, distance), 100);
  });
});
</script>