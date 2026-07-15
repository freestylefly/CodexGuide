import { ConfigError } from "./config.js";

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorResponse = (error: unknown): Response => {
  const headers = {
    "Cache-Control": "no-store, private, max-age=0",
    Pragma: "no-cache",
  };

  if (error instanceof AppError) {
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status, headers },
    );
  }

  if (error instanceof ConfigError) {
    console.error(error.message);
    return Response.json(
      { error: { code: "service_not_configured", message: "付费入群服务尚未配置完成。" } },
      { status: 503, headers },
    );
  }

  console.error(error);
  return Response.json(
    { error: { code: "internal_error", message: "服务暂时不可用，请稍后重试。" } },
    { status: 500, headers },
  );
};
