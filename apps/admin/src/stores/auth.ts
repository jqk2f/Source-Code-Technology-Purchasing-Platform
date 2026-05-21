import { defineStore } from "pinia";
import { login as loginApi, type LoginResult } from "@/api/admin";

const storageKey = "source-shop-admin-auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    user: null as LoginResult["user"] | null,
    permissions: [] as string[]
  }),
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
    logout() {
      this.token = "";
      this.user = null;
      this.permissions = [];
      localStorage.removeItem(storageKey);
    }
  }
});
