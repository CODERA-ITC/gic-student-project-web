<template>
  <div
    class="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12"
  >
    <div class="w-full max-w-md">
      <!-- Logo Section -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-6">
          <div
            class="w-16 h-16 bg-emerald-600 rounded-lg flex items-center justify-center"
          >
            <UIcon
              name="i-heroicons-rocket-launch"
              class="w-8 h-8 text-white"
            />
          </div>
        </div>
        <h1 class="text-4xl font-bold text-white mb-2">Welcome Back</h1>
        <p class="text-gray-400">Sign in to your account to continue</p>
      </div>

      <!-- Login Card -->
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
                ? 'bg-emerald-600 text-white'
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
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600',
            ]"
          >
            <UIcon name="i-heroicons-briefcase" class="w-4 h-4 inline mr-2" />
            Teacher
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Demo Accounts Hint -->
          <div
            class="bg-slate-700/50 border border-emerald-500/30 rounded-lg p-3 text-xs text-gray-300"
          >
            <p class="font-semibold text-emerald-400 mb-1">Demo Accounts:</p>
            <p v-if="selectedRole === 'student'">
              📧 student@gic.edu • 🔐 password
            </p>
            <p v-else>📧 teacher@gic.edu • 🔐 password</p>
          </div>

          <!-- Email Input -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              :placeholder="
                selectedRole === 'student'
                  ? 'student@gic.edu'
                  : 'teacher@gic.edu'
              "
              required
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded bg-slate-700 border-slate-600 text-emerald-600 focus:ring-emerald-500"
              />
              <span class="text-sm text-gray-300">Remember me</span>
            </label>
            <NuxtLink
              to="/forgot-password"
              class="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Forgot password?
            </NuxtLink>
          </div>

          <!-- Login Button -->
          <ButtonsPresetButton
            preset="signin"
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
            {{ isLoading ? "Signing in..." : "Sign In" }}
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
            <span class="px-2 bg-slate-800 text-gray-400"
              >Or continue with</span
            >
          </div>
        </div>

        <!-- Social Login -->
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

      <!-- Sign Up Link -->
      <div class="text-center mt-8">
        <p class="text-gray-400">
          Don't have an account?
          <NuxtLink
            to="/signup"
            class="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            Sign up here
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
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const isLoading = ref(false);
const error = ref("");

const handleLogin = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    await authStore.login(email.value, password.value);
    // Redirect to dashboard on success
    await router.push("/dashboard");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Login failed";
  } finally {
    isLoading.value = false;
  }
};
</script>
