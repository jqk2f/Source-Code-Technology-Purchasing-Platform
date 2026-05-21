<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import type { ServiceSummary } from "@source-shop/shared";
import ProductCard from "@/components/ProductCard.vue";
import { getServices } from "@/api/catalog";
import { useThemeStore } from "@/stores/theme";

const theme = useThemeStore();
const query = reactive({ page: 1, pageSize: 20, keyword: "" });
const list = ref<ServiceSummary[]>([]);

async function load() {
  const data = await getServices(query);
  list.value = data.list;
}

onMounted(load);
</script>

<template>
  <view class="page" :style="theme.cssVars">
    <view class="card search">
      <input v-model="query.keyword" placeholder="搜索部署、二开、Bug 修复" @confirm="load" />
      <button class="btn-primary" size="mini" @tap="load">搜索</button>
    </view>
    <ProductCard v-for="item in list" :key="item.id" :item="item" type="service" />
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
}
button {
  margin: 0;
}
</style>
