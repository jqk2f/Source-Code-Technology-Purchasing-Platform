import { statusText } from "@/shared";

export function formatMoney(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  return `￥${Number(value).toLocaleString()}`;
}

export function formatDateTime(value: unknown) {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatStatus(value: unknown) {
  if (!value) return "-";
  return statusText[String(value)] || String(value);
}

export function formatBoolean(value: unknown) {
  return Number(value) === 1 || value === true ? "是" : "否";
}
