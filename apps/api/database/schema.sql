CREATE DATABASE IF NOT EXISTS source_service_shop DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE source_service_shop;

CREATE TABLE IF NOT EXISTS customers (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(64) NULL UNIQUE,
  unionid VARCHAR(64) NULL,
  mobile VARCHAR(20) NULL,
  nickname VARCHAR(64) NULL,
  avatar_url VARCHAR(500) NULL,
  company_name VARCHAR(128) NULL,
  contact_name VARCHAR(64) NULL,
  contact_wechat VARCHAR(64) NULL,
  contact_address VARCHAR(255) NULL,
  source VARCHAR(32) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'normal',
  last_visit_at DATETIME NULL,
  remark VARCHAR(500) NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME NULL,
  INDEX idx_customers_mobile (mobile),
  INDEX idx_customers_status (status),
  INDEX idx_customers_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  real_name VARCHAR(64) NULL,
  mobile VARCHAR(20) NULL,
  email VARCHAR(128) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'enabled',
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_roles (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(64) NOT NULL,
  description VARCHAR(255) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'enabled',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_permissions (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(32) NOT NULL,
  parent_id BIGINT UNSIGNED NULL,
  path VARCHAR(255) NULL,
  sort_no INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_user_roles (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  admin_user_id BIGINT UNSIGNED NOT NULL,
  role_id BIGINT UNSIGNED NOT NULL,
  UNIQUE KEY uk_admin_user_role (admin_user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_role_permissions (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  role_id BIGINT UNSIGNED NOT NULL,
  permission_id BIGINT UNSIGNED NOT NULL,
  UNIQUE KEY uk_role_permission (role_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS categories (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  parent_id BIGINT UNSIGNED NULL,
  type VARCHAR(32) NOT NULL,
  name VARCHAR(64) NOT NULL,
  icon_url VARCHAR(500) NULL,
  share_title VARCHAR(128) NULL,
  share_desc VARCHAR(255) NULL,
  is_home_visible TINYINT(1) NOT NULL DEFAULT 0,
  sort_no INT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'enabled',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME NULL,
  INDEX idx_categories_type (type),
  INDEX idx_categories_status (status),
  INDEX idx_categories_sort (sort_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tags (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(32) NOT NULL,
  name VARCHAR(64) NOT NULL,
  is_hot TINYINT(1) NOT NULL DEFAULT 0,
  sort_no INT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'enabled',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_tags_type (type),
  INDEX idx_tags_hot (is_hot)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(128) NOT NULL,
  subtitle VARCHAR(255) NULL,
  cover_url VARCHAR(500) NULL,
  price DECIMAL(10,2) NULL,
  origin_price DECIMAL(10,2) NULL,
  start_price DECIMAL(10,2) NULL,
  price_text VARCHAR(100) NULL,
  is_deploy_included TINYINT(1) NOT NULL DEFAULT 0,
  is_customizable TINYINT(1) NOT NULL DEFAULT 0,
  has_demo TINYINT(1) NOT NULL DEFAULT 0,
  demo_url VARCHAR(500) NULL,
  demo_account VARCHAR(500) NULL,
  tech_stack VARCHAR(500) NULL,
  frontend_stack VARCHAR(255) NULL,
  backend_stack VARCHAR(255) NULL,
  database_stack VARCHAR(255) NULL,
  deploy_env VARCHAR(500) NULL,
  feature_intro TEXT NULL,
  feature_list JSON NULL,
  delivery_content TEXT NULL,
  purchase_notice TEXT NULL,
  after_sale_desc TEXT NULL,
  license_desc TEXT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  is_new TINYINT(1) NOT NULL DEFAULT 0,
  is_hot TINYINT(1) NOT NULL DEFAULT 0,
  is_recommended TINYINT(1) NOT NULL DEFAULT 0,
  view_count INT UNSIGNED NOT NULL DEFAULT 0,
  favorite_count INT UNSIGNED NOT NULL DEFAULT 0,
  deal_count INT UNSIGNED NOT NULL DEFAULT 0,
  sort_no INT NOT NULL DEFAULT 0,
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME NULL,
  INDEX idx_products_category (category_id),
  INDEX idx_products_status (status),
  INDEX idx_products_title (title),
  INDEX idx_products_flags (is_recommended, is_hot, is_new)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product_images (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(32) NOT NULL,
  url VARCHAR(500) NOT NULL,
  title VARCHAR(100) NULL,
  sort_no INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  INDEX idx_product_images_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product_tag_relations (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  tag_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  UNIQUE KEY uk_product_tag (product_id, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS product_faqs (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  sort_no INT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'enabled',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS services (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(128) NOT NULL,
  subtitle VARCHAR(255) NULL,
  cover_url VARCHAR(500) NULL,
  start_price DECIMAL(10,2) NULL,
  price_text VARCHAR(100) NULL,
  service_period VARCHAR(100) NULL,
  service_method VARCHAR(100) NULL,
  service_scope TEXT NULL,
  service_process TEXT NULL,
  required_materials TEXT NULL,
  delivery_standard TEXT NULL,
  excluded_content TEXT NULL,
  after_sale_desc TEXT NULL,
  response_time VARCHAR(100) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  view_count INT UNSIGNED NOT NULL DEFAULT 0,
  favorite_count INT UNSIGNED NOT NULL DEFAULT 0,
  deal_count INT UNSIGNED NOT NULL DEFAULT 0,
  sort_no INT NOT NULL DEFAULT 0,
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME NULL,
  INDEX idx_services_category (category_id),
  INDEX idx_services_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS service_packages (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  service_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NULL,
  content TEXT NULL,
  delivery_standard TEXT NULL,
  sort_no INT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'enabled',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_service_packages_service (service_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bundles (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(128) NOT NULL,
  cover_url VARCHAR(500) NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  origin_price DECIMAL(10,2) NULL,
  description TEXT NULL,
  suitable_scene TEXT NULL,
  purchase_notice TEXT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  is_recommended TINYINT(1) NOT NULL DEFAULT 0,
  sort_no INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inquiries (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  inquiry_no VARCHAR(32) NOT NULL UNIQUE,
  customer_id BIGINT UNSIGNED NOT NULL,
  source_type VARCHAR(32) NOT NULL,
  source_id BIGINT UNSIGNED NULL,
  title VARCHAR(128) NOT NULL,
  demand_type VARCHAR(32) NULL,
  description TEXT NULL,
  contact_name VARCHAR(64) NULL,
  contact_mobile VARCHAR(20) NULL,
  contact_wechat VARCHAR(64) NULL,
  budget_min DECIMAL(10,2) NULL,
  budget_max DECIMAL(10,2) NULL,
  expected_finish_at DATETIME NULL,
  quote_amount DECIMAL(10,2) NULL,
  quote_desc TEXT NULL,
  priority VARCHAR(32) NOT NULL DEFAULT 'normal',
  status VARCHAR(32) NOT NULL DEFAULT 'pending_follow',
  assignee_id BIGINT UNSIGNED NULL,
  next_follow_at DATETIME NULL,
  converted_order_id BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME NULL,
  INDEX idx_inquiries_customer (customer_id),
  INDEX idx_inquiries_status (status),
  INDEX idx_inquiries_source (source_type, source_id),
  INDEX idx_inquiries_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS inquiry_follow_logs (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  inquiry_id BIGINT UNSIGNED NOT NULL,
  admin_user_id BIGINT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  next_follow_at DATETIME NULL,
  attachments JSON NULL,
  created_at DATETIME NOT NULL,
  INDEX idx_follow_inquiry (inquiry_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(32) NOT NULL UNIQUE,
  customer_id BIGINT UNSIGNED NOT NULL,
  inquiry_id BIGINT UNSIGNED NULL,
  source_type VARCHAR(32) NOT NULL,
  title VARCHAR(128) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  extra_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payable_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_status VARCHAR(32) NOT NULL DEFAULT 'unpaid',
  delivery_status VARCHAR(32) NOT NULL DEFAULT 'not_started',
  after_sale_status VARCHAR(32) NOT NULL DEFAULT 'none',
  status VARCHAR(32) NOT NULL DEFAULT 'pending_communication',
  payment_instruction TEXT NULL,
  customer_remark TEXT NULL,
  internal_remark TEXT NULL,
  confirmed_at DATETIME NULL,
  paid_at DATETIME NULL,
  completed_at DATETIME NULL,
  cancelled_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME NULL,
  INDEX idx_orders_customer (customer_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  item_type VARCHAR(32) NOT NULL,
  item_id BIGINT UNSIGNED NULL,
  item_name VARCHAR(128) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  quantity INT NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  snapshot JSON NULL,
  created_at DATETIME NOT NULL,
  INDEX idx_order_items_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS payment_records (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  payment_no VARCHAR(32) NOT NULL UNIQUE,
  order_id BIGINT UNSIGNED NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(32) NOT NULL,
  paid_at DATETIME NULL,
  receiver_account VARCHAR(128) NULL,
  transaction_no VARCHAR(128) NULL,
  voucher_file_id BIGINT UNSIGNED NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  reject_reason VARCHAR(255) NULL,
  confirmed_by BIGINT UNSIGNED NULL,
  confirmed_at DATETIME NULL,
  remark VARCHAR(500) NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_payment_order (order_id),
  INDEX idx_payment_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS delivery_records (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  delivery_no VARCHAR(32) NOT NULL UNIQUE,
  order_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(32) NOT NULL,
  title VARCHAR(128) NOT NULL,
  content TEXT NULL,
  attachments JSON NULL,
  is_customer_visible TINYINT(1) NOT NULL DEFAULT 1,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  delivered_by BIGINT UNSIGNED NULL,
  delivered_at DATETIME NULL,
  customer_confirmed_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_delivery_order (order_id),
  INDEX idx_delivery_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS after_sale_tickets (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  ticket_no VARCHAR(32) NOT NULL UNIQUE,
  order_id BIGINT UNSIGNED NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  delivery_id BIGINT UNSIGNED NULL,
  type VARCHAR(32) NOT NULL,
  title VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  environment VARCHAR(500) NULL,
  attachments JSON NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  assignee_id BIGINT UNSIGNED NULL,
  result TEXT NULL,
  closed_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_after_sale_order (order_id),
  INDEX idx_after_sale_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS banners (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  link_type VARCHAR(32) NOT NULL DEFAULT 'none',
  link_value VARCHAR(255) NULL,
  position VARCHAR(32) NOT NULL DEFAULT 'home',
  sort_no INT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'enabled',
  start_at DATETIME NULL,
  end_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS files (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  biz_type VARCHAR(32) NOT NULL,
  biz_id BIGINT UNSIGNED NULL,
  original_name VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_ext VARCHAR(20) NULL,
  mime_type VARCHAR(100) NULL,
  size_bytes BIGINT UNSIGNED NOT NULL DEFAULT 0,
  storage_key VARCHAR(500) NOT NULL,
  url VARCHAR(500) NULL,
  visibility VARCHAR(32) NOT NULL DEFAULT 'private',
  checksum VARCHAR(128) NULL,
  uploaded_by_type VARCHAR(32) NOT NULL,
  uploaded_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  deleted_at DATETIME NULL,
  INDEX idx_files_biz (biz_type, biz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
