"use strict";

const BaseService = require("./base");

class AdminService extends BaseService {
  async overview() {
    const todayCustomers = await this.first("SELECT COUNT(1) total FROM customers WHERE DATE(created_at)=CURDATE()");
    const todayInquiries = await this.first("SELECT COUNT(1) total FROM inquiries WHERE DATE(created_at)=CURDATE()");
    const pendingInquiries = await this.first("SELECT COUNT(1) total FROM inquiries WHERE status IN ('pending_follow','contacted','pending_quote','quoted')");
    const pendingPayments = await this.first("SELECT COUNT(1) total FROM orders WHERE status='payment_confirming'");
    const pendingDeliveries = await this.first("SELECT COUNT(1) total FROM orders WHERE status='pending_delivery'");
    const pendingAfterSales = await this.first("SELECT COUNT(1) total FROM after_sale_tickets WHERE status IN ('pending','processing','waiting_customer')");
    const amount = await this.first("SELECT COALESCE(SUM(payable_amount),0) order_amount, COALESCE(SUM(paid_amount),0) paid_amount FROM orders WHERE deleted_at IS NULL");
    const completedOrders = await this.first("SELECT COUNT(1) total FROM orders WHERE status='completed'");
    const inquiryTotal = await this.first("SELECT COUNT(1) total FROM inquiries");
    return {
      todayCustomers: Number(todayCustomers.total || 0),
      todayInquiries: Number(todayInquiries.total || 0),
      pendingInquiries: Number(pendingInquiries.total || 0),
      pendingPayments: Number(pendingPayments.total || 0),
      pendingDeliveries: Number(pendingDeliveries.total || 0),
      pendingAfterSales: Number(pendingAfterSales.total || 0),
      orderAmount: Number(amount.orderAmount || 0),
      paidAmount: Number(amount.paidAmount || 0),
      completedOrders: Number(completedOrders.total || 0),
      conversionRate: Number(inquiryTotal.total || 0) ? Number(completedOrders.total || 0) / Number(inquiryTotal.total) : 0
    };
  }

  async products(query) {
    return this.page({
      table: "products",
      where: "deleted_at IS NULL",
      orderBy: "created_at DESC",
      page: query.page,
      pageSize: query.pageSize
    });
  }

  async services(query) {
    return this.page({
      table: "services",
      where: "deleted_at IS NULL",
      orderBy: "created_at DESC",
      page: query.page,
      pageSize: query.pageSize
    });
  }

  async customers(query) {
    const parts = ["deleted_at IS NULL"];
    const params = {};
    if (query.keyword) {
      parts.push("(nickname LIKE :keyword OR mobile LIKE :keyword OR contact_wechat LIKE :keyword)");
      params.keyword = `%${query.keyword}%`;
    }
    return this.page({
      table: "customers",
      where: parts.join(" AND "),
      params,
      orderBy: "created_at DESC",
      page: query.page,
      pageSize: query.pageSize
    });
  }

  async payments(query) {
    return this.page({
      table: "payment_records",
      where: query.status ? "status=:status" : "1=1",
      params: { status: query.status },
      orderBy: "created_at DESC",
      page: query.page,
      pageSize: query.pageSize
    });
  }

  async deliveries(query) {
    return this.page({
      table: "delivery_records",
      where: query.status ? "status=:status" : "1=1",
      params: { status: query.status },
      orderBy: "created_at DESC",
      page: query.page,
      pageSize: query.pageSize
    });
  }

  async afterSales(query) {
    return this.page({
      table: "after_sale_tickets",
      where: query.status ? "status=:status" : "1=1",
      params: { status: query.status },
      orderBy: "created_at DESC",
      page: query.page,
      pageSize: query.pageSize
    });
  }
}

module.exports = AdminService;
