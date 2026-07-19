export type CommunityRuntimeConfig = {
  communityOrigin: string;
  paymentEnabled: boolean;
  paymentProvider: "ALIPAY";
  priceCents: number;
};

const responseError = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { error?: { message?: string } };
    return data.error?.message || "交流群服务暂时不可用，请稍后重试。";
  } catch {
    return "交流群服务暂时不可用，请稍后重试。";
  }
};

export const loadCommunityRuntimeConfig = async (): Promise<CommunityRuntimeConfig> => {
  const response = await fetch("/api/community/config", {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await responseError(response));

  const config = (await response.json()) as CommunityRuntimeConfig;
  const communityOrigin = new URL(config.communityOrigin).origin;
  if (!["http:", "https:"].includes(new URL(communityOrigin).protocol)) {
    throw new Error("交流群正式地址配置无效。");
  }

  return { ...config, communityOrigin };
};

export const redirectToCommunityOrigin = (communityOrigin: string): boolean => {
  if (window.location.origin === communityOrigin) return false;

  const target = new URL(
    `${window.location.pathname}${window.location.search}${window.location.hash}`,
    communityOrigin,
  );
  window.location.replace(target.toString());
  return true;
};
