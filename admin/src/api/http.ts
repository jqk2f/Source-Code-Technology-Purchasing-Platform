import type { ApiResponse, PageResult } from "@/shared";
import { useAuthStore } from "@/stores/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export interface RequestOptions extends RequestInit {
  params?: Record<string, unknown>;
}

function buildUrl(path: string, params?: Record<string, unknown>) {
  const url = new URL(`${baseURL}${path}`, window.location.origin);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const auth = useAuthStore();
  if (auth.token && !path.includes("/admin/auth/refresh")) {
    await auth.refreshIfNeeded();
  }

  const response = await fetch(buildUrl(path, options.params), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      ...(options.headers || {})
    },
    body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  });

  const payload = (await response.json()) as ApiResponse<T>;
  if (response.status === 401 || payload.code === 401001) {
    auth.logout();
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login?redirect=${redirect}`;
  }
  if (!response.ok || payload.code !== 0) {
    throw new Error(payload.message || "请求失败");
  }
  return payload.data;
}

export const http = {
  get: <T>(path: string, params?: Record<string, unknown>) => request<T>(path, { method: "GET", params }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body: body as BodyInit }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT", body: body as BodyInit }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  page: <T>(path: string, params?: Record<string, unknown>) => request<PageResult<T>>(path, { method: "GET", params })
};
