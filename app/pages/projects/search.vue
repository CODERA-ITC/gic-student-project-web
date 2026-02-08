<template>
  <div class="min-h-screen bg-white">
    <!-- Header Section -->
    <div class="hero-nodes py-20 border-b border-blue-800/30">
      <UContainer>
        <div class="space-y-6">
          <div class="text-center space-y-4 max-w-2xl mx-auto">
            <h1 class="text-4xl lg:text-6xl font-semibold tracking-tight leading-tight text-blue-900">
              Search Results
            </h1>
            <p class="text-xl text-blue-900/80">
              <span v-if="searchQuery">Results for "{{ searchQuery }}"</span>
              <span v-else-if="categoryFilter">Projects in {{ categoryFilter }}</span>
              <span v-else>Browse projects</span>
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap">
            <ButtonsPresetButton v-if="searchQuery || categoryFilter" preset="clearFilters" size="sm"
              @click="clearSearch">
              <template #default>Clear & View All Projects</template>
            </ButtonsPresetButton>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Search Results -->
    <UContainer class="py-16 bg-blue-900/70">
      <div class="space-y-6">
        <!-- Results Count & Active Filters -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p class="text-white">
            Found
            <span class="text-white font-semibold">{{
              searchResults.length
            }}</span>
            {{ searchResults.length === 1 ? "project" : "projects" }}
          </p>

          <!-- Active Filters -->
          <div v-if="searchQuery || categoryFilter" class="flex gap-2 items-center flex-wrap">
            <UBadge v-if="searchQuery" color="primary" variant="soft" size="md">
              Search: {{ searchQuery }}
            </UBadge>
            <UBadge v-if="categoryFilter" color="primary" variant="soft" size="md">
              Category: {{ categoryFilter }}
            </UBadge>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="searchResults.length === 0"
          class="text-center py-16 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl">
          <UIcon name="i-heroicons-magnifying-glass-20-solid" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-white mb-2">
            No Projects Found
          </h3>
          <p class="text-gray-300 mb-6">
            Try adjusting your search terms or browse all projects
          </p>
          <ButtonsPresetButton size="sm" @click="clearSearch">
            <template #default>View All Projects</template>
          </ButtonsPresetButton>
        </div>

        <!-- Projects Cards -->
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard v-for="project in searchResults" :key="project.id" :project="project"
            :liked-projects="likedProjects" @toggle-like="toggleLike" />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";
import { useToast } from "#imports";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const authStore = useAuthStore();
const toast = useToast();

// Get query params
const searchQuery = ref(route.query.search || "");
const categoryFilter = ref(route.query.category || "");

// Watch for route changes
watch(
  () => route.query,
  (newQuery) => {
    searchQuery.value = newQuery.search || "";
    categoryFilter.value = newQuery.category || "";
  },
);

// Get all projects from store
const projects = computed(() => projectStore.projects);

// Filter projects based on search query and category
const searchResults = computed(() => {
  let results = [...projects.value];

  // Filter by category if specified
  if (categoryFilter.value) {
    results = results.filter(
      (project) =>
        project.category.toLowerCase() === categoryFilter.value.toLowerCase(),
    );
  }

  // Filter by search query if specified
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.author.name.toLowerCase().includes(query) ||
        project.semester.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query)),
    );
  }

  return results;
});

const likedProjects = computed(() => projectStore.likedProjects);

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await projectStore.loadUserLikedProjects();
  } else {
    projectStore.clearUserLikedProjects();
  }
});

const toggleLike = async (projectId) => {
  if (!authStore.isAuthenticated) {
    toast.add({
      title: "Login required",
      description: "Please sign in to like projects.",
      color: "warning",
    });
    return;
  }

  await projectStore.likeProject(projectId);
  await projectStore.loadUserLikedProjects();
};

// Clear search and return to projects page
const clearSearch = () => {
  router.push("/projects");
};

useHead({
  title: searchQuery.value
    ? `Search: ${searchQuery.value} - Projects`
    : categoryFilter.value
      ? `${categoryFilter.value} Projects`
      : "Search Projects - GIC Showcase",
  meta: [
    {
      name: "description",
      content: "Search and discover student projects from GIC program",
    },
  ],
});
</script>
