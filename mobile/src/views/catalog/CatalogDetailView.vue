<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import EmptyState from "@/components/EmptyState.vue";
import { getProductDetail, getServiceDetail } from "@/api/catalog";
import { formatMoney, pickValue } from "@/utils/format";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const detail = ref<Record<string, unknown> | null>(null);
const catalogType = computed(() => (route.meta.catalogType === "service" ? "service" : "product"));
const title = computed(() => String(pickValue(detail.value || {}, "title", "name") || "详情"));
const cover = computed(() => String(pickValue(detail.value || {}, "coverUrl", "cover_url") || ""));
const price = computed(() => pickValue(detail.value || {}, "priceText", "price_text") || formatMoney(pickValue(detail.value || {}, "startPrice", "start_price", "price")));
const intro = computed(() =>
  String(
    pickValue(
      detail.value || {},
      catalogType.value === "service" ? "serviceScope" : "featureIntro",
      catalogType.value === "service" ? "service_scope" : "feature_intro",
      "subtitle",
      "description"
    ) || "项目资料整理中，可提交需求后进一步确认。"
  )
);

async function load() {
  loading.value = true;
  try {
    const id = Number(route.params.id);
    detail.value = catalogType.value === "service" ? await getServiceDetail(id) : await getProductDetail(id);
  } catch (error) {
    showToast(error instanceof Error ? error.message : "加载失败");
  } finally {
    loading.value = false;
  }
}

function createInquiry() {
  router.push({
    path: "/inquiries/create",
    query: {
      sourceType: catalogType.value,
      sourceId: String(route.params.id),
      title: title.value
    }
  });
}

function createOrder() {
  router.push({
    path: "/checkout",
    query: {
      sourceType: catalogType.value,
      sourceId: String(route.params.id)
    }
  });
}

onMounted(load);
</script>

<template>
  <main class="mobile-page page-with-nav page-with-action">
    <button class="page-back" type="button" aria-label="返回" @click="router.back()">
      <van-icon name="arrow-left" />
    </button>
    <van-skeleton v-if="loading" title :row="8" />
    <template v-else-if="detail">
      <section class="detail-head soft-card">
        <div class="cover" :style="cover ? { backgroundImage: `url(${cover})` } : undefined">
          <van-icon v-if="!cover" :name="catalogType === 'service' ? 'service-o' : 'apps-o'" />
        </div>
        <div class="body">
          <h1>{{ title }}</h1>
          <p>{{ pickValue(detail, "subtitle") || "源码和服务过程可追踪" }}</p>
          <div class="price">{{ price }}</div>
        </div>
      </section>

      <van-cell-group inset title="核心信息">
        <van-cell v-if="catalogType === 'product'" title="技术栈" :value="String(pickValue(detail, 'techStack', 'tech_stack') || '按资料为准')" />
        <van-cell v-if="catalogType === 'service'" title="服务周期" :value="String(pickValue(detail, 'servicePeriod', 'service_period') || '按需评估')" />
        <van-cell v-if="catalogType === 'service'" title="服务方式" :value="String(pickValue(detail, 'serviceMethod', 'service_method') || '远程/线上')" />
        <van-cell title="浏览量" :value="String(pickValue(detail, 'viewCount', 'view_count') || 0)" />
      </van-cell-group>

      <section class="content soft-card">
        <h2>{{ catalogType === "service" ? "服务范围" : "功能介绍" }}</h2>
        <p>{{ intro }}</p>
      </section>

      <van-action-bar>
        <van-action-bar-icon icon="chat-o" text="咨询" @click="createInquiry" />
        <van-action-bar-button type="warning" text="提交需求" @click="createInquiry" />
        <van-action-bar-button type="primary" text="立即下单" @click="createOrder" />
      </van-action-bar>
    </template>
    <EmptyState v-else description="详情不存在或已下架" />
  </main>
</template>

<style scoped>
.detail-head {
  overflow: hidden;
}

.cover {
  display: grid;
  min-height: 178px;
  place-items: center;
  background:
    linear-gradient(135deg, rgba(22, 119, 255, 0.18), rgba(15, 118, 110, 0.14)),
    #eef3fb;
  background-position: center;
  background-size: cover;
  color: var(--theme-primary);
  font-size: 42px;
}

.body {
  padding: 16px;
}

h1 {
  margin: 0 0 8px;
  font-size: 20px;
  line-height: 1.35;
}

.body p,
.content p {
  margin: 0;
  color: var(--theme-muted);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}

.price {
  margin-top: 12px;
  color: #d9480f;
  font-size: 20px;
  font-weight: 800;
}

.content {
  margin-top: 12px;
  padding: 16px;
}

h2 {
  margin: 0 0 10px;
  font-size: 16px;
}
</style>
