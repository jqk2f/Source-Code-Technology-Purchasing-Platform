"use strict";

module.exports = (app) => {
  const { router, controller, middleware } = app;
  const customerAuth = middleware.auth({ type: "customer" });
  const adminAuth = middleware.auth({ type: "admin" });

  router.get("/api/v1/health", controller.health.index);

  router.post("/api/v1/mini/auth/wechat-login", controller.auth.miniLogin);
  router.get("/api/v1/mini/home", controller.mini.home);
  router.get("/api/v1/mini/categories", controller.mini.categories);
  router.get("/api/v1/mini/tags", controller.mini.tags);
  router.get("/api/v1/mini/products", controller.mini.products);
  router.get("/api/v1/mini/products/:id", controller.mini.productDetail);
  router.get("/api/v1/mini/services", controller.mini.services);
  router.get("/api/v1/mini/services/:id", controller.mini.serviceDetail);
  router.put("/api/v1/mini/profile", customerAuth, controller.mini.updateProfile);
  router.post("/api/v1/mini/inquiries", customerAuth, controller.mini.createInquiry);
  router.get("/api/v1/mini/inquiries", customerAuth, controller.mini.myInquiries);

  router.post("/api/v1/admin/auth/login", controller.auth.adminLogin);
  router.post("/api/v1/admin/auth/refresh", adminAuth, controller.auth.adminRefresh);
  router.get("/api/v1/admin/dashboard/overview", adminAuth, controller.admin.overview);
  router.get("/api/v1/admin/resources/:resource", adminAuth, controller.admin.listResource);
  router.post("/api/v1/admin/resources/:resource", adminAuth, controller.admin.createResource);
  router.put("/api/v1/admin/resources/:resource/:id", adminAuth, controller.admin.updateResource);
  router.delete("/api/v1/admin/resources/:resource/:id", adminAuth, controller.admin.deleteResource);
  router.get("/api/v1/admin/products", adminAuth, controller.admin.products);
  router.get("/api/v1/admin/services", adminAuth, controller.admin.services);
  router.get("/api/v1/admin/customers", adminAuth, controller.admin.customers);
  router.get("/api/v1/admin/inquiries", adminAuth, controller.admin.inquiries);
  router.post("/api/v1/admin/inquiries/:id/follow-logs", adminAuth, controller.admin.followInquiry);
};
