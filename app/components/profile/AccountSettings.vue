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

      <!-- Security Questions -->
      <div v-if="!loadingQuestions" class="space-y-4">
        <div v-for="(question, index) in securityQuestions" :key="question.id">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            {{ index + 1 }}. {{ question.questions }}
            <span class="text-red-500">*</span>
          </label>
          <UInput v-model="securityAnswers[question.id]" type="text" placeholder="Enter your answer" size="lg"
            required />
        </div>
      </div>
      <div v-else class="flex justify-center py-4">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900 dark:border-blue-400"></div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          4. New Password
          <span class="text-red-500">*</span>
        </label>
        <UInput v-model="passwordData.new" type="password" placeholder="Enter new password" size="lg" required />
        <p class="text-xs text-slate-500 dark:text-neutral-500 mt-1">
          Must be at least 8 characters long
        </p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
          5. Confirm New Password
          <span class="text-red-500">*</span>
        </label>
        <UInput v-model="passwordData.confirm" type="password" placeholder="Confirm new password" size="lg" required />
      </div>

      <!-- Error Message -->
      <div v-if="passwordError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
        {{ passwordError }}
      </div>

      <!-- Success Message -->
      <div v-if="passwordSuccess"
        class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-700 dark:text-green-400">
        {{ passwordSuccess }}
      </div>

      <div class="pt-2">
        <ButtonsPresetButton preset="submit" label="Update Password" icon="" :loading="isUpdating"
          :disabled="isUpdating" @click="handleUpdatePassword" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { SecurityQuestion } from "~/composables/useSecurityQuestions";

const emit = defineEmits(["update-password"]);

const { fetchSecurityQuestions } = useSecurityQuestions();
const isUpdating = ref(false);
const loadingQuestions = ref(false);
const securityQuestions = ref<SecurityQuestion[]>([]);
const securityAnswers = ref<Record<string, string>>({});
const passwordError = ref("");
const passwordSuccess = ref("");

const passwordData = ref({
  new: "",
  confirm: "",
});

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
    if (!securityAnswers.value[question.id] || securityAnswers.value[question.id].trim().length < 2) {
      passwordError.value = "Please answer all security questions (minimum 2 characters each)";
      return;
    }
  }

  isUpdating.value = true;
  try {
    // Prepare answers array for API
    const answers = securityQuestions.value.map(question => ({
      questionId: question.id,
      answer: securityAnswers.value[question.id]
    }));

    await emit("update-password", {
      answers: answers,
      newPassword: passwordData.value.new
    });

    passwordSuccess.value = "Password updated successfully!";

    // Reset form
    passwordData.value = {
      new: "",
      confirm: "",
    };
    securityAnswers.value = {};
  } catch (error: any) {
    passwordError.value = error.message || "Failed to update password";
  } finally {
    isUpdating.value = false;
  }
};
</script>
