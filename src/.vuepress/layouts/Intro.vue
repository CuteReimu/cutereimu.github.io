<script setup lang="ts">
import { Layout } from "vuepress-theme-hope/client";
import PageContent from "@theme-hope/components/base/PageContent";
import { InfoPanel } from "vuepress-theme-hope/blog";
</script>

<template>
  <Layout>
    <template #default>
      <div class="vp-page vp-intro-page">
        <div class="blog-page-wrapper">
          <PageContent />
          <InfoPanel key="blog" />
        </div>
      </div>
    </template>
  </Layout>
</template>
