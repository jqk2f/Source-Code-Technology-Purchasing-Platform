"use strict";

const { Controller } = require("egg");

class HealthController extends Controller {
  async index() {
    this.ctx.success({ status: "ok", time: new Date().toISOString() });
  }
}

module.exports = HealthController;
