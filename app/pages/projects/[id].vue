<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
  >
    <!-- Back Button -->
    <div
      class="sticky top-20 z-40 bg-slate-800/80 backdrop-blur border-b border-slate-700"
    >
      <UContainer class="py-4">
        <ButtonsPresetButton preset="back" to="/projects" />
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
          <p class="text-gray-300">Loading project...</p>
        </div>
      </div>
      <div v-else-if="project && project.id" class="grid lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Project Header - Image Carousel -->
          <div class="rounded-2xl h-64 relative overflow-hidden bg-slate-800">
            <div class="relative w-full h-full">
              <!-- Current Image -->
              <img
                v-if="project.images && project.images[currentImageIndex]"
                :src="project.images[currentImageIndex]"
                :alt="`${project.title} - Image ${currentImageIndex + 1}`"
                class="w-full h-full object-cover"
              />

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
            <h1 class="text-4xl lg:text-5xl font-black text-white">
              {{ project.title }}
            </h1>
            <p class="text-lg text-gray-300 leading-relaxed">
              {{ project.description }}
            </p>
          </div>

          <!-- Course / Subject -->
          <div
            class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6"
          >
            <div class="flex items-start gap-4">
              <UIcon
                name="i-heroicons-academic-cap"
                class="w-6 h-6 text-blue-400 mt-1 flex-shrink-0"
              />
              <div>
                <h3 class="text-lg font-semibold text-white mb-2">
                  Course / Subject
                </h3>
                <p class="text-gray-300">{{ project.course }}</p>
              </div>
            </div>
          </div>

          <!-- Duration -->
          <div
            class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6"
          >
            <div class="flex items-start gap-4">
              <UIcon
                name="i-heroicons-clock"
                class="w-6 h-6 text-green-400 mt-1 flex-shrink-0"
              />
              <div>
                <h3 class="text-lg font-semibold text-white mb-2">
                  Project Duration
                </h3>
                <p class="text-gray-300">{{ project.duration }}</p>
              </div>
            </div>
          </div>

          <!-- Project Roadmap -->
          <div
            class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 space-y-6"
          >
            <div class="flex items-start gap-4">
              <UIcon
                name="i-heroicons-map"
                class="w-6 h-6 text-purple-400 mt-1 flex-shrink-0"
              />
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-white mb-4">
                  Project Roadmap
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="(phase, idx) in project.roadmap || []"
                    :key="idx"
                    class="flex items-start gap-3"
                  >
                    <div
                      class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold"
                    >
                      {{ idx + 1 }}
                    </div>
                    <div class="pt-1">
                      <p class="text-gray-200 font-medium">{{ phase }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Members -->
          <div
            class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 space-y-6"
          >
            <div class="flex items-start gap-4">
              <UIcon
                name="i-heroicons-users"
                class="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0"
              />
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-white mb-4">
                  Project Team
                </h3>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div
                    v-for="(member, idx) in project.members || []"
                    :key="idx"
                    class="flex items-center gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                  >
                    <img
                      :src="member.image"
                      :alt="member.name"
                      class="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <p class="text-gray-200 font-medium truncate">
                      {{ member.name }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Skills Used -->
          <div
            class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6"
          >
            <div class="flex items-start gap-4">
              <UIcon
                name="i-heroicons-wrench-screwdriver"
                class="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0"
              />
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-white mb-4">
                  Skills & Technologies
                </h3>
                <div class="flex gap-2 flex-wrap">
                  <span
                    v-for="skill in project.technologies || []"
                    :key="skill"
                    class="px-3 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
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
          <!-- Statistics Card -->
          <div
            class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 space-y-4"
          >
            <h3 class="text-lg font-semibold text-white">Statistics</h3>

            <!-- Views -->
            <div
              class="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
            >
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-eye" class="w-5 h-5 text-blue-400" />
                <span class="text-gray-300">Views</span>
              </div>
              <span class="text-white font-semibold">{{ project.views }}</span>
            </div>

            <!-- Likes -->
            <div
              class="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
            >
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-heart" class="w-5 h-5 text-red-400" />
                <span class="text-gray-300">Likes</span>
              </div>
              <span class="text-white font-semibold">{{ project.likes }}</span>
            </div>
          </div>

          <!-- Lead Developer -->
          <div
            v-if="project.author"
            class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 space-y-4"
          >
            <h3 class="text-lg font-semibold text-white">Lead Developer</h3>
            <div class="flex items-center gap-4">
              <img
                :src="project.author.avatar"
                :alt="project.author.name"
                class="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p class="text-white font-semibold">
                  {{ project.author.name }}
                </p>
                <p class="text-gray-400 text-sm">
                  {{ project.author.program }} - {{ project.author.year }}
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <!-- Like Button -->
            <button
              @click="toggleLike"
              :class="[
                'w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2',
                isLiked
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/50'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600 border border-slate-600 hover:border-pink-500/50',
              ]"
            >
              <UIcon
                :name="
                  isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'
                "
                class="w-5 h-5"
              />
              {{ isLiked ? "Liked" : "Like Project" }}
            </button>

            <!-- Share Button -->
            <UButton
              color="gray"
              icon="i-heroicons-share-20-solid"
              class="w-full"
              size="lg"
            >
              Share Project
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useProjectStore } from "~/stores/projects";

const route = useRoute();
const projectStore = useProjectStore();
const projectId = parseInt(route.params.id);

// Get project from store
const project = ref(null);
const isLoading = ref(true);

// Load project data - ensure projects are fetched first
if (projectStore.projects.length === 0) {
  await projectStore.fetchProjects();
}

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

// Like functionality - persist in localStorage to prevent duplicate likes
const LIKED_PROJECTS_KEY = "likedProjects";

// Initialize liked projects from localStorage
const getLikedProjectsFromStorage = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(LIKED_PROJECTS_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  }
  return new Set();
};

const likedProjects = ref(getLikedProjectsFromStorage());

const isLiked = computed(() => {
  return likedProjects.value.has(project.value?.id);
});

const toggleLike = () => {
  if (!project.value) return;

  if (likedProjects.value.has(project.value.id)) {
    // Unlike: decrement count and remove from liked
    if (project.value.likes > 0) {
      project.value.likes--;
    }
    likedProjects.value.delete(project.value.id);
  } else {
    // Like: increment count and add to liked
    projectStore.likeProject(project.value.id);
    likedProjects.value.add(project.value.id);
  }

  // Persist to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(
      LIKED_PROJECTS_KEY,
      JSON.stringify([...likedProjects.value])
    );
  }
};

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
