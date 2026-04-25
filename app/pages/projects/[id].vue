<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
  >
    <ScrollToTop />

    <!-- Project Details -->
    <UContainer class="py-12">
      <div
        v-if="isLoading"
        class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 animate-pulse"
      >
        <div class="lg:col-span-2 space-y-4 sm:space-y-6">
          <div class="h-10 w-2/3 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          <div class="h-5 w-full bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div class="h-5 w-5/6 bg-gray-200 dark:bg-slate-700 rounded"></div>

          <div class="h-64 sm:h-80 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="h-24 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
            <div class="h-24 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
          </div>

          <div class="h-36 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
          <div class="h-36 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
        </div>

        <div class="lg:col-span-1 space-y-4">
          <div class="h-36 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
          <div class="h-48 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
          <div class="h-36 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
        </div>
      </div>

      <!-- no need to check any author for public view -->
      <ProjectDetails
        v-else-if="project && project.id"
        :project="project"
        :is-liked="isLiked"
        :user-role="authStore.userRole"
        :is-owner="isOwner"
        @like="toggleLike"
        @share="shareProject"
        @hide="toggleVisibility"
      >
        <template #action-buttons>
          <div v-if="isOwner" class="flex gap-2">
            <UButton
              @click="editProject"
              class="flex-1 justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
              size="md"
            >
              <template #leading>
                <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
              </template>
              Edit
            </UButton>
            <UButton
              @click="showDeleteModal = true"
              class="flex-1 justify-center rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600"
              size="md"
            >
              <template #leading>
                <UIcon name="i-heroicons-trash" class="w-5 h-5" />
              </template>
              Delete
            </UButton>
          </div>
        </template>
      </ProjectDetails>
    </UContainer>

    <!-- Authentication Modal -->
    <AuthModal v-model="showAuthModal" context="like" />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :project-title="project?.name || project?.title || 'this project'"
      :is-deleting="isDeleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const authStore = useAuthStore();
const projectId = route.params.id as string;

// Get project from store
const project = ref(null);
const isLoading = ref(true);
const showDeleteModal = ref(false);
const isDeleting = ref(false);

let projectData = await projectStore.fetchProjectById(projectId);
if (!projectData) {
  throw createError({
    statusCode: 404,
    statusMessage: "Project not found",
  });
}
project.value = projectData;
isLoading.value = false;

const isOwner = computed(() => {
  if (!project.value || !authStore.user) return false;

  const currentUserId = String(authStore.user.id ?? "");
  const authorId = String(project.value.author?.id ?? "");

  // owner is strictly the author
  return authorId === currentUserId;
});

// Like functionality - using store with authentication
const showAuthModal = ref(false);

// Load user's liked projects when component mounts

onMounted(async () => {
  isLoading.value = true;

  try {
    await projectStore.loadUserLikedProjects();
    if (!project.value) {
      project.value = await projectStore.fetchProjectById(projectId);
    }

    const { trackView } = useProjectView();
    const isUniqueView = await trackView(projectId);

    // Only increment if project exists
    if (isUniqueView && project.value?.id) {
      await projectStore.incrementViews(project.value.id);
    }
  } catch (error) {
    console.error("Error loading project or liked projects:", error);
  } finally {
    isLoading.value = false;
  }
});

// Watch for auth changes and reload liked projects
watch(
  () => authStore.isAuthenticated,
  async (isAuth) => {
    if (isAuth) {
      await projectStore.loadUserLikedProjects();
    } else {
      projectStore.clearUserLikedProjects();
    }
  },
);

const isLiked = computed(() => {
  if (!project.value) return false;
  return projectStore.isProjectLiked(project.value.id);
});

const toggleLike = async () => {
  if (!project.value) return;

  if (!authStore.isAuthenticated) {
    // Show authentication modal
    showAuthModal.value = true;
    return;
  }

  const wasLiked = isLiked.value;
  const result = await projectStore.likeProject(project.value.id);
  // Optimistically update local count to reflect toggle result
  if (result) {
    project.value.likes = (project.value.likes || 0) + (wasLiked ? -1 : 1);
    if (project.value.likes < 0) project.value.likes = 0;
  }
  await projectStore.loadUserLikedProjects();
};

const shareProject = async () => {
  const url = window.location.href;

  console.log("Sharing project URL:", url);
  const toast = useToast();

  try {
    if (navigator.share) {
      // Use native share API if available (mobile devices, some browsers)
      await navigator.share({
        text: url,
      });
      toast.add({
        title: "Shared successfully!",
        description: "Project link has been shared",
        color: "success",
      });
    } else {
      // Fallback to clipboard copy
      await navigator.clipboard.writeText(url);
      toast.add({
        title: "Link copied!",
        description: "Project link has been copied to clipboard",
        color: "success",
      });
    }
  } catch (error) {
    // Handle errors (user cancelled share, clipboard permission denied, etc.)
    if (error.name !== "AbortError") {
      // Don't show error if user just cancelled the share dialog
      toast.add({
        title: "Share failed",
        description: "Unable to share project link",
        color: "error",
      });
    }
  }
};

const toggleVisibility = async () => {
  if (!authStore.isTeacher) {
    const toast = useToast();
    toast.add({
      title: "Permission Denied",
      description: "Only teachers can change project visibility.",
      color: "error",
    });
    return;
  }

  try {
    const newVisibility =
      project.value.visibility === "private" ? "public" : "private";
    await projectStore.updateProjectVisibility(project.value.id, newVisibility);
    project.value.visibility = newVisibility;

    const toast = useToast();
    toast.add({
      title: "Visibility Updated",
      description: `Project is now ${newVisibility}.`,
      color: "success",
    });
  } catch (error) {
    console.error("Error updating visibility:", error);
    const toast = useToast();
    toast.add({
      title: "Update Failed",
      description: "Failed to update project visibility.",
      color: "error",
    });
  }
};

const editProject = () => {
  console.log("Edit button clicked from public view!");
  if (!project.value) return;
  navigateTo(`/projects/create?edit=${project.value.id}`);
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const confirmDelete = async () => {
  if (!project.value) return;
  try {
    isDeleting.value = true;
    const result = await projectStore.deleteProject(project.value.id);
    if (result) {
      const toast = useToast();
      toast.add({
        title: "Project Deleted",
        description: "Project has been removed successfully.",
        color: "success",
      });
      closeDeleteModal();
      await navigateTo("/projects");
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

const goBack = () => {
  router.back();
};

useHead({
  title: `${project.value?.title || "Project"} - Project Details`,
  meta: [
    {
      name: "description",
      content: project.value?.description || "Student project details",
    },
  ],
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUpDelayed {
  0%,
  20% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-slide-in-right {
  animation: slideInRight 0.6s ease-out forwards;
}

.animate-fade-in-up-delayed {
  animation: fadeInUpDelayed 1.2s ease-out forwards;
}

/* Timeline specific animations */
:deep(.timeline-item) {
  transition: all 0.3s ease-in-out;
}

:deep(.timeline-item:hover) {
  transform: translateX(5px);
}

/* Custom timeline styling with better animations */
:deep(.timeline) {
  position: relative;
}

:deep(.timeline::before) {
  content: "";
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    rgb(147, 51, 234),
    rgb(59, 130, 246),
    rgb(34, 197, 94)
  );
  border-radius: 2px;
  animation: lineGrow 2s ease-in-out;
}

@keyframes lineGrow {
  from {
    height: 0;
  }
  to {
    height: 100%;
  }
}

/* Staggered animation for timeline items */
:deep(.timeline-item:nth-child(1)) {
  animation-delay: 0.2s;
}

:deep(.timeline-item:nth-child(2)) {
  animation-delay: 0.4s;
}

:deep(.timeline-item:nth-child(3)) {
  animation-delay: 0.6s;
}

:deep(.timeline-item:nth-child(4)) {
  animation-delay: 0.8s;
}
</style>
