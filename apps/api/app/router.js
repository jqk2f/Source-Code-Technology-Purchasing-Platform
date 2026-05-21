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
  router.post("/api/v1/mini/inquiries", customerAuth, controller.mini.createInquiry);
  router.get("/api/v1/mini/inquiries", customerAuth, controller.mini.myInquiries);
  router.get("/api/v1/mini/orders", customerAuth, controller.mini.myOrders);
  router.get("/api/v1/mini/orders/:id", customerAuth, controller.mini.orderDetail);
  router.post("/api/v1/mini/orders/:id/payment-vouchers", customerAuth, controller.mini.uploadPaymentVoucher);

  router.post("/api/v1/admin/auth/login", controller.auth.adminLogin);
  router.get("/api/v1/admin/dashboard/overview", adminAuth, controller.admin.overview);
  router.get("/api/v1/admin/products", adminAuth, controller.admin.products);
  router.get("/api/v1/admin/services", adminAuth, controller.admin.services);
  router.get("/api/v1/admin/customers", adminAuth, controller.admin.customers);
  router.get("/api/v1/admin/inquiries", adminAuth, controller.admin.inquiries);
  router.post("/api/v1/admin/inquiries/:id/follow-logs", adminAuth, controller.admin.followInquiry);
  router.post("/api/v1/admin/inquiries/:id/quote", adminAuth, controller.admin.quoteInquiry);
  router.post("/api/v1/admin/inquiries/:id/convert-order", adminAuth, controller.admin.convertInquiryOrder);
  router.get("/api/v1/admin/orders", adminAuth, controller.admin.orders);
  router.get("/api/v1/admin/orders/:id", adminAuth, controller.admin.orderDetail);
  router.get("/api/v1/admin/payment-records", adminAuth, controller.admin.payments);
  router.post("/api/v1/admin/payment-records/:id/confirm", adminAuth, controller.admin.confirmPayment);
  router.get("/api/v1/admin/deliveries", adminAuth, controller.admin.deliveries);
  router.post("/api/v1/admin/orders/:id/deliveries", adminAuth, controller.admin.addDelivery);
  router.get("/api/v1/admin/after-sales", adminAuth, controller.admin.afterSales);
};
