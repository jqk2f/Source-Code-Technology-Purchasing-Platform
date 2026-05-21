"use strict";

const { Controller } = require("egg");

class AdminController extends Controller {
  async overview() {
    this.ctx.success(await this.ctx.service.admin.overview());
  }

  async products() {
    this.ctx.success(await this.ctx.service.admin.products(this.ctx.query));
  }

  async services() {
    this.ctx.success(await this.ctx.service.admin.services(this.ctx.query));
  }

  async customers() {
    this.ctx.success(await this.ctx.service.admin.customers(this.ctx.query));
  }

  async inquiries() {
    this.ctx.success(await this.ctx.service.inquiry.adminList(this.ctx.query));
  }

  async followInquiry() {
    this.ctx.success(
      await this.ctx.service.inquiry.follow(Number(this.ctx.params.id), this.ctx.state.user.id, this.ctx.request.body || {})
    );
  }

  async quoteInquiry() {
    this.ctx.success(await this.ctx.service.inquiry.quote(Number(this.ctx.params.id), this.ctx.request.body || {}));
  }

  async convertInquiryOrder() {
    this.ctx.success(await this.ctx.service.order.createFromInquiry(Number(this.ctx.params.id), this.ctx.request.body || {}));
  }

  async orders() {
    this.ctx.success(await this.ctx.service.order.adminList(this.ctx.query));
  }

  async orderDetail() {
    const data = await this.ctx.service.order.detail(Number(this.ctx.params.id));
    if (!data) {
      this.ctx.fail(404001, "订单不存在", 404);
      return;
    }
    this.ctx.success(data);
  }

  async payments() {
    this.ctx.success(await this.ctx.service.admin.payments(this.ctx.query));
  }

  async confirmPayment() {
    this.ctx.success(
      await this.ctx.service.order.confirmPayment(Number(this.ctx.params.id), this.ctx.state.user.id, this.ctx.request.body || {})
    );
  }

  async deliveries() {
    this.ctx.success(await this.ctx.service.admin.deliveries(this.ctx.query));
  }

  async addDelivery() {
    this.ctx.success(
      await this.ctx.service.order.addDelivery(Number(this.ctx.params.id), this.ctx.state.user.id, this.ctx.request.body || {})
    );
  }

  async afterSales() {
    this.ctx.success(await this.ctx.service.admin.afterSales(this.ctx.query));
  }
}

module.exports = AdminController;
