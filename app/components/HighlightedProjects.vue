<template>
  <section
    class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <section id="highlighted-projects">
      <UContainer>
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-4xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ t("homePage.highlightedTitle") }}
            </h2>
            <p class="text-gray-700 dark:text-gray-300">
              {{ t("homePage.highlightedSubtitle") }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <ButtonsPresetButton preset="viewAll" to="/projects" size="sm" />
          </div>
        </div>
      </UContainer>

      <!-- full-width carousel (not clipped by container max-width) -->
      <div class="relative w-screen left-1/2 -translate-x-1/2 px-4 sm:px-6 lg:px-10">
        <div ref="carouselRef" class="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory p-5"
          @scroll="onCarouselScroll">
          <!-- use the store instead! -->
          <div v-for="(project, index) in loopProjects" :key="`${project.id}-${index}`"
            :data-logical-index="getLogicalIndex(index)" :class="[
              'snap-start shrink-0 w-[88%] sm:w-[70%] md:w-[48%] lg:w-[32%] transition-all duration-500 ease-out',
              isFocusedCard(getLogicalIndex(index))
                ? 'scale-[1.04] z-10'
                : 'scale-100 opacity-90',
            ]" @mouseenter="onCardMouseEnter(getLogicalIndex(index))" @mouseleave="onCardMouseLeave">
            <ProjectCard :project="project" :liked-projects="projectStore.likedProjects" @toggle-like="toggleLike" />
          </div>
        </div>

        <!-- floating controls on card list body -->
        <UButton v-if="hasControls" icon="i-heroicons-chevron-left" size="sm"
          class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 !bg-blue-900 !text-white hover:!bg-blue-800 !rounded-full !p-3 shadow-lg"
          :disabled="!canNavigatePrev" @click="onPrevClick" />
        <UButton v-if="hasControls" icon="i-heroicons-chevron-right" size="sm"
          class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 !bg-blue-900 !text-white hover:!bg-blue-800 !rounded-full !p-3 shadow-lg"
          :disabled="!canNavigateNext" @click="onNextClick" />
      </div>
    </section>

    <!-- Authentication Modal -->
    <AuthModal v-model="showAuthModal" :context="authModalContext" />
  </section>
</template>

<script setup lang="ts">
import { nextTick, watch } from "vue";

const { t } = useI18n();
const projectStore = useProjectStore();
const authStore = useAuthStore();

const featuredProjects = computed(() => projectStore.getHighlightedProjects);
const carouselRef = ref<HTMLElement | null>(null);
const hasControls = computed(() => featuredProjects.value.length > 1);
const hasLoop = computed(() => featuredProjects.value.length > 1);
const canNavigatePrev = computed(() => hasControls.value);
const canNavigateNext = computed(() => hasControls.value);
const centeredLogicalIndex = ref(0);
const hoveredLogicalIndex = ref<number | null>(null);
const autoScrollTimer = ref<ReturnType<typeof setInterval> | null>(null);
const loopProjects = computed(() =>
  hasLoop.value
    ? [...featuredProjects.value, ...featuredProjects.value]
    : featuredProjects.value,
);
const visualFocusIndex = computed(() =>
  hoveredLogicalIndex.value ?? centeredLogicalIndex.value,
);

const showAuthModal = ref(false);
const authModalContext = ref("like"); // 'like' or 'create'
const autoScrollDelayMs = 2200;
const handleResize = () => {
  normalizeLoopPosition();
  scrollToIndex(0, "auto");
  updateCenteredFocus();
  restartAutoScroll();
};

onMounted(async () => {
  await Promise.all([
    projectStore.fetchHighlightedProjects(),
    projectStore.loadUserLikedProjects(),
  ]);

  await nextTick();
  scrollToIndex(0, "auto");
  updateCenteredFocus();
  startAutoScroll();
  setTimeout(() => {
    restartAutoScroll();
  }, 500);
  window.addEventListener("resize", handleResize);
});

watch(
  () => featuredProjects.value.length,
  async () => {
    await nextTick();
    if (carouselRef.value) {
      carouselRef.value.scrollLeft = 0;
    }
    scrollToIndex(0, "auto");
    updateCenteredFocus();
    restartAutoScroll();
  },
);

onUnmounted(() => {
  stopAutoScroll();
  window.removeEventListener("resize", handleResize);
});

const getScrollStep = () => {
  const container = carouselRef.value;
  if (!container) return 0;
  const firstCard = container.firstElementChild as HTMLElement | null;
  if (!firstCard) return Math.max(container.clientWidth * 0.9, 280);
  const cardWidth = firstCard.getBoundingClientRect().width;
  const styles = window.getComputedStyle(container);
  const gap = parseFloat(styles.columnGap || styles.gap || "24") || 24;
  return cardWidth + gap;
};

const scrollToIndex = (
  index: number,
  behavior: ScrollBehavior = "smooth",
) => {
  const container = carouselRef.value;
  if (!container) return;
  const step = getScrollStep();
  const maxLeft = Math.max(container.scrollWidth - container.clientWidth, 0);
  container.scrollTo({
    left: Math.min(Math.max(index, 0) * step, maxLeft),
    behavior,
  });
};

const getSingleTrackWidth = () => {
  const container = carouselRef.value;
  if (!container || !hasLoop.value) return 0;
  return container.scrollWidth / 2;
};

const normalizeLoopPosition = () => {
  const container = carouselRef.value;
  if (!container || !hasLoop.value) return;
  const singleTrackWidth = getSingleTrackWidth();
  if (!singleTrackWidth) return;
  if (container.scrollLeft >= singleTrackWidth) {
    container.scrollLeft -= singleTrackWidth;
  } else if (container.scrollLeft < 0) {
    container.scrollLeft += singleTrackWidth;
  }
};

const scrollNext = () => {
  if (featuredProjects.value.length <= 1) return;
  const container = carouselRef.value;
  if (!container) return;
  const step = getScrollStep();
  container.scrollBy({ left: step, behavior: "smooth" });

  setTimeout(() => {
    normalizeLoopPosition();
    updateCenteredFocus();
  }, 420);
};

const scrollPrev = () => {
  if (featuredProjects.value.length <= 1) return;
  const container = carouselRef.value;
  if (!container) return;
  const step = getScrollStep();
  container.scrollBy({ left: -step, behavior: "smooth" });

  setTimeout(() => {
    normalizeLoopPosition();
    updateCenteredFocus();
  }, 420);
};

const onNextClick = (_event: MouseEvent) => {
  scrollNext();
  restartAutoScroll();
};

const onPrevClick = (_event: MouseEvent) => {
  scrollPrev();
  restartAutoScroll();
};

const getLogicalIndex = (loopedIndex: number) => {
  const total = featuredProjects.value.length;
  if (!total) return 0;
  return loopedIndex % total;
};

const updateCenteredFocus = () => {
  const container = carouselRef.value;
  if (!container || !featuredProjects.value.length) return;
  const children = Array.from(container.children) as HTMLElement[];
  if (!children.length) return;

  const containerRect = container.getBoundingClientRect();
  const centerX = containerRect.left + containerRect.width / 2;

  let closestIdx = 0;
  let minDistance = Number.POSITIVE_INFINITY;

  children.forEach((child) => {
    const rect = child.getBoundingClientRect();
    const childCenter = rect.left + rect.width / 2;
    const distance = Math.abs(centerX - childCenter);
    if (distance < minDistance) {
      minDistance = distance;
      closestIdx = Number(child.dataset.logicalIndex || 0);
    }
  });

  centeredLogicalIndex.value = closestIdx;
};

const isFocusedCard = (logicalIndex: number) =>
  featuredProjects.value.length > 0 && logicalIndex === visualFocusIndex.value;

const onCardMouseEnter = (logicalIndex: number) => {
  hoveredLogicalIndex.value = logicalIndex;
};

const onCardMouseLeave = () => {
  hoveredLogicalIndex.value = null;
};

const onCarouselScroll = () => {
  normalizeLoopPosition();
  updateCenteredFocus();
};

const startAutoScroll = () => {
  if (autoScrollTimer.value || featuredProjects.value.length <= 1) {
    return;
  }

  autoScrollTimer.value = setInterval(() => {
    if (hoveredLogicalIndex.value !== null) return;
    scrollNext();
  }, autoScrollDelayMs);
};

const stopAutoScroll = () => {
  if (!autoScrollTimer.value) return;
  clearInterval(autoScrollTimer.value);
  autoScrollTimer.value = null;
};

const restartAutoScroll = () => {
  stopAutoScroll();
  startAutoScroll();
};

const toggleLike = async (projectId) => {
  if (!authStore.isAuthenticated) {
    // Show authentication modal for like action
    authModalContext.value = "like";
    showAuthModal.value = true;
    return;
  }

  const wasLiked = projectStore.isProjectLiked(projectId);
  const result = await projectStore.likeProject(projectId);
  if (result) {
    const card = featuredProjects.value.find((p) => p.id === projectId);
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

/* Hide native scrollbar for cleaner carousel UI */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
