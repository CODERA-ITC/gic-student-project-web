<template>
  <div
    class="rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-800/50 p-4 sm:p-5"
  >
    <div v-if="title || subtitle" class="mb-4">
      <h4 v-if="title" class="text-sm font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </h4>
      <p v-if="subtitle" class="mt-1 text-xs text-gray-500 dark:text-slate-400">
        {{ subtitle }}
      </p>
    </div>
    <div class="space-y-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
});
</script>
