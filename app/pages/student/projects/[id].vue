<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
  >
    <!-- Back Button -->
    <div
      class="sticky top-20 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur border-b border-gray-200 dark:border-slate-700"
    >
      <UContainer class="py-4">
        <div class="flex items-center justify-between">
          <ButtonsPresetButton preset="back" to="/student/my-projects" />

          <!-- Action Buttons for Student -->
          <div v-if="project && isOwner" class="flex gap-2">
            <UButton
              v-if="canEdit"
              :to="`/projects/create?edit=${project.id}`"
              color="blue"
              variant="soft"
              icon="i-heroicons-pencil"
              size="sm"
            >
              Edit Project
            </UButton>
            <UButton
              v-if="canSubmit"
              @click="submitProject"
              color="green"
              variant="solid"
              icon="i-heroicons-paper-airplane"
              size="sm"
              :loading="isSubmitting"
            >
              Submit for Review
            </UButton>
            <UButton
              @click="shareProject"
              color="gray"
              variant="soft"
              icon="i-heroicons-share"
              size="sm"
            >
              Share
            </UButton>
          </div>
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
          <p class="text-gray-600 dark:text-gray-300">Loading project...</p>
        </div>
      </div>

      <div v-else-if="project && project.id" class="grid lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Project Header - Image Carousel -->
          <div
            class="rounded-2xl h-64 relative overflow-hidden bg-gray-200 dark:bg-slate-800"
          >
            <div class="relative w-full h-full">
              <!-- Current Image -->
              <img
                v-if="project.images && project.images[currentImageIndex]"
                :src="project.images[currentImageIndex]"
                :alt="`${project.title} - Image ${currentImageIndex + 1}`"
                class="w-full h-full object-cover"
              />

              <!-- Fallback if no images -->
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-8xl bg-gray-100 dark:bg-slate-700"
              >
                {{ project.emoji || "📁" }}
              </div>

              <!-- Navigation Buttons -->
              <button
                v-if="project.images && project.images.length > 1"
                @click="previousImage"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all backdrop-blur-sm z-10"
              >
                <UIcon
                  name="i-heroicons-chevron-left"
                  class="w-6 h-6 text-white"
                />
              </button>

              <button
                v-if="project.images && project.images.length > 1"
                @click="nextImage"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all backdrop-blur-sm z-10"
              >
                <UIcon
                  name="i-heroicons-chevron-right"
                  class="w-6 h-6 text-white"
                />
              </button>

              <!-- Image Indicators -->
              <div
                v-if="project.images && project.images.length > 1"
                class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"
              >
                <button
                  v-for="(img, idx) in project.images || []"
                  :key="idx"
                  @click="currentImageIndex = idx"
                  :class="[
                    'w-2 h-2 rounded-full transition-all',
                    currentImageIndex === idx
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75',
                  ]"
                ></button>
              </div>
            </div>

            <div
              class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
            ></div>
          </div>

          <!-- Project Title and Badges -->
          <div class="space-y-4">
            <div class="flex gap-3 flex-wrap items-center">
              <UBadge color="primary" variant="soft" size="md">
                {{ project.category }}
              </UBadge>
              <UBadge color="info" variant="soft" size="md">
                {{ project.semester }}
              </UBadge>

              <!-- Inline Status Edit -->
              <div class="relative group">
                <UDropdown
                  v-if="isOwner && canEdit"
                  :items="[
                    statusOptions.map((option) => ({
                      label: option.label,
                      click: () => updateStatus(option.value),
                      disabled: project.status === option.value,
                    })),
                  ]"
                  mode="click"
                  :popper="{ placement: 'bottom-start' }"
                >
                  <UBadge
                    :color="getStatusColor(project.status)"
                    variant="soft"
                    size="md"
                    class="cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all group-hover:scale-105"
                  >
                    {{ project.status }}
                    <UIcon
                      name="i-heroicons-chevron-down"
                      class="w-3 h-3 ml-1 opacity-70"
                    />
                  </UBadge>
                </UDropdown>

                <UBadge
                  v-else
                  :color="getStatusColor(project.status)"
                  variant="soft"
                  size="md"
                >
                  {{ project.status }}
                </UBadge>
              </div>

              <UBadge v-if="isOwner" color="gray" variant="soft" size="md">
                My Project
              </UBadge>
            </div>

            <div class="flex items-start justify-between gap-4">
              <!-- Inline Title Edit -->
              <div class="flex-1">
                <div
                  v-if="!isEditingTitle"
                  class="group flex items-center gap-3"
                >
                  <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
                    {{ project.title }}
                  </h1>
                  <UButton
                    v-if="isOwner"
                    @click="startEditTitle"
                    color="gray"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-pencil"
                    class="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                <div v-else class="flex items-center gap-2">
                  <UInput
                    v-model="editingTitle"
                    size="xl"
                    class="text-4xl font-bold"
                    @keydown.enter="saveTitle"
                    @keydown.escape="cancelEditTitle"
                    autofocus
                  />
                  <UButton
                    @click="saveTitle"
                    color="green"
                    variant="soft"
                    size="sm"
                    icon="i-heroicons-check"
                    :loading="isSavingField"
                  />
                  <UButton
                    @click="cancelEditTitle"
                    color="gray"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-x-mark"
                  />
                </div>
              </div>
            </div>

            <!-- Inline Description Edit -->
            <div class="group">
              <div v-if="!isEditingDescription" class="flex items-start gap-3">
                <p class="text-xl text-gray-600 dark:text-gray-300 flex-1">
                  {{ project.description }}
                </p>
                <UButton
                  v-if="isOwner"
                  @click="startEditDescription"
                  color="gray"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-pencil"
                  class="opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                />
              </div>

              <div v-else class="space-y-2">
                <UTextarea
                  v-model="editingDescription"
                  size="xl"
                  rows="3"
                  class="text-xl"
                  @keydown.ctrl.enter="saveDescription"
                  @keydown.escape="cancelEditDescription"
                  autofocus
                />
                <div class="flex justify-end gap-2">
                  <UButton
                    @click="saveDescription"
                    color="green"
                    variant="soft"
                    size="sm"
                    icon="i-heroicons-check"
                    :loading="isSavingField"
                  >
                    Save
                  </UButton>
                  <UButton
                    @click="cancelEditDescription"
                    color="gray"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-x-mark"
                  >
                    Cancel
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Project Progress (for students) -->
          <div
            v-if="isOwner && project.progress !== undefined"
            class="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700/50"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Project Progress
              </h3>
              <div class="flex items-center gap-2">
                <span class="text-blue-400 font-medium"
                  >{{ project.progress }}%</span
                >
                <UButton
                  v-if="canEdit"
                  @click="isEditingProgress = !isEditingProgress"
                  color="gray"
                  variant="ghost"
                  size="xs"
                  :icon="
                    isEditingProgress
                      ? 'i-heroicons-x-mark'
                      : 'i-heroicons-pencil'
                  "
                />
              </div>
            </div>

            <!-- Progress Bar Display -->
            <div
              v-if="!isEditingProgress"
              class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 mb-2"
            >
              <div
                :style="{ width: `${project.progress}%` }"
                class="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-500"
              ></div>
            </div>

            <!-- Progress Slider Edit -->
            <div v-else class="space-y-3">
              <div class="flex items-center gap-4">
                <input
                  v-model.number="editingProgress"
                  type="range"
                  min="0"
                  max="100"
                  class="flex-1 h-3 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  @input="debouncedProgressUpdate"
                />
                <span class="text-blue-400 font-medium min-w-[50px]">
                  {{ editingProgress }}%
                </span>
              </div>
              <div
                class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3"
              >
                <div
                  :style="{ width: `${editingProgress}%` }"
                  class="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-300"
                ></div>
              </div>
              <div class="flex justify-end gap-2">
                <UButton
                  @click="saveProgress"
                  color="green"
                  variant="soft"
                  size="sm"
                  icon="i-heroicons-check"
                  :loading="isSavingField"
                >
                  Save Progress
                </UButton>
                <UButton
                  @click="cancelEditProgress"
                  color="gray"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-x-mark"
                >
                  Cancel
                </UButton>
              </div>
            </div>

            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {{
                project.progress === 100
                  ? "Project completed! 🎉"
                  : "Keep working to reach 100% completion"
              }}
            </p>
          </div>

          <!-- Project Features & Milestones -->
          <div
            v-if="project.feature && project.feature.length > 0"
            class="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700/50"
          >
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Features & Milestones
            </h3>
            <div class="space-y-4">
              <div
                v-for="feature in project.feature"
                :key="feature.title"
                class="flex items-start gap-4 p-4 bg-gray-100 dark:bg-slate-700/50 rounded-lg"
              >
                <UIcon
                  :name="feature.icon || 'i-heroicons-star'"
                  class="w-6 h-6 text-blue-400 mt-1 flex-shrink-0"
                />
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h4 class="font-semibold text-gray-900 dark:text-white">
                      {{ feature.title }}
                    </h4>
                    <UBadge
                      :color="getFeatureStatusColor(feature.status)"
                      variant="soft"
                      size="sm"
                    >
                      {{ getFeatureStatusLabel(feature.status) }}
                    </UBadge>
                    <UBadge
                      v-if="feature.date"
                      color="gray"
                      variant="soft"
                      size="sm"
                    >
                      {{ formatDate(feature.date) }}
                    </UBadge>
                  </div>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">
                    {{ feature.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Project Description -->
          <div
            class="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700/50"
          >
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              About This Project
            </h3>
            <div class="prose prose-gray dark:prose-invert max-w-none">
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ project.description }}
              </p>
            </div>
          </div>

          <!-- Submission History (for students) -->
          <div
            v-if="isOwner && project.submissions"
            class="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700/50"
          >
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Submission History
            </h3>
            <div class="space-y-3">
              <div
                v-for="submission in project.submissions"
                :key="submission.id"
                class="flex items-center justify-between p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <UIcon
                    :name="getSubmissionIcon(submission.status)"
                    :class="getSubmissionIconColor(submission.status)"
                    class="w-5 h-5"
                  />
                  <div>
                    <p class="text-gray-900 dark:text-white font-medium">
                      {{ submission.title }}
                    </p>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">
                      {{ formatDate(submission.date) }}
                    </p>
                  </div>
                </div>
                <UBadge
                  :color="getSubmissionStatusColor(submission.status)"
                  variant="soft"
                  size="sm"
                >
                  {{ submission.status }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Project Quick Info -->
          <div
            class="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700/50"
          >
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Project Details
            </h3>
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-calendar"
                  class="w-5 h-5 text-blue-400"
                />
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Duration
                  </p>
                  <p class="text-gray-900 dark:text-white">
                    {{ project.duration || "Not specified" }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-academic-cap"
                  class="w-5 h-5 text-green-400"
                />
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Course</p>
                  <p class="text-gray-900 dark:text-white">
                    {{ project.course || "General Project" }}
                  </p>
                </div>
              </div>

              <div v-if="project.githubUrl" class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-code-bracket"
                  class="w-5 h-5 text-purple-400"
                />
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Repository
                  </p>
                  <UButton
                    :to="project.githubUrl"
                    external
                    variant="ghost"
                    size="sm"
                    color="primary"
                    class="p-0 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    View on GitHub
                  </UButton>
                </div>
              </div>

              <div v-if="project.demoUrl" class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-globe-alt"
                  class="w-5 h-5 text-emerald-400"
                />
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Live Demo
                  </p>
                  <UButton
                    :to="project.demoUrl"
                    external
                    variant="ghost"
                    size="sm"
                    color="primary"
                    class="p-0 text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300"
                  >
                    View Demo
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Members -->
          <div
            v-if="project.members && project.members.length > 0"
            class="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700/50"
          >
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Team Members
            </h3>
            <div class="space-y-3">
              <div
                v-for="member in project.members"
                :key="typeof member === 'string' ? member : member.name"
                class="flex items-center gap-3 p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg"
              >
                <img
                  v-if="typeof member === 'object' && member.avatar"
                  :src="member.avatar"
                  :alt="member.name"
                  class="w-8 h-8 rounded-full"
                />
                <UIcon
                  v-else
                  name="i-heroicons-user-circle"
                  class="w-8 h-8 text-gray-500 dark:text-gray-400"
                />
                <div>
                  <p class="text-gray-900 dark:text-white font-medium">
                    {{ typeof member === "string" ? member : member.name }}
                  </p>
                  <p
                    v-if="typeof member === 'object' && member.role"
                    class="text-gray-500 dark:text-gray-400 text-sm"
                  >
                    {{ member.role }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Technologies -->
          <div
            v-if="project.tags && project.tags.length > 0"
            class="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700/50"
          >
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Technologies Used
            </h3>
            <TagList :tags="project.tags" />
          </div>

          <!-- Student Actions -->
          <div
            v-if="isOwner"
            class="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-200 dark:border-slate-700/50"
          >
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Actions
            </h3>
            <div class="space-y-3">
              <UButton
                v-if="canEdit"
                :to="`/student/projects/${project.id}/edit`"
                color="blue"
                variant="soft"
                block
                icon="i-heroicons-pencil"
              >
                Edit Project
              </UButton>

              <UButton
                v-if="canSubmit"
                @click="submitProject"
                color="green"
                variant="solid"
                block
                icon="i-heroicons-paper-airplane"
                :loading="isSubmitting"
              >
                Submit for Review
              </UButton>

              <UButton
                @click="downloadProject"
                color="gray"
                variant="soft"
                block
                icon="i-heroicons-arrow-down-tray"
              >
                Download Project
              </UButton>

              <UButton
                @click="shareProject"
                color="gray"
                variant="soft"
                block
                icon="i-heroicons-share"
              >
                Share Project
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Not Found -->
      <div v-else class="text-center py-12">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-16 h-16 text-yellow-400 mx-auto mb-4"
        />
        <h2 class="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <p class="text-gray-400 mb-6">
          The project you're looking for doesn't exist or you don't have access
          to it.
        </p>
        <UButton to="/student/my-projects" color="blue" variant="solid">
          Back to My Projects
        </UButton>
      </div>
    </UContainer>

    <!-- Submit Confirmation Modal -->
    <UModal v-model="showSubmitModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Submit Project for Review</h3>
        </template>

        <div class="space-y-4">
          <p class="text-gray-600">
            Are you sure you want to submit this project for review? Once
            submitted, you won't be able to make changes until the review is
            complete.
          </p>

          <div
            class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
          >
            <div class="flex items-start gap-3">
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="w-5 h-5 text-yellow-500 mt-0.5"
              />
              <div>
                <p
                  class="text-sm font-medium text-yellow-800 dark:text-yellow-200"
                >
                  Before submitting:
                </p>
                <ul
                  class="text-sm text-yellow-700 dark:text-yellow-300 mt-1 list-disc list-inside"
                >
                  <li>Ensure all features are completed</li>
                  <li>Test your application thoroughly</li>
                  <li>Update your project documentation</li>
                  <li>Check that all files are uploaded</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="gray"
              variant="soft"
              @click="showSubmitModal = false"
            >
              Cancel
            </UButton>
            <UButton
              color="green"
              variant="solid"
              @click="confirmSubmit"
              :loading="isSubmitting"
            >
              Submit for Review
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const projectStore = useProjectStore();
const authStore = useAuthStore();

// Status options for quick updates
const statusOptions = [
  { label: "Draft", value: "Draft" },
  { label: "In Progress", value: "In Progress" },
  { label: "In Review", value: "In Review" },
  { label: "Completed", value: "Completed" },
];

// Reactive data
const project = ref(null);
const isLoading = ref(true);
const currentImageIndex = ref(0);
const showSubmitModal = ref(false);
const isSubmitting = ref(false);
const isEditingTitle = ref(false);
const isEditingDescription = ref(false);
const isEditingProgress = ref(false);
const editingTitle = ref("");
const editingDescription = ref("");
const editingProgress = ref(0);
const isSavingField = ref(false);
const progressUpdateTimeout = ref(null);

// Computed properties
const isOwner = computed(() => {
  if (!project.value || !authStore.user) return false;
  return (
    project.value.authorId === authStore.user.id ||
    project.value.author === authStore.user.username
  );
});

const canEdit = computed(() => {
  return (
    isOwner.value &&
    project.value?.status !== "Completed" &&
    project.value?.status !== "In Review"
  );
});

const canSubmit = computed(() => {
  return (
    isOwner.value &&
    (project.value?.status === "Draft" ||
      project.value?.status === "In Progress")
  );
});

// Methods
const loadProject = async () => {
  try {
    isLoading.value = true;
    const projectId = route.params.id;
    project.value = await projectStore.getProjectById(projectId);
  } catch (error) {
    console.error("Error loading project:", error);
  } finally {
    isLoading.value = false;
  }
};

const previousImage = () => {
  if (project.value?.images?.length > 1) {
    currentImageIndex.value =
      currentImageIndex.value === 0
        ? project.value.images.length - 1
        : currentImageIndex.value - 1;
  }
};

const nextImage = () => {
  if (project.value?.images?.length > 1) {
    currentImageIndex.value =
      currentImageIndex.value === project.value.images.length - 1
        ? 0
        : currentImageIndex.value + 1;
  }
};

const updateStatus = async (newStatus) => {
  try {
    isSavingField.value = true;
    await projectStore.updateProjectStatus(project.value.id, newStatus);
    project.value.status = newStatus;

    const toast = useToast();
    toast.add({
      title: "Status Updated",
      description: `Project status changed to ${newStatus}`,
      color: "blue",
    });
  } catch (error) {
    const toast = useToast();
    toast.add({
      title: "Update Failed",
      description: "Failed to update project status",
      color: "red",
    });
  } finally {
    isSavingField.value = false;
  }
};

const submitProject = () => {
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
      color: "green",
    });

    showSubmitModal.value = false;
  } catch (error) {
    console.error("Error submitting project:", error);
    const toast = useToast();
    toast.add({
      title: "Submission Failed",
      description: "Failed to submit project. Please try again.",
      color: "red",
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
      color: "green",
    });
  }
};

const downloadProject = () => {
  // Implementation for downloading project files
  const toast = useToast();
  toast.add({
    title: "Download initiated",
    description: "Project download will start shortly",
    color: "blue",
  });
};

const getStatusColor = (status) => {
  const colors = {
    Completed: "green",
    "In Progress": "blue",
    "In Review": "yellow",
    Draft: "gray",
    Submitted: "purple",
  };
  return colors[status] || "gray";
};

const getFeatureStatusColor = (status) => {
  const colors = {
    done: "green",
    ongoing: "blue",
    pending: "yellow",
  };
  return colors[status] || "gray";
};

const getFeatureStatusLabel = (status) => {
  const labels = {
    done: "Done",
    ongoing: "Ongoing",
    pending: "In Pending",
  };
  return labels[status] || status;
};

const getSubmissionIcon = (status) => {
  const icons = {
    Approved: "i-heroicons-check-circle",
    Rejected: "i-heroicons-x-circle",
    Pending: "i-heroicons-clock",
  };
  return icons[status] || "i-heroicons-document";
};

const getSubmissionIconColor = (status) => {
  const colors = {
    Approved: "text-green-400",
    Rejected: "text-red-400",
    Pending: "text-yellow-400",
  };
  return colors[status] || "text-gray-400";
};

const getSubmissionStatusColor = (status) => {
  const colors = {
    Approved: "green",
    Rejected: "red",
    Pending: "yellow",
  };
  return colors[status] || "gray";
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Inline editing methods
const startEditTitle = () => {
  if (!canEdit.value) return;
  editingTitle.value = project.value.title;
  isEditingTitle.value = true;
};

const cancelEditTitle = () => {
  isEditingTitle.value = false;
  editingTitle.value = "";
};

const saveTitle = async () => {
  if (
    editingTitle.value.trim() === project.value.title ||
    !editingTitle.value.trim()
  ) {
    cancelEditTitle();
    return;
  }

  try {
    isSavingField.value = true;
    await projectStore.updateProject(project.value.id, {
      title: editingTitle.value.trim(),
    });

    project.value.title = editingTitle.value.trim();
    isEditingTitle.value = false;

    const toast = useToast();
    toast.add({
      title: "Title Updated",
      description: "Project title has been updated successfully",
      color: "green",
    });
  } catch (error) {
    const toast = useToast();
    toast.add({
      title: "Update Failed",
      description: "Failed to update project title",
      color: "red",
    });
  } finally {
    isSavingField.value = false;
  }
};

const startEditDescription = () => {
  if (!canEdit.value) return;
  editingDescription.value = project.value.description;
  isEditingDescription.value = true;
};

const cancelEditDescription = () => {
  isEditingDescription.value = false;
  editingDescription.value = "";
};

const saveDescription = async () => {
  if (
    editingDescription.value.trim() === project.value.description ||
    !editingDescription.value.trim()
  ) {
    cancelEditDescription();
    return;
  }

  try {
    isSavingField.value = true;
    await projectStore.updateProject(project.value.id, {
      description: editingDescription.value.trim(),
    });

    project.value.description = editingDescription.value.trim();
    isEditingDescription.value = false;

    const toast = useToast();
    toast.add({
      title: "Description Updated",
      description: "Project description has been updated successfully",
      color: "green",
    });
  } catch (error) {
    const toast = useToast();
    toast.add({
      title: "Update Failed",
      description: "Failed to update project description",
      color: "red",
    });
  } finally {
    isSavingField.value = false;
  }
};

// Progress editing methods
const startEditProgress = () => {
  if (!canEdit.value) return;
  editingProgress.value = project.value.progress || 0;
  isEditingProgress.value = true;
};

const cancelEditProgress = () => {
  isEditingProgress.value = false;
  editingProgress.value = project.value.progress || 0;
};

const debouncedProgressUpdate = () => {
  if (progressUpdateTimeout.value) {
    clearTimeout(progressUpdateTimeout.value);
  }
  // Visual update is immediate, just debounce the save
};

const saveProgress = async () => {
  if (editingProgress.value === project.value.progress) {
    cancelEditProgress();
    return;
  }

  try {
    isSavingField.value = true;
    await projectStore.updateProject(project.value.id, {
      progress: editingProgress.value,
    });

    project.value.progress = editingProgress.value;
    isEditingProgress.value = false;

    const toast = useToast();
    toast.add({
      title: "Progress Updated",
      description: `Project progress updated to ${editingProgress.value}%`,
      color: "green",
    });
  } catch (error) {
    const toast = useToast();
    toast.add({
      title: "Update Failed",
      description: "Failed to update project progress",
      color: "red",
    });
  } finally {
    isSavingField.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo("/login");
    return;
  }

  await loadProject();
});

// Meta
useHead({
  title: computed(() =>
    project.value
      ? `${project.value.title} - Student Project`
      : "Project Details"
  ),
  meta: [
    {
      name: "description",
      content: computed(
        () => project.value?.description || "Student project details"
      ),
    },
  ],
});
</script>

<style scoped>
/* Custom slider styling */
.slider {
  background: linear-gradient(to right, #3b82f6 0%, #60a5fa 100%);
  outline: none;
  transition: background 0.3s;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
  transition: all 0.2s;
}

.slider::-webkit-slider-thumb:hover {
  background: #f1f5f9;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
  transition: all 0.2s;
}

.slider::-moz-range-thumb:hover {
  background: #f1f5f9;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Custom input focus styles */
input[type="text"]:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 1px;
}
</style>
