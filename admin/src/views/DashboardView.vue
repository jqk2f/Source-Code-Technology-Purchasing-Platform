<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { DashboardOverview } from "@/shared";
import { getOverview } from "@/api/admin";

const loading = ref(false);
const overview = ref<DashboardOverview>({
  todayCustomers: 0,
  todayInquiries: 0,
  pendingInquiries: 0,
  pendingPayments: 0,
  pendingDeliveries: 0,
  pendingAfterSales: 0,
  orderAmount: 0,
  paidAmount: 0,
  completedOrders: 0,
  conversionRate: 0
});

const cards = [
  ["今日新增客户", "todayCustomers"],
  ["今日询单", "todayInquiries"],
  ["待跟进询单", "pendingInquiries"],
  ["待确认收款", "pendingPayments"],
  ["待交付订单", "pendingDeliveries"],
  ["售后待处理", "pendingAfterSales"],
  ["订单金额", "orderAmount"],
  ["确认收款金额", "paidAmount"],
  ["成交订单数", "completedOrders"]
] as const;

onMounted(async () => {
  loading.value = true;
  try {
    overview.value = await getOverview();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <a-spin :spinning="loading">
    <div class="grid grid-cols-3 gap-4">
      <a-card v-for="[label, key] in cards" :key="key" class="rounded-theme">
        <div class="text-sm text-gray-500">{{ label }}</div>
        <div class="text-3xl font-semibold mt-3">
          {{ key.includes("Amount") ? `￥${overview[key].toLocaleString()}` : overview[key] }}
        </div>
      </a-card>
    </div>

    <a-card class="mt-5 rounded-theme" title="经营提醒">
      <a-alert
        type="info"
        show-icon
        message="当前版本按人工确认交易设计"
        description="请优先处理待跟进询单、待确认收款和待交付订单。所有敏感操作后续可继续沉淀到操作日志模块。"
      />
    </a-card>
  </a-spin>
</template>
