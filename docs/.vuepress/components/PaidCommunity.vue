<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import {
  loadCommunityRuntimeConfig,
  redirectToCommunityOrigin,
} from "../community-runtime.js";

type PageState = "checking" | "ready" | "paying" | "eligible" | "unavailable" | "error";

type CommunityStatus = {
  authenticated: boolean;
  eligible: boolean;
  groupQrReady?: boolean;
  orderId?: string | null;
  orderStatus?: string | null;
  sessionUrl?: string;
};

type CreateOrderResponse = {
  eligible: boolean;
  orderId: string;
  paymentHtml?: string;
};

const props = withDefaults(defineProps<{ direct?: boolean }>(), { direct: false });

const state = ref<PageState>("checking");
const accepted = ref(props.direct);
const autoPayStarted = ref(false);
const message = ref("正在确认支付宝支付会话和入群资格…");
const orderId = ref<string | null>(null);
const paymentEnabled = ref(false);
const qrUrl = ref<string | null>(null);

const busy = computed(() => ["checking", "paying"].includes(state.value));

const responseError = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { error?: { message?: string } };
    return data.error?.message || "请求失败，请稍后重试。";
  } catch {
    return "请求失败，请稍后重试。";
  }
};

const loadGroupQr = async (): Promise<void> => {
  const response = await fetch("/api/community/qr", { credentials: "same-origin", cache: "no-store" });
  if (!response.ok) {
    if (response.status === 503) {
      state.value = "eligible";
      message.value = await responseError(response);
      return;
    }
    throw new Error(await responseError(response));
  }

  const blob = await response.blob();
  if (qrUrl.value) URL.revokeObjectURL(qrUrl.value);
  qrUrl.value = URL.createObjectURL(blob);
  state.value = "eligible";
  message.value = "支付宝到账已确认，请使用微信识别下方二维码入群。";
};

const requestStatus = async (): Promise<CommunityStatus> => {
  const response = await fetch("/api/community/status", {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await responseError(response));
  return (await response.json()) as CommunityStatus;
};

const refreshStatus = async (): Promise<void> => {
  let status = await requestStatus();

  if (!status.authenticated) {
    const response = await fetch(status.sessionUrl || "/api/auth/alipay/session", {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!response.ok) throw new Error(await responseError(response));
    status = await requestStatus();
  }

  orderId.value = status.orderId || null;
  if (status.eligible) {
    if (status.groupQrReady === false) {
      state.value = "eligible";
      message.value = "支付宝到账已确认，群二维码正在更新，请稍后刷新。";
      return;
    }
    await loadGroupQr();
    return;
  }

  if (!paymentEnabled.value) {
    state.value = "unavailable";
    message.value = "支付宝正式收款通道正在做上线检查，暂未开放新订单。";
    return;
  }

  state.value = "ready";
  message.value =
    status.orderStatus === "PENDING"
      ? "你有一笔待支付的支付宝订单，可以继续完成付款。"
      : "支付会话已准备好。";

  if (props.direct && !autoPayStarted.value) {
    autoPayStarted.value = true;
    await startPayment();
  }
};

const submitPaymentHtml = (paymentHtml: string): void => {
  const container = document.createElement("div");
  container.hidden = true;
  container.innerHTML = paymentHtml;
  const form = container.querySelector<HTMLFormElement>("form");

  if (!form) throw new Error("支付宝支付表单缺失，请稍后重试。");

  const action = new URL(form.action);
  const allowedHosts = new Set(["openapi.alipay.com", "openapi-sandbox.dl.alipaydev.com"]);
  if (form.method.toLowerCase() !== "post" || action.protocol !== "https:" || !allowedHosts.has(action.hostname)) {
    throw new Error("支付宝支付地址校验失败，请稍后重试。");
  }

  document.body.appendChild(container);
  form.submit();
};

const startPayment = async (): Promise<void> => {
  if (!accepted.value || !paymentEnabled.value || busy.value) return;

  try {
    state.value = "paying";
    message.value = "正在创建 9.9 元支付宝订单并跳转收银台…";
    const response = await fetch("/api/alipay/order", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    if (!response.ok) throw new Error(await responseError(response));

    const result = (await response.json()) as CreateOrderResponse;
    orderId.value = result.orderId;
    if (result.eligible) {
      await loadGroupQr();
      return;
    }
    if (!result.paymentHtml) throw new Error("支付宝支付表单缺失，请稍后重试。");
    submitPaymentHtml(result.paymentHtml);
  } catch (error) {
    state.value = "error";
    message.value = error instanceof Error ? error.message : "支付宝支付暂时无法发起，请稍后重试。";
  }
};

const retry = async (): Promise<void> => {
  if (props.direct) autoPayStarted.value = false;
  state.value = "checking";
  message.value = "正在重新确认状态…";
  try {
    const runtime = await loadCommunityRuntimeConfig();
    if (redirectToCommunityOrigin(runtime.communityOrigin)) return;
    paymentEnabled.value = runtime.paymentEnabled;
    await refreshStatus();
  } catch (error) {
    state.value = "error";
    message.value = error instanceof Error ? error.message : "状态确认失败，请稍后重试。";
  }
};

onMounted(async () => {
  await retry();
});

onBeforeUnmount(() => {
  if (qrUrl.value) URL.revokeObjectURL(qrUrl.value);
});
</script>

<template>
  <main class="paid-community-shell" :class="{ 'is-direct': props.direct }">
    <section v-if="!props.direct" class="paid-community-hero">
      <span class="paid-community-kicker">CodexGuide Community</span>
      <h1>加入付费交流群</h1>
      <p>用一个小门槛筛选认真交流的同频伙伴，也让资料整理、内容更新和日常群维护能够持续下去。</p>
    </section>

    <section v-if="!props.direct" class="paid-community-grid" aria-label="付费说明">
      <article>
        <strong>更少广告与无效信息</strong>
        <p>付费门槛用于减少营销账号、广告刷屏和低质量重复请求。</p>
      </article>
      <article>
        <strong>支持持续维护</strong>
        <p>费用用于支持 CodexGuide 内容整理、资料更新和社群日常维护。</p>
      </article>
      <article>
        <strong>当前浏览器保存资格</strong>
        <p>付款后可在当前浏览器重新打开本页，查看当前有效的群二维码。</p>
      </article>
    </section>

    <section class="paid-community-checkout">
      <div class="paid-community-price">
        <span>一次付费</span>
        <strong><small>¥</small>9.9</strong>
      </div>

      <div class="paid-community-status" role="status" aria-live="polite">
        <span class="paid-community-status-dot" :class="`is-${state}`" aria-hidden="true"></span>
        <p>{{ message }}</p>
      </div>

      <template v-if="state === 'eligible'">
        <div class="paid-community-group-qr">
          <img v-if="qrUrl" :src="qrUrl" alt="已付款用户可见的 CodexGuide 微信群二维码">
        </div>
        <p class="paid-community-hint">请勿转发群二维码。若二维码已失效或群已满，请联系公众号“苍何”。</p>
      </template>

      <template v-else>
        <label v-if="!props.direct && paymentEnabled" class="paid-community-consent">
          <input v-model="accepted" type="checkbox">
          <span>我已了解：费用用于入群资格与社群维护，不承诺社群永久运营、固定答疑次数或一对一服务；支付异常与退款请联系公众号“苍何”人工处理。</span>
        </label>
        <button
          v-if="state === 'ready' || state === 'paying'"
          class="paid-community-pay"
          type="button"
          :disabled="!accepted || busy"
          @click="startPayment"
        >
          {{ busy ? "正在跳转支付宝…" : "支付宝支付 ¥9.9" }}
        </button>
        <button
          v-if="state === 'error' || state === 'unavailable'"
          class="paid-community-retry"
          type="button"
          @click="retry"
        >
          重新检查
        </button>
      </template>

      <div
        v-if="!props.direct && paymentEnabled && state !== 'eligible'"
        class="paid-community-scan-option"
      >
        <span>也可以使用手机相机或支付宝扫一扫</span>
        <img
          class="paid-community-entry-qr"
          src="/images/codexguide-paid-community-entry.svg"
          alt="扫描后直接发起 CodexGuide 交流群支付宝支付"
        >
        <p class="paid-community-hint">手机打开后会直接跳转支付宝收银台，无需再次阅读付费说明。</p>
      </div>
    </section>

    <section v-if="!props.direct" class="paid-community-boundary">
      <h2>服务边界</h2>
      <ul>
        <li>群内交流以成员互助和经验分享为主，不构成官方技术支持。</li>
        <li>入群资格长期有效，但不代表群聊、运营频率或具体服务永久不变。</li>
        <li>群二维码可能因到期或满员而更换，已付款用户刷新本页即可查看新群码。</li>
        <li>支付宝网站支付本身不提供自动登录；清除浏览器数据或更换设备后，请凭订单信息联系公众号“苍何”人工恢复。</li>
        <li>请遵守群规；广告、欺诈、恶意骚扰等行为可能被移出群聊。</li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
:global(.theme-container:has(.paid-community-shell) .vp-page-title) { display: none; }
.paid-community-shell { width: min(100%, 54rem); margin: 0 auto; padding: 1rem 0 4rem; }
.paid-community-shell.is-direct { width: min(100%, 30rem); padding-top: clamp(2rem, 12vh, 7rem); }
.paid-community-hero { padding: clamp(2rem, 6vw, 4.5rem) 0 2rem; text-align: center; }
.paid-community-kicker { color: var(--vp-c-accent); font-size: .78rem; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
.paid-community-hero h1 { margin: .65rem 0 1rem; border: 0; font-size: clamp(2rem, 6vw, 3.6rem); line-height: 1.12; }
.paid-community-hero p { max-width: 42rem; margin: 0 auto; color: var(--vp-c-text-mute); font-size: 1.05rem; line-height: 1.8; }
.paid-community-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .85rem; margin: 1rem 0 1.5rem; }
.paid-community-grid article, .paid-community-checkout, .paid-community-boundary { border: 1px solid var(--vp-c-border); border-radius: 14px; background: var(--vp-c-bg); }
.paid-community-grid article { padding: 1.15rem; }
.paid-community-grid strong { display: block; margin-bottom: .45rem; }
.paid-community-grid p { margin: 0; color: var(--vp-c-text-mute); font-size: .92rem; line-height: 1.65; }
.paid-community-checkout { padding: clamp(1.25rem, 4vw, 2rem); box-shadow: 0 18px 60px color-mix(in srgb, var(--vp-c-shadow) 65%, transparent); }
.paid-community-price { display: flex; align-items: end; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--vp-c-border); }
.paid-community-price span { color: var(--vp-c-text-mute); font-weight: 650; }
.paid-community-price strong { color: #1677ff; font-size: 2.35rem; line-height: 1; }
.paid-community-price small { margin-right: .15rem; font-size: 1rem; }
.paid-community-status { display: flex; align-items: flex-start; gap: .7rem; margin: 1.15rem 0; padding: .9rem 1rem; border-radius: 10px; background: var(--vp-c-bg-soft); }
.paid-community-status p { margin: 0; line-height: 1.6; }
.paid-community-status-dot { flex: 0 0 auto; width: .65rem; height: .65rem; margin-top: .45rem; border-radius: 50%; background: #94a3b8; }
.paid-community-status-dot.is-eligible { background: #16a34a; }
.paid-community-status-dot.is-error { background: #dc2626; }
.paid-community-status-dot.is-unavailable { background: #64748b; }
.paid-community-status-dot.is-paying, .paid-community-status-dot.is-checking { background: #eab308; }
.paid-community-consent { display: flex; align-items: flex-start; gap: .65rem; color: var(--vp-c-text-mute); font-size: .88rem; line-height: 1.6; cursor: pointer; }
.paid-community-consent input { flex: 0 0 auto; margin-top: .3rem; }
.paid-community-pay, .paid-community-retry { width: 100%; margin-top: 1rem; border: 0; border-radius: 10px; padding: .9rem 1.2rem; color: #fff; background: #1677ff; font: inherit; font-weight: 750; cursor: pointer; }
.paid-community-pay:disabled { cursor: not-allowed; opacity: .48; }
.paid-community-retry { background: var(--vp-c-accent); }
.paid-community-entry-qr, .paid-community-group-qr img { display: block; width: min(100%, 20rem); margin: 1rem auto; border: 1px solid var(--vp-c-border); border-radius: 12px; background: #fff; }
.paid-community-hint { margin: .75rem auto 0; color: var(--vp-c-text-mute); font-size: .88rem; line-height: 1.6; text-align: center; }
.paid-community-scan-option { margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--vp-c-border); color: var(--vp-c-text-mute); text-align: center; }
.paid-community-boundary { margin-top: 1.5rem; padding: 1.25rem 1.5rem; }
.paid-community-boundary h2 { margin: 0 0 .75rem; border: 0; font-size: 1.1rem; }
.paid-community-boundary ul { margin: 0; padding-left: 1.2rem; color: var(--vp-c-text-mute); line-height: 1.75; }
@media (max-width: 720px) { .paid-community-grid { grid-template-columns: 1fr; } .paid-community-shell { padding-top: 0; } }
</style>
