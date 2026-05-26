import { computed, h, reactive, ref, unref, type MaybeRef } from "vue";
import { message, Modal, Tag } from "ant-design-vue";
import { Edit3, Trash2 } from "lucide-vue-next";
import type { ResourceConfig } from "@/config/resources";
import { http } from "@/api/http";
import { formatBoolean, formatDateTime, formatMoney, formatStatus } from "@/utils/format";
import { getErrorMessage } from "@/utils/requestError";

function normalizePayload(value: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (typeof item === "boolean") return [key, item ? 1 : 0];
      if (item === "") return [key, null];
      return [key, item];
    })
  );
}

export function useResourceCrud(configRef: MaybeRef<ResourceConfig>) {
  const loading = ref(false);
  const modalOpen = ref(false);
  const saving = ref(false);
  const editingRecord = ref<Record<string, unknown> | null>(null);
  const rows = ref<Record<string, unknown>[]>([]);
  const total = ref(0);
  const query = reactive({ page: 1, pageSize: 20, keyword: "", status: "" });

  const columns = computed(() => {
    const config = unref(configRef);
    const baseColumns = config.columns.map((column) => ({
      title: column.title,
      dataIndex: column.key,
      key: column.key,
      width: column.width,
      fixed: column.fixed,
      ellipsis: true,
      customRender: ({ text }: { text: unknown }) => renderCell(column.format, text)
    }));

    return [
      ...baseColumns,
      {
        title: "操作",
        key: "actions",
        fixed: "right",
        width: 220,
        customRender: ({ record }: { record: Record<string, unknown> }) => renderActions(record)
      }
    ];
  });

  function renderCell(format: string | undefined, value: unknown) {
    if (format === "money") return formatMoney(value);
    if (format === "datetime") return formatDateTime(value);
    if (format === "boolean") return formatBoolean(value);
    if (format === "status") return h(Tag, { color: "blue" }, () => formatStatus(value));
    return value ?? "-";
  }

  function renderActions(record: Record<string, unknown>) {
    const config = unref(configRef);
    return h("div", { class: "flex items-center gap-2" }, [
      h(
        "button",
        { class: "text-[var(--theme-primary)] hover:underline", onClick: () => openEdit(record) },
        [h(Edit3, { size: 14, class: "inline mr-1" }), "编辑"]
      ),
      ...(config.rowActions || []).map((action) =>
        h(
          "button",
          {
            class: action.type === "danger" ? "text-red-600 hover:underline" : "text-gray-700 hover:underline",
            onClick: () => runRowAction(action.key, record)
          },
          action.label
        )
      ),
      h(
        "button",
        { class: "text-red-600 hover:underline", onClick: () => remove(record) },
        [h(Trash2, { size: 14, class: "inline mr-1" }), "删除"]
      )
    ]);
  }

  async function load() {
    loading.value = true;
    try {
      const config = unref(configRef);
      const result = await http.page<Record<string, unknown>>(config.endpoint, query);
      rows.value = result.list;
      total.value = result.total;
    } finally {
      loading.value = false;
    }
  }

  function resetAndLoad() {
    query.page = 1;
    load();
  }

  function openCreate() {
    editingRecord.value = null;
    modalOpen.value = true;
  }

  function openEdit(record: Record<string, unknown>) {
    editingRecord.value = { ...record };
    modalOpen.value = true;
  }

  async function submit(value: Record<string, unknown>) {
    saving.value = true;
    try {
      const config = unref(configRef);
      const payload = normalizePayload(value);
      if (editingRecord.value?.id) {
        await http.put(`${config.endpoint}/${editingRecord.value.id}`, payload);
      } else {
        await http.post(config.endpoint, payload);
      }
      message.success("保存成功");
      modalOpen.value = false;
      await load();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      saving.value = false;
    }
  }

  function remove(record: Record<string, unknown>) {
    Modal.confirm({
      title: "确认删除",
      content: "删除后该记录将不再出现在列表中，确认继续？",
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      async onOk() {
        const config = unref(configRef);
        await http.delete(`${config.endpoint}/${record.id}`);
        message.success("删除成功");
        await load();
      }
    });
  }

  function runRowAction(actionKey: string, record: Record<string, unknown>) {
    const config = unref(configRef);
    const action = config.rowActions?.find((item) => item.key === actionKey);
    if (!action) return;

    const execute = async () => {
      const method = action.method || "POST";
      const body = action.body?.(record);
      if (method === "PUT") await http.put(action.endpoint(record), body);
      else if (method === "DELETE") await http.delete(action.endpoint(record));
      else await http.post(action.endpoint(record), body);
      message.success("操作成功");
      await load();
    };

    if (action.confirm) {
      Modal.confirm({
        title: "确认操作",
        content: action.confirm,
        okText: "确认",
        cancelText: "取消",
        onOk: execute
      });
      return;
    }

    execute();
  }

  return {
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
  };
}
