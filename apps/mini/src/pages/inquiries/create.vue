<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
import { createInquiry } from "@/api/inquiry";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

const auth = useAuthStore();
const theme = useThemeStore();
const submitting = ref(false);
const form = reactive({
  sourceType: "custom" as "product" | "service" | "custom" | "bundle",
  sourceId: undefined as number | undefined,
  title: "",
  demandType: "source_purchase",
  description: "",
  contactName: "",
  contactMobile: "",
  contactWechat: "",
  budgetMin: undefined as number | undefined,
  budgetMax: undefined as number | undefined
});

onLoad((query = {}) => {
  form.sourceType = (query.sourceType as any) || "custom";
  form.sourceId = query.sourceId ? Number(query.sourceId) : undefined;
  form.title = decodeURIComponent(String(query.title || ""));
});

async function submit() {
  if (!form.title) {
    uni.showToast({ title: "请填写标题", icon: "none" });
    return;
  }
  submitting.value = true;
  try {
    await auth.ensureLogin();
    const result = await createInquiry(form);
    uni.showModal({
      title: "提交成功",
      content: `询单号：${result.inquiryNo}，管理员将联系确认价格和交付方式。`,
      showCancel: false,
      success: () => uni.switchTab({ url: "/pages/orders/list" })
    });
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <view class="page" :style="theme.cssVars">
    <view class="card form">
      <label>需求标题</label>
      <input v-model="form.title" placeholder="例如：购买商城源码并部署" />

      <label>需求说明</label>
      <textarea v-model="form.description" placeholder="请补充购买数量、是否需要部署、二开需求、当前环境等" />

      <label>联系人</label>
      <input v-model="form.contactName" placeholder="请输入联系人" />

      <label>手机号</label>
      <input v-model="form.contactMobile" type="number" placeholder="请输入手机号" />

      <label>微信号</label>
      <input v-model="form.contactWechat" placeholder="请输入微信号" />

      <label>预算范围</label>
      <view class="budget">
        <input v-model.number="form.budgetMin" type="number" placeholder="最低预算" />
        <text>-</text>
        <input v-model.number="form.budgetMax" type="number" placeholder="最高预算" />
      </view>

      <button class="btn-primary submit" :loading="submitting" @tap="submit">提交给管理员确认</button>
    </view>
  </view>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}
label {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: var(--theme-muted);
}
input,
textarea {
  min-height: 84rpx;
  padding: 0 20rpx;
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius);
  box-sizing: border-box;
  background: #fff;
}
textarea {
  height: 180rpx;
  padding-top: 18rpx;
}
.budget {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.budget input {
  flex: 1;
}
.submit {
  margin-top: 30rpx;
  width: 100%;
}
</style>
