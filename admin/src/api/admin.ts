import type { DashboardOverview } from "@/shared";
import { http } from "./http";

export interface LoginResult {
  token: string;
  user: { id: number; username: string; realName?: string };
  roles: Array<{ code: string; name: string }>;
  permissions: Array<{ code: string; name: string; type: string; path?: string }>;
}

export function login(username: string, password: string) {
  return http.post<LoginResult>("/admin/auth/login", { username, password });
}

export function refreshToken() {
  return http.post<LoginResult>("/admin/auth/refresh");
}

export function getOverview() {
  return http.get<DashboardOverview>("/admin/dashboard/overview");
}
