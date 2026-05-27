<script setup lang="ts">
import { message } from "ant-design-vue";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

const router = useRouter();
const auth = useAuthStore();
const theme = useThemeStore();
const loading = ref(false);
const form = reactive({ username: "admin", password: "admin123" });

async function submit() {
  if (loading.value) return;
  if (!form.username || !form.password) {
    message.warning("请输入用户名和密码");
    return;
  }

  loading.value = true;
  try {
    await auth.login(form.username, form.password);
    message.success("登录成功");
    router.push("/dashboard");
  } catch (error) {
    message.error(error instanceof Error ? error.message : "登录失败");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="min-h-screen grid grid-cols-[1.05fr_0.95fr] bg-page">
    <section class="p-12 flex flex-col justify-between">
      <div class="text-xl font-semibold text-brand">{{ theme.tokens.brandName }}</div>
      <div class="max-w-xl">
        <h1 class="text-4xl font-bold leading-tight mb-5">源码产品与技术服务管理后台</h1>
        <p class="text-gray-600 text-base leading-8">
          维护商品服务，跟进客户预约和联系资料。当前版本聚焦预约沟通。
        </p>
      </div>
      <div class="text-sm text-gray-500">MVP 默认账号：admin / admin123</div>
    </section>

    <section class="bg-white p-12 flex items-center justify-center">
      <a-card class="w-[420px]" :bordered="false">
        <h2 class="text-2xl font-semibold mb-6">后台登录</h2>
        <a-form layout="vertical" @finish="submit" @submit.prevent="submit">
          <a-form-item label="用户名" required>
            <a-input v-model:value="form.username" size="large" autocomplete="username" @press-enter="submit" />
          </a-form-item>
          <a-form-item label="密码" required>
            <a-input-password
              v-model:value="form.password"
              size="large"
              autocomplete="current-password"
              @press-enter="submit"
            />
          </a-form-item>
          <a-button type="primary" html-type="submit" size="large" block :loading="loading" @click="submit">
            登录
          </a-button>
        </a-form>
      </a-card>
    </section>
  </main>
</template>
