<template>
  <div class="min-h-screen bg-white">
    <!-- Header Section -->
    <div class="hero-nodes py-20 border-b border-blue-800/30">
      <UContainer>
        <div class="space-y-6">
          <div class="text-center space-y-4 max-w-2xl mx-auto">
            <h1
              class="text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-blue-900"
            >
              Explore All Projects
            </h1>
            <p class="text-xl text-blue-900/80">
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
              to="/projects/create"
              size="md"
            />

            <ButtonsPresetButton
              preset="viewBySemester"
              to="/projects/semester"
              size="md"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Filters and Projects -->
    <!-- Sticky Top Bar -->
    <div
      class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200"
    >
      <UContainer>
        <div class="flex items-center justify-between w-full gap-2 py-4">
          <!-- Sort Dropdown -->
          <div class="relative">
            <select
              v-model="selectedSort"
              class="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="recent">Recently</option>
              <option value="oldest">Oldest</option>
              <option value="liked">Most Liked</option>
              <option value="viewed">Most Viewed</option>
            </select>
            <UIcon
              name="i-heroicons-chevron-down"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
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
                  v-for="cat in categories.slice(0, 6)"
                  :key="cat"
                  :label="cat"
                  :color="selectedCategory === cat ? 'primary' : 'secondary'"
                  :variant="selectedCategory === cat ? 'solid' : 'ghost'"
                  size="md"
                  @click="selectedCategory = cat"
                />
              </div>

              <!-- use manual select menu instead -->
              <div
                v-if="categories.length > 1"
                class="relative md:hidden w-full"
              >
                <select
                  v-model="selectedCategory"
                  class="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                >
                  <option
                    v-for="cat in categories.slice(0, 6)"
                    :key="cat"
                    :value="cat"
                  >
                    {{ cat }}
                  </option>
                </select>
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                />
              </div>

              <template v-else>
                <div class="flex gap-1 animate-pulse gap-6">
                  <div class="h-8 w-16 bg-gray-200 rounded-lg"></div>
                  <div class="h-8 w-20 bg-gray-200 rounded-lg"></div>
                  <div class="h-8 w-18 bg-gray-200 rounded-lg"></div>
                  <div class="h-8 w-18 bg-gray-200 rounded-lg"></div>
                  <div class="h-8 w-18 bg-gray-200 rounded-lg"></div>
                  <div class="h-8 w-18 bg-gray-200 rounded-lg"></div>
                  <div class="h-8 w-18 bg-gray-200 rounded-lg"></div>
                </div>
              </template>
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
      </UContainer>
    </div>

    <UContainer
      class="py-9 bg-gradient-to-b via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Projects Grid -->
        <div class="sm:col-span-4">
          <div class="space-y-6">
            <!-- Filters -->
            <div
              v-if="showFilters"
              class="rounded-2xl p-6 border border-blue-200 bg-blue-50/30 backdrop-blur-sm space-y-4 shadow-lg"
            >
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Category Search with Autocomplete -->
                <div class="relative">
                  <p class="text-lg font-semibold mb-2 text-blue-900">
                    Categories
                  </p>
                  <div class="relative">
                    <UInput
                      v-model="categorySearchInput"
                      placeholder="Type to search categories (e.g., AI, Web, Mobile)"
                      icon="i-heroicons-magnifying-glass"
                      class="w-full"
                      :loading="isSearching"
                      @focus="showCategorySuggestions = true"
                      @keydown.escape="showCategorySuggestions = false"
                    />

                    <!-- Category Suggestions Dropdown -->
                    <div
                      v-if="
                        showCategorySuggestions &&
                        categorySuggestions.length > 0
                      "
                      class="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                    >
                      <div
                        v-for="suggestion in categorySuggestions"
                        :key="suggestion.id"
                        @click="selectCategorySuggestion(suggestion)"
                        class="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div class="flex items-center justify-between">
                          <span class="font-medium text-blue-900">{{
                            suggestion.label
                          }}</span>
                          <span class="text-xs text-gray-500">{{
                            suggestion.suffix
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Tags Dropdown -->
                <div>
                  <p class="text-lg font-semibold mb-2 text-blue-900">Tags</p>
                  <USelectMenu
                    v-model="selectedTags"
                    :options="filteredTags"
                    size="md"
                    multiple
                    searchable
                    searchable-placeholder="Type to search tags (e.g., AI, Soft, Web)"
                    placeholder="Click to select tags"
                    class="w-full"
                    :search-attributes="['label', 'value']"
                  >
                    <template #label>
                      <span
                        v-if="selectedTags.length === 0"
                        class="text-gray-500"
                      >
                        Click to select tags
                      </span>
                      <span v-else class="flex items-center gap-1">
                        <UBadge
                          v-for="tag in selectedTags.slice(0, 2)"
                          :key="tag"
                          size="xs"
                          color="blue"
                          variant="soft"
                        >
                          {{ tags.find((t) => t.value === tag)?.label || tag }}
                        </UBadge>
                        <span
                          v-if="selectedTags.length > 2"
                          class="text-xs text-gray-500"
                        >
                          +{{ selectedTags.length - 2 }} more
                        </span>
                      </span>
                    </template>

                    <template #option="{ option }">
                      <div class="flex items-center justify-between w-full">
                        <span class="font-medium">{{ option.label }}</span>
                        <span
                          class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                        >
                          {{ option.value }}
                        </span>
                      </div>
                    </template>
                  </USelectMenu>
                </div>

                <!-- Years Dropdown -->
                <div>
                  <p class="text-lg font-semibold mb-2 text-blue-900">
                    Academic Years
                  </p>
                  <USelectMenu
                    v-model="selectedYear"
                    :options="years"
                    size="md"
                    placeholder="Click to select year"
                    class="w-full"
                  >
                    <template #label>
                      <span v-if="!selectedYear" class="text-gray-500">
                        Click to select year
                      </span>
                      <span v-else class="flex items-center gap-2">
                        <UIcon
                          name="i-heroicons-calendar-days"
                          class="w-4 h-4 text-blue-600"
                        />
                        {{
                          years.find((y) => y.value === selectedYear)?.label ||
                          selectedYear
                        }}
                      </span>
                    </template>
                  </USelectMenu>
                </div>
              </div>
            </div>

            <!-- Results and Active Filters -->
            <div class="flex items-center justify-between flex-wrap gap-4">
              <!-- Results Count -->
              <div class="flex items-center gap-4">
                <p class="text-lg text-gray-700">
                  <template v-if="totalPages > 1">
                    Showing {{ paginatedProjects.length }} of
                  </template>
                  <span class="font-bold text-blue-900">{{
                    filteredProjects.length
                  }}</span>
                  projects
                  <template v-if="totalPages > 1">
                    (Page {{ currentPage }} of {{ totalPages }})
                  </template>
                </p>

                <!-- Active Filters -->
                <div v-if="hasActiveFilters" class="flex items-center gap-2">
                  <span class="text-md text-gray-500">•</span>
                  <div class="flex flex-wrap gap-1">
                    <UBadge
                      v-if="selectedCategory && selectedCategory !== 'All'"
                      color="blue"
                      variant="soft"
                      size="md"
                      class="flex items-center gap-1"
                    >
                      {{ selectedCategory }}
                      <UButton
                        @click="selectedCategory = 'All'"
                        color="blue"
                        variant="ghost"
                        size="2xs"
                        icon="i-heroicons-x-mark"
                        :padded="false"
                        class="ml-1"
                      />
                    </UBadge>
                    <UBadge
                      v-if="categorySearch"
                      color="blue"
                      variant="soft"
                      size="sm"
                      class="flex items-center gap-1"
                    >
                      Search: "{{ categorySearch }}"
                      <UButton
                        @click="categorySearchInput = ''"
                        color="blue"
                        variant="ghost"
                        size="2xs"
                        icon="i-heroicons-x-mark"
                        :padded="false"
                        class="ml-1"
                      />
                    </UBadge>
                    <UBadge
                      v-for="tag in selectedTags"
                      :key="tag"
                      color="blue"
                      variant="soft"
                      size="sm"
                      class="flex items-center gap-1"
                    >
                      {{ tag }}
                      <UButton
                        @click="
                          selectedTags = selectedTags.filter((t) => t !== tag)
                        "
                        color="blue"
                        variant="ghost"
                        size="2xs"
                        icon="i-heroicons-x-mark"
                        :padded="false"
                        class="ml-1"
                      />
                    </UBadge>
                    <UBadge
                      v-if="selectedYear"
                      color="blue"
                      variant="soft"
                      size="sm"
                      class="flex items-center gap-1"
                    >
                      {{ selectedYear }}
                      <UButton
                        @click="selectedYear = ''"
                        color="blue"
                        variant="ghost"
                        size="2xs"
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
                color="gray"
                variant="outline"
                size="md"
                :disabled="currentPage === 1"
                @click="currentPage = Math.max(1, currentPage - 1)"
              />

              <span
                class="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-50 rounded-lg"
              >
                Page {{ currentPage }} of {{ totalPages }}
              </span>

              <ButtonsPresetButton
                label="Next"
                trailing-icon="i-heroicons-arrow-right"
                color="blue"
                variant="solid"
                size="md"
                :disabled="currentPage === totalPages"
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
              />
            </div>

            <!-- Pagination Info -->
            <div v-if="filteredProjects.length > 0" class="text-center mt-6">
              <p class="text-sm text-gray-600">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
                {{
                  Math.min(currentPage * itemsPerPage, filteredProjects.length)
                }}
                of {{ filteredProjects.length }} projects
              </p>
            </div>

            <!-- Empty State -->
            <div v-if="filteredProjects.length === 0" class="text-center py-20">
              <UIcon
                name="i-heroicons-inbox"
                class="w-16 h-16 text-gray-600 mx-auto mb-4"
              />
              <p class="text-gray-400 text-lg">
                No projects found matching your filters
              </p>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useProjectStore } from "~/stores/projects";

const projectStore = useProjectStore();

// Initialize data on component mount
onMounted(async () => {
  if (!projectStore.projects.length) {
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
const categories = computed(() => projectStore.availableCategories || ["All"]);
const projects = computed(() => projectStore.projects || []);

// Filter state - now using store
const showFilters = ref(false);
const isSearching = ref(false);
const showCategorySuggestions = ref(false);
const categorySearchInput = ref("");
const showAuthModal = ref(false);

// Debug function for filter toggle
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
  console.log("Filters toggled:", showFilters.value);
};

// Store filter state as computed properties
const selectedCategory = computed({
  get: () => {
    const cats = projectStore.filters.categories;
    return cats.includes("All") ? "All" : cats[0] || "All";
  },
  set: (value) => {
    const newCategories = value === "All" ? ["All"] : [value];
    projectStore.setFilter("categories", newCategories);
  },
});

const categorySearch = computed({
  get: () => projectStore.filters.search,
  set: (value) => projectStore.setFilter("search", value),
});

const selectedTags = computed({
  get: () => projectStore.filters.tags,
  set: (value) => projectStore.setFilter("tags", value),
});

const selectedYear = computed({
  get: () => projectStore.filters.year,
  set: (value) => projectStore.setFilter("year", value),
});

const selectedSort = computed({
  get: () => projectStore.filters.sort,
  set: (value) => projectStore.setFilter("sort", value),
});

// Pagination state
const currentPage = computed({
  get: () => projectStore.pagination.currentPage,
  set: (value) => projectStore.setCurrentPage(value),
});
const itemsPerPage = computed(() => projectStore.pagination.itemsPerPage);

// Debounced search functionality
let searchTimeout = null;

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
  }, 200);
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
  const selectedValues = selectedTags.value;
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
    filters.year
  );
});

// Filter management
const clearFilters = () => {
  projectStore.clearFilters();
  categorySearchInput.value = "";

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  isSearching.value = false;
};

// Like functionality - using store with authentication
import { useAuthStore } from "~/stores/auth";
const authStore = useAuthStore();

const toggleLike = async (projectId) => {
  if (!authStore.isAuthenticated) {
    // Show authentication modal
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
