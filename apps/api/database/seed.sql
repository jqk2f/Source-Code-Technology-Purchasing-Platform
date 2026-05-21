USE source_service_shop;

INSERT IGNORE INTO admin_users(id, username, password_hash, real_name, status, created_at, updated_at)
VALUES (1, 'admin', 'admin123', '超级管理员', 'enabled', NOW(), NOW());

INSERT IGNORE INTO admin_roles(id, code, name, description, status, created_at, updated_at)
VALUES (1, 'super_admin', '超级管理员', '拥有全部权限', 'enabled', NOW(), NOW());

INSERT IGNORE INTO admin_user_roles(admin_user_id, role_id) VALUES (1, 1);

INSERT IGNORE INTO admin_permissions(id, code, name, type, parent_id, path, sort_no, created_at, updated_at)
VALUES
  (1, 'dashboard:view', '经营概览', 'menu', NULL, '/dashboard', 1, NOW(), NOW()),
  (2, 'product:view', '商品查看', 'menu', NULL, '/products', 2, NOW(), NOW()),
  (3, 'service:view', '服务查看', 'menu', NULL, '/services', 3, NOW(), NOW()),
  (4, 'inquiry:view', '询单查看', 'menu', NULL, '/inquiries', 4, NOW(), NOW()),
  (5, 'order:view', '订单查看', 'menu', NULL, '/orders', 5, NOW(), NOW()),
  (6, 'payment:view', '收款查看', 'menu', NULL, '/payments', 6, NOW(), NOW()),
  (7, 'delivery:view', '交付查看', 'menu', NULL, '/deliveries', 7, NOW(), NOW()),
  (8, 'after_sale:view', '售后查看', 'menu', NULL, '/after-sales', 8, NOW(), NOW()),
  (9, 'customer:view', '客户查看', 'menu', NULL, '/customers', 9, NOW(), NOW()),
  (10, 'payment:confirm', '确认收款', 'action', NULL, NULL, 100, NOW(), NOW()),
  (11, 'delivery:create', '添加交付', 'action', NULL, NULL, 101, NOW(), NOW()),
  (12, 'order:create', '创建订单', 'action', NULL, NULL, 102, NOW(), NOW());

INSERT IGNORE INTO admin_role_permissions(role_id, permission_id)
SELECT 1, id FROM admin_permissions;

INSERT IGNORE INTO categories(id, type, name, icon_url, is_home_visible, sort_no, status, created_at, updated_at)
VALUES
  (1, 'product', '小程序源码', '', 1, 1, 'enabled', NOW(), NOW()),
  (2, 'product', 'Web 系统源码', '', 1, 2, 'enabled', NOW(), NOW()),
  (3, 'product', '后台管理系统', '', 1, 3, 'enabled', NOW(), NOW()),
  (4, 'service', '源码部署', '', 1, 4, 'enabled', NOW(), NOW()),
  (5, 'service', 'Bug 修复', '', 1, 5, 'enabled', NOW(), NOW()),
  (6, 'service', '功能二开', '', 1, 6, 'enabled', NOW(), NOW());

INSERT IGNORE INTO tags(id, type, name, is_hot, sort_no, status, created_at, updated_at)
VALUES
  (1, 'tech', 'Vue3', 1, 1, 'enabled', NOW(), NOW()),
  (2, 'tech', 'UniApp', 1, 2, 'enabled', NOW(), NOW()),
  (3, 'tech', 'Node.js', 1, 3, 'enabled', NOW(), NOW()),
  (4, 'tech', 'MySQL', 1, 4, 'enabled', NOW(), NOW()),
  (5, 'industry', '商城', 1, 5, 'enabled', NOW(), NOW());

INSERT IGNORE INTO products(
  id, category_id, title, subtitle, cover_url, price, origin_price, start_price, price_text,
  is_deploy_included, is_customizable, has_demo, demo_url, demo_account, tech_stack,
  frontend_stack, backend_stack, database_stack, deploy_env, feature_intro, feature_list,
  delivery_content, purchase_notice, after_sale_desc, license_desc, status, is_new, is_hot,
  is_recommended, view_count, favorite_count, deal_count, sort_no, published_at, created_at, updated_at
) VALUES (
  1, 1, '商城小程序源码', '含小程序、管理后台和接口服务', '', 1999.00, 2999.00, 1999.00, '源码起售',
  0, 1, 1, 'https://demo.example.com', '联系管理员获取演示账号', 'UniApp, Vue3, Node.js, MySQL',
  'UniApp / Vue3', 'Egg.js', 'MySQL 8', 'Node.js 18+, MySQL 8',
  '适合快速搭建商城、预约、会员等业务原型。', JSON_ARRAY('商品管理','订单管理','会员管理','营销配置'),
  '源码包、数据库脚本、部署文档、使用说明', '源码商品售出后按约定售后范围处理。', '基础运行问题 7 天内协助处理。', '允许自用和商用，不允许转卖源码。',
  'on_sale', 1, 1, 1, 128, 12, 3, 1, NOW(), NOW(), NOW()
);

INSERT IGNORE INTO product_faqs(product_id, question, answer, sort_no, status, created_at, updated_at)
VALUES
  (1, '是否包含部署？', '默认不包含，可选购部署服务。', 1, 'enabled', NOW(), NOW()),
  (1, '是否支持二开？', '支持，需根据需求单独报价。', 2, 'enabled', NOW(), NOW());

INSERT IGNORE INTO product_tag_relations(product_id, tag_id) VALUES (1,1), (1,2), (1,3), (1,4);

INSERT IGNORE INTO services(
  id, category_id, name, subtitle, cover_url, start_price, price_text, service_period, service_method,
  service_scope, service_process, required_materials, delivery_standard, excluded_content, after_sale_desc,
  response_time, status, view_count, favorite_count, deal_count, sort_no, published_at, created_at, updated_at
) VALUES (
  1, 4, '源码部署服务', '协助完成环境安装、数据库导入和项目启动', '', 399.00, '按项目复杂度报价',
  '1-2 个工作日', '远程协助',
  'Node、Java、PHP、前端项目常规部署。', '确认环境 -> 远程部署 -> 验证访问 -> 交付说明。',
  '服务器、域名、源码包、数据库文件。', '系统可访问，核心页面可打开。', '不包含功能修改和长期运维。',
  '交付后 3 天内处理部署相关问题。', '工作时间 2 小时内响应',
  'on_sale', 88, 6, 5, 1, NOW(), NOW(), NOW()
);

INSERT IGNORE INTO service_packages(service_id, name, price, content, delivery_standard, sort_no, status, created_at, updated_at)
VALUES
  (1, '基础部署', 399.00, '单项目部署和运行验证', '完成访问验证', 1, 'enabled', NOW(), NOW()),
  (1, '部署加讲解', 699.00, '基础部署 + 30 分钟结构讲解', '完成部署并交付说明', 2, 'enabled', NOW(), NOW());

INSERT IGNORE INTO banners(id, title, image_url, link_type, link_value, position, sort_no, status, created_at, updated_at)
VALUES
  (1, '源码与技术服务选购', 'https://dummyimage.com/1200x420/1677ff/ffffff&text=Source+Service+Shop', 'none', '', 'home', 1, 'enabled', NOW(), NOW());
