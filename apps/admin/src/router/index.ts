import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import { useAuthStore } from "@/stores/auth";

export const resourceRoutes = [
  { path: "products", title: "源码产品", endpoint: "/admin/products", columns: ["id", "title", "price", "status", "viewCount", "dealCount", "createdAt"] },
  { path: "services", title: "技术服务", endpoint: "/admin/services", columns: ["id", "name", "startPrice", "status", "viewCount", "dealCount", "createdAt"] },
  { path: "inquiries", title: "询单管理", endpoint: "/admin/inquiries", columns: ["id", "inquiryNo", "title", "customerNickname", "status", "quoteAmount", "createdAt"] },
  { path: "orders", title: "订单管理", endpoint: "/admin/orders", columns: ["id", "orderNo", "title", "customerNickname", "payableAmount", "paidAmount", "status", "createdAt"] },
  { path: "payments", title: "收款记录", endpoint: "/admin/payment-records", columns: ["id", "paymentNo", "orderId", "amount", "paymentMethod", "status", "createdAt"] },
  { path: "deliveries", title: "交付管理", endpoint: "/admin/deliveries", columns: ["id", "deliveryNo", "orderId", "type", "title", "status", "createdAt"] },
  { path: "after-sales", title: "售后工单", endpoint: "/admin/after-sales", columns: ["id", "ticketNo", "orderId", "type", "title", "status", "createdAt"] },
  { path: "customers", title: "客户管理", endpoint: "/admin/customers", columns: ["id", "nickname", "mobile", "contactWechat", "source", "status", "createdAt"] }
] as const;

const routes: RouteRecordRaw[] = [
  { path: "/login", component: () => import("@/views/LoginView.vue") },
  {
    path: "/",
    component: AdminLayout,
    redirect: "/dashboard",
    children: [
      { path: "dashboard", component: () => import("@/views/DashboardView.vue"), meta: { title: "经营概览" } },
      ...resourceRoutes.map((item) => ({
        path: item.path,
        component: () => import("@/views/ResourceListView.vue"),
        meta: item
      })),
      { path: "settings", component: () => import("@/views/SettingsView.vue"), meta: { title: "主题配置" } }
    ]
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  auth.hydrate();
  if (to.path !== "/login" && !auth.token) return "/login";
  if (to.path === "/login" && auth.token) return "/dashboard";
  return true;
});
