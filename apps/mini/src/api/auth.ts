import { request } from "./http";

export function mobileLogin(deviceId: string) {
  return request<{ token: string; customer: { id: number; nickname?: string; avatarUrl?: string; mobile?: string } }>(
    "/mini/auth/wechat-login",
    {
      method: "POST",
      data: {
        code: `h5_${deviceId}`,
        nickname: "H5客户",
        avatarUrl: ""
      }
    }
  );
}
