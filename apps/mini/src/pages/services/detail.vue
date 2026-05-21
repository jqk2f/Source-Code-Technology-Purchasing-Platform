<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
import { getServiceDetail } from "@/api/catalog";
import { useThemeStore } from "@/stores/theme";

const theme = useThemeStore();
const detail = ref<Record<string, any>>({});

onLoad(async (query = {}) => {
  detail.value = await getServiceDetail(Number(query.id));
});

function submitInquiry() {
  uni.navigateTo({
    url: `/pages/inquiries/create?sourceType=service&sourceId=${detail.value.id}&title=${encodeURIComponent(detail.value.name || "")}`
  });
}
</script>

<template>
  <view class="page" :style="theme.cssVars">
    <view class="card">
      <text class="title">{{ detail.name }}</text>
      <text class="subtitle">{{ detail.subtitle }}</text>
      <text class="price">{{ detail.priceText || `￥${detail.startPrice || 0} 起` }}</text>
    </view>
    <view class="card block">
      <text class="block-title">服务范围</text>
      <text class="content">{{ detail.serviceScope || "提交预约后管理员确认服务范围" }}</text>
    </view>
    <view class="card block">
      <text class="block-title">交付标准</text>
      <text class="content">{{ detail.deliveryStandard || "按订单确认内容交付" }}</text>
    </view>
    <button class="btn-primary submit" @tap="submitInquiry">预约服务</button>
  </view>
</template>

<style scoped>
.title {
  display: block;
  font-size: 38rpx;
  font-weight: 800;
}
.subtitle,
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
  font-size: 34rpx;
  font-weight: 800;
}
.block {
  margin-top: 20rpx;
}
.block-title {
  font-weight: 700;
}
.submit {
  margin-top: 28rpx;
  width: 100%;
}
</style>
