import type { ApiResponse } from "@/shared";
import { apiBaseUrl } from "@/config/app";

export const tokenKey = "source-shop-mobile-token";

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

function withQuery(path: string, params?: Record<string, unknown>) {
  const url = new URL(`${apiBaseUrl}${path}`, window.location.origin);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return `${url.pathname}${url.search}`;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method || "GET";
  const token = localStorage.getItem(tokenKey);
  const response = await fetch(withQuery(path, method === "GET" ? options.data || options.params : options.params), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    body: method === "GET" ? undefined : JSON.stringify(options.data || {})
  });
  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (response.ok && payload?.code === 0) {
    return payload.data;
  }
  throw new Error(payload?.message || "请求失败");
}
