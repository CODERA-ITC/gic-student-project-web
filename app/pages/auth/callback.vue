<template>
    <div class="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <!-- Security Questions Modal -->
        <SecurityQuestionsModal :is-open="showSecurityQuestions" :allow-close="false"
            @submit="handleSecurityQuestionsSubmit" />

        <div class="text-center">
            <div v-if="isLoading" class="space-y-4">
                <div class="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto">
                </div>
                <p class="text-slate-700 dark:text-neutral-300">Completing sign in...</p>
            </div>

            <div v-if="error" class="space-y-4">
                <div class="text-red-600 dark:text-red-400">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h2 class="text-2xl font-bold mt-4">Authentication Failed</h2>
                    <p class="text-sm mt-2">{{ error }}</p>
                </div>
                <NuxtLink to="/login"
                    class="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
                    Back to Login
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter, useRoute } from 'vue-router';

definePageMeta({
    layout: 'auth',
});

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const error = ref('');
const showSecurityQuestions = ref(false);

const handleSecurityQuestionsSubmit = async (answers) => {
    try {
        isLoading.value = true;
        await authStore.submitSecurityQuestions(answers);

        // After successfully saving security questions, redirect to dashboard
        await new Promise(resolve => setTimeout(resolve, 500));

        if (authStore.isTeacher) {
            await router.push('/teacher/dashboard');
        } else {
            await router.push('/student/dashboard');
        }
    } catch (err) {
        error.value = err.message || 'Failed to save security questions';
        showSecurityQuestions.value = false;
        isLoading.value = false;
    }
};

onMounted(async () => {
    try {
        // Get token from URL query parameters
        const token = route.query.token;
        const refreshToken = route.query.refresh_token;
        const errorParam = route.query.error;

        console.log('OAuth Callback - Token:', token ? 'Present' : 'Missing');
        console.log('OAuth Callback - Error Param:', errorParam);

        if (errorParam) {
            throw new Error(errorParam);
        }

        if (!token) {
            throw new Error('No authentication token received');
        }

        // Handle OAuth callback with the token
        await authStore.handleOAuthCallback(token, refreshToken);

        console.log('OAuth Callback - needsSecurityQuestions:', authStore.needsSecurityQuestions);

        // Check if user needs to set up security questions
        if (authStore.needsSecurityQuestions) {
            console.log('Showing security questions modal');
            showSecurityQuestions.value = true;
            isLoading.value = false;
            return;
        }

        console.log('Redirecting to dashboard...');
        // Redirect based on user role
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX

        if (authStore.isTeacher) {
            await router.push('/teacher/dashboard');
        } else {
            await router.push('/student/dashboard');
        }
    } catch (err) {
        error.value = err.message || 'Authentication failed. Please try again.';
        isLoading.value = false;
    }
});
</script>