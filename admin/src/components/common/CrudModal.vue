<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import type { ResourceField } from "@/config/resources";

const props = defineProps<{
  open: boolean;
  title: string;
  fields: ResourceField[];
  record?: Record<string, unknown> | null;
  confirmLoading?: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  submit: [value: Record<string, unknown>];
}>();

const formState = reactive<Record<string, unknown>>({});

const rules = computed(() =>
  Object.fromEntries(
    props.fields
      .filter((field) => field.required)
      .map((field) => [field.key, [{ required: true, message: `请输入${field.label}` }]])
  )
);

watch(
  () => [props.open, props.record],
  () => {
    Object.keys(formState).forEach((key) => delete formState[key]);
    for (const field of props.fields) {
      formState[field.key] = props.record?.[field.key] ?? defaultValue(field);
    }
  },
  { immediate: true }
);

function defaultValue(field: ResourceField) {
  if (field.type === "switch") return false;
  if (field.type === "number" || field.type === "money") return undefined;
  if (field.type === "select") return field.options?.[0]?.value;
  return "";
}

function close() {
  emit("update:open", false);
}

function submit() {
  emit("submit", { ...formState });
}
</script>

<template>
  <a-modal
    :open="open"
    :title="title"
    :width="760"
    :confirm-loading="confirmLoading"
    destroy-on-close
    @ok="submit"
    @cancel="close"
    @update:open="(value: boolean) => emit('update:open', value)"
  >
    <a-form layout="vertical" :model="formState" :rules="rules">
      <div class="grid grid-cols-2 gap-x-4">
        <a-form-item
          v-for="field in fields"
          :key="field.key"
          :label="field.label"
          :name="field.key"
          :class="field.type === 'textarea' ? 'col-span-2' : ''"
        >
          <a-input-number
            v-if="field.type === 'number' || field.type === 'money'"
            v-model:value="formState[field.key]"
            :min="0"
            :precision="field.type === 'money' ? 2 : 0"
            class="w-full"
            :placeholder="field.placeholder || `请输入${field.label}`"
          />
          <a-select
            v-else-if="field.type === 'select'"
            v-model:value="formState[field.key]"
            :options="field.options"
            :placeholder="field.placeholder || `请选择${field.label}`"
          />
          <a-switch v-else-if="field.type === 'switch'" v-model:checked="formState[field.key]" />
          <a-textarea
            v-else-if="field.type === 'textarea'"
            v-model:value="formState[field.key]"
            :rows="4"
            :placeholder="field.placeholder || `请输入${field.label}`"
          />
          <a-input v-else v-model:value="formState[field.key]" :placeholder="field.placeholder || `请输入${field.label}`" />
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>
