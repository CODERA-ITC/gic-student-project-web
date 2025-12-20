<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <div
      class="py-8 bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-blue-700/30"
    >
      <UContainer>
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <h1 class="text-3xl font-bold text-white">Edit Project</h1>
            <p class="text-gray-200">Update your project information</p>
          </div>
          <ButtonsPresetButton
            preset="back"
            :to="`/student/my-projects/${$route.params.id}`"
          />
        </div>
      </UContainer>
    </div>

    <!-- Content -->
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
          <p class="text-gray-300">Loading project...</p>
        </div>
      </div>

      <div v-else-if="project" class="max-w-4xl mx-auto">
        <!-- Save Banner -->
        <div
          v-if="hasUnsavedChanges"
          class="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-5 h-5 text-yellow-400"
            />
            <span class="text-yellow-200">You have unsaved changes</span>
          </div>
          <div class="flex gap-2">
            <UButton
              @click="discardChanges"
              color="gray"
              variant="soft"
              size="sm"
            >
              Discard
            </UButton>
            <UButton
              @click="saveChanges"
              color="yellow"
              variant="solid"
              size="sm"
              :loading="isSaving"
            >
              Save Changes
            </UButton>
          </div>
        </div>

        <!-- Edit Form -->
        <form @submit.prevent="saveChanges" class="space-y-8">
          <!-- Basic Information -->
          <div class="bg-slate-800/50 rounded-xl p-6">
            <h2 class="text-xl font-bold text-white mb-6">Basic Information</h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Project Title *
                </label>
                <UInput
                  v-model="editForm.title"
                  placeholder="Enter project title"
                  size="lg"
                  required
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <UTextarea
                  v-model="editForm.description"
                  placeholder="Describe your project"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <USelect
                  v-model="editForm.category"
                  :options="categoryOptions"
                  placeholder="Select category"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Semester *
                </label>
                <USelect
                  v-model="editForm.semester"
                  :options="semesterOptions"
                  placeholder="Select semester"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Duration
                </label>
                <USelect
                  v-model="editForm.duration"
                  :options="durationOptions"
                  placeholder="Select duration"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Course
                </label>
                <UInput
                  v-model="editForm.course"
                  placeholder="Enter course name"
                />
              </div>
            </div>
          </div>

          <!-- Project Links -->
          <div class="bg-slate-800/50 rounded-xl p-6">
            <h2 class="text-xl font-bold text-white mb-6">Project Links</h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  GitHub Repository
                </label>
                <UInput
                  v-model="editForm.githubUrl"
                  placeholder="https://github.com/username/repo"
                  type="url"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Live Demo
                </label>
                <UInput
                  v-model="editForm.demoUrl"
                  placeholder="https://your-demo.com"
                  type="url"
                />
              </div>
            </div>
          </div>

          <!-- Technologies -->
          <div class="bg-slate-800/50 rounded-xl p-6">
            <h2 class="text-xl font-bold text-white mb-6">Technologies</h2>
            <div class="space-y-4">
              <div class="flex gap-2">
                <UInput
                  v-model="techInput"
                  placeholder="Add a technology..."
                  @keydown.enter.prevent="addTechnology"
                  class="flex-1"
                />
                <UButton
                  @click="addTechnology"
                  color="blue"
                  variant="solid"
                  icon="i-heroicons-plus"
                  :disabled="!techInput.trim()"
                >
                  Add
                </UButton>
              </div>

              <div
                v-if="editForm.technologies.length > 0"
                class="flex flex-wrap gap-2"
              >
                <UBadge
                  v-for="(tech, index) in editForm.technologies"
                  :key="index"
                  color="blue"
                  variant="soft"
                  class="px-3 py-1"
                >
                  {{ tech }}
                  <UButton
                    @click="removeTechnology(index)"
                    color="red"
                    variant="ghost"
                    size="2xs"
                    icon="i-heroicons-x-mark"
                    class="ml-1"
                  />
                </UBadge>
              </div>
            </div>
          </div>

          <!-- Project Images -->
          <div class="bg-slate-800/50 rounded-xl p-6">
            <h2 class="text-xl font-bold text-white mb-6">Project Images</h2>
            <div class="space-y-4">
              <!-- Current Images -->
              <div
                v-if="editForm.images.length > 0"
                class="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div
                  v-for="(image, index) in editForm.images"
                  :key="index"
                  class="relative group"
                >
                  <img
                    :src="image"
                    :alt="`Project image ${index + 1}`"
                    class="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    @click="removeImage(index)"
                    class="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <UIcon
                      name="i-heroicons-x-mark"
                      class="w-4 h-4 text-white"
                    />
                  </button>
                </div>
              </div>

              <!-- Add Images -->
              <div
                @click="$refs.imageInput.click()"
                @drop.prevent="handleImageDrop"
                @dragover.prevent
                class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <UIcon
                  name="i-heroicons-photo"
                  class="w-12 h-12 text-gray-400 mx-auto mb-4"
                />
                <p class="text-gray-300 mb-2">
                  Click to upload or drag and drop
                </p>
                <p class="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>

              <input
                ref="imageInput"
                type="file"
                multiple
                accept="image/*"
                @change="handleImageSelect"
                class="hidden"
              />
            </div>
          </div>

          <!-- Features/Milestones -->
          <div
            v-if="editForm.feature && editForm.feature.length > 0"
            class="bg-slate-800/50 rounded-xl p-6"
          >
            <h2 class="text-xl font-bold text-white mb-6">
              Features & Milestones
            </h2>
            <div class="space-y-4">
              <div
                v-for="(feature, index) in editForm.feature"
                :key="index"
                class="p-4 bg-slate-700/50 rounded-lg"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 space-y-3">
                    <UInput
                      v-model="feature.title"
                      placeholder="Feature title"
                    />
                    <UTextarea
                      v-model="feature.description"
                      placeholder="Feature description"
                      rows="2"
                    />
                    <div class="grid grid-cols-3 gap-3">
                      <UInput
                        v-model="feature.date"
                        type="date"
                        placeholder="Due date"
                      />
                      <USelect
                        v-model="feature.status"
                        :options="featureStatusOptions"
                        placeholder="Status"
                      />
                      <UInput v-model="feature.icon" placeholder="Icon name" />
                    </div>
                  </div>
                  <UButton
                    @click="removeFeature(index)"
                    color="red"
                    variant="soft"
                    size="sm"
                    icon="i-heroicons-trash"
                  >
                  </UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress (if applicable) -->
          <div
            v-if="editForm.progress !== undefined"
            class="bg-slate-800/50 rounded-xl p-6"
          >
            <h2 class="text-xl font-bold text-white mb-6">Project Progress</h2>
            <div class="space-y-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Completion Percentage: {{ editForm.progress }}%
              </label>
              <input
                v-model.number="editForm.progress"
                type="range"
                min="0"
                max="100"
                step="5"
                class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div class="w-full bg-slate-700 rounded-full h-3">
                <div
                  :style="{ width: `${editForm.progress}%` }"
                  class="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full transition-all duration-300"
                ></div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-6">
            <UButton
              type="submit"
              color="blue"
              variant="solid"
              size="lg"
              icon="i-heroicons-check"
              :loading="isSaving"
              :disabled="!hasUnsavedChanges"
            >
              Save Changes
            </UButton>

            <UButton
              @click="discardChanges"
              color="gray"
              variant="soft"
              size="lg"
              :disabled="!hasUnsavedChanges"
            >
              Discard Changes
            </UButton>

            <UButton
              :to="`/student/my-projects/${project.id}`"
              color="gray"
              variant="outline"
              size="lg"
            >
              Cancel
            </UButton>
          </div>
        </form>
      </div>

      <!-- Project Not Found -->
      <div v-else class="text-center py-12">
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-16 h-16 text-yellow-400 mx-auto mb-4"
        />
        <h2 class="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <p class="text-gray-400 mb-6">
          The project you're trying to edit doesn't exist or you don't have
          permission to edit it.
        </p>
        <UButton to="/student/my-projects" color="blue" variant="solid">
          Back to My Projects
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const authStore = useAuthStore();

// State
const project = ref(null);
const isLoading = ref(true);
const isSaving = ref(false);
const techInput = ref("");

// Form data
const editForm = ref({
  title: "",
  description: "",
  category: "",
  semester: "",
  duration: "",
  course: "",
  githubUrl: "",
  demoUrl: "",
  technologies: [],
  images: [],
  feature: [],
  progress: 0,
});

// Original data for comparison
const originalData = ref({});

// Options
const categoryOptions = [
  { label: "Web Development", value: "Web" },
  { label: "Mobile Development", value: "Mobile" },
  { label: "Data Science", value: "Data Science" },
  { label: "AI/Machine Learning", value: "AI/ML" },
  { label: "Game Development", value: "Game" },
  { label: "Cybersecurity", value: "Security" },
  { label: "IoT", value: "IoT" },
  { label: "Blockchain", value: "Blockchain" },
  { label: "Other", value: "Other" },
];

const semesterOptions = [
  { label: "Semester 1, 2024", value: "Semester 1, 2024" },
  { label: "Semester 2, 2024", value: "Semester 2, 2024" },
  { label: "Semester 1, 2025", value: "Semester 1, 2025" },
  { label: "Semester 2, 2025", value: "Semester 2, 2025" },
];

const durationOptions = [
  { label: "1 month", value: "1 month" },
  { label: "2 months", value: "2 months" },
  { label: "3 months", value: "3 months" },
  { label: "4 months", value: "4 months" },
  { label: "6 months", value: "6 months" },
  { label: "1 year", value: "1 year" },
];

const featureStatusOptions = [
  { label: "In Pending", value: "pending" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Done", value: "done" },
];

// Computed
const hasUnsavedChanges = computed(() => {
  return JSON.stringify(editForm.value) !== JSON.stringify(originalData.value);
});

const canEdit = computed(() => {
  if (!project.value || !authStore.user) return false;
  return (
    project.value.author?.name === authStore.user.name &&
    project.value.status !== "Completed" &&
    project.value.status !== "In Review"
  );
});

// Methods
const loadProject = async () => {
  try {
    isLoading.value = true;
    const projectId = route.params.id;
    project.value = await projectStore.getProjectById(projectId);

    if (project.value) {
      // Populate form with project data
      editForm.value = {
        title: project.value.title || "",
        description: project.value.description || "",
        category: project.value.category || "",
        semester: project.value.semester || "",
        duration: project.value.duration || "",
        course: project.value.course || "",
        githubUrl: project.value.githubUrl || "",
        demoUrl: project.value.demoUrl || "",
        technologies: [...(project.value.technologies || [])],
        images: [...(project.value.images || [])],
        feature: project.value.feature ? [...project.value.feature] : [],
        progress: project.value.progress || 0,
      };

      // Store original data for comparison
      originalData.value = JSON.parse(JSON.stringify(editForm.value));
    }
  } catch (error) {
    console.error("Error loading project:", error);
  } finally {
    isLoading.value = false;
  }
};

const addTechnology = () => {
  if (
    techInput.value.trim() &&
    !editForm.value.technologies.includes(techInput.value.trim())
  ) {
    editForm.value.technologies.push(techInput.value.trim());
    techInput.value = "";
  }
};

const removeTechnology = (index) => {
  editForm.value.technologies.splice(index, 1);
};

const handleImageSelect = (event) => {
  const files = event.target.files;
  if (files) {
    processImageFiles(files);
  }
};

const handleImageDrop = (event) => {
  const files = event.dataTransfer.files;
  if (files) {
    processImageFiles(files);
  }
};

const processImageFiles = (files) => {
  Array.from(files).forEach((file) => {
    if (file.size > 5 * 1024 * 1024) {
      const toast = useToast();
      toast.add({
        title: "File too large",
        description: `${file.name} is larger than 5MB`,
        color: "red",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      editForm.value.images.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = (index) => {
  editForm.value.images.splice(index, 1);
};

const removeFeature = (index) => {
  editForm.value.feature.splice(index, 1);
};

const saveChanges = async () => {
  if (!canEdit.value) {
    const toast = useToast();
    toast.add({
      title: "Permission Denied",
      description: "You cannot edit this project",
      color: "red",
    });
    return;
  }

  try {
    isSaving.value = true;

    // Update the project with form data
    const updatedProject = {
      ...project.value,
      ...editForm.value,
    };

    // In a real app, this would call an API
    // For now, we'll update the store directly
    const projectIndex = projectStore.userProjects.findIndex(
      (p) => p.id === project.value.id
    );
    if (projectIndex !== -1) {
      projectStore.userProjects[projectIndex] = updatedProject;
    }

    // Update original data to reflect saved state
    originalData.value = JSON.parse(JSON.stringify(editForm.value));
    project.value = updatedProject;

    const toast = useToast();
    toast.add({
      title: "Project Updated",
      description: "Your project has been successfully updated",
      color: "green",
    });
  } catch (error) {
    console.error("Error saving project:", error);
    const toast = useToast();
    toast.add({
      title: "Save Failed",
      description: "Failed to save project changes",
      color: "red",
    });
  } finally {
    isSaving.value = false;
  }
};

const discardChanges = () => {
  editForm.value = JSON.parse(JSON.stringify(originalData.value));
};

// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    await navigateTo("/login");
    return;
  }

  await loadProject();

  if (!canEdit.value) {
    const toast = useToast();
    toast.add({
      title: "Access Denied",
      description: "You do not have permission to edit this project",
      color: "red",
    });
    await navigateTo("/student/my-projects");
  }
});

// Meta
useHead({
  title: computed(() =>
    project.value ? `Edit ${project.value.title}` : "Edit Project"
  ),
  meta: [
    {
      name: "description",
      content: "Edit your student project information",
    },
  ],
});
</script>
