# API 服务

Egg.js + MySQL 服务端，接口前缀为 `/api/v1`。

## 启动

```bash
pnpm install
pnpm --filter @source-shop/api dev
```

## 初始化数据库

1. 创建数据库：`CREATE DATABASE source_service_shop DEFAULT CHARACTER SET utf8mb4;`
2. 执行 `database/schema.sql`
3. 执行 `database/seed.sql`

后台默认账号：`admin` / `admin123`。
