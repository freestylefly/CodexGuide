import { randomBytes } from "node:crypto";
import { chmod, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const sandboxPath = fileURLToPath(new URL("../.alipay-sandbox.json", import.meta.url));
const envPath = fileURLToPath(new URL("../.env.local", import.meta.url));
const sandbox = JSON.parse(await readFile(sandboxPath, "utf8"));
const app = sandbox.appIds?.[0];
const required = {
  ALIPAY_APP_ID: app?.appId,
  ALIPAY_PRIVATE_KEY: app?.appPrivatePkcsKey,
  ALIPAY_PUBLIC_KEY: app?.alipayPublicKey,
  ALIPAY_SELLER_ID: app?.pid,
};
const missing = Object.entries(required)
  .filter(([, value]) => typeof value !== "string" || value.length === 0)
  .map(([name]) => name);

if (missing.length > 0) {
  throw new Error(`Sandbox config is missing required fields: ${missing.join(", ")}`);
}

let existing = "";
try {
  existing = await readFile(envPath, "utf8");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const managedNames = new Set([
  "ALIPAY_APP_ID",
  "ALIPAY_ENV",
  "ALIPAY_GATEWAY",
  "ALIPAY_NOTIFY_ENABLED",
  "ALIPAY_PRIVATE_KEY",
  "ALIPAY_PUBLIC_KEY",
  "ALIPAY_SELLER_ID",
  "COMMUNITY_BUYER_HMAC_SECRET",
  "COMMUNITY_SESSION_SECRET",
  "DATABASE_URL",
  "PUBLIC_SITE_URL",
]);
const preserved = existing
  .split(/\r?\n/u)
  .filter((line) => {
    const match = line.match(/^([A-Z0-9_]+)=/u);
    return !match || !managedNames.has(match[1]);
  })
  .filter((line, index, lines) => line.length > 0 || (index > 0 && lines[index - 1].length > 0));

const previousValue = (name) => {
  const match = existing.match(new RegExp(`^${name}=(.*)$`, "mu"));
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return match[1];
  }
};
const secret = (name) => previousValue(name) || randomBytes(32).toString("hex");
const managed = {
  PUBLIC_SITE_URL: "http://localhost:3000",
  ALIPAY_ENV: "sandbox",
  ALIPAY_APP_ID: required.ALIPAY_APP_ID,
  ALIPAY_PRIVATE_KEY: required.ALIPAY_PRIVATE_KEY,
  ALIPAY_PUBLIC_KEY: required.ALIPAY_PUBLIC_KEY,
  ALIPAY_SELLER_ID: required.ALIPAY_SELLER_ID,
  ALIPAY_GATEWAY: "https://openapi-sandbox.dl.alipaydev.com/gateway.do",
  ALIPAY_NOTIFY_ENABLED: "false",
  COMMUNITY_SESSION_SECRET: secret("COMMUNITY_SESSION_SECRET"),
  COMMUNITY_BUYER_HMAC_SECRET: secret("COMMUNITY_BUYER_HMAC_SECRET"),
  DATABASE_URL: previousValue("DATABASE_URL") || "postgresql://127.0.0.1:55432/codexguide_alipay",
};
const content = [
  ...preserved,
  ...(preserved.length > 0 ? [""] : []),
  "# Generated from .alipay-sandbox.json. Do not commit.",
  ...Object.entries(managed).map(([name, value]) => `${name}=${JSON.stringify(value)}`),
  "",
].join("\n");

await writeFile(envPath, content, { encoding: "utf8", mode: 0o600 });
await chmod(envPath, 0o600);

const written = Object.fromEntries(
  content
    .split(/\r?\n/u)
    .map((line) => line.match(/^([A-Z0-9_]+)=(.*)$/u))
    .filter(Boolean)
    .map((match) => {
      try {
        return [match[1], JSON.parse(match[2])];
      } catch {
        return [match[1], match[2]];
      }
    }),
);

for (const [name, value] of Object.entries(required)) {
  if (written[name] !== value) throw new Error(`Sandbox mapping mismatch: ${name}`);
}
if (written.ALIPAY_PRIVATE_KEY.includes("BEGIN") || written.ALIPAY_PRIVATE_KEY.includes("END")) {
  throw new Error("Sandbox private key must remain an unwrapped PKCS#1 string");
}

process.stdout.write(
  `${projectRoot}.env.local\nappId=${written.ALIPAY_APP_ID}, sellerId=${written.ALIPAY_SELLER_ID}, gateway=sandbox, notify=disabled\n`,
);
