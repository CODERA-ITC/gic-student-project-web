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
        v-else-if="project && project.id"
        :project="project"
        :is-liked="isLiked"
        :user-role="authStore.userRole"
        :is-owner="isOwner"
        @like="toggleLike"
        @share="shareProject"
        @hide="toggleVisibility"
      >
        <template #submit-button>
          <UButton
            v-if="canSubmit"
            @click="submitProject"
            color="success"
            variant="solid"
            class="w-full justify-center"
            size="lg"
            :loading="isSubmitting"
          >
            <template #leading>
              <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5" />
            </template>
            Submit for Review
          </UButton>
        </template>
      </ProjectDetails>
    </UContainer>

    <!-- Submit Modal -->
    <UModal v-model="showSubmitModal">
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Submit Project for Review
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to submit this project for review? Once
          submitted, you won't be able to edit it until the review process is
          complete.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-end">
          <UButton
            @click="showSubmitModal = false"
            color="neutral"
            variant="soft"
          >
            Cancel
          </UButton>
          <UButton
            @click="confirmSubmit"
            color="success"
            variant="solid"
            :loading="isSubmitting"
          >
            Submit Project
          </UButton>
        </div>
      </div>
    </UModal>

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
const projectId = parseInt(route.params.id as string);

// Student-specific reactive variables
const project = ref(null);
const isLoading = ref(true);
const showSubmitModal = ref(false);
const isSubmitting = ref(false);

// Load project data - ensure user projects are fetched first
if (projectStore.userProjects.length === 0) {
  await projectStore.fetchUserProjects();
}

// Also fetch all projects if needed
if (projectStore.projects.length === 0) {
  await projectStore.fetchProjects();
}

let projectData = await projectStore.getProjectById(projectId);

// If project not found initially, try refreshing the data
if (!projectData) {
  console.log("Project not found initially, refreshing...");
  await projectStore.fetchProjects();
  await projectStore.fetchUserProjects();
  projectData = await projectStore.getProjectById(projectId);
}

if (!projectData) {
  console.error("Project not found after refresh:", projectId);
  throw createError({
    statusCode: 404,
    statusMessage: "Project not found",
  });
}

project.value = projectData;

// Debug: Log project data and user data
console.log("=== OWNERSHIP CHECK DEBUG ===");
console.log("Project ID:", projectId);
console.log("Project data:", projectData);
console.log("Project author:", projectData?.author);
console.log("Current user:", authStore.user);
console.log("Auth store user name:", authStore.user?.name);

// Check if user owns this project
const isOwner = computed(() => {
  if (!project.value || !authStore.user) {
    console.log("Ownership check failed: missing project or user");
    return false;
  }
  const owns = project.value.author?.name === authStore.user.name;
  console.log("Ownership check result:", owns);
  console.log(
    "Comparing:",
    project.value.author?.name,
    "===",
    authStore.user.name
  );
  return owns;
});

console.log("isOwner computed value:", isOwner.value);

// If not owner, redirect to public view
if (!isOwner.value) {
  console.log("!!! REDIRECTING TO PUBLIC VIEW !!!");
  console.log("Project author:", project.value?.author?.name);
  console.log("Current user:", authStore.user?.name);
  await navigateTo(`/projects/${projectId}`);
}

console.log("User IS owner, staying on student page");
isLoading.value = false;

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
  return (
    isOwner.value &&
    (project.value?.status === "Draft" ||
      project.value?.status === "In Progress")
  );
});

// Student-specific methods
const submitProject = () => {
  if (!canSubmit.value) return;
  showSubmitModal.value = true;
};

const confirmSubmit = async () => {
  try {
    isSubmitting.value = true;

    await projectStore.updateProjectStatus(project.value.id, "In Review");
    project.value.status = "In Review";

    const toast = useToast();
    toast.add({
      title: "Project Submitted!",
      description: "Your project has been submitted for review.",
      color: "success",
    });

    showSubmitModal.value = false;
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

// Load user's liked projects when component mounts
onMounted(async () => {
  await projectStore.loadUserLikedProjects();
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
  }
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
    })
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
