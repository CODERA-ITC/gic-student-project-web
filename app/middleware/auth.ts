/**
 * Authentication Middleware
 * Protects routes by ensuring user is authenticated
 * Redirects to login if not authenticated
 */

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const redirectToLogin = async () => {
    // Route through loading bridge to stabilize layout transition before login render.
    await sleep(180);
    return navigateTo({
      path: "/loading",
      query: {
        next: "/login",
        redirect: to.fullPath,
      },
    });
  };

  // Skip authentication on server side - we can't access localStorage there
  if (import.meta.server) {
    return;
  }

  // Allow OAuth callback URLs with token to pass through
  // The page will handle the token and authenticate
  if (to.query.token) {
    return;
  }

  // Allow refresh_token URLs as well (for OAuth flow)
  if (to.query.refresh_token) {
    return;
  }

  // PRIORITY CHECK: If token exists in localStorage, check if it's valid
  // This runs BEFORE checking isLoading or isAuthenticated to prevent race conditions
  const token = localStorage.getItem("access_token");
  if (token) {
    // Check if token is expired
    if (authStore.isTokenExpired()) {
      // Try to refresh the token
      const refreshed = await authStore.refreshAccessToken().catch(
        () => false,
      );

      if (!refreshed) {
        return redirectToLogin();
      }
      return;
    }
    return;
  }

  // If auth is still loading, wait for restoration first to avoid unstable redirect/layout flashes
  if (authStore.isLoading) {
    const started = Date.now();
    const maxWaitMs = 1500;
    while (authStore.isLoading && Date.now() - started < maxWaitMs) {
      await sleep(50);
    }

    if (authStore.isAuthenticated) return;
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return redirectToLogin();
  }

  // User is authenticated, allow access
  return;
});
