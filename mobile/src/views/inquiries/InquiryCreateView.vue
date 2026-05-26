<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast } from "vant";
import { createInquiry, type InquiryPayload } from "@/api/inquiry";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const form = reactive({
  sourceType: String(route.query.sourceType || "custom") as InquiryPayload["sourceType"],
  sourceId: route.query.sourceId ? Number(route.query.sourceId) : undefined,
  title: String(route.query.title || ""),
  contactName: "",
  contactMobile: "",
  contactWechat: "",
  budgetMin: "",
  budgetMax: "",
  description: ""
});

const sourceOptions = [
  { text: "源码产品", value: "product" },
  { text: "技术服务", value: "service" },
  { text: "定制需求", value: "custom" },
  { text: "组合方案", value: "bundle" }
];

async function submit() {
  if (!form.title.trim()) {
    showToast("请填写需求标题");
    return;
  }
  loading.value = true;
  try {
    const payload: InquiryPayload = {
      ...form,
      budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
      budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined
    };
    await createInquiry(payload);
    showToast("询单已提交");
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
      <van-field v-model="form.sourceType" name="sourceType" label="来源类型" is-link readonly>
        <template #input>
          <van-radio-group v-model="form.sourceType" direction="horizontal">
            <van-radio v-for="item in sourceOptions" :key="item.value" :name="item.value">{{ item.text }}</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field v-model="form.title" label="标题" placeholder="例如：CRM 系统二开与部署" clearable />
      <van-field v-model="form.description" label="需求说明" type="textarea" rows="4" autosize placeholder="业务目标、功能范围、交付时间等" />
      <van-field v-model="form.contactName" label="联系人" placeholder="姓名" clearable />
      <van-field v-model="form.contactMobile" label="手机号" type="tel" placeholder="用于报价沟通" clearable />
      <van-field v-model="form.contactWechat" label="微信" placeholder="选填" clearable />
      <van-field v-model="form.budgetMin" label="预算下限" type="number" placeholder="选填" />
      <van-field v-model="form.budgetMax" label="预算上限" type="number" placeholder="选填" />
      <div class="submit">
        <van-button block type="primary" native-type="submit" :loading="loading">提交询单</van-button>
      </div>
    </van-form>
  </main>
</template>

<style scoped>
.form {
  padding: 8px 0 16px;
}

.submit {
  padding: 18px 16px 0;
}

:deep(.van-radio-group) {
  flex-wrap: wrap;
  gap: 8px 12px;
}
</style>
