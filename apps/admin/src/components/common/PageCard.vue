<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
</script>

<template>
  <section class="page-card">
    <header class="page-card__header">
      <div>
        <h2>{{ title }}</h2>
        <p v-if="description">{{ description }}</p>
      </div>
      <div class="page-card__extra">
        <slot name="extra" />
      </div>
    </header>
    <div class="page-card__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.page-card {
  min-height: calc(100vh - 112px);
  height: calc(100vh - 112px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--theme-surface-bg);
  border: 1px solid var(--theme-border);
  border-radius: calc(var(--theme-radius) * 1px);
}

.page-card__header {
  min-height: 72px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--theme-border);
}

.page-card__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.page-card__header p {
  margin: 4px 0 0;
  color: var(--theme-muted);
  font-size: 12px;
}

.page-card__extra {
  flex-shrink: 0;
}

.page-card__body {
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
