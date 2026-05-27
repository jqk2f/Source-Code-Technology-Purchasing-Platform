const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

export const apiBaseUrl = env.VITE_API_BASE_URL || "/api/v1";
export const appName = env.VITE_APP_TITLE || "源码与技术服务平台";
export const contactWechat = env.VITE_CONTACT_WECHAT || "jcythklb";
export const contactPhone = env.VITE_CONTACT_PHONE || "";
export const serviceTime = env.VITE_SERVICE_TIME || "工作日 9:00-18:00";
