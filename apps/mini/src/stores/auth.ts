import { defineStore } from "pinia";
import { mobileLogin } from "@/api/auth";

const tokenKey = "source-shop-mobile-token";
const deviceKey = "source-shop-mobile-device";

function getDeviceId() {
  const saved = uni.getStorageSync(deviceKey);
  if (saved) return String(saved);
  const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  uni.setStorageSync(deviceKey, id);
  return id;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: uni.getStorageSync(tokenKey) || "",
    customer: null as null | { id: number; nickname?: string; avatarUrl?: string; mobile?: string }
  }),
  actions: {
    async ensureLogin() {
      if (this.token) return;
      const result = await mobileLogin(getDeviceId());
      this.token = result.token;
      this.customer = result.customer;
      uni.setStorageSync(tokenKey, result.token);
    },
    logout() {
      this.token = "";
      this.customer = null;
      uni.removeStorageSync(tokenKey);
    }
  }
});
