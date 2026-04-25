/**
 * Role-Based Authorization Middleware
 * Checks if user has required role to access the route
 * Usage: Add to definePageMeta with required roles
 * Example: definePageMeta({ middleware: ['auth', 'role'], requiredRoles: ['STUDENT', 'TEACHER'] })
 */

import type { Role } from "~/types/roles";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // First check if user is authenticated
  if (!authStore.isAuthenticated || !authStore.user) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }

  // Get required roles from route meta
  const requiredRoles = to.meta.requiredRoles as Role[] | undefined;

  // If no required roles specified, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return;
  }

  // Check if user has one of the required roles
  const userRole = authStore.user.role;
  const hasRequiredRole = requiredRoles.includes(userRole);

  if (!hasRequiredRole) {
    // User doesn't have required role, redirect to appropriate page
    console.warn(
      `Access denied: User role '${userRole}' not in required roles [${requiredRoles.join(
        ", "
      )}]`
    );

    // Redirect to user's appropriate dashboard
    if (authStore.isStudent) {
      return navigateTo("/student/dashboard");
    } else if (authStore.isTeacher) {
      return navigateTo("/teacher/dashboard");
    } else if (authStore.isAdmin) {
      return navigateTo("/dashboard");
    }

    // Fallback redirect
    return navigateTo("/");
  }

  // User has required role, allow access
  return;
});
