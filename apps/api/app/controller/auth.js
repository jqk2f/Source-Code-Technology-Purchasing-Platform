"use strict";

const { Controller } = require("egg");

class AuthController extends Controller {
  async miniLogin() {
    const result = await this.ctx.service.auth.miniLogin(this.ctx.request.body || {});
    this.ctx.success(result);
  }

  async adminLogin() {
    const { username, password } = this.ctx.request.body || {};
    if (!username || !password) {
      this.ctx.fail(400001, "用户名和密码必填");
      return;
    }
    const result = await this.ctx.service.auth.adminLogin({ username, password });
    this.ctx.success(result);
  }
}

module.exports = AuthController;
