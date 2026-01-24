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
          <ButtonsPresetButton preset="back" to="/student/my-projects" />
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
        v-else-if="project"
        :project="project"
        :is-liked="isLiked"
        :user-role="authStore.userRole"
        :is-owner="isOwner"
        @like="toggleLike"
        @share="shareProject"
        @hide="toggleVisibility"
      >
        <template #submit-button>
          <ButtonsPresetButton
            v-if="canSubmit"
            preset="submitProject"
            label="Submit to Teacher"
            icon="i-heroicons-paper-airplane"
            size="lg"
            :loading="isSubmitting"
            class="w-full justify-center"
            @click="submitProject"
          />
        </template>
        <template #action-buttons>
          <div class="flex flex-col sm:flex-row gap-3">
            <ButtonsPresetButton
              label="Edit Project"
              icon="i-heroicons-pencil-square"
              color="primary"
              variant="solid"
              size="lg"
              class="flex-1"
              @click="editProject"
            />
            <ButtonsPresetButton
              label="Delete Project"
              icon="i-heroicons-trash"
              size="lg"
              class="flex-1"
              @click="showDeleteModal = true"
            />
          </div>
        </template>
      </ProjectDetails>
    </UContainer>

    <!-- Submit Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showSubmitModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showSubmitModal = false"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-gray-900/75 dark:bg-gray-900/90 backdrop-blur-sm"
            @click="showSubmitModal = false"
          ></div>

          <!-- Modal Container -->
          <div
            class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl transform transition-all"
          >
            <div class="p-8">
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                >
                  <UIcon
                    name="i-heroicons-paper-airplane"
                    class="w-6 h-6 text-blue-600 dark:text-blue-400"
                  />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Submit to Teacher
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to submit this project to your teacher for
                review? Your project will be sent to all teachers for
                evaluation. You won't be able to edit it until the review is
                complete.
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-end">
                <ButtonsPresetButton
                  preset="cancel"
                  size="lg"
                  @click="showSubmitModal = false"
                />
                <ButtonsPresetButton
                  preset="submit"
                  label="Submit Project"
                  size="lg"
                  :loading="isSubmitting"
                  @click="confirmSubmit"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :project-title="project?.title || 'this project'"
      :is-deleting="isDeleting"
      @confirm="confirmDelete"
    />

    <!-- Authentication Modal -->
    <AuthModal v-model="showAuthModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";
import type { TimelineItem } from "@nuxt/ui";

const route = useRoute();
const projectStore = useProjectStore();
const authStore = useAuthStore();
const projectId = route.params.id as string;

// Student-specific reactive variables
const project = ref(null);
const isLoading = ref(true);
const showSubmitModal = ref(false);
const isSubmitting = ref(false);
const showDeleteModal = ref(false);
const isDeleting = ref(false);

// Load user's liked projects and project data when component mounts
onMounted(async () => {
  try {
    console.log("=== LOADING PROJECT ===", projectId);
    console.log("Store state:", {
      totalProjects: projectStore.projects.length,
      totalUserProjects: projectStore.userProjects.length,
      projectIds: projectStore.projects.map((p) => p.id),
      userProjectIds: projectStore.userProjects.map((p) => p.id),
    });

    // Load liked projects first
    await projectStore.loadUserLikedProjects();

    let projectData = await projectStore.getProjectById(projectId);

    // If project still not found after fetch, something is wrong
    if (!projectData) {
      console.error("Project not found after fetch:", projectId);
      console.error(
        "Available project IDs:",
        projectStore.projects.map((p) => p.id),
      );
      console.error(
        "Available user project IDs:",
        projectStore.userProjects.map((p) => p.id),
      );

      throw createError({
        statusCode: 404,
        statusMessage: "Project not found",
      });
    }

    project.value = projectData;

    // Check ownership after project is loaded
    if (!isOwner.value) {
      console.log("User is not owner, redirecting to public view");
      await navigateTo(`/projects/${projectId}`);
      return;
    }

    console.log("✅ User is owner, displaying project");
  } catch (error) {
    console.error("❌ Error loading project:", error);
    // Don't throw here, just show error state
  } finally {
    isLoading.value = false;
  }
});

// Check if user owns this project
const isOwner = computed(() => {
  if (!authStore.user) {
    return false;
  }
  return project.value.author?.id === authStore.user.id;
});

// Image carousel
const currentImageIndex = ref(0);

const nextImage = () => {
  if (project.value?.images) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % project.value.images.length;
  }
};

const previousImage = () => {
  if (project.value?.images) {
    currentImageIndex.value =
      currentImageIndex.value === 0
        ? project.value.images.length - 1
        : currentImageIndex.value - 1;
  }
};

// Like functionality - using store with authentication
const showAuthModal = ref(false);

// Student-specific computed properties
const canSubmit = computed(() => {
  if (!isOwner.value || !project.value) return false;

  // Check if project has already been submitted
  const hasSubmission =
    project.value.submissions && project.value.submissions.length > 0;
  return !hasSubmission;
});

// Student-specific methods
const submitProject = () => {
  if (!canSubmit.value) return;
  showSubmitModal.value = true;
};

const editProject = () => {
  console.log("Edit button clicked!");
  console.log("Project ID:", project.value?.id);
  navigateTo(`/projects/create?edit=${project.value.id}`);
};

// Close delete modal and reset state
const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const confirmDelete = async () => {
  console.log("Confirming delete for project:", project.value?.id);

  try {
    isDeleting.value = true;

    const result = await projectStore.deleteProject(project.value.id);

    if (result) {
      const toast = useToast();
      toast.add({
        title: "Project Deleted",
        description: "Your project has been successfully deleted.",
        color: "success",
      });

      closeDeleteModal();
      await navigateTo("/student/my-projects");
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

const confirmSubmit = async () => {
  try {
    isSubmitting.value = true;

    // Submit project for review - add to submissions array
    const success = await projectStore.submitProjectForReview(project.value.id);

    if (success) {
      const toast = useToast();
      toast.add({
        title: "Project Submitted!",
        description: "Your project has been submitted to teachers for review.",
        color: "success",
      });

      showSubmitModal.value = false;

      // Optionally navigate to submissions page
      // await navigateTo("/student/submissions");
    } else {
      throw new Error("Submission failed");
    }
  } catch (error) {
    console.error("Error submitting project:", error);
    const toast = useToast();
    toast.add({
      title: "Submission Failed",
      description: "Failed to submit project. Please try again.",
      color: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const shareProject = () => {
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: project.value.title,
      text: project.value.description,
      url: url,
    });
  } else {
    navigator.clipboard.writeText(url);
    const toast = useToast();
    toast.add({
      title: "Link copied!",
      description: "Project link has been copied to clipboard",
      color: "success",
    });
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

  const newLikedState = await projectStore.likeProject(project.value.id);
  // Save the updated likes to persistence layer
  await projectStore.saveUserLikedProjects();
};

// Timeline items computed property
const timelineItems = computed<TimelineItem[]>(() => {
  if (!project.value?.features && !project.value?.feature) return [];

  const features = project.value.features || project.value.feature || [];

  return features.map(
    (feature: any): TimelineItem => ({
      date: feature.date || "No date",
      title: feature.title,
      description: feature.description,
      icon: feature.icon || "i-lucide-star",
    }),
  );
});

// Get default timeline value (latest completed item or middle item)
const getDefaultTimelineValue = computed(() => {
  if (!timelineItems.value.length) return 0;

  // Find the middle item for better visual presentation
  return Math.floor(timelineItems.value.length / 2);
});

useHead({
  title: `${project.value?.title || "Project"} - Student Project Details`,
  meta: [
    {
      name: "description",
      content: project.value?.description || "Student project details",
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
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}

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
