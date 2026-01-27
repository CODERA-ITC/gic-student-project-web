<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header Section -->
    <div
      class="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-b border-blue-700/30 dark:border-slate-700"
    >
      <UContainer>
        <div class="flex flex-row items-center gap-4 mb-4">
          <div
            class="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-1 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
          >
            <ButtonsPresetButton
              preset="back"
              @click="$router.push('/student/dashboard')"
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
            <h1 class="text-4xl font-black text-white">Favorite Projects</h1>
          </div>
          <p class="text-blue-100 dark:text-slate-300">
            Projects you've liked and want to revisit
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
              Projects you've saved for later
            </p>
          </div>
          <div
            v-if="favoriteProjects.length > 0"
            class="flex items-center gap-2"
          >
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
          Start exploring projects and click the heart icon to save your
          favorites here!
        </p>
        <ButtonsPresetButton
          preset="exploreProjects"
          @click="$router.push('/projects')"
        />
      </div>

      <!-- Projects Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        <ProjectCard
          v-for="project in favoriteProjects"
          :key="project.id"
          :project="project"
          :liked-projects="projectStore.likedProjects"
          @toggle-like="toggleLike"
        />
      </div>
    </UContainer>

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
  middleware: ["auth", "student"],
});

const projectStore = useProjectStore();
const authStore = useAuthStore();
const showClearConfirm = ref(false);

// Get favorite projects
const favoriteProjects = computed(() => {
  return projectStore.projects.filter((project) =>
    projectStore.likedProjects.has(project.id),
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
  title: "Favorite Projects - GIC Student Portal",
  meta: [
    {
      name: "description",
      content: "Your favorite projects collection",
    },
  ],
});
</script>
