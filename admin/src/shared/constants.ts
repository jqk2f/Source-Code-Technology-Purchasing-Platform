export const inquiryStatuses = [
  "pending_follow",
  "contacted"
] as const;

export const catalogStatuses = ["draft", "on_sale", "off_sale"] as const;

export const statusText: Record<string, string> = {
  draft: "草稿",
  on_sale: "上架",
  off_sale: "下架",
  pending_follow: "待跟进",
  contacted: "已联系",
  normal: "正常",
  disabled: "禁用",
  cancelled: "已注销"
};
