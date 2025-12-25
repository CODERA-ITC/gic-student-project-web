<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header Section -->
    <div
      class="py-16 bg-blue-600 dark:bg-slate-800 border-b border-blue-700/30 dark:border-slate-700"
    >
      <UContainer>
        <div class="flex items-center gap-4 mb-4">
          <ButtonsPresetButton preset="back" @click="goBack" />
        </div>
        <div class="space-y-2">
          <h1 class="text-4xl font-black text-white dark:text-white">
            Profile Settings
          </h1>
          <p class="text-blue-100 dark:text-slate-300">
            Manage your account and preferences
          </p>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-1">
          <div
            class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 space-y-1 sticky top-20"
          >
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700',
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
              ]"
            >
              <UIcon :name="tab.icon" class="w-5 h-5" />
              <span class="font-medium">{{ tab.label }}</span>
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="lg:col-span-2">
          <div
            class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
          >
            <!-- Profile Information -->
            <ProfileInformation
              v-if="activeTab === 'profile'"
              @save="handleProfileSave"
              @cancel="handleCancel"
            />

            <!-- Account Settings -->
            <ProfileAccountSettings
              v-if="activeTab === 'account'"
              @update-password="handlePasswordUpdate"
              @toggle-2fa="handleToggle2FA"
              @revoke-session="handleRevokeSession"
            />

            <!-- Notifications -->
            <ProfileNotificationSettings
              v-if="activeTab === 'notifications'"
              @save="handleNotificationsSave"
            />

            <!-- Privacy -->
            <ProfilePrivacySettings
              v-if="activeTab === 'privacy'"
              @save="handlePrivacySave"
              @data-request="handleDataRequest"
              @delete-account="handleDeleteAccount"
            />
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const authStore = useAuthStore();
const activeTab = ref("profile");

const goBack = () => {
  // Navigate back to role-specific dashboard
  if (authStore.isStudent) {
    router.push("/student/dashboard");
  } else if (authStore.isTeacher) {
    router.push("/teacher/dashboard");
  } else {
    router.push("/");
  }
};

const tabs = ref([
  { id: "profile", label: "Profile", icon: "i-heroicons-user" },
  { id: "account", label: "Account", icon: "i-heroicons-lock-closed" },
  { id: "notifications", label: "Notifications", icon: "i-heroicons-bell" },
  { id: "privacy", label: "Privacy", icon: "i-heroicons-shield-check" },
]);

// Event handlers
const handleProfileSave = (data: any) => {
  console.log("Profile saved:", data);
  // TODO: Implement API call
};

const handleCancel = () => {
  console.log("Changes cancelled");
};

const handlePasswordUpdate = (data: any) => {
  console.log("Password update:", data);
  // TODO: Implement API call
};

const handleToggle2FA = (enabled: boolean) => {
  console.log("2FA toggled:", enabled);
  // TODO: Implement API call
};

const handleRevokeSession = (sessionId: number) => {
  console.log("Session revoked:", sessionId);
  // TODO: Implement API call
};

const handleNotificationsSave = (data: any) => {
  console.log("Notifications saved:", data);
  // TODO: Implement API call
};

const handlePrivacySave = (data: any) => {
  console.log("Privacy settings saved:", data);
  // TODO: Implement API call
};

const handleDataRequest = () => {
  console.log("Data request initiated");
  // TODO: Implement data export
};

const handleDeleteAccount = () => {
  console.log("Account deletion requested");
  // TODO: Implement account deletion with confirmation
};

useHead({
  title: "Profile Settings - GIC Student Portal",
  meta: [
    {
      name: "description",
      content: "Manage your profile and account settings",
    },
  ],
});
</script>
