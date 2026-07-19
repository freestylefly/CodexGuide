import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const envPath = join(projectRoot, ".env.local");
const distRoot = join(projectRoot, "docs/.vuepress/dist");
const functionsRoot = join(projectRoot, ".tmp/local-functions");
const port = 3000;

const parseEnvValue = (value) => {
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }

  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1);
  }

  // AppID 等支付标识可能是超过 Number.MAX_SAFE_INTEGER 的纯数字字符串。
  // 未加引号的值必须原样保留，不能使用 JSON.parse 造成精度丢失。
  return value;
};

const envContent = await readFile(envPath, "utf8");
for (const line of envContent.split(/\r?\n/u)) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/u);
  if (!match || process.env[match[1]] !== undefined) continue;
  process.env[match[1]] = parseEnvValue(match[2]);
}
process.env.NODE_ENV = "development";

const routeFiles = new Map([
  ["/api/admin/alipay-refund", "api/admin/alipay-refund.js"],
  ["/api/admin/alipay-refund-status", "api/admin/alipay-refund-status.js"],
  ["/api/admin/group-qr", "api/admin/group-qr.js"],
  ["/api/admin/login", "api/admin/login.js"],
  ["/api/admin/logout", "api/admin/logout.js"],
  ["/api/admin/session", "api/admin/session.js"],
  ["/api/alipay/notify", "api/alipay/notify.js"],
  ["/api/alipay/order", "api/alipay/order.js"],
  ["/api/auth/alipay/session", "api/auth/alipay/session.js"],
  ["/api/community/config", "api/community/config.js"],
  ["/api/community/qr", "api/community/qr.js"],
  ["/api/community/status", "api/community/status.js"],
]);
const handlers = new Map();

for (const [route, file] of routeFiles) {
  const moduleUrl = pathToFileURL(join(functionsRoot, file));
  const module = await import(moduleUrl.href);
  handlers.set(route, module.default);
}

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

const bodyFrom = async (request) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
};

const writeFetchResponse = async (target, response) => {
  target.statusCode = response.status;
  for (const [name, value] of response.headers) {
    if (name.toLowerCase() !== "set-cookie") target.setHeader(name, value);
  }
  const setCookies = response.headers.getSetCookie?.() || [];
  if (setCookies.length > 0) target.setHeader("Set-Cookie", setCookies);
  target.end(Buffer.from(await response.arrayBuffer()));
};

const apiResponse = async (request, handler) => {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) headers.set(name, value.join(", "));
    else if (value !== undefined) headers.set(name, value);
  }
  const method = request.method || "GET";
  const body = method === "GET" || method === "HEAD" ? undefined : await bodyFrom(request);
  const fetchRequest = new Request(`http://localhost:${port}${request.url}`, {
    method,
    headers,
    body,
  });
  return handler.fetch(fetchRequest);
};

const staticFile = async (pathname) => {
  const decoded = decodeURIComponent(pathname);
  const safePath = normalize(decoded).replace(/^(?:\.\.(?:\/|\\|$))+/u, "");
  let relative = safePath.replace(/^\/+/, "");
  if (!relative || relative.endsWith("/")) relative += "index.html";
  else if (!extname(relative)) relative += ".html";
  const absolute = join(distRoot, relative);
  const info = await stat(absolute);
  if (!info.isFile()) throw new Error("not_file");
  return { absolute, contentType: contentTypes.get(extname(absolute)) || "application/octet-stream" };
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://localhost:${port}`);
    const handler = handlers.get(url.pathname);

    if (handler) {
      await writeFetchResponse(response, await apiResponse(request, handler));
      return;
    }

    if (url.pathname.startsWith("/api/")) {
      response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: { code: "not_found", message: "接口不存在。" } }));
      return;
    }

    const file = await staticFile(url.pathname);
    response.writeHead(200, {
      "Cache-Control": file.contentType.startsWith("text/html") ? "no-store" : "public, max-age=3600",
      "Content-Type": file.contentType,
      "X-Content-Type-Options": "nosniff",
    });
    if (request.method === "HEAD") response.end();
    else response.end(await readFile(file.absolute));
  } catch (error) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not Found");
  }
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`Alipay sandbox site: http://localhost:${port}/community/join\n`);
});
