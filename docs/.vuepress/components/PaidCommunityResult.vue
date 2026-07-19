<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

import {
  loadCommunityRuntimeConfig,
  redirectToCommunityOrigin,
} from "../community-runtime.js";

type ResultState = "checking" | "eligible" | "pending" | "error";

const state = ref<ResultState>("checking");
const message = ref("正在通过服务端查询支付宝订单…");
const orderId = ref("");
const qrUrl = ref<string | null>(null);
const checking = ref(false);

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

const checkOrder = async (): Promise<void> => {
  orderId.value = new URL(window.location.href).searchParams.get("orderId") || "";
  if (!/^CG[A-Z0-9]{20,30}$/u.test(orderId.value)) {
    state.value = "error";
    message.value = "缺少有效订单信息，请返回支付页面重新检查。";
    return;
  }

  checking.value = true;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const reconcile = attempt % 3 === 0 ? "&reconcile=1" : "";
    const response = await fetch(`/api/alipay/order?id=${encodeURIComponent(orderId.value)}${reconcile}`, {
      credentials: "same-origin",
      cache: "no-store",
    });

    if (response.status === 401) {
      state.value = "error";
      message.value = "当前浏览器的支付会话已丢失，请凭订单号联系公众号“苍何”人工核验。";
      checking.value = false;
      return;
    }

    if (!response.ok) throw new Error(await responseError(response));
    const result = (await response.json()) as { eligible: boolean; status: string };
    if (result.eligible) {
      await loadGroupQr();
      checking.value = false;
      return;
    }
    if (["CLOSED", "REFUNDED", "REVOKED"].includes(result.status)) {
      state.value = "error";
      message.value = "订单未完成或已关闭，请返回支付页面重新发起。";
      checking.value = false;
      return;
    }

    state.value = "pending";
    message.value = "支付结果仍在确认，请不要重复付款…";
    await new Promise((resolve) => window.setTimeout(resolve, 1_500));
  }

  state.value = "pending";
  message.value = "暂未确认到账。若已经扣款，请稍后刷新；仍有问题请联系公众号“苍何”。";
  checking.value = false;
};

onMounted(async () => {
  try {
    const runtime = await loadCommunityRuntimeConfig();
    if (redirectToCommunityOrigin(runtime.communityOrigin)) return;
    await checkOrder();
  } catch (error) {
    checking.value = false;
    state.value = "error";
    message.value = error instanceof Error ? error.message : "订单查询失败，请稍后刷新。";
  }
});

onBeforeUnmount(() => {
  if (qrUrl.value) URL.revokeObjectURL(qrUrl.value);
});
</script>

<template>
  <main class="payment-result-shell">
    <section class="payment-result-card">
      <span class="payment-result-kicker">Alipay Result</span>
      <h1>支付结果</h1>
      <div class="payment-result-status" :class="`is-${state}`" role="status" aria-live="polite">
        {{ message }}
      </div>
      <p v-if="orderId" class="payment-result-order">订单号：<code>{{ orderId }}</code></p>
      <img v-if="state === 'eligible' && qrUrl" class="payment-result-qr" :src="qrUrl" alt="CodexGuide 微信群二维码">
      <p v-if="state === 'eligible'" class="payment-result-hint">若群码失效或群已满，请联系公众号“苍何”。</p>
      <div v-else class="payment-result-actions">
        <button
          v-if="orderId"
          class="payment-result-check"
          type="button"
          :disabled="checking"
          @click="checkOrder"
        >
          {{ checking ? "正在确认…" : "重新确认支付结果" }}
        </button>
        <a class="payment-result-link" href="/community/join">返回交流群页面</a>
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(.theme-container:has(.payment-result-shell) .vp-page-title) { display: none; }
.payment-result-shell { width: min(100%, 32rem); margin: 0 auto; padding: clamp(2rem, 10vh, 7rem) 0 5rem; }
.payment-result-card { padding: clamp(1.25rem, 5vw, 2rem); border: 1px solid var(--vp-c-border); border-radius: 14px; background: var(--vp-c-bg); box-shadow: 0 18px 60px color-mix(in srgb, var(--vp-c-shadow) 65%, transparent); text-align: center; }
.payment-result-kicker { color: #1677ff; font-size: .78rem; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
.payment-result-card h1 { margin: .65rem 0 1.25rem; border: 0; }
.payment-result-status { padding: 1rem; border-radius: 10px; background: var(--vp-c-bg-soft); line-height: 1.7; }
.payment-result-status.is-eligible { color: #15803d; }
.payment-result-status.is-error { color: #b91c1c; }
.payment-result-order { margin: 1rem 0 0; color: var(--vp-c-text-mute); font-size: .78rem; overflow-wrap: anywhere; }
.payment-result-qr { display: block; width: min(100%, 20rem); margin: 1.25rem auto .75rem; border: 1px solid var(--vp-c-border); border-radius: 12px; background: #fff; }
.payment-result-hint { color: var(--vp-c-text-mute); font-size: .88rem; }
.payment-result-actions { display: grid; gap: .85rem; margin-top: 1.25rem; }
.payment-result-check { border: 0; border-radius: 10px; padding: .85rem 1rem; color: #fff; background: #1677ff; font: inherit; font-weight: 700; cursor: pointer; }
.payment-result-check:disabled { cursor: wait; opacity: .6; }
.payment-result-link { display: inline-block; }
</style>
