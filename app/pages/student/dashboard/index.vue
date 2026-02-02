<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Security Questions Modal -->
    <SecurityQuestionsModal
      :is-open="showSecurityQuestions"
      :allow-close="false"
      @submit="handleSecurityQuestionsSubmit"
    />
    <!-- <SecurityQuestionsModal
      :is-open="showSecurityQuestions"
      :allow-close="false"
      @submit="handleSecurityQuestionsSubmit"
    /> -->

    <!-- Loading State -->
    <div
      v-if="isLoading || authStore.isLoading"
      class="min-h-screen flex items-center justify-center"
    >
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
    <div v-else>
      <!-- Header Section -->
      <div class="relative overflow-hidden py-16">
        <div
          class="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/40 rounded-full blur-3xl"
          aria-hidden="true"
        ></div>
        <div
          class="absolute -bottom-32 right-0 w-96 h-96 bg-indigo-600/40 rounded-full blur-3xl"
          aria-hidden="true"
        ></div>
        <div
          class="absolute top-10 right-24 w-52 h-52 bg-cyan-400/30 rounded-full blur-3xl"
          aria-hidden="true"
        ></div>

        <UContainer>
          <div
            class="relative overflow-hidden rounded-3xl border border-white/10 ring-1 ring-blue-500/25 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 shadow-2xl px-8 py-10"
          >
            <div
              class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_30%)] pointer-events-none"
              aria-hidden="true"
            ></div>

            <div
              class="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0"
            >
              <div class="space-y-3">
                <div
                  class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 text-sm font-semibold"
                >
                  <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
                  {{ t("nav.studentDashboard") }}
                </div>
                <h1
                  class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-blue-300 dark:text-white"
                >
                  {{ GreetMessage }},
                  <span class="text-white dark:text-blue-300"
                    >{{ student.name }} 👋</span
                  >
                </h1>
                <p class="text-slate-300 dark:text-slate-300">
                  {{ t("studentDashboard.subtitle") }}
                </p>
              </div>
              <ButtonsPresetButton
                preset="createProject"
                to="/projects/create"
                size="md"
                class="w-full sm:w-auto shadow-lg"
              />
            </div>
          </div>
        </UContainer>
      </div>

      <!-- Main Content -->
      <UContainer class="py-12 mx-auto">
        <!-- Activity Overview Title -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ t("studentDashboard.activityTitle") }}
          </h2>
          <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
            {{ t("studentDashboard.activitySubtitle") }}
          </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
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
              <!-- Value and Graph on same line -->
              <div class="flex items-start justify-between gap-4 mb-3">
                <div class="text-3xl font-semibold text-black dark:text-white">
                  {{ stat.value }}
                </div>
                <!-- Sparkline Chart -->
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

              <!-- Change Info below -->
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

        <!-- My Projects -->
        <!-- <div
          class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-8"
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-black dark:text-white">
              {{ t("studentDashboard.recentProjects") }}
            </h2>
            <NuxtLink
              to="my-projects"
              class="text-blue-400 hover:text-blue-300 text-sm font-semibold"
            >
              {{ t("studentDashboard.viewAll") }} →
            </NuxtLink>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div
              v-for="project in recentProjects"
              :key="project.id"
              @click="navigateTo(`/student/my-projects/${project.id}`)"
              class="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer border border-gray-200 dark:border-slate-600/50 hover:border-blue-500/50 dark:hover:border-blue-500/30"
            >
              <div class="flex items-start justify-between mb-3">
                <div>
                  <p
                    class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  >
                    {{ project.name }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {{ project.category.name }}
                  </p>
                </div>
                <span
                  :class="project.statusColor"
                  class="text-xs font-semibold px-2 py-1 rounded"
                >
                  {{ project.status }}
                </span>
              </div>
              <div class="space-y-2">
                <div
                  class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400"
                >
                  <span>Progress</span>
                  <span>{{ project.progress }}%</span>
                </div>
                <div
                  class="w-full bg-gray-300 dark:bg-slate-600 rounded-full h-1.5"
                >
                  <div
                    :style="{ width: project.progress + '%' }"
                    class="bg-blue-500 h-1.5 rounded-full transition-all"
                  />
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-500">
                  Updated: {{ project.updated }}
                </p>
              </div>
            </div>
          </div>
        </div> -->

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
              view-base="/admin/projects/"
            />
          </div>
        </div>
        <!-- Updates - Full Width
        <div
          class="bg-white dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UIcon
                  name="i-heroicons-bell"
                  class="w-5 h-5 text-blue-600 dark:text-blue-400"
                />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Updates
              </h3>
            </div>
            <span class="text-xs text-gray-500 dark:text-gray-400"
              >Last 24 hours</span
            >
          </div>
          <div class="space-y-3">
            <div
              v-for="update in updates"
              :key="update.id"
              :class="update.bgColor"
              class="p-4 rounded-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer group"
            >
              <div class="flex items-start gap-4">
                <div
                  :class="update.iconBgColor"
                  class="p-2.5 rounded-lg flex-shrink-0"
                >
                  <UIcon
                    :name="update.icon"
                    class="w-5 h-5"
                    :class="update.iconColor"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4 mb-1">
                    <p
                      class="text-sm text-gray-900 dark:text-white font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    >
                      {{ update.title }}
                    </p>
                    <span
                      class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap"
                    >
                      {{ update.time }}
                    </span>
                  </div>
                  <p
                    class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed"
                  >
                    {{ update.message }}
                  </p>
                  <div v-if="update.action" class="mt-2">
                    <NuxtLink
                      :to="`/student/my-projects/${update.projectId}`"
                      class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      {{ update.action }} →
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </UContainer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "~/stores/auth";
import { useProjectStore } from "~/stores/projects";
import SparklineChart from "~/components/SparklineChart.vue";
import { useRouter, useRoute } from "vue-router";
import { getGreetingByTimeZone, SubmissionStatus } from "#imports";

const { t } = useI18n();
const authStore = useAuthStore();
const projectStore = useProjectStore();
const router = useRouter();
const route = useRoute();
definePageMeta({
  middleware: ["auth", "student"],
});
const isLoading = ref(true);
const error = ref("");
const showSecurityQuestions = ref(false);
const GreetMessage = getGreetingByTimeZone("Asia/Phnom_Penh");

const handleSecurityQuestionsSubmit = async (answers) => {
  try {
    await authStore.submitSecurityQuestions(answers);
    showSecurityQuestions.value = false;
  } catch (err) {
    console.error("Failed to save security questions:", err);
  }
};

// Handle OAuth token from URL (if coming from OAuth callback)
const loadDashboard = async () => {
  // Check if user needs to set up security questions
  if (authStore.needsSecurityQuestions) {
    showSecurityQuestions.value = true;
  }

  try {
    // Ensure auth is restored on full page refresh
    if (!authStore.isAuthenticated) {
      const restored = await authStore.restoreAuth();
      if (!restored || !authStore.isAuthenticated) {
        await navigateTo("/login");
        return;
      }
    }

    const token = route.query.token;
    const refreshToken = route.query.refresh_token;

    if (token) {
      console.log("Student Dashboard - OAuth Callback - Token:", token);

      // Handle OAuth callback with the token
      const tokenStr = String(token);
      const refreshTokenStr = refreshToken ? String(refreshToken) : undefined;
      // await authStore.handleOAuthCallback(tokenStr, refreshTokenStr);

      // Check if user needs to set up security questions AFTER OAuth callback
      if (authStore.needsSecurityQuestions) {
        showSecurityQuestions.value = true;
      }

      // Remove token from URL
      await router.replace({ query: {} });
    } else {
      // For non-OAuth logins, check security questions immediately
      if (authStore.needsSecurityQuestions) {
        showSecurityQuestions.value = true;
      }
    }

    // // Ensure auth is restored from localStorage only if not already authenticated
    // if (!authStore.isAuthenticated) {
    //   const authRestored = await authStore.restoreAuth();

    //   // Check authentication after restore attempt
    //   if (!authRestored || !authStore.isAuthenticated) {
    //     console.log("Authentication failed - redirecting to login");
    //     await navigateTo("/login");
    //     return;
    //   }
    // }

    console.log("✅ User authenticated:", authStore.currentUser?.email);

    if (projectStore.userProjects.length === 0) {
      await projectStore.fetchUserProjects();
    }
    if (projectStore.availableTags.length === 0) {
      await projectStore.fetchTags();
    }
    if (projectStore.availableCategories.length === 0) {
      await projectStore.fetchCategories();
    }

    console.log("Dashboard data loaded successfully");
  } catch (err) {
    console.error("Failed to load dashboard:", err);
    error.value = err?.message || "Failed to load dashboard. Please try again.";

    // Redirect to login after error
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } finally {
    // Always clear loading state
    isLoading.value = false;
  }
};

// Ensure data is loaded when client mounts (avoids SSR blocking/hydration issues)
onMounted(() => {
  loadDashboard();
});

// Get student info from auth store
const student = computed(() => ({
  name: authStore.currentUser?.name || "Student",
  year: authStore.currentUser?.year || "3rd Year",
  program: authStore.currentUser?.program || "Computer Science",
}));

// Stats for student dashboard - computed from real data
const normalizeStatus = (p) =>
  (p.submissionStatus || p.projectStatus || p.status || "")
    .toString()
    .trim()
    .toLowerCase();

const stats = computed(() => {
  const userProjects = projectStore.userProjects || [];

  const countByStatus = (matchers) =>
    userProjects.filter((p) => matchers.includes(normalizeStatus(p))).length;

  const isAccepted = (project) =>
    normalizeStatus(project) === "accepted" ||
    project.submissionStatus === SubmissionStatus.ACCEPTED ||
    project.submissionStatus === "Accepted";

  const accepted = userProjects.filter(isAccepted).length;
  const pending = countByStatus(["pending", "submitted", "awaiting review"]);
  const draft = countByStatus(["draft"]);

  const getProjectsChartData = (filterFn = null) => {
    const projectsToAnalyze = filterFn
      ? userProjects.filter(filterFn)
      : userProjects;
    if (projectsToAnalyze.length === 0) return [0, 0, 0, 0, 0, 0, 0];

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
        projectsToAnalyze.filter((project) => {
          if (!project.createdAt) return false;
          const projectDate = new Date(project.createdAt);
          return projectDate <= targetDate;
        }).length,
    );
  };

  const chartFor = (filterFn) => {
    const data = getProjectsChartData(filterFn);
    const current = data[data.length - 1] || 0;
    const previous = data[data.length - 2] || 0;
    const changeValue = current - previous;
    const percentage =
      previous > 0 ? ((changeValue / previous) * 100).toFixed(1) : "0";
    const changeText =
      changeValue !== 0
        ? `${changeValue > 0 ? "+" : ""}${changeValue} (${percentage}%) from last period`
        : "No change from last period";
    return { data, changeValue, changeText };
  };

  const totalChart = chartFor(null);
  const acceptedChart = chartFor((p) => isAccepted(p));
  const pendingChart = chartFor((p) =>
    ["pending", "submitted", "awaiting review"].includes(normalizeStatus(p)),
  );
  const draftChart = chartFor((p) => normalizeStatus(p) === "draft");

  return [
    {
      label: "Total Projects",
      value: String(userProjects.length),
      icon: "i-heroicons-briefcase",
      change: totalChart.changeText,
      changeColor: totalChart.changeValue >= 0 ? "positive" : "negative",
      chartData: totalChart.data,
    },
    {
      label: "Accepted",
      value: String(accepted),
      icon: "i-heroicons-check-badge",
      change: acceptedChart.changeText,
      changeColor: acceptedChart.changeValue >= 0 ? "positive" : "negative",
      chartData: acceptedChart.data,
    },
    {
      label: "Pending",
      value: String(pending),
      icon: "i-heroicons-queue-list",
      change: pendingChart.changeText,
      changeColor: pendingChart.changeValue >= 0 ? "positive" : "negative",
      chartData: pendingChart.data,
    },
    {
      label: "Draft",
      value: String(draft),
      icon: "i-heroicons-pencil-square",
      change: draftChart.changeText,
      changeColor: draftChart.changeValue >= 0 ? "positive" : "negative",
      chartData: draftChart.data,
    },
  ];
});

// Recent projects - computed from real data
const recentProjects = computed(() => {
  const userProjects = projectStore.userProjects || [];

  const getStatusMeta = (project) => {
    const s = normalizeStatus(project);
    if (
      s === "accepted" ||
      project.submissionStatus === SubmissionStatus.ACCEPTED ||
      project.submissionStatus === "Accepted"
    ) {
      return {
        label: "Accepted",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      };
    }
    if (["pending", "submitted", "awaiting review"].includes(s)) {
      return {
        label: "Pending",
        color:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      };
    }
    if (s === "draft") {
      return {
        label: "Draft",
        color:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
      };
    }
    return {
      label: "Pending",
      color:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    };
  };

  const getProgress = (project) => {
    // Calculate progress based on features completion
    if (project.features && project.features.length > 0) {
      const completedFeatures = project.features.filter(
        (feature) => feature.status === "done",
      ).length;
      const totalFeatures = project.features.length;
      return Math.round((completedFeatures / totalFeatures) * 100);
    }

    // If no features, fall back to status-based progress
    return project.status === "Completed" ? 100 : 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return userProjects.slice(0, 4).map((project) => {
    // Ensure ID is always a string or number, not an object
    const projectId =
      typeof project.id === "object"
        ? project.id?.id || project.id?._id || String(project.id)
        : project.id;

    return {
      id: projectId,
      name: project.name,
      category:
        typeof project.category === "object"
          ? project.category
          : { name: project.category },
      status: getStatusMeta(project).label,
      statusColor: getStatusMeta(project).color,
      progress: getProgress(project),
      updated: formatDate(project.createdAt),
    };
  });
});

// Updates/Notifications - only project related (approvals, rejections, status changes)
const updates = computed(() => {
  const userProjects = projectStore.userProjects || [];
  const projectUpdates = [];

  // Generate notifications based on project status and submissions
  userProjects.forEach((project) => {
    // Check for completed/approved projects
    if (project.submissionStatus === SubmissionStatus.ACCEPTED) {
      projectUpdates.push({
        id: `approved-${project.id}`,
        title: "Project Approved! 🎉",
        projectId: project.id,
        message: `Your "${project.name}" project has been approved and marked as completed`,
        time: "Recently",
        icon: "i-heroicons-check-circle",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        iconBgColor: "bg-emerald-100 dark:bg-emerald-900/40",
        bgColor:
          "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30",
        action: "View Details",
      });
    }

    // Check for projects under review
    if (project.submissions && project.submissions.length > 0) {
      const latestSubmission =
        project.submissions[project.submissions.length - 1];

      if (latestSubmission.status === "Under Review") {
        projectUpdates.push({
          id: `review-${project.id}`,
          title: "Project Under Review",
          projectId: project.id,
          message: `Your "${project.name}" project is currently being reviewed`,
          time: "Recently",
          icon: "i-heroicons-clock",
          iconColor: "text-blue-600 dark:text-blue-400",
          iconBgColor: "bg-blue-100 dark:bg-blue-900/40",
          bgColor:
            "bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30",
          action: "View Status",
        });
      } else if (latestSubmission.status === "Approved") {
        projectUpdates.push({
          id: `submission-approved-${project.id}`,
          projectId: project.id,
          title: "Submission Approved! ✅",
          message: `Your submission for "${project.name}" has been approved`,
          time: "Recently",
          icon: "i-heroicons-check-badge",
          iconColor: "text-emerald-600 dark:text-emerald-400",
          iconBgColor: "bg-emerald-100 dark:bg-emerald-900/40",
          bgColor:
            "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30",
          action: "View Submission",
        });
      } else if (latestSubmission.status === "Rejected") {
        projectUpdates.push({
          id: `submission-rejected-${project.id}`,
          projectId: project.id,
          title: "Submission Needs Revision",
          message: `Your submission for "${project.name}" requires changes. Please review the feedback.`,
          time: "Recently",
          icon: "i-heroicons-exclamation-triangle",
          iconColor: "text-red-600 dark:text-red-400",
          iconBgColor: "bg-red-100 dark:bg-red-900/40",
          bgColor:
            "bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30",
          action: "View Feedback",
        });
      }
    }

    // Check for in-progress projects
    if (project.status === "In Progress") {
      projectUpdates.push({
        id: `progress-${project.id}`,
        projectId: project.id,
        title: "Project In Progress",
        message: `Continue working on "${project.name}" to complete it`,
        time: "Recently",
        icon: "i-heroicons-rocket-launch",
        iconColor: "text-blue-600 dark:text-blue-400",
        iconBgColor: "bg-blue-100 dark:bg-blue-900/40",
        bgColor:
          "bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30",
        action: "Continue Editing",
      });
    }
  });

  // Return only the most recent 3 updates
  return projectUpdates.slice(0, 3);
});
</script>
