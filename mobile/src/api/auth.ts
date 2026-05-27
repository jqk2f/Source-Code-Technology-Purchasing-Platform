import { request } from "./http";

export interface CustomerProfile {
  id: number;
  nickname?: string;
  avatarUrl?: string;
  avatar_url?: string;
  mobile?: string;
  contactWechat?: string;
  contact_wechat?: string;
}

export interface AuthResult {
  token: string;
  customer: CustomerProfile;
}

export function mobileLogin(payload: { account: string; password?: string; nickname?: string }) {
  return request<AuthResult>("/mini/auth/wechat-login", {
    method: "POST",
    data: {
      code: `h5_${payload.account}`,
      nickname: payload.nickname || payload.account || "移动端客户",
      avatarUrl: ""
    }
  });
}

export function mobileRegister(payload: { mobile: string; password?: string; nickname: string; contactWechat?: string }) {
  return request<AuthResult>("/mini/auth/wechat-login", {
    method: "POST",
    data: {
      code: `h5_register_${payload.mobile}`,
      nickname: payload.nickname,
      avatarUrl: "",
      mobile: payload.mobile,
      contactWechat: payload.contactWechat
    }
  });
}

export function updateCustomerProfile(payload: { nickname: string; mobile: string; contactWechat: string }) {
  return request<CustomerProfile>("/mini/profile", {
    method: "PUT",
    data: payload
  });
}
