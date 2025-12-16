<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <!-- Header Section -->
    <div
      class="hero-nodes py-20 border-b border-blue-800/30 dark:border-slate-700"
    >
      <UContainer>
        <div class="space-y-6">
          <div class="text-center space-y-4 max-w-2xl mx-auto">
            <h1
              class="text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-blue-900 dark:text-white"
            >
              Explore All Projects
            </h1>
            <p class="text-xl text-blue-900/80 dark:text-gray-300">
              Discover amazing projects built by GIC students across all
              semesters and categories
            </p>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap"
          >
            <ButtonsPresetButton
              preset="createProject"
              @click="handleCreateProject"
              size="md"
            />

            <ButtonsPresetButton
              preset="meetStudent"
              to="/students"
              size="md"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Filters and Projects -->
    <!-- Sticky Top Bar -->
    <div
      class="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-slate-700"
    >
      <UContainer>
        <div class="flex items-center justify-between w-full gap-2 py-4">
          <!-- Sort Dropdown -->
          <div class="relative">
            <USelectMenu
              v-model="selectedSort"
              size="xl"
              :items="sortOptions"
              class="w-35 rounded-xl"
            />
          </div>

          <!-- Categories Pills -->
          <div class="flex-1">
            <div class="flex items-center justify-center gap-1 flex-wrap">
              <!-- Show loading state or actual categories -->
              <div
                v-if="categories.length > 1"
                class="hidden md:flex flex-wrap gap-2 justify-center"
              >
                <ButtonsPresetButton
                  v-for="cat in categoryOptions"
                  :key="cat.value"
                  :label="cat.label"
                  :color="
                    selectedCategory?.value === cat.value
                      ? 'primary'
                      : 'secondary'
                  "
                  :variant="
                    selectedCategory?.value === cat.value ? 'solid' : 'ghost'
                  "
                  size="md"
                  @click="selectedCategory = cat"
                />
              </div>

              <!-- Mobile Category Select -->
              <div
                v-if="categories.length > 1"
                class="relative md:hidden w-full"
              >
                <USelectMenu
                  v-model="selectedCategory"
                  size="xl"
                  :items="categoryOptions"
                  placeholder="Select category"
                  class="w-full rounded-xl"
                />
              </div>
            </div>
          </div>

          <!-- Filters Button -->
          <ButtonsPresetButton
            label="Filters"
            icon="i-heroicons-funnel"
            :color="showFilters ? 'primary' : 'secondary'"
            :variant="showFilters ? 'solid' : 'outline'"
            size="md"
            @click="toggleFilters"
          />
        </div>

        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 -translate-y-3"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-3"
        >
          <div
            v-if="showFilters"
            class="rounded-2xl p-6 border border-blue-200 dark:border-slate-700 bg-blue-50/30 dark:bg-slate-800/50 backdrop-blur-sm space-y-4 shadow-lg"
          >
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Category Search with Autocomplete -->
              <div class="relative">
                <p
                  class="text-lg font-semibold mb-2 text-blue-900 dark:text-white"
                >
                  Categories
                </p>
                <div class="relative">
                  <UInput
                    v-model="categorySearchInput"
                    placeholder="Type to search categories (e.g., AI, Web, Mobile)"
                    icon="i-heroicons-magnifying-glass"
                    class="w-full rounded-xl"
                    size="xl"
                    :loading="isSearching"
                    @focus="showCategorySuggestions = true"
                    @keydown.escape="showCategorySuggestions = false"
                  />

                  <!-- Category Suggestions Dropdown -->
                  <div
                    v-if="
                      showCategorySuggestions && categorySuggestions.length > 0
                    "
                    class="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                  >
                    <div
                      v-for="suggestion in categorySuggestions"
                      :key="suggestion.id"
                      @click="selectCategorySuggestion(suggestion)"
                      class="px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-100 dark:border-slate-700 last:border-b-0 transition-colors"
                    >
                      <div class="flex items-center justify-between">
                        <span
                          class="font-medium text-blue-900 dark:text-white"
                          >{{ suggestion.label }}</span
                        >
                        <span
                          class="text-xs text-gray-500 dark:text-gray-400"
                          >{{ suggestion.suffix }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Enhanced Tags Dropdown -->
              <div>
                <p
                  class="text-lg font-semibold mb-2 text-blue-900 dark:text-white"
                >
                  Tags
                </p>
                <USelectMenu
                  v-model="selectedTags"
                  size="xl"
                  :items="filteredTags"
                  multiple
                  searchable
                  searchable-placeholder="Type to search tags (e.g., AI, Soft, Web)"
                  placeholder="Click to select tags"
                  class="w-full rounded-xl"
                  :search-attributes="['label', 'value']"
                />
              </div>

              <!-- Years Dropdown -->
              <div>
                <p
                  class="text-lg font-semibold mb-2 text-blue-900 dark:text-white"
                >
                  Academic Years
                </p>
                <USelectMenu
                  v-model="selectedYear"
                  size="xl"
                  :items="years"
                  placeholder="Click to select year"
                  class="w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </Transition>
      </UContainer>
    </div>

    <Transition enter-active-class="transition-all ease-out duration-700">
      <UContainer
        class="py-9 bg-gradient-to-b via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      >
        <div class="grid lg:grid-cols-4 gap-8">
          <!-- Projects Grid -->
          <div class="sm:col-span-4">
            <div class="space-y-6">
              <!-- Filters -->

              <!-- Results and Active Filters -->
              <div class="flex items-center justify-between flex-wrap gap-4">
                <!-- Results Count -->
                <div class="flex items-center gap-4">
                  <p class="text-lg text-gray-700 dark:text-gray-300">
                    <template v-if="totalPages > 1">
                      Showing {{ paginatedProjects.length }} of
                    </template>
                    <span class="font-bold text-blue-900 dark:text-white">{{
                      filteredProjects.length
                    }}</span>
                    projects
                    <template v-if="totalPages > 1">
                      (Page {{ currentPage }} of {{ totalPages }})
                    </template>
                  </p>

                  Active Filters
                  <div v-if="hasActiveFilters" class="flex items-center gap-2">
                    <span class="text-md text-gray-500 dark:text-gray-400"
                      >•</span
                    >
                    <div class="flex flex-wrap gap-1">
                      <UBadge
                        v-if="
                          selectedCategory && selectedCategory.value !== 'All'
                        "
                        variant="soft"
                        size="md"
                        class="flex items-center gap-1 text-blue-900"
                      >
                        {{ selectedCategory.label }}
                        <UButton
                          @click="
                            selectedCategory = categoryOptions.find(
                              (c) => c.value === 'All'
                            )
                          "
                          color="primary"
                          variant="ghost"
                          size="xs"
                          :padded="false"
                          class="ml-1"
                        />
                      </UBadge>
                      <UBadge
                        v-if="categorySearch"
                        color="primary"
                        variant="soft"
                        size="sm"
                        class="flex items-center gap-1"
                      >
                        Search: "{{ categorySearch }}"
                        <UButton
                          @click="categorySearchInput = ''"
                          color="primary"
                          variant="ghost"
                          size="xs"
                          :padded="false"
                          class="ml-1"
                        />
                      </UBadge>
                      <UBadge
                        v-for="tag in selectedTags"
                        :key="tag.value"
                        color="primary"
                        variant="soft"
                        size="sm"
                        class="flex items-center gap-1"
                      >
                        {{ tag.label }}
                        <UButton
                          @click="
                            selectedTags = selectedTags.filter(
                              (t) => t.value !== tag.value
                            )
                          "
                          color="primary"
                          variant="ghost"
                          size="xs"
                          :padded="false"
                          class="ml-1"
                        />
                      </UBadge>
                      <UBadge
                        v-if="selectedYear && selectedYear.value"
                        color="primary"
                        variant="soft"
                        size="sm"
                        class="flex items-center gap-1"
                      >
                        {{ selectedYear.label }}
                        <UButton
                          @click="
                            selectedYear = years.find((y) => y.value === '')
                          "
                          color="primary"
                          variant="ghost"
                          size="xs"
                          icon="i-heroicons-x-mark"
                          :padded="false"
                          class="ml-1"
                        />
                      </UBadge>
                      <UBadge
                        v-if="selectedSort && selectedSort.value !== 'recent'"
                        color="primary"
                        variant="soft"
                        size="sm"
                        class="flex items-center gap-1"
                      >
                        Sort: {{ selectedSort.label }}
                        <UButton
                          @click="
                            selectedSort = sortOptions.find(
                              (s) => s.value === 'recent'
                            )
                          "
                          color="primary"
                          variant="ghost"
                          size="xs"
                          icon="i-heroicons-x-mark"
                          :padded="false"
                          class="ml-1"
                        />
                      </UBadge>
                    </div>
                  </div>
                </div>

                <!-- Clear All Filters Button -->
                <ButtonsPresetButton
                  v-if="hasActiveFilters"
                  preset="clearFilters"
                  @click="clearFilters"
                />
              </div>

              <!-- Projects Cards -->
              <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                <ProjectCard
                  v-for="project in paginatedProjects"
                  :key="project.id"
                  :project="project"
                  :liked-projects="projectStore.likedProjects"
                  @toggle-like="toggleLike"
                />
              </div>

              <!-- Pagination -->
              <div
                v-if="totalPages > 1"
                class="flex justify-center items-center gap-4 mt-8"
              >
                <ButtonsPresetButton
                  label="Previous"
                  icon="i-heroicons-arrow-left"
                  color="secondary"
                  variant="outline"
                  size="md"
                  :disabled="currentPage === 1"
                  @click="currentPage = Math.max(1, currentPage - 1)"
                />

                <span
                  class="px-4 py-2 text-sm font-medium text-blue-900 dark:text-white bg-blue-50 dark:bg-slate-800 rounded-lg"
                >
                  Page {{ currentPage }} of {{ totalPages }}
                </span>

                <ButtonsPresetButton
                  label="Next"
                  icon="i-heroicons-arrow-right"
                  color="primary"
                  variant="solid"
                  size="md"
                  :disabled="currentPage === totalPages"
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                />
              </div>

              <!-- Pagination Info -->
              <div v-if="filteredProjects.length > 0" class="text-center mt-6">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
                  {{
                    Math.min(
                      currentPage * itemsPerPage,
                      filteredProjects.length
                    )
                  }}
                  of {{ filteredProjects.length }} projects
                </p>
              </div>

              <!-- Empty State -->
              <div
                v-if="filteredProjects.length === 0"
                class="text-center py-20"
              >
                <UIcon
                  name="i-heroicons-inbox"
                  class="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4"
                />
                <p class="text-gray-400 dark:text-gray-500 text-lg">
                  No projects found matching your filters
                </p>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </Transition>

    <!-- Authentication Modal - Floating Overlay -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="showAuthModal"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          @click.self="showAuthModal = false"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

          <!-- Modal Content -->
          <div class="relative w-full max-w-md transform">
            <div
              class="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              <!-- Header -->
              <div class="bg-gradient-to-r from-blue-800 to-blue-900 px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-lock-closed"
                      class="w-4 h-4 text-white"
                    />
                  </div>
                  <h3 class="text-xl font-bold text-white">
                    {{
                      authModalContext === "create"
                        ? "🚀 Ready to Create?"
                        : "🔒 Login Required"
                    }}
                  </h3>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6 space-y-4">
                <div v-if="authModalContext === 'create'">
                  <p class="text-gray-700 text-lg leading-relaxed">
                    Ready to share your amazing project with the world? Let's
                    get you logged in first! ✨
                  </p>

                  <div
                    class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg"
                  >
                    <div class="flex items-center gap-2 mb-3">
                      <UIcon
                        name="i-heroicons-sparkles"
                        class="w-5 h-5 text-blue-900"
                      />
                      <span class="font-semibold text-blue-800"
                        >Why create a project?</span
                      >
                    </div>
                    <ul class="text-blue-900 space-y-2">
                      <li class="flex items-center gap-2">
                        <span
                          class="w-1.5 h-1.5 bg-blue-500 rounded-full"
                        ></span>
                        Showcase your skills to the GIC community
                      </li>
                      <li class="flex items-center gap-2">
                        <span
                          class="w-1.5 h-1.5 bg-blue-500 rounded-full"
                        ></span>
                        Get feedback and collaborate with peers
                      </li>
                      <li class="flex items-center gap-2">
                        <span
                          class="w-1.5 h-1.5 bg-blue-500 rounded-full"
                        ></span>
                        Build your portfolio and track your progress
                      </li>
                    </ul>
                  </div>
                </div>

                <div v-else>
                  <p class="text-gray-700 text-lg leading-relaxed">
                    You need to be logged in to like projects and interact with
                    the community. ❤️
                  </p>

                  <div
                    class="flex items-center gap-3 bg-red-50 p-4 rounded-lg border border-red-200"
                  >
                    <UIcon
                      name="i-heroicons-heart"
                      class="w-6 h-6 text-red-500 flex-shrink-0"
                    />
                    <span class="text-red-700">
                      Join the GIC community to like and support amazing
                      projects!
                    </span>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  @click="showAuthModal = false"
                  class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Maybe Later
                </button>
                <ButtonsPresetButton
                  preset="signin"
                  size="md"
                  @click="
                    () => {
                      showAuthModal = false;
                      navigateTo('/login');
                    }
                  "
                >
                  <span>{{
                    authModalContext === "create"
                      ? "Login to Create"
                      : "Login Now"
                  }}</span>
                  <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
                </ButtonsPresetButton>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useProjectStore } from "~/stores/projects";

const projectStore = useProjectStore();

// Initialize data on component mount
onMounted(async () => {
  if (projectStore.projects.length === 0) {
    try {
      await Promise.all([
        projectStore.fetchCategories(),
        projectStore.fetchTags(),
        projectStore.fetchProjects(),
        projectStore.loadUserLikedProjects(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
});

// Store computed properties
const categories = computed(() => {
  const cats = projectStore.availableCategories || ["All"];
  return cats.map((cat) => ({ label: cat, value: cat }));
});

const categoryOptions = computed(() => categories.value.slice(0, 6));
const projects = computed(() => projectStore.projects || []);

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
    const cats = projectStore.filters.categories;
    const value = cats.includes("All") ? "All" : cats[0] || "All";
    return (
      categoryOptions.value.find((cat) => cat.value === value) ||
      categoryOptions.value[0]
    );
  },
  set: (selectedOption) => {
    const value = selectedOption?.value || selectedOption;
    const newCategories = value === "All" ? ["All"] : [value];
    projectStore.setFilter("categories", newCategories);
  },
});

const categorySearch = computed({
  get: () => projectStore.filters.search,
  set: (value) => projectStore.setFilter("search", value),
});

const selectedTags = computed({
  get: () => {
    const tagValues = projectStore.filters.tags;
    const availableTags = tags.value || [];
    // Convert string values back to objects for USelectMenu
    return tagValues
      .map(
        (tagValue) =>
          availableTags.find((tag) => tag.value === tagValue) || {
            label: tagValue,
            value: tagValue,
          }
      )
      .filter(Boolean);
  },
  set: (selectedOptions) => {
    // Convert objects to string values for store
    const tagValues = selectedOptions
      .map((option) => option?.value || option)
      .filter(Boolean);
    projectStore.setFilter("tags", tagValues);
  },
});

const selectedYear = computed({
  get: () => {
    const yearValue = projectStore.filters.year;
    return (
      years.value.find((year) => year.value === yearValue) || years.value[0]
    );
  },
  set: (selectedOption) => {
    const value = selectedOption?.value || selectedOption || "";
    projectStore.setFilter("year", value);
  },
});

// Sort dropdown items
const sortOptions = ref([
  {
    label: "Recently",
    value: "recent",
    icon: "i-heroicons-clock",
  },
  {
    label: "Oldest",
    value: "oldest",
    icon: "i-heroicons-calendar",
  },
  {
    label: "Most Liked",
    value: "liked",
    icon: "i-heroicons-heart",
  },
  {
    label: "Most Viewed",
    value: "viewed",
    icon: "i-heroicons-eye",
  },
]);

const selectedSort = computed({
  get: () => {
    const currentSort = projectStore.filters.sort || "recent";
    return (
      sortOptions.value.find((option) => option.value === currentSort) ||
      sortOptions.value[0]
    );
  },
  set: (selectedOption) => {
    const sortValue = selectedOption?.value || selectedOption || "recent";
    projectStore.setFilter("sort", sortValue);
  },
});

// Years options for filtering
const years = computed(() => [
  { label: "All Years", value: "" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
  { label: "2021", value: "2021" },
]);

// Pagination state
const currentPage = computed({
  get: () => projectStore.pagination.currentPage,
  set: (value) => projectStore.setCurrentPage(value),
});
const itemsPerPage = computed(() => projectStore.pagination.itemsPerPage);

// Debounced search functionality
let searchTimeout = null;

// Watch for sort changes to apply sorting
watch(
  () => selectedSort.value,
  (newSort) => {
    if (newSort?.value) {
      projectStore.setFilter("sort", newSort.value);
    }
  },
  { immediate: true }
);

watch(categorySearchInput, (newValue) => {
  isSearching.value = true;

  // Show suggestions when user types
  if (newValue.trim()) {
    showCategorySuggestions.value = true;
  }

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    categorySearch.value = newValue;
    isSearching.value = false;
  }, 2000);
});

// Filter options from store
const tags = computed(() => projectStore.availableTags || []);

// Autocomplete suggestions
const categorySuggestions = computed(() => {
  if (!categorySearchInput.value.trim()) return [];

  const input = categorySearchInput.value.toLowerCase();
  const allCategories = [...new Set(projects.value.map((p) => p.category))];

  return allCategories
    .filter((category) => category.toLowerCase().includes(input))
    .map((category) => ({
      id: category,
      label: category,
      suffix:
        projects.value.filter((p) => p.category === category).length +
        " projects",
    }))
    .slice(0, 5);
});

const filteredTags = computed(() => {
  const selectedTagObjects = selectedTags.value;
  const selectedValues = selectedTagObjects.map((tag) => tag.value);
  const availableTags = tags.value || [];
  return availableTags.filter((tag) => !selectedValues.includes(tag.value));
});

// Category suggestion methods
const selectCategorySuggestion = (suggestion) => {
  categorySearchInput.value = suggestion.label;
  categorySearch.value = suggestion.label;
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

// Computed properties using store methods
const filteredProjects = computed(() => projectStore.getFilteredProjects());

const paginatedProjects = computed(() =>
  projectStore.getPaginatedFilteredProjects()
);

const totalPages = computed(() => projectStore.pagination.totalPages);

const hasActiveFilters = computed(() => {
  const filters = projectStore.filters;
  return (
    (filters.categories &&
      !filters.categories.includes("All") &&
      filters.categories.length > 0) ||
    filters.search.trim() ||
    filters.tags.length > 0 ||
    filters.year ||
    (filters.sort && filters.sort !== "recent") // Include non-default sort
  );
});

// Filter management
const clearFilters = () => {
  // Clear store filters
  projectStore.clearFilters();

  // Reset sort to default
  projectStore.setFilter("sort", "recent");

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

const authStore = useAuthStore();

const toggleLike = async (projectId) => {
  if (!authStore.isAuthenticated) {
    // Show authentication modal for like action
    authModalContext.value = "like";
    showAuthModal.value = true;
    return;
  }

  await projectStore.likeProject(projectId);
  await projectStore.saveUserLikedProjects();
};

// Helper to check if a project is liked
const isProjectLiked = (projectId) => {
  return projectStore.isProjectLiked(projectId);
};

useHead({
  title: "Projects - GIC Student Portal",
  meta: [
    {
      name: "description",
      content: "Browse all student projects from GIC program",
    },
  ],
});
</script>
