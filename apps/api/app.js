"use strict";

const mysql = require("mysql2/promise");

module.exports = (app) => {
  app.beforeStart(async () => {
    app.mysql = mysql.createPool({
      host: process.env.MYSQL_HOST || "127.0.0.1",
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "source_service_shop",
      waitForConnections: true,
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
      namedPlaceholders: true,
      timezone: "+08:00"
    });
    app.logger.info("MySQL pool initialized");
  });
};
