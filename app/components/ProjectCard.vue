<template>
  <NuxtLink :to="`/projects/${project.id}`" class="block group cursor-pointer">
    <div :class="[
      'relative h-full rounded-xl overflow-hidden transition-all duration-300',
      'border border-gray-200 dark:border-slate-700 group-hover:border-blue-500/70',
      'bg-white dark:bg-slate-800/50 backdrop-blur group-hover:bg-gray-50 dark:group-hover:bg-slate-800/80',
      'shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/20',
    ]">
      <!-- Project Header Image -->
      <div :class="[
        'h-40 -m-0 flex items-center justify-center text-6xl relative overflow-hidden',
        project.gradient,
      ]">
        <!-- Animated background effect on hover -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        </div>
        <span class="relative z-10 group-hover:scale-110 transition-transform duration-300">
          {{ project.emoji }}
        </span>
      </div>

      <!-- Project Content -->
      <div class="p-5 space-y-3">
        <!-- Title and Category Row -->
        <div>
          <div class="flex gap-2 mb-2">
            <UBadge color="secondary" variant="soft" size="x">
              {{ project.category }}
            </UBadge>
          </div>
          <h3
            class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
            {{ project.title }}
          </h3>
        </div>

        <!-- Short Description -->
        <p class="text-gray-600 dark:text-gray-300 text-xs leading-relaxed line-clamp-2">
          {{ project.description }}
        </p>

        <!-- Author with Skills -->
        <div class="flex items-center gap-2 pt-2">
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {{ project.author.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {{ project.author }}
            </p>
            <div v-if="project.skills && project.skills.length > 0" class="flex gap-1 mt-0.5">
              <span v-for="(skill, idx) in project.skills.slice(0, 2)" :key="idx"
                class="inline-block text-xs px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-200 font-medium whitespace-nowrap line-clamp-1">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <!-- Team Members -->
        <div v-if="project.members && project.members.length > 0" class="pt-2">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Team Members</p>
          <div class="flex items-center gap-2 flex-wrap">
            <div v-for="(member, idx) in project.members" :key="idx"
              class="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform cursor-pointer"
              :title="member">
              {{ member.charAt(0) }}
            </div>
            <span v-if="project.members.length > 3" class="text-xs text-gray-500 dark:text-gray-400">
              +{{ project.members.length - 3 }} more
            </span>
          </div>
        </div>

        <!-- Stats Row with Icons -->
        <div class="flex gap-4 pt-3 border-t border-gray-200 dark:border-slate-700/50">
          <!-- Views -->
          <div class="flex items-center gap-1">
            <UIcon name="i-heroicons-eye"
              class="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            <span
              class="text-xs text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors font-medium">
              {{ project.views }}
            </span>
          </div>

          <!-- Likes - Clickable -->
          <button @click.prevent.stop="toggleLikeHandler" :class="[
            'flex items-center gap-1 transition-all duration-300 cursor-pointer',
            isLiked
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400',
          ]" :title="isLiked ? 'Unlike' : 'Like'" type="button">
            <UIcon :name="isLiked
                ? 'i-heroicons-hand-thumb-up-solid'
                : 'i-heroicons-hand-thumb-up'
              " :class="[
                'w-4 h-4 transition-transform duration-300',
                isLiked ? 'scale-125' : 'group-hover:scale-110',
              ]" />
            <span :class="[
              'text-xs font-medium transition-colors duration-300',
              isLiked
                ? 'text-blue-600 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-300',
            ]">
              {{ project.likes }}
            </span>
          </button>

          <!-- Rating -->
          <button @click.stop
            class="flex items-center gap-1 ml-auto cursor-pointer group/rating hover:scale-110 transition-transform"
            :title="`${project.rating} / 5`">
            <UIcon name="i-heroicons-star" class="w-4 h-4 text-yellow-400 group-hover/rating:text-yellow-300" />
            <span class="text-xs text-yellow-300 font-medium">
              {{ project.rating }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { computed } from "vue";

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
        obj.emoji &&
        obj.gradient &&
        obj.author &&
        obj.views &&
        obj.likes &&
        obj.rating
      );
    },
  },
  likedProjects: {
    type: Set,
    required: true,
  },
});

const emit = defineEmits(["toggle-like"]);

const isLiked = computed(() => {
  return props.likedProjects.has(props.project.id);
});

const toggleLikeHandler = () => {
  emit("toggle-like", props.project.id);
};
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
