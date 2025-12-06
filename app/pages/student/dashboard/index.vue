<template>
  <div class="min-h-screen bg-slate-900">
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
    <UContainer class="py-12">
      <!-- Stats Grid -->
      <div class="grid md:grid-cols-4 gap-6 mb-12">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
        >
          <div
            class="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4"
          >
            <UIcon :name="stat.icon" class="w-6 h-6 text-white" />
          </div>
          <p class="text-gray-400 text-sm mb-1">{{ stat.label }}</p>
          <p class="text-3xl font-bold text-white">{{ stat.value }}</p>
          <p :class="stat.changeColor" class="text-xs mt-2">
            {{ stat.change }}
          </p>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- My Projects -->
          <div
            class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-white">My Projects</h2>
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
                <p class="text-sm text-white font-medium">{{ update.title }}</p>
                <p class="text-xs text-gray-300 mt-1">{{ update.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

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
    changeColor: "text-blue-400",
  },
  {
    label: "Approved",
    value: "6",
    icon: "i-heroicons-check-circle",
    change: "+1 this week",
    changeColor: "text-green-400",
  },
  {
    label: "In Progress",
    value: "2",
    icon: "i-heroicons-clock",
    change: "1 awaiting review",
    changeColor: "text-yellow-400",
  },
  {
    label: "Average Grade",
    value: "A-",
    icon: "i-heroicons-star",
    change: "+0.5 GPA",
    changeColor: "text-purple-400",
  },
]);

// Recent projects
const recentProjects = ref([
  {
    id: 1,
    title: "AI Chat Bot",
    category: "AI/ML",
    status: "Approved",
    statusColor: "bg-emerald-500/20 text-emerald-300",
    progress: 100,
    updated: "Nov 10, 2025",
  },
  {
    id: 2,
    title: "Mobile App",
    category: "Mobile Dev",
    status: "In Review",
    statusColor: "bg-yellow-500/20 text-yellow-300",
    progress: 85,
    updated: "Nov 12, 2025",
  },
  {
    id: 3,
    title: "Web Portfolio",
    category: "Web Dev",
    status: "In Progress",
    statusColor: "bg-blue-500/20 text-blue-300",
    progress: 60,
    updated: "Nov 13, 2025",
  },
  {
    id: 4,
    title: "Data Analysis",
    category: "Data Science",
    status: "In Progress",
    statusColor: "bg-blue-500/20 text-blue-300",
    progress: 40,
    updated: "Nov 8, 2025",
  },
]);

// Updates/Notifications
const updates = ref([
  {
    id: 1,
    title: "Project Approved! 🎉",
    message: "Your AI Chat Bot project has been approved by Dr. Emily Watson",
    bgColor: "bg-emerald-500/20 border border-emerald-500/30",
  },
  {
    id: 2,
    title: "Review Feedback",
    message: "Your Mobile App submission needs revision. See comments.",
    bgColor: "bg-yellow-500/20 border border-yellow-500/30",
  },
  {
    id: 3,
    title: "New Assignment",
    message: "Prof. Kumar assigned 'API Design Challenge' today",
    bgColor: "bg-blue-500/20 border border-blue-500/30",
  },
]);

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
