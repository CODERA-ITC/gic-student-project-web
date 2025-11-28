<template>
  <div class="min-h-screen flex">
    <!-- Left Side - Hero Image -->
    <div
      class="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-30"
        style="background-image: url('/images/ITCcampus.png'); background-size: 160%;"></div>

      <!-- Overlay Content -->
      <div class="relative h-full flex flex-col justify-between p-12 text-white">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-24 h-24 rounded-lg flex items-center justify-center">
            <NuxtImg src="/images/itc-logo.png" alt="ITC Logo" class="w-24 h-24 object-contain ml-12 mr-4" />
            <NuxtImg src="/images/gic-logo-small.png" alt="GIC Logo" class="w-24 h-24 object-contain" />
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute top-20 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-neutral-900">
      <div class="w-full max-w-md">
        <!-- Mobile Logo - REMOVED -->

        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Sign In or Create an account
          </h1>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">

          <!-- Email Input -->
          <div>
            <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Email address
            </label>
            <input v-model="email" type="email" placeholder="your.email@example.com" required
              class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all" />
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Password
            </label>
            <input v-model="password" type="password" placeholder="••••••••" required
              class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all" />
          </div>

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input v-model="rememberMe" type="checkbox"
                class="w-4 h-4 rounded border-slate-300 dark:border-neutral-600 text-blue-900 focus:ring-blue-900 focus:ring-offset-0 cursor-pointer" />
              <span
                class="text-slate-700 dark:text-neutral-300 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">Remember
                me</span>
            </label>
            <NuxtLink to="/forgot-password"
              class="text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
              Forgot password?
            </NuxtLink>
          </div>

          <!-- Login Button using PresetButton -->
          <ButtonsPresetButton preset="primary" label="CONTINUE WITH EMAIL" :loading="isLoading" :disabled="isLoading"
            size="lg" class="w-full" type="submit" />

          <!-- Error Message -->
          <div v-if="error"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            {{ error }}
          </div>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200 dark:border-neutral-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white dark:bg-neutral-900 text-slate-500 dark:text-neutral-400">or</span>
          </div>
        </div>


        <!-- Social Login -->
        <div class="grid place-items-center">
          <button type="button"
            class="py-3 px-4 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 flex items-center justify-center gap-2 group">
            <UIcon name="i-heroicons-globe-alt"
              class="w-5 h-5 text-slate-700 dark:text-neutral-300 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors" />
            <span
              class="text-sm text-slate-700 dark:text-neutral-300 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">GOOGLE</span>
          </button>
        </div>

        <!-- Sign Up Link -->
        <div class="text-center mt-6">
          <p class="text-sm text-slate-600 dark:text-neutral-400">
            Don't have an account?
            <NuxtLink to="/signup"
              class="text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors">
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
});

import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

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
    await router.push("/dashboard");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Login failed";
  } finally {
    isLoading.value = false;
  }
};
</script>