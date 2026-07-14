import { randomBytes, scryptSync } from "node:crypto";

const password = process.env.ADMIN_PASSWORD || "";

if (password.length < 12) {
  throw new Error("Set ADMIN_PASSWORD to a value with at least 12 characters");
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
const encoded = (value) => Buffer.from(value).toString("base64url");

process.stdout.write(`scrypt$${encoded(salt)}$${encoded(hash)}\n`);
