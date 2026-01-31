<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header Section -->
    <div
      class="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-b border-blue-700/30 dark:border-slate-700"
    >
      <UContainer>
        <div class="flex items-center gap-4 mb-4">
          <div
            class="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-1 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
          >
            <ButtonsPresetButton
              preset="back"
              @click="$router.push('/teacher/dashboard')"
              class="!text-white"
            />
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-heart-solid"
              class="w-10 h-10 text-red-400"
            />
            <h1 class="text-4xl font-black text-white">
              Favorite Student Projects
            </h1>
          </div>
          <p class="text-blue-100 dark:text-slate-300">
            Outstanding student projects you've marked for reference
          </p>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <!-- Stats Card -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mb-8"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2
              class="text-2xl font-semibold text-gray-900 dark:text-white mb-1"
            >
              {{ favoriteProjects.length }} Favorite Projects
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Exceptional student work worth highlighting
            </p>
          </div>
          <div
            v-if="favoriteProjects.length > 0"
            class="flex items-center gap-2"
          >
            <ButtonsPresetButton
              label="Export List"
              icon="i-heroicons-arrow-down-tray"
              color="secondary"
              variant="outline"
              size="sm"
              @click="exportFavorites"
            />
            <ButtonsPresetButton
              label="Clear All"
              icon="i-heroicons-trash"
              color="danger"
              variant="outline"
              size="sm"
              @click="showClearConfirm = true"
            />
          </div>
        </div>
      </div>

      <!-- Filter by Category -->
      <div
        v-if="favoriteProjects.length > 0"
        class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 mb-8"
      >
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Filter:</span
          >
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedCategory === category
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600',
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="favoriteProjects.length === 0"
        class="flex flex-col items-center justify-center py-20"
      >
        <UIcon
          name="i-heroicons-heart"
          class="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4"
        />
        <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          No favorites yet
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          Browse student projects and click the heart icon to save exceptional
          work for future reference!
        </p>
        <ButtonsPresetButton
          label="Browse Projects"
          icon="i-heroicons-rocket-launch"
          color="primary"
          variant="solid"
          size="lg"
          @click="$router.push('/projects')"
        />
      </div>

      <!-- Projects Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
          :liked-projects="projectStore.likedProjects"
          @toggle-like="toggleLike"
        />
      </div>
    </UContainer>

    <!-- Clear Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showClearConfirm"
      projectTitle="all favorite projects"
      @confirm="clearAllFavorites"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  middleware: ["auth", "teacher"],
});

const projectStore = useProjectStore();
const authStore = useAuthStore();
const showClearConfirm = ref(false);
const selectedCategory = ref("All");

// Get favorite projects
const favoriteProjects = computed(() => {
  return projectStore.projects.filter((project) =>
    projectStore.likedProjects.has(project.id),
  );
});

// Get unique categories from favorite projects
const categories = computed(() => {
  const cats = new Set(["All"]);
  favoriteProjects.value.forEach((project) => {
    if (project.category) cats.add(project.category);
  });
  return Array.from(cats);
});

// Filter projects by category
const filteredProjects = computed(() => {
  if (selectedCategory.value === "All") {
    return favoriteProjects.value;
  }
  return favoriteProjects.value.filter(
    (project) => project.category === selectedCategory.value,
  );
});

// Toggle like
const toggleLike = async (projectId: number) => {
  await projectStore.likeProject(projectId);
  await projectStore.saveUserLikedProjects();
};

// Clear all favorites
const clearAllFavorites = async () => {
  // Unlike all projects
  for (const project of favoriteProjects.value) {
    await projectStore.likeProject(project.id);
  }
  await projectStore.saveUserLikedProjects();
  showClearConfirm.value = false;
};

// Export favorites to CSV
const exportFavorites = () => {
  const csvContent =
    "Project Title,Category,Author,Status,Likes,Views\n" +
    favoriteProjects.value
      .map(
        (p) =>
          `"${p.name}","${p.category}","${p.author.name}","${p.status}",${p.likes},${p.views}`,
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `favorite-projects-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Load projects and user liked projects on mount
onMounted(async () => {
  if (projectStore.projects.length === 0) {
    await projectStore.fetchProjects(
      projectStore.pagination.currentPage,
      projectStore.pagination.itemsPerPage,
    );
  }
  await projectStore.loadUserLikedProjects();
});

useHead({
  title: "Favorite Projects - GIC Teacher Portal",
  meta: [
    {
      name: "description",
      content: "Your favorite student projects collection",
    },
  ],
});
</script>
