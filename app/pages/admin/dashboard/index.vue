<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <div class="relative overflow-hidden py-16">
      <div
        class="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        class="absolute -bottom-32 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        class="absolute top-10 right-24 w-52 h-52 bg-cyan-400/20 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>

      <UContainer>
        <div
          class="relative overflow-hidden rounded-3xl border border-white/10 ring-1 ring-blue-500/15 bg-white/90 dark:bg-slate-900/90 shadow-2xl px-8 py-10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(79,70,229,0.08),transparent_30%)] pointer-events-none"
            aria-hidden="true"
          ></div>

          <div class="relative space-y-3">
            <nav
              class="flex items-center flex-wrap gap-1 text-sm text-slate-600 dark:text-slate-300"
            >
              <NuxtLink
                to="/"
                class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                >Home</NuxtLink
              >
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <span class="text-slate-900 dark:text-white font-semibold"
                >Admin Dashboard</span
              >
            </nav>
            <h1
              class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 dark:text-white"
            >
              {{ greetingMessage }},
              <span class="text-blue-600 dark:text-blue-300"
                >{{ adminName }} 👋</span
              >
            </h1>
            <p class="text-slate-700 dark:text-slate-300">
              Manage projects, users, and platform settings from one place.
            </p>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="pb-16 space-y-10">
      <!-- KPI cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          v-for="kpi in kpis"
          :key="kpi.label"
          class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <UIcon
                :name="kpi.icon"
                class="w-6 h-6 text-blue-600 dark:text-blue-300"
              />
              <div>
                <p class="text-xs text-gray-500 dark:text-slate-400">Admin</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ kpi.label }}
                </p>
              </div>
            </div>
            <UBadge color="neutral" variant="soft" size="xs">Live</UBadge>
          </div>

          <div
            class="border-l border-gray-300 dark:border-slate-600 pl-6 relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-2 before:h-1 before:border-t before:border-gray-300 dark:before:border-slate-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-2 after:h-1 after:border-b after:border-gray-300 dark:after:border-slate-600"
          >
            <div class="flex items-start justify-between gap-4 mb-3">
              <p class="text-3xl font-semibold text-gray-900 dark:text-white">
                <span v-if="!loadingCounts && !loadingProjects">{{
                  kpi.value
                }}</span>
                <USkeleton v-else class="h-7 w-16" />
              </p>
              <div class="w-32 h-12 flex items-center justify-center">
                <SparklineChart
                  :data="kpi.chartData"
                  :width="128"
                  :height="48"
                  :color="
                    kpi.changeColor === 'positive'
                      ? '#3b82f6'
                      : kpi.changeColor === 'negative'
                        ? '#f59e0b'
                        : '#3b82f6'
                  "
                  :stroke-width="2"
                  :show-area="true"
                />
              </div>
            </div>
            <div
              class="flex items-center gap-1 text-xs text-gray-600 dark:text-slate-400"
            >
              <UIcon
                :name="
                  kpi.changeColor === 'positive'
                    ? 'i-heroicons-arrow-trending-up'
                    : 'i-heroicons-arrow-trending-down'
                "
                :class="
                  kpi.changeColor === 'positive'
                    ? 'text-blue-500'
                    : 'text-amber-500'
                "
                class="w-4 h-4"
              />
              <span>{{ kpi.caption }}</span>
            </div>
          </div>
        </div>
      </div>

     
      <!-- Recent Projects Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-semibold text-black dark:text-white">
              Recent Projects
            </h2>
            <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
              Latest student project submissions
            </p>
          </div>
          <NuxtLink
            to="/projects"
            class="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>View All Projects</span>
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div v-if="loadingCounts || loadingProjects" class="space-y-3">
          <USkeleton class="h-48 w-full" />
          <USkeleton class="h-48 w-full" />
        </div>

        <div
          v-else-if="recentProjects.length === 0"
          class="text-center py-12 px-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg"
        >
          <UIcon
            name="i-heroicons-inbox-stack"
            class="w-16 h-16 text-slate-500 mx-auto mb-4"
          />
          <h3 class="text-black dark:text-white text-lg font-semibold mb-2">
            No recent projects
          </h3>
          <p class="text-slate-400 text-sm">
            Student project submissions will appear here.
          </p>
        </div>

        <!-- Projects Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <RecentProjectCard
            v-for="project in recentProjects"
            :key="project.id"
            :project="project"
            view-base="/admin/projects/"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth", "admin"],
});

import { ref, onMounted, computed } from "vue";
import { useProjectStore } from "~/stores/projects";
import { storeToRefs } from "pinia";
import SparklineChart from "~/components/SparklineChart.vue";
import { useAuthStore } from "~/stores/auth";
import { authService } from "~/services/AuthService";

const projectStore = useProjectStore();
const { projects, loading: projectLoading } = storeToRefs(projectStore);
const authStore = useAuthStore();

const loading = ref(true);
const loadingCounts = ref(false);
const loadingProjects = projectLoading;
const adminName = computed(() => authStore.user?.name || "Admin");
const greetingMessage = getGreetingByTimeZone("Asia/Phnom_Penh");
const totalStudents = ref(0);
const totalTeachers = ref(0);
const totalProjects = computed(
  () => projectStore.totalProject || projects.value?.length || 0,
);

const buildTrend = (list = []) => {
  if (!list.length)
    return { data: [0, 0, 0, 0, 0, 0, 0], change: 0, percent: "0" };

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    d.setHours(23, 59, 59, 999);
    days.push(d);
  }

  const data = days.map(
    (target) =>
      list.filter((item) => {
        const created = item.createdAt ? new Date(item.createdAt) : null;
        return created ? created <= target : false;
      }).length,
  );

  const current = data[data.length - 1] || 0;
  const previous = data[data.length - 2] || 0;
  const delta = current - previous;
  const percent = previous > 0 ? ((delta / previous) * 100).toFixed(1) : "0";

  return { data, change: delta, percent };
};

const kpis = computed(() => {
  const projectTrend = buildTrend(projects.value);

  return [
    {
      label: "Total Projects",
      value: totalProjects.value,
      caption:
        projectTrend.change !== 0
          ? `${projectTrend.change > 0 ? "+" : ""}${projectTrend.change} (${projectTrend.percent}%) from last period`
          : "No change from last period",
      icon: "i-heroicons-briefcase",
      iconBg: "",
      iconColor: "",
      chartData: projectTrend.data,
      changeColor: projectTrend.change >= 0 ? "positive" : "negative",
    },
    {
      label: "Total Students",
      value: totalStudents.value,
      caption: "Auto-refreshed from /api/users?role=STUDENT",
      icon: "i-heroicons-academic-cap",
      iconBg: "",
      iconColor: "",
      chartData: [0, 0, 0, 0, 0, 0, 0],
      changeColor: "positive",
    },
    {
      label: "Total Teachers",
      value: totalTeachers.value,
      caption: "Auto-refreshed from /api/users?role=TEACHER",
      icon: "i-heroicons-user-group",
      iconBg: "",
      iconColor: "",
      chartData: [0, 0, 0, 0, 0, 0, 0],
      changeColor: "positive",
    },
  ];
});

const recentProjects = computed(() => {
  return [...(projects.value || [])]
    .sort((a, b) => {
      const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    })
    .slice(0, 5);
});

const statusLabel = (p) =>
  (p.submissionStatus || p.projectStatus || p.status || "pending")
    .toString()
    .toUpperCase();

const badgeColor = (p) => {
  const s = (
    p.submissionStatus ||
    p.projectStatus ||
    p.status ||
    ""
  ).toLowerCase();
  if (s === "accepted") return "success";
  if (s === "pending" || s === "submitted") return "primary";
  if (s === "draft") return "neutral";
  if (s === "rejected") return "warning";
  return "secondary";
};

const getStatusBadgeClass = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "accepted")
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (s === "pending" || s === "submitted")
    return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  if (s === "draft")
    return "bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  if (s === "rejected")
    return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200";
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
};

onMounted(async () => {
  try {
    loading.value = true;
    loadingCounts.value = true;
    const headers = await authService.getAuthHeaders();
    const [studentsResp, teachersResp] = await Promise.all([
      $fetch("/api/users", {
        method: "GET",
        headers,
        query: { page: "1", limit: "1", role: "STUDENT" },
      }),
      $fetch("/api/users", {
        method: "GET",
        headers,
        query: { page: "1", limit: "1", role: "TEACHER" },
      }),
      projectStore.fetchProjects(1, 500),
    ]);

    const extractTotal = (resp) =>
      typeof resp?.total === "number"
        ? resp.total
        : Array.isArray(resp?.data)
          ? resp.data.length
          : Array.isArray(resp)
            ? resp.length
            : 0;

    totalStudents.value = extractTotal(studentsResp);
    totalTeachers.value = extractTotal(teachersResp);
  } catch (error) {
    console.error("Failed to load admin dashboard", error);
  } finally {
    loadingCounts.value = false;
    loading.value = false;
  }
});
</script>
