import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { resourceConfigs } from "@/config/resources";
import { useAuthStore } from "@/stores/auth";

const routes: RouteRecordRaw[] = [
  { path: "/login", component: () => import("@/views/LoginView.vue"), meta: { public: true, title: "后台登录" } },
  {
    path: "/",
    component: AdminLayout,
    redirect: "/dashboard",
    children: [
      { path: "dashboard", component: () => import("@/views/DashboardView.vue"), meta: { title: "经营概览" } },
      ...resourceConfigs.map((item) => ({
        path: item.path,
        component: () => import("@/views/ResourceListView.vue"),
        meta: { title: item.title, resourceKey: item.key }
      })),
      { path: "settings", component: () => import("@/views/SettingsView.vue"), meta: { title: "主题配置" } }
    ]
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  auth.hydrate();

  if (to.meta.public) {
    if (auth.token) {
      const ok = await auth.refreshIfNeeded();
      if (ok) return String(to.query.redirect || "/dashboard");
    }
    return true;
  }

  if (!auth.token) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  const ok = await auth.refreshIfNeeded();
  if (!ok) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }

  return true;
});
