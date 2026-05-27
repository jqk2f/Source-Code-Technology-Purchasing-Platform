<script setup lang="ts">
import { computed } from "vue";
import { formatMoney, pickValue } from "@/utils/format";

const props = defineProps<{
  item: Record<string, unknown>;
  type: "product" | "service";
}>();

const title = computed(() => String(pickValue(props.item, "title", "name") || "未命名"));
const subtitle = computed(() => {
  if (props.type === "service") return String(pickValue(props.item, "subtitle") || "技术服务可预约沟通");
  return String(pickValue(props.item, "featureIntro", "feature_intro") || "源码产品可预约沟通");
});
const cover = computed(() => String(pickValue(props.item, "coverUrl", "cover_url") || ""));
const price = computed(() => formatMoney(pickValue(props.item, props.type === "service" ? "startPrice" : "price", props.type === "service" ? "start_price" : "price")));
const meta = computed(() => {
  if (props.type === "product") return String(pickValue(props.item, "techStack", "tech_stack") || "可预约");
  return String(pickValue(props.item, "serviceMethod", "service_method") || "按需沟通");
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
