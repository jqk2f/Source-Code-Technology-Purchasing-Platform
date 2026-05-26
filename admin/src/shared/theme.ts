export interface ThemeTokens {
  brandName: string;
  primaryColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  pageBg: string;
  surfaceBg: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  borderRadius: number;
}

export const defaultTheme: ThemeTokens = {
  brandName: "源码与技术服务选购平台",
  primaryColor: "#1677ff",
  successColor: "#16a34a",
  warningColor: "#f59e0b",
  errorColor: "#dc2626",
  pageBg: "#f6f8fb",
  surfaceBg: "#ffffff",
  textColor: "#111827",
  mutedTextColor: "#6b7280",
  borderColor: "#e5e7eb",
  borderRadius: 8
};
