"use strict";

const BaseService = require("./base");

function toSnakeKey(key) {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function makeNo(prefix) {
  return `${prefix}${Date.now()}${Math.random().toString().slice(2, 6)}`;
}

const resources = {
  products: {
    table: "products",
    softDelete: true,
    search: ["title", "subtitle", "tech_stack"],
    fields: [
      "categoryId",
      "title",
      "subtitle",
      "coverUrl",
      "price",
      "originPrice",
      "startPrice",
      "priceText",
      "isDeployIncluded",
      "isCustomizable",
      "hasDemo",
      "demoUrl",
      "demoAccount",
      "techStack",
      "frontendStack",
      "backendStack",
      "databaseStack",
      "deployEnv",
      "featureIntro",
      "deliveryContent",
      "purchaseNotice",
      "afterSaleDesc",
      "licenseDesc",
      "status"
    ],
    defaults: { status: "draft", viewCount: 0, favoriteCount: 0, dealCount: 0, sortNo: 0 }
  },
  services: {
    table: "services",
    softDelete: true,
    search: ["name", "subtitle", "service_scope"],
    fields: [
      "categoryId",
      "name",
      "subtitle",
      "coverUrl",
      "startPrice",
      "priceText",
      "servicePeriod",
      "serviceMethod",
      "serviceScope",
      "serviceProcess",
      "requiredMaterials",
      "deliveryStandard",
      "excludedContent",
      "afterSaleDesc",
      "responseTime",
      "status"
    ],
    defaults: { status: "draft", viewCount: 0, favoriteCount: 0, dealCount: 0, sortNo: 0 }
  },
  customers: {
    table: "customers",
    softDelete: true,
    search: ["nickname", "mobile", "contact_wechat", "company_name"],
    fields: ["openid", "mobile", "nickname", "avatarUrl", "companyName", "contactName", "contactWechat", "contactAddress", "source", "status", "remark"],
    defaults: { status: "normal", source: "backend" }
  },
  inquiries: {
    table: "inquiries",
    softDelete: true,
    search: ["inquiry_no", "title", "contact_mobile", "contact_wechat"],
    fields: [
      "customerId",
      "sourceType",
      "sourceId",
      "title",
      "demandType",
      "description",
      "contactName",
      "contactMobile",
      "contactWechat",
      "budgetMin",
      "budgetMax",
      "expectedFinishAt",
      "quoteAmount",
      "quoteDesc",
      "priority",
      "status",
      "nextFollowAt"
    ],
    defaults: { inquiryNo: () => makeNo("INQ"), sourceType: "custom", priority: "normal", status: "pending_follow" }
  },
  orders: {
    table: "orders",
    softDelete: true,
    search: ["order_no", "title"],
    fields: [
      "customerId",
      "inquiryId",
      "sourceType",
      "title",
      "totalAmount",
      "discountAmount",
      "extraAmount",
      "payableAmount",
      "paidAmount",
      "paymentStatus",
      "deliveryStatus",
      "afterSaleStatus",
      "status",
      "paymentInstruction",
      "customerRemark",
      "internalRemark"
    ],
    defaults: {
      orderNo: () => makeNo("ORD"),
      sourceType: "manual",
      totalAmount: 0,
      discountAmount: 0,
      extraAmount: 0,
      payableAmount: 0,
      paidAmount: 0,
      paymentStatus: "unpaid",
      deliveryStatus: "not_started",
      afterSaleStatus: "none",
      status: "pending_communication"
    }
  },
  payments: {
    table: "payment_records",
    softDelete: false,
    search: ["payment_no", "transaction_no", "remark"],
    fields: ["orderId", "customerId", "amount", "paymentMethod", "paidAt", "receiverAccount", "transactionNo", "voucherFileId", "status", "remark"],
    defaults: { paymentNo: () => makeNo("PAY"), status: "pending", paymentMethod: "wechat_transfer" }
  },
  deliveries: {
    table: "delivery_records",
    softDelete: false,
    search: ["delivery_no", "title", "content"],
    fields: ["orderId", "type", "title", "content", "attachments", "isCustomerVisible", "status"],
    defaults: { deliveryNo: () => makeNo("DEL"), type: "netdisk", isCustomerVisible: 1, status: "pending" }
  },
  "after-sales": {
    table: "after_sale_tickets",
    softDelete: false,
    search: ["ticket_no", "title", "description"],
    fields: ["orderId", "customerId", "deliveryId", "type", "title", "description", "environment", "attachments", "status", "assigneeId", "result"],
    defaults: { ticketNo: () => makeNo("AFT"), type: "other", status: "pending" }
  }
};

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

  getResource(resource) {
    const config = resources[resource];
    if (!config) {
      const error = new Error("资源不存在");
      error.status = 404;
      throw error;
    }
    return config;
  }

  buildWhere(config, query) {
    const parts = [];
    const params = {};
    if (config.softDelete) parts.push("deleted_at IS NULL");
    if (query.status) {
      parts.push("status=:status");
      params.status = query.status;
    }
    if (query.keyword && config.search.length) {
      parts.push(`(${config.search.map((field, index) => `${field} LIKE :keyword${index}`).join(" OR ")})`);
      config.search.forEach((_, index) => {
        params[`keyword${index}`] = `%${query.keyword}%`;
      });
    }
    return { where: parts.length ? parts.join(" AND ") : "1=1", params };
  }

  async listResource(resource, query) {
    const config = this.getResource(resource);
    const { where, params } = this.buildWhere(config, query);
    return this.page({
      table: config.table,
      where,
      params,
      orderBy: "created_at DESC",
      page: query.page,
      pageSize: query.pageSize
    });
  }

  toDatabasePayload(config, payload, includeDefaults = false) {
    const data = {};
    if (includeDefaults) {
      for (const [key, value] of Object.entries(config.defaults || {})) {
        data[toSnakeKey(key)] = typeof value === "function" ? value() : value;
      }
    }
    for (const field of config.fields) {
      if (Object.prototype.hasOwnProperty.call(payload, field)) {
        data[toSnakeKey(field)] = payload[field];
      }
    }
    return data;
  }

  async createResource(resource, payload) {
    const config = this.getResource(resource);
    const data = this.toDatabasePayload(config, payload, true);
    data.created_at = new Date();
    data.updated_at = new Date();
    const keys = Object.keys(data);
    const sql = `INSERT INTO ${config.table}(${keys.join(",")}) VALUES(${keys.map((key) => `:${key}`).join(",")})`;
    const result = await this.execute(sql, data);
    return { id: result.insertId };
  }

  async updateResource(resource, id, payload) {
    const config = this.getResource(resource);
    const data = this.toDatabasePayload(config, payload, false);
    data.updated_at = new Date();
    const keys = Object.keys(data);
    if (!keys.length) return { id };
    await this.execute(`UPDATE ${config.table} SET ${keys.map((key) => `${key}=:${key}`).join(",")} WHERE id=:id`, {
      ...data,
      id
    });
    return { id };
  }

  async deleteResource(resource, id) {
    const config = this.getResource(resource);
    if (config.softDelete) {
      await this.execute(`UPDATE ${config.table} SET deleted_at=NOW(), updated_at=NOW() WHERE id=:id`, { id });
    } else {
      await this.execute(`DELETE FROM ${config.table} WHERE id=:id`, { id });
    }
    return { id };
  }
}

module.exports = AdminService;
