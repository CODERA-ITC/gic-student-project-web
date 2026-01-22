<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
  >
    <!-- Back Button -->
    <div
      class="top-20 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur border-b border-gray-200 dark:border-slate-700"
    >
      <UContainer class="py-4">
        <div class="flex items-center justify-between">
          <ButtonsPresetButton preset="back" to="/projects" />
        </div>
      </UContainer>
    </div>

    <!-- Project Details -->
    <UContainer class="py-12">
      <div
        v-if="isLoading"
        class="flex items-center justify-center min-h-[400px]"
      >
        <div class="text-center">
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4"
          />
          <p class="text-gray-300 dark:text-gray-300">Loading project...</p>
        </div>
      </div>

      <ProjectDetails
        v-else-if="project && project.id"
        :project="project"
        :is-liked="isLiked"
        :user-role="authStore.userRole"
        :is-owner="isOwner"
        @like="toggleLike"
        @share="shareProject"
        @hide="toggleVisibility"
      />
    </UContainer>

    <!-- Authentication Modal -->
    <AuthModal v-model="showAuthModal" context="like" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const projectStore = useProjectStore();
const authStore = useAuthStore();
const projectId = route.params.id as string;

// Get project from store
const project = ref(null);
const isLoading = ref(true);

const projectData = await projectStore.fetchProjectById(projectId);
if (!projectData) {
  throw createError({
    statusCode: 404,
    statusMessage: "Project not found",
  });
}
project.value = projectData;
isLoading.value = false;

// Like functionality - using store with authentication
const showAuthModal = ref(false);

// Load user's liked projects when component mounts
onMounted(async () => {
  await projectStore.loadUserLikedProjects();

  // Track unique view
  const { trackView } = useProjectView();
  const isUniqueView = await trackView(projectId);

  // Only increment views if it's a unique view
  if (isUniqueView && project.value) {
    projectStore.incrementViews(project.value.id);
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

const isOwner = computed(() => {
  if (!project.value || !authStore.user) return false;
  return project.value.author?.name === authStore.user.name;
});

const toggleLike = async () => {
  if (!project.value) return;

  if (!authStore.isAuthenticated) {
    // Show authentication modal
    showAuthModal.value = true;
    return;
  }

  const newLikedState = await projectStore.likeProject(project.value.id);
  // Save the updated likes to persistence layer
  await projectStore.saveUserLikedProjects();
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
