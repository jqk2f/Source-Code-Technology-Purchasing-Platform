const statusText: Record<string, string> = {
  draft: "草稿",
  on_sale: "上架",
  off_sale: "下架",
  pending_follow: "待跟进",
  contacted: "已联系",
  normal: "正常",
  disabled: "禁用",
  cancelled: "已注销"
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
