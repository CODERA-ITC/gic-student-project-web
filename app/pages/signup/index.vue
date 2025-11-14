<template>
  <div
    class="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12"
  >
    <div class="w-full max-w-md">
      <!-- Logo Section -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-6">
          <div
            class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-rocket-launch"
              class="w-8 h-8 text-white"
            />
          </div>
        </div>
        <h1 class="text-4xl font-bold text-white mb-2">Create Account</h1>
        <p class="text-gray-400">
          Join our community and showcase your projects
        </p>
      </div>

      <!-- Signup Card -->
      <div
        class="bg-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-8 space-y-6"
      >
        <!-- Role Selection -->
        <div class="flex gap-2 mb-6">
          <button
            @click="selectedRole = 'student'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200',
              selectedRole === 'student'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600',
            ]"
          >
            <UIcon
              name="i-heroicons-academic-cap"
              class="w-4 h-4 inline mr-2"
            />
            Student
          </button>
          <button
            @click="selectedRole = 'teacher'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200',
              selectedRole === 'teacher'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600',
            ]"
          >
            <UIcon name="i-heroicons-briefcase" class="w-4 h-4 inline mr-2" />
            Teacher
          </button>
        </div>

        <form @submit.prevent="handleSignup" class="space-y-5">
          <!-- Full Name Input -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              Full Name
            </label>
            <input
              v-model="fullName"
              type="text"
              placeholder="John Doe"
              required
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Email Input -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Confirm Password Input -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              Confirm Password
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Terms Checkbox -->
          <label class="flex items-start space-x-3 cursor-pointer">
            <input
              v-model="agreeTerms"
              type="checkbox"
              required
              class="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500 mt-0.5"
            />
            <span class="text-sm text-gray-300">
              I agree to the
              <NuxtLink
                to="/terms"
                class="text-blue-400 hover:text-blue-300 underline"
              >
                Terms of Service
              </NuxtLink>
              and
              <NuxtLink
                to="/privacy"
                class="text-blue-400 hover:text-blue-300 underline"
              >
                Privacy Policy
              </NuxtLink>
            </span>
          </label>

          <!-- Signup Button -->
          <ButtonsPresetButton
            preset="signup"
            type="submit"
            :class="['w-full', { 'opacity-50 cursor-not-allowed': isLoading }]"
            :disabled="isLoading"
          >
            <template v-if="isLoading" #icon>
              <UIcon
                name="i-heroicons-arrow-path"
                class="w-4 h-4 animate-spin"
              />
            </template>
            {{ isLoading ? "Creating Account..." : "Create Account" }}
          </ButtonsPresetButton>

          <!-- Error Message -->
          <div
            v-if="error"
            class="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-300"
          >
            {{ error }}
          </div>
        </form>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-700/50"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-slate-800 text-gray-400">Or sign up with</span>
          </div>
        </div>

        <!-- Social Signup -->
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="py-3 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white font-medium hover:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <UIcon name="i-heroicons-globe-alt" class="w-4 h-4" />
            Google
          </button>
          <button
            type="button"
            class="py-3 px-4 bg-slate-700 border border-slate-600 rounded-lg text-white font-medium hover:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <UIcon name="i-heroicons-code-bracket" class="w-4 h-4" />
            GitHub
          </button>
        </div>
      </div>

      <!-- Login Link -->
      <div class="text-center mt-8">
        <p class="text-gray-400">
          Already have an account?
          <NuxtLink
            to="/login"
            class="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Sign in here
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});

import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const selectedRole = ref("student");
const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const agreeTerms = ref(false);
const isLoading = ref(false);
const error = ref("");

const handleSignup = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match!";
    return;
  }

  error.value = "";
  isLoading.value = true;

  try {
    await authStore.register(
      fullName.value,
      email.value,
      password.value,
      confirmPassword.value,
      selectedRole.value
    );
    // Redirect to dashboard on success
    await router.push("/dashboard");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Registration failed";
  } finally {
    isLoading.value = false;
  }
};
</script>
