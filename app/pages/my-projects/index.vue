<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <!-- Header Section -->
    <div
      class="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 border-b border-emerald-700/30"
    >
      <UContainer>
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <h1 class="text-5xl font-black text-white">My Projects</h1>
            <p class="text-emerald-50 dark:text-gray-200">
              Manage and track your project submissions
            </p>
          </div>
          <ButtonsPresetButton preset="createProject" to="/projects/create" />
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <!-- Tabs -->
      <div
        class="flex gap-4 mb-8 border-b border-gray-200 dark:border-slate-700"
      >
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="[
            'px-6 py-3 font-semibold transition-all duration-200 border-b-2',
            activeTab === tab.value
              ? 'text-emerald-600 dark:text-emerald-400 border-emerald-600 dark:border-emerald-400'
              : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300',
          ]"
        >
          {{ tab.label }}
          <span
            v-if="tab.count !== undefined"
            class="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Projects Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="bg-white dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 group flex flex-col"
        >
          <!-- Project Header -->
          <div :class="project.gradient" class="h-32 relative overflow-hidden">
            <div
              class="absolute inset-0 flex items-center justify-center text-6xl"
            >
              {{ project.emoji }}
            </div>
            <div
              class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"
            />
          </div>

          <!-- Project Content -->
          <div class="p-6 flex flex-col flex-grow">
            <!-- Title and Category -->
            <div class="mb-4">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ project.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ project.description }}
              </p>
            </div>

            <!-- Meta Info -->
            <div class="space-y-3 mb-4 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Status:</span>
                <span
                  :class="getStatusColor(project.status)"
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {{ project.status }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Category:</span>
                <span class="text-gray-900 dark:text-white">{{
                  project.category
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Semester:</span>
                <span class="text-gray-900 dark:text-white">{{
                  project.semester
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600 dark:text-gray-400">Progress:</span>
                <span class="text-gray-900 dark:text-white font-semibold"
                  >{{ project.progress }}%</span
                >
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mb-4">
              <div
                class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2"
              >
                <div
                  :style="{ width: project.progress + '%' }"
                  class="bg-emerald-500 h-2 rounded-full transition-all"
                />
              </div>
            </div>

            <!-- Team -->
            <div class="mb-4">
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Team Members
              </p>
              <div class="flex -space-x-2">
                <div
                  v-for="(member, idx) in project.members.slice(0, 3)"
                  :key="idx"
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-slate-800"
                  :title="member"
                >
                  {{ member.charAt(0) }}
                </div>
                <div
                  v-if="project.members.length > 3"
                  class="w-8 h-8 rounded-full bg-gray-300 dark:bg-slate-700 flex items-center justify-center text-gray-700 dark:text-white text-xs font-bold border-2 border-white dark:border-slate-800"
                  :title="`+${project.members.length - 3} more`"
                >
                  +{{ project.members.length - 3 }}
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div
              class="flex gap-2 mt-auto pt-4 border-t border-gray-200 dark:border-slate-700"
            >
              <NuxtLink
                :to="`/projects/${project.id}`"
                class="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors text-center"
              >
                View
              </NuxtLink>
              <button
                class="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredProjects.length === 0" class="text-center py-20">
        <UIcon
          name="i-heroicons-inbox"
          class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
        />
        <p class="text-gray-600 dark:text-gray-400 text-lg mb-6">
          {{
            activeTab === "all"
              ? "You haven't created any projects yet"
              : `No ${activeTab} projects`
          }}
        </p>
        <ButtonsPresetButton preset="createProject" to="/projects/create" />
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  middleware: ["auth"],
});

const activeTab = ref("all");

const tabs = [
  { label: "All", value: "all", count: 4 },
  { label: "In Progress", value: "in-progress", count: 2 },
  { label: "In Review", value: "in-review", count: 1 },
  { label: "Approved", value: "approved", count: 1 },
];

const myProjects = ref([
  {
    id: 101,
    title: "AI Chat Bot",
    description:
      "Building an intelligent chatbot using NLP and machine learning",
    category: "AI/ML",
    semester: "Semester 2, 2024",
    status: "Approved",
    progress: 100,
    emoji: "🤖",
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
    members: ["You", "Sarah Chen", "Alex Park"],
  },
  {
    id: 102,
    title: "Mobile Fitness App",
    description:
      "Cross-platform fitness tracking application with real-time analytics",
    category: "Mobile",
    semester: "Semester 1, 2024",
    status: "In Progress",
    progress: 65,
    emoji: "💪",
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    members: ["You", "Maria Garcia", "Sam Wilson"],
  },
  {
    id: 103,
    title: "E-Commerce Platform",
    description:
      "Full-stack online store with payment integration and admin dashboard",
    category: "Web",
    semester: "Semester 2, 2024",
    status: "In Review",
    progress: 85,
    emoji: "🛍️",
    gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
    members: ["You", "David Chen", "Lisa Brown"],
  },
  {
    id: 104,
    title: "Climate Monitoring System",
    description:
      "IoT sensor network for real-time environmental data collection",
    category: "Sustainability",
    semester: "Semester 2, 2023",
    status: "Approved",
    progress: 100,
    emoji: "🌍",
    gradient: "bg-gradient-to-br from-teal-500 to-green-600",
    members: ["You", "Nina Patel", "Chris Lee"],
  },
]);

const filteredProjects = computed(() => {
  if (activeTab.value === "all") {
    return myProjects.value;
  }
  return myProjects.value.filter((p) => {
    const statusMap = {
      "in-progress": "In Progress",
      "in-review": "In Review",
      approved: "Approved",
    };
    return p.status === statusMap[activeTab.value];
  });
});

const getStatusColor = (status) => {
  const colors = {
    Approved: "bg-emerald-500/20 text-emerald-300",
    "In Progress": "bg-blue-500/20 text-blue-300",
    "In Review": "bg-yellow-500/20 text-yellow-300",
  };
  return colors[status] || "bg-gray-500/20 text-gray-300";
};

useHead({
  title: "My Projects - GIC Student Portal",
  meta: [
    {
      name: "description",
      content: "Manage your student projects and submissions",
    },
  ],
});
</script>
