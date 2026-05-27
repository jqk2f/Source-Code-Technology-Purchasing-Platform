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
    key: "inquiries",
    title: "我的预约",
    subtitle: "查看预约跟进状态",
    route: "/inquiries",
    icon: "records-o",
    color: "#2563eb",
    authRequired: true
  }
];
