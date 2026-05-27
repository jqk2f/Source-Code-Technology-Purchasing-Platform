<script setup lang="ts">
import { h } from "vue";
import { Plus, RefreshCw, Search } from "lucide-vue-next";

defineProps<{
  keyword: string;
  status: string;
  showStatus?: boolean;
  createText?: string;
}>();

const emit = defineEmits<{
  "update:keyword": [value: string];
  "update:status": [value: string];
  search: [];
  refresh: [];
  create: [];
}>();
</script>

<template>
  <div class="flex items-center gap-2">
    <a-input
      :value="keyword"
      allow-clear
      placeholder="搜索关键字"
      class="w-56"
      @update:value="(value: string) => emit('update:keyword', value)"
      @press-enter="emit('search')"
    />
    <a-select
      v-if="showStatus"
      :value="status"
      allow-clear
      placeholder="状态"
      class="w-36"
      @update:value="(value: string) => emit('update:status', value)"
    >
      <a-select-option value="draft">草稿</a-select-option>
      <a-select-option value="on_sale">上架</a-select-option>
      <a-select-option value="off_sale">下架</a-select-option>
      <a-select-option value="pending_follow">待跟进</a-select-option>
      <a-select-option value="contacted">已联系</a-select-option>
    </a-select>
    <a-button type="primary" :icon="h(Search, { size: 16 })" @click="emit('search')">查询</a-button>
    <a-button :icon="h(RefreshCw, { size: 16 })" @click="emit('refresh')">刷新</a-button>
    <a-button type="primary" :icon="h(Plus, { size: 16 })" @click="emit('create')">{{ createText || "新增" }}</a-button>
  </div>
</template>
