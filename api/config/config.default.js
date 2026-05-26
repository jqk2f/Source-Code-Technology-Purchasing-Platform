"use strict";

const { loadApiEnv } = require("./env");

module.exports = (appInfo) => {
  loadApiEnv();

  const config = {};

  config.keys = `${appInfo.name}_source_service_shop_secret`;

  config.middleware = ["trace", "errorHandler", "cors"];

  config.cluster = {
    listen: {
      port: Number(process.env.API_PORT || 7001),
      hostname: "0.0.0.0",
    },
  };

  config.security = {
    csrf: { enable: false },
    domainWhiteList: ["*"],
  };

  config.jwt = {
    secret: process.env.API_JWT_SECRET || "please-change-me",
  };

  config.mysql = {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "source_service",
    password: process.env.MYSQL_PASSWORD || "2aXkaBPYATP22PT2",
    database: process.env.MYSQL_DATABASE || "source_service_shop",
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
    namedPlaceholders: true,
    timezone: process.env.MYSQL_TIMEZONE || "+08:00",
  };

  config.multipart = {
    mode: "file",
    fileSize: "500mb",
    whitelist: [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".md", ".txt", ".zip", ".rar", ".7z", ".mp4"],
  };

  return config;
};
