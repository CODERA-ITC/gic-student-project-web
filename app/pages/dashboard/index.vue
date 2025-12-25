<template>
  <div
    class="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900"
  >
    <!-- Security Questions Modal -->
    <SecurityQuestionsModal
      :is-open="showSecurityQuestionsModal"
      :allow-close="false"
      @submit="handleSecurityQuestionsSubmit"
    />

    <div class="text-center">
      <div v-if="isLoading" class="space-y-4">
        <div
          class="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto"
        ></div>
        <p class="text-slate-700 dark:text-neutral-300">{{ loadingMessage }}</p>
      </div>

      <div v-if="error" class="space-y-4">
        <div class="text-red-600 dark:text-red-400">
          <svg
            class="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 class="text-2xl font-bold mt-4">Authentication Failed</h2>
          <p class="text-sm mt-2">{{ error }}</p>
        </div>
        <NuxtLink
          to="/login"
          class="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          Back to Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { onMounted, ref } from "vue";

definePageMeta({
  middleware: ["auth"],
});

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isLoading = ref(true);
const error = ref("");
const loadingMessage = ref("Processing authentication...");
const showSecurityQuestionsModal = ref(false);

// Handle security questions submission
const handleSecurityQuestionsSubmit = async (answers) => {
  console.log("🟢 Dashboard - Security questions submitted:", answers);
  try {
    await authStore.submitSecurityQuestions(answers);
    console.log("✅ Dashboard - Questions saved, closing modal");
    showSecurityQuestionsModal.value = false;

    // Continue with redirect
    await redirectBasedOnRole();
  } catch (err) {
    console.error("❌ Dashboard - Failed to submit security questions:", err);
    error.value = "Failed to save security questions. Please try again.";
    isLoading.value = false;
  }
}; // Redirect user based on their role
const redirectBasedOnRole = async () => {
  loadingMessage.value = "Redirecting...";

  if (!authStore.isAuthenticated) {
    await router.push("/login");
  } else if (authStore.isTeacher) {
    await router.push("/teacher/dashboard");
  } else if (authStore.isStudent) {
    await router.push("/student");
  } else {
    await router.push("/login");
  }
};

// Handle OAuth token from URL and redirect based on user role
onMounted(async () => {
  try {
    // Check if there's a token in the URL (from OAuth callback)
    const token = route.query.token;
    const refreshToken = route.query.refresh_token;

    console.log("Dashboard - OAuth Callback - Token:", token);

    if (token) {
      loadingMessage.value = "Completing sign in...";

      // Handle OAuth callback with the token
      const tokenStr = String(token);
      const refreshTokenStr = refreshToken ? String(refreshToken) : undefined;
      await authStore.handleOAuthCallback(tokenStr, refreshTokenStr);

      console.log(
        "Dashboard - needsSecurityQuestions:",
        authStore.needsSecurityQuestions
      );

      // Remove token from URL
      await router.replace({ query: {} });

      // Check if user needs to answer security questions
      if (authStore.needsSecurityQuestions) {
        console.log("Dashboard - Showing security questions modal");
        isLoading.value = false;
        showSecurityQuestionsModal.value = true;
        return; // Don't redirect yet, wait for security questions
      }

      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Redirect based on role
    await redirectBasedOnRole();
  } catch (err) {
    console.error("Failed to process OAuth token:", err);
    error.value = err?.message || "Authentication failed. Please try again.";
    isLoading.value = false;
  }
});
</script>
