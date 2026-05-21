"use strict";

const BaseService = require("./base");

function makeNo(prefix) {
  return `${prefix}${Date.now()}${Math.random().toString().slice(2, 6)}`;
}

class OrderService extends BaseService {
  async adminList(query) {
    const parts = ["o.deleted_at IS NULL"];
    const params = {};
    if (query.status) {
      parts.push("o.status=:status");
      params.status = query.status;
    }
    if (query.keyword) {
      parts.push("(o.title LIKE :keyword OR o.order_no LIKE :keyword OR c.nickname LIKE :keyword OR c.mobile LIKE :keyword)");
      params.keyword = `%${query.keyword}%`;
    }
    return this.page({
      table: "orders o LEFT JOIN customers c ON c.id=o.customer_id",
      fields: "o.*, c.nickname AS customer_nickname, c.mobile AS customer_mobile",
      where: parts.join(" AND "),
      params,
      orderBy: "o.created_at DESC",
      page: query.page,
      pageSize: query.pageSize
    });
  }

  async mine(customerId, query) {
    return this.page({
      table: "orders",
      where: `customer_id=:customerId AND deleted_at IS NULL${query.status ? " AND status=:status" : ""}`,
      params: { customerId, status: query.status },
      page: query.page,
      pageSize: query.pageSize
    });
  }

  async detail(id, customerId) {
    const params = { id, customerId };
    const customerWhere = customerId ? " AND customer_id=:customerId" : "";
    const order = await this.first(`SELECT * FROM orders WHERE id=:id AND deleted_at IS NULL${customerWhere}`, params);
    if (!order) return null;
    const [items, payments, deliveries, afterSales] = await Promise.all([
      this.query("SELECT * FROM order_items WHERE order_id=:id ORDER BY id ASC", { id }),
      this.query("SELECT * FROM payment_records WHERE order_id=:id ORDER BY created_at DESC", { id }),
      this.query(
        `SELECT * FROM delivery_records WHERE order_id=:id${customerId ? " AND is_customer_visible=1" : ""} ORDER BY created_at DESC`,
        { id }
      ),
      this.query("SELECT * FROM after_sale_tickets WHERE order_id=:id ORDER BY created_at DESC", { id })
    ]);
    return { ...order, items, payments, deliveries, afterSales };
  }

  async createFromInquiry(inquiryId, payload) {
    const inquiry = await this.first("SELECT * FROM inquiries WHERE id=:inquiryId AND deleted_at IS NULL", { inquiryId });
    if (!inquiry) {
      const error = new Error("询单不存在");
      error.status = 404;
      throw error;
    }
    const orderNo = makeNo("ORD");
    const items = payload.items || [];
    const itemsTotal = items.reduce((sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 1), 0);
    const discountAmount = Number(payload.discountAmount || 0);
    const extraAmount = Number(payload.extraAmount || 0);
    const payableAmount = itemsTotal - discountAmount + extraAmount;
    const result = await this.execute(
      `INSERT INTO orders(
        order_no, customer_id, inquiry_id, source_type, title, total_amount, discount_amount, extra_amount,
        payable_amount, paid_amount, payment_status, delivery_status, after_sale_status, status,
        payment_instruction, customer_remark, internal_remark, confirmed_at, created_at, updated_at
      ) VALUES(
        :orderNo, :customerId, :inquiryId, :sourceType, :title, :totalAmount, :discountAmount, :extraAmount,
        :payableAmount, 0, 'unpaid', 'not_started', 'none', 'pending_payment',
        :paymentInstruction, :customerRemark, :internalRemark, NOW(), NOW(), NOW()
      )`,
      {
        orderNo,
        customerId: inquiry.customerId,
        inquiryId,
        sourceType: inquiry.sourceType,
        title: payload.title || inquiry.title,
        totalAmount: itemsTotal,
        discountAmount,
        extraAmount,
        payableAmount,
        paymentInstruction: payload.paymentInstruction || "",
        customerRemark: payload.customerRemark || "",
        internalRemark: payload.internalRemark || ""
      }
    );
    const orderId = result.insertId;
    for (const item of items) {
      await this.execute(
        `INSERT INTO order_items(order_id, item_type, item_id, item_name, unit_price, quantity, total_amount, snapshot, created_at)
         VALUES(:orderId, :itemType, :itemId, :itemName, :unitPrice, :quantity, :totalAmount, :snapshot, NOW())`,
        {
          orderId,
          itemType: item.itemType,
          itemId: item.itemId || null,
          itemName: item.itemName,
          unitPrice: Number(item.unitPrice || 0),
          quantity: Number(item.quantity || 1),
          totalAmount: Number(item.unitPrice || 0) * Number(item.quantity || 1),
          snapshot: JSON.stringify(item.snapshot || {})
        }
      );
    }
    await this.execute("UPDATE inquiries SET status='converted', converted_order_id=:orderId, updated_at=NOW() WHERE id=:inquiryId", {
      orderId,
      inquiryId
    });
    return { orderId, orderNo, status: "pending_payment" };
  }

  async addPayment(orderId, customerId, payload, createdByAdmin = false) {
    const order = await this.first("SELECT * FROM orders WHERE id=:orderId AND deleted_at IS NULL", { orderId });
    if (!order || (!createdByAdmin && order.customerId !== customerId)) {
      const error = new Error("订单不存在");
      error.status = 404;
      throw error;
    }
    const paymentNo = makeNo("PAY");
    const result = await this.execute(
      `INSERT INTO payment_records(payment_no, order_id, customer_id, amount, payment_method, paid_at, voucher_file_id, transaction_no, status, remark, created_at, updated_at)
       VALUES(:paymentNo, :orderId, :customerId, :amount, :paymentMethod, :paidAt, :voucherFileId, :transactionNo, 'pending', :remark, NOW(), NOW())`,
      {
        paymentNo,
        orderId,
        customerId: order.customerId,
        amount: payload.amount,
        paymentMethod: payload.paymentMethod,
        paidAt: payload.paidAt || null,
        voucherFileId: payload.voucherFileId || null,
        transactionNo: payload.transactionNo || "",
        remark: payload.remark || ""
      }
    );
    await this.execute("UPDATE orders SET status='payment_confirming', updated_at=NOW() WHERE id=:orderId", { orderId });
    return { paymentRecordId: result.insertId, paymentNo, status: "pending" };
  }

  async confirmPayment(paymentId, adminUserId, payload) {
    const payment = await this.first("SELECT * FROM payment_records WHERE id=:paymentId", { paymentId });
    if (!payment) {
      const error = new Error("收款记录不存在");
      error.status = 404;
      throw error;
    }
    await this.execute(
      `UPDATE payment_records
       SET amount=:amount, receiver_account=:receiverAccount, transaction_no=:transactionNo, status='confirmed',
           confirmed_by=:adminUserId, confirmed_at=NOW(), remark=:remark, updated_at=NOW()
       WHERE id=:paymentId`,
      {
        paymentId,
        amount: payload.confirmedAmount || payment.amount,
        receiverAccount: payload.receiverAccount || payment.receiverAccount || "",
        transactionNo: payload.transactionNo || payment.transactionNo || "",
        adminUserId,
        remark: payload.remark || payment.remark || ""
      }
    );
    const total = await this.first("SELECT COALESCE(SUM(amount),0) AS paid FROM payment_records WHERE order_id=:orderId AND status='confirmed'", {
      orderId: payment.orderId
    });
    const order = await this.first("SELECT * FROM orders WHERE id=:orderId", { orderId: payment.orderId });
    const paidAmount = Number(total.paid || 0);
    const isPaid = paidAmount >= Number(order.payableAmount || 0);
    const nextStatus = isPaid ? (order.sourceType === "service" || order.sourceType === "custom" ? "in_service" : "pending_delivery") : "partial_paid";
    await this.execute(
      "UPDATE orders SET paid_amount=:paidAmount, payment_status=:paymentStatus, status=:status, paid_at=:paidAt, updated_at=NOW() WHERE id=:orderId",
      {
        orderId: payment.orderId,
        paidAmount,
        paymentStatus: isPaid ? "paid" : "partial_paid",
        status: nextStatus,
        paidAt: isPaid ? new Date() : null
      }
    );
    return { orderId: payment.orderId, paidAmount, orderStatus: nextStatus };
  }

  async addDelivery(orderId, adminUserId, payload) {
    const deliveryNo = makeNo("DEL");
    const result = await this.execute(
      `INSERT INTO delivery_records(delivery_no, order_id, type, title, content, attachments, is_customer_visible, status, delivered_by, delivered_at, created_at, updated_at)
       VALUES(:deliveryNo, :orderId, :type, :title, :content, :attachments, :isCustomerVisible, :status, :adminUserId, NOW(), NOW(), NOW())`,
      {
        deliveryNo,
        orderId,
        type: payload.type,
        title: payload.title,
        content: payload.content || "",
        attachments: JSON.stringify(payload.attachmentFileIds || []),
        isCustomerVisible: payload.isCustomerVisible === false ? 0 : 1,
        status: payload.status || "delivered",
        adminUserId
      }
    );
    await this.execute("UPDATE orders SET delivery_status='delivered', status='pending_acceptance', updated_at=NOW() WHERE id=:orderId", { orderId });
    return { deliveryId: result.insertId, deliveryNo, status: payload.status || "delivered" };
  }
}

module.exports = OrderService;
