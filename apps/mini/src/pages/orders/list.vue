<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { ref } from "vue";
import { statusText } from "@source-shop/shared";
import { getOrders } from "@/api/order";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

const auth = useAuthStore();
const theme = useThemeStore();
const orders = ref<Record<string, any>[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    await auth.ensureLogin();
    const data = await getOrders({ page: 1, pageSize: 50 });
    orders.value = data.list;
  } finally {
    loading.value = false;
  }
}

function go(id: number) {
  uni.navigateTo({ url: `/pages/orders/detail?id=${id}` });
}

onShow(load);
</script>

<template>
  <view class="page" :style="theme.cssVars">
    <view v-if="!orders.length && !loading" class="card empty">
      <text>暂无订单。提交购买意向后，管理员确认报价会生成订单。</text>
    </view>
    <view v-for="item in orders" :key="item.id" class="card order" @tap="go(item.id)">
      <view class="row">
        <text class="title">{{ item.title }}</text>
        <text class="status">{{ statusText[item.status] || item.status }}</text>
      </view>
      <text class="no">{{ item.orderNo }}</text>
      <view class="amount">
        <text>应收 ¥{{ item.payableAmount || 0 }}</text>
        <text>已收 ¥{{ item.paidAmount || 0 }}</text>
      </view>
    </view>
    <view v-if="loading" class="loading">加载中...</view>
  </view>
</template>

<style scoped>
.empty {
  color: var(--theme-muted);
  line-height: 1.7;
}
.order {
  margin-bottom: 18rpx;
}
.row,
.amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 30rpx;
  font-weight: 700;
}
.status {
  color: var(--theme-primary);
  font-size: 24rpx;
}
.no {
  display: block;
  margin: 12rpx 0;
  color: var(--theme-muted);
  font-size: 24rpx;
}
.amount {
  color: var(--theme-muted);
  font-size: 24rpx;
}
.loading {
  color: var(--theme-muted);
  text-align: center;
  padding: 24rpx 0;
}
</style>
