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
  nickname: "",
  mobile: "",
  companyName: "",
  password: ""
});

async function submit() {
  if (!form.nickname.trim() || !form.mobile.trim()) {
    showToast("请填写称呼和手机号");
    return;
  }
  loading.value = true;
  try {
    await auth.register(form);
    showToast("注册成功");
    router.replace(String(route.query.redirect || "/home"));
  } catch (error) {
    showToast(error instanceof Error ? error.message : "注册失败");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="auth-page">
    <button class="page-back" type="button" aria-label="返回" @click="router.back()">
      <van-icon name="arrow-left" />
    </button>
    <section class="brand">
      <div class="brand-mark">技</div>
      <h1>{{ appName }}</h1>
      <p>建立客户档案后，可持续追踪需求、订单、付款和服务进度。</p>
    </section>

    <van-form class="auth-card soft-card" @submit="submit">
      <van-field v-model="form.nickname" name="nickname" label="称呼" placeholder="联系人姓名" clearable />
      <van-field v-model="form.mobile" name="mobile" label="手机号" type="tel" placeholder="用于项目沟通" clearable />
      <van-field v-model="form.companyName" name="companyName" label="公司" placeholder="选填" clearable />
      <van-field v-model="form.password" name="password" label="密码" type="password" placeholder="可留空" clearable />
      <div class="actions">
        <van-button block type="primary" native-type="submit" :loading="loading">注册并进入</van-button>
      </div>
    </van-form>

    <div class="switch">
      已有账号？
      <RouterLink :to="{ path: '/login', query: route.query }">去登录</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  padding: 24px 18px;
  background:
    radial-gradient(circle at 82% 0%, rgba(15, 118, 110, 0.16), transparent 34%),
    linear-gradient(180deg, #f8fbff 0%, #f5f7fb 50%, #ffffff 100%);
}

.brand {
  margin: 22px 0 24px;
}

.brand-mark {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border-radius: 8px;
  background: linear-gradient(135deg, #0f766e, #7c3aed);
  color: #fff;
  font-size: 24px;
  font-weight: 800;
}

h1 {
  margin: 18px 0 8px;
  font-size: 26px;
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
