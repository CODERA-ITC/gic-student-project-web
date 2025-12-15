<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <!-- Header Section -->
    <div
      class="py-16 bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700"
    >
      <UContainer>
        <div class="flex items-center justify-start gap-4 md:gap-8">
          <div class="flex flex-col gap-2">
            <h1
              class="text-2xl md:text-4xl font-black text-black dark:text-white leading-none"
            >
              Welcome back,
              <span class="text-blue-400">{{ teacher.name }}</span>
            </h1>
            <p class="text-gray-600 dark:text-slate-300">
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
        <h2 class="text-xl font-bold text-black dark:text-white">
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
            class="border-l-2 border-gray-400 dark:border-gray-500 pl-8 relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-2 before:h-1 before:border-t-2 before:border-gray-400 dark:before:border-gray-500 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-2 after:h-1 after:border-b-2 after:border-gray-400 dark:after:border-gray-500"
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
                      ? '#ef4444'
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
                name="i-heroicons-arrow-trending-up"
                :class="
                  stat.changeColor === 'positive'
                    ? 'text-blue-500'
                    : stat.changeColor === 'negative'
                    ? 'text-red-500'
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
                    label="Active Project"
                    icon="i-heroicons-check-circle"
                    size="sm"
                    @click="setActiveFilter('active')"
                    :class="{ 'bg-blue-800': activeFilter === 'active' }"
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
                  <option value="">All Generations</option>
                  <option value="gen-2024">Generation 2024</option>
                  <option value="gen-2025">Generation 2025</option>
                  <option value="gen-2026">Generation 2026</option>
                </select>
              </div>
            </div>
            <table class="w-full border-collapse">
              <thead>
                <th
                  class="bg-gray-100 dark:bg-slate-900 text-black dark:text-slate-100 font-semibold text-xs text-left p-3 border-b border-gray-200 dark:border-slate-700"
                >
                  Student
                </th>
                <th
                  class="bg-gray-100 dark:bg-slate-900 text-black dark:text-slate-100 font-semibold text-xs text-left p-3 border-b border-gray-200 dark:border-slate-700"
                >
                  Project Title
                </th>
                <th
                  class="bg-gray-100 dark:bg-slate-900 text-black dark:text-slate-100 font-semibold text-xs text-left p-3 border-b border-gray-200 dark:border-slate-700 hidden md:table-cell"
                >
                  Category
                </th>
                <th
                  class="bg-gray-100 dark:bg-slate-900 text-black dark:text-slate-100 font-semibold text-xs text-left p-3 border-b border-gray-200 dark:border-slate-700 hidden md:table-cell"
                >
                  Generation
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
              </thead>
              <tbody>
                <tr
                  v-for="project in paginatedProjects"
                  :key="project.id"
                  class="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900 last:border-b-0"
                >
                  <td class="p-3 text-slate-100 align-top text-xs">
                    <div class="flex items-center gap-3">
                      <img
                        :src="project.studentAvatar"
                        :alt="project.studentName"
                        class="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <div
                          class="font-semibold text-black dark:text-white text-xs"
                        >
                          {{ project.studentName }}
                        </div>
                        <div class="text-xs text-gray-600 dark:text-slate-400">
                          {{ project.studentEmail }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="p-3 text-slate-100 align-top text-xs">
                    <div
                      class="font-semibold text-black dark:text-white text-xs mb-1"
                    >
                      {{ project.title }}
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
                    {{ project.generation }}
                  </td>
                  <td class="p-3 text-slate-100 align-top text-xs">
                    <span
                      :class="
                        project.status === 'active'
                          ? 'bg-green-600 text-white'
                          : 'bg-yellow-600 text-white'
                      "
                      class="px-2 py-1 rounded text-xs font-semibold inline-block"
                    >
                      {{ project.status === "active" ? "Active" : "Pending" }}
                    </span>
                  </td>
                  <td
                    class="p-3 text-black dark:text-slate-100 align-top text-xs hidden md:table-cell"
                  >
                    {{ project.submittedDate }}
                  </td>
                  <td class="p-3 text-slate-100 align-top text-xs">
                    <div class="flex gap-2 flex-wrap">
                      <ButtonsPresetButton
                        v-if="project.status !== 'pending'"
                        preset="danger"
                        label="View"
                        icon="i-heroicons-eye"
                        size="xs"
                        @click="viewProject(project)"
                      />
                      <ButtonsPresetButton
                        v-if="project.status === 'pending'"
                        preset="danger"
                        label="Review"
                        icon="i-heroicons-check-circle"
                        size="xs"
                        @click="reviewProject(project)"
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
              <h3 class="text-white text-lg font-semibold mb-2">
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
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { projectsData } from "~/constants/projects";
import ButtonsPresetButton from "~/components/buttons/PresetButton.vue";

const authStore = useAuthStore();

// Get teacher info from auth store
const teacher = computed(() => ({
  name: authStore.currentUser?.name || "Teacher",
}));

// Transform projectsData to match teacher dashboard structure
const projects = computed(() => {
  return projectsData.map((project) => {
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
      "Fall 2024": "Generation 2024",
      "Spring 2025": "Generation 2025",
    };

    const mappedGeneration =
      generationMapping[project.semester] || "Generation 2024";

    // Map status
    const mappedStatus = project.status === "Completed" ? "active" : "pending";

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
      title: project.title,
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

// Stats for teacher dashboard
const stats = ref([
  {
    label: "Total Submissions",
    value: "124",
    icon: "i-heroicons-inbox-stack",
    change: "+12 this week",
    changeColor: "positive",
    chartData: [110, 92, 88, 95, 102, 98, 110, 68, 108, 120, 118, 124],
  },
  {
    label: "Pending Review",
    value: "18",
    icon: "i-heroicons-exclamation-circle",
    change: "3 overdue",
    changeColor: "negative",
    chartData: [20, 15, 14, 18, 16, 20, 22, 19, 17, 21, 19, 18],
  },
  {
    label: "Average Score",
    value: "78%",
    icon: "i-heroicons-chart-bar-square",
    change: "+5% from last semester",
    changeColor: "positive",
    chartData: [78, 72, 71, 73, 75, 74, 80, 77, 76, 78, 77, 78],
  },
]);

// Filter and search state
const activeFilter = ref("active");
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedGeneration = ref("");

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(8);

// Filtered projects computed property
const filteredProjects = computed(() => {
  let filtered = projects.value.filter((project) => {
    // Filter by active/pending status
    if (activeFilter.value !== "all" && project.status !== activeFilter.value) {
      return false;
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const matchesSearch =
        project.studentName.toLowerCase().includes(query) ||
        project.title.toLowerCase().includes(query) ||
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
        "gen-2024": "Generation 2024",
        "gen-2025": "Generation 2025",
        "gen-2026": "Generation 2026",
      };
      const expectedGeneration = generationMap[selectedGeneration.value];
      if (project.generation !== expectedGeneration) {
        return false;
      }
    }

    return true;
  });

  return filtered;
});

// Pagination computed properties
const totalFilteredProjects = computed(() => {
  return projects.value.filter((project) => {
    // Filter by active/pending status
    if (activeFilter.value !== "all" && project.status !== activeFilter.value) {
      return false;
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const matchesSearch =
        project.studentName.toLowerCase().includes(query) ||
        project.title.toLowerCase().includes(query) ||
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
        "gen-2024": "Generation 2024",
        "gen-2025": "Generation 2025",
        "gen-2026": "Generation 2026",
      };
      const expectedGeneration = generationMap[selectedGeneration.value];
      if (project.generation !== expectedGeneration) {
        return false;
      }
    }

    return true;
  }).length;
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
  currentPage.value = page;
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
  console.log("View project:", project);
};

const reviewProject = (project) => {
  // TODO: Implement review project functionality
  console.log("Review project:", project);
};
</script>
