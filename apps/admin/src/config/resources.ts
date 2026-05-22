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
  { label: "下架", value: "off_sale" },
  { label: "隐藏", value: "hidden" },
  { label: "已完成", value: "completed" },
  { label: "已关闭", value: "closed" }
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
      { key: "startPrice", title: "起售价", width: 120, format: "money" },
      { key: "status", title: "状态", width: 110, format: "status" },
      { key: "viewCount", title: "浏览", width: 100 },
      { key: "dealCount", title: "成交", width: 100 },
      { key: "createdAt", title: "创建时间", width: 170, format: "datetime" }
    ],
    fields: [
      { key: "title", label: "产品标题", required: true },
      { key: "subtitle", label: "副标题" },
      { key: "categoryId", label: "分类 ID", type: "number", required: true },
      { key: "price", label: "价格", type: "money" },
      { key: "originPrice", label: "原价", type: "money" },
      { key: "startPrice", label: "起售价", type: "money" },
      { key: "priceText", label: "价格说明" },
      { key: "techStack", label: "技术栈" },
      { key: "demoUrl", label: "演示地址" },
      { key: "isDeployIncluded", label: "包含部署", type: "switch" },
      { key: "isCustomizable", label: "支持二开", type: "switch" },
      { key: "hasDemo", label: "有演示", type: "switch" },
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
      { key: "startPrice", title: "起步价", width: 120, format: "money" },
      { key: "servicePeriod", title: "周期", width: 140 },
      { key: "status", title: "状态", width: 110, format: "status" },
      { key: "viewCount", title: "浏览", width: 100 },
      { key: "dealCount", title: "成交", width: 100 },
      { key: "createdAt", title: "创建时间", width: 170, format: "datetime" }
    ],
    fields: [
      { key: "name", label: "服务名称", required: true },
      { key: "subtitle", label: "服务简介" },
      { key: "categoryId", label: "分类 ID", type: "number", required: true },
      { key: "startPrice", label: "起步价", type: "money" },
      { key: "priceText", label: "价格说明" },
      { key: "servicePeriod", label: "服务周期" },
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
    title: "询单管理",
    endpoint: "/admin/resources/inquiries",
    createText: "新增询单",
    searchable: true,
    statusFilter: true,
    columns: [
      { key: "id", title: "ID", width: 80 },
      { key: "inquiryNo", title: "询单号", width: 170, fixed: "left" },
      { key: "title", title: "标题", width: 220 },
      { key: "contactMobile", title: "手机号", width: 130 },
      { key: "status", title: "状态", width: 120, format: "status" },
      { key: "quoteAmount", title: "报价", width: 120, format: "money" },
      { key: "nextFollowAt", title: "下次跟进", width: 170, format: "datetime" },
      { key: "createdAt", title: "创建时间", width: 170, format: "datetime" }
    ],
    fields: [
      { key: "title", label: "询单标题", required: true },
      { key: "customerId", label: "客户 ID", type: "number", required: true },
      { key: "sourceType", label: "来源类型", type: "select", options: [
        { label: "产品", value: "product" },
        { label: "服务", value: "service" },
        { label: "定制", value: "custom" },
        { label: "套餐", value: "bundle" }
      ] },
      { key: "sourceId", label: "来源 ID", type: "number" },
      { key: "contactName", label: "联系人" },
      { key: "contactMobile", label: "手机号" },
      { key: "contactWechat", label: "微信号" },
      { key: "budgetMin", label: "最低预算", type: "money" },
      { key: "budgetMax", label: "最高预算", type: "money" },
      { key: "quoteAmount", label: "报价", type: "money" },
      { key: "status", label: "状态", type: "select", options: [
        { label: "待跟进", value: "pending_follow" },
        { label: "已联系", value: "contacted" },
        { label: "待报价", value: "pending_quote" },
        { label: "已报价", value: "quoted" },
        { label: "已转订单", value: "converted" },
        { label: "已关闭", value: "closed" }
      ] },
      { key: "description", label: "需求描述", type: "textarea" },
      { key: "quoteDesc", label: "报价说明", type: "textarea" }
    ]
  },
  {
    key: "orders",
    path: "orders",
    title: "订单管理",
    endpoint: "/admin/resources/orders",
    createText: "手工建单",
    searchable: true,
    statusFilter: true,
    columns: [
      { key: "id", title: "ID", width: 80 },
      { key: "orderNo", title: "订单号", width: 170, fixed: "left" },
      { key: "title", title: "订单标题", width: 240 },
      { key: "payableAmount", title: "应收", width: 120, format: "money" },
      { key: "paidAmount", title: "实收", width: 120, format: "money" },
      { key: "paymentStatus", title: "付款", width: 120, format: "status" },
      { key: "status", title: "状态", width: 130, format: "status" },
      { key: "createdAt", title: "创建时间", width: 170, format: "datetime" }
    ],
    fields: [
      { key: "title", label: "订单标题", required: true },
      { key: "customerId", label: "客户 ID", type: "number", required: true },
      { key: "sourceType", label: "订单来源", type: "select", options: [
        { label: "产品", value: "product" },
        { label: "服务", value: "service" },
        { label: "定制", value: "custom" },
        { label: "手工", value: "manual" }
      ] },
      { key: "totalAmount", label: "订单总额", type: "money" },
      { key: "discountAmount", label: "优惠金额", type: "money" },
      { key: "extraAmount", label: "补充费用", type: "money" },
      { key: "payableAmount", label: "应收金额", type: "money" },
      { key: "paidAmount", label: "已收金额", type: "money" },
      { key: "status", label: "订单状态", type: "select", options: [
        { label: "待沟通", value: "pending_communication" },
        { label: "待付款", value: "pending_payment" },
        { label: "待确认收款", value: "payment_confirming" },
        { label: "待交付", value: "pending_delivery" },
        { label: "服务中", value: "in_service" },
        { label: "待验收", value: "pending_acceptance" },
        { label: "已完成", value: "completed" },
        { label: "已取消", value: "cancelled" }
      ] },
      { key: "paymentInstruction", label: "付款说明", type: "textarea" },
      { key: "customerRemark", label: "客户可见备注", type: "textarea" },
      { key: "internalRemark", label: "内部备注", type: "textarea" }
    ],
    rowActions: [
      {
        key: "complete",
        label: "完成",
        endpoint: (row) => `/admin/resources/orders/${row.id}`,
        method: "PUT",
        body: () => ({ status: "completed" }),
        confirm: "确认将该订单标记为已完成？"
      }
    ]
  },
  {
    key: "payments",
    path: "payments",
    title: "收款记录",
    endpoint: "/admin/resources/payments",
    createText: "新增收款",
    searchable: true,
    statusFilter: true,
    columns: [
      { key: "id", title: "ID", width: 80 },
      { key: "paymentNo", title: "收款号", width: 170, fixed: "left" },
      { key: "orderId", title: "订单 ID", width: 100 },
      { key: "amount", title: "金额", width: 120, format: "money" },
      { key: "paymentMethod", title: "方式", width: 140 },
      { key: "status", title: "状态", width: 120, format: "status" },
      { key: "createdAt", title: "创建时间", width: 170, format: "datetime" }
    ],
    fields: [
      { key: "orderId", label: "订单 ID", type: "number", required: true },
      { key: "customerId", label: "客户 ID", type: "number", required: true },
      { key: "amount", label: "收款金额", type: "money", required: true },
      { key: "paymentMethod", label: "收款方式", type: "select", options: [
        { label: "微信转账", value: "wechat_transfer" },
        { label: "支付宝转账", value: "alipay_transfer" },
        { label: "银行卡转账", value: "bank_transfer" },
        { label: "对公转账", value: "corporate_transfer" },
        { label: "其他", value: "other" }
      ] },
      { key: "transactionNo", label: "交易流水号" },
      { key: "receiverAccount", label: "收款账号" },
      { key: "status", label: "状态", type: "select", options: [
        { label: "待确认", value: "pending" },
        { label: "已确认", value: "confirmed" },
        { label: "已驳回", value: "rejected" },
        { label: "已作废", value: "voided" }
      ] },
      { key: "remark", label: "备注", type: "textarea" }
    ],
    rowActions: [
      {
        key: "confirm",
        label: "确认收款",
        type: "primary",
        endpoint: (row) => `/admin/payment-records/${row.id}/confirm`,
        method: "POST",
        body: (row) => ({ confirmedAmount: row.amount }),
        confirm: "确认该收款已到账？"
      }
    ]
  },
  {
    key: "deliveries",
    path: "deliveries",
    title: "交付管理",
    endpoint: "/admin/resources/deliveries",
    createText: "新增交付",
    searchable: true,
    statusFilter: true,
    columns: [
      { key: "id", title: "ID", width: 80 },
      { key: "deliveryNo", title: "交付号", width: 170, fixed: "left" },
      { key: "orderId", title: "订单 ID", width: 100 },
      { key: "type", title: "类型", width: 130 },
      { key: "title", title: "交付标题", width: 220 },
      { key: "isCustomerVisible", title: "客户可见", width: 110, format: "boolean" },
      { key: "status", title: "状态", width: 120, format: "status" },
      { key: "createdAt", title: "创建时间", width: 170, format: "datetime" }
    ],
    fields: [
      { key: "orderId", label: "订单 ID", type: "number", required: true },
      { key: "type", label: "交付类型", type: "select", options: [
        { label: "源码文件", value: "source_file" },
        { label: "网盘链接", value: "netdisk" },
        { label: "Git 仓库", value: "git_repo" },
        { label: "部署信息", value: "deploy_info" },
        { label: "文档资料", value: "document" }
      ] },
      { key: "title", label: "交付标题", required: true },
      { key: "content", label: "交付内容", type: "textarea" },
      { key: "isCustomerVisible", label: "客户可见", type: "switch" },
      { key: "status", label: "交付状态", type: "select", options: [
        { label: "待交付", value: "pending" },
        { label: "部分交付", value: "partial" },
        { label: "已交付", value: "delivered" },
        { label: "需补充", value: "need_supplement" }
      ] }
    ]
  },
  {
    key: "after-sales",
    path: "after-sales",
    title: "售后工单",
    endpoint: "/admin/resources/after-sales",
    createText: "新增工单",
    searchable: true,
    statusFilter: true,
    columns: [
      { key: "id", title: "ID", width: 80 },
      { key: "ticketNo", title: "工单号", width: 170, fixed: "left" },
      { key: "orderId", title: "订单 ID", width: 100 },
      { key: "type", title: "问题类型", width: 150 },
      { key: "title", title: "标题", width: 220 },
      { key: "status", title: "状态", width: 130, format: "status" },
      { key: "createdAt", title: "创建时间", width: 170, format: "datetime" }
    ],
    fields: [
      { key: "orderId", label: "订单 ID", type: "number", required: true },
      { key: "customerId", label: "客户 ID", type: "number", required: true },
      { key: "type", label: "问题类型", type: "select", options: [
        { label: "资料无法下载", value: "download_failed" },
        { label: "源码运行问题", value: "source_run_issue" },
        { label: "部署问题", value: "deploy_issue" },
        { label: "功能疑问", value: "function_question" },
        { label: "其他", value: "other" }
      ] },
      { key: "title", label: "问题标题", required: true },
      { key: "description", label: "问题描述", type: "textarea", required: true },
      { key: "environment", label: "环境信息" },
      { key: "status", label: "状态", type: "select", options: [
        { label: "待处理", value: "pending" },
        { label: "处理中", value: "processing" },
        { label: "待客户反馈", value: "waiting_customer" },
        { label: "已解决", value: "resolved" },
        { label: "已关闭", value: "closed" }
      ] },
      { key: "result", label: "处理结果", type: "textarea" }
    ],
    rowActions: [
      {
        key: "resolve",
        label: "标记解决",
        endpoint: (row) => `/admin/resources/after-sales/${row.id}`,
        method: "PUT",
        body: () => ({ status: "resolved" }),
        confirm: "确认该售后工单已解决？"
      }
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
      { key: "companyName", title: "公司", width: 180 },
      { key: "source", title: "来源", width: 120 },
      { key: "status", title: "状态", width: 110, format: "status" },
      { key: "createdAt", title: "创建时间", width: 170, format: "datetime" }
    ],
    fields: [
      { key: "nickname", label: "昵称", required: true },
      { key: "mobile", label: "手机号" },
      { key: "companyName", label: "公司名称" },
      { key: "contactName", label: "联系人" },
      { key: "contactWechat", label: "联系微信" },
      { key: "source", label: "客户来源" },
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
