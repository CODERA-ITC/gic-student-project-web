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
      >
        <!-- Student-specific action buttons slot -->
        <template #actions>
          <!-- Submit for Review Button (Student-specific) -->
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

const route = useRoute();
const projectStore = useProjectStore();
const authStore = useAuthStore();
const projectId = parseInt(route.params.id as string);

// Student-specific reactive variables
const project = ref(null);
const isLoading = ref(true);
const showSubmitModal = ref(false);
const isSubmitting = ref(false);
const showAuthModal = ref(false);

// Load project data - ensure user projects are fetched first
if (projectStore.userProjects.length === 0) {
  await projectStore.fetchUserProjects();
}

// Also fetch all projects if needed
if (projectStore.projects.length === 0) {
  await projectStore.fetchProjects();
}

const projectData = await projectStore.getProjectById(projectId);
if (!projectData) {
  throw createError({
    statusCode: 404,
    statusMessage: "Project not found",
  });
}

// Check if user owns this project
const isOwner = computed(() => {
  if (!projectData || !authStore.user) return false;
  return projectData.author?.name === authStore.user.name;
});

// If not owner, redirect to public view
if (!isOwner.value) {
  await navigateTo(`/projects/${projectId}`);
}

project.value = projectData;
isLoading.value = false;

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
