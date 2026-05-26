import { defineStore } from "pinia";
import { mobileLogin, mobileRegister, type CustomerProfile } from "@/api/auth";
import { tokenKey } from "@/api/http";

const deviceKey = "source-shop-mobile-device";
const customerKey = "source-shop-mobile-customer";

function getDeviceId() {
  const saved = localStorage.getItem(deviceKey);
  if (saved) return String(saved);
  const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  localStorage.setItem(deviceKey, id);
  return id;
}

function readCustomer() {
  const raw = localStorage.getItem(customerKey);
  return raw ? (JSON.parse(raw) as CustomerProfile) : null;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem(tokenKey) || "",
    customer: readCustomer()
  }),
  actions: {
    persist(token: string, customer: CustomerProfile) {
      this.token = token;
      this.customer = customer;
      localStorage.setItem(tokenKey, token);
      localStorage.setItem(customerKey, JSON.stringify(customer));
    },
    async login(payload: { account: string; password?: string }) {
      const result = await mobileLogin({ account: payload.account || getDeviceId(), password: payload.password });
      this.persist(result.token, result.customer);
    },
    async register(payload: { mobile: string; password?: string; nickname: string; companyName?: string }) {
      const result = await mobileRegister(payload);
      this.persist(result.token, { ...result.customer, mobile: payload.mobile, companyName: payload.companyName });
    },
    async ensureGuestLogin() {
      if (this.token) return;
      const result = await mobileLogin({ account: getDeviceId(), nickname: "体验客户" });
      this.persist(result.token, result.customer);
    },
    logout() {
      this.token = "";
      this.customer = null;
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(customerKey);
    }
  }
});
