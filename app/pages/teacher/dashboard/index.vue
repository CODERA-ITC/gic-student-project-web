<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header Section -->
    <div class="py-16 bg-blue-600 border-b border-blue-700/30">
      <UContainer>
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <h1 class="text-5xl font-black text-white">
              Welcome back,
              <span class="text-blue-400">{{ teacher.name }}</span>
            </h1>
            <p class="text-gray-300">
              Manage student projects and review submissions
            </p>
          </div>
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
          <!-- Pending Submissions -->
          <div
            class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-white">Pending Reviews</h2>
              <NuxtLink
                to="/teacher/submissions"
                class="text-blue-400 hover:text-blue-300 text-sm font-semibold"
              >
                View All →
              </NuxtLink>
            </div>

            <div class="space-y-3">
              <div
                v-for="submission in pendingSubmissions"
                :key="submission.id"
                class="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors group cursor-pointer"
              >
                <div class="flex items-center gap-4 flex-1">
                  <div
                    class="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold"
                  >
                    {{ submission.initials }}
                  </div>
                  <div class="flex-1">
                    <p
                      class="font-semibold text-white group-hover:text-blue-400 transition-colors"
                    >
                      {{ submission.studentName }}
                    </p>
                    <p class="text-sm text-gray-400">
                      {{ submission.projectTitle }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <span
                    :class="submission.statusColor"
                    class="text-xs font-semibold px-3 py-1 rounded-full bg-opacity-20 bg-red-500 text-red-300"
                  >
                    {{ submission.status }}
                  </span>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ submission.daysAgo }}
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
            <h3 class="text-lg font-bold text-white mb-4">Class Overview</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Total Students</span>
                <span class="text-xl font-bold text-white">{{
                  teacher.totalStudents
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Active Classes</span>
                <span class="text-xl font-bold text-white">{{
                  teacher.activeClasses
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">Avg Grade</span>
                <span class="text-xl font-bold text-white"
                  >{{ teacher.avgGrade }}%</span
                >
              </div>
              <hr class="border-gray-200" />
              <p class="text-sm text-gray-400">
                Next class:
                <span class="text-white font-semibold">{{
                  teacher.nextClass
                }}</span>
              </p>
            </div>
          </div>

          <!-- Recent Activity -->
          <div
            class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6"
          >
            <h3 class="text-lg font-bold text-white mb-4">Recent Activity</h3>
            <div class="space-y-3">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="text-sm"
              >
                <p class="text-gray-300">{{ activity.action }}</p>
                <p class="text-xs text-gray-500">{{ activity.time }}</p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div
            class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6"
          >
            <h3 class="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <NuxtLink
                to="/teacher/grades"
                class="flex items-center gap-2 w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
              >
                <UIcon name="i-heroicons-chart-bar" class="w-4 h-4" />
                Grade Book
              </NuxtLink>
              <NuxtLink
                to="/teacher/reports"
                class="flex items-center gap-2 w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
              >
                <UIcon name="i-heroicons-document" class="w-4 h-4" />
                Reports
              </NuxtLink>
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

// Get teacher info from auth store
const teacher = computed(() => ({
  name: authStore.currentUser?.name || "Teacher",
  totalStudents: 42,
  activeClasses: 3,
  avgGrade: 78,
  nextClass: "CS101 - Today at 2:00 PM",
}));

// Stats for teacher dashboard
const stats = ref([
  {
    label: "Total Submissions",
    value: "124",
    icon: "i-heroicons-inbox-stack",
    change: "+12 this week",
    changeColor: "text-green-400",
  },
  {
    label: "Pending Review",
    value: "18",
    icon: "i-heroicons-exclamation-circle",
    change: "3 overdue",
    changeColor: "text-red-400",
  },
  {
    label: "Classes",
    value: "3",
    icon: "i-heroicons-academic-cap",
    change: "2 active now",
    changeColor: "text-blue-400",
  },
  {
    label: "Average Score",
    value: "78%",
    icon: "i-heroicons-chart-bar-square",
    change: "+5% from last semester",
    changeColor: "text-green-400",
  },
]);

// Pending submissions
const pendingSubmissions = ref([
  {
    id: 1,
    studentName: "Sarah Johnson",
    projectTitle: "AI Chat Bot Project",
    status: "Pending",
    statusColor: "text-red-300",
    daysAgo: "2 days ago",
    initials: "SJ",
  },
  {
    id: 2,
    studentName: "Michael Chen",
    projectTitle: "Mobile App Development",
    status: "Under Review",
    statusColor: "text-yellow-300",
    daysAgo: "1 day ago",
    initials: "MC",
  },
  {
    id: 3,
    studentName: "Emily Davis",
    projectTitle: "Web Development Portfolio",
    status: "Pending",
    statusColor: "text-red-300",
    daysAgo: "3 days ago",
    initials: "ED",
  },
]);

// Recent activity
const recentActivity = ref([
  {
    id: 1,
    action: "Sarah submitted project",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "New submission from Michael",
    time: "4 hours ago",
  },
  {
    id: 3,
    action: "Assignment deadline reminder sent",
    time: "6 hours ago",
  },
  {
    id: 4,
    action: "Grade book updated",
    time: "1 day ago",
  },
]);
</script>
