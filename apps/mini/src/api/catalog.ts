import type { PageResult, ProductSummary, ServiceSummary } from "@source-shop/shared";
import { request } from "./http";

export function getHome() {
  return request<{
    banners: unknown[];
    categories: Array<{ id: number; name: string; type: string }>;
    recommendedProducts: ProductSummary[];
    hotServices: ServiceSummary[];
    latestProducts: ProductSummary[];
    bundles: unknown[];
  }>("/mini/home");
}

export function getProducts(params: Record<string, unknown>) {
  return request<PageResult<ProductSummary>>("/mini/products", { method: "GET", data: params });
}

export function getProductDetail(id: number) {
  return request<Record<string, any>>(`/mini/products/${id}`);
}

export function getServices(params: Record<string, unknown>) {
  return request<PageResult<ServiceSummary>>("/mini/services", { method: "GET", data: params });
}

export function getServiceDetail(id: number) {
  return request<Record<string, any>>(`/mini/services/${id}`);
}
