"use strict";

const BaseService = require("./base");

class CatalogService extends BaseService {
  async home() {
    const [banners, categories, recommendedProducts, hotServices, latestProducts, bundles] = await Promise.all([
      this.query("SELECT id, title, image_url, link_type, link_value FROM banners WHERE status='enabled' ORDER BY sort_no ASC LIMIT 5"),
      this.query("SELECT id, name, icon_url, type FROM categories WHERE status='enabled' AND is_home_visible=1 ORDER BY sort_no ASC LIMIT 12"),
      this.query(
        `SELECT id, title, subtitle, cover_url, price, start_price, price_text, tech_stack, status, view_count, deal_count
         FROM products WHERE status='on_sale' AND is_recommended=1 AND deleted_at IS NULL ORDER BY sort_no ASC, published_at DESC LIMIT 8`
      ),
      this.query(
        `SELECT id, name, subtitle, cover_url, start_price, price_text, service_period, status
         FROM services WHERE status='on_sale' AND deleted_at IS NULL ORDER BY deal_count DESC, sort_no ASC LIMIT 6`
      ),
      this.query(
        `SELECT id, title, subtitle, cover_url, price, start_price, price_text, tech_stack, status, view_count, deal_count
         FROM products WHERE status='on_sale' AND deleted_at IS NULL ORDER BY published_at DESC LIMIT 8`
      ),
      this.query("SELECT id, name, cover_url, price, origin_price, description FROM bundles WHERE status='on_sale' AND deleted_at IS NULL ORDER BY sort_no ASC LIMIT 4")
    ]);

    return { banners, categories, recommendedProducts, hotServices, latestProducts, bundles };
  }

  async categories(type) {
    const where = type ? "status='enabled' AND type=:type" : "status='enabled'";
    return this.query(`SELECT id, parent_id, type, name, icon_url, is_home_visible FROM categories WHERE ${where} ORDER BY sort_no ASC`, { type });
  }

  async tags(type, isHot) {
    const parts = ["status='enabled'"];
    const params = {};
    if (type) {
      parts.push("type=:type");
      params.type = type;
    }
    if (isHot !== undefined) {
      parts.push("is_hot=:isHot");
      params.isHot = Number(isHot);
    }
    return this.query(`SELECT id, type, name, is_hot FROM tags WHERE ${parts.join(" AND ")} ORDER BY sort_no ASC`, params);
  }

  async products(query) {
    const parts = ["deleted_at IS NULL", "status='on_sale'"];
    const params = {};
    if (query.keyword) {
      parts.push("(title LIKE :keyword OR subtitle LIKE :keyword OR tech_stack LIKE :keyword)");
      params.keyword = `%${query.keyword}%`;
    }
    if (query.categoryId) {
      parts.push("category_id=:categoryId");
      params.categoryId = Number(query.categoryId);
    }
    if (query.hasDemo !== undefined) {
      parts.push("has_demo=:hasDemo");
      params.hasDemo = Number(query.hasDemo);
    }
    if (query.isDeployIncluded !== undefined) {
      parts.push("is_deploy_included=:isDeployIncluded");
      params.isDeployIncluded = Number(query.isDeployIncluded);
    }
    if (query.isCustomizable !== undefined) {
      parts.push("is_customizable=:isCustomizable");
      params.isCustomizable = Number(query.isCustomizable);
    }
    if (query.priceMin) {
      parts.push("COALESCE(start_price, price, 0) >= :priceMin");
      params.priceMin = Number(query.priceMin);
    }
    if (query.priceMax) {
      parts.push("COALESCE(start_price, price, 0) <= :priceMax");
      params.priceMax = Number(query.priceMax);
    }
    const orderMap = {
      latest: "published_at DESC",
      price_asc: "COALESCE(start_price, price, 0) ASC",
      price_desc: "COALESCE(start_price, price, 0) DESC",
      views: "view_count DESC",
      deals: "deal_count DESC",
      recommend: "is_recommended DESC, sort_no ASC, published_at DESC"
    };
    return this.page({
      table: "products",
      fields:
        "id,title,subtitle,cover_url,price,start_price,price_text,tech_stack,status,view_count,deal_count,is_deploy_included,is_customizable,has_demo",
      where: parts.join(" AND "),
      params,
      orderBy: orderMap[query.sort] || orderMap.recommend,
      page: query.page,
      pageSize: query.pageSize
    });
  }

  async productDetail(id) {
    const product = await this.first("SELECT * FROM products WHERE id=:id AND deleted_at IS NULL", { id });
    if (!product) return null;
    const [images, faqs, tags] = await Promise.all([
      this.query("SELECT id, type, url, title, sort_no FROM product_images WHERE product_id=:id ORDER BY sort_no ASC", { id }),
      this.query("SELECT id, question, answer FROM product_faqs WHERE product_id=:id AND status='enabled' ORDER BY sort_no ASC", { id }),
      this.query(
        `SELECT t.id, t.type, t.name FROM tags t
         JOIN product_tag_relations r ON r.tag_id=t.id WHERE r.product_id=:id`,
        { id }
      )
    ]);
    await this.execute("UPDATE products SET view_count = view_count + 1 WHERE id=:id", { id });
    return { ...product, images, faqs, tags };
  }

  async services(query) {
    const parts = ["deleted_at IS NULL", "status='on_sale'"];
    const params = {};
    if (query.keyword) {
      parts.push("(name LIKE :keyword OR subtitle LIKE :keyword OR service_scope LIKE :keyword)");
      params.keyword = `%${query.keyword}%`;
    }
    if (query.categoryId) {
      parts.push("category_id=:categoryId");
      params.categoryId = Number(query.categoryId);
    }
    const orderMap = {
      latest: "published_at DESC",
      price_asc: "start_price ASC",
      price_desc: "start_price DESC",
      deals: "deal_count DESC",
      recommend: "sort_no ASC, published_at DESC"
    };
    return this.page({
      table: "services",
      fields: "id,name,subtitle,cover_url,start_price,price_text,service_period,service_method,status,view_count,favorite_count,deal_count",
      where: parts.join(" AND "),
      params,
      orderBy: orderMap[query.sort] || orderMap.recommend,
      page: query.page,
      pageSize: query.pageSize
    });
  }

  async serviceDetail(id) {
    const service = await this.first("SELECT * FROM services WHERE id=:id AND deleted_at IS NULL", { id });
    if (!service) return null;
    const packages = await this.query("SELECT id, name, price, content, delivery_standard FROM service_packages WHERE service_id=:id AND status='enabled' ORDER BY sort_no ASC", { id });
    await this.execute("UPDATE services SET view_count = view_count + 1 WHERE id=:id", { id });
    return { ...service, packages };
  }
}

module.exports = CatalogService;
