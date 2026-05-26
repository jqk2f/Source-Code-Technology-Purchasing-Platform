# API 服务

Egg.js + MySQL 后端服务，接口前缀为 `/api/v1`。

## 环境变量

后端只使用项目内环境文件：

```text
api/.env.development
api/.env.production
```

数据库配置统一放在 env 中：

```text
MYSQL_HOST
MYSQL_PORT
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DATABASE
MYSQL_CONNECTION_LIMIT
MYSQL_TIMEZONE
```

## 启动

```bash
pnpm --filter @source-shop/api dev
```

## 初始化数据库

1. 创建数据库：`CREATE DATABASE source_service_shop DEFAULT CHARACTER SET utf8mb4;`
2. 执行 `database/schema.sql`
3. 执行 `database/seed.sql`

后台默认账号：`admin` / `admin123`。
