<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import CrudModal from "@/components/common/CrudModal.vue";
import DataTable from "@/components/common/DataTable.vue";
import PageCard from "@/components/common/PageCard.vue";
import ToolbarFilter from "@/components/common/ToolbarFilter.vue";
import { resourceConfigs } from "@/config/resources";
import { useResourceCrud } from "@/hooks/useResourceCrud";
import { useTableHeight } from "@/hooks/useTableHeight";

const route = useRoute();

const config = computed(() => {
  const key = String(route.meta.resourceKey || "");
  const found = resourceConfigs.find((item) => item.key === key);
  if (!found) throw new Error(`未找到资源配置：${key}`);
  return found;
});

const tableHeight = useTableHeight(252);
const {
  loading,
  modalOpen,
  saving,
  editingRecord,
  rows,
  total,
  query,
  columns,
  load,
  resetAndLoad,
  openCreate,
  submit
} = useResourceCrud(config);

watch(
  () => route.meta.resourceKey,
  () => {
    query.page = 1;
    query.keyword = "";
    query.status = "";
    load();
  }
);

onMounted(load);

function handlePageChange(page: number, pageSize: number) {
  query.page = page;
  query.pageSize = pageSize;
  load();
}
</script>

<template>
  <PageCard :title="config.title" description="支持搜索、筛选、新增、编辑、删除和场景化快捷操作">
    <template #extra>
      <ToolbarFilter
        v-model:keyword="query.keyword"
        v-model:status="query.status"
        :show-status="config.statusFilter"
        :create-text="config.createText"
        @search="resetAndLoad"
        @refresh="load"
        @create="openCreate"
      />
    </template>

    <DataTable
      :columns="columns"
      :rows="rows"
      :loading="loading"
      :height="tableHeight"
      :page="query.page"
      :page-size="query.pageSize"
      :total="total"
      @change="handlePageChange"
    />

    <CrudModal
      v-model:open="modalOpen"
      :title="editingRecord ? `编辑${config.title}` : config.createText || `新增${config.title}`"
      :fields="config.fields"
      :record="editingRecord"
      :confirm-loading="saving"
      @submit="submit"
    />
  </PageCard>
</template>
