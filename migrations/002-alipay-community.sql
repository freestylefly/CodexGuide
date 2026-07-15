ALTER TABLE community_orders
  ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(16) DEFAULT 'WECHAT';

UPDATE community_orders
SET payment_provider = 'WECHAT'
WHERE payment_provider IS NULL;

ALTER TABLE community_orders
  ALTER COLUMN payment_provider SET DEFAULT 'WECHAT';

ALTER TABLE community_orders
  ALTER COLUMN payment_provider SET NOT NULL;

ALTER TABLE community_orders
  ADD COLUMN IF NOT EXISTS alipay_trade_no VARCHAR(64);

ALTER TABLE community_orders
  ADD COLUMN IF NOT EXISTS alipay_buyer_key CHAR(64);

ALTER TABLE community_orders
  ADD COLUMN IF NOT EXISTS refund_request_no VARCHAR(64);

ALTER TABLE community_orders
  ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS community_orders_alipay_trade_no_unique_idx
  ON community_orders (alipay_trade_no)
  WHERE alipay_trade_no IS NOT NULL;
