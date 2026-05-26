<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { ProductSummary, ServiceSummary } from "@source-shop/shared";
import SectionTitle from "@/components/SectionTitle.vue";
import ProductCard from "@/components/ProductCard.vue";
import { getHome } from "@/api/catalog";
import { useThemeStore } from "@/stores/theme";

const theme = useThemeStore();
const loading = ref(false);
const categories = ref<Array<{ id: number; name: string; type: string }>>([]);
const products = ref<ProductSummary[]>([]);
const services = ref<ServiceSummary[]>([]);

async function load() {
  loading.value = true;
  try {
    const data = await getHome();
    categories.value = data.categories || [];
    products.value = data.recommendedProducts || [];
    services.value = data.hotServices || [];
  } finally {
    loading.value = false;
  }
}

onMounted(load);

function goProducts() {
  uni.switchTab({ url: "/pages/products/list" });
}

function goServices() {
  uni.switchTab({ url: "/pages/services/list" });
}
</script>

<template>
  <view class="page" :style="theme.cssVars">
    <view class="hero">
      <text class="hero-title">源码与技术服务</text>
      <text class="hero-subtitle">选源码、约部署、提需求，交付售后全程可追踪</text>
    </view>

    <view class="category-grid">
      <view v-for="item in categories" :key="item.id" class="category">
        {{ item.name }}
      </view>
    </view>

    <SectionTitle title="推荐源码" more-text="全部" @more="goProducts" />
    <ProductCard v-for="item in products" :key="item.id" :item="item" type="product" />

    <SectionTitle title="热门服务" more-text="全部" @more="goServices" />
    <ProductCard v-for="item in services" :key="item.id" :item="item" type="service" />

    <view v-if="loading" class="loading">加载中...</view>
  </view>
</template>

<style scoped>
.hero {
  min-height: 260rpx;
  padding: 36rpx;
  border-radius: 16rpx;
  color: #fff;
  background: linear-gradient(135deg, #1677ff, #0f766e);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.hero-title {
  font-size: 46rpx;
  font-weight: 800;
}
.hero-subtitle {
  margin-top: 16rpx;
  font-size: 26rpx;
  line-height: 1.6;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-top: 24rpx;
}
.category {
  background: var(--theme-surface-bg);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius);
  padding: 20rpx 8rpx;
  text-align: center;
  font-size: 25rpx;
}
.loading {
  color: var(--theme-muted);
  text-align: center;
  padding: 24rpx 0;
}
</style>
