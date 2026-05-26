<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { showConfirmDialog } from "vant";
import { clientModules } from "@/config/modules";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

const router = useRouter();
const auth = useAuthStore();
const theme = useThemeStore();
const name = computed(() => auth.customer?.nickname || "移动端客户");
const mobile = computed(() => auth.customer?.mobile || "未绑定手机号");
const modules = clientModules.filter((item) => item.authRequired);

async function logout() {
  const confirmed = await showConfirmDialog({ title: "退出登录", message: "确认退出当前账号？" }).then(
    () => true,
    () => false
  );
  if (!confirmed) return;
  auth.logout();
  router.replace("/login");
}

function setTheme(primaryColor: string, pageBg: string) {
  theme.updateTheme({ primaryColor, pageBg });
}
</script>

<template>
  <main class="mobile-page page-with-nav">
    <section class="profile soft-card">
      <div class="avatar">{{ name.slice(0, 1) }}</div>
      <div>
        <h1>{{ name }}</h1>
        <p>{{ mobile }}</p>
      </div>
    </section>

    <van-grid :column-num="3" :border="false" class="grid">
      <van-grid-item v-for="item in modules" :key="item.key" :icon="item.icon" :text="item.title" @click="router.push(item.route)" />
    </van-grid>

    <van-cell-group inset title="客户资料">
      <van-cell title="客户编号" :value="String(auth.customer?.id || '-')" />
      <van-cell title="公司名称" :value="auth.customer?.companyName || auth.customer?.company_name || '未填写'" />
      <van-cell title="账号状态" value="正常" />
    </van-cell-group>

    <van-cell-group inset title="主题">
      <van-cell title="科技蓝" is-link @click="setTheme('#1677ff', '#f5f7fb')" />
      <van-cell title="服务绿" is-link @click="setTheme('#0f766e', '#f4f8f6')" />
      <van-cell title="商务紫" is-link @click="setTheme('#7c3aed', '#f7f5fb')" />
    </van-cell-group>

    <div class="logout">
      <van-button block plain type="danger" @click="logout">退出登录</van-button>
    </div>
  </main>
</template>

<style scoped>
.profile {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
}

.avatar {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--theme-primary), #0f766e);
  color: #fff;
  font-size: 24px;
  font-weight: 800;
}

h1 {
  margin: 0 0 6px;
  font-size: 20px;
}

p {
  margin: 0;
  color: var(--theme-muted);
}

.grid {
  margin: 12px -4px;
  overflow: hidden;
  border-radius: 8px;
}

.logout {
  padding: 18px 16px 0;
}
</style>
