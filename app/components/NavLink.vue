<template>
  <NuxtLink :to="to" class="group relative px-4 py-2 font-medium transition-all duration-300 flex items-center gap-2"
    :class="[
      isActive
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-gray-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400',
      mobileClass,
    ]">
    <!-- Icon slot -->
    <slot name="icon"></slot>

    <!-- Label -->
    <span>{{ label }}</span>

    <!-- Desktop gradient underline (animated) -->
    <span v-if="!mobile" :class="[
      'absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-400 rounded-full transition-all duration-500',
      isActive
        ? 'left-0 right-0 h-1 opacity-100 shadow-lg shadow-blue-500/30 dark:shadow-blue-400/30'
        : 'left-1/2 right-1/2 opacity-0 group-hover:left-0 group-hover:right-0 group-hover:opacity-100 group-hover:h-0.5',
    ]"></span>

    <!-- Mobile highlight (left border + background) -->
    <span v-if="mobile && isActive"
      class="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950 dark:to-transparent opacity-50 dark:opacity-30 rounded-lg -z-10"></span>
  </NuxtLink>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  mobile: {
    type: Boolean,
    default: false,
  },
  mobileClass: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
/* Smooth animation for underline */
:deep(.group) {
  position: relative;
}
</style>