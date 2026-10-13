<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const robot = ref<HTMLImageElement>();
const ready = ref(false);
let alive = true;
const begin = () => {
  if (alive) ready.value = true;
};
onMounted(() => {
  if (robot.value?.complete) begin();
  void robot.value?.decode().then(begin, begin);
});
onUnmounted(() => {
  alive = false;
});
</script>

<template>
  <div class="cg-art cg-workbench">
    <div
      class="cg-workbench-stage"
      :class="{ 'is-assembled': ready }"
      role="img"
      aria-label="机器人、终端、任务清单和网页从不同方向汇聚成 Codex 工作台"
    >
      <div class="cg-workbench-disc" aria-hidden="true">
        <span>IDEA → OUTPUT</span>
      </div>
      <div class="cg-piece flight-terminal" aria-hidden="true">
        <div class="cg-prop cg-live-terminal">
          <div class="cg-prop-bar">
            <span>● ● ●</span><small>codex — workspace</small>
          </div>
          <p><b>$</b> codex</p>
          <p>› Reading your ideas…</p>
          <p>› Connecting the dots…</p>
          <p class="cg-terminal-done">✓ Let's make it real.</p>
          <i class="cg-terminal-cursor" />
        </div>
      </div>
      <div class="cg-piece flight-checklist" aria-hidden="true">
        <div class="cg-prop cg-live-checklist">
          <small>THE PLAN</small><strong>从想法到作品</strong
          ><span>✓ 理解需求</span><span>✓ 动手实现</span><span>✓ 验证结果</span
          ><em>READY TO SHIP ↗</em>
        </div>
      </div>
      <div class="cg-piece flight-browser" aria-hidden="true">
        <div class="cg-prop cg-live-browser">
          <div class="cg-prop-bar">
            <span>● ● ●</span><small>your-next-idea.site</small>
          </div>
          <strong>Hello,<br />possibilities.</strong>
          <div class="cg-browser-hills" />
          <span class="cg-browser-badge">LIVE ↗</span>
        </div>
      </div>
      <div class="cg-piece flight-books" aria-hidden="true">
        <div class="cg-live-books">
          <span>IDEAS</span><span>PROMPTS</span><span>BETTER WORK</span>
        </div>
      </div>
      <div class="cg-piece flight-plant" aria-hidden="true">
        <svg viewBox="0 0 130 230">
          <path
            d="M62 177Q72 97 60 28M69 123L111 69M67 151L21 94"
            fill="none"
            stroke="#bce5bd"
            stroke-width="4"
          />
          <path
            d="M62 99Q12 47 41 8Q83 27 62 99M71 134Q77 58 126 53Q134 103 71 134M61 160Q8 160 4 80Q54 89 61 160"
            fill="#99cfa6"
            stroke="#073f35"
            stroke-width="2"
          />
          <path
            d="M25 170H102L91 223H37Z"
            fill="#c9efb6"
            stroke="#073f35"
            stroke-width="3"
          />
        </svg>
      </div>
      <div class="cg-piece flight-robot">
        <img
          ref="robot"
          class="cg-robot-cutout"
          src="/images/codex-robot-cutout-v1.webp"
          width="1024"
          height="1024"
          alt=""
          fetchpriority="high"
          @load="begin"
          @error="begin"
        />
      </div>
      <div class="cg-piece flight-diff" aria-hidden="true">
        <div class="cg-prop cg-live-diff">
          <div class="cg-prop-bar">
            <span>⌘ app.py</span><small>CHANGES</small>
          </div>
          <p>− print("Hello world")</p>
          <p>+ print("Hello, Codex!")</p>
        </div>
      </div>
      <span class="cg-workbench-spark" aria-hidden="true">✳</span>
    </div>
  </div>
</template>
