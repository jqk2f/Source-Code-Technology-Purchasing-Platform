<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import CatalogCard from "@/components/CatalogCard.vue";
import EmptyState from "@/components/EmptyState.vue";
import { getProducts, getServices } from "@/api/catalog";

const route = useRoute();
const router = useRouter();
const keyword = ref("");
const sort = ref("recommend");
const loading = ref(false);
const finished = ref(false);
const page = ref(1);
const list = ref<Record<string, unknown>[]>([]);

const catalogType = computed(() => (route.meta.catalogType === "service" ? "service" : "product"));
const title = computed(() => (catalogType.value === "service" ? "技术服务" : "源码产品"));
const sortOptions = [
  { text: "推荐", value: "recommend" },
  { text: "最新", value: "latest" },
  { text: "价格升序", value: "price_asc" },
  { text: "价格降序", value: "price_desc" }
];

async function load(reset = false) {
  if (reset) {
    page.value = 1;
    finished.value = false;
    list.value = [];
  }
  loading.value = true;
  try {
    const params = { page: page.value, pageSize: 10, keyword: keyword.value, sort: sort.value };
    const data = catalogType.value === "service" ? await getServices(params) : await getProducts(params);
    const next = (data.list || []) as unknown as Record<string, unknown>[];
    list.value = reset ? next : [...list.value, ...next];
    finished.value = list.value.length >= data.total || next.length === 0;
    page.value += 1;
  } catch (error) {
    showToast(error instanceof Error ? error.message : "加载失败");
    finished.value = true;
  } finally {
    loading.value = false;
  }
}

function submitSearch() {
  load(true);
}

watch([catalogType, sort], () => load(true));
onMounted(() => load(true));
</script>

<template>
  <main class="mobile-page page-with-nav">
    <van-search v-model="keyword" placeholder="搜索名称、技术栈、服务内容" shape="round" @search="submitSearch" @clear="submitSearch" />
    <van-dropdown-menu>
      <van-dropdown-item v-model="sort" :options="sortOptions" />
    </van-dropdown-menu>

    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="load(false)">
      <div class="list">
        <CatalogCard
          v-for="item in list"
          :key="String(item.id)"
          :item="item"
          :type="catalogType"
          @click="router.push(`/${catalogType === 'service' ? 'services' : 'products'}/${item.id}`)"
        />
      </div>
    </van-list>
    <EmptyState v-if="!loading && list.length === 0" :description="`暂无${title}`" />
  </main>
</template>

<style scoped>
.van-search {
  margin: -2px -4px 4px;
  background: transparent;
}

.list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}
</style>
