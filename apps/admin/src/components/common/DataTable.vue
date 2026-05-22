<script setup lang="ts">
import type { TablePaginationConfig } from "ant-design-vue";

defineProps<{
  columns: unknown[];
  rows: Record<string, unknown>[];
  loading?: boolean;
  height: number;
  page: number;
  pageSize: number;
  total: number;
}>();

const emit = defineEmits<{
  change: [page: number, pageSize: number];
}>();

function handleChange(pagination: TablePaginationConfig) {
  emit("change", Number(pagination.current || 1), Number(pagination.pageSize || 20));
}
</script>

<template>
  <div class="data-table">
    <a-table
      row-key="id"
      size="middle"
      :loading="loading"
      :columns="columns"
      :data-source="rows"
      :scroll="{ x: 'max-content', y: height }"
      :pagination="{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (value: number) => `共 ${value} 条`
      }"
      @change="handleChange"
    />
  </div>
</template>

<style scoped>
.data-table {
  min-height: 0;
  flex: 1;
  width: 100%;
  overflow: hidden;
}

:deep(.ant-table-wrapper),
:deep(.ant-spin-nested-loading),
:deep(.ant-spin-container) {
  height: 100%;
}

:deep(.ant-spin-container) {
  display: flex;
  flex-direction: column;
}

:deep(.ant-table) {
  flex: 1;
  min-height: 0;
}

:deep(.ant-table-container) {
  border-radius: 0;
}

:deep(.ant-table-pagination) {
  margin: 12px 16px !important;
  flex-shrink: 0;
}
</style>
