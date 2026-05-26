<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import CatalogCard from "@/components/CatalogCard.vue";
import EmptyState from "@/components/EmptyState.vue";
import { getHome, type CategoryItem } from "@/api/catalog";
import { clientModules } from "@/config/modules";
import { formatMoney, pickValue } from "@/utils/format";

const router = useRouter();
const loading = ref(false);
const categories = ref<CategoryItem[]>([]);
const products = ref<Record<string, unknown>[]>([]);
const services = ref<Record<string, unknown>[]>([]);
const bundles = ref<Record<string, unknown>[]>([]);

async function load() {
  loading.value = true;
  try {
    const data = await getHome();
    categories.value = data.categories || [];
    products.value = (data.recommendedProducts || []) as unknown as Record<string, unknown>[];
    services.value = (data.hotServices || []) as unknown as Record<string, unknown>[];
    bundles.value = data.bundles || [];
  } catch (error) {
    showToast(error instanceof Error ? error.message : "加载失败");
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <main class="mobile-page">
    <section class="overview soft-card">
      <div>
        <div class="eyebrow">客户选购中心</div>
        <h1>选源码、订服务，直接下单跟进</h1>
        <!-- <p>从浏览商品、确认订单到付款交付，客户侧流程集中处理。</p> -->
      </div>
      <!-- <van-button type="primary" size="small" icon="shopping-cart-o" @click="router.push('/products')">去选购</van-button> -->
    </section>

    <van-grid :column-num="4" :border="false" class="module-grid">
      <van-grid-item v-for="item in clientModules" :key="item.key" :icon="item.icon" :text="item.title" @click="router.push(item.route)" />
    </van-grid>

    <div class="section-title">
      <span>业务分类</span>
      <van-icon name="filter-o" />
    </div>
    <div class="chips">
      <van-tag v-for="item in categories" :key="item.id" plain type="primary" size="large">{{ item.name }}</van-tag>
    </div>

    <div class="section-title">
      <span>推荐源码</span>
      <van-button size="mini" plain type="primary" @click="router.push('/products')">全部</van-button>
    </div>
    <div class="list">
      <CatalogCard v-for="item in products.slice(0, 3)" :key="String(item.id)" :item="item" type="product" @click="router.push(`/products/${item.id}`)" />
      <EmptyState v-if="!loading && products.length === 0" description="暂无推荐源码" />
    </div>

    <div class="section-title">
      <span>热门服务</span>
      <van-button size="mini" plain type="primary" @click="router.push('/services')">全部</van-button>
    </div>
    <div class="list">
      <CatalogCard v-for="item in services.slice(0, 3)" :key="String(item.id)" :item="item" type="service" @click="router.push(`/services/${item.id}`)" />
    </div>

    <template v-if="bundles.length">
      <div class="section-title">
        <span>组合方案</span>
        <van-icon name="cluster-o" />
      </div>
      <div class="bundle-row">
        <div v-for="item in bundles.slice(0, 2)" :key="String(item.id)" class="bundle soft-card">
          <strong>{{ pickValue(item, "name") }}</strong>
          <span>{{ formatMoney(pickValue(item, "price")) }}</span>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped>
.overview {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 18px;
  background:
    linear-gradient(135deg, rgba(22, 119, 255, 0.12), rgba(15, 118, 110, 0.1)),
    #fff;
}

.eyebrow {
  color: var(--theme-primary);
  font-size: 12px;
  font-weight: 700;
}

h1 {
  margin: 8px 0;
  font-size: 23px;
  line-height: 1.25;
}

p {
  margin: 0;
  color: var(--theme-muted);
  font-size: 13px;
  line-height: 1.55;
}

.module-grid {
  margin: 12px -4px 0;
  overflow: hidden;
  border-radius: 8px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.list {
  display: grid;
  gap: 10px;
}

.bundle-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.bundle {
  display: grid;
  gap: 8px;
  padding: 14px;
}

.bundle span {
  color: #d9480f;
  font-weight: 700;
}
</style>
