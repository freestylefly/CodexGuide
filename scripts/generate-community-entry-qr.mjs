import { fileURLToPath } from "node:url";

import QRCode from "qrcode";

const output = fileURLToPath(
  new URL("../docs/.vuepress/public/images/codexguide-paid-community-entry.svg", import.meta.url),
);
const siteUrl = new URL(
  process.env.PUBLIC_SITE_URL?.trim() || "https://codexguide.ai",
);

if (siteUrl.protocol !== "https:") {
  throw new Error("PUBLIC_SITE_URL must use HTTPS when generating the public entry QR");
}

const paymentUrl = new URL("/community/pay", siteUrl).toString();

await QRCode.toFile(output, paymentUrl, {
  type: "svg",
  errorCorrectionLevel: "H",
  margin: 2,
  width: 480,
  color: { dark: "#111827", light: "#ffffff" },
});

process.stdout.write(`${output}\n${paymentUrl}\n`);
