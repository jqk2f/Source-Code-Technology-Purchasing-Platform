<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import EmptyState from "@/components/EmptyState.vue";
import { getInquiries } from "@/api/inquiry";
import { formatDate, formatStatus, pickValue } from "@/utils/format";

const router = useRouter();
const status = ref("");
const loading = ref(false);
const list = ref<Record<string, unknown>[]>([]);
const tabs = [
  { title: "全部", name: "" },
  { title: "待跟进", name: "pending_follow" },
  { title: "已联系", name: "contacted" }
];

async function load() {
  loading.value = true;
  try {
    const data = await getInquiries({ page: 1, pageSize: 30, status: status.value });
    list.value = data.list || [];
  } catch (error) {
    showToast(error instanceof Error ? error.message : "加载失败");
  } finally {
    loading.value = false;
  }
}

watch(status, load);
onMounted(load);
</script>

<template>
  <main class="mobile-page page-with-nav">
    <van-tabs v-model:active="status" sticky>
      <van-tab v-for="item in tabs" :key="item.name" :title="item.title" :name="item.name" />
    </van-tabs>
    <div class="toolbar">
      <van-button type="primary" icon="plus" size="small" @click="router.push('/products')">去预约</van-button>
    </div>
    <van-loading v-if="loading" class="loading" />
    <div v-else class="list">
      <article v-for="item in list" :key="String(item.id)" class="soft-card card">
        <div class="top">
          <strong>{{ pickValue(item, "title") }}</strong>
          <van-tag type="primary" plain>{{ formatStatus(pickValue(item, "status")) }}</van-tag>
        </div>
        <p>{{ pickValue(item, "description") || "预约说明待补充" }}</p>
        <div class="meta">
          <span>{{ pickValue(item, "inquiryNo", "inquiry_no") }}</span>
          <span>{{ formatDate(pickValue(item, "createdAt", "created_at")) }}</span>
        </div>
      </article>
      <EmptyState v-if="list.length === 0" description="暂无预约记录" />
    </div>
  </main>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
  margin: 12px 0;
}

.loading {
  display: block;
  margin: 32px auto;
}

.list {
  display: grid;
  gap: 10px;
}

.card {
  padding: 14px;
}

.top,
.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card p {
  display: -webkit-box;
  overflow: hidden;
  margin: 10px 0;
  color: var(--theme-muted);
  font-size: 13px;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.meta {
  color: var(--theme-muted);
  font-size: 12px;
}
</style>
