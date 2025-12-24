<template>
  <div class="p-6 space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
        Privacy Settings
      </h2>
      <p class="text-sm text-gray-600 dark:text-slate-400">
        Control who can see your information
      </p>
    </div>

    <!-- Profile Visibility -->
    <div>
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
        Profile Visibility
      </h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between py-3">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Public Profile
            </h4>
            <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
              Allow others to view your profile page
            </p>
          </div>
          <UToggle v-model="settings.publicProfile" />
        </div>

        <div class="flex items-center justify-between py-3">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Show {{ userRole === "TEACHER" ? "Courses" : "Projects" }}
            </h4>
            <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
              Display your
              {{ userRole === "TEACHER" ? "courses" : "projects" }} on your
              profile
            </p>
          </div>
          <UToggle v-model="settings.showProjects" />
        </div>

        <div class="flex items-center justify-between py-3">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Show Email
            </h4>
            <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
              Let others see your email address
            </p>
          </div>
          <UToggle v-model="settings.showEmail" />
        </div>

        <div
          v-if="userRole === 'STUDENT'"
          class="flex items-center justify-between py-3"
        >
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Show Academic Info
            </h4>
            <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
              Display your year level and program
            </p>
          </div>
          <UToggle v-model="settings.showAcademicInfo" />
        </div>
      </div>
    </div>

    <!-- Activity Visibility -->
    <div class="border-t border-gray-200 dark:border-slate-700 pt-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
        Activity Visibility
      </h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between py-3">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Online Status
            </h4>
            <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
              Show when you're online
            </p>
          </div>
          <UToggle v-model="settings.showOnlineStatus" />
        </div>

        <div class="flex items-center justify-between py-3">
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Activity Feed
            </h4>
            <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
              Share your activities with others
            </p>
          </div>
          <UToggle v-model="settings.showActivity" />
        </div>
      </div>
    </div>

    <!-- Data & Privacy -->
    <div class="border-t border-gray-200 dark:border-slate-700 pt-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
        Data & Privacy
      </h3>
      <div class="space-y-4">
        <div
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg"
        >
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white">
              Download Your Data
            </h4>
            <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
              Request a copy of your personal data
            </p>
          </div>
          <ButtonsPresetButton
            preset="filter"
            label="Request"
            size="sm"
            @click="handleDataRequest"
          />
        </div>

        <div
          class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
        >
          <div>
            <h4 class="text-sm font-medium text-red-900 dark:text-red-300">
              Delete Account
            </h4>
            <p class="text-xs text-red-600 dark:text-red-400 mt-1">
              Permanently delete your account and data
            </p>
          </div>
          <ButtonsPresetButton
            preset="delete"
            label="Delete"
            size="sm"
            @click="handleDeleteAccount"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-end pt-4">
      <ButtonsPresetButton
        preset="save"
        label="Save Settings"
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

const emit = defineEmits(["save", "data-request", "delete-account"]);

const isSaving = ref(false);

const settings = ref({
  publicProfile: true,
  showProjects: true,
  showEmail: false,
  showAcademicInfo: true,
  showOnlineStatus: true,
  showActivity: false,
});

const handleSave = async () => {
  isSaving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    emit("save", settings.value);
  } finally {
    isSaving.value = false;
  }
};

const handleDataRequest = () => {
  emit("data-request");
};

const handleDeleteAccount = () => {
  emit("delete-account");
};
</script>
