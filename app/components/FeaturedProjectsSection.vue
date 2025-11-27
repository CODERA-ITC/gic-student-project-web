<template>
  <section
    class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
  >
    <UContainer>
      <div class="flex justify-between items-center mb-12">
        <div>
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Featured Projects
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
          :liked-projects="likedProjects"
          :is-featured="true"
          @toggle-like="toggleLike"
        />
      </div>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import { useProjectStore } from "~/stores/projects";

const projectStore = useProjectStore();

onMounted(async () => {
  await projectStore.fetchFeaturedProjects();
});

const featuredProjects = computed(() => projectStore.featuredProjects);

// Like functionality - persist in localStorage
const LIKED_PROJECTS_KEY = "likedProjects";

const getLikedProjectsFromStorage = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(LIKED_PROJECTS_KEY);
    return stored ? JSON.parse(stored) : {};
  }
  return {};
};

const likedProjects = ref(getLikedProjectsFromStorage());

const toggleLike = (projectId) => {
  if (likedProjects.value[projectId]) {
    // Unlike: decrement count and remove from liked
    const project = featuredProjects.value.find((p) => p.id === projectId);
    if (project && project.likes > 0) {
      project.likes--;
    }
    delete likedProjects.value[projectId];
  } else {
    // Like: increment count and add to liked
    projectStore.likeProject(projectId);
    likedProjects.value[projectId] = true;
  }

  // Save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(
      LIKED_PROJECTS_KEY,
      JSON.stringify(likedProjects.value)
    );
  }
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
