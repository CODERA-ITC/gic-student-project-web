<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Loading State for OAuth -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center space-y-4">
        <div
          class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"
        ></div>
        <p class="text-slate-300">Completing sign in...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="min-h-screen flex items-center justify-center"
    >
      <div class="text-center space-y-4">
        <div class="text-red-400">
          <svg
            class="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 class="text-2xl font-bold mt-4">Authentication Failed</h2>
          <p class="text-sm mt-2">{{ error }}</p>
        </div>
        <NuxtLink
          to="/login"
          class="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Login
        </NuxtLink>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Header Section -->
      <div class="py-16 bg-blue-600 border-b border-blue-700/30">
        <UContainer>
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <h1 class="text-5xl font-black text-white">
                Welcome back,
                <span class="text-blue-400">{{ student.name }}</span>
              </h1>
              <p class="text-gray-300">Track and manage your projects</p>
            </div>
            <ButtonsPresetButton preset="createProject" to="/projects/create" />
          </div>
        </UContainer>
      </div>

    <!-- Main Content -->
    <UContainer class="py-12 mx-auto">
      <!-- Activity Overview Title -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-black dark:text-white">
          Activity Overview
        </h2>
        <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
          Track your project submissions and progress
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
            <!-- Value and Graph on same line -->
            <div class="flex items-start justify-between gap-4 mb-3">
              <div class="text-3xl font-bold text-black dark:text-white">
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

      <!-- Recent Projects Section -->
      <div
        class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-8"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-black dark:text-white">
            Recent Projects
          </h2>
          <div class="flex items-center gap-3">
            <!-- Placing the Create Project CTA next to the project list makes it more contextual -->
            <ButtonsPresetButton
              preset="createProject"
              to="/projects/create"
              size="sm"
            />
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div
            v-for="project in recentProjects.filter(
              (p) => p.status === 'In Progress'
            )"
            :key="project.id"
            class="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg group border border-gray-200 dark:border-slate-600/50"
          >
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="font-semibold text-black dark:text-white">
                  {{ project.title }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {{ project.category }}
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
                  class="bg-blue-500 h-1.5 rounded-full"
                />
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-500">
                Updated: {{ project.updated }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-3 space-y-6">
          <!-- My Projects -->
          <div
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-black dark:text-white">
                My Projects
              </h2>
              <NuxtLink
                to="/my-projects"
                class="text-blue-400 hover:text-blue-300 text-sm font-semibold"
              >
                View All →
              </NuxtLink>
            </div>

              <div class="grid md:grid-cols-2 gap-4">
                <div
                  v-for="project in recentProjects"
                  :key="project.id"
                  class="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group cursor-pointer border border-slate-600/50 hover:border-blue-500/30"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <p
                        class="font-semibold text-white group-hover:text-blue-400 transition-colors"
                      >
                        {{ project.title }}
                      </p>
                      <p class="text-xs text-gray-400 mt-1">
                        {{ project.category }}
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
                      class="flex items-center justify-between text-xs text-gray-400"
                    >
                      <span>Progress</span>
                      <span>{{ project.progress }}%</span>
                    </div>
                    <div class="w-full bg-slate-600 rounded-full h-1.5">
                      <div
                        :style="{ width: project.progress + '%' }"
                        class="bg-blue-500 h-1.5 rounded-full transition-all"
                      />
                    </div>
                    <p class="text-xs text-gray-500">
                      Updated: {{ project.updated }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Quick Stats -->
            <div
              class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6"
            >
              <h3 class="text-lg font-bold text-white mb-4">Your Progress</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-400 text-sm">Completion Rate</span>
                    <span class="text-white font-bold">75%</span>
                  </div>
                  <div class="w-full bg-slate-600 rounded-full h-2">
                    <div
                      class="bg-blue-500 h-2 rounded-full"
                      style="width: 75%"
                    />
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-400 text-sm">Total Projects</span>
                    <span class="text-white font-bold">8</span>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-400 text-sm">Approved</span>
                    <span class="text-emerald-400 font-bold">6</span>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-400 text-sm">Average Grade</span>
                    <span class="text-white font-bold">A-</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notifications/Updates -->
            <div
              class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6"
            >
              <h3 class="text-lg font-bold text-white mb-4">Updates</h3>
              <div class="space-y-3">
                <div
                  v-for="update in updates"
                  :key="update.id"
                  :class="update.bgColor"
                  class="p-3 rounded-lg"
                >
                  <p class="text-sm text-white font-medium">
                    {{ update.title }}
                  </p>
                  <p class="text-xs text-gray-300 mt-1">{{ update.message }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import SparklineChart from "~/components/SparklineChart.vue";
import { useRouter, useRoute } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const error = ref("");

// Handle OAuth token from URL (if coming from OAuth callback)
onMounted(async () => {
  try {
    const token = route.query.token;
    const refreshToken = route.query.refresh_token;

    if (token) {
      isLoading.value = true;
      console.log("Student Dashboard - OAuth Callback - Token:", token);

      // Handle OAuth callback with the token
      const tokenStr = String(token);
      const refreshTokenStr = refreshToken ? String(refreshToken) : undefined;
      await authStore.handleOAuthCallback(tokenStr, refreshTokenStr);

      // Remove token from URL
      await router.replace({ query: {} });

      isLoading.value = false;
    }
  } catch (err) {
    console.error("Failed to process OAuth token:", err);
    error.value = err?.message || "Authentication failed. Please try again.";
    isLoading.value = false;

    // Redirect to login after error
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }
});

// Get student info from auth store
const student = computed(() => ({
  name: authStore.currentUser?.name || "Student",
  year: authStore.currentUser?.year || "3rd Year",
  program: authStore.currentUser?.program || "Computer Science",
}));

// Stats for student dashboard
const stats = ref([
  {
    label: "Total Projects",
    value: "8",
    icon: "i-heroicons-briefcase",
    change: "+2 this semester",
    changeColor: "positive",
    chartData: [1, 2, 6, 1, 17, 8, 20],
  },
  {
    label: "Approved",
    value: "6",
    icon: "i-heroicons-check-circle",
    change: "+1 this week",
    changeColor: "positive",
    chartData: [1, 4, 2, 5, 3, 4, 10],
  },
  {
    label: "In Progress",
    value: "2",
    icon: "i-heroicons-clock",
    change: "1 awaiting review",
    changeColor: "negative",
    chartData: [1, 2, 1, 2, 2, 1, 2],
  },
]);

// Recent projects
const recentProjects = ref([
  {
    id: 1,
    title: "AI Chat Bot",
    category: "AI/ML",
    status: "Approved",
    statusColor:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    progress: 100,
    updated: "Nov 10, 2025",
  },
  {
    id: 2,
    title: "Mobile App",
    category: "Mobile Dev",
    status: "In Review",
    statusColor:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    progress: 85,
    updated: "Nov 12, 2025",
  },
  {
    id: 3,
    title: "Web Portfolio",
    category: "Web Dev",
    status: "In Progress",
    statusColor:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    progress: 60,
    updated: "Nov 13, 2025",
  },
  {
    id: 4,
    title: "Data Analysis",
    category: "Data Science",
    status: "In Progress",
    statusColor:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    progress: 40,
    updated: "Nov 8, 2025",
  },
]);

// My Projects data (could be more comprehensive than recent projects)
const myProjects = ref([
  {
    id: 1,
    title: "AI Chat Bot",
    category: "AI/ML",
    status: "Approved",
    statusColor:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    progress: 100,
    updated: "Nov 10, 2025",
  },
  {
    id: 2,
    title: "Mobile App",
    category: "Mobile Dev",
    status: "In Review",
    statusColor:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    progress: 85,
    updated: "Nov 12, 2025",
  },
  {
    id: 3,
    title: "Web Portfolio",
    category: "Web Dev",
    status: "In Progress",
    statusColor:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    progress: 60,
    updated: "Nov 13, 2025",
  },
  {
    id: 4,
    title: "Data Analysis",
    category: "Data Science",
    status: "In Progress",
    statusColor:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    progress: 40,
    updated: "Nov 8, 2025",
  },
  {
    id: 5,
    title: "E-commerce Platform",
    category: "Web Dev",
    status: "Completed",
    statusColor:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    progress: 100,
    updated: "Oct 25, 2025",
  },
  {
    id: 6,
    title: "IoT Smart Home",
    category: "IoT",
    status: "In Progress",
    statusColor:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    progress: 75,
    updated: "Nov 5, 2025",
  },
]);

// Computed stats for My Projects
const myProjectsStats = computed(() => {
  const total = myProjects.value.length;
  const completed = myProjects.value.filter(
    (p) => p.status === "Approved" || p.status === "Completed"
  ).length;
  const inProgress = total - completed;
  return { total, completed, inProgress };
});

// Upcoming deadlines
const upcomingDeadlines = ref([
  {
    id: 1,
    title: "Web Portfolio Design",
    daysLeft: "2 days left",
  },
  {
    id: 2,
    title: "Database Project Submission",
    daysLeft: "3 days left",
  },
  {
    id: 3,
    title: "Algorithm Implementation",
    daysLeft: "5 days left",
  },
]);
</script>
