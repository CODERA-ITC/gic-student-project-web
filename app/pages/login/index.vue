<template>
  <div class="min-h-screen flex">
    <AuthHero />

    <!-- Right Side - Login Form -->
    <div
      class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-neutral-900"
    >
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="mb-8">
          <h1
            class="text-3xl font-semibold text-slate-900 dark:text-white mb-2"
          >
            Sign In or Create an account
          </h1>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label
              class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
            >
              Email address
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="your.email@example.com"
              required
              autofocus
              :disabled="authStore.isLoading"
              @blur="validateEmail"
              class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div
              v-if="emailError"
              class="text-xs text-red-600 dark:text-red-400 mt-1"
            >
              {{ emailError }}
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label
              class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
            >
              Password
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              :disabled="authStore.isLoading"
              @blur="validatePassword"
              class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div
              v-if="passwordError"
              class="text-xs text-red-600 dark:text-red-400 mt-1"
            >
              {{ passwordError }}
            </div>
          </div>

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input
                v-model="rememberMe"
                type="checkbox"
                :disabled="authStore.isLoading"
                class="w-4 h-4 rounded border-slate-300 dark:border-neutral-600 text-blue-900 focus:ring-blue-900 focus:ring-offset-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span
                class="text-slate-700 dark:text-neutral-300 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors"
              >
                Remember me
              </span>
            </label>
            <NuxtLink
              to="/forgot-password"
              class="text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Forgot password?
            </NuxtLink>
          </div>

          <!-- Error Message -->
          <div
            v-if="authStore.error"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400"
          >
            {{ authStore.error }}
          </div>

          <!-- Login Button using PresetButton -->
          <ButtonsPresetButton
            preset="primary"
            label="CONTINUE WITH EMAIL"
            :loading="authStore.isLoading"
            :disabled="
              authStore.isLoading ||
              !email ||
              !password ||
              !!emailError ||
              !!passwordError
            "
            size="lg"
            class="w-full"
            type="submit"
          />
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div
              class="w-full border-t border-slate-200 dark:border-neutral-700"
            ></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span
              class="px-4 bg-white dark:bg-neutral-900 text-slate-500 dark:text-neutral-400"
              >or</span
            >
          </div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-3">
          <button type="button" disabled
            class="h-12 py-3 px-4 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group opacity-50 cursor-not-allowed">
            <div class="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-logos-google-icon" class="w-6 h-6" />
            </div>
            <span class="text-sm text-slate-700 dark:text-neutral-300 transition-colors">
              GOOGLE
            </span>
          </button>

          <button type="button" disabled
            class="h-12 py-3 px-4 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group opacity-50 cursor-not-allowed">
            <div class="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-simple-icons-github"
                class="w-6 h-6 text-slate-700 dark:text-neutral-300 transition-colors" />
            </div>
            <span class="text-sm text-slate-700 dark:text-neutral-300 transition-colors">
              GITHUB
            </span>
          </button>
        </div>

        <!-- Sign Up Link -->
        <div class="text-center mt-6">
          <p class="text-sm text-slate-600 dark:text-neutral-400">
            Don't have an account?
            <NuxtLink
              to="/signup"
              class="text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors"
            >
              Sign up here
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
  middleware: ["guest"],
});

import { ref, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter, useRoute } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3017";

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const emailError = ref("");
const passwordError = ref("");

// Validate email format
const validateEmail = () => {
  if (!email.value) {
    emailError.value = "";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = "Please enter a valid email address";
  } else {
    emailError.value = "";
  }
};

// Validate password
const validatePassword = () => {
  if (!password.value) {
    passwordError.value = "";
    return;
  }

  if (password.value.length < 6) {
    passwordError.value = "Password must be at least 6 characters";
  } else {
    passwordError.value = "";
  }
};

// Handle login
const handleLogin = async () => {
  // Clear any previous errors
  authStore.clearError();
  emailError.value = "";
  passwordError.value = "";

  // Validate before submitting
  validateEmail();
  validatePassword();

  if (emailError.value || passwordError.value) {
    return;
  }

  try {
    // Call the store's login action
    await authStore.login(email.value, password.value);

    // Save email if remember me is checked
    if (rememberMe.value) {
      localStorage.setItem("remembered_email", email.value);
    } else {
      localStorage.removeItem("remembered_email");
    }

    // Small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check for redirect query parameter
    const redirectTo = route.query.redirect;

    console.log("Redirect to:", redirectTo);

    // if (redirectTo && typeof redirectTo === "string") {
    //   await router.push(redirectTo);
    // }

    console.log(
      "User Role - isTeacher:",
      authStore.isTeacher,
      "isAdmin:",
      authStore.isAdmin,
      "isStudent:",
      authStore.isStudent,
    );

    if (authStore.isTeacher || authStore.isAdmin) {
      await router.push("/teacher/dashboard");
    } else {
      await router.push("/student/dashboard");
    }

    // if (authStore.isTeacher || authStore.isAdmin) {
    //   await router.push("/teacher/dashboard");
    // } else if (authStore.isAdmin) {
    //   await router.push("/admin/dashboard");
    // } else {
    //   await router.push("/student/dashboard");
    // }
  } catch (err) {
    // Error is already set in the store
    console.error("Login failed:", err);
  }
};

// Handle Google OAuth login
const handleGoogleLogin = () => {
  // Redirect directly to backend OAuth endpoint
  const config = useRuntimeConfig();
  const backendUrl =
    config.public.apiBase || "https://gic-project.darororo.dev";
  window.location.href = `${backendUrl}/users/google`;
};

// Handle GitHub OAuth login
const handleGithubLogin = () => {
  // Redirect directly to backend OAuth endpoint
  const config = useRuntimeConfig();
  const backendUrl =
    config.public.apiBase || "https://gic-project.darororo.dev";
  window.location.href = `${backendUrl}/users/github`;
};

// Restore remembered email on mount
onMounted(() => {
  const rememberedEmail = localStorage.getItem("remembered_email");
  if (rememberedEmail) {
    email.value = rememberedEmail;
    rememberMe.value = true;
  }
});
</script>
