<script setup lang="ts">
import { computed, h } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { BarChart3, Boxes, ClipboardList, CreditCard, Handshake, Home, LogOut, PackageCheck, Settings, ShoppingBag, UserRound, Wrench } from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const theme = useThemeStore();

const selectedKeys = computed(() => [route.path]);
const openKeys = computed(() => ["/"]);
const menuItems = [
  { key: "/dashboard", icon: () => h(Home, { size: 16 }), label: "经营概览" },
  { key: "/products", icon: () => h(Boxes, { size: 16 }), label: "源码产品" },
  { key: "/services", icon: () => h(Wrench, { size: 16 }), label: "技术服务" },
  { key: "/inquiries", icon: () => h(Handshake, { size: 16 }), label: "询单管理" },
  { key: "/orders", icon: () => h(ShoppingBag, { size: 16 }), label: "订单管理" },
  { key: "/payments", icon: () => h(CreditCard, { size: 16 }), label: "收款记录" },
  { key: "/deliveries", icon: () => h(PackageCheck, { size: 16 }), label: "交付管理" },
  { key: "/after-sales", icon: () => h(ClipboardList, { size: 16 }), label: "售后工单" },
  { key: "/customers", icon: () => h(UserRound, { size: 16 }), label: "客户管理" },
  { key: "/settings", icon: () => h(Settings, { size: 16 }), label: "主题配置" }
];

function handleMenu({ key }: { key: string }) {
  router.push(key);
}

function logout() {
  auth.logout();
  router.push("/login");
}
</script>

<template>
  <a-layout class="min-h-screen">
    <a-layout-sider width="248" theme="light" class="border-r border-[var(--theme-border)]">
      <div class="h-16 px-5 flex items-center gap-3 border-b border-[var(--theme-border)]">
        <div class="h-9 w-9 rounded-theme bg-brand text-white grid place-items-center font-semibold">
          源
        </div>
        <div>
          <div class="font-semibold leading-tight">{{ theme.tokens.brandName }}</div>
          <div class="text-xs text-gray-500">运营管理后台</div>
        </div>
      </div>
      <a-menu :selected-keys="selectedKeys" :open-keys="openKeys" mode="inline" :items="menuItems" @click="handleMenu" />
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="!bg-white !px-6 border-b border-[var(--theme-border)] flex items-center justify-between">
        <div>
          <div class="text-lg font-semibold">{{ route.meta.title || "管理后台" }}</div>
          <div class="text-xs text-gray-500">人工收款、交付和售后闭环工作台</div>
        </div>
        <div class="flex items-center gap-3">
          <a-tag color="blue">{{ auth.user?.realName || auth.user?.username || "管理员" }}</a-tag>
          <a-button :icon="h(LogOut, { size: 16 })" @click="logout">退出</a-button>
        </div>
      </a-layout-header>
      <a-layout-content class="p-6 bg-page">
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
