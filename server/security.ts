import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

import { AppError } from "./errors.js";

const encoded = (value: Buffer | string): string => Buffer.from(value).toString("base64url");
const decoded = (value: string): Buffer => Buffer.from(value, "base64url");

export const randomToken = (bytes = 24): string => randomBytes(bytes).toString("base64url");

export const hmacHex = (value: string, secret: string): string =>
  createHmac("sha256", secret).update(value).digest("hex");

export const hashBuyer = (openid: string, secret: string): string => hmacHex(openid, secret);

type SealedPayload = Record<string, unknown> & { exp: number; type: string };

const encryptionKey = (secret: string): Buffer => createHash("sha256").update(secret).digest();

export const seal = (payload: SealedPayload, secret: string): string => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(secret), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [encoded(iv), encoded(ciphertext), encoded(tag)].join(".");
};

export const unseal = <T extends SealedPayload>(token: string | null, secret: string, type: string): T | null => {
  if (!token) return null;

  try {
    const [ivValue, ciphertextValue, tagValue, extra] = token.split(".");
    if (!ivValue || !ciphertextValue || !tagValue || extra) return null;

    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(secret), decoded(ivValue));
    decipher.setAuthTag(decoded(tagValue));
    const plaintext = Buffer.concat([
      decipher.update(decoded(ciphertextValue)),
      decipher.final(),
    ]).toString("utf8");
    const payload = JSON.parse(plaintext) as T;

    if (payload.type !== type || !Number.isFinite(payload.exp) || payload.exp <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
};

export const verifyScryptPassword = (password: string, storedHash: string): boolean => {
  const [algorithm, saltValue, hashValue, extra] = storedHash.split("$");

  if (algorithm !== "scrypt" || !saltValue || !hashValue || extra) return false;

  try {
    const expected = decoded(hashValue);
    const actual = scryptSync(password, decoded(saltValue), expected.length);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
};

export const createScryptPasswordHash = (password: string): string => {
  if (password.length < 12) {
    throw new AppError(400, "weak_password", "管理员密码至少需要 12 个字符。" );
  }

  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${encoded(salt)}$${encoded(hash)}`;
};

export type ValidImage = { bytes: Buffer; contentType: "image/jpeg" | "image/png" | "image/webp" };

export const validateGroupQrImage = (bytes: Buffer): ValidImage => {
  if (bytes.byteLength < 128) {
    throw new AppError(400, "invalid_image", "图片内容无效。" );
  }

  if (bytes.byteLength > 2 * 1024 * 1024) {
    throw new AppError(413, "image_too_large", "群二维码图片不能超过 2 MB。" );
  }

  const isPng = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isWebp =
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP";

  if (isPng) return { bytes, contentType: "image/png" };
  if (isJpeg) return { bytes, contentType: "image/jpeg" };
  if (isWebp) return { bytes, contentType: "image/webp" };

  throw new AppError(400, "unsupported_image", "只支持 PNG、JPEG 或 WebP 图片。" );
};
