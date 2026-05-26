<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

const auth = useAuthStore();
const theme = useThemeStore();

async function login() {
  await auth.ensureLogin();
  uni.showToast({ title: "已进入", icon: "success" });
}

function setBlue() {
  theme.updateTheme({ primaryColor: "#1677ff", pageBg: "#f6f8fb" });
}

function setGreen() {
  theme.updateTheme({ primaryColor: "#0f766e", pageBg: "#f3f7f4" });
}

function goOrders() {
  uni.switchTab({ url: "/pages/orders/list" });
}

function goCustomInquiry() {
  uni.navigateTo({ url: "/pages/inquiries/create" });
}
</script>

<template>
  <view class="page" :style="theme.cssVars">
    <view class="card profile">
      <view class="avatar">{{ auth.customer?.nickname?.slice(0, 1) || "客" }}</view>
      <view>
        <text class="name">{{ auth.customer?.nickname || "H5客户" }}</text>
        <text class="muted">{{ auth.token ? "已进入" : "未进入" }}</text>
      </view>
    </view>

    <view class="card actions">
      <button class="btn-primary" @tap="login">进入移动端</button>
      <button @tap="goOrders">订单中心</button>
      <button @tap="goCustomInquiry">提交定制需求</button>
    </view>

    <view class="card theme">
      <text class="block-title">主题配置</text>
      <view class="theme-row">
        <button class="blue" @tap="setBlue">蓝色主题</button>
        <button class="green" @tap="setGreen">绿色主题</button>
      </view>
    </view>
  </view>
</template>

<style scoped>
.profile {
  display: flex;
  gap: 20rpx;
  align-items: center;
}
.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: var(--theme-primary);
  font-size: 36rpx;
  font-weight: 800;
}
.name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
}
.actions,
.theme {
  margin-top: 20rpx;
}
button {
  margin-bottom: 16rpx;
}
.block-title {
  display: block;
  font-weight: 700;
  margin-bottom: 16rpx;
}
.theme-row {
  display: flex;
  gap: 16rpx;
}
.blue {
  color: #1677ff;
}
.green {
  color: #0f766e;
}
</style>
