<template>
  <section
    class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
  >
    <UContainer>
      <section id="highlighted-projects">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2
              class="text-4xl font-semibold text-gray-900 dark:text-white mb-2"
            >
              Highlighted Projects
            </h2>
            <p class="text-gray-700 dark:text-gray-300">
              Discover the latest and greatest student creations
            </p>
          </div>
          <!-- <NuxtLink to="/projects">
          <UButton
            variant="outline"
            icon="i-heroicons-arrow-right"
            icon-trailing
            color="primary"
          >
            View All
          </UButton>
        </NuxtLink> -->

          <ButtonsPresetButton preset="viewAll" to="/projects" size="sm" />
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- use the store instead! -->

          <ProjectCard
            v-for="project in featuredProjects"
            :key="project.id"
            :project="project"
            :liked-projects="projectStore.likedProjects"
            @toggle-like="toggleLike"
          />
        </div>

        <p>featuredProjects: {{ featuredProjects.length }}</p>
      </section>
    </UContainer>

    <!-- Authentication Modal -->
    <AuthModal v-model="showAuthModal" :context="authModalContext" />
  </section>
</template>

<script setup lang="ts">
const projectStore = useProjectStore();
const authStore = useAuthStore();

const featuredProjects = computed(() => projectStore.getHighlightedProjects);

const showAuthModal = ref(false);
const authModalContext = ref("like"); // 'like' or 'create'

onMounted(async () => {
  await Promise.all([
    projectStore.fetchHighlightedProjects(),
    projectStore.loadUserLikedProjects(),
  ]);
});

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
