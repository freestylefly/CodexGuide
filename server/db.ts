import { neon } from "@neondatabase/serverless";
import postgres from "postgres";

import { getDatabaseUrl } from "./config.js";

export type OrderStatus = "CLOSED" | "PAID" | "PENDING" | "REFUNDED" | "REVOKED";
export type PaymentProvider = "ALIPAY" | "WECHAT";

export type CommunityOrder = {
  alipay_buyer_key: string | null;
  alipay_trade_no: string | null;
  amount_cents: number;
  buyer_key: string;
  created_at: string | Date;
  currency: string;
  id: string;
  paid_at: string | Date | null;
  payment_provider: PaymentProvider;
  prepay_expires_at: string | Date | null;
  prepay_id: string | null;
  refund_request_no: string | null;
  refunded_at: string | Date | null;
  status: OrderStatus;
  updated_at: string | Date;
  wechat_transaction_id: string | null;
};

export type GroupQrAsset = {
  content_type: string;
  created_at: string | Date;
  id: number;
  image_base64: string;
};

let cachedUrl: string | null = null;
type QueryRows = Array<Record<string, unknown>>;
type TaggedSql = {
  (strings: TemplateStringsArray, ...values: unknown[]): PromiseLike<QueryRows>;
  begin?: <T>(callback: (transaction: TaggedSql) => Promise<T>) => Promise<T>;
  transaction?: (queries: PromiseLike<unknown>[]) => Promise<unknown[]>;
};

let cachedSql: TaggedSql | null = null;

const localDatabase = (url: string): boolean => {
  const hostname = new URL(url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
};

export const db = (): TaggedSql => {
  const url = getDatabaseUrl();

  if (!cachedSql || cachedUrl !== url) {
    cachedSql = localDatabase(url)
      ? (postgres(url, { max: 1, prepare: false }) as unknown as TaggedSql)
      : (neon(url) as unknown as TaggedSql);
    cachedUrl = url;
  }

  return cachedSql;
};

export const findCurrentOrder = async (
  buyerKey: string,
  provider?: PaymentProvider,
): Promise<CommunityOrder | null> => {
  const sql = db();
  const rows = provider
    ? ((await sql`
        SELECT *
        FROM community_orders
        WHERE buyer_key = ${buyerKey}
          AND payment_provider = ${provider}
          AND status IN ('PAID', 'PENDING')
        ORDER BY CASE WHEN status = 'PAID' THEN 0 ELSE 1 END, created_at DESC
        LIMIT 1
      `) as CommunityOrder[])
    : ((await sql`
        SELECT *
        FROM community_orders
        WHERE buyer_key = ${buyerKey}
          AND status IN ('PAID', 'PENDING')
        ORDER BY CASE WHEN status = 'PAID' THEN 0 ELSE 1 END, created_at DESC
        LIMIT 1
      `) as CommunityOrder[]);

  return rows[0] ?? null;
};

export const findOrderForBuyer = async (
  id: string,
  buyerKey: string,
): Promise<CommunityOrder | null> => {
  const sql = db();
  const rows = (await sql`
    SELECT *
    FROM community_orders
    WHERE id = ${id} AND buyer_key = ${buyerKey}
    LIMIT 1
  `) as CommunityOrder[];

  return rows[0] ?? null;
};

export const findOrderById = async (id: string): Promise<CommunityOrder | null> => {
  const sql = db();
  const rows = (await sql`
    SELECT * FROM community_orders WHERE id = ${id} LIMIT 1
  `) as CommunityOrder[];

  return rows[0] ?? null;
};

export const insertPendingOrder = async (
  id: string,
  buyerKey: string,
  amountCents: number,
  provider: PaymentProvider = "WECHAT",
): Promise<CommunityOrder> => {
  const sql = db();
  const rows = (await sql`
    INSERT INTO community_orders (id, buyer_key, amount_cents, currency, payment_provider, status)
    VALUES (${id}, ${buyerKey}, ${amountCents}, 'CNY', ${provider}, 'PENDING')
    RETURNING *
  `) as CommunityOrder[];

  return rows[0];
};

export const savePrepay = async (
  id: string,
  prepayId: string,
  expiresAt: Date,
): Promise<void> => {
  const sql = db();
  await sql`
    UPDATE community_orders
    SET prepay_id = ${prepayId}, prepay_expires_at = ${expiresAt.toISOString()}, updated_at = NOW()
    WHERE id = ${id} AND status = 'PENDING'
  `;
};

export const markOrderPaid = async (id: string, transactionId: string): Promise<void> => {
  const sql = db();
  await sql`
    UPDATE community_orders
    SET status = 'PAID',
        payment_provider = 'WECHAT',
        wechat_transaction_id = ${transactionId},
        paid_at = COALESCE(paid_at, NOW()),
        updated_at = NOW()
    WHERE id = ${id} AND status IN ('PENDING', 'PAID')
  `;
};

export const markAlipayOrderPaid = async (
  id: string,
  tradeNo: string,
  buyerKey: string | null,
): Promise<void> => {
  const sql = db();
  await sql`
    UPDATE community_orders
    SET status = 'PAID',
        payment_provider = 'ALIPAY',
        alipay_trade_no = ${tradeNo},
        alipay_buyer_key = COALESCE(alipay_buyer_key, ${buyerKey}),
        paid_at = COALESCE(paid_at, NOW()),
        updated_at = NOW()
    WHERE id = ${id}
      AND payment_provider = 'ALIPAY'
      AND status IN ('PENDING', 'PAID')
  `;
};

export const markOrderClosed = async (id: string): Promise<void> => {
  const sql = db();
  await sql`
    UPDATE community_orders
    SET status = 'CLOSED', updated_at = NOW()
    WHERE id = ${id} AND status = 'PENDING'
  `;
};

export const markOrderRefunded = async (
  id: string,
  refundRequestNo: string | null = null,
): Promise<void> => {
  const sql = db();
  await sql`
    UPDATE community_orders
    SET status = 'REFUNDED',
        refund_request_no = COALESCE(refund_request_no, ${refundRequestNo}),
        refunded_at = COALESCE(refunded_at, NOW()),
        updated_at = NOW()
    WHERE id = ${id} AND status IN ('PENDING', 'PAID')
  `;
};

export const saveRefundRequest = async (id: string, refundRequestNo: string): Promise<void> => {
  const sql = db();
  await sql`
    UPDATE community_orders
    SET refund_request_no = COALESCE(refund_request_no, ${refundRequestNo}), updated_at = NOW()
    WHERE id = ${id} AND payment_provider = 'ALIPAY'
  `;
};

export const getActiveGroupQr = async (): Promise<GroupQrAsset | null> => {
  const sql = db();
  const rows = (await sql`
    SELECT id, content_type, created_at, encode(image_data, 'base64') AS image_base64
    FROM community_group_qr_assets
    WHERE active = TRUE
    ORDER BY id DESC
    LIMIT 1
  `) as GroupQrAsset[];

  return rows[0] ?? null;
};

export const hasActiveGroupQr = async (): Promise<boolean> => {
  const sql = db();
  const rows = (await sql`
    SELECT EXISTS (
      SELECT 1 FROM community_group_qr_assets WHERE active = TRUE
    ) AS ready
  `) as Array<{ ready: boolean }>;

  return rows[0]?.ready === true;
};

export const replaceActiveGroupQr = async (
  contentType: string,
  bytes: Buffer,
): Promise<number> => {
  const sql = db();
  const imageBase64 = bytes.toString("base64");
  let inserted: Array<{ id: number }>;

  if (sql.begin) {
    inserted = await sql.begin(async (transaction) => {
      await transaction`UPDATE community_group_qr_assets SET active = FALSE WHERE active = TRUE`;
      return (await transaction`
        INSERT INTO community_group_qr_assets (content_type, image_data, active)
        VALUES (${contentType}, decode(${imageBase64}, 'base64'), TRUE)
        RETURNING id
      `) as Array<{ id: number }>;
    });
  } else {
    const results = await sql.transaction!([
      sql`UPDATE community_group_qr_assets SET active = FALSE WHERE active = TRUE`,
      sql`
        INSERT INTO community_group_qr_assets (content_type, image_data, active)
        VALUES (${contentType}, decode(${imageBase64}, 'base64'), TRUE)
        RETURNING id
      `,
    ]);
    inserted = results[1] as Array<{ id: number }>;
  }

  return inserted[0].id;
};

export const consumeAdminLoginAttempt = async (bucketKey: string): Promise<number> => {
  const sql = db();
  const rows = (await sql`
    INSERT INTO community_admin_login_attempts (bucket_key, window_started_at, attempts)
    VALUES (${bucketKey}, NOW(), 1)
    ON CONFLICT (bucket_key) DO UPDATE SET
      attempts = CASE
        WHEN community_admin_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes' THEN 1
        ELSE community_admin_login_attempts.attempts + 1
      END,
      window_started_at = CASE
        WHEN community_admin_login_attempts.window_started_at < NOW() - INTERVAL '15 minutes' THEN NOW()
        ELSE community_admin_login_attempts.window_started_at
      END
    RETURNING attempts
  `) as Array<{ attempts: number }>;

  return rows[0].attempts;
};

export const clearAdminLoginAttempts = async (bucketKey: string): Promise<void> => {
  const sql = db();
  await sql`DELETE FROM community_admin_login_attempts WHERE bucket_key = ${bucketKey}`;
};
