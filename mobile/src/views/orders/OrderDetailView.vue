<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import EmptyState from "@/components/EmptyState.vue";
import { getOrderDetail, uploadPaymentVoucher } from "@/api/order";
import { formatDate, formatMoney, formatStatus, pickValue } from "@/utils/format";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const submitting = ref(false);
const detail = ref<Record<string, unknown> | null>(null);
const voucher = reactive({
  amount: "",
  paymentMethod: "wechat_transfer",
  transactionNo: "",
  remark: ""
});
const title = computed(() => String(pickValue(detail.value || {}, "title") || "订单详情"));

async function load() {
  loading.value = true;
  try {
    detail.value = await getOrderDetail(Number(route.params.id));
  } catch (error) {
    showToast(error instanceof Error ? error.message : "加载失败");
  } finally {
    loading.value = false;
  }
}

async function submitVoucher() {
  submitting.value = true;
  try {
    await uploadPaymentVoucher(Number(route.params.id), {
      amount: voucher.amount ? Number(voucher.amount) : undefined,
      paymentMethod: voucher.paymentMethod,
      transactionNo: voucher.transactionNo,
      remark: voucher.remark
    });
    showToast("付款凭证已提交");
    await load();
  } catch (error) {
    showToast(error instanceof Error ? error.message : "提交失败");
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
    <van-skeleton v-if="loading" title :row="10" />
    <template v-else-if="detail">
      <section class="soft-card summary">
        <div class="top">
          <strong>{{ title }}</strong>
          <van-tag type="primary" plain>{{ formatStatus(pickValue(detail, "status")) }}</van-tag>
        </div>
        <div class="money">
          <span>应收 {{ formatMoney(pickValue(detail, "payableAmount", "payable_amount")) }}</span>
          <span>实收 {{ formatMoney(pickValue(detail, "paidAmount", "paid_amount")) }}</span>
        </div>
        <div class="muted">{{ pickValue(detail, "orderNo", "order_no") }} · {{ formatDate(pickValue(detail, "createdAt", "created_at")) }}</div>
      </section>

      <van-cell-group inset title="订单信息">
        <van-cell title="付款状态" :value="formatStatus(pickValue(detail, 'paymentStatus', 'payment_status'))" />
        <van-cell title="订单来源" :value="String(pickValue(detail, 'sourceType', 'source_type') || '-')" />
        <van-cell title="客户备注" :label="String(pickValue(detail, 'customerRemark', 'customer_remark') || '无')" />
      </van-cell-group>

      <van-form class="soft-card voucher" @submit="submitVoucher">
        <h2>提交付款凭证</h2>
        <van-field v-model="voucher.amount" label="付款金额" type="number" placeholder="实际付款金额" />
        <van-field v-model="voucher.transactionNo" label="流水号" placeholder="转账单号 / 备注号" />
        <van-field v-model="voucher.remark" label="备注" type="textarea" rows="2" autosize placeholder="付款账户、时间等" />
        <van-button block type="primary" native-type="submit" :loading="submitting">提交凭证</van-button>
      </van-form>
    </template>
    <EmptyState v-else description="订单不存在" />
  </main>
</template>

<style scoped>
.summary,
.voucher {
  padding: 14px;
}

.top,
.money {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.money {
  margin: 14px 0 8px;
  color: #d9480f;
  font-weight: 800;
}

.voucher {
  margin-top: 12px;
}

h2 {
  margin: 0 0 8px;
  font-size: 16px;
}
</style>
