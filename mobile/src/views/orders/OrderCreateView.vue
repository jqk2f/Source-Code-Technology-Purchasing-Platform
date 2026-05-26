<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import { getProductDetail, getServiceDetail } from "@/api/catalog";
import { createOrder } from "@/api/order";
import { useAuthStore } from "@/stores/auth";
import { formatMoney, pickValue } from "@/utils/format";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const submitting = ref(false);
const detail = ref<Record<string, unknown> | null>(null);
const sourceType = computed(() => (route.query.sourceType === "service" ? "service" : "product"));
const sourceId = computed(() => Number(route.query.sourceId || 0));
const quantity = ref(1);
const form = reactive({
  contactName: auth.customer?.nickname || "",
  contactMobile: auth.customer?.mobile || "",
  customerRemark: ""
});

const title = computed(() => String(pickValue(detail.value || {}, "title", "name") || "确认订单"));
const subtitle = computed(() => String(pickValue(detail.value || {}, "subtitle") || "下单后可在我的订单中查看付款、交付和验收进度"));
const unitAmount = computed(() => {
  const value = pickValue(detail.value || {}, "price", "startPrice", "start_price");
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount : 0;
});
const priceText = computed(() => pickValue(detail.value || {}, "priceText", "price_text") || (unitAmount.value > 0 ? formatMoney(unitAmount.value) : "下单后沟通报价"));
const totalText = computed(() => (unitAmount.value > 0 ? formatMoney(unitAmount.value * quantity.value) : "待沟通"));

async function load() {
  if (!sourceId.value) {
    showToast("请选择要下单的商品或服务");
    router.replace("/home");
    return;
  }
  loading.value = true;
  try {
    detail.value = sourceType.value === "service" ? await getServiceDetail(sourceId.value) : await getProductDetail(sourceId.value);
  } catch (error) {
    showToast(error instanceof Error ? error.message : "加载失败");
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!detail.value) return;
  if (!form.contactMobile.trim()) {
    showToast("请填写联系电话");
    return;
  }
  submitting.value = true;
  try {
    const result = await createOrder({
      sourceType: sourceType.value,
      sourceId: sourceId.value,
      quantity: sourceType.value === "product" ? quantity.value : 1,
      contactName: form.contactName,
      contactMobile: form.contactMobile,
      customerRemark: form.customerRemark
    });
    showToast("订单已提交");
    router.replace(`/orders/${result.orderId}`);
  } catch (error) {
    showToast(error instanceof Error ? error.message : "下单失败");
  } finally {
    submitting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <main class="mobile-page page-with-nav">
    <button class="page-back" type="button" aria-label="返回" @click="router.back()">
      <van-icon name="arrow-left" />
    </button>
    <van-skeleton v-if="loading" title :row="8" />
    <template v-else-if="detail">
      <section class="soft-card product">
        <div class="icon">
          <van-icon :name="sourceType === 'service' ? 'service-o' : 'apps-o'" />
        </div>
        <div class="info">
          <h1>{{ title }}</h1>
          <p>{{ subtitle }}</p>
          <strong>{{ priceText }}</strong>
        </div>
      </section>

      <van-cell-group inset title="购买信息">
        <van-cell title="类型" :value="sourceType === 'service' ? '技术服务' : '源码产品'" />
        <van-cell v-if="sourceType === 'product'" title="数量">
          <template #value>
            <van-stepper v-model="quantity" integer min="1" />
          </template>
        </van-cell>
        <van-cell title="订单金额" :value="totalText" />
      </van-cell-group>

      <van-form class="soft-card form" @submit="submit">
        <van-field v-model="form.contactName" label="联系人" placeholder="姓名" clearable />
        <van-field v-model="form.contactMobile" label="联系电话" type="tel" placeholder="用于订单沟通" clearable required />
        <van-field v-model="form.customerRemark" label="订单备注" type="textarea" rows="3" autosize placeholder="部署要求、交付时间或其他说明" />
        <div class="submit">
          <van-button block type="primary" native-type="submit" :loading="submitting">提交订单</van-button>
        </div>
      </van-form>
    </template>
  </main>
</template>

<style scoped>
.product {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  padding: 14px;
}

.icon {
  display: grid;
  width: 56px;
  height: 56px;
  place-items: center;
  border-radius: 8px;
  background: rgba(22, 119, 255, 0.1);
  color: var(--theme-primary);
  font-size: 28px;
}

.info {
  min-width: 0;
}

h1 {
  margin: 0;
  font-size: 17px;
  line-height: 1.35;
}

p {
  margin: 6px 0 10px;
  color: var(--theme-muted);
  font-size: 13px;
  line-height: 1.5;
}

strong {
  color: #d9480f;
  font-size: 17px;
}

.form {
  margin-top: 12px;
  padding: 8px 0 16px;
}

.submit {
  padding: 18px 16px 0;
}
</style>
