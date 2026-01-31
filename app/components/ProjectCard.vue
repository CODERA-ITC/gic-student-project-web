<!-- components/FancyProjectCard.vue -->
<template>
  <div class="block group cursor-pointer">
    <div
      :class="[
        'relative h-full rounded-3xl overflow-hidden transition-all duration-300',
        'border border-white/70 dark:border-white/5 ring-1 ring-blue-500/10 hover:ring-blue-500/30',
        'bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 backdrop-blur-xl',
        'shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 dark:hover:shadow-blue-400/25 hover:-translate-y-1',
        'p-2 sm:p-3',
        'w-full max-w-sm mx-auto',
        'hover:cursor-pointer',
      ]"
    >
      <!-- Circular highlighted badge -->
      <template v-if="project.highlighted">
        <div class="absolute top-3 left-3 z-50">
          <UBadge icon="i-lucide-star" size="md" color="error" variant="solid">
            Highlighted
          </UBadge>
        </div>
      </template>

      <!-- Project Header Image Carousel -->
      <div
        class="relative h-70 flex items-center justify-center overflow-hidden rounded-2xl group bg-slate-100/70 dark:bg-slate-800/50 ring-1 ring-slate-200/60 dark:ring-slate-700/50"
      >
        <!-- Images Carousel -->
        <div
          v-if="hasValidImages"
          class="relative w-full h-full rounded-2xl overflow-hidden hover:shadow-xl p-1"
        >
          <!-- Views -->

          <img
            :src="currentImageUrl"
            :alt="project.name || 'Project image'"
            class="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 rounded-lg"
            @error="handleImageError"
          />

          <!-- Animated overlay on hover -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>

          <!-- Edit and Delete Icons (only show if showEditButton and isProjectAuthor) -->
          <div
            v-if="showEditButton && isProjectAuthor"
            class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          >
            <!-- Edit Icon -->
            <button
              @click.prevent.stop="$emit('edit', project.id)"
              class="p-2 bg-blue-900 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
              title="Edit project"
            >
              <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
            </button>

            <!-- Delete Icon -->
            <button
              @click.prevent.stop="$emit('delete', project.id)"
              class="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
              title="Delete project"
            >
              <UIcon name="i-heroicons-trash" class="w-5 h-5" />
            </button>
          </div>

          <!-- Image Navigation Dots (only if multiple images) -->
          <div
            v-if="project.images.length > 1"
            class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-10"
          >
            <button
              v-for="(_, idx) in project.images"
              :key="idx"
              @click.stop.prevent="handleDotClick(idx)"
              :class="[
                'w-2 h-2 rounded-full transition-all duration-300',
                idx === currentImageIndex
                  ? 'bg-white w-6'
                  : 'bg-white/40 hover:bg-white/70',
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Project Content -->
      <div class="p-5 space-y-4 flex flex-col gap-2">
        <!-- Title and Meta Info -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-1">
            <h3
              class="text-lg font-semibold text-slate-900 dark:text-white transition-colors line-clamp-2 mb-1"
            >
              {{ project.name }}
            </h3>

            <!-- Insert the Category and view here -->

            <div class="flex flex-col gap-3 items-end">
              <button
                v-if="showLikeButton"
                @click.prevent.stop="toggleLikeHandler"
                :class="[
                  'flex items-center justify-center transition-all duration-300 cursor-pointer w-10 h-10 rounded-full',
                  isLiked
                    ? 'bg-red-50 dark:bg-red-900/20 shadow-inner shadow-red-500/10'
                    : 'bg-white/80 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-700',
                ]"
                :title="isLiked ? 'Remove favorite' : 'Add favorite'"
                type="button"
              >
                <UIcon
                  :name="
                    isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'
                  "
                  :class="[
                    'w-5 h-5 transition-all duration-300',
                    isLiked
                      ? 'text-red-600 dark:text-red-400 scale-110'
                      : 'text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:scale-110',
                  ]"
                />
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span
              class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              <UIcon
                name="i-heroicons-swatch"
                class="w-3.5 h-3.5 text-blue-600 dark:text-blue-300"
              />
              <span class="font-semibold">{{ project.category }}</span>
            </span>
            <span
              class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-900/80 dark:text-blue-200 border border-blue-100 dark:border-blue-800"
            >
              <UIcon
                name="i-heroicons-eye"
                class="w-3.5 h-3.5 text-blue-700 dark:text-blue-300"
              />
              {{ formatNumber(project.views) }}
            </span>
            <span
              class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-200 border border-rose-100 dark:border-rose-800"
            >
              <UIcon
                name="i-heroicons-heart-solid"
                class="w-3.5 h-3.5 text-rose-600 dark:text-rose-300"
              />
              {{ formatNumber(project.likes) }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p
          class="text-blue-900/70 dark:text-gray-300/70 text-sm leading-relaxed line-clamp-2"
        >
          {{ project.description }}
        </p>

        <!-- Team Members -->
        <div class="flex content-center items-center justify-between">
          <div v-if="project.members && project.members.length > 0">
            <div class="flex items-center gap-1">
              <div
                v-for="(member, idx) in project.members.slice(0, 3)"
                :key="idx"
                class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-blue-900/80 dark:bg-blue-600/80 text-white text-xs font-semibold cursor-pointer transition-transform hover:scale-110 hover:bg-blue-800 dark:hover:bg-blue-500"
                :title="member.name"
              >
                <!-- Profile photo available -->
                <img
                  v-if="member.image"
                  :src="member.image"
                  alt="Member photo"
                  class="w-full h-full object-cover"
                />

                <!-- Fallback initial -->
                <!-- <span v-else class="text-sm">
                  {{ (member.name || member).charAt(0).toUpperCase() }}
                </span> -->
              </div>

              <!-- +X more -->
              <span
                v-if="project.members.length > 3"
                class="text-xs text-blue-900/60 dark:text-blue-400/60 ml-1"
              >
                +{{ project.members.length - 3 }}
              </span>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-2">
            <!-- Edit button (only for project authors) -->
            <!-- <ButtonsPresetButton
              v-if="showEditButton && isProjectAuthor"
              preset="edit"
              size="sm"
              :to="`/projects/create?edit=${project.id}`"
            /> -->

            <!-- View button -->
            <ButtonsPresetButton
              preset="viewDetails"
              size="sm"
              :to="`${baseRoute}/${project.id}`"
              class="!rounded-full !px-4 !py-2 !font-semibold !shadow-lg hover:!shadow-xl hover:-translate-y-0.5 !transition-all !duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useAuthStore } from "~/stores/auth";

// Get auth store
const authStore = useAuthStore();

const props = defineProps({
  baseRoute: {
    type: String,
    default: "/projects",
  },
  showLikeButton: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: false,
  },
  project: {
    type: Object,
    required: true,
    validator: (obj) => {
      return (
        obj.id &&
        obj.name &&
        obj.description &&
        obj.category &&
        obj.semester &&
        (obj.images || obj.emoji || obj.gradient) &&
        obj.views !== undefined &&
        obj.likes !== undefined &&
        (!obj.members ||
          (Array.isArray(obj.members) && obj.members.every((m) => m && m.name)))
      );
    },
  },
  likedProjects: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["toggle-like", "edit", "delete"]);

const currentImageIndex = ref(0);
let autoPlayInterval = null;

// Computed property to get the current valid image URL
const currentImageUrl = computed(() => {
  if (
    !props.project?.images ||
    !Array.isArray(props.project.images) ||
    props.project.images.length === 0
  ) {
    return null;
  }

  const currentImage = props.project.images[currentImageIndex.value];
  if (!currentImage) {
    return null;
  }

  const thumbnailUrl = currentImage.thumbnailUrl?.toString().trim();
  const originalUrl = currentImage.originalUrl?.toString().trim();

  // Return first valid URL found, or null if both are empty
  return thumbnailUrl || originalUrl || null;
});

// Computed to check if we have valid images to display
const hasValidImages = computed(() => {
  return (
    props.project?.images &&
    Array.isArray(props.project.images) &&
    props.project.images.length > 0 &&
    currentImageUrl.value !== null
  );
});

const isLiked = computed(() => {
  // Check if likedProjects is a Set or an object
  if (props.likedProjects instanceof Set) {
    return props.likedProjects.has(props.project?.id);
  }
  // Fallback for object-based liked projects
  return !!props.likedProjects?.[props.project?.id];
});

// Check if current user is the project author
const isProjectAuthor = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user || !props.project?.author) {
    return false;
  }

  // Compare by name (in a real app, you'd use user IDs)
  return authStore.user.id === props.project.author.id;
});

const toggleLikeHandler = () => {
  emit("toggle-like", props.project.id);

  console.log(
    `Toggled like for project ID: ${props.project.id}, new like status: ${
      isLiked.value ? "liked" : "unliked"
    }`,
  );
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

const handleImageError = (event) => {
  console.error("Image failed to load:", event.target.src);
  // If current image fails, try to move to next valid image
  const images = props.project?.images || [];
  if (images.length > 1) {
    // Try next image
    const nextIndex = (currentImageIndex.value + 1) % images.length;
    if (nextIndex !== currentImageIndex.value) {
      currentImageIndex.value = nextIndex;
    }
  }
};

const startAutoPlay = () => {
  // Only run on client side and if multiple images
  if (typeof window === "undefined") return;

  // Clear any existing interval first
  stopAutoPlay();

  if (
    props.project?.images &&
    Array.isArray(props.project.images) &&
    props.project.images.length > 1
  ) {
    autoPlayInterval = setInterval(() => {
      // Simple increment with wrap-around
      currentImageIndex.value =
        (currentImageIndex.value + 1) % props.project.images.length;
    }, 4000);
  }
};

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
};

const handleDotClick = (index) => {
  currentImageIndex.value = index;
  // Restart autoplay after manual navigation
  stopAutoPlay();
  startAutoPlay();
};

// Watch for project changes and reset image index
watch(
  () => props.project?.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      // Reset to first image when project changes
      currentImageIndex.value = 0;
      // Restart autoplay with new project images
      stopAutoPlay();
      startAutoPlay();
    }
  },
);
// Watch for images array changes (handles async loading)
watch(
  () => props.project?.images,
  (newImages, oldImages) => {
    // If images changed or loaded after initial render
    if (newImages && newImages !== oldImages) {
      // Ensure current index is valid - reset if out of bounds or if no valid image at current index
      if (
        currentImageIndex.value >= newImages.length ||
        !newImages[currentImageIndex.value] ||
        (!newImages[currentImageIndex.value].thumbnailUrl &&
          !newImages[currentImageIndex.value].originalUrl)
      ) {
        currentImageIndex.value = 0;
      }
      // Restart autoplay with new images
      stopAutoPlay();
      startAutoPlay();
    }
  },
  { deep: true, immediate: true },
);

onMounted(() => {
  // Reset image index on mount
  currentImageIndex.value = 0;
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
  // Reset image index on unmount for cleanup
  currentImageIndex.value = 0;
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
