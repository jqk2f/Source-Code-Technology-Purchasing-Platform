"use strict";

const fs = require("node:fs");
const path = require("node:path");

function normalizeMode(mode) {
  if (!mode) {
    return process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.startsWith("start")
      ? "production"
      : "development";
  }
  if (mode === "prod") return "production";
  if (mode === "local") return "development";
  return mode;
}

function parseEnv(content) {
  return content.split(/\r?\n/).reduce((result, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return result;
    const index = trimmed.indexOf("=");
    if (index <= 0) return result;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
    return result;
  }, {});
}

function loadApiEnv(mode = process.env.API_ENV || process.env.APP_ENV || process.env.EGG_SERVER_ENV || process.env.NODE_ENV) {
  const envMode = normalizeMode(mode);
  const appRoot = path.resolve(__dirname, "..");
  const files = [".env", envMode ? `.env.${envMode}` : ""].filter(Boolean);
  const originalEnvKeys = new Set(Object.keys(process.env));

  files.forEach((file) => {
    const filePath = path.join(appRoot, file);
    if (!fs.existsSync(filePath)) return;
    const values = parseEnv(fs.readFileSync(filePath, "utf8"));
    Object.entries(values).forEach(([key, value]) => {
      if (!originalEnvKeys.has(key)) {
        process.env[key] = value;
      }
    });
  });

  process.env.API_ENV = envMode || "development";
  return process.env.API_ENV;
}

module.exports = { loadApiEnv };
