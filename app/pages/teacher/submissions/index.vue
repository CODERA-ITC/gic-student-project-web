<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <!-- Loading State -->
    <div
      v-if="authStore.isLoading"
      class="min-h-screen flex items-center justify-center"
    >
      <div class="text-center space-y-4">
        <div
          class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"
        ></div>
        <p class="text-gray-600 dark:text-slate-300">Loading projects...</p>
      </div>
    </div>

    <!-- Manage Projects Content -->
    <div v-else>
      <!-- Back Button -->
      <div
        class="top-20 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur border-b border-gray-200 dark:border-slate-700"
      >
        <div
          class="w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 py-4"
        >
          <div class="flex items-center justify-between">
            <NuxtLink
              to="/teacher/dashboard"
              class="inline-flex items-center font-medium justify-center gap-2 rounded-md transition-all duration-300 focus:outline-none touch-manipulation select-none active:scale-95 text-indigo-900 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 hover:cursor-pointer px-4 py-2.5 text-base min-h-[44px]"
            >
              <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
              <span class="truncate">Back</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Header Section -->
      <div
        class="py-16 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700"
      >
        <UContainer>
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div class="flex flex-col gap-2 flex-1">
              <h1
                class="text-2xl sm:text-3xl md:text-4xl font-black text-black dark:text-white leading-none"
              >
                Manage Projects
              </h1>
              <p class="text-sm sm:text-base text-gray-600 dark:text-slate-300">
                Search, filter, and manage all student project submissions
              </p>
            </div>
          </div>
        </UContainer>
      </div>

      <!-- Main Content -->
      <UContainer class="py-12 mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <!-- Main Content -->
          <div class="w-full">
            <!-- Projects Table -->
            <div
              class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden"
            >
              <!-- Filters and Search -->
              <div
                class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 p-6"
              >
                <!-- Section Header -->
                <div class="mb-6">
                  <h3
                    class="text-gray-900 dark:text-white text-xl font-bold mb-2"
                  >
                    Student Projects
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-slate-400">
                    Search, filter, and manage all student project submissions
                  </p>
                </div>
                <div
                  class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4"
                >
                  <div class="relative flex-1">
                    <UIcon
                      name="i-heroicons-magnifying-glass"
                      class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500"
                    />
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search projects..."
                      class="w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-black dark:text-white text-sm placeholder-gray-500 dark:placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <div class="flex gap-2">
                    <ButtonsPresetButton
                      preset="primary"
                      label="All Projects"
                      icon="i-heroicons-list-bullet"
                      size="sm"
                      @click="setActiveFilter('all')"
                      :class="{ 'bg-blue-800': activeFilter === 'all' }"
                    />
                    <ButtonsPresetButton
                      preset="primary"
                      label="Completed Project"
                      icon="i-heroicons-check-circle"
                      size="sm"
                      @click="setActiveFilter('completed')"
                      :class="{ 'bg-blue-800': activeFilter === 'completed' }"
                    />
                    <ButtonsPresetButton
                      preset="primary"
                      label="Pending Reviews"
                      icon="i-heroicons-exclamation-circle"
                      size="sm"
                      @click="setActiveFilter('pending')"
                      :class="{ 'bg-blue-800': activeFilter === 'pending' }"
                    />
                  </div>
                </div>

                <div class="flex gap-4 flex-wrap">
                  <select
                    v-model="selectedCategory"
                    class="w-full sm:w-auto px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-black dark:text-white text-sm min-w-40 focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-app">Mobile App</option>
                    <option value="data-science">Data Science</option>
                    <option value="ai-ml">AI/ML</option>
                    <option value="game-dev">Game Development</option>
                    <option value="other">Other</option>
                  </select>

                  <select
                    v-model="selectedGeneration"
                    class="w-full sm:w-auto px-3 py-1.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md text-black dark:text-white text-sm min-w-40 focus:outline-none"
                  >
                    <option value="">All Years</option>
                    <option value="gen-2024">2024-2025</option>
                    <option value="gen-2025">2025-2026</option>
                    <option value="gen-2026">2026-2027</option>
                  </select>
                </div>
              </div>
              <table class="w-full border-collapse">
                <thead>
                  <tr>
                    <th
                      class="bg-gray-100 dark:bg-slate-900 text-black dark:text-slate-100 font-semibold text-xs text-left p-3 border-b border-gray-200 dark:border-slate-700"
                    >
                      Student
                    </th>
                    <th
                      class="bg-gray-100 dark:bg-slate-900 text-black dark:text-slate-100 font-semibold text-xs text-left p-3 border-b border-gray-200 dark:border-slate-700"
                    >
                      Project Name
                    </th>
                    <th
                      class="bg-gray-100 dark:bg-slate-900 text-black dark:text-slate-100 font-semibold text-xs text-left p-3 border-b border-gray-200 dark:border-slate-700 hidden md:table-cell"
                    >
                      Category
                    </th>
                    <th
                      class="bg-gray-100 dark:bg-slate-900 text-black dark:text-slate-100 font-semibold text-xs text-left p-3 border-b border-gray-200 dark:border-slate-700 hidden md:table-cell"
                    >
                      Year
                    </th>
                    <th
                      class="bg-gray-100 dark:bg-slate-900 text-black dark:text-slate-100 font-semibold text-xs text-left p-3 border-b border-gray-200 dark:border-slate-700"
                    >
                      Status
                    </th>
                    <th
                      class="bg-gray-100 dark:bg-slate-900 text-black dark:text-slate-100 font-semibold text-xs text-left p-3 border-b border-gray-200 dark:border-slate-700 hidden md:table-cell"
                    >
                      Submitted
                    </th>
                    <th
                      class="bg-gray-100 dark:bg-slate-900 text-black dark:text-slate-100 font-semibold text-xs text-left p-3 border-b border-gray-200 dark:border-slate-700"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="project in paginatedProjects"
                    :key="project.id"
                    class="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900 last:border-b-0"
                  >
                    <td class="p-3 text-slate-100 align-top text-xs">
                      <div class="flex items-center gap-3">
                        <div
                          v-if="project.author.avatar"
                          class="w-8 h-8 rounded-full overflow-hidden shrink-0"
                        >
                          <img
                            :src="
                              getAvatarUrl(
                                project.author.avatar,
                                project.author.name,
                              )
                            "
                            :alt="project.author.name"
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <div
                          v-else
                          class="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center shrink-0"
                        >
                          <span class="text-xs font-semibold text-white">{{
                            project.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          }}</span>
                        </div>
                        <div>
                          <div
                            class="font-semibold text-black dark:text-white text-xs"
                          >
                            {{ project.author.name }}
                          </div>
                          <div
                            class="text-xs text-gray-600 dark:text-slate-400"
                          >
                            {{ project.author.program }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="p-3 text-slate-100 align-top text-xs">
                      <div
                        class="font-semibold text-black dark:text-white text-xs mb-1"
                      >
                        {{ project.name }}
                      </div>
                      <div
                        class="text-xs text-gray-600 dark:text-slate-400 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        {{ project.description }}
                      </div>
                    </td>
                    <td
                      class="p-3 text-slate-100 align-top text-xs hidden md:table-cell"
                    >
                      <span
                        class="bg-gray-200 dark:bg-slate-700 text-black dark:text-slate-100 px-2 py-1 rounded text-xs font-medium inline-block"
                        >{{ project.category }}</span
                      >
                    </td>
                    <td
                      class="p-3 text-black dark:text-slate-100 align-top text-xs hidden md:table-cell"
                    >
                      {{ project.academicYear }}
                    </td>
                    <td class="p-3 text-slate-100 align-top text-xs">
                      <span
                        :class="
                          project.status === 'completed'
                            ? 'bg-green-600 text-white'
                            : 'bg-yellow-600 text-white'
                        "
                        class="px-2 py-1 rounded text-xs font-semibold inline-block"
                      >
                        {{
                          project.status === "completed"
                            ? "Completed"
                            : "Pending"
                        }}
                      </span>
                    </td>
                    <td
                      class="p-3 text-black dark:text-slate-100 align-top text-xs hidden md:table-cell"
                    >
                      {{ project.submissions.date }}
                    </td>
                    <td class="p-3 text-slate-100 align-top text-xs">
                      <div class="flex gap-2 flex-wrap">
                        <ButtonsPresetButton
                          preset="primary"
                          label="View"
                          icon="i-heroicons-eye"
                          size="xs"
                          @click="viewProject(project)"
                        />
                        <ButtonsPresetButton
                          v-if="project.status === 'In Progress'"
                          label="Accept"
                          icon="i-heroicons-check-circle"
                          color="success"
                          size="xs"
                          @click="acceptProject(project)"
                          :loading="acceptingId === project.id"
                        />
                        <ButtonsPresetButton
                          v-if="project.status === 'In Progress'"
                          label="Reject"
                          icon="i-heroicons-x-circle"
                          color="danger"
                          size="xs"
                          @click="rejectProject(project)"
                          :loading="rejectingId === project.id"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Empty State -->
              <div
                v-if="totalFilteredProjects === 0"
                class="text-center py-8 px-4"
              >
                <UIcon
                  name="i-heroicons-inbox-stack"
                  class="w-12 h-12 text-slate-500 mx-auto mb-4"
                />
                <h3
                  class="text-black dark:text-white text-lg font-semibold mb-2"
                >
                  No projects found
                </h3>
                <p class="text-slate-400 text-xs">
                  Try adjusting your search or filter criteria.
                </p>
              </div>

              <!-- Pagination -->
              <div
                v-if="totalPages > 1"
                class="flex flex-col gap-4 items-center pt-6 pb-4 px-4 border-t border-gray-200 dark:border-slate-700"
              >
                <div class="text-gray-600 dark:text-slate-400 text-xs">
                  Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
                  {{
                    Math.min(currentPage * itemsPerPage, totalFilteredProjects)
                  }}
                  of {{ totalFilteredProjects }} projects
                </div>
                <div class="flex items-center gap-2">
                  <ButtonsPresetButton
                    preset="primary"
                    label="Previous"
                    icon="i-heroicons-arrow-left"
                    size="sm"
                    @click="prevPage"
                    :disabled="currentPage === 1"
                  />

                  <div class="flex gap-1 mx-2">
                    <ButtonsPresetButton
                      v-for="page in visiblePages"
                      :key="page"
                      preset="secondary"
                      :label="page.toString()"
                      size="sm"
                      class="rounded-md"
                      @click="goToPage(page)"
                      :class="{
                        'bg-blue-500 text-white border-blue-500':
                          page === currentPage,
                      }"
                    />
                  </div>

                  <ButtonsPresetButton
                    preset="primary"
                    label="Next"
                    icon="i-heroicons-chevron-right"
                    size="sm"
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                  />
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
import { useProjectStore } from "~/stores/projects";
import { getAvatarUrl } from "~/utils/avatar";
import ButtonsPresetButton from "~/components/buttons/PresetButton.vue";

const projectsStore = useProjectStore();

const authStore = useAuthStore();

definePageMeta({
  middleware: ["auth", "teacher"],
});
const projects = computed(() => projectsStore.projects);

// Fetch projects on mount
onMounted(async () => {
  if (projectsStore.projects.length === 0) {
    await projectsStore.fetchProjects();
  }
});

// Filter and search state
const activeFilter = ref("all");
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedGeneration = ref("");

// Loading states for accept/reject actions
const acceptingId = ref(null);
const rejectingId = ref(null);

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(8);

// Filtered projects computed property
const filteredProjects = computed(() => {
  let filtered = projects.value.filter((project) => {
    // Filter by active/pending status
    if (activeFilter.value === "completed" && project.status !== "Completed") {
      return false;
    }
    if (activeFilter.value === "pending" && project.status !== "In Progress") {
      return false;
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const matchesSearch =
        project.author.name.toLowerCase().includes(query) ||
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query);
      if (!matchesSearch) {
        return false;
      }
    }

    // Filter by category
    if (selectedCategory.value) {
      const categoryMap = {
        "web-development": "Web Development",
        "mobile-app": "Mobile App",
        "data-science": "Data Science",
        "ai-ml": "AI/ML",
        "game-dev": "Game Development",
        other: "Other",
      };
      const expectedCategory = categoryMap[selectedCategory.value];
      if (project.category !== expectedCategory) {
        return false;
      }
    }

    // Filter by generation
    if (selectedGeneration.value) {
      const generationMap = {
        "gen-2024": "2024-2025",
        "gen-2025": "2025-2026",
        "gen-2026": "2026-2027",
      };
      const expectedGeneration = generationMap[selectedGeneration.value];
      if (project.academicYear !== expectedGeneration) {
        return false;
      }
    }

    return true;
  });
  return filtered;
});

// Pagination computed properties
const totalFilteredProjects = computed(() => {
  return filteredProjects.value.length;
});

const totalPages = computed(() => {
  return Math.ceil(totalFilteredProjects.value / itemsPerPage.value);
});

const paginatedProjects = computed(() => {
  // Apply pagination to filtered projects
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredProjects.value.slice(startIndex, endIndex);
});

// Visible pages for pagination
const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Show first page, current page area, and last page
    if (current <= 4) {
      // Near the beginning
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      // Near the end
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});

// Methods
const setActiveFilter = (filter) => {
  activeFilter.value = filter;
  currentPage.value = 1; // Reset to first page when filter changes
};

const goToPage = (page) => {
  if (typeof page === "number") {
    currentPage.value = page;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Action methods for project buttons
const viewProject = (project) => {
  // TODO: Implement view project functionality
  navigateTo(`/teacher/submissions/${project.id}`);
};

const acceptProject = async (project) => {
  if (confirm(`Accept "${project.name}"?`)) {
    try {
      acceptingId.value = project.id;
      await projectsStore.acceptProject(project.id);
      await projectsStore.fetchProjects();
    } catch (error) {
      console.error("Accept failed:", error);
      alert("Failed to accept project");
    } finally {
      acceptingId.value = null;
    }
  }
};

const rejectProject = async (project) => {
  if (confirm(`Reject "${project.name}"?`)) {
    try {
      rejectingId.value = project.id;
      await projectsStore.rejectProject(project.id);
      await projectsStore.fetchProjects();
    } catch (error) {
      console.error("Reject failed:", error);
      alert("Failed to reject project");
    } finally {
      rejectingId.value = null;
    }
  }
};
</script>
