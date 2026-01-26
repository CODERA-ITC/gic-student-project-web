<template>
  <div class="p-6 space-y-6">
    <div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-1">
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

      <!-- Security Questions -->
      <div v-if="!loadingQuestions" class="space-y-4">
        <div v-for="(question, index) in securityQuestions" :key="question.id">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
          >
            {{ index + 1 }}. {{ question.questions }}
            <span class="text-red-500">*</span>
          </label>
          <UInput
            v-model="securityAnswers[question.id]"
            type="text"
            placeholder="Enter your answer"
            size="lg"
            required
          />
        </div>
      </div>
      <div v-else class="flex justify-center py-4">
        <div
          class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900 dark:border-blue-400"
        ></div>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          4. New Password
          <span class="text-red-500">*</span>
        </label>
        <UInput
          v-model="passwordData.new"
          type="password"
          placeholder="Enter new password"
          size="lg"
          required
        />
        <p class="text-xs text-slate-500 dark:text-neutral-500 mt-1">
          Must be at least 8 characters long
        </p>
      </div>
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2"
        >
          5. Confirm New Password
          <span class="text-red-500">*</span>
        </label>
        <UInput
          v-model="passwordData.confirm"
          type="password"
          placeholder="Confirm new password"
          size="lg"
          required
        />
      </div>

      <!-- Error Message -->
      <div
        v-if="passwordError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400"
      >
        {{ passwordError }}
      </div>

      <!-- Success Message -->
      <div
        v-if="passwordSuccess"
        class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-700 dark:text-green-400"
      >
        {{ passwordSuccess }}
      </div>

      <div class="pt-2">
        <ButtonsPresetButton
          preset="submit"
          label="Update Password"
          icon=""
          :loading="isUpdating"
          :disabled="isUpdating"
          @click="handleUpdatePassword"
        />
      </div>
    </div>

    <!-- Two-Factor Authentication -->
    <div class="border-t border-gray-200 dark:border-slate-700 pt-6 mt-6">
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
import { ref, onMounted } from "vue";
import type { SecurityQuestion } from "~/composables/useSecurityQuestions";
import { useAuthStore } from "~/stores/auth";

const emit = defineEmits(["update-password", "toggle-2fa", "revoke-session"]);

const { fetchSecurityQuestions } = useSecurityQuestions();
const isUpdating = ref(false);
const twoFactorEnabled = ref(false);
const loadingQuestions = ref(false);
const securityQuestions = ref<SecurityQuestion[]>([]);
const securityAnswers = ref<Record<string, string>>({});
const passwordError = ref("");
const passwordSuccess = ref("");

const passwordData = ref({
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

// Fetch security questions on mount
onMounted(async () => {
  try {
    loadingQuestions.value = true;
    securityQuestions.value = await fetchSecurityQuestions();
  } catch (err) {
    console.error("Failed to load security questions:", err);
    passwordError.value = "Failed to load security questions";
  } finally {
    loadingQuestions.value = false;
  }
});

const handleUpdatePassword = async () => {
  passwordError.value = "";
  passwordSuccess.value = "";

  // Validation
  if (!passwordData.value.new || !passwordData.value.confirm) {
    passwordError.value = "Please fill in all password fields";
    return;
  }

  if (passwordData.value.new !== passwordData.value.confirm) {
    passwordError.value = "New passwords do not match";
    return;
  }

  if (passwordData.value.new.length < 8) {
    passwordError.value = "Password must be at least 8 characters long";
    return;
  }

  // Validate security question answers
  for (const question of securityQuestions.value) {
    if (
      !securityAnswers.value[question.id] ||
      securityAnswers.value[question.id].trim().length < 2
    ) {
      passwordError.value =
        "Please answer all security questions (minimum 2 characters each)";
      return;
    }
  }

  isUpdating.value = true;
  try {
    // Get auth store and token
    const authStore = useAuthStore();
    const token = authStore.token;

    console.log("=== Password Change Debug ===");
    console.log("Token exists:", !!token);
    console.log("User:", authStore.user?.email);

    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    // Prepare answers array for API
    const answers = securityQuestions.value.map((question) => ({
      questionId: question.id,
      answer: securityAnswers.value[question.id],
    }));

    const apiBaseUrl = useRuntimeConfig().public.apiBase;
    const url = `${apiBaseUrl}/users/change-password`;

    console.log("API URL:", url);

    // Call the API and wait for the result
    const result = await $fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: {
        answers: answers,
        newPassword: passwordData.value.new,
      },
    });

    console.log("Password changed successfully:", result);

    // Only show success if the API call was successful
    passwordSuccess.value = "Password updated successfully!";

    // Reset form
    passwordData.value = {
      new: "",
      confirm: "",
    };
    securityAnswers.value = {};
  } catch (error: any) {
    console.error("Password change error:", error);
    console.error("Error status:", error?.statusCode);
    console.error("Error data:", error?.data);

    // Handle different error types
    let errorMessage = "Failed to update password";

    // First, check if there's a specific message from the backend
    if (error?.data?.message) {
      errorMessage = error.data.message;
    } else if (error?.statusCode === 400) {
      errorMessage = "Incorrect security question answers";
    } else if (error?.statusCode === 401) {
      // Check if it's actually a token issue or wrong answers
      if (
        error?.data?.message?.toLowerCase().includes("token") ||
        error?.data?.message?.toLowerCase().includes("unauthorized")
      ) {
        errorMessage = "Your session has expired. Please log in again.";
      } else {
        errorMessage =
          error?.data?.message || "Incorrect security question answers";
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    passwordError.value = errorMessage;
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
