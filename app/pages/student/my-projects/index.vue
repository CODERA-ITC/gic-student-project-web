<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header Section -->
    <div
      class="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 dark:border-slate-700"
    >
      <UContainer>
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div class="flex flex-col items-start gap-4 mb-4">
            <div
              class="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-1 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
            >
              <ButtonsPresetButton
                preset="back"
                @click="$router.push('/student/dashboard')"
                class="!text-white"
              />
            </div>

            <!-- <div class="space-y-2">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-heart-solid"
                  class="w-10 h-10 text-red-400"
                />
                <h1 class="text-4xl font-black text-white">
                  Favorite Projects
                </h1>
              </div>
              <p class="text-blue-100 dark:text-slate-300">
                Projects you've liked and want to revisit
              </p>
            </div> -->

            <div class="space-y-2">
              <h1 class="text-4xl font-black text-white">My Projects</h1>
              <p class="text-gray-200">
                Create, manage, and organize all your projects
              </p>
            </div>
          </div>

          <div class="flex gap-3">
            <ButtonsPresetButton
              preset="createProject"
              to="/projects/create"
              color="neutral"
              variant="solid"
              class="!bg-white !text-blue-600 hover:!bg-gray-100 dark:!bg-slate-800 dark:!text-blue-400 dark:hover:!bg-slate-700"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <!-- Tabs -->
      <div
        class="flex gap-4 mb-8 border-b border-gray-200 dark:border-slate-700"
      >
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="[
            'px-6 py-3 font-semibold transition-all duration-200 border-b-2',
            activeTab === tab.value
              ? 'text-blue-500 dark:text-blue-400 border-blue-500 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-300',
          ]"
        >
          {{ tab.label }}
          <span
            v-if="tab.count !== undefined"
            class="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Search and Filters -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mb-8"
      >
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="relative flex-1 sm:flex-initial sm:w-80">
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search projects..."
                class="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <span
              class="text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap"
            >
              {{ totalProjects }} total
            </span>
          </div>
          <div class="flex gap-3 w-full sm:w-auto">
            <USelect
              v-model="selectedTag"
              :items="tagOptions"
              placeholder="All Tags"
              class="flex-1 sm:w-40"
            />
            <USelect
              v-model="selectedCategory"
              :items="categoryOptions"
              placeholder="All Categories"
              class="flex-1 sm:w-40"
            />

            <!-- View Mode Toggle -->
            <div
              class="flex gap-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1"
            >
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'p-2 rounded transition-all duration-200',
                  viewMode === 'grid'
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600',
                ]"
                title="Grid View"
              >
                <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'p-2 rounded transition-all duration-200',
                  viewMode === 'list'
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600',
                ]"
                title="List View"
              >
                <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <EmptyState
        v-if="filteredProjects.length === 0"
        title="No projects found"
        description="Create your first project to get started"
        icon="i-heroicons-folder-plus"
        actionText="Create Project"
        actionTo="/projects/create"
      />

      <!-- Projects Section -->
      <div
        v-else
        class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
      >
        <!-- Grid View -->
        <div v-if="viewMode === 'grid'" class="p-6">
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
              v-for="project in paginatedProjects"
              :key="project.id"
              :project="project"
              base-route="/student/my-projects"
              :show-like-button="true"
              :show-edit-button="true"
              :liked-projects="likedProjects"
              @toggle-like="handleToggleLike"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </div>
        </div>

        <!-- List View -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Project
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Created
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
              <tr
                v-for="project in paginatedProjects"
                :key="project.id"
                class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      v-if="project.images && project.images[0]"
                      :src="project.images[0].thumbnailUrl"
                      :alt="project.title"
                      class="w-12 h-12 rounded-lg object-cover"
                    />
                    <div
                      v-else
                      class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                    >
                      <UIcon
                        name="i-heroicons-cube"
                        class="w-6 h-6 text-white"
                      />
                    </div>
                    <div>
                      <p
                        class="text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        {{ project.title }}
                      </p>
                      <p
                        class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1"
                      >
                        {{ project.description }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex text-center items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {{ project.category }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      project.status === 'Completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : project.status === 'In Review'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
                    ]"
                  >
                    {{ project.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                  {{ new Date(project.createdAt).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <UButton
                      icon="i-heroicons-eye"
                      size="xs"
                      color="primary"
                      variant="ghost"
                      label="View"
                      @click="navigateTo(`/student/my-projects/${project.id}`)"
                    />
                    <UButton
                      icon="i-heroicons-pencil"
                      size="xs"
                      color="primary"
                      variant="ghost"
                      label="Edit"
                      @click="handleEdit(project.id)"
                    />
                    <UButton
                      icon="i-heroicons-trash"
                      size="xs"
                      color="error"
                      variant="ghost"
                      label="Delete"
                      @click="handleDelete(project.id)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="px-6 pb-6 border-t border-gray-200 dark:border-slate-700 pt-6"
        >
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500 dark:text-slate-400">
              Showing {{ startIndex + 1 }} to
              {{ Math.min(endIndex, totalProjects) }} of
              {{ totalProjects }} projects
            </div>
            <div class="flex items-center gap-2">
              <UButton
                icon="i-heroicons-chevron-left"
                size="xs"
                variant="ghost"
                :disabled="currentPage === 1"
                @click="currentPage--"
              />
              <div class="flex items-center gap-1">
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  :class="[
                    'px-3 py-1 text-sm rounded-lg transition-colors',
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700',
                  ]"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>
              </div>
              <UButton
                icon="i-heroicons-chevron-right"
                size="xs"
                variant="ghost"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              />
            </div>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteConfirm"
      :project-title="getProjectTitle(projectToDelete)"
      :is-deleting="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth", "student"],
});

import { ref, computed, onMounted, watch } from "vue";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";

const projectStore = useProjectStore();
const authStore = useAuthStore();

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

// Like functionality
const likedProjects = ref({});

// Watch for like changes and save to localStorage
watch(
  likedProjects,
  (newLikes) => {
    if (process.client) {
      localStorage.setItem("likedProjects", JSON.stringify(newLikes));
    }
  },
  { deep: true },
);

// Handle like toggle
const handleToggleLike = (projectId) => {
  if (likedProjects.value[projectId]) {
    delete likedProjects.value[projectId];
    // Update project likes count
    const project = myProjects.value.find((p) => p.id === projectId);
    if (project && project.likes > 0) {
      project.likes--;
    }
  } else {
    likedProjects.value[projectId] = true;
    // Update project likes count
    const project = myProjects.value.find((p) => p.id === projectId);
    if (project) {
      project.likes++;
    }
  }
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
    const savedLikes = localStorage.getItem("likedProjects");
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
    label: "Under Review",
    value: "in-review",
    count: getProjectsByStatus("In Review").length,
  },
  {
    label: "Completed",
    value: "completed",
    count: getProjectsByStatus("Completed").length,
  },
]);

const filteredProjects = computed(() => {
  let projects = myProjects.value;

  // Filter by tab
  if (activeTab.value !== "all") {
    const statusMap = {
      "in-progress": "In Progress",
      "in-review": "In Review",
      completed: "Completed",
    };
    projects = projects.filter((p) => p.status === statusMap[activeTab.value]);
  }

  // Filter by search query
  if (debouncedSearchQuery.value.trim()) {
    const query = debouncedSearchQuery.value.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
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

// Reset pagination when filters change
watch([selectedTag, selectedCategory, activeTab], () => {
  currentPage.value = 1;
});

// Methods
const getProjectsByStatus = (status) => {
  return myProjects.value.filter((p) => p.status === status);
};

const getQuickActions = (project) => {
  return [
    [
      {
        label: "Mark as In Progress",
        icon: "i-heroicons-play",
        click: () => updateProjectStatus(project.id, "In Progress"),
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
        label: "Duplicate Project",
        icon: "i-heroicons-document-duplicate",
        click: () => duplicateProject(project.id),
      },
    ],
    [
      {
        label: "Archive Project",
        icon: "i-heroicons-archive-box",
        click: () => archiveProject(project.id),
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
    await projectStore.updateProjectStatus(projectId, "In Review");
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
        status: "Draft",
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

const getStatusColor = (status) => {
  const colors = {
    Completed: "green",
    "In Progress": "blue",
    "In Review": "yellow",
    Submitted: "purple",
    Draft: "gray",
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
  title: "My Projects - Student Portal",
  meta: [
    {
      name: "description",
      content: "Manage your student projects and track submissions",
    },
  ],
});
</script>
