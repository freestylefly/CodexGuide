import { getCommunitySiteUrl, getWechatConfig, type WechatConfig } from "./config.js";
import { AppError } from "./errors.js";

type Fetch = typeof globalThis.fetch;

export const buildWechatOAuthUrl = (state: string, config: WechatConfig = getWechatConfig()): string => {
  const callback = `${getCommunitySiteUrl()}/api/auth/wechat/callback`;
  const params = new URLSearchParams({
    appid: config.appId,
    redirect_uri: callback,
    response_type: "code",
    scope: "snsapi_base",
    state,
  });

  return `https://open.weixin.qq.com/connect/oauth2/authorize?${params.toString()}#wechat_redirect`;
};

export const exchangeWechatOAuthCode = async (
  code: string,
  fetchImpl: Fetch = fetch,
  config: WechatConfig = getWechatConfig(),
): Promise<string> => {
  const params = new URLSearchParams({
    appid: config.appId,
    secret: config.appSecret,
    code,
    grant_type: "authorization_code",
  });
  const response = await fetchImpl(
    `https://api.weixin.qq.com/sns/oauth2/access_token?${params.toString()}`,
    { headers: { Accept: "application/json" } },
  );
  const data = (await response.json()) as { errcode?: number; openid?: string };

  if (!response.ok || data.errcode || !data.openid) {
    console.error("WeChat OAuth error", response.status, data.errcode);
    throw new AppError(502, "wechat_oauth_failed", "微信身份确认失败，请重新打开页面。" );
  }

  return data.openid;
};
