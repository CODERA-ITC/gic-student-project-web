<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
  >
    <!-- Back Button -->
    <div
      class="top-20 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur border-b border-gray-200 dark:border-slate-700"
    >
      <UContainer class="py-4">
        <div class="flex items-center justify-between">
          <ButtonsPresetButton preset="back" to="/projects" />
        </div>
      </UContainer>
    </div>

    <!-- Project Details -->
    <UContainer class="py-12">
      <div
        v-if="isLoading"
        class="flex items-center justify-center min-h-[400px]"
      >
        <div class="text-center">
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4"
          />
          <p class="text-gray-300 dark:text-gray-300">Loading project...</p>
        </div>
      </div>
      <div v-else-if="project && project.id" class="grid lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Project Header - Image Carousel -->
          <div
            class="rounded-2xl h-64 relative overflow-hidden bg-gray-200 dark:bg-slate-800"
          >
            <div class="relative w-full h-full">
              <!-- Current Image -->
              <img
                v-if="project.images && project.images[currentImageIndex]"
                :src="project.images[currentImageIndex]"
                :alt="`${project.title} - Image ${currentImageIndex + 1}`"
                class="w-full h-full object-cover"
              />

              <!-- Fallback if no images -->
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-8xl bg-gray-100 dark:bg-slate-700"
              >
                {{ project.emoji || "📁" }}
              </div>

              <!-- Navigation Buttons -->
              <button
                v-if="project.images && project.images.length > 1"
                @click="previousImage"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all backdrop-blur-sm z-10"
              >
                <UIcon
                  name="i-heroicons-chevron-left"
                  class="w-6 h-6 text-white"
                />
              </button>

              <button
                v-if="project.images && project.images.length > 1"
                @click="nextImage"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all backdrop-blur-sm z-10"
              >
                <UIcon
                  name="i-heroicons-chevron-right"
                  class="w-6 h-6 text-white"
                />
              </button>

              <!-- Image Indicators -->
              <div
                v-if="project.images && project.images.length > 1"
                class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"
              >
                <button
                  v-for="(img, idx) in project.images || []"
                  :key="idx"
                  @click="currentImageIndex = idx"
                  :class="[
                    'w-2 h-2 rounded-full transition-all',
                    currentImageIndex === idx
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75',
                  ]"
                ></button>
              </div>
            </div>

            <div
              class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
            ></div>
          </div>

          <!-- Project Title and Badges -->
          <div class="space-y-4">
            <div class="flex gap-3 flex-wrap">
              <UBadge color="primary" variant="soft" size="md">
                {{ project.category }}
              </UBadge>
              <UBadge color="info" variant="soft" size="md">
                {{ project.semester }}
              </UBadge>
              <UBadge color="success" variant="soft" size="md">
                {{ project.status }}
              </UBadge>
            </div>
            <h1
              class="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white"
            >
              {{ project.title }}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ project.description }}
            </p>
          </div>

          <!-- Course / Subject -->
          <div
            class="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl p-6"
          >
            <div class="flex items-start gap-4">
              <UIcon
                name="i-heroicons-academic-cap"
                class="w-6 h-6 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0"
              />
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                >
                  Course / Subject
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  {{ project.course }}
                </p>
              </div>
            </div>
          </div>

          <!-- Duration -->
          <div
            class="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl p-6"
          >
            <div class="flex items-start gap-4">
              <UIcon
                name="i-heroicons-clock"
                class="w-6 h-6 text-green-500 dark:text-green-400 mt-1 flex-shrink-0"
              />
              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                >
                  Project Duration
                </h3>
                <p class="text-gray-600 dark:text-gray-300">
                  {{ project.duration }}
                </p>
              </div>
            </div>
          </div>

          <!-- Project Timeline -->
          <div
            class="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-6 animate-fade-in-up"
          >
            <div class="flex items-start gap-4">
              <UIcon
                name="i-heroicons-clock"
                class="w-6 h-6 text-purple-500 dark:text-purple-400 mt-1 flex-shrink-0 animate-pulse"
              />
              <div class="flex-1">
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4 animate-slide-in-right"
                >
                  Project Timeline
                </h3>
                <div class="w-full animate-fade-in-up-delayed">
                  <UTimeline
                    size="xs"
                    :default-value="getDefaultTimelineValue"
                    :items="timelineItems"
                    class="w-full transform transition-all duration-500 ease-in-out hover:scale-[1.01]"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- About This Project -->
          <div
            class="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700"
          >
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              About This Project
            </h3>
            <div class="prose prose-gray dark:prose-invert max-w-none">
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ project.description }}
              </p>
            </div>
          </div>

          <!-- Team Members -->
          <div
            class="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-6"
          >
            <div class="flex items-start gap-4">
              <UIcon
                name="i-heroicons-users"
                class="w-6 h-6 text-cyan-500 dark:text-cyan-400 mt-1 flex-shrink-0"
              />
              <div class="flex-1">
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                >
                  Project Team
                </h3>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div
                    v-for="(member, idx) in project.members || []"
                    :key="idx"
                    class="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-slate-700/50 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <img
                      :src="member.image"
                      :alt="member.name"
                      class="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <p
                      class="text-gray-800 dark:text-gray-200 font-medium truncate"
                    >
                      {{ member.name }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Skills Used -->
          <div
            class="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl p-6"
          >
            <div class="flex items-start gap-4">
              <UIcon
                name="i-heroicons-wrench-screwdriver"
                class="w-6 h-6 text-yellow-500 dark:text-yellow-400 mt-1 flex-shrink-0"
              />
              <div class="flex-1">
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-white mb-4"
                >
                  Skills & Technologies
                </h3>
                <div class="flex gap-2 flex-wrap">
                  <span
                    v-for="skill in project.technologies || []"
                    :key="skill"
                    class="px-3 py-2 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-sm font-medium border border-blue-200 dark:border-blue-500/30 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Sticky Container for Statistics and Actions -->
          <div class="sticky top-28 space-y-6">
            <!-- Statistics Card -->
            <div
              class="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-4"
            >
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Statistics
              </h3>

              <!-- Views -->
              <div
                class="flex items-center justify-between p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-eye"
                    class="w-5 h-5 text-blue-500 dark:text-blue-400"
                  />
                  <span class="text-gray-600 dark:text-gray-300">Views</span>
                </div>
                <span class="text-gray-900 dark:text-white font-semibold">{{
                  project.views
                }}</span>
              </div>

              <!-- Likes -->
              <div
                class="flex items-center justify-between p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-heart"
                    class="w-5 h-5 text-red-500 dark:text-red-400"
                  />
                  <span class="text-gray-600 dark:text-gray-300">Likes</span>
                </div>
                <span class="text-gray-900 dark:text-white font-semibold">{{
                  project.likes
                }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <UButton
                @click="toggleLike"
                :class="[
                  'w-full justify-center transition-all duration-300',
                  isLiked
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg shadow-pink-500/20'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600',
                ]"
                size="lg"
              >
                <template #leading>
                  <UIcon
                    :name="
                      isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'
                    "
                    class="w-5 h-5"
                  />
                </template>
                {{ isLiked ? "Liked" : "Like Project" }}
              </UButton>

              <UButton
                color="neutral"
                variant="soft"
                class="w-full justify-center"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-heroicons-share" class="w-5 h-5" />
                </template>
                Share Project
              </UButton>
            </div>

            <!-- Lead Developer -->
            <div
              v-if="project.author"
              class="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-4"
            >
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Lead Developer
              </h3>
              <div class="flex items-center gap-4">
                <img
                  :src="project.author.avatar"
                  :alt="project.author.name"
                  class="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p class="text-gray-900 dark:text-white font-semibold">
                    {{ project.author.name }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    {{ project.author.program }} - {{ project.author.year }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Authentication Modal -->
    <AuthModal v-model="showAuthModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useProjectStore } from "~/stores/projects";
import type { TimelineItem } from "@nuxt/ui";

const route = useRoute();
const projectStore = useProjectStore();
const projectId = parseInt(route.params.id as string);

// Get project from store
const project = ref(null);
const isLoading = ref(true);

const projectData = await projectStore.getProject(projectId);
if (!projectData) {
  throw createError({
    statusCode: 404,
    statusMessage: "Project not found",
  });
}
project.value = projectData;
isLoading.value = false;

// Image carousel
const currentImageIndex = ref(0);

const nextImage = () => {
  if (project.value?.images) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % project.value.images.length;
  }
};

const previousImage = () => {
  if (project.value?.images) {
    currentImageIndex.value =
      currentImageIndex.value === 0
        ? project.value.images.length - 1
        : currentImageIndex.value - 1;
  }
};

// Like functionality - using store with authentication
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const showAuthModal = ref(false);

// Load user's liked projects when component mounts
onMounted(async () => {
  await projectStore.loadUserLikedProjects();
});

// Watch for auth changes and reload liked projects
watch(
  () => authStore.isAuthenticated,
  async (isAuth) => {
    if (isAuth) {
      await projectStore.loadUserLikedProjects();
    } else {
      projectStore.clearUserLikedProjects();
    }
  }
);

const isLiked = computed(() => {
  if (!project.value) return false;
  return projectStore.isProjectLiked(project.value.id);
});

const toggleLike = async () => {
  if (!project.value) return;

  if (!authStore.isAuthenticated) {
    // Show authentication modal
    showAuthModal.value = true;
    return;
  }

  const newLikedState = await projectStore.likeProject(project.value.id);
  // Save the updated likes to persistence layer
  await projectStore.saveUserLikedProjects();
};

// Timeline items computed property
const timelineItems = computed<TimelineItem[]>(() => {
  if (!project.value?.features && !project.value?.feature) return [];

  const features = project.value.features || project.value.feature || [];

  return features.map(
    (feature: any): TimelineItem => ({
      date: feature.date || "No date",
      title: feature.title,
      description: feature.description,
      icon: feature.icon || "i-lucide-star",
    })
  );
});

// Get default timeline value (latest completed item or middle item)
const getDefaultTimelineValue = computed(() => {
  if (!timelineItems.value.length) return 0;

  // Find the middle item for better visual presentation
  return Math.floor(timelineItems.value.length / 2);
});

useHead({
  title: `${project.value?.title || "Project"} - Project Details`,
  meta: [
    {
      name: "description",
      content: project.value?.description || "Student project details",
    },
  ],
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUpDelayed {
  0%,
  20% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-slide-in-right {
  animation: slideInRight 0.6s ease-out forwards;
}

.animate-fade-in-up-delayed {
  animation: fadeInUpDelayed 1.2s ease-out forwards;
}

/* Timeline specific animations */
:deep(.timeline-item) {
  transition: all 0.3s ease-in-out;
}

:deep(.timeline-item:hover) {
  transform: translateX(5px);
}

/* Custom timeline styling with better animations */
:deep(.timeline) {
  position: relative;
}

:deep(.timeline::before) {
  content: "";
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    rgb(147, 51, 234),
    rgb(59, 130, 246),
    rgb(34, 197, 94)
  );
  border-radius: 2px;
  animation: lineGrow 2s ease-in-out;
}

@keyframes lineGrow {
  from {
    height: 0;
  }
  to {
    height: 100%;
  }
}

/* Staggered animation for timeline items */
:deep(.timeline-item:nth-child(1)) {
  animation-delay: 0.2s;
}

:deep(.timeline-item:nth-child(2)) {
  animation-delay: 0.4s;
}

:deep(.timeline-item:nth-child(3)) {
  animation-delay: 0.6s;
}

:deep(.timeline-item:nth-child(4)) {
  animation-delay: 0.8s;
}
</style>
