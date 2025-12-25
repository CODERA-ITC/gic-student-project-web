<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header Section -->
    <div
      class="py-16 bg-gradient-to-r from-blue-900 to-indigo-600 border-b border-blue-700/30"
    >
      <UContainer>
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <h1 class="text-5xl font-black text-white">My Projects</h1>
            <p class="text-gray-200">
              Manage and track your student project submissions
            </p>
          </div>
          <ButtonsPresetButton preset="createProject" to="/projects/create" />
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <!-- Filter and Search -->
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <div class="flex-1 relative">
          <SearchBar
            v-model="searchQuery"
            placeholder="Search projects by title, description, tech, members..."
            class="w-full"
          />
          <div
            v-if="isSearching"
            class="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-4 h-4 text-blue-500 animate-spin"
            />
          </div>
        </div>
        <div class="flex gap-4">
          <USelect
            v-model="selectedSemester"
            :options="semesterOptions"
            placeholder="All Semesters"
            class="w-48"
          />
          <USelect
            v-model="selectedCategory"
            :options="categoryOptions"
            placeholder="All Categories"
            class="w-48"
          />
        </div>
      </div>

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

      <!-- Empty State -->
      <EmptyState
        v-if="filteredProjects.length === 0"
        title="No projects found"
        description="Create your first project to get started"
        icon="i-heroicons-folder-plus"
        actionText="Create Project"
        actionTo="/projects/create"
      />

      <!-- Projects Grid -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard
          v-for="project in filteredProjects"
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

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-12">
        <UPagination
          v-model="currentPage"
          :page-count="pageSize"
          :total="totalProjects"
        />
      </div>
    </UContainer>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closeDeleteModal"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-gray-900/75 dark:bg-gray-900/90 backdrop-blur-sm"
            @click="closeDeleteModal"
          ></div>

          <!-- Modal Container -->
          <div
            class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl transform transition-all"
          >
            <div class="p-8">
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete "<span class="font-semibold">{{
                  getProjectTitle(projectToDelete)
                }}</span
                >"? This will permanently remove the project and all its data.
              </p>

              <!-- Verification Input -->
              <div
                class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
              >
                <p class="text-red-800 dark:text-red-300 font-medium mb-3">
                  To confirm, type
                  <span class="font-bold">DELETE</span> below:
                </p>
                <input
                  v-model="deleteConfirmText"
                  type="text"
                  placeholder="Type DELETE to confirm"
                  class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-red-300 dark:border-red-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  @keyup.enter="
                    deleteConfirmText === 'DELETE' && confirmDelete()
                  "
                />
              </div>

              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <ButtonsPresetButton
                  preset="cancel"
                  size="lg"
                  @click="closeDeleteModal"
                />
                <ButtonsPresetButton
                  preset="delete"
                  label="Confirm Delete"
                  size="lg"
                  :disabled="deleteConfirmText !== 'DELETE'"
                  @click="confirmDelete"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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
const selectedSemester = ref("");
const selectedCategory = ref("");
const currentPage = ref(1);
const pageSize = ref(12);
const isSearching = ref(false);

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
  { deep: true }
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
const deleteConfirmText = ref("");

const handleDelete = (projectId) => {
  console.log("Delete project requested:", projectId);
  projectToDelete.value = projectId;
  deleteConfirmText.value = ""; // Reset confirmation text
  showDeleteConfirm.value = true;
};

// Close delete modal and reset state
const closeDeleteModal = () => {
  showDeleteConfirm.value = false;
  projectToDelete.value = null;
  deleteConfirmText.value = "";
};

// Get project title for delete confirmation
const getProjectTitle = (projectId) => {
  if (!projectId) return "this project";
  const project = myProjects.value.find((p) => p.id === projectId);
  return project?.title || "this project";
};

const confirmDelete = async () => {
  console.log("Confirming delete for project:", projectToDelete.value);
  if (!projectToDelete.value || deleteConfirmText.value !== "DELETE") return;

  try {
    const deletedId = projectToDelete.value;
    console.log("Confirming delete for project:", deletedId);

    const result = await projectStore.deleteProject(deletedId);

    if (result) {
      const toast = useToast();
      toast.add({
        title: "Project Deleted",
        description: "Your project has been successfully deleted.",
        color: "blue",
      });

      closeDeleteModal();

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
      color: "red",
    });
  }
};

// Check authentication
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo("/login");
    return;
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
    label: "In Progress",
    value: "in-progress",
    count: getProjectsByStatus("In Progress").length,
  },
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
        p.semester.toLowerCase().includes(query) ||
        (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(query))) ||
        (p.technologies &&
          p.technologies.some((tech) => tech.toLowerCase().includes(query))) ||
        (p.course && p.course.toLowerCase().includes(query)) ||
        (p.members &&
          p.members.some((member) =>
            (typeof member === "string" ? member : member.name)
              .toLowerCase()
              .includes(query)
          ))
    );
  }

  // Filter by semester
  if (selectedSemester.value) {
    projects = projects.filter((p) => p.semester === selectedSemester.value);
  }

  // Filter by category
  if (selectedCategory.value) {
    projects = projects.filter((p) => p.category === selectedCategory.value);
  }

  // Pagination
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return projects.slice(startIndex, startIndex + pageSize.value);
});

const totalProjects = computed(() => {
  // Return total count before pagination
  let projects = myProjects.value;

  if (activeTab.value !== "all") {
    const statusMap = {
      "in-progress": "In Progress",
      "in-review": "In Review",
      completed: "Completed",
    };
    projects = projects.filter((p) => p.status === statusMap[activeTab.value]);
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }

  if (selectedSemester.value) {
    projects = projects.filter((p) => p.semester === selectedSemester.value);
  }

  if (selectedCategory.value) {
    projects = projects.filter((p) => p.category === selectedCategory.value);
  }

  return projects.length;
});

const totalPages = computed(() =>
  Math.ceil(totalProjects.value / pageSize.value)
);

const semesterOptions = computed(() => {
  const semesters = new Set(myProjects.value.map((p) => p.semester));
  return Array.from(semesters).map((s) => ({ label: s, value: s }));
});

const categoryOptions = computed(() => {
  const categories = new Set(myProjects.value.map((p) => p.category));
  return Array.from(categories).map((c) => ({ label: c, value: c }));
});

// Search debouncing
let searchTimeout = null;
watch(searchQuery, (newQuery) => {
  isSearching.value = true;
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newQuery;
    isSearching.value = false;
  }, 300);
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

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
