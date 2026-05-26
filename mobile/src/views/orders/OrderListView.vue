<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import EmptyState from "@/components/EmptyState.vue";
import { getOrders } from "@/api/order";
import { formatDate, formatMoney, formatStatus, pickValue } from "@/utils/format";

const router = useRouter();
const status = ref("");
const loading = ref(false);
const list = ref<Record<string, unknown>[]>([]);
const tabs = [
  { title: "全部", name: "" },
  { title: "待付款", name: "pending_payment" },
  { title: "服务中", name: "in_service" },
  { title: "待验收", name: "pending_acceptance" },
  { title: "已完成", name: "completed" }
];

async function load() {
  loading.value = true;
  try {
    const data = await getOrders({ page: 1, pageSize: 30, status: status.value });
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
    <van-loading v-if="loading" class="loading" />
    <div v-else class="list">
      <article v-for="item in list" :key="String(item.id)" class="soft-card card" @click="router.push(`/orders/${item.id}`)">
        <div class="top">
          <strong>{{ pickValue(item, "title") }}</strong>
          <van-tag type="primary" plain>{{ formatStatus(pickValue(item, "status")) }}</van-tag>
        </div>
        <div class="amount-row">
          <span>应收 {{ formatMoney(pickValue(item, "payableAmount", "payable_amount", "totalAmount", "total_amount")) }}</span>
          <span>实收 {{ formatMoney(pickValue(item, "paidAmount", "paid_amount")) }}</span>
        </div>
        <div class="meta">
          <span>{{ pickValue(item, "orderNo", "order_no") }}</span>
          <span>{{ formatDate(pickValue(item, "createdAt", "created_at")) }}</span>
        </div>
      </article>
      <EmptyState v-if="list.length === 0" description="暂无订单，去源码或服务详情页可直接下单" />
    </div>
  </main>
</template>

<style scoped>
.loading {
  display: block;
  margin: 32px auto;
}

.list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.card {
  padding: 14px;
}

.top,
.amount-row,
.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.amount-row {
  margin: 12px 0;
  color: #d9480f;
  font-size: 13px;
  font-weight: 700;
}

.meta {
  color: var(--theme-muted);
  font-size: 12px;
}
</style>
