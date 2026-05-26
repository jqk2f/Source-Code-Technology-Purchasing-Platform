"use strict";

const jwt = require("jsonwebtoken");
const BaseService = require("./base");

class AuthService extends BaseService {
  sign(payload, expiresIn = "7d") {
    return jwt.sign(payload, this.config.jwt.secret, { expiresIn });
  }

  verify(token) {
    return jwt.verify(token, this.config.jwt.secret);
  }

  async miniLogin({ code, nickname = "微信客户", avatarUrl = "" }) {
    const openid = `mock_${code || Date.now()}`;
    let customer = await this.first("SELECT * FROM customers WHERE openid = :openid AND deleted_at IS NULL", { openid });
    if (!customer) {
      const result = await this.execute(
        `INSERT INTO customers(openid, nickname, avatar_url, status, source, created_at, updated_at)
         VALUES(:openid, :nickname, :avatarUrl, 'normal', 'wechat_mini', NOW(), NOW())`,
        { openid, nickname, avatarUrl }
      );
      customer = await this.first("SELECT * FROM customers WHERE id = :id", { id: result.insertId });
    }
    const token = this.sign({ id: customer.id, type: "customer" });
    return { token, customer };
  }

  async adminLogin({ username, password }) {
    const admin = await this.first("SELECT * FROM admin_users WHERE username = :username AND deleted_at IS NULL", { username });
    if (!admin || admin.status !== "enabled") {
      const error = new Error("账号不存在或已禁用");
      error.status = 401;
      throw error;
    }

    // MVP 阶段支持明文种子密码和 bcrypt/hash 扩展字段；生产环境必须替换为安全哈希校验。
    if (password !== "admin123" && password !== admin.passwordHash) {
      const error = new Error("用户名或密码错误");
      error.status = 401;
      throw error;
    }

    const roles = await this.query(
      `SELECT r.code, r.name
       FROM admin_roles r
       JOIN admin_user_roles ur ON ur.role_id = r.id
       WHERE ur.admin_user_id = :id AND r.status = 'enabled'`,
      { id: admin.id }
    );
    const permissions = await this.query(
      `SELECT DISTINCT p.code, p.name, p.type, p.path, p.parent_id
       FROM admin_permissions p
       JOIN admin_role_permissions rp ON rp.permission_id = p.id
       JOIN admin_user_roles ur ON ur.role_id = rp.role_id
       WHERE ur.admin_user_id = :id`,
      { id: admin.id }
    );
    const token = this.sign({ id: admin.id, type: "admin", permissions: permissions.map((item) => item.code) }, "12h");
    return { token, user: admin, roles, permissions, menus: permissions.filter((item) => item.type === "menu") };
  }

  async refreshAdmin(adminId) {
    const admin = await this.first("SELECT * FROM admin_users WHERE id = :adminId AND deleted_at IS NULL", { adminId });
    if (!admin || admin.status !== "enabled") {
      const error = new Error("账号不存在或已禁用");
      error.status = 401;
      throw error;
    }
    const roles = await this.query(
      `SELECT r.code, r.name
       FROM admin_roles r
       JOIN admin_user_roles ur ON ur.role_id = r.id
       WHERE ur.admin_user_id = :id AND r.status = 'enabled'`,
      { id: admin.id }
    );
    const permissions = await this.query(
      `SELECT DISTINCT p.code, p.name, p.type, p.path, p.parent_id
       FROM admin_permissions p
       JOIN admin_role_permissions rp ON rp.permission_id = p.id
       JOIN admin_user_roles ur ON ur.role_id = rp.role_id
       WHERE ur.admin_user_id = :id`,
      { id: admin.id }
    );
    const token = this.sign({ id: admin.id, type: "admin", permissions: permissions.map((item) => item.code) }, "12h");
    return { token, user: admin, roles, permissions, menus: permissions.filter((item) => item.type === "menu") };
  }
}

module.exports = AuthService;
