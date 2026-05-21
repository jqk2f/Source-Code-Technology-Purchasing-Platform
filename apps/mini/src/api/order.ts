import type { PageResult } from "@source-shop/shared";
import { request } from "./http";

export function getOrders(params: Record<string, unknown>) {
  return request<PageResult<Record<string, any>>>("/mini/orders", { method: "GET", data: params });
}

export function getOrderDetail(id: number) {
  return request<Record<string, any>>(`/mini/orders/${id}`);
}

export function uploadPaymentVoucher(id: number, payload: Record<string, unknown>) {
  return request<Record<string, unknown>>(`/mini/orders/${id}/payment-vouchers`, {
    method: "POST",
    data: payload
  });
}
