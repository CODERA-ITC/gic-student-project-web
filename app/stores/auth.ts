/**
 * Auth Store - User authentication and role management
 * Handles user login, role assignment (student/teacher), and auth state
 */

import { defineStore } from "pinia";
import { Role } from "~/types/roles";
import {
  authService,
  type AdminUser,
  type StudentUser,
  type TeacherUser,
  type User,
} from "~/services/AuthService";
import type { UpdateProfilePayload } from "~/types/user-profile";

// Re-export user types for components that import from the store
export type {
  AdminUser,
  StudentUser,
  TeacherUser,
  User,
} from "~/services/AuthService";
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  refreshPromise: Promise<boolean> | null;
  error: string | null;
  needsSecurityQuestions: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isRefreshing: false,
    refreshPromise: null,
    error: null,
    needsSecurityQuestions: false,
  }),

  getters: {
    isStudent: (state): state is { user: StudentUser } & AuthState =>
      state.user?.role === "STUDENT",
    isTeacher: (state): state is { user: TeacherUser } & AuthState =>
      state.user?.role === "TEACHER",
    isAdmin: (state) => state.user?.role === "ADMIN",
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role || null,
    token: () => authService.getAccessToken(),

    // Type-safe getters for role-specific data
    studentProfile: (state): StudentUser | null =>
      state.user?.role === Role.student ? (state.user as StudentUser) : null,
    teacherProfile: (state): TeacherUser | null =>
      state.user?.role === Role.teacher ? (state.user as TeacherUser) : null,

    adminProfile: (state): AdminUser | null =>
      state.user?.role === Role.admin ? (state.user as AdminUser) : null,
  },

  actions: {
    /**
     * Login user with email and password
     */
    async login(email: string, password: string): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        const { user, needsSecurityQuestions } = await authService.login(
          email,
          password,
        );

        this.user = user;
        this.needsSecurityQuestions = needsSecurityQuestions;
        this.isAuthenticated = true;
      } catch (error) {
        // Reset auth state on error
        this.user = null;
        this.isAuthenticated = false;
        this.error = error instanceof Error ? error.message : "Login failed";

        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Decode JWT token (basic decode without verification)
     * In production, token validation should be done server-side
     */
    decodeJWT(token: string): any {
      return authService.decodeJWT(token);
    },

    /**
     * Validate token structure and expiration
     */
    isTokenValid(): boolean {
      const token = this.getToken();

      if (!token) {
        console.warn("⚠️ No token found");
        return false;
      }

      // Check token format (should have 3 parts)
      if (token.split(".").length !== 3) {
        console.warn("⚠️ Invalid token format");
        return false;
      }

      // Check if expired
      if (this.isTokenExpired()) {
        console.warn("⚠️ Token is expired");
        return false;
      }

      console.log("✅ Token is valid");
      return true;
    },

    /**
     * Fetch current user details from API by using ID from token
     */

    async fetchCurrentUser(): Promise<void> {
      try {
        this.user = await authService.fetchCurrentUser();
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        throw error;
      }
    },

    /**
     * Register new user
     */
    async register(
      fullName: string,
      email: string,
      password: string,
      confirmPassword: string,
      role: Role,
    ): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        const { user, needsSecurityQuestions } = await authService.register(
          fullName,
          email,
          password,
          confirmPassword,
          role,
        );

        this.user = user;
        this.needsSecurityQuestions = needsSecurityQuestions;
        this.isAuthenticated = true;
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
        this.error =
          error instanceof Error ? error.message : "Registration failed";

        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Allow search users

    async searchUsers(query: string): Promise<User[]> {
      try {
        return (await authService.searchUsers(query)).filter(
          (userData: User) =>
            userData.id !== this.user?.id &&
            userData.role !== Role.admin &&
            userData.role !== Role.teacher,
        );
      } catch (error) {
        console.error("Failed to search users:", error);
        throw error;
      }
    },

    /**
     * Handle OAuth callback (Google/GitHub)
     * This should be called from your OAuth callback page
     */

    async handleOAuthCallback(
      token: string,
      refreshToken?: string,
    ): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        const { user, needsSecurityQuestions } =
          await authService.handleOAuthCallback(token, refreshToken);

        this.user = user;
        this.needsSecurityQuestions = needsSecurityQuestions;
        this.isAuthenticated = true;
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
        this.error =
          error instanceof Error ? error.message : "OAuth login failed";

        authService.logout();

        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Restore authentication from stored token
     * Should be called on app initialization
     */
    async restoreAuth(): Promise<boolean> {
      this.isLoading = true;

      try {
        const result = await authService.restoreAuth();

        this.user = result.user;
        this.isAuthenticated = result.authenticated;
        return result.authenticated;
      } catch (error) {
        // Network or temporary errors - keep tokens, just set loading to false
        // User can try again on next navigation or refresh
        console.error(
          "Failed to restore auth (keeping tokens for retry):",
          error,
        );

        // Keep user authenticated if we already have their data
        if (this.user) {
          this.isAuthenticated = true;
          return true;
        }

        // If we don't have user data yet, mark as not authenticated
        // but DON'T clear tokens - they might work on next try
        this.isAuthenticated = false;
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken(): Promise<boolean> {
      if (this.refreshPromise) {
        return this.refreshPromise;
      }

      this.isRefreshing = true;

      this.refreshPromise = (async () => {
        try {
          const refreshed = await authService.refreshAccessToken();
          if (refreshed) {
            try {
              await this.fetchCurrentUser();
              this.isAuthenticated = true;
              this.error = null;
            } catch (userError) {
              console.error(
                "❌ Failed to fetch user after token refresh:",
                userError,
              );
              this.isAuthenticated = true;
              this.error = null;
            }
          }
          return refreshed;
        } catch (error) {
          console.error("❌ Failed to refresh token:", error);
          return false;
        } finally {
          this.isRefreshing = false;
          this.refreshPromise = null;
        }
      })();

      return this.refreshPromise;
    },

    /**
     * Check if token is expired or about to expire
     */
    isTokenExpired(): boolean {
      return authService.isTokenExpired(this.getToken());
    },

    /**
     * Make authenticated API request with auto-refresh
     */
    async makeAuthRequest(
      url: string,
      options: RequestInit = {},
    ): Promise<any> {
      return authService.makeAuthRequest(url, options, () => this.logout());
    },

    /**
     * Logout user
     */
    logout(): void {
      authService.logout(this.user?.id);

      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
      // this.needsSecurityQuestions = false;
    },

    /**
     * Check if user has specific role
     */
    hasRole(role: Role.student | Role.teacher | Role.admin): boolean {
      return this.user?.role === role;
    },

    /**
     * Get authentication token
     */
    getToken(): string | null {
      return authService.getAccessToken();
    },

    /**
     * Set authentication error
     */
    setError(error: string): void {
      this.error = error;
    },

    /**
     * Clear authentication error
     */
    clearError(): void {
      this.error = null;
    },

    /**
     * Update user profile
     */
    updateUser(updates: Partial<User>): void {
      if (this.user) {
        this.user = { ...this.user, ...updates } as User;
      }
    },

    async updateUserProfile(updates: UpdateProfilePayload): Promise<User> {
      try {
        const updatedUser = await authService.updateUserProfile(updates);
        if (updatedUser) {
          this.user = updatedUser;
          return updatedUser;
        }
        throw new Error("No user returned from update");
      } catch (error) {
        console.log("Error during update profile!", error);
        throw error;
      }
    },

    /**
     * Upload user avatar
     */
    async uploadAvatar(file: File): Promise<{ avatar: string }> {
      this.isLoading = true;
      this.error = null;

      try {
        const token = this.getToken();
        if (!token) {
          throw new Error("Not authenticated");
        }

        const formData = new FormData();
        formData.append("files", file); // must match FileInterceptor('files')

        const response = await $fetch("/api/users/avatar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT set Content-Type manually - browser sets it correctly
          },
          body: formData,
        });

        // Update user avatar in store
        if (response && response.avatar && this.user) {
          this.user.avatar = response.avatar;
        }

        return response;
      } catch (error) {
        console.error("Avatar upload error:", error);
        this.error =
          error instanceof Error ? error.message : "Failed to upload avatar";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Submit security question answers for new OAuth users
     */
    async submitSecurityQuestions(
      answers: Array<{ questionId: string; answer: string }>,
    ): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        const token = this.getToken();
        if (!token) {
          throw new Error("Not authenticated");
        }

        console.log("🔵 Submitting security questions...");

        const { submitSecurityAnswers } = useSecurityQuestions();
        const result = await submitSecurityAnswers(answers, token);

        console.log("✅ Security questions saved successfully:", result);

        // Mark that security questions are now set
        this.needsSecurityQuestions = false;
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "Failed to save security questions";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Change password using security answers
     */
    async changePassword(payload: {
      answers: Array<{ questionId: string; answer: string }>;
      newPassword: string;
    }): Promise<any> {
      try {
        const response = await authService.changePassword(payload);
        // Mark that security questions are answered
        this.updateUser({ hasAnwers: true } as any);
        this.needsSecurityQuestions = false;
        return response;
      } catch (error) {
        console.error("Failed to change password:", error);
        throw error;
      }
    },
  },
});
