<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header Section -->
    <div class="relative overflow-hidden py-16">
      <div
        class="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/40 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        class="absolute -bottom-32 right-0 w-96 h-96 bg-indigo-600/40 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        class="absolute top-10 right-24 w-52 h-52 bg-cyan-400/30 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>

      <UContainer>
        <div
          class="relative overflow-hidden rounded-3xl border border-white/10 ring-1 ring-blue-500/25
                 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950
                 shadow-2xl px-8 py-10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_30%)] pointer-events-none"
            aria-hidden="true"
          ></div>

          <div class="relative space-y-3">
            <div class="flex flex-col gap-3 mb-2">
              <nav class="flex items-center flex-wrap gap-1 text-sm text-slate-600 dark:text-slate-300">
                <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.label">
                  <NuxtLink
                    :to="crumb.to || undefined"
                    :class="[
                      'transition-colors',
                      crumb.to
                        ? 'hover:text-blue-700 text-white dark:hover:text-blue-300'
                        : 'text-slate-300 dark:text-white font-semibold',
                    ]"
                  >
                    {{ crumb.label }}
                  </NuxtLink>
                  <span
                    v-if="idx < breadcrumbs.length - 1"
                    class="text-slate-400 dark:text-slate-500"
                    >/</span
                  >
                </template>
              </nav>
              <div class="space-y-3">
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
                  Favorite Projects
                </h1>
                <p class="text-slate-300 dark:text-slate-300">
                  Projects you've liked and want to revisit
                </p>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <!-- Stats & Search -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mb-8"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
              {{ filteredFavorites.length }} Favorite Projects
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Projects you've saved for later
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div class="relative w-full sm:w-72">
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search favorites..."
                class="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div
              v-if="favoriteProjects.length > 0"
              class="flex items-center gap-2 justify-end"
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
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredFavorites.length === 0"
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
          v-for="project in filteredFavorites"
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

const breadcrumbs = [
  { label: "Dashboard", to: "/student/dashboard" },
  { label: "Favorites" },
];

definePageMeta({
  middleware: ["auth", "student"],
});

const projectStore = useProjectStore();
const authStore = useAuthStore();
const showClearConfirm = ref(false);
const searchQuery = ref("");

// Get favorite projects
const favoriteProjects = computed(() => {
  if (projectStore.likedProjectList.length > 0) {
    return projectStore.likedProjectList;
  }
  // Fallback: derive from loaded projects if detailed list not available
  return projectStore.projects.filter((project) =>
    projectStore.likedProjects.has(project.id),
  );
});

const filteredFavorites = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return favoriteProjects.value;
  return favoriteProjects.value.filter((p) => {
    const haystack = [
      p.name,
      p.description,
      ...(p.tags || []),
      ...(p.technologies || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
});

// Toggle like
const toggleLike = async (projectId: number) => {
  await projectStore.likeProject(projectId);
  await projectStore.loadUserLikedProjects();
};

// Clear all favorites
const clearAllFavorites = async () => {
  // Unlike all projects
  for (const project of favoriteProjects.value) {
    await projectStore.likeProject(project.id);
  }
  await projectStore.loadUserLikedProjects();
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
