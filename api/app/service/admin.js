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
      "price",
      "demoUrl",
      "techStack",
      "featureIntro",
      "deliveryContent",
      "purchaseNotice",
      "status"
    ],
    defaults: { categoryId: 1, status: "draft", viewCount: 0, favoriteCount: 0, dealCount: 0, sortNo: 0 }
  },
  services: {
    table: "services",
    softDelete: true,
    search: ["name", "subtitle", "service_scope"],
    fields: [
      "categoryId",
      "name",
      "subtitle",
      "startPrice",
      "serviceMethod",
      "serviceScope",
      "deliveryStandard",
      "excludedContent",
      "status"
    ],
    defaults: { categoryId: 4, status: "draft", viewCount: 0, favoriteCount: 0, dealCount: 0, sortNo: 0 }
  },
  customers: {
    table: "customers",
    softDelete: true,
    search: ["nickname", "mobile", "contact_wechat"],
    fields: ["openid", "mobile", "nickname", "avatarUrl", "contactName", "contactWechat", "contactAddress", "status", "remark"],
    defaults: { status: "normal" }
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
      "description",
      "contactName",
      "contactMobile",
      "contactWechat",
      "priority",
      "status",
      "nextFollowAt"
    ],
    defaults: { inquiryNo: () => makeNo("INQ"), sourceType: "product", priority: "normal", status: "pending_follow" }
  }
};

class AdminService extends BaseService {
  async overview() {
    const todayCustomers = await this.first("SELECT COUNT(1) total FROM customers WHERE DATE(created_at)=CURDATE()");
    const todayInquiries = await this.first("SELECT COUNT(1) total FROM inquiries WHERE DATE(created_at)=CURDATE()");
    const pendingInquiries = await this.first("SELECT COUNT(1) total FROM inquiries WHERE status='pending_follow'");
    const contactedInquiries = await this.first("SELECT COUNT(1) total FROM inquiries WHERE status='contacted'");
    const inquiryTotal = await this.first("SELECT COUNT(1) total FROM inquiries");
    return {
      todayCustomers: Number(todayCustomers.total || 0),
      todayInquiries: Number(todayInquiries.total || 0),
      pendingInquiries: Number(pendingInquiries.total || 0),
      contactedInquiries: Number(contactedInquiries.total || 0),
      conversionRate: Number(inquiryTotal.total || 0) ? Number(contactedInquiries.total || 0) / Number(inquiryTotal.total) : 0
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
