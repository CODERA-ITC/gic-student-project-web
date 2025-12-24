<template>
  <div class="p-6 space-y-6">
    <div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">
        Account Settings
      </h2>
      <p class="text-sm text-gray-600 dark:text-slate-400">
        Manage your account security and preferences
      </p>
    </div>

    <!-- Change Password -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Change Password
      </h3>
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          Current Password
        </label>
        <UInput
          v-model="passwordData.current"
          type="password"
          placeholder="Enter current password"
          size="lg"
        />
      </div>
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          New Password
        </label>
        <UInput
          v-model="passwordData.new"
          type="password"
          placeholder="Enter new password"
          size="lg"
        />
      </div>
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          Confirm New Password
        </label>
        <UInput
          v-model="passwordData.confirm"
          type="password"
          placeholder="Confirm new password"
          size="lg"
        />
      </div>
      <ButtonsPresetButton
        preset="save"
        label="Update Password"
        @click="handleUpdatePassword"
      />
    </div>

    <!-- Two-Factor Authentication -->
    <div class="border-t border-gray-200 dark:border-slate-700 pt-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Two-Factor Authentication
          </h3>
          <p class="text-sm text-gray-600 dark:text-slate-400 mt-1">
            Add an extra layer of security to your account
          </p>
        </div>
        <ButtonsPresetButton
          :preset="twoFactorEnabled ? 'delete' : 'save'"
          :label="twoFactorEnabled ? 'Disable' : 'Enable'"
          @click="toggleTwoFactor"
        />
      </div>
    </div>

    <!-- Session Management -->
    <div class="border-t border-gray-200 dark:border-slate-700 pt-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Active Sessions
      </h3>
      <div class="space-y-3">
        <div
          v-for="session in activeSessions"
          :key="session.id"
          class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg"
        >
          <div class="flex items-center gap-3">
            <UIcon
              :name="session.icon"
              class="w-5 h-5 text-gray-600 dark:text-slate-400"
            />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ session.device }}
              </p>
              <p class="text-xs text-gray-500 dark:text-slate-400">
                {{ session.location }} • {{ session.lastActive }}
              </p>
            </div>
          </div>
          <ButtonsPresetButton
            v-if="!session.current"
            preset="delete"
            label="Revoke"
            size="xs"
            @click="revokeSession(session.id)"
          />
          <span
            v-else
            class="text-xs font-semibold text-green-600 dark:text-green-400"
          >
            Current
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["update-password", "toggle-2fa", "revoke-session"]);

const isUpdating = ref(false);
const twoFactorEnabled = ref(false);

const passwordData = ref({
  current: "",
  new: "",
  confirm: "",
});

const activeSessions = ref([
  {
    id: 1,
    device: "Chrome on MacBook Pro",
    location: "Phnom Penh, Cambodia",
    lastActive: "Active now",
    icon: "i-heroicons-computer-desktop",
    current: true,
  },
  {
    id: 2,
    device: "Safari on iPhone",
    location: "Phnom Penh, Cambodia",
    lastActive: "2 hours ago",
    icon: "i-heroicons-device-phone-mobile",
    current: false,
  },
]);

const handleUpdatePassword = async () => {
  if (!passwordData.value.current || !passwordData.value.new) {
    return;
  }
  if (passwordData.value.new !== passwordData.value.confirm) {
    // TODO: Show error toast
    return;
  }

  isUpdating.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    emit("update-password", passwordData.value);
    // Reset form
    passwordData.value = {
      current: "",
      new: "",
      confirm: "",
    };
  } finally {
    isUpdating.value = false;
  }
};

const toggleTwoFactor = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value;
  emit("toggle-2fa", twoFactorEnabled.value);
};

const revokeSession = (sessionId: number) => {
  emit("revoke-session", sessionId);
  activeSessions.value = activeSessions.value.filter((s) => s.id !== sessionId);
};
</script>
