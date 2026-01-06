<template>
    <div class="min-h-screen flex">
        <AuthHero />

        <!-- Right Side - Forgot Password Form -->
        <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-neutral-900">
            <div class="w-full max-w-md">
                <!-- Step 1: Enter Email -->
                <div v-if="step === 1">
                    <!-- Header -->
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Reset Your Password
                        </h1>
                        <p class="text-slate-600 dark:text-neutral-400">
                            Enter your email address to verify your identity.
                        </p>
                    </div>

                    <form @submit.prevent="handleEmailSubmit" class="space-y-4">
                        <!-- Email Input -->
                        <div>
                            <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Email address
                            </label>
                            <input v-model="email" type="email" placeholder="your.email@example.com" required
                                :disabled="isLoading"
                                class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Continue Button -->
                        <ButtonsPresetButton preset="primary" label="CONTINUE" :loading="isLoading"
                            :disabled="isLoading" size="lg" class="w-full" type="submit" />

                        <!-- Error Message -->
                        <div v-if="error"
                            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
                            {{ error }}
                        </div>
                    </form>
                </div>

                <!-- Step 2: Answer Security Questions -->
                <div v-else-if="step === 2">
                    <!-- Header -->
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Security Verification
                        </h1>
                        <p class="text-slate-600 dark:text-neutral-400">
                            Answer your security questions to reset your password.
                        </p>
                    </div>

                    <form @submit.prevent="handleSecurityQuestionsSubmit" class="space-y-6">
                        <!-- Question 1 -->
                        <div>
                            <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                1. What is your mother's name?
                                <span class="text-red-500">*</span>
                            </label>
                            <input v-model="securityAnswers.question1" type="text" required :disabled="isLoading"
                                placeholder="Enter your answer"
                                class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Question 2 -->
                        <div>
                            <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                2. What was the name of your first pet?
                                <span class="text-red-500">*</span>
                            </label>
                            <input v-model="securityAnswers.question2" type="text" required :disabled="isLoading"
                                placeholder="Enter your answer"
                                class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Question 3 -->
                        <div>
                            <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                3. What city were you born in?
                                <span class="text-red-500">*</span>
                            </label>
                            <input v-model="securityAnswers.question3" type="text" required :disabled="isLoading"
                                placeholder="Enter your answer"
                                class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Error Message -->
                        <div v-if="error"
                            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
                            {{ error }}
                        </div>

                        <!-- Verify Button -->
                        <ButtonsPresetButton preset="primary" label="VERIFY ANSWERS" :loading="isLoading"
                            :disabled="isLoading" size="lg" class="w-full" type="submit" />

                        <!-- Back Link -->
                        <div class="text-center">
                            <button type="button" @click="resetForm" :disabled="isLoading"
                                class="text-sm text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-2 disabled:opacity-50">
                                <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
                                Back to Email
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Step 3: Set New Password -->
                <div v-else-if="step === 3">
                    <!-- Header -->
                    <div class="mb-8">
                        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Set New Password
                        </h1>
                        <p class="text-slate-600 dark:text-neutral-400">
                            Choose a strong password for your account.
                        </p>
                    </div>

                    <form @submit.prevent="handlePasswordReset" class="space-y-4">
                        <!-- New Password Input -->
                        <div>
                            <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                New password
                            </label>
                            <input v-model="newPassword" type="password" placeholder="••••••••" required
                                :disabled="isLoading"
                                class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
                            <p class="text-xs text-slate-500 dark:text-neutral-500 mt-1">
                                Must be at least 8 characters long
                            </p>
                        </div>

                        <!-- Confirm Password Input -->
                        <div>
                            <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Confirm password
                            </label>
                            <input v-model="confirmPassword" type="password" placeholder="••••••••" required
                                :disabled="isLoading"
                                class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Reset Button -->
                        <ButtonsPresetButton preset="primary" label="RESET PASSWORD" :loading="isLoading"
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
                </div>

                <!-- Back to Login Link -->
                <div class="text-center mt-6" v-if="step === 1">
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
                        If you can't remember your security questions, please contact support for assistance.
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
import { useRouter } from "vue-router";

const router = useRouter();

const step = ref(1); // 1: Email, 2: Security Questions, 3: New Password
const email = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const securityAnswers = ref({
    question1: "",
    question2: "",
    question3: "",
});
const isLoading = ref(false);
const error = ref("");
const success = ref("");

// Step 1: Submit email to check if user exists
const handleEmailSubmit = async () => {
    error.value = "";
    isLoading.value = true;

    try {
        // TODO: Call API to verify email exists
        // For now, just move to next step after validation
        await new Promise(resolve => setTimeout(resolve, 500));

        // Move to security questions step
        step.value = 2;
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to verify email. Please try again.";
    } finally {
        isLoading.value = false;
    }
};

// Step 2: Verify security questions
const handleSecurityQuestionsSubmit = async () => {
    error.value = "";
    isLoading.value = true;

    try {
        // TODO: Call API to verify security questions
        // For now, simulate verification
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate validation - in real app, this would be done by backend
        if (!securityAnswers.value.question1 || !securityAnswers.value.question2 || !securityAnswers.value.question3) {
            throw new Error("Please answer all security questions");
        }

        // Move to password reset step
        step.value = 3;
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Security verification failed. Please try again.";
    } finally {
        isLoading.value = false;
    }
};

// Step 3: Reset password
const handlePasswordReset = async () => {
    error.value = "";
    success.value = "";
    isLoading.value = true;

    try {
        // Validation
        if (newPassword.value !== confirmPassword.value) {
            throw new Error("Passwords do not match");
        }

        if (newPassword.value.length < 8) {
            throw new Error("Password must be at least 8 characters long");
        }

        // TODO: Call API to reset password
        await new Promise(resolve => setTimeout(resolve, 1500));

        success.value = "Password reset successful! Redirecting to login...";

        // Redirect to login after 2 seconds
        setTimeout(() => {
            router.push('/login');
        }, 2000);
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to reset password. Please try again.";
    } finally {
        isLoading.value = false;
    }
};

const resetForm = () => {
    step.value = 1;
    email.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    securityAnswers.value = {
        question1: "",
        question2: "",
        question3: "",
    };
    error.value = "";
    success.value = "";
};
</script>