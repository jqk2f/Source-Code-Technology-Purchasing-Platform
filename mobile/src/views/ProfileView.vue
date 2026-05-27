<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { showConfirmDialog, showToast } from "vant";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

const router = useRouter();
const auth = useAuthStore();
const theme = useThemeStore();
const saving = reactive({ profile: false });
const form = reactive({
  nickname: "",
  mobile: "",
  contactWechat: ""
});

const name = computed(() => auth.customer?.nickname || "移动端客户");
const mobile = computed(() => auth.customer?.mobile || "未绑定手机号");
const wechat = computed(() => auth.customer?.contactWechat || auth.customer?.contact_wechat || "未填写微信号");
const completion = computed(() => [form.nickname, form.mobile, form.contactWechat].filter(Boolean).length);

watch(
  () => auth.customer,
  (customer) => {
    form.nickname = customer?.nickname || "";
    form.mobile = customer?.mobile || "";
    form.contactWechat = customer?.contactWechat || customer?.contact_wechat || "";
  },
  { immediate: true }
);

async function saveProfile() {
  if (!form.nickname.trim()) {
    showToast("请填写称呼");
    return;
  }
  if (!form.mobile.trim() && !form.contactWechat.trim()) {
    showToast("手机号和微信号至少填写一项");
    return;
  }
  saving.profile = true;
  try {
    await auth.updateProfile({
      nickname: form.nickname.trim(),
      mobile: form.mobile.trim(),
      contactWechat: form.contactWechat.trim()
    });
    showToast("资料已更新");
  } catch (error) {
    showToast(error instanceof Error ? error.message : "保存失败");
  } finally {
    saving.profile = false;
  }
}

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
      <div class="profile-main">
        <h1>{{ name }}</h1>
        <p>{{ mobile }}</p>
      </div>
      <van-tag plain type="primary">{{ completion }}/3</van-tag>
    </section>

    <section class="soft-card edit-card">
      <div class="card-head">
        <strong>联系资料</strong>
        <span>用于客服回访和预约确认</span>
      </div>
      <van-form @submit="saveProfile">
        <van-field v-model="form.nickname" label="称呼" placeholder="怎么称呼您" clearable />
        <van-field v-model="form.mobile" label="手机号" type="tel" placeholder="手机号和微信号至少填一项" clearable />
        <van-field v-model="form.contactWechat" label="微信号" placeholder="便于客服添加沟通" clearable />
        <div class="save">
          <van-button block type="primary" native-type="submit" :loading="saving.profile">保存资料</van-button>
        </div>
      </van-form>
    </section>

    <section class="info-grid">
      <div class="info soft-card">
        <span>微信</span>
        <strong>{{ wechat }}</strong>
      </div>
      <div class="info soft-card">
        <span>账号状态</span>
        <strong>正常</strong>
      </div>
    </section>

    <section class="soft-card guide">
      <div>
        <strong>预约沟通建议</strong>
        <p>提交预约前可先查看源码演示、价格、交付内容和购买须知，描述越具体，客服确认越快。</p>
      </div>
      <van-icon name="bulb-o" />
    </section>

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
  background:
    linear-gradient(135deg, rgba(22, 119, 255, 0.11), rgba(15, 118, 110, 0.1)),
    #fff;
}

.avatar {
  display: grid;
  width: 58px;
  height: 58px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--theme-primary), #0f766e);
  color: #fff;
  font-size: 24px;
  font-weight: 800;
}

.profile-main {
  flex: 1;
  min-width: 0;
}

h1 {
  margin: 0 0 6px;
  font-size: 20px;
}

p {
  margin: 0;
  color: var(--theme-muted);
  font-size: 13px;
  line-height: 1.6;
}

.edit-card {
  margin-top: 12px;
  padding: 8px 0 16px;
}

.card-head {
  display: grid;
  gap: 4px;
  padding: 12px 16px 8px;
}

.card-head strong {
  font-size: 17px;
}

.card-head span,
.info span {
  color: var(--theme-muted);
  font-size: 12px;
}

.save {
  padding: 16px 16px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.info {
  display: grid;
  gap: 8px;
  padding: 14px;
}

.info strong {
  overflow: hidden;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.guide {
  display: flex;
  gap: 14px;
  align-items: center;
  margin: 12px 0;
  padding: 16px;
}

.guide strong {
  font-size: 16px;
}

.guide .van-icon {
  color: var(--theme-primary);
  font-size: 30px;
}

.logout {
  padding: 18px 16px 0;
}
</style>
