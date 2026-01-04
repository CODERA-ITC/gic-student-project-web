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
      <!-- <div v-if="userRole === 'STUDENT'">
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
      </div> -->

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
          :rows="5"
          :cols="100"
          size="xl"
        />
      </div>

      <!-- Skills & Expertise -->
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          Skills & Expertise
        </label>
        <p class="text-xs text-gray-500 dark:text-slate-400 mb-2">
          Add skills one by one. Press Enter or click Add to include each skill.
        </p>
        <div class="flex gap-2 mb-3">
          <UInput
            v-model="newSkill"
            placeholder="e.g., JavaScript, Python, React..."
            size="lg"
            class="flex-1"
            @keyup.enter="addSkill"
          />
          <ButtonsPresetButton
            preset="secondary"
            label="Add"
            icon="i-heroicons-plus"
            size="sm"
            @click="addSkill"
            :disabled="!newSkill.trim()"
          />
        </div>
        <div v-if="formData.skills.length > 0" class="flex gap-2 flex-wrap">
          <div
            v-for="(skill, index) in formData.skills"
            :key="index"
            class="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-200 dark:border-blue-700 flex items-center gap-2"
          >
            {{ skill }}
            <button
              @click="removeSkill(index)"
              class="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
            >
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
            </button>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500 dark:text-slate-400 italic">
          No skills added yet.
        </p>
      </div>

      <!-- Social Links -->
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          Social Links
        </label>
        <p class="text-xs text-gray-500 dark:text-slate-400 mb-3">
          Add links to your professional profiles and portfolio
        </p>
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-simple-icons-github"
              class="w-5 h-5 text-gray-700 dark:text-gray-300"
            />
            <UInput
              v-model="formData.socialLinks.github"
              placeholder="https://github.com/username"
              size="lg"
              class="flex-1"
            />
          </div>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-simple-icons-linkedin"
              class="w-5 h-5 text-blue-600 dark:text-blue-400"
            />
            <UInput
              v-model="formData.socialLinks.linkedin"
              placeholder="https://linkedin.com/in/username"
              size="lg"
              class="flex-1"
            />
          </div>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-simple-icons-twitter"
              class="w-5 h-5 text-sky-500 dark:text-sky-400"
            />
            <UInput
              v-model="formData.socialLinks.twitter"
              placeholder="https://twitter.com/username"
              size="lg"
              class="flex-1"
            />
          </div>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-heroicons-globe-alt"
              class="w-5 h-5 text-purple-600 dark:text-purple-400"
            />
            <UInput
              v-model="formData.socialLinks.portfolio"
              placeholder="https://yourportfolio.com"
              size="lg"
              class="flex-1"
            />
          </div>
        </div>
      </div>

      <!-- Phone & GPA (Student) -->
      <div v-if="userRole === 'STUDENT'" class="grid grid-cols-2 gap-4">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
          >
            Phone Number
          </label>
          <UInput
            v-model="formData.phone"
            placeholder="+855 12 345 678"
            size="lg"
          />
        </div>
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
          >
            GPA
          </label>
          <UInput
            v-model="formData.gpa"
            type="number"
            step="0.01"
            min="0"
            max="4.0"
            placeholder="3.85"
            size="lg"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
      <ButtonsPresetButton
        preset="save"
        label="Save Changes"
        @click="handleSave"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const userRole = computed(() => authStore.userRole);
const toast = useToast();

interface ProfileData {
  bio?: string;
  skills?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  program?: string;
  year?: string;
  phone?: string;
  gpa?: string;
}

interface Props {
  initialData?: ProfileData;
}

const props = defineProps<Props>();
const emit = defineEmits(["save", "cancel"]);

const isSaving = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const newSkill = ref("");

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
  skills: [] as string[],
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    portfolio: "",
  },
  phone: "",
  gpa: "",
});

// Store the initial state for change detection
const initialFormData = ref<any>(null);

// Load initial data from props
onMounted(() => {
  if (props.initialData) {
    formData.value.bio = props.initialData.bio || "";
    formData.value.skills = [...(props.initialData.skills || [])];
    formData.value.socialLinks = {
      ...formData.value.socialLinks,
      ...(props.initialData.socialLinks || {}),
    };
    formData.value.program = props.initialData.program || "";
    formData.value.phone = props.initialData.phone || "";
    formData.value.gpa = props.initialData.gpa || "";

    if (props.initialData.year) {
      const yearMatch = yearOptions.find(
        (opt) => opt.label === props.initialData.year
      );
      if (yearMatch) {
        formData.value.year = yearMatch;
      }
    }
  }

  // Create a deep copy of initial state for comparison
  initialFormData.value = JSON.parse(
    JSON.stringify({
      ...formData.value,
      year: formData.value.year.label,
      position: formData.value.position.label,
    })
  );
});

const yearOptions = [
  { label: "1st Year", value: "1" },
  { label: "2nd Year", value: "2" },
  { label: "3rd Year", value: "3" },
  { label: "4th Year", value: "4" },
  { label: "5th Year", value: "5" },
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

const addSkill = () => {
  const skill = newSkill.value.trim();
  if (skill && !formData.value.skills.includes(skill)) {
    formData.value.skills.push(skill);
    newSkill.value = "";
  }
};

const removeSkill = (index: number) => {
  formData.value.skills.splice(index, 1);
};

// Check if data has changed
const hasChanges = (): boolean => {
  if (!initialFormData.value) return false;

  const currentData = {
    ...formData.value,
    year: formData.value.year.label || formData.value.year,
    position: formData.value.position.label || formData.value.position,
  };

  const current = JSON.stringify(currentData);
  const initial = JSON.stringify(initialFormData.value);

  return current !== initial;
};

const handleSave = async () => {
  // Check if anything changed
  if (!hasChanges()) {
    toast.add({
      title: "No Changes",
      description: "No changes detected to update.",
      icon: "i-heroicons-information-circle",
      color: "warning",
    });
    return;
  }

  isSaving.value = true;
  try {
    // TODO: Implement API call to save profile
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

    // Prepare data to emit
    const dataToSave = {
      ...formData.value,
      year: formData.value.year.label || formData.value.year,
      position: formData.value.position.label || formData.value.position,
    };

    emit("save", dataToSave);

    // Update initial data after successful save
    initialFormData.value = JSON.parse(JSON.stringify(dataToSave));

    toast.add({
      title: "Success",
      description: "Profile updated successfully!",
      icon: "i-heroicons-check-circle",
      class: "bg-green-50 dark:bg-green-900/30",
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to update profile. Please try again.",
      icon: "i-heroicons-x-circle",
      class: "bg-red-50 dark:bg-red-900/30",
    });
  } finally {
    isSaving.value = false;
  }
};
</script>
