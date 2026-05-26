const statusText: Record<string, string> = {
  draft: "草稿",
  on_sale: "上架",
  off_sale: "下架",
  hidden: "隐藏",
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

export function pickValue<T = unknown>(row: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key] as T;
  }
  return undefined as T | undefined;
}

export function formatMoney(value: unknown) {
  if (value === undefined || value === null || value === "") return "面议";
  return `¥${Number(value).toLocaleString("zh-CN")}`;
}

export function formatDate(value: unknown) {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatStatus(value: unknown) {
  if (!value) return "待更新";
  return statusText[String(value)] || String(value);
}
