export const orderStatuses = [
  "pending_communication",
  "pending_confirm",
  "pending_payment",
  "payment_confirming",
  "partial_paid",
  "pending_delivery",
  "in_service",
  "pending_acceptance",
  "completed",
  "after_sales",
  "cancelled",
  "closed"
] as const;

export const inquiryStatuses = [
  "pending_follow",
  "contacted",
  "pending_quote",
  "quoted",
  "converted",
  "invalid",
  "closed"
] as const;

export const paymentStatuses = ["pending", "confirmed", "rejected", "voided"] as const;
export const deliveryStatuses = ["pending", "partial", "delivered", "need_supplement"] as const;
export const afterSaleStatuses = ["pending", "processing", "waiting_customer", "resolved", "closed"] as const;

export const statusText: Record<string, string> = {
  pending_communication: "待沟通",
  pending_confirm: "待确认",
  pending_payment: "待付款",
  payment_confirming: "待确认收款",
  partial_paid: "部分收款",
  pending_delivery: "待交付",
  in_service: "服务中",
  pending_acceptance: "待验收",
  completed: "已完成",
  after_sales: "售后中",
  cancelled: "已取消",
  closed: "已关闭",
  pending_follow: "待跟进",
  contacted: "已联系",
  pending_quote: "待报价",
  quoted: "已报价",
  converted: "已转订单",
  invalid: "已失效",
  pending: "待处理",
  confirmed: "已确认",
  rejected: "已驳回",
  voided: "已作废",
  partial: "部分交付",
  delivered: "已交付",
  need_supplement: "需补充",
  processing: "处理中",
  waiting_customer: "待客户反馈",
  resolved: "已解决"
};

export const paymentMethods = [
  { label: "微信转账", value: "wechat_transfer" },
  { label: "支付宝转账", value: "alipay_transfer" },
  { label: "银行卡转账", value: "bank_transfer" },
  { label: "对公转账", value: "corporate_transfer" },
  { label: "其他", value: "other" }
];

export const deliveryTypes = [
  { label: "源码文件", value: "source_file" },
  { label: "网盘链接", value: "netdisk" },
  { label: "Git 仓库", value: "git_repo" },
  { label: "部署信息", value: "deploy_info" },
  { label: "账号资料", value: "account" },
  { label: "文档资料", value: "document" },
  { label: "远程服务记录", value: "remote_service" }
];
