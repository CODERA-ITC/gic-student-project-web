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
                        <NuxtImg src="/images/itc-logo.png" alt="ITC Logo"
                            class="w-24 h-24 object-contain ml-12 mr-4" />
                        <NuxtImg src="/images/gic-logo-small.png" alt="GIC Logo" class="w-24 h-24 object-contain" />
                    </div>
                </div>
            </div>

            <!-- Decorative Elements -->
            <div class="absolute top-20 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        <!-- Right Side - Forgot Password Form -->
        <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-neutral-900">
            <div class="w-full max-w-md">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Reset Your Password
                    </h1>
                    <p class="text-slate-600 dark:text-neutral-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form @submit.prevent="handleResetPassword" class="space-y-4">
                    <!-- Email Input -->
                    <div>
                        <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                            Email address
                        </label>
                        <input v-model="email" type="email" placeholder="your.email@example.com" required
                            class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all" />
                    </div>

                    <!-- Reset Button -->
                    <ButtonsPresetButton preset="primary" label="SEND RESET LINK" :loading="isLoading"
                        :disabled="isLoading" size="lg" class="w-full" type="submit" />

                    <!-- Success Message -->
                    <div v-if="success"
                        class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-700 dark:text-green-400">
                        {{ success }}
                    </div>

                    <!-- Error Message -->
                    <div v-if="error"
                        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
                        {{ error }}
                    </div>
                </form>

                <!-- Back to Login Link -->
                <div class="text-center mt-6">
                    <NuxtLink to="/login"
                        class="text-sm text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-2">
                        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
                        Back to Sign In
                    </NuxtLink>
                </div>

                <!-- Additional Help -->
                <div class="mt-8 p-4 bg-slate-50 dark:bg-neutral-800 rounded-lg">
                    <p class="text-sm text-slate-600 dark:text-neutral-400">
                        <strong class="text-slate-900 dark:text-white">Need help?</strong><br />
                        If you don't receive the email within a few minutes, check your spam folder or contact support.
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

const email = ref("");
const isLoading = ref(false);
const error = ref("");
const success = ref("");

const handleResetPassword = async () => {
    error.value = "";
    success.value = "";
    isLoading.value = true;

    try {
        // TODO: Implement your password reset API call here
        // Example:
        // await $fetch('/api/auth/reset-password', {
        //     method: 'POST',
        //     body: { email: email.value }
        // });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        success.value = "Password reset link has been sent to your email address.";
        email.value = "";
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to send reset link. Please try again.";
    } finally {
        isLoading.value = false;
    }
};
</script>