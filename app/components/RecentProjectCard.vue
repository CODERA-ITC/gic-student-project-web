<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700/50"
  >
    <div class="p-6">
      <div class="flex justify-end mb-3">
        <span
          :class="
            getStatusBadgeClass(
              project.submissionStatus ||
                project.projectStatus ||
                project.status,
            )
          "
          class="px-3 py-1 rounded-full text-xs font-medium"
        >
          {{
            (
              project.submissionStatus ||
              project.projectStatus ||
              project.status ||
              "pending"
            ).toUpperCase()
          }}
        </span>
      </div>

      <div class="flex items-center gap-3 mb-4">
        <div
          v-if="project.author?.avatar"
          class="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-gray-100 dark:ring-slate-700"
        >
          <img
            :src="project.author.avatar"
            :alt="project.author.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white text-sm font-semibold shrink-0 ring-2 ring-gray-100 dark:ring-slate-700"
        >
          {{ (project.author?.name || "U").charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <div
            class="text-sm font-semibold text-black dark:text-white truncate"
          >
            {{ project.author?.name || project.authorName || "Unknown" }}
          </div>
          <div class="text-xs text-gray-500 dark:text-slate-400 truncate">
            {{ project.author?.email || "—" }}
          </div>
        </div>
      </div>

      <div class="mb-4">
        <h3
          class="font-semibold text-base text-black dark:text-white mb-2 line-clamp-1"
        >
          {{ project.name }}
        </h3>
        <p
          class="text-sm text-gray-600 dark:text-slate-400 line-clamp-2 leading-relaxed"
        >
          {{ project.description }}
        </p>
      </div>

      <div
        class="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-slate-400"
      >
        <div class="flex items-center gap-1.5">
          <UIcon name="i-heroicons-tag" class="w-4 h-4" />
          <span>{{ project.category?.name || project.category || "—" }}</span>
        </div>
      </div>

      <div class="border-t border-gray-100 dark:border-slate-700 mb-4"></div>

      <div class="flex items-center justify-between gap-3">
        <div
          class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400"
        >
          <UIcon name="i-heroicons-clock" class="w-4 h-4" />
          <span>{{ formatDate(project.updatedAt || project.createdAt) }}</span>
        </div>
        <ButtonsPresetButton
          preset="primary"
          label="View"
          icon="i-heroicons-arrow-right"
          size="xs"
          :to="viewLink"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  viewBase: {
    type: String,
    default: "/teacher/submissions/",
  },
});

const viewLink = computed(() => `${props.viewBase}${props.project.id}`);

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
};

const getStatusBadgeClass = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "accepted")
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (s === "pending" || s === "submitted")
    return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  if (s === "draft")
    return "bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  if (s === "rejected")
    return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200";
};
</script>
