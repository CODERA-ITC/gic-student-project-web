<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header Section -->
    <div
      class="py-16 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 dark:border-slate-700"
    >
      <UContainer>
        <div class="flex flex-row items-center gap-4 mb-4">
          <div
            class="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-1 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
          >
            <ButtonsPresetButton
              preset="back"
              @click="$router.push('/student/dashboard')"
              class="!text-white"
            />
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <h1 class="text-4xl font-black text-white">Project Submissions</h1>
          </div>
          <p class="text-blue-100 dark:text-slate-300">
            Track submitted projects and their review status. Syncs with
            notifications.
          </p>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <!-- Submissions List -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
      >
        <div class="p-6 border-b border-gray-200 dark:border-slate-700">
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Submitted Projects
              </h2>
              <p class="text-sm text-gray-500 dark:text-slate-400 mt-1">
                Projects submitted for review and approval
              </p>
            </div>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <div class="relative flex-1 sm:flex-initial sm:w-64">
                <UIcon
                  name="i-heroicons-magnifying-glass"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4"
                />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search..."
                  class="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  @input="handleSearch"
                />
              </div>
              <span
                class="text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap"
              >
                {{ filteredSubmissions.length }} total
              </span>
            </div>
          </div>
        </div>

        <!-- Submissions Table -->
        <div class="overflow-x-auto">
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
                  Submitted
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Status
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
                v-for="submission in paginatedSubmissions"
                :key="submission.id"
                class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div>
                    <p
                      class="text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      {{ submission.projectName }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ submission.category }}
                    </p>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                  {{ submission.submittedDate }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="getStatusBadgeClass(submission.status)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="getStatusDotClass(submission.status)"
                    ></span>
                    {{ submission.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <UButton
                      icon="i-heroicons-eye"
                      size="xs"
                      color="primary"
                      variant="ghost"
                      label="View"
                      @click="viewSubmission(submission.id)"
                    />
                    <UButton
                      icon="i-heroicons-pencil"
                      size="xs"
                      color="primary"
                      variant="ghost"
                      label="Edit"
                      @click="editSubmission(submission.id)"
                    />
                    <UButton
                      v-if="
                        submission.status === 'Under Review' ||
                        submission.status === 'Needs Revision'
                      "
                      icon="i-heroicons-x-circle"
                      size="xs"
                      color="error"
                      variant="ghost"
                      label="Cancel"
                      @click="confirmCancel(submission.id)"
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
          class="px-6 py-4 border-t border-gray-200 dark:border-slate-700"
        >
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500 dark:text-slate-400">
              Showing {{ startIndex + 1 }} to
              {{ Math.min(endIndex, filteredSubmissions.length) }} of
              {{ filteredSubmissions.length }} projects
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

        <!-- Empty State - No Search Results -->
        <div
          v-if="filteredSubmissions.length === 0 && searchQuery"
          class="text-center py-12"
        >
          <UIcon
            name="i-heroicons-magnifying-glass"
            class="w-16 h-16 text-gray-400 dark:text-slate-600 mx-auto mb-4"
          />
          <p class="text-gray-500 dark:text-slate-400 text-lg mb-2">
            No projects found
          </p>
          <p class="text-gray-400 dark:text-slate-500 text-sm">
            Try adjusting your search terms
          </p>
        </div>

        <!-- Empty State - No Submissions -->
        <div v-else-if="submissions.length === 0" class="text-center py-12">
          <UIcon
            name="i-heroicons-rocket-launch"
            class="w-16 h-16 text-gray-400 dark:text-slate-600 mx-auto mb-4"
          />
          <p class="text-gray-500 dark:text-slate-400 text-lg mb-2">
            No submissions yet
          </p>
          <p class="text-gray-400 dark:text-slate-500 text-sm mb-4">
            Submit your projects from "My Projects" page to track their review
            status here
          </p>
          <ButtonsPresetButton
            label="Go to My Projects"
            to="/student/my-projects"
            size="md"
          />
        </div>
      </div>
    </UContainer>

    <!-- Cancel Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showCancelModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showCancelModal = false"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-gray-900/75 dark:bg-gray-900/90 backdrop-blur-sm"
            @click="showCancelModal = false"
          ></div>

          <!-- Modal Container -->
          <div
            class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl transform transition-all"
          >
            <div class="p-8">
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                >
                  <UIcon
                    name="i-heroicons-exclamation-triangle"
                    class="w-6 h-6 text-red-600 dark:text-red-400"
                  />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Cancel Submission
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to cancel this submission? This will
                remove it from your submitted projects list. This action cannot
                be undone.
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-end">
                <ButtonsPresetButton
                  preset="cancel"
                  size="lg"
                  @click="showCancelModal = false"
                />
                <UButton
                  label="Cancel Submission"
                  icon="i-heroicons-x-circle"
                  color="error"
                  size="lg"
                  :loading="isCanceling"
                  @click="handleCancelConfirm"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  middleware: ["auth", "student"],
});

const router = useRouter();
const projectStore = useProjectStore();
const authStore = useAuthStore();

// Search and pagination
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Cancel modal state
const showCancelModal = ref(false);
const selectedSubmissionId = ref<string | null>(null);
const isCanceling = ref(false);

// Get submitted projects from store
const submissions = computed(() => {
  // Get user's projects that have submissions - only show the latest submission per project
  return projectStore.userProjects
    .filter((project) => project.submissions && project.submissions.length > 0)
    .map((project) => {
      // Get the latest submission (last one in array)
      const latestSubmission =
        project.submissions![project.submissions!.length - 1];
      return {
        id: project.id,
        projectName: project.name,
        category: project.category || "General",
        submittedDate: latestSubmission.date || project.createdAt,
        status: latestSubmission.status,
      };
    });
});

// Computed properties for search and pagination
const filteredSubmissions = computed(() => {
  if (!searchQuery.value.trim()) {
    return submissions.value;
  }

  const query = searchQuery.value.toLowerCase();
  return submissions.value.filter(
    (submission) =>
      submission.projectName.toLowerCase().includes(query) ||
      submission.category.toLowerCase().includes(query) ||
      submission.status.toLowerCase().includes(query),
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredSubmissions.value.length / itemsPerPage.value),
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const paginatedSubmissions = computed(() =>
  filteredSubmissions.value.slice(startIndex.value, endIndex.value),
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

// Helper functions
const handleSearch = () => {
  currentPage.value = 1; // Reset to first page on search
};

const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    Approved:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "Under Review":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    "Needs Revision":
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    Rejected:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const getStatusDotClass = (status: string) => {
  const classes: Record<string, string> = {
    Approved: "bg-green-600 dark:bg-green-400",
    "Under Review": "bg-yellow-600 dark:bg-yellow-400",
    "Needs Revision": "bg-red-600 dark:bg-red-400",
    Rejected: "bg-gray-600 dark:bg-gray-400",
  };

  return classes[status] || "bg-gray-600";
};

const viewSubmission = (id: string) => {
  router.push(`/student/my-projects/${id}`);
  console.log("Viewing submission with ID:", id);
};

const editSubmission = (id: string) => {
  router.push(`/projects/create?edit=${id}`);
};

const confirmCancel = (id: string) => {
  selectedSubmissionId.value = id;
  showCancelModal.value = true;
};

const handleCancelConfirm = async () => {
  if (selectedSubmissionId.value === null) return;

  try {
    isCanceling.value = true;
    const project = projectStore.userProjects.find(
      (p) => p.id === selectedSubmissionId.value,
    );

    if (project && project.submissions && project.submissions.length > 0) {
      // Remove the latest submission
      project.submissions.pop();

      // Save to localStorage
      // projectStore.saveUserCreatedProjects();

      // Show success toast
      const toast = useToast();
      toast.add({
        title: "Submission Canceled",
        description: "Your project submission has been canceled successfully.",
        color: "success",
      });

      // Adjust current page if needed
      if (paginatedSubmissions.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    }
  } catch (error) {
    console.error("Error canceling submission:", error);
    const toast = useToast();
    toast.add({
      title: "Cancelation Failed",
      description: "Failed to cancel submission. Please try again.",
      color: "error",
    });
  } finally {
    isCanceling.value = false;
    showCancelModal.value = false;
    selectedSubmissionId.value = null;
  }
};

// Load user projects on mount
onMounted(async () => {
  // Restore authentication state from localStorage only if not already authenticated
  if (!authStore.isAuthenticated) {
    await authStore.restoreAuth();

    if (!authStore.isAuthenticated) {
      await navigateTo("/login");
      return;
    }
  }

  // Fetch user's projects to get submitted ones
  await projectStore.fetchUserProjects();
});

useHead({
  title: "Project Submissions - GIC Student Portal",
  meta: [
    {
      name: "description",
      content: "Track your submitted projects and their review status",
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
</style>
