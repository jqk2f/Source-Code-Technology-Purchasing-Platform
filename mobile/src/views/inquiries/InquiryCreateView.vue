<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import { createInquiry, type InquiryPayload } from "@/api/inquiry";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const form = reactive({
  sourceType: (route.query.sourceType === "service" ? "service" : "product") as InquiryPayload["sourceType"],
  sourceId: route.query.sourceId ? Number(route.query.sourceId) : undefined,
  title: String(route.query.title || ""),
  contactName: auth.customer?.nickname || "",
  contactMobile: auth.customer?.mobile || "",
  contactWechat: auth.customer?.contactWechat || auth.customer?.contact_wechat || "",
  description: ""
});

async function submit() {
  if (!form.title.trim()) {
    showToast("请填写预约标题");
    return;
  }
  if (!form.contactMobile.trim() && !form.contactWechat.trim()) {
    showToast("请至少填写手机号或微信号");
    return;
  }
  loading.value = true;
  try {
    await createInquiry({ ...form });
    showToast("预约已提交");
    router.replace("/inquiries");
  } catch (error) {
    showToast(error instanceof Error ? error.message : "提交失败");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="mobile-page page-with-nav">
    <button class="page-back" type="button" aria-label="返回" @click="router.back()">
      <van-icon name="arrow-left" />
    </button>
    <van-form class="soft-card form" @submit="submit">
      <div class="form-head">
        <strong>预约服务</strong>
      </div>
      <van-field v-model="form.title" label="标题" placeholder="例如：预约源码部署沟通" clearable />
      <van-field v-model="form.description" label="预约说明" type="textarea" rows="4" autosize placeholder="想了解的内容、期望沟通时间或补充说明" />
      <van-field v-model="form.contactName" label="联系人" placeholder="姓名" clearable />
      <van-field v-model="form.contactMobile" label="手机号" type="tel" placeholder="手机号和微信至少填一项" clearable />
      <van-field v-model="form.contactWechat" label="微信" placeholder="选填" clearable />
      <div class="submit">
        <van-button block type="primary" native-type="submit" :loading="loading">提交预约</van-button>
      </div>
    </van-form>
  </main>
</template>

<style scoped>
.form {
  padding: 8px 0 16px;
}

.form-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 8px;
}

.form-head strong {
  font-size: 18px;
}

.submit {
  padding: 18px 16px 0;
}

</style>
