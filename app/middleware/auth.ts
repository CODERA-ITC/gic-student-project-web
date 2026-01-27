/**
 * Authentication Middleware
 * Protects routes by ensuring user is authenticated
 * Redirects to login if not authenticated
 */

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Skip authentication on server side - we can't access localStorage there
  if (typeof window === "undefined") {
    console.log("Auth middleware: Server side, skipping auth check");
    return;
  }

  // Allow OAuth callback URLs with token to pass through
  // The page will handle the token and authenticate
  if (to.query.token) {
    console.log("Auth middleware: Token found in URL, allowing through");
    return;
  }

  // Allow refresh_token URLs as well (for OAuth flow)
  if (to.query.refresh_token) {
    console.log(
      "Auth middleware: Refresh token found in URL, allowing through",
    );
    return;
  }

  // PRIORITY CHECK: If token exists in localStorage, check if it's valid
  // This runs BEFORE checking isLoading or isAuthenticated to prevent race conditions
  const token = localStorage.getItem("access_token");
  if (token) {
    // Check if token is expired
    if (authStore.isTokenExpired()) {
      console.log("Auth middleware: Token expired, attempting refresh...");

      // Try to refresh the token
      const refreshed = authStore.refreshAccessToken().catch(() => false);

      if (!refreshed) {
        console.log(
          "Auth middleware: Token refresh failed, redirecting to login",
        );
        return navigateTo({
          path: "/login",
          query: { redirect: to.path },
        });
      }

      console.log(
        "Auth middleware: Token refreshed successfully, allowing through",
      );
      return;
    }

    console.log(
      "Auth middleware: Valid token exists in localStorage, allowing through",
    );
    return;
  }

  // If auth is still loading, allow through - the page will show loading state
  if (authStore.isLoading) {
    console.log("Auth middleware: Auth is loading, allowing through");
    return;
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // No authentication found, redirect to login
    console.log("Auth middleware: No auth and no token, redirecting to login");
    return navigateTo({
      path: "/login",
      query: { redirect: to.path },
    });
  }

  // User is authenticated, allow access
  return;
});
