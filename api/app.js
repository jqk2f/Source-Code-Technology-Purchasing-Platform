"use strict";

const mysql = require("mysql2/promise");
const { loadApiEnv } = require("./config/env");

module.exports = (app) => {
  loadApiEnv();

  app.beforeStart(async () => {
    app.mysql = mysql.createPool(app.config.mysql);
    app.logger.info("MySQL pool initialized");
  });
};
