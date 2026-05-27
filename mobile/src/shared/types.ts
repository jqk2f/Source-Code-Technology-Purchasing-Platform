import type { inquiryStatuses } from "./constants";

export type InquiryStatus = (typeof inquiryStatuses)[number];

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  traceId?: string;
}

export interface PageResult<T> {
  list: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ProductSummary {
  id: number;
  title: string;
  price?: number;
  techStack?: string;
  status: string;
  demoUrl?: string;
  featureIntro?: string;
}

export interface ServiceSummary {
  id: number;
  name: string;
  subtitle?: string;
  startPrice?: number;
  serviceMethod?: string;
  status: string;
}

export interface DashboardOverview {
  todayCustomers: number;
  todayInquiries: number;
  pendingInquiries: number;
  contactedInquiries: number;
  conversionRate: number;
}
