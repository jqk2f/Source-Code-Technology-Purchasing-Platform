"use strict";

const mysql = require("mysql2/promise");
const { loadApiEnv } = require("../config/env");

loadApiEnv();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "source_service",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "source_service_shop",
    charset: "utf8mb4"
  });

  const updates = [
    ["UPDATE admin_users SET real_name=? WHERE username='admin'", ["超级管理员"]],
    ["UPDATE admin_roles SET name=?, description=? WHERE code='super_admin'", ["超级管理员", "拥有全部权限"]],
    ["UPDATE admin_permissions SET name=? WHERE code='dashboard:view'", ["经营概览"]],
    ["UPDATE admin_permissions SET name=? WHERE code='product:view'", ["商品查看"]],
    ["UPDATE admin_permissions SET name=? WHERE code='service:view'", ["服务查看"]],
    ["UPDATE admin_permissions SET name=? WHERE code='inquiry:view'", ["询单查看"]],
    ["UPDATE admin_permissions SET name=? WHERE code='order:view'", ["订单查看"]],
    ["UPDATE admin_permissions SET name=? WHERE code='payment:view'", ["收款查看"]],
    ["UPDATE admin_permissions SET name=? WHERE code='delivery:view'", ["交付查看"]],
    ["UPDATE admin_permissions SET name=? WHERE code='after_sale:view'", ["售后查看"]],
    ["UPDATE admin_permissions SET name=? WHERE code='customer:view'", ["客户查看"]],
    ["UPDATE admin_permissions SET name=? WHERE code='payment:confirm'", ["确认收款"]],
    ["UPDATE admin_permissions SET name=? WHERE code='delivery:create'", ["添加交付"]],
    ["UPDATE admin_permissions SET name=? WHERE code='order:create'", ["创建订单"]],
    ["UPDATE categories SET name=? WHERE id=1", ["小程序源码"]],
    ["UPDATE categories SET name=? WHERE id=2", ["Web 系统源码"]],
    ["UPDATE categories SET name=? WHERE id=3", ["后台管理系统"]],
    ["UPDATE categories SET name=? WHERE id=4", ["源码部署"]],
    ["UPDATE categories SET name=? WHERE id=5", ["Bug 修复"]],
    ["UPDATE categories SET name=? WHERE id=6", ["功能二开"]],
    [
      `UPDATE products
       SET title=?, subtitle=?, price_text=?, demo_account=?, tech_stack=?, frontend_stack=?, backend_stack=?,
           deploy_env=?, feature_intro=?, feature_list=JSON_ARRAY('商品管理','订单管理','会员管理','营销配置'),
           delivery_content=?, purchase_notice=?, after_sale_desc=?, license_desc=?
       WHERE id=1`,
      [
        "商城小程序源码",
        "含小程序、管理后台和接口服务",
        "源码起售",
        "联系管理员获取演示账号",
        "UniApp, Vue3, Node.js, MySQL",
        "UniApp / Vue3",
        "Egg.js",
        "Node.js 18+, MySQL 8",
        "适合快速搭建商城、预约、会员等业务原型。",
        "源码包、数据库脚本、部署文档、使用说明",
        "源码商品售出后按约定售后范围处理。",
        "基础运行问题 7 天内协助处理。",
        "允许自用和商用，不允许转卖源码。"
      ]
    ],
    ["UPDATE product_faqs SET question=?, answer=? WHERE product_id=1 AND sort_no=1", ["是否包含部署？", "默认不包含，可选购部署服务。"]],
    ["UPDATE product_faqs SET question=?, answer=? WHERE product_id=1 AND sort_no=2", ["是否支持二开？", "支持，需根据需求单独报价。"]],
    [
      `UPDATE services
       SET name=?, subtitle=?, price_text=?, service_period=?, service_method=?, service_scope=?,
           service_process=?, required_materials=?, delivery_standard=?, excluded_content=?, after_sale_desc=?, response_time=?
       WHERE id=1`,
      [
        "源码部署服务",
        "协助完成环境安装、数据库导入和项目启动",
        "按项目复杂度报价",
        "1-2 个工作日",
        "远程协助",
        "Node、Java、PHP、前端项目常规部署。",
        "确认环境 -> 远程部署 -> 验证访问 -> 交付说明。",
        "服务器、域名、源码包、数据库文件。",
        "系统可访问，核心页面可打开。",
        "不包含功能修改和长期运维。",
        "交付后 3 天内处理部署相关问题。",
        "工作时间 2 小时内响应"
      ]
    ],
    ["UPDATE service_packages SET name=?, content=?, delivery_standard=? WHERE service_id=1 AND sort_no=1", ["基础部署", "单项目部署和运行验证", "完成访问验证"]],
    ["UPDATE service_packages SET name=?, content=?, delivery_standard=? WHERE service_id=1 AND sort_no=2", ["部署加讲解", "基础部署 + 30 分钟结构讲解", "完成部署并交付说明"]],
    ["UPDATE banners SET title=? WHERE id=1", ["源码与技术服务选购"]]
  ];

  for (const [sql, params] of updates) {
    await connection.execute(sql, params);
  }
  await connection.end();
  console.log("Seed encoding fixed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
