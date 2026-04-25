<template>
  <section
    class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
  >
    <section id="highlighted-projects">
      <UContainer>
        <div class="flex items-center justify-between mb-10">
          <div>
            <h2 class="text-4xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ t("homePage.highlightedTitle") }}
            </h2>
            <p class="text-gray-700 dark:text-gray-300">
              {{ t("homePage.highlightedSubtitle") }}
            </p>
          </div>
          <ButtonsPresetButton preset="viewAll" to="/projects" size="sm" />
        </div>
      </UContainer>

      <div class="relative w-screen left-1/2 -translate-x-1/2 px-4 sm:px-6 lg:px-10">
        <div class="marquee-wrap overflow-hidden px-1 py-3">
          <div
            class="marquee-track flex w-max"
            :class="{ 'marquee-animated': shouldAnimate }"
            :style="{ '--marquee-duration': marqueeDuration }"
          >
            <div class="marquee-group flex items-stretch gap-5">
              <div
                v-for="project in featuredProjects"
                :key="`highlight-left-${project.id}`"
                class="project-card shrink-0 w-[86vw] sm:w-[21rem] md:w-[23rem] lg:w-[24rem]"
              >
                <ProjectCard
                  :project="project"
                  :liked-projects="projectStore.likedProjects"
                  @toggle-like="toggleLike"
                />
              </div>
            </div>

            <div
              v-if="shouldAnimate"
              class="marquee-group flex items-stretch gap-5"
              aria-hidden="true"
            >
              <div
                v-for="project in featuredProjects"
                :key="`highlight-right-${project.id}`"
                class="project-card shrink-0 w-[86vw] sm:w-[21rem] md:w-[23rem] lg:w-[24rem]"
              >
                <ProjectCard
                  :project="project"
                  :liked-projects="projectStore.likedProjects"
                  @toggle-like="toggleLike"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <AuthModal v-model="showAuthModal" :context="authModalContext" />
  </section>
</template>

<script setup lang="ts">
import { nextTick, watch } from "vue";

const { t } = useI18n();
const projectStore = useProjectStore();
const authStore = useAuthStore();

const featuredProjects = computed(() => projectStore.getHighlightedProjects || []);
const shouldAnimate = computed(() => featuredProjects.value.length > 1);
const marqueeDuration = computed(() => {
  const total = featuredProjects.value.length;
  return `${Math.max(24, total * 6)}s`;
});

const showAuthModal = ref(false);
const authModalContext = ref("like");

onMounted(async () => {
  await Promise.all([
    projectStore.fetchHighlightedProjects(),
    projectStore.loadUserLikedProjects(),
  ]);
  await nextTick();
});

watch(
  () => featuredProjects.value.length,
  async () => {
    await nextTick();
  },
);

const toggleLike = async (projectId: string | number) => {
  if (!authStore.isAuthenticated) {
    authModalContext.value = "like";
    showAuthModal.value = true;
    return;
  }

  const wasLiked = projectStore.isProjectLiked(projectId);
  const result = await projectStore.likeProject(projectId);
  if (result) {
    const card = featuredProjects.value.find((p: any) => p.id === projectId);
    if (card) {
      card.likes = (card.likes || 0) + (wasLiked ? -1 : 1);
      if (card.likes < 0) card.likes = 0;
    }
  }
  await projectStore.loadUserLikedProjects();
};
</script>

<style scoped>
.marquee-wrap {
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
}

.marquee-track {
  will-change: transform;
}

.marquee-animated {
  animation: highlighted-marquee var(--marquee-duration, 30s) linear infinite;
}

.marquee-wrap:hover .marquee-animated {
  animation-play-state: paused;
}

@keyframes highlighted-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
