<template>
  <Layout>
    <template #contentBefore>
      <div v-if="lastUpdated" class="update-time">
        {{ lastUpdated.locale }}
        <time :datetime="lastUpdated.iso.split(' ')[0]" data-allow-mismatch>
          {{ lastUpdated.text.split(' ')[0] }}
        </time>
      </div>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import {usePageFrontmatter} from "vuepress/client";
import {useLastUpdated} from "@vuepress/plugin-git/client";
import { Layout } from "vuepress-theme-hope/client";

const frontmatter = usePageFrontmatter();
const lastUpdated = useLastUpdated(() => frontmatter.value.lastUpdated as boolean ?? true);
</script>

<style scoped>
.update-time {
  font-weight: 400;
  font-style: italic;
  color: #8d8d8f;
  padding-top: 0.25rem;
  margin: 0;
  font-size: 0.8334em;
  text-align: right;
  line-height: 0;
}
</style>