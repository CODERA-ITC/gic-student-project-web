<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
    <UContainer class="max-w-5xl">
      <div class="mb-8">
        <nav class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-3">
          <NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-300">Home</NuxtLink>
          <span>/</span>
          <span class="font-medium text-slate-900 dark:text-white">Docs</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-white">
          Project Documentation
        </h1>
        <p class="mt-2 text-slate-600 dark:text-slate-300">
          Important internal docs for project structure, state management, and middleware.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          v-for="doc in projectDocs"
          :key="doc.slug"
          :to="`/docs/${doc.slug}`"
          class="group rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300">
                {{ doc.title }}
              </h2>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {{ doc.description }}
              </p>
            </div>
            <UIcon name="i-heroicons-arrow-up-right" class="w-5 h-5 text-slate-400 group-hover:text-blue-500 shrink-0" />
          </div>
        </NuxtLink>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { projectDocs } from "~/lib/docs/catalog";

useHead({
  title: "Docs - GIC Student Project Web",
  meta: [
    {
      name: "description",
      content: "Internal project documentation pages for architecture and development workflows.",
    },
  ],
});
</script>
