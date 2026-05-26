<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { getProductDetail } from "@/api/catalog";
import { useThemeStore } from "@/stores/theme";

const theme = useThemeStore();
const detail = ref<Record<string, any>>({});

onLoad(async (query = {}) => {
  detail.value = await getProductDetail(Number(query.id));
});

function displayPrice() {
  if (detail.value.priceText) return detail.value.priceText;
  return `¥${detail.value.startPrice || detail.value.price || 0}`;
}

function submitInquiry() {
  uni.navigateTo({
    url: `/pages/inquiries/create?sourceType=product&sourceId=${detail.value.id}&title=${encodeURIComponent(detail.value.title || "")}`
  });
}
</script>

<template>
  <view class="page" :style="theme.cssVars">
    <image class="cover" :src="detail.coverUrl || 'https://dummyimage.com/750x420/e5e7eb/6b7280&text=Product'" mode="aspectFill" />
    <view class="card detail">
      <text class="title">{{ detail.title }}</text>
      <text class="subtitle">{{ detail.subtitle }}</text>
      <text class="price">{{ displayPrice() }}</text>
      <view class="meta">{{ detail.techStack }}</view>
    </view>

    <view class="card block">
      <text class="block-title">功能介绍</text>
      <text class="content">{{ detail.featureIntro || "暂无介绍" }}</text>
    </view>
    <view class="card block">
      <text class="block-title">交付内容</text>
      <text class="content">{{ detail.deliveryContent || "管理员确认收款后安排交付" }}</text>
    </view>
    <view class="fixed-bar">
      <button class="btn-primary" @tap="submitInquiry">提交购买意向</button>
    </view>
  </view>
</template>

<style scoped>
.cover {
  width: 100%;
  height: 360rpx;
  border-radius: 16rpx;
  background: #eef2f7;
}
.detail {
  margin-top: 20rpx;
}
.title {
  display: block;
  font-size: 38rpx;
  font-weight: 800;
}
.subtitle,
.meta,
.content {
  display: block;
  margin-top: 12rpx;
  color: var(--theme-muted);
  line-height: 1.7;
}
.price {
  display: block;
  margin-top: 18rpx;
  color: var(--theme-error);
  font-size: 36rpx;
  font-weight: 800;
}
.block {
  margin-top: 20rpx;
}
.block-title {
  font-weight: 700;
  font-size: 30rpx;
}
.fixed-bar {
  position: sticky;
  bottom: 0;
  padding: 20rpx 0;
  background: var(--theme-page-bg);
}
button {
  width: 100%;
}
</style>
