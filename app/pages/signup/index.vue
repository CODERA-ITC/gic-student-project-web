<template>
  <div class="min-h-screen flex">
    <AuthHero />

    <!-- Right Side - Sign Up Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-neutral-900">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create your account
          </h1>
        </div>

        <form @submit.prevent="handleSignup" class="space-y-4">
          <!-- Full Name Input -->
          <div>
            <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Full name
            </label>
            <input v-model="fullName" type="text" placeholder="John Doe" required
              class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all" />
          </div>

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

          <!-- Confirm Password Input -->
          <div>
            <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              Confirm password
            </label>
            <input v-model="confirmPassword" type="password" placeholder="••••••••" required
              class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all" />
          </div>

          <!-- Terms & Conditions -->
          <div class="flex items-start gap-2">
            <input v-model="agreeToTerms" type="checkbox" required
              class="w-4 h-4 mt-1 rounded border-slate-300 dark:border-neutral-600 text-blue-900 focus:ring-blue-900 focus:ring-offset-0 cursor-pointer" />
            <label class="text-sm text-slate-700 dark:text-neutral-300 cursor-pointer">
              I agree to the
              <NuxtLink to="/terms"
                class="text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                Terms & Conditions
              </NuxtLink>
              and
              <NuxtLink to="/privacy"
                class="text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                Privacy Policy
              </NuxtLink>
            </label>
          </div>

          <!-- Sign Up Button using PresetButton -->
          <ButtonsPresetButton preset="primary" label="CREATE ACCOUNT" :loading="isLoading" :disabled="isLoading"
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

        <!-- Social Sign Up -->
        <div class="grid place-items-center">
          <button type="button"
            class="h-12 py-3 px-4 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 flex items-center justify-center gap-2 group">
            <div class="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <NuxtImg src="/images/google.png" alt="Google" class="w-full h-full object-contain" />
            </div>
            <span
              class="text-sm text-slate-700 dark:text-neutral-300 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">SIGN
              UP WITH GOOGLE</span>
          </button>
        </div>

        <!-- Sign In Link -->
        <div class="text-center mt-6">
          <p class="text-sm text-slate-600 dark:text-neutral-400">
            Already have an account?
            <NuxtLink to="/login"
              class="text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors">
              Sign in here
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

const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const agreeToTerms = ref(false);
const isLoading = ref(false);
const error = ref("");

const handleSignup = async () => {
  error.value = "";

  // Validation
  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  if (password.value.length < 8) {
    error.value = "Password must be at least 8 characters long";
    return;
  }

  if (!agreeToTerms.value) {
    error.value = "You must agree to the Terms & Conditions";
    return;
  }

  isLoading.value = true;

  try {
    await authStore.signup(fullName.value, email.value, password.value);
    await router.push("/dashboard");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Sign up failed";
  } finally {
    isLoading.value = false;
  }
};
</script>