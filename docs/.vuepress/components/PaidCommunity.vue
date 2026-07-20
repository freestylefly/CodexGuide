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
    <section v-if="!props.direct" class="paid-community-top">
      <div class="paid-community-hero">
        <span class="paid-community-kicker">CodexGuide 付费交流群</span>
        <h1>和认真使用 Codex 的人，一起解决真实问题</h1>
        <p>当教程无法覆盖你的项目，可以在群里交流配置、任务设计、Skills、Plugins、自动化和排障经验，更快找到可执行的下一步。</p>
        <ul class="paid-community-hero-benefits">
          <li>聚焦真实使用场景，减少泛泛讨论</li>
          <li>持续交流实战案例与重要更新</li>
          <li>连接长期使用 Codex 的中文伙伴</li>
        </ul>
        <a class="paid-community-hero-action" href="#community-checkout">查看价格并加入</a>
        <div class="paid-community-assurance">
          <span>一次付费</span>
          <span>入群资格长期有效</span>
          <span>支付宝收款</span>
        </div>
      </div>

      <aside class="paid-community-scope" aria-label="社群交流范围">
        <span>主要交流范围</span>
        <strong>围绕 Codex 的真实使用与项目实践</strong>
        <ul>
          <li>Codex App 与 CLI</li>
          <li>AGENTS.md、Skills 与 Plugins</li>
          <li>自动化、浏览器与工具协作</li>
          <li>任务设计、排障与交付复盘</li>
        </ul>
      </aside>
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
          <span>我已了解：费用用于入群资格与社群维护，完整服务边界见本页下方，不包含固定答疑次数或一对一服务。</span>
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

      <div v-if="!props.direct && state !== 'eligible'" class="paid-community-payment-notes">
        <span>支付宝安全收款</span>
        <span>付款后当前浏览器自动保存资格</span>
        <span>支付异常可联系公众号“苍何”</span>
      </div>
    </section>

    <template v-if="!props.direct">
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

      <section class="paid-community-section" aria-labelledby="community-benefits-title">
        <div class="paid-community-section-heading">
          <span>加入后可以获得什么</span>
          <h2 id="community-benefits-title">让每一次交流都更接近解决问题</h2>
          <p>社群围绕具体场景展开，重视上下文、验证结果和可复用经验。</p>
        </div>
        <div class="paid-community-grid">
          <article>
            <span>01</span>
            <strong>真实问题交流</strong>
            <p>说明环境、目标和卡点，与群友一起拆解下一步，减少盲目试错。</p>
          </article>
          <article>
            <span>02</span>
            <strong>实战案例参考</strong>
            <p>了解别人如何组合 Codex 和各类工具，再迁移到自己的工作流。</p>
          </article>
          <article>
            <span>03</span>
            <strong>重要变化跟进</strong>
            <p>围绕值得关注的功能与使用变化交流，减少碎片信息干扰。</p>
          </article>
          <article>
            <span>04</span>
            <strong>长期同行连接</strong>
            <p>认识持续使用 Codex 的创作者、开发者和效率实践者。</p>
          </article>
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
.paid-community-shell { width: min(100%, 70rem); margin: 0 auto; padding: 1rem 0 4rem; }
.paid-community-shell.is-direct { width: min(100%, 30rem); padding-top: clamp(2rem, 12vh, 7rem); }
.paid-community-top { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(18rem, .72fr); align-items: center; gap: clamp(2rem, 6vw, 5rem); margin: 1rem 0 2rem; border: 1px solid var(--vp-c-border); border-radius: 8px; padding: clamp(1.75rem, 4vw, 3.2rem); background: linear-gradient(145deg, var(--vp-c-accent-soft), transparent 58%), var(--vp-c-bg); }
.paid-community-hero { min-width: 0; }
.paid-community-kicker, .paid-community-section-heading > span, .paid-community-boundary > div > span { color: var(--vp-c-accent); font-size: .8rem; font-weight: 800; }
.paid-community-hero h1 { max-width: 44rem; margin: .8rem 0 0; border: 0; padding: 0; font-size: clamp(2.2rem, 4vw, 3.65rem); line-height: 1.08; letter-spacing: -.035em; text-wrap: balance; }
.paid-community-hero > p { max-width: 42rem; margin: 1.25rem 0 0; color: var(--vp-c-text-mute); font-size: 1.03rem; line-height: 1.75; }
.paid-community-hero-benefits { display: grid; gap: .55rem; margin: 1.25rem 0 0; padding: 0; list-style: none; }
.paid-community-hero-benefits li { border-inline-start: 2px solid var(--vp-c-accent); padding-inline-start: .75rem; color: var(--vp-c-text); font-weight: 650; line-height: 1.5; }
.paid-community-hero-action { display: inline-flex; align-items: center; justify-content: center; min-height: 2.8rem; margin-top: 1.5rem; border: 1px solid var(--vp-c-accent); border-radius: 8px; padding: .55rem 1rem; background: var(--vp-c-accent); color: #fff; font-weight: 750; text-decoration: none; }
.paid-community-hero-action:hover { color: #fff; text-decoration: none; transform: translateY(-1px); }
.paid-community-assurance { display: flex; flex-wrap: wrap; gap: .55rem 1rem; margin-top: .9rem; color: var(--vp-c-text-mute); font-size: .84rem; font-weight: 650; }
.paid-community-scope { border: 1px solid var(--vp-c-border); border-radius: 8px; padding: clamp(1.35rem, 3vw, 2rem); background: var(--vp-c-bg); box-shadow: 0 18px 50px color-mix(in srgb, var(--vp-c-shadow) 60%, transparent); }
.paid-community-scope > span, .paid-community-grid article > span, .paid-community-fit-grid article > span { color: var(--vp-c-accent); font-size: .78rem; font-weight: 800; }
.paid-community-scope > strong { display: block; margin-top: .75rem; color: var(--vp-c-text); font-size: 1.12rem; line-height: 1.5; }
.paid-community-scope ul { margin: 1rem 0 0; padding-inline-start: 1.1rem; }
.paid-community-scope li { margin-top: .55rem; color: var(--vp-c-text-mute); line-height: 1.55; }
.paid-community-checkout { width: min(100%, 42rem); margin: 0 auto; scroll-margin-top: 6rem; border: 1px solid var(--vp-c-border); border-radius: 8px; padding: clamp(1.25rem, 4vw, 2rem); background: var(--vp-c-bg); box-shadow: 0 18px 60px color-mix(in srgb, var(--vp-c-shadow) 65%, transparent); }
.paid-community-price { display: flex; align-items: end; justify-content: space-between; gap: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--vp-c-border); }
.paid-community-price > div { display: grid; gap: .25rem; }
.paid-community-price span { color: var(--vp-c-text); font-weight: 750; }
.paid-community-price > div small { color: var(--vp-c-text-mute); font-size: .82rem; }
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
.paid-community-group-qr img { display: block; width: min(100%, 20rem); margin: 1rem auto; border: 1px solid var(--vp-c-border); border-radius: 8px; background: #fff; }
.paid-community-hint { margin: .75rem auto 0; color: var(--vp-c-text-mute); font-size: .88rem; line-height: 1.6; text-align: center; }
.paid-community-payment-notes { display: flex; flex-wrap: wrap; gap: .55rem 1rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--vp-c-border); color: var(--vp-c-text-mute); font-size: .8rem; font-weight: 600; }
.paid-community-section { margin: clamp(4rem, 9vw, 7rem) 0; }
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
.paid-community-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; margin-top: 2rem; }
.paid-community-grid article { border: 1px solid var(--vp-c-border); border-radius: 8px; padding: 1.3rem; background: var(--vp-c-bg); }
.paid-community-grid strong { display: block; margin: 1rem 0 0; font-size: 1.06rem; line-height: 1.45; }
.paid-community-grid p { margin: .65rem 0 0; color: var(--vp-c-text-mute); font-size: .92rem; line-height: 1.65; }
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
@media (max-width: 960px) { .paid-community-top, .paid-community-boundary { grid-template-columns: 1fr; } .paid-community-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 720px) { .paid-community-shell { padding-top: 0; } .paid-community-top { padding: 1.3rem; } .paid-community-hero-action { width: 100%; box-sizing: border-box; } .paid-community-proof-grid, .paid-community-grid, .paid-community-fit-grid { grid-template-columns: 1fr; } .paid-community-proof-footer { align-items: flex-start; flex-direction: column; } }
</style>
