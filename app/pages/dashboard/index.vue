<template>
  <div />
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { onMounted } from "vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Handle OAuth token from URL and redirect based on user role
onMounted(async () => {
  // Check if there's a token in the URL (from OAuth callback)
  const token = route.query.token;
  const refreshToken = route.query.refresh_token;

  if (token) {
    try {
      // Handle OAuth callback with the token
      const tokenStr = String(token);
      const refreshTokenStr = refreshToken ? String(refreshToken) : undefined;
      await authStore.handleOAuthCallback(tokenStr, refreshTokenStr);

      // Remove token from URL
      await router.replace({ query: {} });

      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Failed to process OAuth token:', error);
      router.push("/login?error=Authentication failed");
      return;
    }
  }

  // Redirect based on authentication and user role
  if (!authStore.isAuthenticated) {
    router.push("/login");
  } else if (authStore.isTeacher) {
    router.push("/teacher");
  } else if (authStore.isStudent) {
    router.push("/student");
  } else {
    router.push("/login");
  }
});
</script>
