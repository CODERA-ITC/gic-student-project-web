<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <!-- Loading State -->
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center space-y-4">
        <div
          class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"
        ></div>
        <p class="text-gray-600 dark:text-slate-300">Loading dashboard...</p>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="!isLoading && teacher.name">
      <!-- Header Section -->
      <div
        class="py-16 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700"
      >
        <UContainer>
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 md:gap-8"
          >
            <div class="flex flex-col gap-2 flex-1">
              <h1
                class="text-2xl sm:text-3xl md:text-4xl font-black text-black dark:text-white leading-none"
              >
                Welcome back,
                <span class="text-blue-400">{{ teacher.name }}</span>
              </h1>
              <p class="text-sm sm:text-base text-gray-600 dark:text-slate-300">
                Manage student projects and review submissions
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
            Activity Overview
          </h2>
          <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
            Track your project submissions and review progress
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
              to="/teacher/submissions"
              class="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <span>View All Projects</span>
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </div>

          <!-- Projects Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div
              v-for="project in recentProjects"
              :key="project.id"
              class="bg-white dark:bg-slate-800 rounded-xl border-1 border-gray-200 dark:border-slate-700/50"
            >
              <!-- Card Content -->
              <div class="p-6">
                <!-- Header: Status Badge -->
                <div class="flex justify-end mb-3">
                  <span
                    :class="
                      project.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    "
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{
                      project.status === "completed" ? "Completed" : "Pending"
                    }}
                  </span>
                </div>

                <!-- Student Info -->
                <div class="flex items-center gap-3 mb-4">
                  <div
                    v-if="project.studentAvatar"
                    class="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-gray-100 dark:ring-slate-700"
                  >
                    <img
                      :src="project.studentAvatar"
                      :alt="project.studentName"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 ring-2 ring-gray-100 dark:ring-slate-700"
                  >
                    <span class="text-sm font-semibold text-white">{{
                      project.studentInitials
                    }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div
                      class="font-semibold text-black dark:text-white text-sm truncate"
                    >
                      {{ project.studentName }}
                    </div>
                    <div
                      class="text-xs text-gray-500 dark:text-slate-400 truncate"
                    >
                      {{ project.studentEmail }}
                    </div>
                  </div>
                </div>

                <!-- Project Title & Description -->
                <div class="mb-4">
                  <h3
                    class="font-semibold text-base text-black dark:text-white mb-2 line-clamp-1"
                  >
                    {{ project.title }}
                  </h3>
                  <p
                    class="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 leading-relaxed"
                  >
                    {{ project.description }}
                  </p>
                </div>

                <!-- Meta Info -->
                <div
                  class="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-slate-400"
                >
                  <div class="flex items-center gap-1.5">
                    <UIcon name="i-heroicons-tag" class="w-4 h-4" />
                    <span>{{ project.category }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                    <span>{{ project.generation }}</span>
                  </div>
                </div>

                <!-- Divider -->
                <div
                  class="border-t border-gray-100 dark:border-slate-700 mb-4"
                ></div>

                <!-- Footer: Date and Action -->
                <div class="flex items-center justify-between gap-3">
                  <div
                    class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400"
                  >
                    <UIcon name="i-heroicons-clock" class="w-4 h-4" />
                    <span>{{ project.submittedDate }}</span>
                  </div>
                  <ButtonsPresetButton
                    v-if="project.status !== 'pending'"
                    preset="primary"
                    label="View"
                    icon="i-heroicons-arrow-right"
                    size="xs"
                    :to="'/projects/' + project.id"
                  />
                  <ButtonsPresetButton
                    v-if="project.status === 'pending'"
                    preset="primary"
                    label="View"
                    icon="i-heroicons-arrow-right"
                    size="xs"
                    :to="'/projects/' + project.id"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="recentProjects.length === 0"
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
        </div>
      </UContainer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useProjectStore } from "~/stores/projects";
import ButtonsPresetButton from "~/components/buttons/PresetButton.vue";
import SparklineChart from "~/components/SparklineChart.vue";

const authStore = useAuthStore();
const projectsStore = useProjectStore();

definePageMeta({
  middleware: ["auth", "teacher"],
});

// Local loading state
const isLoading = ref(true);

// Fetch submissions on mount
onMounted(async () => {
  try {
    isLoading.value = true;

    // Wait for auth store to be ready
    if (authStore.isLoading) {
      console.log("⏳ Waiting for authentication to complete...");
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

    // Ensure user is authenticated
    if (!authStore.isAuthenticated || !authStore.currentUser) {
      console.warn("⚠️ User not authenticated, redirecting...");
      await navigateTo("/login");
      return;
    }

    console.log("🔄 Fetching submissions data...");

    // Fetch all submissions with error handling
    const submissions = await projectsStore.fetchAllSubmissions();

    if (!submissions || submissions.length === 0) {
      console.log("ℹ️ No submissions found");
    } else {
      console.log(`✅ Loaded ${submissions.length} submissions successfully`);
    }
  } catch (error) {
    console.error("❌ Error loading dashboard data:", error);

    // Show error toast to user
    const toast = useToast();
    toast.add({
      title: "Error Loading Dashboard",
      description: "Failed to load submissions. Please refresh the page.",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
});

// Get teacher info from auth store
const teacher = computed(() => ({
  name: authStore.currentUser?.name || "Teacher",
}));

// Transform projects from store to match teacher dashboard structure
const projects = computed(() => {
  return projectsStore.projects.map((project) => {
    // Generate email from name
    const emailName = project.author.name.toLowerCase().replace(" ", ".");
    const studentEmail = `${emailName}@student.edu`;

    // Generate initials
    const nameParts = project.author.name.split(" ");
    const studentInitials = nameParts
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();

    // Map categories from projects.ts to teacher dashboard categories
    const categoryMapping = {
      "Artificial Intelligence": "AI/ML",
      "Mobile Development": "Mobile App",
      "Web Development": "Web Development",
      "Environmental Tech": "Other",
      "Data Science": "Data Science",
      IoT: "Other",
      Blockchain: "Other",
      "Augmented Reality": "Mobile App",
      "Machine Learning": "AI/ML",
      "Data Analytics": "Data Science",
      EdTech: "Other",
      FinTech: "Other",
      APIs: "Web Development",
      "Virtual Reality": "Game Development",
      "Smart Cities": "Other",
    };

    const mappedCategory = categoryMapping[project.category] || "Other";

    // Map semester to generation
    const generationMapping = {
      "Fall 2024": "2024",
      "Spring 2025": "2025",
    };

    const mappedGeneration = generationMapping[project.semester] || "2024";

    // Map status - show visibility state for submissions
    const statusMapping = {
      reviewing: "pending",
      accepted: "completed",
      public: "completed",
    };

    const mappedStatus = statusMapping[project.visibility] || "pending";

    // Calculate due date (add some days to createdAt)
    const createdDate = new Date(project.createdAt);
    const dueDate = new Date(createdDate);
    dueDate.setDate(dueDate.getDate() + 60); // Add 60 days
    const dueDateString = dueDate.toISOString().split("T")[0];

    // Check if overdue
    const currentDate = new Date();
    const isOverdue = currentDate > dueDate;

    return {
      id: project.id,
      studentName: project.author.name,
      studentEmail: studentEmail,
      studentInitials: studentInitials,
      studentAvatar: project.author.avatar,
      title: project.name,
      description: project.description,
      category: mappedCategory,
      generation: mappedGeneration,
      status: mappedStatus,
      submittedDate: project.createdAt,
      dueDate: dueDateString,
      isOverdue: isOverdue,
    };
  });
});

// Stats for teacher dashboard - computed from real data
const stats = computed(() => {
  const totalSubmissions = projectsStore.projects.length;
  const pendingReview = projectsStore.projects.filter(
    (p) => p.visibility === "reviewing",
  ).length;
  const acceptedProjects = projectsStore.projects.filter(
    (p) => p.visibility === "accepted",
  ).length;

  return [
    {
      label: "Total Submissions",
      value: totalSubmissions.toString(),
      icon: "i-heroicons-inbox-stack",
      change: `${acceptedProjects} accepted`,
      changeColor: "positive",
      chartData: [95, 102, 88, 110, 95, 108, totalSubmissions],
    },
    {
      label: "Pending Review",
      value: pendingReview.toString(),
      icon: "i-heroicons-exclamation-circle",
      change: "Awaiting approval",
      changeColor: pendingReview > 0 ? "negative" : "positive",
      chartData: [20, 14, 25, 19, 17, 21, pendingReview],
    },
    {
      label: "Accepted",
      value: acceptedProjects.toString(),
      icon: "i-heroicons-check-circle",
      change: `${totalSubmissions - acceptedProjects} remaining`,
      changeColor: "positive",
      chartData: [76, 74, 80, 77, 79, 78, acceptedProjects],
    },
  ];
});

// Recent projects - show only 6 most recent projects
const recentProjects = computed(() => {
  // Sort projects by submitted date (most recent first) and take first 6
  return projects.value
    .slice()
    .sort((a, b) => {
      return new Date(b.submittedDate) - new Date(a.submittedDate);
    })
    .slice(0, 6);
});

// Action methods for project buttons
const viewProject = (project) => {
  // TODO: Implement view project functionality
  console.log("View project:", project);
};

const reviewProject = (project) => {
  // TODO: Implement review project functionality
  console.log("Review project:", project);
};
</script>
