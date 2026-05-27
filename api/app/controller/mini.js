"use strict";

const { Controller } = require("egg");

class MiniController extends Controller {
  async home() {
    this.ctx.success(await this.ctx.service.catalog.home());
  }

  async categories() {
    this.ctx.success(await this.ctx.service.catalog.categories(this.ctx.query.type));
  }

  async tags() {
    this.ctx.success(await this.ctx.service.catalog.tags(this.ctx.query.type, this.ctx.query.isHot));
  }

  async products() {
    this.ctx.success(await this.ctx.service.catalog.products(this.ctx.query));
  }

  async productDetail() {
    const data = await this.ctx.service.catalog.productDetail(Number(this.ctx.params.id));
    if (!data) {
      this.ctx.fail(404001, "商品不存在", 404);
      return;
    }
    this.ctx.success(data);
  }

  async services() {
    this.ctx.success(await this.ctx.service.catalog.services(this.ctx.query));
  }

  async serviceDetail() {
    const data = await this.ctx.service.catalog.serviceDetail(Number(this.ctx.params.id));
    if (!data) {
      this.ctx.fail(404001, "服务不存在", 404);
      return;
    }
    this.ctx.success(data);
  }

  async createInquiry() {
    const user = this.ctx.state.user;
    const body = this.ctx.request.body || {};
    if (!["product", "service"].includes(body.sourceType) || !body.title) {
      this.ctx.fail(400001, "来源和标题必填");
      return;
    }
    this.ctx.success(await this.ctx.service.inquiry.create(user.id, body));
  }

  async myInquiries() {
    this.ctx.success(await this.ctx.service.inquiry.mine(this.ctx.state.user.id, this.ctx.query));
  }

  async updateProfile() {
    this.ctx.success(await this.ctx.service.auth.updateCustomerProfile(this.ctx.state.user.id, this.ctx.request.body || {}));
  }
}

module.exports = MiniController;
