import { defineStore } from "pinia";
import { login as loginApi, refreshToken, type LoginResult } from "@/api/admin";
import { isTokenExpiringSoon, parseJwt } from "@/utils/authToken";

const storageKey = "source-shop-admin-auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    user: null as LoginResult["user"] | null,
    permissions: [] as string[]
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token)
  },
  actions: {
    hydrate() {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      Object.assign(this, JSON.parse(raw));
    },
    persist() {
      localStorage.setItem(storageKey, JSON.stringify({ token: this.token, user: this.user, permissions: this.permissions }));
    },
    async login(username: string, password: string) {
      const result = await loginApi(username, password);
      this.token = result.token;
      this.user = result.user;
      this.permissions = result.permissions.map((item) => item.code);
      this.persist();
    },
    async refreshIfNeeded(force = false) {
      if (!this.token) return false;
      const payload = parseJwt(this.token);
      if (!payload?.exp || payload.exp * 1000 <= Date.now()) {
        this.logout();
        return false;
      }
      if (!force && !isTokenExpiringSoon(this.token)) return true;
      const result = await refreshToken();
      this.token = result.token;
      this.user = result.user;
      this.permissions = result.permissions.map((item) => item.code);
      this.persist();
      return true;
    },
    logout() {
      this.token = "";
      this.user = null;
      this.permissions = [];
      localStorage.removeItem(storageKey);
    }
  }
});
