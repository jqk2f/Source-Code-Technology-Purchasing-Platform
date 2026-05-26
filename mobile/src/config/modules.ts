export interface ClientModule {
  key: string;
  title: string;
  subtitle: string;
  route: string;
  icon: string;
  color: string;
  authRequired?: boolean;
}

export const clientModules: ClientModule[] = [
  {
    key: "products",
    title: "源码产品",
    subtitle: "成品源码、演示、二开能力",
    route: "/products",
    icon: "apps-o",
    color: "#1677ff"
  },
  {
    key: "services",
    title: "技术服务",
    subtitle: "部署、定制、运维与咨询",
    route: "/services",
    icon: "service-o",
    color: "#0f766e"
  },
  {
    key: "create-inquiry",
    title: "提交需求",
    subtitle: "定制开发、部署运维先沟通",
    route: "/inquiries/create",
    icon: "edit",
    color: "#7c3aed",
    authRequired: true
  },
  {
    key: "orders",
    title: "我的订单",
    subtitle: "查看付款、交付和验收进度",
    route: "/orders",
    icon: "orders-o",
    color: "#ea580c",
    authRequired: true
  },
  {
    key: "inquiries",
    title: "我的询单",
    subtitle: "查看需求报价和沟通进度",
    route: "/inquiries",
    icon: "records-o",
    color: "#2563eb",
    authRequired: true
  }
];
