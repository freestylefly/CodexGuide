CREATE TABLE IF NOT EXISTS community_orders (
  id VARCHAR(32) PRIMARY KEY,
  buyer_key CHAR(64) NOT NULL,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency CHAR(3) NOT NULL DEFAULT 'CNY',
  status VARCHAR(16) NOT NULL CHECK (status IN ('PENDING', 'PAID', 'CLOSED', 'REFUNDED', 'REVOKED')),
  prepay_id TEXT,
  prepay_expires_at TIMESTAMPTZ,
  wechat_transaction_id VARCHAR(64) UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS community_orders_buyer_created_idx
  ON community_orders (buyer_key, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS community_orders_one_active_per_buyer_idx
  ON community_orders (buyer_key)
  WHERE status IN ('PENDING', 'PAID');

CREATE TABLE IF NOT EXISTS community_group_qr_assets (
  id BIGSERIAL PRIMARY KEY,
  content_type VARCHAR(32) NOT NULL CHECK (content_type IN ('image/png', 'image/jpeg', 'image/webp')),
  image_data BYTEA NOT NULL,
  active BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS community_group_qr_one_active_idx
  ON community_group_qr_assets ((active))
  WHERE active = TRUE;

CREATE TABLE IF NOT EXISTS community_admin_login_attempts (
  bucket_key CHAR(64) PRIMARY KEY,
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0)
);
