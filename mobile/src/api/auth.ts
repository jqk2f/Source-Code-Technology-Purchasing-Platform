import { request } from "./http";

export interface CustomerProfile {
  id: number;
  nickname?: string;
  avatarUrl?: string;
  avatar_url?: string;
  mobile?: string;
  companyName?: string;
  company_name?: string;
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

export function mobileRegister(payload: { mobile: string; password?: string; nickname: string; companyName?: string }) {
  return request<AuthResult>("/mini/auth/wechat-login", {
    method: "POST",
    data: {
      code: `h5_register_${payload.mobile}`,
      nickname: payload.nickname,
      avatarUrl: "",
      mobile: payload.mobile,
      companyName: payload.companyName
    }
  });
}
