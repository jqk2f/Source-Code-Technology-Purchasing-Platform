import type { ApiResponse } from "@source-shop/shared";
import { apiBaseUrl } from "@/config/app";

type MobileRequestOptions = Omit<UniApp.RequestOptions, "url">;

const tokenKey = "source-shop-mobile-token";

export function request<T>(path: string, options: MobileRequestOptions = {}): Promise<T> {
  const token = uni.getStorageSync(tokenKey);
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      url: `${apiBaseUrl}${path}`,
      header: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...((options.header as Record<string, string>) || {})
      },
      success(res) {
        const payload = res.data as ApiResponse<T>;
        if (res.statusCode >= 200 && res.statusCode < 300 && payload.code === 0) {
          resolve(payload.data);
        } else {
          reject(new Error(payload?.message || "请求失败"));
        }
      },
      fail: reject
    });
  });
}
