"use strict";

const fs = require("node:fs");
const path = require("node:path");

const appRoot = path.resolve(__dirname, "..");
const releaseRoot = path.resolve(appRoot, "..", "dist");
const releaseDir = path.join(releaseRoot, "source-shop-api");

const entries = [
  "app",
  "config",
  "database",
  "app.js",
  "package.json",
  "package-lock.json",
  "README.md"
];

const envExample = [
  "API_ENV=production",
  "API_PORT=7001",
  "API_JWT_SECRET=change-me",
  "MYSQL_HOST=127.0.0.1",
  "MYSQL_PORT=3306",
  "MYSQL_USER=source_service",
  "MYSQL_PASSWORD=change-me",
  "MYSQL_DATABASE=source_service_shop",
  "MYSQL_CONNECTION_LIMIT=10",
  "MYSQL_TIMEZONE=+08:00",
  ""
].join("\n");

function copyRecursive(source, target) {
  const stat = fs.statSync(source);

  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(target, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

fs.rmSync(releaseDir, { recursive: true, force: true });
fs.mkdirSync(releaseDir, { recursive: true });

for (const entry of entries) {
  const source = path.join(appRoot, entry);
  if (fs.existsSync(source)) {
    copyRecursive(source, path.join(releaseDir, entry));
  }
}

fs.writeFileSync(path.join(releaseDir, "env.production.example"), envExample, "utf8");

fs.writeFileSync(
  path.join(releaseDir, "DEPLOY.md"),
  [
    "# source-shop-api",
    "",
    "1. Copy this directory to the server.",
    "2. Create `.env.production` from `env.production.example` and fill in production secrets.",
    "3. Run `npm ci --omit=dev` in this directory.",
    "4. Run `npm run start:production`.",
    ""
  ].join("\n"),
  "utf8"
);

console.log(`API release generated at ${path.relative(appRoot, releaseDir)}`);
