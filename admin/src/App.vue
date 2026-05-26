<script setup lang="ts">
import { computed } from "vue";
import { RouterView } from "vue-router";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { useThemeStore } from "./stores/theme";

const themeStore = useThemeStore();
const antTheme = computed(() => ({
  token: {
    colorPrimary: themeStore.tokens.primaryColor,
    colorSuccess: themeStore.tokens.successColor,
    colorWarning: themeStore.tokens.warningColor,
    colorError: themeStore.tokens.errorColor,
    borderRadius: themeStore.tokens.borderRadius
  }
}));
</script>

<template>
  <a-config-provider :locale="zhCN" :theme="antTheme">
    <RouterView />
  </a-config-provider>
</template>
