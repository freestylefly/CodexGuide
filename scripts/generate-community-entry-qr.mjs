import { fileURLToPath } from "node:url";

import QRCode from "qrcode";

const output = fileURLToPath(
  new URL("../docs/.vuepress/public/images/codexguide-paid-community-entry.svg", import.meta.url),
);

await QRCode.toFile(output, "https://codexguide.ai/community/join", {
  type: "svg",
  errorCorrectionLevel: "H",
  margin: 2,
  width: 480,
  color: { dark: "#111827", light: "#ffffff" },
});

process.stdout.write(`${output}\n`);
