<script setup lang="ts">
import type { ProductSummary, ServiceSummary } from "@source-shop/shared";

defineProps<{ item: ProductSummary | ServiceSummary; type: "product" | "service" }>();

function go(id: number, type: "product" | "service") {
  uni.navigateTo({ url: `/pages/${type === "product" ? "products" : "services"}/detail?id=${id}` });
}

function displayName(item: ProductSummary | ServiceSummary) {
  return "title" in item ? item.title : item.name;
}

function displayDesc(item: ProductSummary | ServiceSummary, type: "product" | "service") {
  if (item.subtitle) return item.subtitle;
  if (type === "product") return (item as ProductSummary).techStack || "可咨询详情";
  return (item as ServiceSummary).servicePeriod || "可咨询详情";
}

function displayPrice(item: ProductSummary | ServiceSummary) {
  if (item.priceText) return item.priceText;
  if ("price" in item && item.price) return `￥${item.price}`;
  return `￥${item.startPrice || 0} 起`;
}
</script>

<template>
  <view class="card product-card" @tap="go(item.id, type)">
    <image class="cover" :src="item.coverUrl || 'https://dummyimage.com/300x200/e5e7eb/6b7280&text=Source'" mode="aspectFill" />
    <view class="body">
      <text class="name">{{ displayName(item) }}</text>
      <text class="desc">{{ displayDesc(item, type) }}</text>
      <view class="bottom">
        <text class="price">{{ displayPrice(item) }}</text>
        <text class="tag">{{ type === "product" ? "源码" : "服务" }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.product-card {
  display: flex;
  gap: 20rpx;
  margin-bottom: 18rpx;
}
.cover {
  width: 180rpx;
  height: 132rpx;
  border-radius: 8rpx;
  background: #eef2f7;
}
.body {
  flex: 1;
  min-width: 0;
}
.name {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: var(--theme-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.desc {
  display: block;
  margin-top: 10rpx;
  color: var(--theme-muted);
  font-size: 24rpx;
  line-height: 1.5;
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14rpx;
}
.price {
  color: var(--theme-error);
  font-weight: 700;
}
.tag {
  color: var(--theme-primary);
  font-size: 22rpx;
}
</style>
