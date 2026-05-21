<script setup lang="ts">
defineProps<{ title: string; moreText?: string }>();
defineEmits<{ more: [] }>();
</script>

<template>
  <view class="section-title">
    <text class="title">{{ title }}</text>
    <text v-if="moreText" class="more" @tap="$emit('more')">{{ moreText }}</text>
  </view>
</template>

<style scoped>
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 28rpx 0 16rpx;
}
.title {
  font-size: 34rpx;
  font-weight: 700;
}
.more {
  color: var(--theme-primary);
  font-size: 26rpx;
}
</style>
