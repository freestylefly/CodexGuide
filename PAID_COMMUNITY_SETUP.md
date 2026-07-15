# 付费交流群部署说明

当前统一使用原有正式域名 `codexguide.ai`。付费说明页面位于
`https://codexguide.ai/community/join`，入口二维码指向
`https://codexguide.ai/community/pay`，用于直接拉起支付宝网站支付。管理页位于
`https://codexguide.ai/community/admin`。支付金额由服务端固定为 990 分，不能由浏览器传入。

## 1. 准备 Neon

1. 在 Vercel 项目中连接 Neon Postgres，将池化连接串保存为 `DATABASE_URL`。
2. 在本地临时导出同一连接串，执行 `pnpm db:migrate`。
3. 迁移可重复执行；脚本会按文件名依次运行 `migrations/` 中的幂等迁移。

## 2. 本地支付宝沙箱

1. 运行 `pnpm alipay:configure-sandbox`，从受保护的 `.alipay-sandbox.json` 生成 `.env.local`。
2. `.alipay-sandbox.json` 和 `.env.local` 均已被 Git 忽略，严禁提交或复制到对话、日志。
3. 本地使用沙箱网关，`ALIPAY_NOTIFY_ENABLED=false`；支付结果依靠同步回跳后的主动查单确认。
4. 配置 `DATABASE_URL` 后执行 `pnpm db:migrate`，再运行 `pnpm alipay:sandbox` 启动同源页面与 Functions。
5. 浏览器支付入口为 `http://localhost:3000/community/join`，直接付款入口为
   `http://localhost:3000/community/pay`，同步回跳为 `http://localhost:3000/community/result`。

本地没有公网 HTTPS `notify_url`，因此只能完成本地生产参数验收；异步通知代码已经实现，但公网通知联调必须在部署后完成。

## 3. 配置支付宝生产环境

1. 确认 `codexguide.ai` 的 ICP 备案主体与支付宝签约主体满足审核要求。
2. 在支付宝开放平台完成网站支付产品签约与网页应用发布，审核网站使用 `https://codexguide.ai`。
3. 确认 `ALIPAY_APP_ID`、应用公钥、`ALIPAY_PRIVATE_KEY` 和 `ALIPAY_PUBLIC_KEY` 属于同一套生产应用密钥。
4. Node.js 使用 PKCS#1 应用私钥；格式不一致时用支付宝开放平台密钥工具转换，不要手工添加 PEM 头尾。
5. 在 Vercel 配置 `ALIPAY_ENV=production`、`ALIPAY_GATEWAY=https://openapi.alipay.com/gateway.do`、`ALIPAY_NOTIFY_ENABLED=true` 和 `WECHAT_PAYMENT_ENABLED=false`。
6. 生产异步通知地址为 `https://codexguide.ai/api/alipay/notify`。该地址必须公网 HTTPS 可访问、不得重定向，也不能被部署保护拦截。
7. 退款接口仅允许已登录管理员调用；同一次退款会复用同一个退款请求号，避免重复退款。

## 4. 微信支付当前停用

微信 OAuth、JSAPI 下单和通知处理代码仍保留在仓库中，但当前交流群不展示微信支付入口，
也不要求配置任何微信支付密钥。`WECHAT_PAYMENT_ENABLED` 必须保持为 `false`；此时旧微信支付入口返回 404。
以后恢复微信支付时，再单独补回环境变量、公众号授权域名、JSAPI 授权目录和公网通知验收。

## 5. 配置管理员

生成密码哈希：

```bash
read -s ADMIN_PASSWORD
export ADMIN_PASSWORD
pnpm admin:hash-password
unset ADMIN_PASSWORD
```

只把命令输出保存为 Vercel 的 `ADMIN_PASSWORD_HASH`，不要保存明文密码。部署后打开管理页，登录并上传新的微信群二维码。支持 PNG、JPEG、WebP，最大 2 MB。

支付宝退款可通过受保护的管理员退款接口执行，也可在支付宝商家平台人工处理。平台人工退款后，用 Neon SQL Editor 同步撤销资格：

```sql
UPDATE community_orders
SET status = 'REFUNDED', refunded_at = NOW(), updated_at = NOW()
WHERE id = '商户订单号' AND status = 'PAID';
```

## 6. 上线检查

1. 先让旧的公开群二维码失效，再上传从未公开过的新群码。
2. 验证支付宝下单、浏览器表单跳转、主动查单、同步回跳、退款与退款查询。
3. 部署公网 HTTPS 环境后验证支付宝异步通知验签、金额与商户校验、幂等处理和 `success` 响应。
4. 确认未付款会话请求 `/api/community/qr` 返回 403。
5. 正式发布前确认生产环境金额仍固定为 990 分，且沙箱密钥没有进入 Vercel 生产变量。
