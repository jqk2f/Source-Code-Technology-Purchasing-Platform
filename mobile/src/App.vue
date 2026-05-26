<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style>
html,
body,
#app {
  min-height: 100%;
}

body {
  margin: 0;
  background: var(--theme-page-bg);
  color: var(--theme-text);
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
}

* {
  box-sizing: border-box;
}
</style>
