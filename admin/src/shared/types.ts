import type {
  afterSaleStatuses,
  deliveryStatuses,
  inquiryStatuses,
  orderStatuses,
  paymentStatuses
} from "./constants";

export type OrderStatus = (typeof orderStatuses)[number];
export type InquiryStatus = (typeof inquiryStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type DeliveryStatus = (typeof deliveryStatuses)[number];
export type AfterSaleStatus = (typeof afterSaleStatuses)[number];

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
  subtitle?: string;
  coverUrl?: string;
  price?: number;
  startPrice?: number;
  priceText?: string;
  techStack?: string;
  status: string;
  viewCount: number;
  dealCount: number;
  isFavorite?: boolean;
}

export interface ServiceSummary {
  id: number;
  name: string;
  subtitle?: string;
  coverUrl?: string;
  startPrice?: number;
  priceText?: string;
  servicePeriod?: string;
  status: string;
}

export interface DashboardOverview {
  todayCustomers: number;
  todayInquiries: number;
  pendingInquiries: number;
  pendingPayments: number;
  pendingDeliveries: number;
  pendingAfterSales: number;
  orderAmount: number;
  paidAmount: number;
  completedOrders: number;
  conversionRate: number;
}
