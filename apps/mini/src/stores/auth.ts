import { defineStore } from "pinia";
import { miniLogin } from "@/api/auth";

const tokenKey = "source-shop-mini-token";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: uni.getStorageSync(tokenKey) || "",
    customer: null as null | { id: number; nickname?: string; avatarUrl?: string; mobile?: string }
  }),
  actions: {
    async ensureLogin() {
      if (this.token) return;
      const loginResult = await uni.login();
      const result = await miniLogin(loginResult.code || `${Date.now()}`);
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
