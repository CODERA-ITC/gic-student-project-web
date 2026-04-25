<template>
    <div class="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div class="text-center">
            <div class="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto">
            </div>
            <p class="text-slate-700 dark:text-neutral-300 mt-4">Processing authentication...</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

definePageMeta({
    layout: 'auth',
});

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
    try {
        // Try to parse JSON from the page body (when backend returns JSON directly)
        const bodyText = document.body.textContent || document.body.innerText;

        // Look for JSON pattern in the page
        const jsonMatch = bodyText.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);

            if (data.success && data.tokens) {
                const { access_token, refresh_token } = data.tokens;

                if (access_token) {
                    // Redirect to dashboard with token in URL
                    // Dashboard will handle the OAuth callback
                    const redirectUrl = `/dashboard?token=${access_token}${refresh_token ? `&refresh_token=${refresh_token}` : ''}`;
                    await router.push(redirectUrl);
                    return;
                }
            }
        }

        // If we couldn't find valid tokens, redirect to login with error
        await router.push('/login?error=Authentication failed');
    } catch (error) {
        console.error('OAuth processing error:', error);
        await router.push('/login?error=Authentication failed');
    }
});
</script>
