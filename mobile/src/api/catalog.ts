import type { PageResult, ProductSummary, ServiceSummary } from "@/shared";
import { request } from "./http";

export interface CategoryItem {
  id: number;
  name: string;
  type: string;
  icon_url?: string;
  iconUrl?: string;
}

export function getHome() {
  return request<{
    banners: Array<Record<string, unknown>>;
    categories: CategoryItem[];
    recommendedProducts: ProductSummary[];
    hotServices: ServiceSummary[];
    latestProducts: ProductSummary[];
    bundles: Array<Record<string, unknown>>;
  }>("/mini/home");
}

export function getCategories(type?: string) {
  return request<CategoryItem[]>("/mini/categories", { method: "GET", params: { type } });
}

export function getProducts(params: Record<string, unknown>) {
  return request<PageResult<ProductSummary>>("/mini/products", { method: "GET", params });
}

export function getProductDetail(id: number) {
  return request<Record<string, unknown>>(`/mini/products/${id}`);
}

export function getServices(params: Record<string, unknown>) {
  return request<PageResult<ServiceSummary>>("/mini/services", { method: "GET", params });
}

export function getServiceDetail(id: number) {
  return request<Record<string, unknown>>(`/mini/services/${id}`);
}
