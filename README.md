# 源码与技术服务选购小程序及管理系统

基于 `docs` 下的需求文档和设计文档实现的 MVP 工程骨架，采用 pnpm monorepo 管理。

## 技术栈

| 应用 | 技术 |
| --- | --- |
| 小程序 | UniApp + Vue3 + Pinia |
| 管理后台 | Vue3 + Vite + Ant Design Vue + Tailwind CSS + Pinia |
| 服务端 | Node.js + Egg.js + MySQL |
| 共享包 | TypeScript 业务常量、类型、主题 token |

## 目录结构

```text
apps/
  api/       Egg.js 服务端
  admin/     管理后台 Web
  mini/      UniApp 小程序
packages/
  shared/    共享状态枚举、类型、主题配置
docs/        需求文档与设计文档
```

## 快速启动

```bash
pnpm install
cp .env.example .env
```

初始化数据库：

```sql
CREATE DATABASE source_service_shop DEFAULT CHARACTER SET utf8mb4;
```

然后依次执行：

```bash
apps/api/database/schema.sql
apps/api/database/seed.sql
```

启动后端：

```bash
pnpm dev:api
```

启动后台：

```bash
pnpm dev:admin
```

启动小程序：

```bash
pnpm dev:mini
```

后台默认账号：

```text
admin / admin123
```

## 已实现 MVP

1. Egg.js API：统一响应、JWT 鉴权、CORS、错误处理、MySQL 连接。
2. 客户端接口：首页、分类、标签、商品列表/详情、服务列表/详情、提交询单、订单列表/详情、上传付款凭证。
3. 后台接口：登录、经营概览、商品/服务/客户/询单/订单/收款/交付/售后列表、询单报价/转订单、确认收款、添加交付。
4. 管理后台：登录、后台布局、经营概览、核心资源列表、可配置主题。
5. 小程序：首页、商品列表/详情、服务列表/详情、提交意向、订单中心、订单详情、我的、可配置主题。
6. 数据库：核心业务表、权限表、商品服务表、询单订单收款交付售后表、种子数据。

## 主题配置

主题 token 定义在 `packages/shared/src/theme.ts`。

后台在 `apps/admin/src/stores/theme.ts` 中保存到 localStorage，并通过 Ant Design Vue `ConfigProvider` 和 CSS 变量生效。

小程序在 `apps/mini/src/stores/theme.ts` 中保存到本地 storage，并通过页面根节点 CSS 变量注入生效。

## 当前取舍

1. 小程序微信登录当前使用 `code` 生成 mock openid，正式环境需接入微信 `jscode2session`。
2. 后台密码校验为 MVP 占位，生产环境需替换为 bcrypt/argon2 哈希校验。
3. 文件上传表和字段已预留，当前页面中的付款凭证先记录金额、方式和备注，后续接对象存储上传。
4. 管理后台新增/编辑表单还未精细化拆分，目前先完成列表、状态跟进和关键动作接口基础。
