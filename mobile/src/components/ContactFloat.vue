<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { showToast } from "vant";
import { contactPhone, contactWechat, serviceTime } from "@/config/app";

const visible = ref(false);
const collapsed = ref(false);
const dragging = ref(false);
const moved = ref(false);
const position = reactive({ x: 0, y: 0 });
const drag = reactive({ startX: 0, startY: 0, originX: 0, originY: 0 });
const floatStyle = computed(() => ({
  left: `${position.x}px`,
  top: `${position.y}px`
}));

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function resetPosition() {
  const width = collapsed.value ? 44 : 62;
  position.x = window.innerWidth - width - 14;
  position.y = window.innerHeight - 132;
}

function open() {
  if (moved.value) return;
  visible.value = true;
}

function toggleCollapse() {
  collapsed.value = !collapsed.value;
  resetPosition();
}

function onPointerDown(event: PointerEvent) {
  dragging.value = true;
  moved.value = false;
  drag.startX = event.clientX;
  drag.startY = event.clientY;
  drag.originX = position.x;
  drag.originY = position.y;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return;
  const width = collapsed.value ? 44 : 62;
  const height = collapsed.value ? 44 : 58;
  const nextX = drag.originX + event.clientX - drag.startX;
  const nextY = drag.originY + event.clientY - drag.startY;
  if (Math.abs(event.clientX - drag.startX) > 3 || Math.abs(event.clientY - drag.startY) > 3) moved.value = true;
  position.x = clamp(nextX, 8, window.innerWidth - width - 8);
  position.y = clamp(nextY, 8, window.innerHeight - height - 58);
}

function onPointerUp(event: PointerEvent) {
  dragging.value = false;
  (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
  window.setTimeout(() => {
    moved.value = false;
  }, 0);
}

async function copy(value: string, label: string) {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    showToast(`${label}已复制`);
  } catch {
    showToast(value);
  }
}

onMounted(() => {
  resetPosition();
  window.addEventListener("resize", resetPosition);
  window.addEventListener("open-contact-panel", open);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resetPosition);
  window.removeEventListener("open-contact-panel", open);
});
</script>

<template>
  <div
    class="contact-float"
    :class="{ collapsed, dragging }"
    :style="floatStyle"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <button class="main" type="button" aria-label="联系客服" @click="open">
      <van-icon name="chat-o" />
      <span v-if="!collapsed">客服</span>
    </button>
    <button class="collapse" type="button" :aria-label="collapsed ? '展开客服按钮' : '收起客服按钮'" @click.stop="toggleCollapse">
      <van-icon :name="collapsed ? 'arrow-left' : 'arrow'" />
    </button>
  </div>

  <van-popup v-model:show="visible" round position="bottom" safe-area-inset-bottom>
    <section class="contact-panel">
      <header>
        <strong>联系咨询</strong>
        <button type="button" aria-label="关闭" @click="visible = false">
          <van-icon name="cross" />
        </button>
      </header>
      <van-cell title="客服微信" :value="contactWechat" is-link @click="copy(contactWechat, '客服微信')" />
      <van-cell v-if="contactPhone" title="联系电话" :value="contactPhone" is-link @click="copy(contactPhone, '联系电话')" />
      <van-cell title="服务时间" :value="serviceTime" />
      <div class="tip">添加客服时请备注关注的源码、服务或需求，方便快速沟通。</div>
    </section>
  </van-popup>
</template>

<style scoped>
.contact-float {
  position: fixed;
  z-index: 20;
  display: flex;
  align-items: center;
  width: 62px;
  height: 58px;
  touch-action: none;
  user-select: none;
  transition:
    width 0.18s ease,
    transform 0.18s ease;
}

.contact-float.dragging {
  transition: none;
}

.contact-float.collapsed {
  width: 44px;
  height: 44px;
}

.main {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: var(--theme-primary);
  color: #fff;
  box-shadow: 0 10px 28px rgba(22, 119, 255, 0.28);
}

.collapsed .main {
  width: 44px;
  height: 44px;
}

.main .van-icon {
  font-size: 20px;
}

.main span {
  margin-top: -6px;
  font-size: 11px;
  line-height: 1;
}

.collapse {
  display: grid;
  width: 20px;
  height: 26px;
  margin-left: -10px;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: #fff;
  color: var(--theme-primary);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.14);
}

.collapsed .collapse {
  width: 18px;
  height: 22px;
}

.contact-panel {
  padding: 16px 16px calc(18px + env(safe-area-inset-bottom));
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

header strong {
  font-size: 18px;
}

header button {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: #f3f4f6;
  color: var(--theme-muted);
}

.tip {
  margin-top: 12px;
  color: var(--theme-muted);
  font-size: 13px;
  line-height: 1.6;
}
</style>
