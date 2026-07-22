<script setup lang="ts">
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  LifebuoyIcon,
  QrCodeIcon,
  ShieldCheckIcon,
} from "@heroicons/vue/24/outline";
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
    <section v-if="!props.direct" class="paid-community-top">
      <div class="paid-community-top-inner">
        <div class="paid-community-hero">
          <span class="paid-community-kicker">CodexGuide 高质量交流群</span>
          <h1>把真实项目带进群里，<br>把可执行的方法带回去</h1>
          <p>和正在使用 Codex 的创作者、开发者与效率实践者，交流配置、任务设计、Skills、Plugins、自动化与排障经验。</p>

          <div class="paid-community-hero-features" aria-label="社群核心价值">
            <div>
              <span class="paid-community-feature-icon"><ChatBubbleLeftRightIcon aria-hidden="true" /></span>
              <strong>真实问题讨论</strong>
            </div>
            <div>
              <span class="paid-community-feature-icon"><ClipboardDocumentCheckIcon aria-hidden="true" /></span>
              <strong>智能体每日群聊精华</strong>
            </div>
          </div>
        </div>

        <div class="paid-community-visual" aria-label="真实群聊与每日精华展示">
          <figure class="paid-community-phone is-discussion">
            <img
              src="/images/community-codex-troubleshooting-discussion.jpg"
              alt="Codex 用户交流群内关于额度重置与模型选择的真实讨论"
              width="1280"
              height="1280"
              decoding="async"
            >
            <figcaption>真实群聊现场</figcaption>
          </figure>
          <figure class="paid-community-phone is-digest">
            <img
              src="/images/community-codex-daily-digest-highlights.jpg"
              alt="Codex 社区智能体生成的每日群聊精华"
              width="1280"
              height="1280"
              decoding="async"
            >
            <figcaption>智能体每日群聊精华</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section
      id="community-checkout"
      class="paid-community-checkout"
      aria-labelledby="community-checkout-title"
    >
      <div class="paid-community-price">
        <div>
          <span id="community-checkout-title">一次付费</span>
          <small>入群资格长期有效</small>
        </div>
        <strong><small>¥</small>9.9</strong>
      </div>

      <div v-if="!props.direct" class="paid-community-payment-notes" aria-label="支付与服务说明">
        <div>
          <ShieldCheckIcon aria-hidden="true" />
          <span>支付宝安全收款</span>
        </div>
        <div>
          <CheckCircleIcon aria-hidden="true" />
          <span>付款后自动保存资格</span>
        </div>
        <div>
          <LifebuoyIcon aria-hidden="true" />
          <span>异常可联系公众号“苍何”</span>
        </div>
      </div>

      <div class="paid-community-checkout-action">
        <div class="paid-community-status" role="status" aria-live="polite">
          <span class="paid-community-status-dot" :class="`is-${state}`" aria-hidden="true"></span>
          <p>{{ message }}</p>
        </div>

        <div v-if="paymentEnabled && state !== 'eligible'" class="paid-community-return-tip">
          <QrCodeIcon aria-hidden="true" />
          <p>
            <strong>支付完成后，请记得返回本页面</strong>
            <span>系统确认到账后，入群二维码会自动显示在这里。</span>
          </p>
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
            <span>我已阅读并了解本页下方的<a href="#service-boundary">社群交流与服务边界</a></span>
          </label>
          <button
            v-if="state === 'ready' || state === 'paying'"
            class="paid-community-pay"
            type="button"
            :disabled="!accepted || busy"
            @click="startPayment"
          >
            {{ busy ? "正在跳转支付宝…" : "支付宝支付　¥9.9" }}
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
      </div>
    </section>

    <template v-if="!props.direct">
      <section class="paid-community-entry" aria-labelledby="community-entry-title">
        <div class="paid-community-entry-heading">
          <span aria-hidden="true"></span>
          <h2 id="community-entry-title">加入后，你会进入这样的交流</h2>
          <span aria-hidden="true"></span>
        </div>

        <div class="paid-community-entry-grid">
          <article>
            <span class="paid-community-entry-icon"><ChatBubbleLeftRightIcon aria-hidden="true" /></span>
            <div>
              <strong>带着上下文提问</strong>
              <p>把项目背景、目标与报错贴进群里，获得有针对性的分析与可落地的解决思路。</p>
            </div>
          </article>
          <article>
            <span class="paid-community-entry-icon"><ClipboardDocumentCheckIcon aria-hidden="true" /></span>
            <div>
              <strong>参考验证过的实践</strong>
              <p>来自真实项目的配置、任务设计、Skills、Plugins 与自动化方案，可直接复用与改造。</p>
            </div>
          </article>
          <article>
            <span class="paid-community-entry-icon"><CalendarDaysIcon aria-hidden="true" /></span>
            <div>
              <strong>每天掌握群聊重点</strong>
              <p>每日群聊精华整理，提炼关键词与结论，帮你快速掌握最新方法与排障思路。</p>
            </div>
          </article>
        </div>
      </section>

      <section class="paid-community-section paid-community-proof" aria-labelledby="community-proof-title">
        <div class="paid-community-section-heading">
          <span>真实交流现场</span>
          <h2 id="community-proof-title">遇到具体问题，群里有人一起拆解</h2>
          <p>从额度重置、模型选择到异常反馈，大家会补充自己的使用情况，交流已经验证过的处理思路。</p>
        </div>

        <div class="paid-community-proof-grid">
          <figure>
            <img
              src="/images/community-codex-troubleshooting-discussion.jpg"
              alt="Codex 用户交流群内关于额度重置、模型选择和异常反馈的真实讨论"
              width="1280"
              height="1280"
              loading="lazy"
              decoding="async"
            >
            <figcaption>
              <strong>具体问题，及时交流</strong>
              <span>群友会分享自己的额度状态、模型选择和实际反馈，帮助彼此缩小排查范围。</span>
            </figcaption>
          </figure>

          <figure>
            <img
              src="/images/community-codex-active-groups.jpg"
              alt="多个 Codex 用户交流群持续讨论额度重置等使用问题"
              width="1280"
              height="1280"
              loading="lazy"
              decoding="async"
            >
            <figcaption>
              <strong>多个群持续沉淀经验</strong>
              <span>交流群覆盖不同批次的长期用户，常见问题会得到多角度的经验补充。</span>
            </figcaption>
          </figure>
        </div>

        <div class="paid-community-proof-footer">
          <p>真实群聊截图仅用于展示交流主题，具体回复速度和讨论结果会随成员在线情况变化。</p>
          <a href="#community-checkout">带着你的问题加入交流</a>
        </div>
      </section>

      <section class="paid-community-section paid-community-digest" aria-labelledby="community-digest-title">
        <div class="paid-community-digest-copy">
          <span class="paid-community-digest-kicker">智能体每日群聊精华</span>
          <h2 id="community-digest-title">加入任一群，都能看见整个 Codex 社区当天在聊什么</h2>
          <p>智能体会汇总各交流群当天的消息量、参与人数和核心话题，并把精华每天推送到群里。即使错过实时消息，也能快速掌握值得跟进的问题、经验和行业动态。</p>

          <ul class="paid-community-digest-points">
            <li>
              <strong>跨群汇总</strong>
              <span>聚合多个交流群的讨论重点，不受单个群的信息范围限制。</span>
            </li>
            <li>
              <strong>每日送达</strong>
              <span>当天热点由智能体自动整理，打开群聊就能查看。</span>
            </li>
            <li>
              <strong>快速补课</strong>
              <span>消息量、参与人数和核心话题清晰呈现，几分钟掌握社区动态。</span>
            </li>
          </ul>

          <a class="paid-community-digest-action" href="#community-checkout">¥9.9 加入，开始接收每日精华</a>
          <small>每日精华由智能体根据群内实际讨论自动生成，内容会随当天话题变化。</small>
        </div>

        <div class="paid-community-digest-gallery">
          <figure>
            <img
              src="/images/community-codex-daily-digest-highlights.jpg"
              alt="Codex 社区智能体生成的每日各群消息分布与群聊精华"
              width="1280"
              height="1280"
              loading="lazy"
              decoding="async"
            >
            <figcaption>
              <strong>每天提炼核心话题</strong>
              <span>各群讨论重点、活跃情况和可复用经验集中呈现。</span>
            </figcaption>
          </figure>

          <figure>
            <img
              src="/images/community-codex-daily-digest-groups.jpg"
              alt="Codex 社区每日群聊精华总结，包含各群消息数与核心话题"
              width="1280"
              height="1280"
              loading="lazy"
              decoding="async"
            >
            <figcaption>
              <strong>多个群的动态一份掌握</strong>
              <span>加入任一群，都能持续了解整个社区当天的讨论脉络。</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section class="paid-community-section paid-community-fit" aria-labelledby="community-fit-title">
        <div class="paid-community-section-heading">
          <span>先判断是否适合</span>
          <h2 id="community-fit-title">有真实场景的人，会获得更多价值</h2>
        </div>
        <div class="paid-community-fit-grid">
          <article class="is-recommended">
            <span>更适合加入</span>
            <ul>
              <li>已经开始使用 Codex App 或 CLI</li>
              <li>手上有项目、工作流或具体问题</li>
              <li>愿意说明上下文，也愿意分享有效经验</li>
              <li>希望获得长期、稳定的中文交流环境</li>
            </ul>
          </article>
          <article>
            <span>建议先看免费教程</span>
            <ul>
              <li>还没有完成 Codex 的安装与首次登录</li>
              <li>当前只需要解决一个基础操作问题</li>
              <li>暂时没有明确的使用场景</li>
              <li>期待全天候客服或一对一代操作</li>
            </ul>
            <a href="/start/">先完成快速上手</a>
          </article>
        </div>
      </section>

      <section
        id="service-boundary"
        class="paid-community-section paid-community-boundary"
        aria-labelledby="community-boundary-title"
      >
        <div>
          <span>为什么设置付费门槛</span>
          <h2 id="community-boundary-title">保护交流质量，也支持长期维护</h2>
          <p>9.9 元用于筛选愿意认真交流的成员，也支持 CodexGuide 内容整理和社群日常维护。</p>
        </div>
        <details>
          <summary>查看完整服务边界</summary>
          <ul>
            <li>群内交流以成员互助和经验分享为主，不构成官方技术支持。</li>
            <li>入群资格长期有效，群聊、运营频率和具体服务可能随实际情况调整。</li>
            <li>群二维码可能因到期或满员而更换，已付款用户刷新本页即可查看新群码。</li>
            <li>清除浏览器数据或更换设备后，请凭订单信息联系公众号“苍何”人工恢复。</li>
            <li>请遵守群规；广告、欺诈、恶意骚扰等行为可能被移出群聊。</li>
          </ul>
        </details>
      </section>
    </template>
  </main>
</template>

<style scoped>
:global(.theme-container:has(.paid-community-shell) .vp-page-title) { display: none; }
.paid-community-shell { width: 100%; margin: 0; padding: 0 0 4rem; }
.paid-community-shell.is-direct { width: min(100%, 30rem); padding-top: clamp(2rem, 12vh, 7rem); }
.paid-community-top { width: 100vw; margin-inline: calc(50% - 50vw); overflow: hidden; background: #075f5e; color: #fff; }
.paid-community-top-inner { display: grid; grid-template-columns: minmax(0, .98fr) minmax(31rem, 1.02fr); align-items: center; gap: clamp(2rem, 3.5vw, 3.5rem); box-sizing: border-box; max-width: 88rem; min-height: 34.5rem; margin: 0 auto; padding: clamp(2.75rem, 4.5vw, 4rem) clamp(1.5rem, 4vw, 3rem); }
.paid-community-hero { position: relative; z-index: 2; min-width: 0; }
.paid-community-kicker, .paid-community-section-heading > span, .paid-community-digest-kicker, .paid-community-boundary > div > span { color: var(--vp-c-accent); font-size: .8rem; font-weight: 800; }
.paid-community-kicker { color: #d8fffb; font-size: .94rem; letter-spacing: .02em; }
.paid-community-hero h1 { max-width: 42rem; margin: 1.35rem 0 0; border: 0; padding: 0; color: #fff; font-size: clamp(2.75rem, 4vw, 3.6rem); font-weight: 850; line-height: 1.25; letter-spacing: -.045em; text-wrap: balance; }
.paid-community-hero > p { max-width: 38rem; margin: 1.35rem 0 0; color: rgba(255, 255, 255, .82); font-size: 1.08rem; line-height: 1.8; }
.paid-community-hero-features { display: flex; flex-wrap: wrap; gap: 1rem 1.6rem; margin-top: 2.5rem; }
.paid-community-hero-features > div { display: flex; align-items: center; gap: .8rem; }
.paid-community-feature-icon { display: inline-flex; align-items: center; justify-content: center; width: 2.7rem; height: 2.7rem; border: 1px solid rgba(255, 255, 255, .55); border-radius: 10px; background: #f4fffd; color: #075f5e; box-shadow: 0 12px 28px rgba(0, 33, 33, .18); }
.paid-community-feature-icon svg { width: 1.45rem; height: 1.45rem; stroke-width: 1.8; }
.paid-community-hero-features strong { color: #fff; font-size: .96rem; font-weight: 720; white-space: nowrap; }
.paid-community-visual { position: relative; min-height: 30rem; }
.paid-community-phone { position: absolute; top: 50%; width: 19.75rem; height: 31.75rem; margin: 0; overflow: hidden; border: 5px solid rgba(255, 255, 255, .9); border-radius: 42px; background: #e8fffb; box-shadow: 0 30px 70px rgba(0, 28, 30, .38), 0 6px 18px rgba(0, 0, 0, .2); transform-origin: center; }
.paid-community-phone img { display: block; width: 100%; height: 100%; border-radius: 36px; object-fit: cover; transform: scale(1.16); }
.paid-community-phone.is-discussion { z-index: 2; left: 2%; transform: translateY(-51%) rotate(-4deg); }
.paid-community-phone.is-discussion img { object-position: 0 center; transform-origin: 18% top; }
.paid-community-phone.is-digest { z-index: 1; right: 0; width: 18.25rem; height: 29.25rem; transform: translateY(-47%) rotate(5deg); }
.paid-community-phone.is-digest img { object-position: 100% center; transform-origin: 82% top; }
.paid-community-phone figcaption { position: absolute; z-index: 2; right: .55rem; bottom: .6rem; border: 1px solid rgba(0, 87, 83, .28); border-radius: 8px; padding: .42rem .7rem; background: #e9fffb; color: #075f5e; box-shadow: 0 8px 20px rgba(0, 29, 29, .25); font-size: .78rem; font-weight: 800; white-space: nowrap; }
.paid-community-phone.is-digest figcaption { right: .5rem; }
.paid-community-checkout { display: grid; grid-template-columns: minmax(12.5rem, .72fr) minmax(31rem, 1.65fr) minmax(18.5rem, 1fr); align-items: stretch; box-sizing: border-box; width: 100vw; margin-inline: calc(50% - 50vw); scroll-margin-top: 6rem; border-bottom: 1px solid var(--vp-c-border); padding: 1.7rem max(1.5rem, calc((100vw - 82rem) / 2)); background: var(--vp-c-bg); box-shadow: 0 14px 38px color-mix(in srgb, var(--vp-c-shadow) 38%, transparent); }
.paid-community-shell.is-direct .paid-community-checkout { display: block; width: 100%; margin: 0; border: 1px solid var(--vp-c-border); border-radius: 12px; padding: clamp(1.25rem, 4vw, 2rem); box-shadow: 0 18px 60px color-mix(in srgb, var(--vp-c-shadow) 65%, transparent); }
.paid-community-price { display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-right: 1px solid var(--vp-c-border); padding-right: clamp(1.5rem, 3vw, 2.75rem); }
.paid-community-shell.is-direct .paid-community-price { align-items: end; border-right: 0; border-bottom: 1px solid var(--vp-c-border); padding: 0 0 1rem; }
.paid-community-price > div { display: grid; gap: .25rem; }
.paid-community-price span { color: var(--vp-c-text); font-weight: 750; }
.paid-community-price > div small { color: var(--vp-c-text-mute); font-size: .82rem; }
.paid-community-price strong { color: #075f5e; font-size: 2.55rem; line-height: 1; white-space: nowrap; }
.paid-community-price small { margin-right: .15rem; font-size: 1rem; }
.paid-community-payment-notes { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: center; gap: 0; min-width: 0; }
.paid-community-payment-notes > div { display: flex; min-width: 0; align-items: center; justify-content: center; gap: .65rem; padding: .35rem 1rem; color: var(--vp-c-text-mute); font-size: .82rem; font-weight: 650; text-align: center; }
.paid-community-payment-notes > div + div { border-left: 1px solid var(--vp-c-border); }
.paid-community-payment-notes svg { flex: 0 0 auto; width: 1.7rem; height: 1.7rem; color: #075f5e; stroke-width: 1.75; }
.paid-community-checkout-action { display: flex; flex-direction: column; justify-content: center; min-width: 0; border-left: 1px solid var(--vp-c-border); padding-left: clamp(1.5rem, 3vw, 2.75rem); }
.paid-community-shell.is-direct .paid-community-checkout-action { border-left: 0; padding-left: 0; }
.paid-community-status { display: flex; align-items: flex-start; gap: .5rem; margin: 0 0 .6rem; color: var(--vp-c-text-mute); font-size: .75rem; }
.paid-community-shell.is-direct .paid-community-status { margin: 1.15rem 0; padding: .9rem 1rem; border-radius: 10px; background: var(--vp-c-bg-soft); font-size: .88rem; }
.paid-community-status p { margin: 0; line-height: 1.5; }
.paid-community-status-dot { flex: 0 0 auto; width: .65rem; height: .65rem; margin-top: .45rem; border-radius: 50%; background: #94a3b8; }
.paid-community-status-dot.is-eligible { background: #16a34a; }
.paid-community-status-dot.is-error { background: #dc2626; }
.paid-community-status-dot.is-unavailable { background: #64748b; }
.paid-community-status-dot.is-paying, .paid-community-status-dot.is-checking { background: #eab308; }
.paid-community-return-tip { display: flex; align-items: flex-start; gap: .55rem; margin: 0 0 .7rem; border: 1px solid color-mix(in srgb, #075f5e 24%, var(--vp-c-border)); border-radius: 8px; padding: .6rem .7rem; background: var(--vp-c-accent-soft); color: var(--vp-c-text); }
.paid-community-return-tip svg { flex: 0 0 auto; width: 1.25rem; height: 1.25rem; margin-top: .12rem; color: #075f5e; stroke-width: 1.8; }
.paid-community-return-tip p { margin: 0; line-height: 1.45; }
.paid-community-return-tip strong { display: block; color: #075f5e; font-size: .78rem; }
.paid-community-return-tip span { display: block; margin-top: .12rem; color: var(--vp-c-text-mute); font-size: .7rem; }
.paid-community-consent { display: flex; align-items: flex-start; gap: .5rem; color: var(--vp-c-text-mute); font-size: .76rem; line-height: 1.55; cursor: pointer; }
.paid-community-consent input { flex: 0 0 auto; margin-top: .3rem; }
.paid-community-consent a { color: #075f5e; font-weight: 750; text-decoration: none; }
.paid-community-pay, .paid-community-retry { width: 100%; margin-top: .7rem; border: 0; border-radius: 8px; padding: .82rem 1rem; color: #fff; background: #075f5e; font: inherit; font-weight: 780; cursor: pointer; box-shadow: 0 10px 24px rgba(7, 95, 94, .18); }
.paid-community-pay:disabled { cursor: not-allowed; opacity: .48; }
.paid-community-retry { background: #075f5e; }
.paid-community-group-qr img { display: block; width: min(100%, 20rem); margin: 1rem auto; border: 1px solid var(--vp-c-border); border-radius: 8px; background: #fff; }
.paid-community-hint { margin: .75rem auto 0; color: var(--vp-c-text-mute); font-size: .88rem; line-height: 1.6; text-align: center; }
.paid-community-entry, .paid-community-section { width: min(calc(100% - 3rem), 70rem); margin-inline: auto; }
.paid-community-entry { padding: clamp(2.25rem, 4vw, 3rem) 0 .5rem; }
.paid-community-entry-heading { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: clamp(1.25rem, 4vw, 3rem); }
.paid-community-entry-heading span { height: 1px; background: var(--vp-c-border); }
.paid-community-entry-heading h2 { margin: 0; border: 0; padding: 0; color: var(--vp-c-text); font-size: clamp(1.45rem, 2.6vw, 2rem); line-height: 1.3; letter-spacing: -.02em; text-align: center; }
.paid-community-entry-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; margin-top: 2.1rem; }
.paid-community-entry-grid article { display: grid; grid-template-columns: auto 1fr; gap: 1rem; min-width: 0; padding: 0 clamp(1.2rem, 3vw, 2.2rem); }
.paid-community-entry-grid article + article { border-left: 1px solid var(--vp-c-border); }
.paid-community-entry-icon { display: inline-flex; align-items: center; justify-content: center; width: 3.9rem; height: 3.9rem; border-radius: 50%; background: var(--vp-c-accent-soft); color: #075f5e; }
.paid-community-entry-icon svg { width: 2.15rem; height: 2.15rem; stroke-width: 1.7; }
.paid-community-entry-grid strong { display: block; color: var(--vp-c-text); font-size: 1.03rem; line-height: 1.5; }
.paid-community-entry-grid p { margin: .45rem 0 0; color: var(--vp-c-text-mute); font-size: .87rem; line-height: 1.7; }
.paid-community-section { margin-top: clamp(4rem, 9vw, 7rem); margin-bottom: clamp(4rem, 9vw, 7rem); }
.paid-community-section-heading { max-width: 48rem; }
.paid-community-section-heading h2, .paid-community-boundary h2 { margin: .7rem 0 0; border: 0; padding: 0; font-size: clamp(1.8rem, 3.8vw, 3rem); line-height: 1.15; letter-spacing: -.025em; }
.paid-community-section-heading > p { margin: .9rem 0 0; color: var(--vp-c-text-mute); font-size: 1rem; line-height: 1.75; }
.paid-community-proof { margin-top: clamp(3.5rem, 8vw, 6rem); }
.paid-community-proof-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(1rem, 3vw, 1.5rem); margin-top: 2rem; }
.paid-community-proof figure { min-width: 0; margin: 0; overflow: hidden; border: 1px solid var(--vp-c-border); border-radius: 12px; background: var(--vp-c-bg); box-shadow: 0 18px 50px color-mix(in srgb, var(--vp-c-shadow) 48%, transparent); }
.paid-community-proof img { display: block; width: 100%; height: auto; aspect-ratio: 1; object-fit: cover; background: var(--vp-c-bg-soft); }
.paid-community-proof figcaption { display: grid; gap: .55rem; padding: 1.15rem 1.25rem 1.3rem; }
.paid-community-proof figcaption strong { color: var(--vp-c-text); font-size: 1.05rem; line-height: 1.45; }
.paid-community-proof figcaption span { color: var(--vp-c-text-mute); font-size: .9rem; line-height: 1.65; }
.paid-community-proof-footer { display: flex; align-items: center; justify-content: space-between; gap: 1.25rem; margin-top: 1.25rem; border: 1px solid var(--vp-c-border); border-radius: 10px; padding: 1rem 1.15rem; background: var(--vp-c-bg-soft); }
.paid-community-proof-footer p { margin: 0; color: var(--vp-c-text-mute); font-size: .82rem; line-height: 1.6; }
.paid-community-proof-footer a { flex: 0 0 auto; color: var(--vp-c-accent); font-size: .9rem; font-weight: 750; text-decoration: none; }
.paid-community-proof-footer a:hover { text-decoration: underline; }
.paid-community-digest { border: 1px solid color-mix(in srgb, var(--vp-c-accent) 48%, var(--vp-c-border)); border-radius: 14px; padding: clamp(1.5rem, 4vw, 3rem); background: linear-gradient(145deg, var(--vp-c-accent-soft), transparent 64%), var(--vp-c-bg); }
.paid-community-digest-copy { min-width: 0; }
.paid-community-digest-copy h2 { max-width: 48rem; margin: .7rem 0 0; border: 0; padding: 0; font-size: clamp(1.8rem, 3.2vw, 2.65rem); line-height: 1.15; letter-spacing: -.025em; }
.paid-community-digest-copy > p { max-width: 48rem; margin: 1rem 0 0; color: var(--vp-c-text-mute); line-height: 1.75; }
.paid-community-digest-points { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin: 1.5rem 0 0; padding: 0; list-style: none; }
.paid-community-digest-points li { border-top: 2px solid var(--vp-c-accent); padding-top: .75rem; }
.paid-community-digest-points strong { display: block; margin-bottom: .35rem; color: var(--vp-c-text); font-size: .9rem; line-height: 1.6; }
.paid-community-digest-points span { color: var(--vp-c-text-mute); font-size: .87rem; line-height: 1.6; }
.paid-community-digest-action { display: inline-flex; align-items: center; justify-content: center; min-height: 2.8rem; margin-top: 1.5rem; border-radius: 8px; padding: .55rem 1rem; background: var(--vp-c-accent); color: #fff; font-size: .92rem; font-weight: 750; text-decoration: none; }
.paid-community-digest-action:hover { color: #fff; text-decoration: none; transform: translateY(-1px); }
.paid-community-digest-copy > small { display: block; margin-top: .7rem; color: var(--vp-c-text-mute); font-size: .76rem; line-height: 1.6; }
.paid-community-digest-gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; min-width: 0; margin-top: 2rem; }
.paid-community-digest-gallery figure { min-width: 0; margin: 0; overflow: hidden; border: 1px solid var(--vp-c-border); border-radius: 12px; background: var(--vp-c-bg); box-shadow: 0 18px 50px color-mix(in srgb, var(--vp-c-shadow) 48%, transparent); }
.paid-community-digest-gallery img { display: block; width: 100%; height: auto; aspect-ratio: 1; object-fit: cover; background: var(--vp-c-bg-soft); }
.paid-community-digest-gallery figcaption { display: grid; gap: .45rem; padding: 1rem; }
.paid-community-digest-gallery figcaption strong { color: var(--vp-c-text); font-size: .92rem; line-height: 1.45; }
.paid-community-digest-gallery figcaption span { color: var(--vp-c-text-mute); font-size: .8rem; line-height: 1.55; }
.paid-community-fit { border-top: 1px solid var(--vp-c-border); border-bottom: 1px solid var(--vp-c-border); padding: clamp(3.5rem, 7vw, 5.5rem) 0; }
.paid-community-fit-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-top: 2rem; }
.paid-community-fit-grid article { border: 1px solid var(--vp-c-border); border-radius: 8px; padding: clamp(1.35rem, 3vw, 2rem); background: var(--vp-c-bg); }
.paid-community-fit-grid article.is-recommended { border-color: var(--vp-c-accent); background: var(--vp-c-accent-soft); }
.paid-community-fit-grid ul { margin: 1rem 0 0; padding-inline-start: 1.15rem; }
.paid-community-fit-grid li { margin-top: .65rem; color: var(--vp-c-text); line-height: 1.6; }
.paid-community-fit-grid a { display: inline-flex; margin-top: .9rem; color: var(--vp-c-accent); font-weight: 750; text-decoration: none; }
.paid-community-boundary { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1fr); align-items: start; gap: clamp(2rem, 6vw, 5rem); border: 1px solid var(--vp-c-border); border-radius: 8px; padding: clamp(1.75rem, 5vw, 3.2rem); background: var(--vp-c-bg-soft); }
.paid-community-boundary p { margin: .9rem 0 0; color: var(--vp-c-text-mute); line-height: 1.75; }
.paid-community-boundary details { border-top: 1px solid var(--vp-c-border); border-bottom: 1px solid var(--vp-c-border); padding: 1rem 0; }
.paid-community-boundary summary { cursor: pointer; color: var(--vp-c-text); font-weight: 750; line-height: 1.55; }
.paid-community-boundary ul { margin: 1rem 0 0; padding-inline-start: 1.2rem; color: var(--vp-c-text-mute); line-height: 1.75; }
@media (max-width: 1120px) {
  .paid-community-top-inner { grid-template-columns: minmax(0, .95fr) minmax(27rem, 1.05fr); }
  .paid-community-phone { width: 16.5rem; height: 28rem; }
  .paid-community-phone.is-digest { width: 15rem; height: 25rem; }
  .paid-community-checkout { grid-template-columns: minmax(11rem, .7fr) minmax(25rem, 1.45fr) minmax(17rem, 1fr); }
  .paid-community-payment-notes > div { flex-direction: column; gap: .35rem; padding-inline: .65rem; }
  .paid-community-entry-grid article { grid-template-columns: 1fr; }
}
@media (max-width: 960px) {
  .paid-community-top-inner { grid-template-columns: 1fr; min-height: auto; padding-bottom: 1.5rem; }
  .paid-community-hero { max-width: 46rem; }
  .paid-community-visual { min-height: 28rem; }
  .paid-community-phone.is-discussion { left: 17%; }
  .paid-community-phone.is-digest { right: 17%; }
  .paid-community-checkout { grid-template-columns: minmax(10.5rem, .65fr) minmax(0, 1.35fr); }
  .paid-community-payment-notes { order: 3; grid-column: 1 / -1; margin-top: 1.2rem; border-top: 1px solid var(--vp-c-border); padding-top: 1.1rem; }
  .paid-community-checkout-action { border-left: 1px solid var(--vp-c-border); }
  .paid-community-boundary { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .paid-community-shell { padding-top: 0; }
  .paid-community-top-inner { gap: 1rem; padding: 3rem 1.25rem 0; }
  .paid-community-hero h1 { margin-top: 1rem; font-size: clamp(2.35rem, 11vw, 3.1rem); line-height: 1.16; }
  .paid-community-hero h1 br { display: none; }
  .paid-community-hero > p { font-size: .98rem; line-height: 1.72; }
  .paid-community-hero-features { display: grid; gap: .8rem; margin-top: 1.6rem; }
  .paid-community-visual { min-height: 23.5rem; }
  .paid-community-phone { width: 12rem; height: 20rem; }
  .paid-community-phone.is-discussion { left: 5%; transform: translateY(-49%) rotate(-4deg); }
  .paid-community-phone.is-digest { right: 4%; width: 11.5rem; height: 18.5rem; transform: translateY(-43%) rotate(5deg); }
  .paid-community-phone img { border-width: 3px; border-radius: 24px; }
  .paid-community-phone figcaption { right: -.45rem; bottom: .45rem; padding: .32rem .5rem; font-size: .68rem; }
  .paid-community-checkout { grid-template-columns: 1fr; padding: 1.35rem 1.25rem; }
  .paid-community-price { border-right: 0; border-bottom: 1px solid var(--vp-c-border); padding: 0 0 1rem; }
  .paid-community-checkout-action { border-left: 0; padding: 1rem 0 0; }
  .paid-community-payment-notes { grid-column: auto; grid-template-columns: 1fr; margin-top: 1rem; }
  .paid-community-payment-notes > div { flex-direction: row; justify-content: flex-start; padding: .65rem 0; text-align: left; }
  .paid-community-payment-notes > div + div { border-top: 1px solid var(--vp-c-border); border-left: 0; }
  .paid-community-entry, .paid-community-section { width: min(calc(100% - 2.5rem), 70rem); }
  .paid-community-entry-heading { grid-template-columns: 1fr; }
  .paid-community-entry-heading span { display: none; }
  .paid-community-entry-grid { grid-template-columns: 1fr; gap: 1.35rem; }
  .paid-community-entry-grid article { grid-template-columns: auto 1fr; padding: 0; }
  .paid-community-entry-grid article + article { border-top: 1px solid var(--vp-c-border); border-left: 0; padding-top: 1.35rem; }
  .paid-community-entry-icon { width: 3.4rem; height: 3.4rem; }
  .paid-community-digest { padding: 1.3rem; }
  .paid-community-digest-action { width: 100%; box-sizing: border-box; }
  .paid-community-proof-grid, .paid-community-digest-points, .paid-community-digest-gallery, .paid-community-fit-grid { grid-template-columns: 1fr; }
  .paid-community-proof-footer { align-items: flex-start; flex-direction: column; }
}
</style>
