export const COMMUNITY_JOIN_PATH = "/community/join";
export const COMMUNITY_PAY_PATH = "/community/pay";

const allowedReturnPaths = new Set([COMMUNITY_JOIN_PATH, COMMUNITY_PAY_PATH]);

export const normalizeCommunityReturnTo = (value: string | null): string =>
  value && allowedReturnPaths.has(value) ? value : COMMUNITY_JOIN_PATH;
