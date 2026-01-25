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
                        <ButtonsPresetButton preset="submit" label="CONTINUE" :loading="isLoading" :disabled="isLoading"
                            size="lg" class="w-full" type="submit" />

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

                    <!-- Loading State -->
                    <div v-if="loadingQuestions" class="flex justify-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 dark:border-blue-400">
                        </div>
                    </div>

                    <form v-else @submit.prevent="handleSecurityQuestionsSubmit" class="space-y-6">
                        <!-- Dynamic Questions -->
                        <div v-for="(question, index) in securityQuestions" :key="question.id">
                            <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                {{ index + 1 }}. {{ question.questions }}
                                <span class="text-red-500">*</span>
                            </label>
                            <input v-model="securityAnswers[question.id]" type="text" required :disabled="isLoading"
                                placeholder="Enter your answer"
                                class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
                        </div>

                        <!-- Error Message -->
                        <div v-if="error"
                            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
                            {{ error }}
                        </div>

                        <!-- Continue Button (changed from Verify) -->
                        <ButtonsPresetButton preset="submit" label="CONTINUE" :loading="isLoading" :disabled="isLoading"
                            size="lg" class="w-full" type="submit" />

                        <!-- Back Link -->
                        <div class="text-center">
                            <button type="button" @click="goBackToEmail" :disabled="isLoading"
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
                        <ButtonsPresetButton preset="submit" label="RESET PASSWORD" :loading="isLoading"
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

<script setup lang="ts">
definePageMeta({
    layout: "auth",
});

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { SecurityQuestion } from "~/composables/useSecurityQuestions";

const router = useRouter();
const { fetchSecurityQuestions } = useSecurityQuestions();

const step = ref(1); // 1: Email, 2: Security Questions, 3: New Password
const email = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const securityQuestions = ref<SecurityQuestion[]>([]);
const securityAnswers = ref<Record<string, string>>({});
const isLoading = ref(false);
const loadingQuestions = ref(false);
const error = ref("");
const success = ref("");

// Fetch security questions on mount
onMounted(async () => {
    try {
        loadingQuestions.value = true;
        securityQuestions.value = await fetchSecurityQuestions();
    } catch (err) {
        console.error("Failed to load security questions:", err);
    } finally {
        loadingQuestions.value = false;
    }
});

// Step 1: Submit email to move to security questions
const handleEmailSubmit = async () => {
    error.value = "";
    isLoading.value = true;

    try {
        // Basic email validation
        if (!email.value || !email.value.includes("@")) {
            throw new Error("Please enter a valid email address");
        }

        // Move to security questions step
        step.value = 2;
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Failed to verify email. Please try again.";
    } finally {
        isLoading.value = false;
    }
};

// Step 2: Continue to password reset
const handleSecurityQuestionsSubmit = async () => {
    error.value = "";
    isLoading.value = true;

    try {
        // Validate all questions are answered
        for (const question of securityQuestions.value) {
            if (!securityAnswers.value[question.id] || securityAnswers.value[question.id].trim().length < 2) {
                throw new Error("Please answer all security questions (minimum 2 characters each)");
            }
        }

        // Move to password reset step
        step.value = 3;
    } catch (err) {
        error.value = err instanceof Error ? err.message : "Please complete all security questions.";
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

        // Prepare answers array for API
        const answers = securityQuestions.value.map(question => ({
            questionId: question.id,
            answer: securityAnswers.value[question.id]
        }));

        const requestBody = {
            email: email.value,
            answers: answers,
            newPassword: newPassword.value
        };

        console.log('Request body:', JSON.stringify(requestBody, null, 2));

        // Call API to reset password directly (bypassing proxy)
        const apiBaseUrl = useRuntimeConfig().public.apiBase;
        const response = await $fetch(`${apiBaseUrl}/users/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: requestBody
        });

        console.log('Response:', response);

        success.value = "Password reset successful! Redirecting to login...";

        // Redirect to login after 2 seconds
        setTimeout(() => {
            router.push('/login');
        }, 2000);
    } catch (err: any) {
        console.error('Full error:', err);
        console.error('Error data:', err?.data);
        console.error('Error message:', err?.message);
        console.error('Error status:', err?.statusCode);

        const errorMessage = err?.data?.message || err?.message || "Failed to reset password. Please check your answers and try again.";
        error.value = errorMessage;
    } finally {
        isLoading.value = false;
    }
};

const goBackToEmail = () => {
    step.value = 1;
    error.value = "";
};

const resetForm = () => {
    step.value = 1;
    email.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    securityAnswers.value = {};
    error.value = "";
    success.value = "";
};
</script>