import type { PageResult } from "@/shared";
import { request } from "./http";

export function getOrders(params: Record<string, unknown>) {
  return request<PageResult<Record<string, unknown>>>("/mini/orders", { method: "GET", params });
}

export function getOrderDetail(id: number) {
  return request<Record<string, unknown>>(`/mini/orders/${id}`);
}

export interface CreateOrderPayload {
  sourceType: "product" | "service";
  sourceId: number;
  quantity?: number;
  contactName?: string;
  contactMobile?: string;
  customerRemark?: string;
}

export function createOrder(payload: CreateOrderPayload) {
  return request<{ orderId: number; orderNo: string; status: string }>("/mini/orders", {
    method: "POST",
    data: payload
  });
}

export function uploadPaymentVoucher(id: number, payload: Record<string, unknown>) {
  return request<Record<string, unknown>>(`/mini/orders/${id}/payment-vouchers`, {
    method: "POST",
    data: payload
  });
}
