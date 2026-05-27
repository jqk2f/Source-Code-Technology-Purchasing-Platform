import type { PageResult } from "@/shared";
import { request } from "./http";

export interface InquiryPayload {
  sourceType: "product" | "service";
  sourceId?: number;
  title: string;
  description?: string;
  contactName?: string;
  contactMobile?: string;
  contactWechat?: string;
  options?: Record<string, unknown>;
}

export function createInquiry(payload: InquiryPayload) {
  return request<{ inquiryId: number; inquiryNo: string; status: string }>("/mini/inquiries", {
    method: "POST",
    data: payload
  });
}

export function getInquiries(params: Record<string, unknown>) {
  return request<PageResult<Record<string, unknown>>>("/mini/inquiries", { method: "GET", params });
}
