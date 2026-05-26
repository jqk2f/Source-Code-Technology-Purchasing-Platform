<script setup lang="ts">
import { computed } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const activeTab = computed({
  get() {
    const path = route.path;
    if (path.startsWith("/products")) return "/products";
    if (path.startsWith("/services")) return "/services";
    if (path.startsWith("/orders") || path.startsWith("/checkout")) return "/orders";
    if (path.startsWith("/profile")) return "/profile";
    return "/home";
  },
  set(path: string) {
    router.push(path);
  }
});
</script>

<template>
  <div class="shell">
    <RouterView />
    <van-tabbar v-model="activeTab" route safe-area-inset-bottom>
      <van-tabbar-item to="/home" icon="wap-home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/products" icon="apps-o">源码</van-tabbar-item>
      <van-tabbar-item to="/services" icon="service-o">服务</van-tabbar-item>
      <van-tabbar-item to="/orders" icon="orders-o">订单</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
}
</style>
