<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ section: string }>();
const sections: Record<
  string,
  {
    label: string;
    intro: string;
    links: { title: string; detail: string; to: string; icon: string }[];
  }
> = {
  guide: {
    label: "CHOOSE YOUR PATH",
    intro: "从第一个任务，到属于你的工作方式。选择适合自己的起点，边做边学。",
    links: [
      {
        title: "第一次使用",
        detail: "安装、配置，完成第一个任务",
        to: "/start/",
        icon: ">_",
      },
      {
        title: "让工作更顺手",
        detail: "掌握规则、技能与自动化",
        to: "/advanced/",
        icon: "⌘",
      },
      {
        title: "做一个真实作品",
        detail: "从完整案例中找到灵感",
        to: "/recipes/",
        icon: "↗",
      },
    ],
  },
  start: {
    label: "HELLO, CODEX",
    intro: "让 Codex 开始帮你干活。从安装到交付，走完你的第一次完整实践。",
    links: [
      {
        title: "准备好工具",
        detail: "下载并安装 Codex 桌面 App",
        to: "/start/02-app-installation.html",
        icon: "↓",
      },
      {
        title: "完成第一个任务",
        detail: "从一句需求到一个可见的结果",
        to: "/start/06-first-task.html",
        icon: ">_",
      },
      {
        title: "把需求说清楚",
        detail: "用目标、范围和验证组织任务",
        to: "/start/07-task-design.html",
        icon: "↗",
      },
    ],
  },
  advanced: {
    label: "BUILD YOUR WORKFLOW",
    intro: "把一次成功，变成可复用的方法。为 Codex 配置属于你的工作习惯。",
    links: [
      {
        title: "项目规则",
        detail: "让每次协作都有明确约定",
        to: "/advanced/02-agents-md.html",
        icon: "{ }",
      },
      {
        title: "寻找实战场景",
        detail: "把进阶能力用进真实任务",
        to: "/recipes/",
        icon: "↗",
      },
      {
        title: "查阅官方资料",
        detail: "用参考手册核对能力与边界",
        to: "/manual/",
        icon: "≡",
      },
    ],
  },
  recipes: {
    label: "THE MAKING ROOM",
    intro: "一份演示、一个网页、一座知识库。跟着完整过程，把你的想法做出来。",
    links: [
      {
        title: "一句话生成 PPT",
        detail: "从想法到演示文稿",
        to: "/recipes/01-ppt-skill-walkthrough.html",
        icon: "▤",
      },
      {
        title: "发布你的网页",
        detail: "让本地作品被更多人看见",
        to: "/recipes/10-dkfile-deploy-codex.html",
        icon: "↗",
      },
      {
        title: "搭建 AI 知识库",
        detail: "让资料产生新的连接",
        to: "/recipes/07-llm-wiki-codex.html",
        icon: "✳",
      },
    ],
  },
  manual: {
    label: "KEEP IT HANDY",
    intro: "需要时，随手查。官方资料、产品更新与参考来源，集中在这里。",
    links: [
      {
        title: "产品更新",
        detail: "了解 Codex 的变化",
        to: "/manual/01-codex-updates.html",
        icon: "↻",
      },
      {
        title: "学习路线",
        detail: "重新找到你的下一步",
        to: "/guide/",
        icon: "⌘",
      },
      {
        title: "实践一下",
        detail: "把新知识变成新作品",
        to: "/recipes/",
        icon: "↗",
      },
    ],
  },
};
const current = computed(() => sections[props.section] ?? sections.guide);
</script>
<template>
  <section class="cg-section-intro" aria-label="本栏目精选入口">
    <p class="cg-directory-label">
      {{ current.label }} <span aria-hidden="true">✳</span>
    </p>
    <p class="cg-directory-intro">{{ current.intro }}</p>
    <div class="cg-directory-cards">
      <RouteLink v-for="link in current.links" :key="link.title" :to="link.to">
        <span class="cg-directory-icon" aria-hidden="true">{{
          link.icon
        }}</span>
        <strong>{{ link.title }}</strong
        ><small>{{ link.detail }}</small
        ><b aria-hidden="true">↗</b>
      </RouteLink>
    </div>
  </section>
</template>
