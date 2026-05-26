<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
  }>(),
  {
    title: "暂无数据",
    description: "当前模块还没有可展示内容"
  }
);
</script>

<template>
  <van-empty image="search" :description="description">
    <template #default>
      <div class="empty-title">{{ title }}</div>
    </template>
  </van-empty>
</template>

<style scoped>
.empty-title {
  color: var(--theme-text);
  font-weight: 700;
}
</style>
