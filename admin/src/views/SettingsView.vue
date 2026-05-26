<script setup lang="ts">
import { reactive, watch } from "vue";
import { useThemeStore } from "@/stores/theme";

const theme = useThemeStore();
const form = reactive({ ...theme.tokens });

watch(
  form,
  () => {
    theme.updateTheme(form);
  },
  { deep: true }
);
</script>

<template>
  <a-card class="rounded-theme max-w-4xl" title="前端 UI 主题配置" :bordered="false">
    <a-form layout="vertical">
      <a-form-item label="平台名称">
        <a-input v-model:value="form.brandName" />
      </a-form-item>
      <div class="grid grid-cols-3 gap-4">
        <a-form-item label="主色">
          <a-input v-model:value="form.primaryColor" type="color" />
        </a-form-item>
        <a-form-item label="成功色">
          <a-input v-model:value="form.successColor" type="color" />
        </a-form-item>
        <a-form-item label="警告色">
          <a-input v-model:value="form.warningColor" type="color" />
        </a-form-item>
        <a-form-item label="错误色">
          <a-input v-model:value="form.errorColor" type="color" />
        </a-form-item>
        <a-form-item label="页面背景">
          <a-input v-model:value="form.pageBg" type="color" />
        </a-form-item>
        <a-form-item label="内容背景">
          <a-input v-model:value="form.surfaceBg" type="color" />
        </a-form-item>
      </div>
      <a-form-item label="圆角">
        <a-slider v-model:value="form.borderRadius" :min="0" :max="16" />
      </a-form-item>
      <a-space>
        <a-button type="primary">已自动保存</a-button>
        <a-button @click="theme.resetTheme()">恢复默认</a-button>
      </a-space>
    </a-form>
  </a-card>
</template>
