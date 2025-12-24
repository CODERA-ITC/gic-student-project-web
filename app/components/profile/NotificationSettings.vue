<template>
  <div class="p-6 space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
        Notification Preferences
      </h2>
      <p class="text-sm text-gray-600 dark:text-slate-400">
        Choose what notifications you want to receive
      </p>
    </div>

    <!-- Notification Categories -->
    <div class="space-y-6">
      <!-- Project Notifications -->
      <div>
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
          Project Notifications
        </h3>
        <div class="space-y-3">
          <div
            v-for="notif in projectNotifications"
            :key="notif.id"
            class="flex items-center justify-between py-3"
          >
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ notif.label }}
              </h4>
              <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
                {{ notif.description }}
              </p>
            </div>
            <UToggle v-model="notif.enabled" />
          </div>
        </div>
      </div>

      <!-- System Notifications -->
      <div class="border-t border-gray-200 dark:border-slate-700 pt-6">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
          System Notifications
        </h3>
        <div class="space-y-3">
          <div
            v-for="notif in systemNotifications"
            :key="notif.id"
            class="flex items-center justify-between py-3"
          >
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ notif.label }}
              </h4>
              <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
                {{ notif.description }}
              </p>
            </div>
            <UToggle v-model="notif.enabled" />
          </div>
        </div>
      </div>

      <!-- Email Notifications -->
      <div class="border-t border-gray-200 dark:border-slate-700 pt-6">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">
          Email Notifications
        </h3>
        <div class="space-y-3">
          <div
            v-for="notif in emailNotifications"
            :key="notif.id"
            class="flex items-center justify-between py-3"
          >
            <div>
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                {{ notif.label }}
              </h4>
              <p class="text-xs text-gray-600 dark:text-slate-400 mt-1">
                {{ notif.description }}
              </p>
            </div>
            <UToggle v-model="notif.enabled" />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end pt-4">
      <ButtonsPresetButton
        preset="save"
        label="Save Preferences"
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

const emit = defineEmits(["save"]);

const isSaving = ref(false);

// Project notifications - different based on role
const projectNotifications = computed(() => {
  if (userRole.value === "TEACHER") {
    return [
      {
        id: 1,
        label: "New Project Submissions",
        description: "Get notified when students submit projects for review",
        enabled: true,
      },
      {
        id: 2,
        label: "Project Updates",
        description:
          "Receive notifications when students update their projects",
        enabled: true,
      },
      {
        id: 3,
        label: "Submission Deadlines",
        description: "Reminders for upcoming submission deadlines",
        enabled: true,
      },
    ];
  } else {
    return [
      {
        id: 1,
        label: "Project Reviews",
        description: "Get notified when your projects are reviewed",
        enabled: true,
      },
      {
        id: 2,
        label: "Grade Updates",
        description: "Receive notifications when grades are posted",
        enabled: true,
      },
      {
        id: 3,
        label: "Project Comments",
        description: "Get notified of new comments on your projects",
        enabled: true,
      },
    ];
  }
});

const systemNotifications = ref([
  {
    id: 1,
    label: "New Announcements",
    description: "Stay updated with system announcements",
    enabled: true,
  },
  {
    id: 2,
    label: "Account Activity",
    description: "Alerts for login attempts and security events",
    enabled: true,
  },
  {
    id: 3,
    label: "Feature Updates",
    description: "Learn about new features and improvements",
    enabled: false,
  },
]);

const emailNotifications = ref([
  {
    id: 1,
    label: "Daily Summary",
    description: "Receive a daily email summary of your activities",
    enabled: false,
  },
  {
    id: 2,
    label: "Weekly Report",
    description: "Get a weekly summary of your progress",
    enabled: true,
  },
  {
    id: 3,
    label: "Important Updates",
    description: "Receive emails for critical notifications only",
    enabled: true,
  },
]);

const handleSave = async () => {
  isSaving.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    emit("save", {
      project: projectNotifications.value,
      system: systemNotifications.value,
      email: emailNotifications.value,
    });
  } finally {
    isSaving.value = false;
  }
};
</script>
