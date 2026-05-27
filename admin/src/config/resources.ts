export type FieldType = "text" | "textarea" | "number" | "money" | "select" | "switch" | "date";

export interface ResourceField {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  readonly?: boolean;
  options?: Array<{ label: string; value: string | number | boolean }>;
  placeholder?: string;
}

export interface ResourceColumn {
  key: string;
  title: string;
  width?: number;
  fixed?: "left" | "right";
  format?: "money" | "datetime" | "status" | "boolean";
}

export interface ResourceAction {
  key: string;
  label: string;
  type?: "primary" | "default" | "danger";
  confirm?: string;
  endpoint: (row: Record<string, unknown>) => string;
  method?: "POST" | "PUT" | "DELETE";
  body?: (row: Record<string, unknown>) => Record<string, unknown>;
}

export interface ResourceConfig {
  key: string;
  path: string;
  title: string;
  endpoint: string;
  createText?: string;
  searchable?: boolean;
  statusFilter?: boolean;
  columns: ResourceColumn[];
  fields: ResourceField[];
  rowActions?: ResourceAction[];
}

const commonStatusOptions = [
  { label: "草稿", value: "draft" },
  { label: "上架", value: "on_sale" },
  { label: "下架", value: "off_sale" }
];

export const resourceConfigs: ResourceConfig[] = [
  {
    key: "products",
    path: "products",
    title: "源码产品",
    endpoint: "/admin/resources/products",
    createText: "新增产品",
    searchable: true,
    statusFilter: true,
    columns: [
      { key: "id", title: "ID", width: 80 },
      { key: "title", title: "产品标题", width: 220, fixed: "left" },
      { key: "price", title: "价格", width: 120, format: "money" },
      { key: "techStack", title: "技术栈", width: 180 },
      { key: "demoUrl", title: "演示地址", width: 220 },
      { key: "status", title: "状态", width: 110, format: "status" }
    ],
    fields: [
      { key: "title", label: "产品标题", required: true },
      { key: "price", label: "价格", type: "money" },
      { key: "techStack", label: "技术栈" },
      { key: "demoUrl", label: "演示地址" },
      { key: "status", label: "状态", type: "select", options: commonStatusOptions },
      { key: "featureIntro", label: "功能介绍", type: "textarea" },
      { key: "deliveryContent", label: "交付内容", type: "textarea" },
      { key: "purchaseNotice", label: "购买须知", type: "textarea" }
    ]
  },
  {
    key: "services",
    path: "services",
    title: "技术服务",
    endpoint: "/admin/resources/services",
    createText: "新增服务",
    searchable: true,
    statusFilter: true,
    columns: [
      { key: "id", title: "ID", width: 80 },
      { key: "name", title: "服务名称", width: 220, fixed: "left" },
      { key: "subtitle", title: "服务简介", width: 220 },
      { key: "startPrice", title: "起步价", width: 120, format: "money" },
      { key: "serviceMethod", title: "服务方式", width: 140 },
      { key: "status", title: "状态", width: 110, format: "status" }
    ],
    fields: [
      { key: "name", label: "服务名称", required: true },
      { key: "subtitle", label: "服务简介" },
      { key: "startPrice", label: "起步价", type: "money" },
      { key: "serviceMethod", label: "服务方式" },
      { key: "status", label: "状态", type: "select", options: commonStatusOptions },
      { key: "serviceScope", label: "服务范围", type: "textarea" },
      { key: "deliveryStandard", label: "交付标准", type: "textarea" },
      { key: "excludedContent", label: "不包含内容", type: "textarea" }
    ]
  },
  {
    key: "inquiries",
    path: "inquiries",
    title: "意向管理",
    endpoint: "/admin/resources/inquiries",
    createText: "新增预约",
    searchable: true,
    statusFilter: true,
    columns: [
      { key: "id", title: "ID", width: 80 },
      { key: "inquiryNo", title: "预约号", width: 170, fixed: "left" },
      { key: "title", title: "标题", width: 220 },
      { key: "contactMobile", title: "手机号", width: 130 },
      { key: "status", title: "状态", width: 120, format: "status" },
      { key: "createdAt", title: "创建时间", width: 170, format: "datetime" }
    ],
    fields: [
      { key: "title", label: "意向标题", required: true },
      { key: "customerId", label: "客户 ID", type: "number", required: true },
      { key: "sourceType", label: "来源类型", type: "select", options: [
        { label: "源码产品", value: "product" },
        { label: "技术服务", value: "service" }
      ] },
      { key: "sourceId", label: "来源 ID", type: "number" },
      { key: "contactName", label: "联系人" },
      { key: "contactMobile", label: "手机号" },
      { key: "contactWechat", label: "微信号" },
      { key: "status", label: "状态", type: "select", options: [
        { label: "待跟进", value: "pending_follow" },
        { label: "已联系", value: "contacted" }
      ] },
      { key: "description", label: "预约说明", type: "textarea" }
    ]
  },
  {
    key: "customers",
    path: "customers",
    title: "客户管理",
    endpoint: "/admin/resources/customers",
    createText: "新增客户",
    searchable: true,
    statusFilter: true,
    columns: [
      { key: "id", title: "ID", width: 80 },
      { key: "nickname", title: "昵称", width: 160, fixed: "left" },
      { key: "mobile", title: "手机号", width: 130 },
      { key: "contactWechat", title: "微信号", width: 150 },
      { key: "status", title: "状态", width: 110, format: "status" },
      { key: "createdAt", title: "创建时间", width: 170, format: "datetime" }
    ],
    fields: [
      { key: "nickname", label: "昵称", required: true },
      { key: "mobile", label: "手机号" },
      { key: "contactName", label: "联系人" },
      { key: "contactWechat", label: "联系微信" },
      { key: "status", label: "状态", type: "select", options: [
        { label: "正常", value: "normal" },
        { label: "禁用", value: "disabled" },
        { label: "注销", value: "cancelled" }
      ] },
      { key: "remark", label: "备注", type: "textarea" }
    ]
  }
];

export function getResourceConfig(path: string) {
  return resourceConfigs.find((item) => item.path === path || `/${item.path}` === path);
}
