"use strict";

module.exports = (appInfo) => {
  const config = {};

  config.keys = `${appInfo.name}_source_service_shop_secret`;

  config.middleware = ["trace", "errorHandler", "cors"];

  config.security = {
    csrf: { enable: false },
    domainWhiteList: ["*"]
  };

  config.jwt = {
    secret: process.env.API_JWT_SECRET || "please-change-me"
  };

  config.multipart = {
    mode: "file",
    fileSize: "500mb",
    whitelist: [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".md",
      ".txt",
      ".zip",
      ".rar",
      ".7z",
      ".mp4"
    ]
  };

  return config;
};
