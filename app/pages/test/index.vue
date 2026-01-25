<script setup lang="ts">
const roadmap = [
  {
    name: "Discovery",
    description:
      "Researched project goals, identified target users, and gathered initial requirements.",
    date: "Aug 2025",
    icon: "i-lucide-search",
    status: "done" as const,
  },
  {
    name: "Planning",
    description:
      "Created wireframes, defined system architecture, and built a development timeline.",
    date: "Sep 2025",
    icon: "i-lucide-clipboard-list",
    status: "done" as const,
  },
  {
    name: "UI/UX Design",
    description:
      "Designed user flows, built UI components, and finalized the design system.",
    date: "Oct 2025",
    icon: "i-lucide-palette",
    status: "done" as const,
  },
  {
    name: "Development",
    description:
      "Implemented core features, integrated backend APIs, and handled authentication.",
    date: "Nov 2025",
    icon: "i-lucide-code",
    status: "in-progress" as const,
  },
  {
    name: "Testing",
    description:
      "Fixed bugs, improved performance, and tested across devices and browsers.",
    date: "Dec 2025",
    icon: "i-lucide-bug",
    status: "in-progress" as const,
  },
  {
    name: "Launch & Optimization",
    description:
      "Deployed the app, monitored metrics, and improved features based on feedback.",
    date: "Jan 2026",
    icon: "i-lucide-rocket",
    status: "pending" as const,
  },
];
</script>

<template>
  <UContainer class="my-12 bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold mb-6">Project Development Roadmap</h1>
    <RoadmapInfographic :milestones="roadmap" />
  </UContainer>
</template>
