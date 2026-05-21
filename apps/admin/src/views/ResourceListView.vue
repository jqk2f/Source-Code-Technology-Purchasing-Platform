<script setup lang="ts">
import { computed, h, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { RefreshCw, Search } from "lucide-vue-next";
import { statusText } from "@source-shop/shared";
import { http } from "@/api/http";

const route = useRoute();
const loading = ref(false);
const rows = ref<Record<string, unknown>[]>([]);
const total = ref(0);
const query = reactive({ page: 1, pageSize: 20, keyword: "", status: "" });

const meta = computed(() => route.meta as { title: string; endpoint: string; columns: string[] });

const columns = computed(() =>
  meta.value.columns.map((key) => ({
    title: columnTitle(key),
    dataIndex: key,
    key,
    ellipsis: true,
    customRender: ({ text }: { text: unknown }) => renderCell(key, text)
  }))
);

function columnTitle(key: string) {
  const map: Record<string, string> = {
    id: "ID",
    title: "标题",
    name: "名称",
    price: "价格",
    startPrice: "起步价",
    status: "状态",
    viewCount: "浏览",
    dealCount: "成交",
    createdAt: "创建时间",
    inquiryNo: "询单号",
    orderNo: "订单号",
    paymentNo: "收款号",
    deliveryNo: "交付号",
    ticketNo: "售后号",
    customerNickname: "客户",
    customerMobile: "手机号",
    payableAmount: "应收",
    paidAmount: "实收",
    quoteAmount: "报价",
    orderId: "订单ID",
    amount: "金额",
    paymentMethod: "收款方式",
    type: "类型",
    nickname: "昵称",
    mobile: "手机号",
    contactWechat: "联系微信",
    source: "来源"
  };
  return map[key] || key;
}

function renderCell(key: string, text: unknown) {
  if (key === "status") return h("span", statusText[String(text)] || String(text || "-"));
  if (["price", "startPrice", "payableAmount", "paidAmount", "amount", "quoteAmount"].includes(key)) {
    return text === null || text === undefined ? "-" : `￥${Number(text).toLocaleString()}`;
  }
  return text || "-";
}

async function load() {
  loading.value = true;
  try {
    const result = await http.page<Record<string, unknown>>(meta.value.endpoint, query);
    rows.value = result.list;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}

watch(() => route.path, () => {
  query.page = 1;
  query.keyword = "";
  query.status = "";
  load();
});

onMounted(load);
</script>

<template>
  <a-card class="rounded-theme" :bordered="false">
    <template #title>{{ meta.title }}</template>
    <template #extra>
      <div class="flex items-center gap-2">
        <a-input v-model:value="query.keyword" allow-clear placeholder="搜索关键字" class="w-56" @press-enter="load" />
        <a-select v-model:value="query.status" allow-clear placeholder="状态" class="w-36">
          <a-select-option value="pending_follow">待跟进</a-select-option>
          <a-select-option value="quoted">已报价</a-select-option>
          <a-select-option value="pending_payment">待付款</a-select-option>
          <a-select-option value="payment_confirming">待确认收款</a-select-option>
          <a-select-option value="pending_delivery">待交付</a-select-option>
          <a-select-option value="completed">已完成</a-select-option>
        </a-select>
        <a-button type="primary" :icon="h(Search, { size: 16 })" @click="load">查询</a-button>
        <a-button :icon="h(RefreshCw, { size: 16 })" @click="load">刷新</a-button>
      </div>
    </template>
    <a-table
      row-key="id"
      :loading="loading"
      :columns="columns"
      :data-source="rows"
      :pagination="{ current: query.page, pageSize: query.pageSize, total, showSizeChanger: true }"
      @change="(page:any) => { query.page = page.current; query.pageSize = page.pageSize; load(); }"
    />
  </a-card>
</template>
