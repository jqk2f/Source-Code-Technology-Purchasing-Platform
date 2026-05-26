export interface JwtPayload {
  id: number;
  type: string;
  exp?: number;
  iat?: number;
  permissions?: string[];
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpiringSoon(token: string, withinSeconds = 10 * 60) {
  const payload = parseJwt(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 - Date.now() < withinSeconds * 1000;
}
