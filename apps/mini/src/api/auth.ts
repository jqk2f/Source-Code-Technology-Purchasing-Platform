import { request } from "./http";

export function miniLogin(code: string) {
  return request<{ token: string; customer: { id: number; nickname?: string; avatarUrl?: string; mobile?: string } }>(
    "/mini/auth/wechat-login",
    {
      method: "POST",
      data: { code }
    }
  );
}
