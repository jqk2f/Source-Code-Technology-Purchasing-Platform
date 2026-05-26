import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import MobileShell from "@/layouts/MobileShell.vue";
import { useAuthStore } from "@/stores/auth";

const routes: RouteRecordRaw[] = [
  { path: "/login", component: () => import("@/views/auth/LoginView.vue"), meta: { public: true, title: "登录" } },
  { path: "/register", component: () => import("@/views/auth/RegisterView.vue"), meta: { public: true, title: "注册" } },
  {
    path: "/",
    component: MobileShell,
    redirect: "/home",
    children: [
      { path: "home", component: () => import("@/views/HomeView.vue"), meta: { title: "首页" } },
      { path: "products", component: () => import("@/views/catalog/CatalogListView.vue"), meta: { title: "源码产品", catalogType: "product" } },
      { path: "products/:id", component: () => import("@/views/catalog/CatalogDetailView.vue"), meta: { title: "源码详情", catalogType: "product" } },
      { path: "services", component: () => import("@/views/catalog/CatalogListView.vue"), meta: { title: "技术服务", catalogType: "service" } },
      { path: "services/:id", component: () => import("@/views/catalog/CatalogDetailView.vue"), meta: { title: "服务详情", catalogType: "service" } },
      { path: "checkout", component: () => import("@/views/orders/OrderCreateView.vue"), meta: { title: "确认订单", auth: true } },
      { path: "inquiries", component: () => import("@/views/inquiries/InquiryListView.vue"), meta: { title: "我的询单", auth: true } },
      { path: "inquiries/create", component: () => import("@/views/inquiries/InquiryCreateView.vue"), meta: { title: "提交需求", auth: true } },
      { path: "orders", component: () => import("@/views/orders/OrderListView.vue"), meta: { title: "我的订单", auth: true } },
      { path: "orders/:id", component: () => import("@/views/orders/OrderDetailView.vue"), meta: { title: "订单详情", auth: true } },
      { path: "profile", component: () => import("@/views/ProfileView.vue"), meta: { title: "我的", auth: true } }
    ]
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.public) {
    return auth.token ? String(to.query.redirect || "/home") : true;
  }
  if (to.meta.auth && !auth.token) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }
  return true;
});
