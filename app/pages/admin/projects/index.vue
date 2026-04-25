<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Hero -->
    <div class="py-14 relative overflow-hidden">
      <div class="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl" />
      <div class="absolute -bottom-32 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />

      <UContainer>
        <div
          class="relative overflow-hidden rounded-3xl border border-white/10 ring-1 ring-blue-500/15 bg-white/90 dark:bg-slate-900/90 shadow-2xl px-8 py-10">
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(79,70,229,0.08),transparent_30%)]" />

          <div class="relative space-y-3">
            <nav class="flex items-center flex-wrap gap-1 text-sm text-slate-600 dark:text-slate-300">
              <NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors">Home</NuxtLink>
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <NuxtLink to="/admin/dashboard" class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                Admin Dashboard
              </NuxtLink>
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <span class="text-slate-900 dark:text-white font-semibold">Project Management</span>
            </nav>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-clipboard-document-check" class="w-10 h-10 text-blue-500 dark:text-blue-300" />
              <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Project Management
              </h1>
            </div>
            <p class="text-slate-700 dark:text-slate-300">
              Review, approve, reject, and highlight submissions across
              departments.
            </p>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Body -->
    <UContainer class="pb-14 space-y-6">
      <!-- Filters -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
        <div class="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <div class="flex-1 relative">
            <UIcon name="i-heroicons-magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
            <input v-model="search" type="text" placeholder="Search by project name or description..."
              class="w-full pl-10 pr-4 py-2 min-h-[44px] bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              @keyup.enter="applyFilters" />
          </div>

          <USelect v-model="selectedCategory" :items="categoryOptions" :ui="{ base: '!rounded-3xl !min-h-[44px]' }"
            class="w-full sm:w-52 [&_button]:!rounded-3xl [&_button]:min-h-[44px]" placeholder="All categories" />

          <USelect v-model="selectedStatus" :items="statusOptions" :ui="{ base: '!rounded-3xl !min-h-[44px]' }"
            class="w-full sm:w-48 [&_button]:!rounded-3xl [&_button]:min-h-[44px]" placeholder="Filter by status" />

          <ButtonsPresetButton label="Refresh" color="primary" variant="outline" size="sm"
            :class="['text-blue-800 border-blue-800 hover:text-blue-700 hover:border-blue-700']"
            icon="i-heroicons-arrow-path" :loading="loading" @click="applyFilters" />

          <div class="flex lg:ml-auto rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
            <ButtonsPresetButton label="Grid" icon="i-heroicons-squares-2x2" size="sm"
              :variant="viewMode === 'grid' ? 'solid' : 'ghost'" :class="[
                'rounded-lg transition-all',
                viewMode === 'grid'
                  ? 'bg-blue-800 text-white hover:bg-blue-700'
                  : 'text-gray-600 dark:text-gray-300',
              ]" @click="viewMode = 'grid'" />

            <ButtonsPresetButton label="List" icon="i-heroicons-list-bullet" size="sm"
              :variant="viewMode === 'list' ? 'solid' : 'ghost'" :class="[
                'rounded-lg transition-all',
                viewMode === 'list'
                  ? 'bg-blue-800 text-white hover:bg-blue-700'
                  : 'text-gray-600 dark:text-gray-300',
              ]" @click="viewMode = 'list'" />
          </div>

        </div>
      </div>

      <!-- Projects grid -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div v-if="loading" class="space-y-3">
          <USkeleton class="h-48 w-full" />
          <USkeleton class="h-48 w-full" />
        </div>

        <div v-else-if="filteredProjects.length === 0"
          class="text-center py-12 text-sm text-gray-600 dark:text-slate-400">
          No projects found.
        </div>

        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="project in filteredProjects" :key="project.id" class="relative">
            <div class="absolute right-3 top-3 z-10">
              <span class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="getStatusBadgeClass(projectStatus(project))">
                {{ projectStatus(project).toUpperCase() }}
              </span>
            </div>

            <ProjectCard :project="project" :base-route="baseRoute" :show-like-button="false"
              :show-edit-button="false" />
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Project
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Created
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="project in filteredProjects" :key="project.id"
                class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img v-if="project.images && project.images[0]"
                      :src="project.images[0].thumbnailUrl || project.images[0].originalUrl"
                      :alt="project.name || 'Project'" class="w-12 h-12 rounded-lg object-cover" />
                    <div v-else
                      class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <UIcon name="i-heroicons-cube" class="w-6 h-6 text-white" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {{ project.name || "Untitled Project" }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {{ project.description || "No description" }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex text-center items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {{ project.category || "Uncategorized" }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusBadgeClass(projectStatus(project))">
                    {{ projectStatus(project).toUpperCase() }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                  {{ formatDate(project.createdAt) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <ButtonsPresetButton label="View" icon="i-heroicons-eye" size="sm" variant="ghost"
                      :to="`${baseRoute}/${project.id}`" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "admin"],
});

import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import ProjectCard from "~/components/ProjectCard.vue";
import { useProjectStore } from "~/stores/projects";
import { SubmissionStatus } from "#imports";

const projectStore = useProjectStore();
const { projects, availableCategories, loading } = storeToRefs(projectStore);

const search = ref("");
const selectedStatus = ref("ALL");
const selectedCategory = ref("");
const viewMode = ref<"grid" | "list">("grid");
const statusOptions = ["ALL", "draft", "pending", "accepted", "rejected"];
const baseRoute = "/admin/projects";

const categoryOptions = computed(() => {
  return availableCategories.value?.length ? availableCategories.value : [];
});

const filteredProjects = computed(() => {
  const term = search.value.trim().toLowerCase();
  const status = selectedStatus.value;
  const category = selectedCategory.value;

  const normalizeCategory = (p: any) => {
    if (!p) return "";
    const cat = p.category;
    return (cat || "").toString().toLowerCase();
  };

  return (projects.value || [])
    .filter((p) => (status === "ALL" ? true : projectStatus(p) === status))
    .filter((p) =>
      !category ? true : normalizeCategory(p) === category.toLowerCase(),
    )
    .filter((p) =>
      term
        ? (p.name || "").toLowerCase().includes(term) ||
        (p.description || "").toLowerCase().includes(term)
        : true,
    );
});

const applyFilters = async () => {
  await projectStore.fetchProjects(1, 100);
};

const projectStatus = (p: any) =>
  (
    p.submissionStatus ||
    p.projectStatus ||
    p.status ||
    SubmissionStatus.PENDING
  )
    .toString()
    .toLowerCase();

const getStatusBadgeClass = (status: string) => {
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

const formatDate = (date: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
};

onMounted(async () => {
  if (!availableCategories.value.length) {
    await projectStore.fetchCategories();
  }
  if (!projects.value.length) {
    await projectStore.fetchProjects(1, 100);
  }
});
</script>
