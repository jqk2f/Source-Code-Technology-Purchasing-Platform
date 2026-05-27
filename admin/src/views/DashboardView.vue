<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { DashboardOverview } from "@/shared";
import { getOverview } from "@/api/admin";

const loading = ref(false);
const overview = ref<DashboardOverview>({
  todayCustomers: 0,
  todayInquiries: 0,
  pendingInquiries: 0,
  contactedInquiries: 0,
  conversionRate: 0
});

const cards = [
  ["今日新增客户", "todayCustomers"],
  ["今日预约", "todayInquiries"],
  ["待跟进预约", "pendingInquiries"],
  ["已联系预约", "contactedInquiries"]
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
          {{ overview[key] }}
        </div>
      </a-card>
    </div>

    <a-card class="mt-5 rounded-theme" title="经营提醒">
      <a-alert
        type="info"
        show-icon
        message="当前版本以客户意向跟进为主"
        description="请优先维护产品与服务详情，并及时处理客户预约和联系资料。"
      />
    </a-card>
  </a-spin>
</template>
