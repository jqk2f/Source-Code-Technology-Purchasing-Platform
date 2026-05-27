"use strict";

const BaseService = require("./base");

function makeNo(prefix) {
  return `${prefix}${Date.now()}${Math.random().toString().slice(2, 6)}`;
}

class InquiryService extends BaseService {
  async create(customerId, payload) {
    const inquiryNo = makeNo("INQ");
    const result = await this.execute(
      `INSERT INTO inquiries(
        inquiry_no, customer_id, source_type, source_id, title, description,
        contact_name, contact_mobile, contact_wechat,
        priority, status, created_at, updated_at
      ) VALUES(
        :inquiryNo, :customerId, :sourceType, :sourceId, :title, :description,
        :contactName, :contactMobile, :contactWechat,
        'normal', 'pending_follow', NOW(), NOW()
      )`,
      {
        inquiryNo,
        customerId,
        sourceType: payload.sourceType,
        sourceId: payload.sourceId || null,
        title: payload.title,
        description: payload.description || "",
        contactName: payload.contactName || "",
        contactMobile: payload.contactMobile || "",
        contactWechat: payload.contactWechat || ""
      }
    );
    return { inquiryId: result.insertId, inquiryNo, status: "pending_follow" };
  }

  async mine(customerId, query) {
    return this.page({
      table: "inquiries",
      where: `customer_id=:customerId AND deleted_at IS NULL${query.status ? " AND status=:status" : ""}`,
      params: { customerId, status: query.status },
      page: query.page,
      pageSize: query.pageSize
    });
  }

  async adminList(query) {
    const parts = ["i.deleted_at IS NULL"];
    const params = {};
    if (query.status) {
      parts.push("i.status=:status");
      params.status = query.status;
    }
    if (query.keyword) {
      parts.push("(i.title LIKE :keyword OR i.inquiry_no LIKE :keyword OR c.nickname LIKE :keyword OR c.mobile LIKE :keyword)");
      params.keyword = `%${query.keyword}%`;
    }
    return this.page({
      table: "inquiries i LEFT JOIN customers c ON c.id=i.customer_id",
      fields: "i.*, c.nickname AS customer_nickname, c.mobile AS customer_mobile",
      where: parts.join(" AND "),
      params,
      orderBy: "i.created_at DESC",
      page: query.page,
      pageSize: query.pageSize
    });
  }

  async follow(id, adminUserId, payload) {
    await this.execute(
      "INSERT INTO inquiry_follow_logs(inquiry_id, admin_user_id, content, next_follow_at, attachments, created_at) VALUES(:id, :adminUserId, :content, :nextFollowAt, :attachments, NOW())",
      {
        id,
        adminUserId,
        content: payload.content,
        nextFollowAt: payload.nextFollowAt || null,
        attachments: JSON.stringify(payload.attachments || [])
      }
    );
    await this.execute("UPDATE inquiries SET status='contacted', next_follow_at=:nextFollowAt, updated_at=NOW() WHERE id=:id", {
      id,
      nextFollowAt: payload.nextFollowAt || null
    });
    return { id };
  }
}

module.exports = InquiryService;
