<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
import { statusText } from "@source-shop/shared";
import { getOrderDetail, uploadPaymentVoucher } from "@/api/order";
import { useThemeStore } from "@/stores/theme";

const theme = useThemeStore();
const orderId = ref(0);
const detail = ref<Record<string, any>>({});
const payment = reactive({
  amount: undefined as number | undefined,
  paymentMethod: "wechat_transfer",
  paidAt: "",
  transactionNo: "",
  remark: ""
});

onLoad(async (query = {}) => {
  orderId.value = Number(query.id);
  detail.value = await getOrderDetail(orderId.value);
  payment.amount = detail.value.payableAmount;
});

async function submitPayment() {
  await uploadPaymentVoucher(orderId.value, payment);
  uni.showToast({ title: "凭证已提交", icon: "success" });
  detail.value = await getOrderDetail(orderId.value);
}
</script>

<template>
  <view class="page" :style="theme.cssVars">
    <view class="card">
      <text class="title">{{ detail.title }}</text>
      <text class="muted">{{ detail.orderNo }}</text>
      <view class="status">{{ statusText[detail.status] || detail.status }}</view>
      <view class="money">
        <text>应收：¥{{ detail.payableAmount || 0 }}</text>
        <text>已收：¥{{ detail.paidAmount || 0 }}</text>
      </view>
    </view>

    <view class="card block">
      <text class="block-title">付款说明</text>
      <text class="content">{{ detail.paymentInstruction || "请联系管理员确认付款方式后上传凭证。" }}</text>
    </view>

    <view class="card block">
      <text class="block-title">上传付款凭证</text>
      <input v-model.number="payment.amount" type="number" placeholder="付款金额" />
      <input v-model="payment.transactionNo" placeholder="交易流水号（可选）" />
      <input v-model="payment.remark" placeholder="备注" />
      <button class="btn-primary" @tap="submitPayment">提交凭证</button>
    </view>

    <view class="card block">
      <text class="block-title">交付资料</text>
      <view v-if="!detail.deliveries?.length" class="content">管理员确认收款后会添加交付资料。</view>
      <view v-for="item in detail.deliveries" :key="item.id" class="delivery">
        <text class="delivery-title">{{ item.title }}</text>
        <text class="content">{{ item.content }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.title {
  display: block;
  font-size: 34rpx;
  font-weight: 800;
}
.status {
  margin-top: 16rpx;
  color: var(--theme-primary);
}
.money {
  display: flex;
  justify-content: space-between;
  margin-top: 18rpx;
}
.block {
  margin-top: 18rpx;
}
.block-title,
.delivery-title {
  display: block;
  font-weight: 700;
  margin-bottom: 14rpx;
}
.content {
  display: block;
  color: var(--theme-muted);
  line-height: 1.7;
}
input {
  height: 80rpx;
  padding: 0 18rpx;
  margin-bottom: 14rpx;
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius);
}
button {
  width: 100%;
}
.delivery {
  padding: 16rpx 0;
  border-top: 1px solid var(--theme-border);
}
</style>
