"use strict";

const { Service } = require("egg");

function toCamelKey(key) {
  return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function toCamel(value) {
  if (Array.isArray(value)) return value.map(toCamel);
  if (!value || typeof value !== "object" || value instanceof Date) return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [toCamelKey(key), toCamel(item)]));
}

class BaseService extends Service {
  async query(sql, params = {}) {
    const [rows] = await this.app.mysql.query(sql, params);
    return toCamel(rows);
  }

  async first(sql, params = {}) {
    const rows = await this.query(sql, params);
    return rows[0] || null;
  }

  async execute(sql, params = {}) {
    const [result] = await this.app.mysql.execute(sql, params);
    return result;
  }

  async page({ table, where = "1=1", params = {}, orderBy = "created_at DESC", page = 1, pageSize = 20, fields = "*" }) {
    const safePage = Math.max(Number(page) || 1, 1);
    const safePageSize = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
    const offset = (safePage - 1) * safePageSize;
    const list = await this.query(
      `SELECT ${fields} FROM ${table} WHERE ${where} ORDER BY ${orderBy} LIMIT :limit OFFSET :offset`,
      { ...params, limit: safePageSize, offset }
    );
    const totalRow = await this.first(`SELECT COUNT(1) AS total FROM ${table} WHERE ${where}`, params);
    return {
      list,
      page: safePage,
      pageSize: safePageSize,
      total: Number(totalRow ? totalRow.total : 0)
    };
  }

  camel(value) {
    return toCamel(value);
  }
}

module.exports = BaseService;
