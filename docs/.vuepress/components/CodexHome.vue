<script setup lang="ts">
import MiniCaseArt from "./MiniCaseArt.vue";
import HeroWorkbench from "./HeroWorkbench.vue";
import SiteVisitCounter from "./SiteVisitCounter.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";

const active = ref(0);
const typedStarted = ref(false);
const typedCopy = {
  title: "快速上手",
  subtitle: "完成你的第一个任务",
  body: "从安装配置到运行第一个任务，一步步体验 Codex 的能力。",
};
const cases = [
  {
    tab: "生成 PPT",
    title: "一句话，\n生成一份演示文稿",
    description:
      "从想法到大纲，再到可以展示的幻灯片。跟着完整案例，用 Codex 和 Skill 完成你的第一份演示文稿。",
    link: "/recipes/01-ppt-skill-walkthrough.html",
    label: "PRESENTATION",
    image: "/images/showcase-presentation-v1.webp",
    headline: "IDEA\nTO DECK",
    caption: "把想法，变成有说服力的表达。",
    steps: ["问题与机会", "解决方案", "实现路径", "预期成果"],
  },
  {
    tab: "制作网页",
    title: "从一个想法，\n到一个在线网页",
    description:
      "把页面制作与发布串成完整流程。了解如何准备网页文件，并通过 DKFile 将作品发布到公网。",
    link: "/recipes/10-dkfile-deploy-codex.html",
    label: "WEBSITE",
    image: "/images/showcase-website-v1.webp",
    headline: "BUILD\n& SHIP",
    caption: "让你的下一个作品，被更多人看见。",
    steps: ["准备页面", "检查效果", "发布上线", "分享作品"],
  },
  {
    tab: "搭建知识库",
    title: "让零散资料，\n成为你的知识库",
    description:
      "连接 Codex 与 Obsidian，用 LLM Wiki 的思路组织资料、建立关联，逐步搭建可持续维护的个人知识库。",
    link: "/recipes/07-llm-wiki-codex.html",
    label: "KNOWLEDGE",
    image: "/images/showcase-knowledge-v1.webp",
    headline: "CONNECT\nTHE DOTS",
    caption: "让每一条知识，都有新的连接。",
    steps: ["收集资料", "提炼观点", "建立关联", "持续更新"],
  },
];
const stepCaptions = [
  ["看见机会", "讲清价值", "串起逻辑", "呈现成果"],
  ["从画布开始", "拼出你的页面", "让作品上线", "与世界见面"],
  ["收好每次灵感", "找到关键观点", "让知识相遇", "持续生长"],
];
const current = computed(() => cases[active.value]);
const root = ref<HTMLElement>();
let scrollFrame = 0;
let resizeObserver: ResizeObserver | undefined;
let animatedSections: Record<string, HTMLElement | null> = {};
let motionQuery: MediaQueryList | undefined;
let frame = 0;
function move(event: PointerEvent) {
  if (event.pointerType !== "mouse" || motionQuery?.matches || !root.value)
    return;
  cancelAnimationFrame(frame);
  const target = event.currentTarget as HTMLElement;
  const bounds = target.getBoundingClientRect();
  frame = requestAnimationFrame(() => {
    root.value?.style.setProperty(
      "--art-x",
      `${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}px`,
    );
    root.value?.style.setProperty(
      "--art-y",
      `${((event.clientY - bounds.top) / bounds.height - 0.5) * 8}px`,
    );
  });
}
function reset() {
  cancelAnimationFrame(frame);
  root.value?.style.setProperty("--art-x", "0px");
  root.value?.style.setProperty("--art-y", "0px");
}
const clamp = (value: number) => Math.max(0, Math.min(1, value));
function updateScene() {
  scrollFrame = 0;
  if (!root.value) return;
  const reduced = motionQuery?.matches ?? false;
  const mobile = window.innerWidth <= 760;
  root.value.classList.toggle("cg-motion", !reduced);
  const height = window.innerHeight;
  const stage = root.value.querySelector<HTMLElement>(".cg-learning-stage");
  const stageFits = !!stage && stage.offsetHeight + 150 < height;
  const cinematic = window.innerWidth >= 1000 && height >= 760 && stageFits;
  root.value.classList.toggle("cg-sticky-ready", cinematic && !reduced);
  const hero = animatedSections.hero?.getBoundingClientRect();
  const learning = animatedSections.learning?.getBoundingClientRect();
  const showcase = animatedSections.showcase?.getBoundingClientRect();
  const community = animatedSections.community?.getBoundingClientRect();
  const set = (name: string, value: number) =>
    root.value?.style.setProperty(name, value.toFixed(4));
  set(
    "--hero-progress",
    reduced || mobile || !hero ? 0 : clamp(-hero.top / hero.height),
  );
  set(
    "--route-progress",
    reduced || !learning
      ? 1
      : clamp(
          (height * (cinematic ? 0.4 : 0.92) - learning.top) /
            (height * (mobile ? 0.45 : cinematic ? 0.85 : 0.8)),
        ),
  );
  const routeProgress = Number(
    root.value.style.getPropertyValue("--route-progress"),
  );
  const terminal = root.value
    .querySelector(".cg-ticket-start")
    ?.getBoundingClientRect();
  if (
    reduced ||
    (routeProgress > 0.85 &&
      terminal &&
      terminal.top < height * 0.9 &&
      terminal.bottom > 100)
  )
    typedStarted.value = true;
  set(
    "--show-progress",
    reduced || !showcase
      ? 1
      : clamp((height * 0.95 - showcase.top) / (height * 0.65)),
  );
  set(
    "--community-progress",
    reduced || !community
      ? 1
      : clamp(
          (height - community.top) /
            Math.min(height * 0.62, community.height * 0.8),
        ),
  );
  set(
    "--ribbon-progress",
    reduced || mobile || !learning ? 0 : (height - learning.top) / height,
  );
}
function queueScene() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScene);
}
function hideDeparting(element: Element) {
  element.setAttribute("aria-hidden", "true");
}
onMounted(() => {
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  animatedSections = {
    hero: root.value?.querySelector(".cg-hero") ?? null,
    learning: root.value?.querySelector(".cg-learning") ?? null,
    showcase: root.value?.querySelector(".cg-showcase") ?? null,
    community: root.value?.querySelector(".cg-community") ?? null,
  };
  window.addEventListener("scroll", queueScene, { passive: true });
  window.addEventListener("resize", queueScene);
  motionQuery.addEventListener("change", queueScene);
  if ("ResizeObserver" in window && root.value) {
    resizeObserver = new ResizeObserver(queueScene);
    resizeObserver.observe(root.value);
  }
  updateScene();
});
onUnmounted(() => {
  window.removeEventListener("scroll", queueScene);
  window.removeEventListener("resize", queueScene);
  motionQuery?.removeEventListener("change", queueScene);
  resizeObserver?.disconnect();
  cancelAnimationFrame(scrollFrame);
  cancelAnimationFrame(frame);
});
</script>

<template>
  <div ref="root" class="cg-home" :class="{ 'cg-type-running': typedStarted }">
    <section
      class="cg-hero"
      aria-labelledby="main-title"
      @pointermove="move"
      @pointerleave="reset"
    >
      <div class="cg-backdrop-word" aria-hidden="true">CODEX</div>
      <div class="cg-hero-inner">
        <div class="cg-hero-copy">
          <p class="cg-eyebrow">
            <span class="cg-status-dot" /> CODEX GUIDE · 从入门到实战
          </p>
          <h1 id="main-title" class="cg-daily-title">
            <span>让 AI 编程助手</span><span>真正进入</span
            ><span class="cg-title-mark"
              >你的日常工作<svg viewBox="0 0 440 24" aria-hidden="true">
                <path d="M4 13Q165 0 431 9M60 21Q225 8 410 16" /></svg
            ></span>
          </h1>
          <p class="cg-intro">
            从第一个任务开始，<br class="cg-mobile-break" />把 Codex
            用进真实工作。
          </p>
          <div class="cg-actions">
            <RouteLink class="cg-button" to="/start/06-first-task.html"
              >开始第一个任务 <span aria-hidden="true">↗</span></RouteLink
            >
            <RouteLink class="cg-button cg-button-outline" to="/recipes/"
              >探索实战案例 <span aria-hidden="true">↗</span></RouteLink
            >
          </div>
          <div class="cg-benefits" aria-label="探索 CodexGuide">
            <RouteLink class="cg-benefit-chip" to="/start/07-task-design.html"
              ><span class="cg-benefit-symbol" aria-hidden="true"
                ><svg viewBox="0 0 200 56">
                  <path d="M12 35H60L80 14H123L145 35H187" />
                  <circle cx="12" cy="35" r="6" />
                  <circle cx="81" cy="14" r="6" />
                  <circle cx="145" cy="35" r="6" />
                  <path d="m178 26 10 9-10 9" /></svg></span
              ><span
                ><small>WORKFLOW</small><strong>更顺畅的工作流</strong
                ><em>从想法到成果</em></span
              ><b aria-hidden="true">↗</b></RouteLink
            >
            <RouteLink class="cg-benefit-chip" to="/recipes/"
              ><span class="cg-benefit-symbol" aria-hidden="true"
                ><svg viewBox="0 0 200 56">
                  <rect x="32" y="3" width="133" height="50" rx="5" />
                  <path
                    d="M32 14H165M40 9H43M48 9H51M78 25 66 34 78 43M119 25 131 34 119 43M103 22 94 46"
                  /></svg></span
              ><span
                ><small>PLAYGROUND</small><strong>真实的实战场景</strong
                ><em>学了就能用</em></span
              ><b aria-hidden="true">↗</b></RouteLink
            >
            <RouteLink
              class="cg-benefit-chip"
              to="/manual/01-codex-updates.html"
              ><span class="cg-benefit-symbol" aria-hidden="true"
                ><svg viewBox="0 0 200 56">
                  <path d="M70 48H52V8H118V17M63 19H101M63 28H91M63 37H85" />
                  <path
                    d="M105 34a18 18 0 1 0 18-18"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path d="M123 23V34L132 39" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><circle cx="123" cy="34" r="1.5" /></svg></span
              ><span
                ><small>ALWAYS FRESH</small><strong>持续更新的内容</strong
                ><em>与社区一起成长</em></span
              ><b aria-hidden="true">↗</b></RouteLink
            >
          </div>
          <SiteVisitCounter />
        </div>
        <HeroWorkbench />
      </div>
      <div class="cg-hero-foot">
        <span>LEARN. BUILD. SHARE.</span><a href="#learning"
          >探索你的下一步 <span aria-hidden="true">↓</span></a
        >
      </div>
    </section>

    <div class="cg-ribbon" aria-hidden="true">
      <div class="cg-marquee-track">
        <div v-for="copy in 2" :key="copy" class="cg-marquee-group">
          <template v-for="phrase in 2" :key="phrase">
            <span>MAKE SOMETHING REAL</span><b>✳</b>
          </template>
        </div>
      </div>
    </div>

    <section
      id="learning"
      class="cg-section cg-learning cg-reveal"
      aria-labelledby="cg-learning-title"
    >
      <div class="cg-learning-stage">
        <span class="cg-stage-caption" aria-hidden="true"
          >YOUR NEXT MOVE ↙</span
        >
        <div class="cg-section-heading">
          <div>
            <p class="cg-eyebrow">PICK YOUR NEXT ADVENTURE</p>
            <h2 id="cg-learning-title">今天，想探索什么？</h2>
          </div>
          <p>打开一个入口，<br />带走一个新本领。</p>
        </div>
        <div class="cg-tickets">
          <RouteLink to="/start/" class="cg-ticket cg-ticket-start">
            <div class="cg-ticket-top">
              <span class="cg-window-dots" aria-hidden="true"
                ><i /><i /><i /></span
              ><small>HELLO, CODEX</small>
            </div>
            <h3 class="cg-type-line" :aria-label="typedCopy.title">
              <span
                v-for="(char, i) in Array.from(typedCopy.title)"
                :key="i"
                aria-hidden="true"
                :style="{ '--char': i }"
                >{{ char }}</span
              >
            </h3>
            <strong class="cg-type-line" :aria-label="typedCopy.subtitle"
              ><span
                v-for="(char, i) in Array.from(typedCopy.subtitle)"
                :key="i"
                aria-hidden="true"
                :style="{ '--char': i + 4 }"
                >{{ char }}</span
              ></strong
            >
            <p class="cg-type-line" :aria-label="typedCopy.body">
              <template
                v-for="(char, i) in Array.from(typedCopy.body)"
                :key="i"
              >
                <span aria-hidden="true" :style="{ '--char': i + 16 }">{{
                  char
                }}</span
                ><br v-if="char === '，'" aria-hidden="true" />
              </template>
            </p>
            <div class="cg-ticket-art cg-terminal" aria-hidden="true">
              <span>&gt;_</span><i />
            </div>
            <div class="cg-ticket-bottom">
              <small>打开你的第一项任务</small
              ><span class="cg-round-arrow" aria-hidden="true">↗</span>
            </div>
          </RouteLink>
          <RouteLink to="/advanced/" class="cg-ticket cg-ticket-build">
            <div class="cg-ticket-top">
              <span class="cg-notebook-tab" aria-hidden="true">✳</span
              ><small>FIELD NOTES</small>
            </div>
            <h3>进阶教程</h3>
            <strong>建立可复用的工作流</strong>
            <p>
              掌握任务设计、项目规则与自动化，<br />让 Codex 成为你的工作伙伴。
            </p>
            <div class="cg-ticket-art cg-nodes" aria-hidden="true">
              <svg viewBox="0 0 280 125">
                <path d="M45 65L140 35L235 85M140 35L130 110" />
                <circle cx="45" cy="65" r="26" />
                <circle cx="140" cy="35" r="32" />
                <circle cx="235" cy="85" r="25" />
                <circle cx="130" cy="110" r="13" />
                <text x="45" y="73">≡</text>
                <text x="140" y="44">&lt;/&gt;</text>
                <text x="235" y="93">✳</text>
              </svg>
            </div>
            <div class="cg-ticket-bottom">
              <small>翻开工作流笔记</small
              ><span class="cg-round-arrow" aria-hidden="true">↗</span>
            </div>
          </RouteLink>
          <RouteLink to="/recipes/" class="cg-ticket cg-ticket-make">
            <div class="cg-ticket-top">
              <span class="cg-poster-star" aria-hidden="true">↗</span
              ><small>MADE WITH CODEX</small>
            </div>
            <h3>实战案例</h3>
            <strong>做出可以展示的成果</strong>
            <p>从真实场景出发，学习完整流程，<br />积累属于你自己的作品集。</p>
            <div
              class="cg-ticket-art cg-project-illustration"
              aria-hidden="true"
            >
              <img
                src="/images/codex-projects-v1.webp"
                width="900"
                height="600"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="cg-ticket-bottom">
              <small>进入作品展厅</small
              ><span class="cg-round-arrow" aria-hidden="true">↗</span>
            </div>
          </RouteLink>
        </div>
        <RouteLink class="cg-path-link" to="/guide/"
          ><span class="cg-path-symbol" aria-hidden="true">⌘</span>
          <span class="cg-path-copy"
            ><small>FIND YOUR WAY</small
            ><strong>还不知道从哪里开始？</strong></span
          >
          <span class="cg-path-action"
            >阅读完整学习路线 <b aria-hidden="true">↗</b></span
          ></RouteLink
        >
      </div>
    </section>

    <section
      class="cg-section cg-showcase cg-reveal"
      :data-scene="active"
      aria-labelledby="cg-showcase-title"
    >
      <div class="cg-section-heading">
        <div>
          <p class="cg-eyebrow">
            THE MAKING ROOM <span class="cg-live-dot" aria-hidden="true" />
          </p>
          <h2 id="cg-showcase-title">让你的想法，<span>有作品可看。</span></h2>
        </div>
        <p>
          一份演示、一个网页、一座知识库。<br />从这里开始，把想法做成作品。
        </p>
      </div>
      <div class="cg-showcase-layout">
        <div class="cg-case-copy">
          <div class="cg-case-tabs" role="group" aria-label="选择实战案例">
            <button
              v-for="(item, index) in cases"
              :key="item.tab"
              type="button"
              :aria-pressed="active === index"
              @click="active = index"
            >
              {{ item.tab }}
            </button>
          </div>
          <div
            aria-live="polite"
            aria-atomic="true"
            class="cg-case-description"
            :key="active"
          >
            <h3>{{ current.title }}</h3>
            <p>{{ current.description }}</p>
          </div>
          <RouteLink :to="current.link" class="cg-button"
            >查看完整步骤 <span aria-hidden="true">↗</span></RouteLink
          >
        </div>
        <div class="cg-preview-stage">
          <Transition name="cg-scene" @before-leave="hideDeparting">
            <div
              :key="active"
              :data-case="active"
              class="cg-preview cg-generated-preview"
              role="img"
              :aria-label="`${current.tab}成果示意：${current.caption}`"
            >
              <div class="cg-mosaic-main">
                <div class="cg-mosaic-label">
                  <span>◈ CodexGuide</span><span>{{ current.label }}</span>
                </div>
                <strong class="cg-mosaic-headline">{{
                  current.headline
                }}</strong>
                <p>{{ current.caption }}</p>
                <img
                  :src="current.image"
                  width="1200"
                  height="800"
                  alt=""
                  decoding="async"
                />
                <small>创意示意 / WORKFLOW PREVIEW</small>
              </div>
              <div class="cg-mosaic-tiles">
                <div
                  v-for="(step, i) in current.steps"
                  :key="step"
                  class="cg-mosaic-tile"
                  :style="{ '--tile': i }"
                >
                  <strong>{{ step }}</strong>
                  <MiniCaseArt :scene="active" :tile="i" />
                  <div class="cg-mini-caption">
                    <small>{{ stepCaptions[active][i] }}</small
                    ><span aria-hidden="true">↗</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <section
      class="cg-community cg-reveal"
      aria-labelledby="cg-community-title"
    >
      <div class="cg-community-inner">
        <p class="cg-eyebrow">付费交流群</p>
        <h2 id="cg-community-title">
          <span>和认真使用 Codex 的人</span><span class="cg-community-highlight">一起进步<svg viewBox="0 0 500 24" aria-hidden="true"><path d="M4 14Q220 1 494 9M60 22Q260 9 466 18" /></svg></span>
        </h2>
        <div class="cg-community-details">
          <div class="cg-community-copy">
            <p class="cg-community-intro">当教程无法覆盖你的真实场景，可以在群里交流配置、工作流、Skills、Plugins、自动化和项目实战。智能体每天汇总各群精华，加入任一群也能了解整个 Codex 社区当天的重点。<br />9.9 元一次付费，入群资格长期有效。</p>
            <div class="cg-community-capacity"><strong>已有 5 个 Codex 交流群满员</strong><span>新成员将加入当前开放群，并持续收到整个社区的每日精华。</span></div>
            <ul class="cg-community-perks">
              <li>围绕真实问题交流，减少泛泛讨论</li>
              <li>智能体每日汇总多个群的核心话题</li>
              <li>持续获取实战案例与重要更新</li>
              <li>认识同样在长期使用 Codex 的伙伴</li>
            </ul>
            <div class="cg-community-actions">
              <RouteLink class="cg-button cg-button-mint" to="/community/join.html">¥9.9 了解并加入 <span aria-hidden="true">↗</span></RouteLink>
              <RouteLink class="cg-button cg-community-secondary" to="/community/roadmap.html">参与社区共建 <span aria-hidden="true">↗</span></RouteLink>
            </div>
            <p class="cg-community-note">支付宝支付 · 付款后当前浏览器自动保存入群资格</p>
          </div>
          <aside class="cg-community-reader">
            <span class="cg-reader-seal" aria-hidden="true">↗</span>
            <p class="cg-eyebrow">适合这些读者</p>
            <h3>你已经开始使用 Codex，并希望把它真正融入工作</h3>
            <ul><li>手上有具体问题或项目</li><li>愿意分享过程和有效经验</li><li>希望获得长期、稳定的中文交流环境</li></ul>
            <RouteLink to="/community/join.html">查看完整介绍 <span aria-hidden="true">↗</span></RouteLink>
          </aside>
        </div>
        <div class="cg-wordmark" aria-hidden="true">
          <div class="cg-warp-type">
            <span
              v-for="(letter, index) in 'CODEXGUIDE'"
              :key="index"
              :style="{ '--letter': index }"
              >{{ letter }}</span
            >
          </div>
          <span class="cg-wordmark-caption">LEARN / BUILD / SHARE / GROW</span>
        </div>
      </div>
    </section>
  </div>
</template>
