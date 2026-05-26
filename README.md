# 源码与技术服务平台

按部署边界拆成三个项目：

```text
api/       后端服务，Egg.js + MySQL
admin/     管理端，Vue3 + Vite + Ant Design Vue
mobile/    客户端移动端，Vue3 + Vite + Vant
docs/      需求文档
```

## 环境变量

每个项目独立维护两套环境文件：

```text
api/.env.development
api/.env.production
admin/.env.development
admin/.env.production
mobile/.env.development
mobile/.env.production
```

生产部署前请替换 `API_JWT_SECRET`、`MYSQL_PASSWORD`、`VITE_API_BASE_URL` 等值。

## 启动

```bash
cd api && pnpm install && pnpm dev
cd admin && pnpm install && pnpm dev
cd mobile && pnpm install && pnpm dev
```

## 数据库

```sql
CREATE DATABASE source_service_shop DEFAULT CHARACTER SET utf8mb4;
```

然后依次执行：

```text
api/database/schema.sql
api/database/seed.sql
```

后台默认账号：

```text
admin / admin123
```
