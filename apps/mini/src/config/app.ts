const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

export const apiBaseUrl = env.VITE_API_BASE_URL || "http://127.0.0.1:7001/api/v1";
