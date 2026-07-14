# 付费交流群部署说明

付费入群页面位于 `https://codexguide.ai/community/join`，管理页位于
`https://codexguide.ai/community/admin`。支付金额由服务端固定为 990 分，不能由浏览器传入。

## 1. 准备 Neon

1. 在 Vercel 项目中连接 Neon Postgres，将池化连接串保存为 `DATABASE_URL`。
2. 在本地临时导出同一连接串，执行 `pnpm db:migrate`。
3. 迁移可重复执行；它只创建缺失的表和索引。

## 2. 配置公众号与微信支付

1. 在公众号后台把 `codexguide.ai` 配置为网页授权域名。
2. 在微信商户平台确认公众号 AppID 已绑定当前商户号。
3. 将 `https://codexguide.ai/community/` 配置为 JSAPI 支付授权目录。
4. 微信支付通知地址由服务端固定为
   `https://codexguide.ai/api/wechat-pay/notify`，并确保生产部署保护不会拦截该路径。
5. 按 `.env.example` 在 Vercel 中配置公众号、商户 API v3 和会话变量。

`WECHAT_PAY_VERIFICATION_KEYS` 是以平台证书序列号或微信支付公钥 ID 为键的 JSON。
证书轮换期间同时保留新旧两把验签公钥，确认微信不再使用旧序列号后再移除旧值。

所有私钥、APIv3 Key、AppSecret 和会话密钥只能保存在 Vercel 环境变量中，不要提交到仓库。

## 3. 配置管理员

生成密码哈希：

```bash
read -s ADMIN_PASSWORD
export ADMIN_PASSWORD
pnpm admin:hash-password
unset ADMIN_PASSWORD
```

只把命令输出保存为 Vercel 的 `ADMIN_PASSWORD_HASH`，不要保存明文密码。部署后打开管理页，登录并上传新的微信群二维码。支持 PNG、JPEG、WebP，最大 2 MB。

退款仍在微信商户平台人工处理。退款完成后，用 Neon SQL Editor 撤销资格：

```sql
UPDATE community_orders
SET status = 'REFUNDED', updated_at = NOW()
WHERE id = '商户订单号' AND status = 'PAID';
```

## 4. 上线检查

1. 先让旧的公开群二维码失效，再上传从未公开过的新群码。
2. 生产发布前可在隔离部署中临时修改服务端测试金额完成真实支付测试；正式提交和生产部署必须恢复为 990 分。
3. 验证微信静默授权、支付、异步通知、主动查单、刷新恢复资格和群码替换。
4. 确认未付款会话请求 `/api/community/qr` 返回 403。

微信支付没有沙箱，真实支付测试应使用受控账号和订单，并在商户平台完成对账或退款。
