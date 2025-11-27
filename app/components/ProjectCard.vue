<!-- components/FancyProjectCard.vue -->
<template>
  <div class="block group cursor-pointer">
    <div
      :class="[
        'relative h-full rounded-xl overflow-hidden transition-all duration-300',
        'border border-slate-700 ',
        'bg-white backdrop-blur ',
        'shadow-lg group-hover:shadow-2xl',
        'p-1',
        'w-full max-w-lg mx-auto',
      ]"
    >
      <!-- Project Header Image Carousel -->
      <div
        class="relative h-64 flex items-center justify-center overflow-hidden bg-slate-900 rounded-lg group"
      >
        <!-- Images Carousel -->
        <div
          v-if="project.images && project.images.length > 0"
          class="relative w-full h-full rounded-lg overflow-hidden hover:shadow-xl"
        >
          <span
            class="absolute z-20 floating-text top-2 left-2 text-white px-2 py-1 rounded-md text-xs mix-blend-difference"
          >
            {{ project.category }} {{ project.year }} -
            {{ project.semester }}
          </span>

          <div
            class="absolute z-20 top-2 right-2 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 mix-blend-difference"
          >
            <UIcon
              name="i-heroicons-eye"
              class="w-4 h-4 text-white/80 transition-colors"
            />

            <span class="text-xs text-white/80 font-medium transition-colors">
              {{ formatNumber(project.views) }}
            </span>
          </div>

          <!-- Views -->

          <img
            :src="project.images[currentImageIndex]"
            :alt="project.title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <!-- Animated overlay on hover -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>

          <!-- Image Navigation Dots (only if multiple images) -->
          <div
            v-if="project.images.length > 1"
            class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-10"
          >
            <button
              v-for="(_, idx) in project.images"
              :key="idx"
              @click.stop="currentImageIndex = idx"
              :class="[
                'w-2 h-2 rounded-full transition-all duration-300',
                idx === currentImageIndex
                  ? 'bg-white w-6'
                  : 'bg-white/40 hover:bg-white/70',
              ]"
            />
          </div>
        </div>

        <!-- Fallback: Emoji display if no images -->
        <div v-else :class="['absolute inset-0', project.gradient]">
          <div class="w-full h-full flex items-center justify-center text-6xl">
            <span
              class="group-hover:scale-110 transition-transform duration-300"
            >
              {{ project.emoji }}
            </span>
          </div>
        </div>
      </div>

      <!-- Project Content -->
      <div class="p-5 space-y-4">
        <!-- Title and Meta Info -->
        <div class="flex items-center justify-between mb-2">
          <h3
            class="text-lg font-simi text-black transition-colors line-clamp-2 mb-1"
          >
            {{ project.title }}
          </h3>
          <div>
            <button
              @click.prevent.stop="toggleLikeHandler"
              :class="[
                'flex items-center gap-1.5 transition-all duration-300 cursor-pointer',

                'text-gray-700 ',
              ]"
              :title="isLiked ? 'Remove favorite' : 'Add favorite'"
              type="button"
            >
              <UIcon
                :name="
                  isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'
                "
                :class="[
                  'w-5 h-5 transition-transform duration-300',
                  isLiked ? 'scale-125' : 'group-hover:scale-110',
                ]"
              />
              <span
                :class="[
                  'text-xs font-medium transition-colors duration-300',

                  'text-gray-700',
                ]"
              >
                {{ formatNumber(project.likes) }}
              </span>
            </button>
          </div>
        </div>

        <!-- Description -->
        <p class="text-gray-700 text-sm leading-relaxed line-clamp-2">
          {{ project.description }}
        </p>

        <!-- Team Members -->
        <div class="flex content-center items-center justify-between">
          <div v-if="project.members && project.members.length > 0">
            <div class="flex items-center gap-1">
              <div
                v-for="(member, idx) in project.members.slice(0, 3)"
                :key="idx"
                class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-slate-700/70 text-white text-xs font-bold cursor-pointer transition-transform hover:scale-110"
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
                <span v-else class="text-sm">
                  {{ (member.name || member).charAt(0).toUpperCase() }}
                </span>
              </div>

              <!-- +X more -->
              <span
                v-if="project.members.length > 3"
                class="text-xs text-gray-500 ml-1"
              >
                +{{ project.members.length - 3 }}
              </span>
            </div>
          </div>

          <!-- View button -->
          <span>
            <ButtonsPresetButton
              preset="viewDetails"
              :to="`/projects/${project.id}`"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
    validator: (obj) => {
      return (
        obj.id &&
        obj.title &&
        obj.description &&
        obj.category &&
        obj.year &&
        obj.semester &&
        (obj.images || obj.emoji) &&
        obj.views &&
        obj.likes &&
        Array.isArray(obj.members) &&
        obj.members.every((m) => m && m.name)
      );
    },
  },
  likedProjects: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["toggle-like"]);

const currentImageIndex = ref(0);
let autoPlayInterval = null;

const isLiked = computed(() => {
  return !!props.likedProjects[props.project.id];
});

const toggleLikeHandler = () => {
  emit("toggle-like", props.project.id);
};

const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

const startAutoPlay = () => {
  if (props.project.images && props.project.images.length > 1) {
    autoPlayInterval = setInterval(() => {
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

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
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
