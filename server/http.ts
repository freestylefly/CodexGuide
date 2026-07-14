import { AppError } from "./errors.js";

export const assertMethod = (request: Request, methods: string[]): void => {
  if (!methods.includes(request.method)) {
    throw new AppError(405, "method_not_allowed", "请求方法不受支持。");
  }
};

export const assertSameOrigin = (request: Request): void => {
  const origin = request.headers.get("origin");
  const expected = new URL(request.url).origin;

  if (!origin || origin !== expected) {
    throw new AppError(403, "invalid_origin", "请求来源无效，请刷新页面后重试。");
  }
};

export const parseJson = async <T>(request: Request): Promise<T> => {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new AppError(415, "invalid_content_type", "请求格式必须为 JSON。" );
  }

  try {
    return (await request.json()) as T;
  } catch {
    throw new AppError(400, "invalid_json", "请求内容不是有效 JSON。" );
  }
};

export const readCookie = (request: Request, name: string): string | null => {
  const cookies = request.headers.get("cookie")?.split(";") ?? [];

  for (const cookie of cookies) {
    const [key, ...value] = cookie.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }

  return null;
};

type CookieOptions = {
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: "Lax" | "Strict";
  secure?: boolean;
};

export const cookie = (name: string, value: string, options: CookieOptions = {}): string => {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${options.path ?? "/"}`];

  if (options.maxAge !== undefined) parts.push(`Max-Age=${Math.max(0, options.maxAge)}`);
  if (options.httpOnly !== false) parts.push("HttpOnly");
  if (options.secure ?? process.env.NODE_ENV === "production") parts.push("Secure");
  parts.push(`SameSite=${options.sameSite ?? "Lax"}`);

  return parts.join("; ");
};

export const deleteCookie = (name: string): string => cookie(name, "", { maxAge: 0 });

export const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return forwarded || request.headers.get("x-real-ip") || "unknown";
};

export const noStoreHeaders = (extra: HeadersInit = {}): Headers => {
  const headers = new Headers(extra);
  headers.set("Cache-Control", "no-store, private, max-age=0");
  headers.set("Pragma", "no-cache");
  return headers;
};
