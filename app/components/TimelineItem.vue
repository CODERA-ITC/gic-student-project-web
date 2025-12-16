<template>
  <div
    ref="itemRef"
    class="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 timeline-item-reveal opacity-0 translate-y-8"
    :style="{ transitionDelay: `${index * 0.15}s` }"
  >
    <!-- Left side card (for even index) -->
    <div v-if="index % 2 === 0" class="md:text-right">
      <div
        class="relative p-6 rounded-xl border transition-all duration-300 hover:shadow-lg"
        :class="statusClasses"
      >
        <!-- Status badge -->
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3"
          :class="statusBadgeClasses"
        >
          <div class="w-2 h-2 rounded-full" :class="statusDotClasses" />
          {{ statusText }}
        </div>

        <!-- Icon and Title -->
        <div class="flex items-start gap-3 mb-2 md:flex-row-reverse">
          <div class="p-2 rounded-lg shrink-0" :class="iconBgClasses">
            <UIcon
              :name="icon || 'i-heroicons-star'"
              class="w-5 h-5"
              :class="iconColorClasses"
            />
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ date }}
            </p>
          </div>
        </div>

        <!-- Description -->
        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- Empty space on mobile, left space on desktop for odd index -->
    <div v-else class="hidden md:block"></div>

    <!-- Timeline dot (centered) -->
    <div
      class="absolute left-0 md:left-1/2 top-0 md:transform md:-translate-x-1/2 flex items-center justify-center h-full"
    >
      <div
        class="w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 z-10"
        :class="dotClasses"
      />
    </div>

    <!-- Right side card (for odd index) -->
    <div v-if="index % 2 !== 0" class="md:text-left">
      <div
        class="relative p-6 rounded-xl border transition-all duration-300 hover:shadow-lg"
        :class="statusClasses"
      >
        <!-- Status badge -->
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3"
          :class="statusBadgeClasses"
        >
          <div class="w-2 h-2 rounded-full" :class="statusDotClasses" />
          {{ statusText }}
        </div>

        <!-- Icon and Title -->
        <div class="flex items-start gap-3 mb-2">
          <div class="p-2 rounded-lg shrink-0" :class="iconBgClasses">
            <UIcon
              :name="icon || 'i-heroicons-star'"
              class="w-5 h-5"
              :class="iconColorClasses"
            />
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ date }}
            </p>
          </div>
        </div>

        <!-- Description -->
        <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- Empty space on mobile, right space on desktop for even index -->
    <div v-else class="hidden md:block"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";

const itemRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    validator: (value: string) =>
      ["completed", "in-progress", "upcoming", "done"].includes(value),
  },
  icon: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

// Normalize status (handle both 'done' and 'completed')
const normalizedStatus = computed(() => {
  return props.status === "" ? "completed" : props.status;
});

// Status text
const statusText = computed(() => {
  switch (normalizedStatus.value) {
    case "completed":
      return "Completed";
    case "in-progress":
      return "In Progress";
    case "upcoming":
      return "Upcoming";
    default:
      return "Unknown";
  }
});

// Status-based styling
const statusClasses = computed(() => {
  switch (normalizedStatus.value) {
    case "completed":
      return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    case "in-progress":
      return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    case "upcoming":
      return "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700";
    default:
      return "";
  }
});

const statusBadgeClasses = computed(() => {
  switch (normalizedStatus.value) {
    case "completed":
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    case "in-progress":
      return "bg-blue-900 dark:bg-blue-800 text-white";
    case "upcoming":
      return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    default:
      return "";
  }
});

const statusDotClasses = computed(() => {
  switch (normalizedStatus.value) {
    case "completed":
      return "bg-green-500 animate-pulse";
    case "in-progress":
      return "bg-white animate-pulse";
    case "upcoming":
      return "bg-gray-400";
    default:
      return "";
  }
});

const dotClasses = computed(() => {
  switch (normalizedStatus.value) {
    case "completed":
      return "bg-green-500";
    case "in-progress":
      return "bg-blue-900";
    case "upcoming":
      return "bg-gray-300 dark:bg-gray-600";
    default:
      return "";
  }
});

const iconBgClasses = computed(() => {
  switch (normalizedStatus.value) {
    case "completed":
      return "bg-green-100 dark:bg-green-900/30";
    case "in-progress":
      return "bg-blue-900/10 dark:bg-blue-800/20";
    case "upcoming":
      return "bg-gray-100 dark:bg-gray-700";
    default:
      return "";
  }
});

const iconColorClasses = computed(() => {
  switch (normalizedStatus.value) {
    case "completed":
      return "text-green-600 dark:text-green-400";
    case "in-progress":
      return "text-blue-900 dark:text-blue-300";
    case "upcoming":
      return "text-gray-500 dark:text-gray-400";
    default:
      return "";
  }
});

// Scroll reveal animation
onMounted(() => {
  if (itemRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Optional: unobserve after animation to improve performance
            observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(itemRef.value);
  }
});

onUnmounted(() => {
  if (observer && itemRef.value) {
    observer.unobserve(itemRef.value);
  }
});
</script>

<style scoped>
.timeline-item-reveal {
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.timeline-item-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
