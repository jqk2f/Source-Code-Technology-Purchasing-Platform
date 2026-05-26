<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import { appName } from "@/config/app";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const form = reactive({
  account: "",
  password: ""
});

async function submit() {
  if (!form.account.trim()) {
    showToast("请输入手机号或账号");
    return;
  }
  loading.value = true;
  try {
    await auth.login(form);
    showToast("登录成功");
    router.replace(String(route.query.redirect || "/home"));
  } catch (error) {
    showToast(error instanceof Error ? error.message : "登录失败");
  } finally {
    loading.value = false;
  }
}

async function guestLogin() {
  loading.value = true;
  try {
    await auth.ensureGuestLogin();
    router.replace(String(route.query.redirect || "/home"));
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="brand">
      <div class="brand-mark">源</div>
      <h1>{{ appName }}</h1>
      <p>源码选购、技术服务、询单报价、订单交付一站式移动端</p>
    </section>

    <van-form class="auth-card soft-card" @submit="submit">
      <van-field v-model="form.account" name="account" label="账号" placeholder="手机号 / 客户账号" clearable />
      <van-field v-model="form.password" name="password" label="密码" type="password" placeholder="可留空体验" clearable />
      <div class="actions">
        <van-button block type="primary" native-type="submit" :loading="loading">登录</van-button>
        <van-button block plain type="primary" :loading="loading" @click="guestLogin">体验进入</van-button>
      </div>
    </van-form>

    <div class="switch">
      还没有账号？
      <RouterLink :to="{ path: '/register', query: route.query }">立即注册</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  padding: 46px 18px 24px;
  background:
    radial-gradient(circle at 20% 0%, rgba(22, 119, 255, 0.18), transparent 34%),
    linear-gradient(180deg, #f7fbff 0%, #f4f7fb 48%, #ffffff 100%);
}

.brand {
  margin-bottom: 28px;
}

.brand-mark {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border-radius: 8px;
  background: linear-gradient(135deg, #1677ff, #0f766e);
  color: #fff;
  font-size: 24px;
  font-weight: 800;
}

h1 {
  margin: 18px 0 8px;
  font-size: 28px;
  line-height: 1.25;
}

p {
  margin: 0;
  color: var(--theme-muted);
  font-size: 14px;
  line-height: 1.6;
}

.auth-card {
  padding: 10px 0 16px;
}

.actions {
  display: grid;
  gap: 10px;
  padding: 18px 16px 0;
}

.switch {
  margin-top: 18px;
  color: var(--theme-muted);
  text-align: center;
}

.switch a {
  color: var(--theme-primary);
  font-weight: 700;
}
</style>
