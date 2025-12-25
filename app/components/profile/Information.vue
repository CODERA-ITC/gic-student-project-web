<template>
  <div class="p-6 space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
        Profile Information
      </h2>
      <p class="text-sm text-gray-600 dark:text-slate-400">
        Update your personal information and profile picture
      </p>
    </div>

    <!-- Avatar Upload -->
    <div class="flex items-center gap-6">
      <div
        v-if="formData.avatar"
        class="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 dark:border-slate-700"
      >
        <img
          :src="formData.avatar"
          :alt="formData.name"
          class="w-full h-full object-cover"
        />
      </div>
      <div
        v-else
        class="w-24 h-24 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center border-4 border-gray-200 dark:border-slate-700"
      >
        <span class="text-2xl font-bold text-white">{{
          getInitials(formData.name)
        }}</span>
      </div>
      <div>
        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/gif"
          class="hidden"
          @change="handleFileChange"
        />
        <ButtonsPresetButton
          preset="secondary"
          label="Change Avatar"
          icon="i-heroicons-camera"
          size="sm"
          @click="triggerFileInput"
        />
        <p class="text-xs text-gray-500 dark:text-slate-400 mt-2">
          JPG, PNG or GIF. Max size 2MB.
        </p>
      </div>
    </div>

    <!-- Form Fields -->
    <div class="space-y-4">
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          Full Name
        </label>
        <UInput
          v-model="formData.name"
          placeholder="Enter your full name"
          size="lg"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          Email Address
        </label>
        <UInput
          v-model="formData.email"
          type="email"
          placeholder="your.email@example.com"
          size="lg"
          disabled
        />
        <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
          Email cannot be changed. Contact admin for assistance.
        </p>
      </div>

      <!-- Student-specific fields -->
      <div v-if="userRole === 'STUDENT'">
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          Student ID
        </label>
        <UInput
          v-model="formData.studentId"
          placeholder="Enter student ID"
          size="lg"
        />
      </div>

      <!-- Teacher-specific fields -->
      <div v-if="userRole === 'TEACHER'">
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          Employee ID
        </label>
        <UInput
          v-model="formData.employeeId"
          placeholder="Enter employee ID"
          size="lg"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          {{ userRole === "TEACHER" ? "Department" : "Program" }}
        </label>
        <UInput
          v-model="formData.program"
          :placeholder="
            userRole === 'TEACHER'
              ? 'e.g., Computer Science Department'
              : 'e.g., Computer Science'
          "
          size="lg"
        />
      </div>

      <!-- Student Year Level -->
      <div v-if="userRole === 'STUDENT'">
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          Year Level
        </label>
        <USelectMenu v-model="formData.year" :items="yearOptions" size="lg" />
      </div>

      <!-- Teacher Position -->
      <div v-if="userRole === 'TEACHER'">
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          Position
        </label>
        <USelectMenu
          v-model="formData.position"
          :items="positionOptions"
          size="lg"
        />
      </div>

      <!-- Bio/About (both roles) -->
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          Bio
        </label>
        <UTextarea
          v-model="formData.bio"
          :placeholder="
            userRole === 'TEACHER'
              ? 'Tell students about your expertise and teaching philosophy...'
              : 'Tell others about yourself...'
          "
          :rows="4"
          size="lg"
        />
      </div>
    </div>

    <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
      <ButtonsPresetButton
        preset="cancel"
        label="Cancel"
        @click="handleCancel"
      />
      <ButtonsPresetButton
        preset="save"
        label="Save Changes"
        @click="handleSave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const userRole = computed(() => authStore.userRole);

const emit = defineEmits(["save", "cancel"]);

const isSaving = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const formData = ref({
  name: authStore.currentUser?.name || "",
  email: authStore.currentUser?.email || "",
  studentId: "",
  employeeId: "",
  program: "",
  year: { label: "3rd Year", value: "3" },
  position: { label: "Associate Professor", value: "associate" },
  bio: "",
  avatar: authStore.currentUser?.avatar || undefined,
});

const yearOptions = [
  { label: "1st Year", value: "1" },
  { label: "2nd Year", value: "2" },
  { label: "3rd Year", value: "3" },
  { label: "4th Year", value: "4" },
];

const positionOptions = [
  { label: "Professor", value: "professor" },
  { label: "Associate Professor", value: "associate" },
  { label: "Assistant Professor", value: "assistant" },
  { label: "Lecturer", value: "lecturer" },
  { label: "Teaching Assistant", value: "ta" },
];

const getInitials = (name: string): string => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!validTypes.includes(file.type)) {
    alert("Please upload a valid image file (JPG, PNG, or GIF)");
    return;
  }

  // Validate file size (2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    alert("File size must be less than 2MB");
    return;
  }

  // Create preview URL
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.value.avatar = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const handleAvatarChange = () => {
  console.log("Avatar change clicked");
  // TODO: Implement avatar upload
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    // TODO: Implement API call to save profile
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    emit("save", formData.value);
  } finally {
    isSaving.value = false;
  }
};

const handleCancel = () => {
  emit("cancel");
};
</script>
