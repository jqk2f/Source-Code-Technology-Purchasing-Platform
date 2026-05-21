import { request } from "./http";

export interface InquiryPayload {
  sourceType: "product" | "service" | "custom" | "bundle";
  sourceId?: number;
  title: string;
  demandType?: string;
  description?: string;
  contactName?: string;
  contactMobile?: string;
  contactWechat?: string;
  budgetMin?: number;
  budgetMax?: number;
  expectedFinishAt?: string;
  options?: Record<string, unknown>;
}

export function createInquiry(payload: InquiryPayload) {
  return request<{ inquiryId: number; inquiryNo: string; status: string }>("/mini/inquiries", {
    method: "POST",
    data: payload
  });
}
