<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <ScrollToTop />

    <!-- Header Section -->
    <div class="hero-nodes py-20 border-b border-blue-800/30 dark:border-slate-700">
      <UContainer>
        <div class="space-y-6">
          <div class="text-center space-y-4 max-w-2xl mx-auto">
            <h1 class="text-4xl lg:text-6xl font-semibold tracking-tight leading-tight text-blue-900 dark:text-white">
              Explore All Projects
            </h1>
            <p class="text-xl text-blue-900/80 dark:text-gray-300">
              Discover amazing projects built by GIC students across all
              semesters and categories
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap">
            <ButtonsPresetButton preset="createProject" @click="handleCreateProject" size="sm" />

            <ButtonsPresetButton preset="meetStudent" to="/students" size="sm" />
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Filters and Projects -->
    <!-- Sticky Top Bar -->
    <div
      class="sticky top-0 z-[200] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-slate-700">
      <UContainer>
        <div class="flex items-center justify-between w-full gap-4 py-3">
          <!-- Categories Pills -->
          <div class="flex-1">
            <div class="flex items-center justify-center gap-2 flex-wrap">
              <!-- Loading state -->
              <div v-if="isLoadingData && categories.length === 0" class="flex gap-2">
                <div class="h-10 w-20 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                <div class="h-10 w-24 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                <div class="h-10 w-28 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
              </div>

              <!-- Show actual categories when loaded -->
              <div v-else-if="isCategoriesLoaded" class="hidden md:flex flex-wrap gap-2 justify-center">
                <ButtonsPresetButton v-for="cat in categoryOptions" :key="cat.value" :label="cat.label" :color="selectedCategory?.value === cat.value
                  ? 'primary'
                  : 'secondary'
                  " :variant="selectedCategory?.value === cat.value ? 'solid' : 'ghost'
                    " size="sm" @click="selectedCategory = cat" />
              </div>

              <!-- Mobile Category Select -->
              <div v-if="isCategoriesLoaded" class="relative md:hidden w-full">
                <USelectMenu v-model="selectedCategory" size="sm" :items="categoryOptions" placeholder="Select category"
                  :ui="{
                    base: '!rounded-3xl !min-h-[44px] focus:!ring-2 focus:!ring-blue-800 focus:!border-blue-800 focus-visible:!ring-2 focus-visible:!ring-blue-800 focus-visible:!border-blue-800'
                  }" class="w-full" />
              </div>
            </div>
          </div>

          <!-- Filters Button -->
          <ButtonsPresetButton label="Filters" icon="i-heroicons-funnel" :color="showFilters ? 'primary' : 'secondary'"
            :variant="showFilters ? 'solid' : 'outline'" size="sm" @click="toggleFilters" />
        </div>

        <Transition enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 -translate-y-3" enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-3">
          <div v-if="showFilters"
            class="rounded-2xl p-6 border border-blue-200 dark:border-slate-700 bg-blue-50/30 dark:bg-slate-800/50 backdrop-blur-sm space-y-4 shadow-lg">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Category Search with Autocomplete -->
              <div class="relative">
                <p class="text-lg font-semibold mb-2 text-blue-900 dark:text-white">
                  Categories
                </p>
                <div class="relative">
                  <UInput v-model="categorySearchInput" placeholder="Type to search categories (e.g., AI, Web, Mobile)"
                    icon="i-heroicons-magnifying-glass"
                    :ui="{
                      base: '!rounded-3xl !min-h-[44px] focus:!ring-2 focus:!ring-blue-800 focus:!border-blue-800'
                    }" class="w-full"
                    size="sm" :loading="isSearching"
                    @focus="showCategorySuggestions = true" @keydown.escape="showCategorySuggestions = false" />

                  <!-- Category Suggestions Dropdown -->
                  <div v-if="
                    showCategorySuggestions && categorySuggestions.length > 0
                  "
                    class="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    <div v-for="suggestion in categorySuggestions" :key="suggestion.id"
                      @click="selectCategorySuggestion(suggestion)"
                      class="px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-100 dark:border-slate-700 last:border-b-0 transition-colors">
                      <div class="flex items-center justify-between">
                        <span class="font-medium text-blue-900 dark:text-white">{{ suggestion.label }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ suggestion.suffix }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Course Dropdown -->
              <div>
                <p class="text-lg font-semibold mb-2 text-blue-900 dark:text-white">
                  Course
                </p>
                <USelectMenu v-model="selectedCourse" size="sm" :items="courseOptions" searchable
                  searchable-placeholder="Type to search courses" placeholder="Select a course"
                  :ui="{
                    base: '!rounded-3xl !min-h-[44px] focus:!ring-2 focus:!ring-blue-800 focus:!border-blue-800 focus-visible:!ring-2 focus-visible:!ring-blue-800 focus-visible:!border-blue-800'
                  }" class="w-full" />
              </div>

              <!-- Gen Dropdown -->
              <div>
                <p class="text-lg font-semibold mb-2 text-blue-900 dark:text-white">
                  Generation
                </p>
                <USelectMenu v-model="selectedGen" size="sm" :items="genOptions" placeholder="Select generation"
                  :ui="{
                    base: '!rounded-3xl !min-h-[44px] focus:!ring-2 focus:!ring-blue-800 focus:!border-blue-800 focus-visible:!ring-2 focus-visible:!ring-blue-800 focus-visible:!border-blue-800'
                  }" class="w-full" />
              </div>
            </div>
          </div>
        </Transition>
      </UContainer>
    </div>

    <Transition enter-active-class="transition-all ease-out duration-700">
      <UContainer class="py-9">
        <!-- Error State -->
        <div v-if="dataFetchError" class="text-center py-20">
          <div
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto">
            <UIcon name="i-heroicons-exclamation-triangle"
              class="w-16 h-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-red-900 dark:text-red-200 mb-2">
              Failed to Load Projects
            </h3>
            <p class="text-red-700 dark:text-red-300 mb-4">
              {{ dataFetchError }}
            </p>
            <!-- <ButtonsPresetButton
              label="Try Again"
              icon="i-heroicons-arrow-path"
              @click="initializeData"
            /> -->
          </div>
        </div>

        <div v-else class="grid lg:grid-cols-4 gap-8 ">
          <!-- Projects Grid -->
          <div class="sm:col-span-4">
            <div class="space-y-6">
              <template v-if="isLoadingData">
                <div class="flex items-center justify-between flex-wrap gap-4">
                  <div class="h-6 w-56 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                  <div class="h-10 w-32 bg-gray-200 dark:bg-slate-700 rounded-3xl animate-pulse"></div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  <div v-for="n in 6" :key="`project-skeleton-${n}`"
                    class="rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 animate-pulse space-y-4">
                    <div class="h-48 rounded-2xl bg-gray-200 dark:bg-slate-700"></div>
                    <div class="h-5 w-3/4 rounded bg-gray-200 dark:bg-slate-700"></div>
                    <div class="h-4 w-full rounded bg-gray-200 dark:bg-slate-700"></div>
                    <div class="h-4 w-5/6 rounded bg-gray-200 dark:bg-slate-700"></div>
                    <div class="flex items-center justify-between pt-2">
                      <div class="h-8 w-24 rounded-full bg-gray-200 dark:bg-slate-700"></div>
                      <div class="h-9 w-28 rounded-3xl bg-gray-200 dark:bg-slate-700"></div>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else>
                <!-- Results and Active Filters -->
                <div class="flex items-center justify-between flex-wrap gap-4">
                  <!-- Results Count -->
                  <div class="flex items-center gap-4">
                    <p class="text-lg text-gray-700 dark:text-gray-300">
                      <template v-if="totalPages > 1">
                        Showing {{ paginatedProjects.length }} of
                      </template>
                      <span class="font-semibold text-blue-900 dark:text-white">{{
                        projectStore.pagination.totalItems
                        }}</span>
                      projects
                      <template v-if="totalPages > 1">
                        (Page {{ currentPage }} of {{ totalPages }})
                      </template>
                    </p>

                    Active Filters
                    <div v-if="hasActiveFilters" class="flex items-center gap-2">
                      <span class="text-md text-gray-500 dark:text-gray-400">•</span>
                      <div class="flex flex-wrap gap-1">
                        <UBadge v-if="selectedCategory" variant="soft" size="md"
                          class="flex items-center gap-1 text-blue-900">
                          {{ selectedCategory.label }}
                          <UButton @click="selectedCategory = null" color="primary" variant="ghost" size="xs"
                            icon="i-heroicons-x-mark" :padded="false" class="ml-1" />
                        </UBadge>
                        <UBadge v-if="categorySearch" color="primary" variant="soft" size="sm"
                          class="flex items-center gap-1">
                          Search: "{{ categorySearch }}"
                          <UButton @click="categorySearchInput = ''" color="primary" variant="ghost" size="xs"
                            :padded="false" class="ml-1" />
                        </UBadge>
                        <UBadge v-if="selectedCourse && selectedCourse.value" color="primary" variant="soft" size="sm"
                          class="flex items-center gap-1">
                          {{ selectedCourse.label }}
                          <UButton @click="
                            selectedCourse = courseOptions.find(
                              (c) => c.value === '',
                            )
                            " color="primary" variant="ghost" size="xs" icon="i-heroicons-x-mark" :padded="false"
                            class="ml-1" />
                        </UBadge>
                        <UBadge v-if="selectedGen && selectedGen.value" color="primary" variant="soft" size="sm"
                          class="flex items-center gap-1">
                          {{ selectedGen.label }}
                          <UButton @click="
                            selectedGen = genOptions.find((g) => g.value === '')
                            " color="primary" variant="ghost" size="xs" icon="i-heroicons-x-mark" :padded="false"
                            class="ml-1" />
                        </UBadge>
                      </div>
                    </div>
                  </div>

                  <!-- Clear All Filters Button -->
                  <ButtonsPresetButton v-if="hasActiveFilters" preset="clearFilters" size="sm" @click="clearFilters" />
                </div>

                <!-- Projects Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  <!-- just keep as public -->
                  <ProjectCard v-for="project in paginatedProjects" :key="project.id" :project="project"
                    :liked-projects="projectStore.likedProjects" :show-edit-button="false"
                    @toggle-like="toggleLike" />
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
                  <ButtonsPresetButton label="Previous" icon="i-heroicons-arrow-left" color="secondary"
                    variant="outline" size="sm" :disabled="currentPage === 1"
                    @click="currentPage = Math.max(1, currentPage - 1)" />

                  <span
                    class="px-4 py-2 text-sm font-medium text-blue-900 dark:text-white bg-blue-50 dark:bg-slate-800 rounded-lg">
                    Page {{ currentPage }} of {{ totalPages }}
                  </span>

                  <ButtonsPresetButton label="Next" icon="i-heroicons-arrow-right" color="primary" variant="solid"
                    size="sm" :disabled="currentPage === totalPages"
                    @click="currentPage = Math.min(totalPages, currentPage + 1)" />
                </div>

                <!-- Pagination Info -->
                <div v-if="projectStore.pagination.totalItems > 0" class="text-center mt-6">
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
                    {{
                      Math.min(
                        currentPage * itemsPerPage,
                        projectStore.pagination.totalItems,
                      )
                    }}
                    of {{ projectStore.pagination.totalItems }} projects
                  </p>
                </div>

                <!-- Empty State -->
                <div v-if="projectStore.pagination.totalItems === 0" class="text-center py-20">
                  <UIcon name="i-heroicons-inbox" class="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
                  <p class="text-gray-400 dark:text-gray-500 text-lg">
                    No projects found matching your filters
                  </p>
                </div>
              </template>
            </div>
          </div>
        </div>
      </UContainer>
    </Transition>

    <!-- Authentication Modal - Floating Overlay -->
    <Teleport to="body">
      <AuthModal v-model="showAuthModal" :context="authModalContext" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
  onBeforeMount,
} from "vue";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";

const projectStore = useProjectStore();
const authStore = useAuthStore();
const isLoadingData = ref(false);
const isLoadingCategories = ref(false);
const dataFetchError = ref<string | null>(null);
const isInitialized = ref(false);

// Initialize data before mount to ensure data is ready
const initializeData = async () => {
  // Prevent multiple simultaneous fetches
  if (isLoadingData.value) return;

  isLoadingData.value = true;
  dataFetchError.value = null;

  try {
    // Fetch categories FIRST (they're fast and needed for UI)
    if (projectStore.availableCategories.length === 0) {
      isLoadingCategories.value = true;
      await projectStore.fetchCategories();
      isLoadingCategories.value = false;
    }

    // Fetch courses for filter dropdown
    if (projectStore.availableCourses.length === 0) {
      await projectStore.fetchCourses();
    }

    // Then fetch tags and projects in parallel
    await Promise.all([
      projectStore.availableTags.length === 0
        ? projectStore.fetchTags()
        : Promise.resolve(),
      projectStore.fetchProjects(
        projectStore.pagination.currentPage,
        projectStore.pagination.itemsPerPage,
      ),
    ]);

    // Load user liked projects if authenticated
    if (authStore.isAuthenticated) {
      await projectStore.loadUserLikedProjects();
    }

    isInitialized.value = true;
  } catch (error) {
    console.error("Error fetching data:", error);
    dataFetchError.value =
      error instanceof Error ? error.message : "Failed to load projects";
    isLoadingCategories.value = false;
  } finally {
    isLoadingData.value = false;
  }
};

// Initialize on mounted (client-side)
onMounted(async () => {
  await initializeData();
});

// Store computed properties
const categories = computed(() => {
  const categoryObjs = projectStore.categoryObjects || [];
  // Map category objects to {label: name, value: id} format
  return categoryObjs.map((cat: any) => ({
    label: typeof cat === "string" ? cat : cat.name,
    value: typeof cat === "string" ? cat : cat.id,
  }));
});

const isCategoriesLoaded = computed(() => {
  return !isLoadingCategories.value && categories.value.length > 0;
});

const categoryOptions = computed(() => categories.value.slice(0, 6));
const projects = computed(() => {
  // Ensure we always return an array, even during loading
  return Array.isArray(projectStore.projects) ? projectStore.projects : [];
});

// Filter state - now using store
const showFilters = ref(false);
const isSearching = ref(false);
const showCategorySuggestions = ref(false);
const categorySearchInput = ref("");
const showAuthModal = ref(false);
const authModalContext = ref("like"); // 'like' or 'create'

// Handle create project click
const handleCreateProject = () => {
  if (!authStore.isAuthenticated) {
    authModalContext.value = "create";
    showAuthModal.value = true;
    return;
  }

  // If authenticated, navigate to create page
  navigateTo("/projects/create");
};

// Debug function for filter toggle
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
  console.log("Filters toggled:", showFilters.value);
};

// Store filter state as computed properties
const selectedCategory = computed({
  get: () => {
    const categoryId = projectStore.filters.categoryId;
    if (!categoryId) return null;
    // Find category by ID
    return (
      categoryOptions.value.find((cat) => cat.value === categoryId) || null
    );
  },
  set: (selectedOption) => {
    // Set categoryId from selected option (value is already the ID)
    const categoryId = selectedOption?.value || "";
    projectStore.setFilter("categoryId", categoryId);
  },
});

const categorySearch = computed({
  get: () => projectStore.filters.search,
  set: (value) => projectStore.setFilter("search", value),
});

const selectedCourse = computed({
  get: () => {
    const courseId = projectStore.filters.courseId;
    if (!courseId) return courseOptions.value[0]; // Return "All Courses" when empty
    return (
      courseOptions.value.find((course) => course.value === courseId) ||
      courseOptions.value[0]
    );
  },
  set: (selectedOption) => {
    const value = selectedOption?.value || "";
    projectStore.setFilter("courseId", value);
  },
});

const selectedGen = computed({
  get: () => {
    const genValue = projectStore.filters.gen;
    if (!genValue) return genOptions.value[0]; // Return "All Generations" when empty
    return (
      genOptions.value.find((gen) => gen.value === genValue) ||
      genOptions.value[0]
    );
  },
  set: (selectedOption) => {
    const value = selectedOption?.value || "";
    projectStore.setFilter("gen", value);
  },
});

const isAscending = computed({
  get: () => projectStore.filters.ascending,
  set: (value) => projectStore.setFilter("ascending", value),
});

// Course options for filtering
const courseOptions = computed(() => {
  const courses = projectStore.availableCourses || [];
  const allOption = [{ label: "All Courses", value: "" }];
  const mappedCourses = courses.map((course) => ({
    label: `${course.name} (${course.code})`,
    value: course.id,
  }));
  return [...allOption, ...mappedCourses];
});

// Generation options for filtering
const genOptions = computed(() => [
  { label: "All Generations", value: "" },
  { label: "Gen 27", value: "27" },
  { label: "Gen 26", value: "26" },
  { label: "Gen 25", value: "25" },
  { label: "Gen 24", value: "24" },
  { label: "Gen 23", value: "23" },
]);

// Pagination state
const currentPage = computed({
  get: () => projectStore.pagination.currentPage,
  set: (value) => projectStore.setCurrentPage(value),
});
const itemsPerPage = computed(() => projectStore.pagination.itemsPerPage);

// Watch for page changes and fetch new data
watch(currentPage, async (newPage, oldPage) => {
  if (newPage !== oldPage) {
    await projectStore.fetchProjects(newPage, itemsPerPage.value);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// Debounced search functionality
let searchTimeout = null;

// Watch for filter changes and refetch from API
watch(
  () => projectStore.filters,
  async () => {
    // Reset to page 1 when filters change
    projectStore.setCurrentPage(1);
    await projectStore.fetchProjects(1, itemsPerPage.value);
  },
  { deep: true },
);

watch(categorySearchInput, (newValue) => {
  // Show suggestions when user types
  if (newValue.trim()) {
    showCategorySuggestions.value = true;
  } else {
    showCategorySuggestions.value = false;
  }
});

// Autocomplete suggestions
const categorySuggestions = computed(() => {
  if (!categorySearchInput.value.trim()) return [];

  const input = categorySearchInput.value.toLowerCase();
  // Use all available categories from the store, not just from current projects
  const allCategories = projectStore.availableCategories || [];

  return allCategories
    .filter((category) => category.toLowerCase().includes(input))
    .map((category) => {
      // Count projects in current view that match this category
      const count = projects.value.filter(
        (p) => p.category === category,
      ).length;
      return {
        id: category,
        label: category,
        suffix: count > 0 ? `${count} projects` : "Filter by this",
      };
    })
    .slice(0, 10); // Show up to 10 category suggestions
});

// Category suggestion methods
const selectCategorySuggestion = (suggestion) => {
  // Find the category ID by name
  const categoryId = projectStore.getCategoryIdByName(suggestion.label);

  if (categoryId) {
    // Set the category filter using ID
    projectStore.setFilter("categoryId", categoryId);
  }

  // Clear the search input
  categorySearchInput.value = "";
  showCategorySuggestions.value = false;
};

// Hide suggestions when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest(".category-search-container")) {
    showCategorySuggestions.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Computed properties using store - use projects directly since API handles pagination
const filteredProjects = computed(() => {
  // For displaying total count, use pagination.totalItems from API response
  return projectStore.projects;
});

// Validate and sanitize project data before rendering
const isValidProject = (project: any): boolean => {
  return !!(
    project &&
    project.id &&
    project.name &&
    project.description &&
    project.category &&
    typeof project.likes === "number" &&
    typeof project.views === "number" &&
    (project.images || project.emoji || project.gradient)
  );
};

// Use projects directly from store - API already returns paginated data
const paginatedProjects = computed(() => {
  // Filter out any invalid projects
  return projectStore.projects.filter(isValidProject);
});

const totalPages = computed(() => projectStore.pagination.totalPages);

const hasActiveFilters = computed(() => {
  const filters = projectStore.filters;
  return (
    filters.categoryId ||
    filters.search.trim() ||
    filters.courseId ||
    filters.gen ||
    filters.ascending !== true // Include if not default ascending
  );
});

// Filter management
const clearFilters = () => {
  // Clear store filters
  projectStore.clearFilters();

  // Reset ascending to default
  projectStore.setFilter("ascending", true);

  // Reset local UI states to defaults
  categorySearchInput.value = "";
  showCategorySuggestions.value = false;
  isSearching.value = false;

  // Clear search timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Reset pagination to first page
  projectStore.setCurrentPage(1);
};

// Like functionality - using store with authentication

const toggleLike = async (projectId) => {
  if (!authStore.isAuthenticated) {
    // Show authentication modal for like action
    authModalContext.value = "like";
    showAuthModal.value = true;
    return;
  }

  await projectStore.likeProject(projectId);
  await projectStore.loadUserLikedProjects();
};

// Helper to check if a project is liked
const isProjectLiked = (projectId) => {
  return projectStore.isProjectLiked(projectId);
};

useHead({
  title: "Projects - GIC Showcase",
  meta: [
    {
      name: "description",
      content: "Browse all student projects from GIC program",
    },
  ],
});
</script>
