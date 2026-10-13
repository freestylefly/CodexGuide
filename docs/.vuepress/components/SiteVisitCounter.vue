<script setup lang="ts">
import { onMounted, ref } from "vue";

import { loadSiteVisitStats, type SiteVisitStats } from "../site-visits.js";

const stats = ref<SiteVisitStats | null>(null);
// 保留占位和连接状态，避免接口不可用时误显示示例数字。
const unavailable = ref(false);

const formatted = (value: number): string => value.toLocaleString("zh-CN");

onMounted(async () => {
  const loaded = await loadSiteVisitStats();

  if (loaded) stats.value = loaded;
  else unavailable.value = true;
});
</script>

<template>
  <p
    class="site-visit-counter"
    role="status"
    aria-live="polite"
  >
    <span class="site-visit-live" :class="{ 'is-offline': unavailable }"><i aria-hidden="true"></i>{{ stats ? "实时" : unavailable ? "待连接" : "加载中" }}</span>
    <span class="site-visit-item">今日访问 <strong>{{ stats ? formatted(stats.today) : "—" }}</strong></span>
    <span class="site-visit-item">累计访问 <strong>{{ stats ? formatted(stats.total) : "—" }}</strong></span>
  </p>
</template>

<style scoped>
.site-visit-counter { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: .4rem .75rem; min-height: 1.6rem; margin: 0 0 1.75rem; color: var(--vp-c-text-mute); font-size: .86rem !important; line-height: 1.5; }
.site-visit-live { display: inline-flex; align-items: center; gap: .38rem; border: 1px solid color-mix(in srgb, var(--vp-c-accent) 40%, var(--vp-c-border)); border-radius: 999px; padding: .16rem .58rem; color: var(--vp-c-accent); font-size: .78rem; font-weight: 800; background: var(--vp-c-accent-soft); }
.site-visit-live i { width: .38rem; height: .38rem; border-radius: 50%; background: currentcolor; animation: site-visit-pulse 1.8s ease-in-out infinite; }
.site-visit-live.is-offline i { animation: none; opacity: .45; }
.site-visit-item { display: inline-flex; align-items: baseline; gap: .3rem; }
.site-visit-item + .site-visit-item::before { content: "·"; margin-inline-end: .3rem; color: var(--vp-c-border); }
.site-visit-item strong { color: var(--vp-c-text); font-variant-numeric: tabular-nums; font-weight: 750; }

@keyframes site-visit-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .25; }
}

@media (prefers-reduced-motion: reduce) {
  .site-visit-live i { animation: none; }
}
</style>
