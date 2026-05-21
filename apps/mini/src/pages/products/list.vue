<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { ProductSummary } from "@source-shop/shared";
import ProductCard from "@/components/ProductCard.vue";
import { getProducts } from "@/api/catalog";
import { useThemeStore } from "@/stores/theme";

const theme = useThemeStore();
const query = reactive({ page: 1, pageSize: 20, keyword: "" });
const list = ref<ProductSummary[]>([]);
const loading = ref(false);

async function load(reset = false) {
  if (reset) query.page = 1;
  loading.value = true;
  try {
    const data = await getProducts(query);
    list.value = reset ? data.list : [...list.value, ...data.list];
  } finally {
    loading.value = false;
  }
}

onMounted(() => load(true));
</script>

<template>
  <view class="page" :style="theme.cssVars">
    <view class="search card">
      <input v-model="query.keyword" placeholder="搜索源码、技术栈、行业关键词" @confirm="load(true)" />
      <button class="btn-primary" size="mini" @tap="load(true)">搜索</button>
    </view>
    <ProductCard v-for="item in list" :key="item.id" :item="item" type="product" />
  </view>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
}
input {
  flex: 1;
  font-size: 28rpx;
}
button {
  margin: 0;
}
</style>
