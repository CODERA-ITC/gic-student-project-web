<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header Section -->
    <div class="relative overflow-hidden py-16">
      <!-- Ambient blobs -->
      <div class="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/40 rounded-full blur-3xl" aria-hidden="true"></div>
      <div class="absolute -bottom-32 right-0 w-96 h-96 bg-indigo-600/40 rounded-full blur-3xl" aria-hidden="true">
      </div>
      <div class="absolute top-10 right-24 w-52 h-52 bg-cyan-400/30 rounded-full blur-3xl" aria-hidden="true"></div>

      <UContainer>
        <div
          class="relative overflow-hidden rounded-3xl border border-white/10 ring-1 ring-blue-500/20 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-700 text-white shadow-2xl">
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_30%)]"
            aria-hidden="true"></div>

          <div class="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 sm:p-10">
            <div class="flex flex-col items-start gap-4 mb-2 w-full">
              <nav class="flex items-center flex-wrap gap-1 text-sm text-slate-600 dark:text-slate-300">
                <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.label">
                  <NuxtLink :to="crumb.to || undefined" :class="[
                    'transition-colors  ',
                    crumb.to
                      ? 'hover:text-blue-700 text-white dark:hover:text-blue-300'
                      : 'text-slate-300 dark:text-white font-semibold',
                  ]">
                    {{ crumb.label }}
                  </NuxtLink>
                  <span v-if="idx < breadcrumbs.length - 1" class="text-slate-400 dark:text-slate-500">/</span>
                </template>
              </nav>
              <div class="space-y-3">
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-semiboldl text-white leading-tight">
                  My Projects
                </h1>
                <p class="text-slate-300 dark:text-slate-300">
                  Create, manage, and organize all your projects
                </p>
              </div>
            </div>

            <div class="flex gap-3">
              <ButtonsPresetButton preset="createProject" to="/projects/create" color="neutral" variant="solid"
                class="!bg-white !text-blue-700 hover:!bg-blue-50 dark:!bg-slate-800 dark:!text-blue-200 dark:hover:!bg-slate-700 shadow-lg" />
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <!-- Tabs -->
      <div class="flex gap-4 mb-8 border-b border-gray-200 dark:border-slate-700">
        <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value" :class="[
          'px-6 py-3 font-semibold transition-all duration-200 border-b-2',
          activeTab === tab.value
            ? 'text-blue-500 dark:text-blue-400 border-blue-500 dark:border-blue-400'
            : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-300',
        ]">
          {{ tab.label }}
          <span v-if="tab.count !== undefined"
            class="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 mb-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="relative flex-1 sm:flex-initial sm:w-80">
              <UIcon name="i-heroicons-magnifying-glass"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
              <input v-model="searchQuery" type="text" placeholder="Search projects..."
                class="w-full pl-9 pr-9 py-2 min-h-[44px] bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-3xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                @keyup.enter.prevent="applyImmediateSearch" @keyup.esc="clearSearch" />
              <div v-if="isSearching" class="absolute right-3 top-1/2 -translate-y-1/2">
                <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin text-blue-500" />
              </div>
            </div>
            <span class="text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">
              {{ totalProjects }} total
            </span>
          </div>
          <div class="flex gap-3 w-full sm:w-auto">
            <!-- <USelect
              v-model="selectedTag"
              :items="tagOptions"
              placeholder="All Tags"
              class="flex-1 sm:w-40"
            /> -->
            <USelect v-model="selectedCategory" :items="categoryOptions" placeholder="All Categories"
              :ui="{ base: '!rounded-3xl !min-h-[44px]' }"
              class="flex-1 sm:w-40 [&_button]:!rounded-3xl [&_button]:min-h-[44px]" />

            <!-- View Mode Toggle -->
            <div class="flex gap-1 bg-gray-100 dark:bg-slate-700 rounded-3xl p-1">
              <button @click="viewMode = 'grid'" :class="[
                'p-2 min-h-[44px] rounded-3xl transition-all duration-200',
                viewMode === 'grid'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600',
              ]" title="Grid View">
                <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
              </button>
              <button @click="viewMode = 'list'" :class="[
                'p-2 min-h-[44px] rounded-3xl transition-all duration-200',
                viewMode === 'list'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600',
              ]" title="List View">
                <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <EmptyState v-if="filteredProjects.length === 0" title="No projects found"
        description="Create your first project to get started" icon="i-heroicons-folder-plus"
        actionText="Create Project" actionTo="/projects/create" />

      <!-- Projects Section -->
      <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700">
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="p-6">
          <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            <ProjectCard v-for="project in paginatedProjects" :key="project.id" :project="project"
              base-route="/student/my-projects" :show-like-button="true" :show-edit-button="isOwnerOf(project)"
              :liked-projects="likedProjects" @toggle-like="handleToggleLike" @edit="handleEdit"
              @delete="handleDelete" />
          </div>
        </div>

        <!-- List View -->
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
              <tr v-for="project in paginatedProjects" :key="project.id"
                class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img v-if="project.images && project.images[0]" :src="project.images[0].thumbnailUrl"
                      :alt="project.title" class="w-12 h-12 rounded-lg object-cover" />
                    <div v-else
                      class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <UIcon name="i-heroicons-cube" class="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-900 dark:text-white">
                        {{ project.name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {{ project.description }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex text-center items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {{ project.category }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatus(project) === SubmissionStatus.ACCEPTED
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : getStatus(project) === SubmissionStatus.PENDING
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        : getStatus(project) === SubmissionStatus.DRAFT
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
                  ]">
                    {{ getStatusLabel(getStatus(project)) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                  {{ new Date(project.createdAt).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <UButton icon="i-heroicons-eye" size="xs" color="neutral" variant="ghost" label="View"
                      @click="navigateTo(`/student/my-projects/${project.id}`)" />
                    <template v-if="isOwnerOf(project)">
                      <UButton icon="i-heroicons-pencil" size="xs" color="neutral" variant="ghost" label="Edit"
                        @click="handleEdit(project.id)" />
                      <UButton icon="i-heroicons-trash" size="xs" color="error" variant="ghost" label="Delete"
                        @click="handleDelete(project.id)" />
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 pb-6 border-t border-gray-200 dark:border-slate-700 pt-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500 dark:text-slate-400">
              Showing {{ startIndex + 1 }} to
              {{ Math.min(endIndex, totalProjects) }} of
              {{ totalProjects }} projects
            </div>
            <div class="flex items-center gap-2">
              <UButton icon="i-heroicons-chevron-left" size="xs" variant="ghost" :disabled="currentPage === 1"
                @click="currentPage--" />
              <div class="flex items-center gap-1">
                <button v-for="page in displayedPages" :key="page" :class="[
                  'px-3 py-1 min-h-[44px] text-sm rounded-3xl transition-colors',
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700',
                ]" @click="currentPage = page">
                  {{ page }}
                </button>
              </div>
              <UButton icon="i-heroicons-chevron-right" size="xs" variant="ghost" :disabled="currentPage === totalPages"
                @click="currentPage++" />
            </div>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal v-model="showDeleteConfirm" :project-title="getProjectTitle(projectToDelete)"
      :is-deleting="isDeleting" @confirm="confirmDelete" />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth", "student"],
});

import { ref, computed, onMounted, watch } from "vue";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";
import { SubmissionStatus } from "#imports";

const projectStore = useProjectStore();
const authStore = useAuthStore();

const breadcrumbs = [
  { label: "Dashboard", to: "/student/dashboard" },
  { label: "My Projects" },
];

// Reactive data
const activeTab = ref("all");
const searchQuery = ref("");
const debouncedSearchQuery = ref("");
const selectedTag = ref("All Tags");
const selectedCategory = ref("All Categories");
const currentPage = ref(1);
const pageSize = ref(9);
const isSearching = ref(false);
const viewMode = ref("grid"); // Add view mode toggle

// Like functionality (persisted per user)
const likedProjects = ref({});

const likesStorageKey = computed(() => {
  const userId = authStore.user?.id || "guest";
  return `likedProjects_${userId}`;
});

// Persist likes for the current user
watch(
  likedProjects,
  (newLikes) => {
    if (process.client) {
      localStorage.setItem(likesStorageKey.value, JSON.stringify(newLikes));
    }
  },
  { deep: true },
);

// Reload likes when user changes (e.g., logout/login as another user)
watch(
  () => authStore.user?.id,
  (newUserId) => {
    if (!process.client) return;
    const savedLikes = localStorage.getItem(
      `likedProjects_${newUserId || "guest"}`,
    );
    likedProjects.value = savedLikes ? JSON.parse(savedLikes) : {};
  },
);

// Handle like toggle with local optimistic count
const handleToggleLike = (projectId) => {
  const nextLikes = { ...likedProjects.value };
  const project = myProjects.value.find((p) => p.id === projectId);

  if (nextLikes[projectId]) {
    delete nextLikes[projectId];
    if (project && project.likes > 0) {
      project.likes -= 1;
    }
  } else {
    nextLikes[projectId] = true;
    if (project) {
      project.likes += 1;
    }
  }

  likedProjects.value = nextLikes;
};

// Handle edit project
const handleEdit = (projectId) => {
  console.log("Edit project:", projectId);
  navigateTo(`/projects/create?edit=${projectId}`);
};

// Handle delete project
const showDeleteConfirm = ref(false);
const projectToDelete = ref(null);
const isDeleting = ref(false);

const handleDelete = (projectId) => {
  console.log("Delete project requested:", projectId);
  projectToDelete.value = projectId;
  showDeleteConfirm.value = true;
};

// Get project title for delete confirmation
const getProjectTitle = (projectId) => {
  if (!projectId) return "this project";
  const project = myProjects.value.find((p) => p.id === projectId);
  return project?.title || "this project";
};

const isOwnerOf = (project) => {
  if (!project || !authStore.user) return false;
  return project.author?.id === authStore.user.id;
};

const confirmDelete = async () => {
  console.log("Confirming delete for project:", projectToDelete.value);
  if (!projectToDelete.value) return;

  try {
    isDeleting.value = true;
    const deletedId = projectToDelete.value;
    console.log("Confirming delete for project:", deletedId);

    const result = await projectStore.deleteProject(deletedId);

    if (result) {
      const toast = useToast();
      toast.add({
        title: "Project Deleted",
        description: "Your project has been successfully deleted.",
        color: "success",
      });

      showDeleteConfirm.value = false;
      projectToDelete.value = null;

      // Refresh user projects from store
      await projectStore.fetchUserProjects();
    } else {
      throw new Error("Delete operation returned false");
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    const toast = useToast();
    toast.add({
      title: "Delete Failed",
      description: "Failed to delete project. Please try again.",
      color: "error",
    });
  } finally {
    isDeleting.value = false;
  }
};

// Check authentication
onMounted(async () => {
  // Restore authentication state from localStorage only if not already authenticated
  if (!authStore.isAuthenticated) {
    await authStore.restoreAuth();

    if (!authStore.isAuthenticated) {
      await navigateTo("/login");
      return;
    }
  }

  console.log("=== MY-PROJECTS PAGE MOUNTED ===");
  console.log("Projects in store before fetch:", {
    totalProjects: projectStore.projects.length,
    projectIds: projectStore.projects.map((p) => ({
      id: p.id,
      title: p.title,
      author: p.author?.name,
    })),
    totalUserProjects: projectStore.userProjects.length,
    userProjectIds: projectStore.userProjects.map((p) => ({
      id: p.id,
      title: p.title,
      author: p.author?.name,
    })),
    currentUser: authStore.user?.name,
  });

  // Load user's projects
  await projectStore.fetchUserProjects();

  // Load tags and categories for filters
  await projectStore.fetchTags();
  await projectStore.fetchCategories();

  console.log("Projects in store after fetch:", {
    totalUserProjects: projectStore.userProjects.length,
    userProjectIds: projectStore.userProjects.map((p) => ({
      id: p.id,
      title: p.title,
      author: p.author?.name,
    })),
  });

  // Load liked projects from localStorage
  if (process.client) {
    const savedLikes = localStorage.getItem(likesStorageKey.value);
    if (savedLikes) {
      likedProjects.value = JSON.parse(savedLikes);
    }
  }
});

// Computed data
const myProjects = computed(() => {
  return projectStore.userProjects || [];
});

const tabs = computed(() => [
  { label: "All Projects", value: "all", count: myProjects.value.length },
  {
    label: "Accepted",
    value: SubmissionStatus.ACCEPTED,
    count: getProjectsByStatus(SubmissionStatus.ACCEPTED).length,
  },
  {
    label: "Pending",
    value: SubmissionStatus.PENDING,
    count: getProjectsByStatus(SubmissionStatus.PENDING).length,
  },
  {
    label: "Draft",
    value: SubmissionStatus.DRAFT,
    count: getProjectsByStatus(SubmissionStatus.DRAFT).length,
  },
]);

const filteredProjects = computed(() => {
  let projects = myProjects.value;

  // Filter by tab
  if (activeTab.value !== "all") {
    projects = projects.filter((p) => getStatus(p) === activeTab.value);
  }

  // Filter by search query
  if (debouncedSearchQuery.value.trim()) {
    const query = debouncedSearchQuery.value.toLowerCase();
    projects = projects.filter(
      (p) =>
        (p.title || p.name || "").toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(query))) ||
        (p.technologies &&
          p.technologies.some((tech) => tech.toLowerCase().includes(query))) ||
        (p.members &&
          p.members.some((member) =>
            (typeof member === "string" ? member : member.name)
              .toLowerCase()
              .includes(query),
          )),
    );
  }

  // Filter by tag
  if (selectedTag.value && selectedTag.value !== "All Tags") {
    projects = projects.filter(
      (p) => p.tags && p.tags.includes(selectedTag.value),
    );
  }

  // Filter by category
  if (selectedCategory.value && selectedCategory.value !== "All Categories") {
    projects = projects.filter((p) => p.category === selectedCategory.value);
  }

  return projects;
});

const totalProjects = computed(() => filteredProjects.value.length);

const paginatedProjects = computed(() => {
  const start = startIndex.value;
  const end = endIndex.value;
  return filteredProjects.value.slice(start, end);
});

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value);
const endIndex = computed(() => startIndex.value + pageSize.value);

const totalPages = computed(() =>
  Math.ceil(totalProjects.value / pageSize.value),
);

const displayedPages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const tagOptions = computed(() => {
  if (!projectStore.availableTags || projectStore.availableTags.length === 0) {
    return ["All Tags"];
  }
  const tags = projectStore.availableTags.map((t) => t.label);
  return ["All Tags", ...tags];
});

const categoryOptions = computed(() => {
  if (
    !projectStore.availableCategories ||
    projectStore.availableCategories.length === 0
  ) {
    return ["All Categories"];
  }
  const categories = projectStore.availableCategories.filter(
    (c) => c !== "All",
  );
  return ["All Categories", ...categories];
});

// Search debouncing
let searchTimeout = null;
watch(searchQuery, (newQuery) => {
  isSearching.value = true;
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newQuery;
    isSearching.value = false;
    currentPage.value = 1; // Reset to first page on search
  }, 300);
});

// Instant search on Enter key
const applyImmediateSearch = () => {
  debouncedSearchQuery.value = searchQuery.value;
  isSearching.value = false;
  currentPage.value = 1;
};

// Clear search on Escape
const clearSearch = () => {
  searchQuery.value = "";
  debouncedSearchQuery.value = "";
  currentPage.value = 1;
};

// Reset pagination when filters change
watch([selectedTag, selectedCategory, activeTab], () => {
  currentPage.value = 1;
});

// Methods
const getProjectsByStatus = (status) =>
  myProjects.value.filter((p) => getStatus(p) === status);

const getQuickActions = (project) => {
  return [
    [
      {
        label: "Mark as Pending",
        icon: "i-heroicons-arrow-path-rounded-square",
        click: () => updateProjectStatus(project.id, SubmissionStatus.PENDING),
      },
    ],
    [
      {
        label: "Submit for Review",
        icon: "i-heroicons-paper-airplane",
        click: () => submitProjectForReview(project.id),
      },
    ],
    [
      {
        label: "Mark as Draft",
        icon: "i-heroicons-pencil-square",
        click: () => updateProjectStatus(project.id, SubmissionStatus.DRAFT),
      },
    ],
    [
      {
        label: "Mark as Accepted",
        icon: "i-heroicons-check-badge",
        click: () => updateProjectStatus(project.id, SubmissionStatus.ACCEPTED),
      },
    ],
  ];
};

const updateProjectStatus = async (projectId, newStatus) => {
  try {
    await projectStore.updateProjectStatus(projectId, newStatus);
    const toast = useToast();
    toast.add({
      title: "Status Updated",
      description: `Project status changed to ${newStatus}`,
      color: "green",
    });
    // Refresh projects
    await projectStore.fetchUserProjects();
  } catch (error) {
    const toast = useToast();
    toast.add({
      title: "Update Failed",
      description: "Failed to update project status",
      color: "red",
    });
  }
};

const submitProjectForReview = async (projectId) => {
  try {
    await projectStore.updateProjectStatus(projectId, SubmissionStatus.PENDING);
    const toast = useToast();
    toast.add({
      title: "Submitted for Review",
      description: "Your project has been submitted for review",
      color: "blue",
    });
    await projectStore.fetchUserProjects();
  } catch (error) {
    const toast = useToast();
    toast.add({
      title: "Submission Failed",
      description: "Failed to submit project for review",
      color: "red",
    });
  }
};

const duplicateProject = async (projectId) => {
  try {
    const project = myProjects.value.find((p) => p.id === projectId);
    if (project) {
      const duplicatedProject = {
        ...project,
        title: `${project.title} (Copy)`,
        submissionStatus: SubmissionStatus.DRAFT,
      };
      delete duplicatedProject.id; // Remove ID so a new one is generated
      await projectStore.createProject(duplicatedProject);
      const toast = useToast();
      toast.add({
        title: "Project Duplicated",
        description: "A copy of your project has been created",
        color: "green",
      });
      await projectStore.fetchUserProjects();
    }
  } catch (error) {
    const toast = useToast();
    toast.add({
      title: "Duplication Failed",
      description: "Failed to duplicate project",
      color: "red",
    });
  }
};

const archiveProject = async (projectId) => {
  try {
    await projectStore.updateProjectStatus(projectId, "Archived");
    const toast = useToast();
    toast.add({
      title: "Project Archived",
      description: "Project has been moved to archive",
      color: "yellow",
    });
    await projectStore.fetchUserProjects();
  } catch (error) {
    const toast = useToast();
    toast.add({
      title: "Archive Failed",
      description: "Failed to archive project",
      color: "red",
    });
  }
};

const normalizeSubmissionStatus = (project) =>
  (project.submissionStatus || project.projectStatus || project.status || "")
    .toString()
    .trim()
    .toLowerCase();

const getStatus = (project) => normalizeSubmissionStatus(project);

const getStatusLabel = (status) => {
  switch (status) {
    case SubmissionStatus.ACCEPTED:
      return "Accepted";
    case SubmissionStatus.PENDING:
      return "Pending";
    case SubmissionStatus.DRAFT:
      return "Draft";
    case SubmissionStatus.REJECTED:
      return "Rejected";
    default:
      return "Pending";
  }
};

const getStatusColor = (status) => {
  const colors = {
    [SubmissionStatus.ACCEPTED]: "green",
    [SubmissionStatus.PENDING]: "amber",
    [SubmissionStatus.DRAFT]: "gray",
    [SubmissionStatus.REJECTED]: "red",
  };
  return colors[status] || "gray";
};

const shareProject = (project) => {
  const url = `${window.location.origin}/student/my-projects/${project.id}`;

  if (navigator.share) {
    navigator.share({
      title: project.title,
      text: project.description,
      url: url,
    });
  } else {
    navigator.clipboard.writeText(url);
    const toast = useToast();
    toast.add({
      title: "Link copied!",
      description: "Project link has been copied to clipboard",
      color: "green",
    });
  }
};

// Meta
useHead({
  title: "My Projects - GIC Showcase",
  meta: [
    {
      name: "description",
      content: "Manage your student projects and track submissions",
    },
  ],
});
</script>
