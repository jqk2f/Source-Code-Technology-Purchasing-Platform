const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

export const apiBaseUrl = env.VITE_API_BASE_URL || "/api/v1";
