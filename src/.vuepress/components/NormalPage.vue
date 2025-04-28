<template>
  <HopeNormalPage>
    <template #contentBefore>
      <LastUpdate />
    </template>
  </HopeNormalPage>
</template>

<script setup lang="ts">
import LastUpdate from './LastUpdate.vue';
import HopeNormalPage from "vuepress-theme-hope/components/NormalPage.js";
</script>

<style scoped>

</style>