<script setup lang="ts">
import { computed } from "vue";
import { formatMoney, pickValue } from "@/utils/format";

const props = defineProps<{
  item: Record<string, unknown>;
  type: "product" | "service";
}>();

const title = computed(() => String(pickValue(props.item, "title", "name") || "未命名"));
const subtitle = computed(() => String(pickValue(props.item, "subtitle") || "源码交付、部署支持、服务过程可追踪"));
const cover = computed(() => String(pickValue(props.item, "coverUrl", "cover_url") || ""));
const price = computed(() => pickValue(props.item, "priceText", "price_text") || formatMoney(pickValue(props.item, "startPrice", "start_price", "price")));
const meta = computed(() => {
  if (props.type === "product") return String(pickValue(props.item, "techStack", "tech_stack") || "可演示");
  return String(pickValue(props.item, "servicePeriod", "service_period") || "按需评估");
});
</script>

<template>
  <div class="catalog-card soft-card">
    <div class="cover" :style="cover ? { backgroundImage: `url(${cover})` } : undefined">
      <van-icon v-if="!cover" :name="type === 'product' ? 'apps-o' : 'service-o'" />
    </div>
    <div class="content">
      <div class="title">{{ title }}</div>
      <div class="subtitle">{{ subtitle }}</div>
      <div class="footer">
        <van-tag plain type="primary">{{ meta }}</van-tag>
        <span class="amount">{{ price }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-card {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 12px;
  padding: 10px;
}

.cover {
  display: grid;
  min-height: 96px;
  place-items: center;
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(22, 119, 255, 0.16), rgba(15, 118, 110, 0.14)),
    #eef3fb;
  background-position: center;
  background-size: cover;
  color: var(--theme-primary);
  font-size: 28px;
}

.content {
  min-width: 0;
}

.title {
  overflow: hidden;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subtitle {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 6px;
  color: var(--theme-muted);
  font-size: 13px;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
}
</style>
