<template>
  <section
    class="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800"
  >
    <UContainer>
      <section id="popular-projects">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2
              class="text-4xl font-semibold text-gray-900 dark:text-white mb-2"
            >
              {{ t("homePage.popularTitle") }}
            </h2>
            <p class="text-gray-700 dark:text-gray-300">
              {{ t("homePage.popularSubtitle") }}
            </p>
          </div>
          <ButtonsPresetButton preset="viewAll" to="/projects" size="sm" />
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProjectCard
            v-for="project in popularProjects"
            :key="project.id"
            :project="project"
            :liked-projects="projectStore.likedProjects"
            @toggle-like="toggleLike"
          />
        </div>
      </section>
    </UContainer>

    <!-- Authentication Modal -->
    <AuthModal v-model="showAuthModal" :context="authModalContext" />
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const projectStore = useProjectStore();
const authStore = useAuthStore();

const showAuthModal = ref(false);
const authModalContext = ref("like"); // 'like' or 'create'

const popularProjects = computed(() =>
  projectStore.getPopularProjects ? projectStore.getPopularProjects(6) : [],
);

onMounted(async () => {
  if (!projectStore.projects.length) {
    await projectStore.fetchProjects();
  }
  await projectStore.loadUserLikedProjects();
});

const toggleLike = async (projectId) => {
  if (!authStore.isAuthenticated) {
    authModalContext.value = "like";
    showAuthModal.value = true;
    return;
  }

  const wasLiked = projectStore.isProjectLiked(projectId);
  const result = await projectStore.likeProject(projectId);
  if (result) {
    const card = popularProjects.value.find((p) => p.id === projectId);
    if (card) {
      card.likes = (card.likes || 0) + (wasLiked ? -1 : 1);
      if (card.likes < 0) card.likes = 0;
    }
  }
  await projectStore.loadUserLikedProjects();
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
