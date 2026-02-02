<template>
  <div class="min-h-screen bg-white dark:bg-slate-900 relative">
    <transition name="fade">
      <div
        v-if="showPostAuthSplash"
        class="absolute inset-0 z-20 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
      >
        <div class="flex flex-col items-center gap-3">
          <div
            class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          ></div>
          <p class="text-sm text-slate-700 dark:text-slate-200">
            Loading your dashboard...
          </p>
        </div>
      </div>
    </transition>

    <!-- Loading State -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center space-y-4">
        <div
          class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"
        ></div>
        <p class="text-gray-600 dark:text-slate-300">Loading dashboard...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="min-h-screen flex items-center justify-center"
    >
      <div class="text-center space-y-6">
        <div class="flex flex-col items-center">
          <div
            class="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4"
          >
            <svg
              class="w-12 h-12 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
          </div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p class="text-sm text-gray-600 dark:text-slate-400 max-w-md">
            {{ error }}
          </p>
        </div>
        <NuxtLink
          to="/login"
          class="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
        >
          Back to Login
        </NuxtLink>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="teacher.name">
      <!-- Header Section -->
      <div class="py-14">
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
                >
                  {{ t("home") }}
                </NuxtLink>
                <span class="text-slate-400 dark:text-slate-500">/</span>
                <span class="text-slate-900 dark:text-white font-semibold">
                  {{ t("nav.teacherDashboard") }}
                </span>
              </nav>
              <h1
                class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white"
              >
                {{ GreetMessage }},
                <span class="text-blue-600 dark:text-blue-300"
                  >{{ teacher.name }} 👋</span
                >
              </h1>
              <p class="text-slate-700 dark:text-slate-300">
                {{ t("teacherDashboard.subtitle") }}
              </p>
            </div>
          </div>
        </UContainer>
      </div>

      <!-- Main Content -->
      <UContainer class="py-12 mx-auto">
        <!-- Activity Overview Title -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-black dark:text-white">
            {{ t("teacherDashboard.activityTitle") }}
          </h2>
          <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
            {{ t("teacherDashboard.activitySubtitle") }}
          </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6"
          >
            <!-- Header with Icon and Label -->
            <div class="flex items-center gap-3 mb-4">
              <UIcon
                :name="stat.icon"
                class="w-6 h-6 text-gray-600 dark:text-slate-400"
              />
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                {{ stat.label }}
              </h3>
            </div>

            <!-- Main Value and Graph Container with Border -->
            <div
              class="border-l border-gray-400 dark:border-gray-500 pl-8 relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-2 before:h-1 before:border-t before:border-gray-400 dark:before:border-gray-500 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-2 after:h-1 after:border-b after:border-gray-400 dark:after:border-gray-500"
            >
              <div class="flex items-start justify-between gap-4 mb-3">
                <div class="text-3xl font-semibold text-black dark:text-white">
                  {{ stat.value }}
                </div>
                <div class="w-32 h-12 flex items-center justify-center">
                  <SparklineChart
                    :data="stat.chartData"
                    :width="128"
                    :height="48"
                    :color="
                      stat.changeColor === 'positive'
                        ? '#3b82f6'
                        : stat.changeColor === 'negative'
                          ? '#f59e0b'
                          : '#3b82f6'
                    "
                    :stroke-width="2"
                    :show-area="true"
                  />
                </div>
              </div>

              <div class="flex items-center gap-1">
                <UIcon
                  :name="
                    stat.changeColor === 'positive'
                      ? 'i-heroicons-arrow-trending-up'
                      : 'i-heroicons-arrow-trending-down'
                  "
                  :class="
                    stat.changeColor === 'positive'
                      ? 'text-blue-500'
                      : stat.changeColor === 'negative'
                        ? 'text-amber-500'
                        : 'text-blue-500'
                  "
                  class="w-4 h-4"
                />
                <p class="text-xs text-gray-600 dark:text-slate-400">
                  {{ stat.change }}
                </p>
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
          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <RecentProjectCard
              v-for="project in recentProjects"
              :key="project.id"
              :project="project"
              view-base="/submissions/projects/"
            />
          </div>
        </div>
      </UContainer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "~/stores/auth";
import { useProjectStore } from "~/stores/projects";
import ButtonsPresetButton from "~/components/buttons/PresetButton.vue";
import SparklineChart from "~/components/SparklineChart.vue";
import { getGreetingByTimeZone, useToast } from "#imports";

const { t } = useI18n();
const authStore = useAuthStore();
const projectsStore = useProjectStore();

definePageMeta({
  middleware: ["auth", "teacher"],
});

const isLoading = ref(true);
const error = ref("");
const showPostAuthSplash = ref(false);
const GreetMessage = getGreetingByTimeZone("Asia/Phnom_Penh");

const submissions = computed(() => projectsStore.submissionProjects);

onMounted(async () => {
  try {
    isLoading.value = true;

    if (authStore.isLoading) {
      await new Promise((resolve) => {
        const unwatch = watch(
          () => authStore.isLoading,
          (loading) => {
            if (!loading) {
              unwatch();
              resolve();
            }
          },
        );
      });
    }

    if (!authStore.isAuthenticated || !authStore.currentUser) {
      await navigateTo("/login");
      return;
    }

    if (
      !projectsStore.submissionProjects ||
      projectsStore.submissionProjects.length === 0
    ) {
      await projectsStore.fetchAllSubmissions();
    }

    if (sessionStorage.getItem("post_auth_splash") === "1") {
      showPostAuthSplash.value = true;
      sessionStorage.removeItem("post_auth_splash");
      setTimeout(() => {
        showPostAuthSplash.value = false;
      }, 1000);
    }
  } catch (err) {
    console.error("Error loading dashboard data:", err);
    error.value = "Unable to load dashboard data. Please refresh.";
    const toast = useToast();
    toast.add({
      title: "Error",
      description: "Failed to load submissions.",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
});

const teacher = computed(() => ({
  name: authStore.currentUser?.name || "Teacher",
}));

const stats = computed(() => {
  const data = projectsStore.submissionProjects || [];
  const totalSubmissions = data.length;
  const pendingReview = data.filter(
    (s) => s.submissionStatus === "pending",
  ).length;
  const acceptedProjects = data.filter(
    (s) => s.submissionStatus === "accepted",
  ).length;

  const generateChartData = (filterFn = null) => {
    const items = filterFn ? data.filter(filterFn) : data;
    if (items.length === 0) return [0, 0, 0, 0, 0, 0, 0];

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(23, 59, 59, 999);
      last7Days.push(date);
    }

    return last7Days.map(
      (targetDate) =>
        items.filter((submission) => {
          if (!submission.createdAt) return false;
          const submissionDate = new Date(submission.createdAt);
          return submissionDate <= targetDate;
        }).length,
    );
  };

  const change = (chart) => {
    if (chart.length < 2) return { value: 0, percentage: 0 };
    const current = chart.at(-1);
    const previous = chart.at(-2);
    const diff = current - previous;
    const percentage = previous > 0 ? ((diff / previous) * 100).toFixed(1) : 0;
    return { value: diff, percentage };
  };

  const totalChart = generateChartData();
  const pendingChart = generateChartData(
    (s) => s.submissionStatus === "pending",
  );
  const acceptedChart = generateChartData(
    (s) => s.submissionStatus === "accepted",
  );

  const totalChange = change(totalChart);
  const pendingChange = change(pendingChart);
  const acceptedChange = change(acceptedChart);

  return [
    {
      label: "Total Submissions",
      value: totalSubmissions.toString(),
      icon: "i-heroicons-inbox-stack",
      change:
        totalChange.value !== 0
          ? `${totalChange.value > 0 ? "+" : ""}${totalChange.value} (${totalChange.percentage}%) from last period`
          : "No change from last period",
      changeColor: totalChange.value >= 0 ? "positive" : "negative",
      chartData: totalChart,
    },
    {
      label: "Pending Review",
      value: pendingReview.toString(),
      icon: "i-heroicons-exclamation-circle",
      change:
        pendingChange.value !== 0
          ? `${pendingChange.value > 0 ? "+" : ""}${pendingChange.value} (${pendingChange.percentage}%) from last period`
          : "No change from last period",
      changeColor: pendingChange.value > 0 ? "negative" : "positive",
      chartData: pendingChart,
    },
    {
      label: "Accepted",
      value: acceptedProjects.toString(),
      icon: "i-heroicons-check-circle",
      change:
        acceptedChange.value !== 0
          ? `${acceptedChange.value > 0 ? "+" : ""}${acceptedChange.value} (${acceptedChange.percentage}%) from last period`
          : "No change from last period",
      changeColor: acceptedChange.value >= 0 ? "positive" : "negative",
      chartData: acceptedChart,
    },
  ];
});

const recentProjects = computed(() =>
  (submissions.value || [])
    .filter(
      (project) =>
        (project.submissionStatus || project.projectStatus) === "pending",
    )
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6),
);

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "accepted":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "rejected":
      return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }
};
</script>
