/**
 * Auth Store - User authentication and role management
 * Handles user login, role assignment (student/teacher), and auth state
 */

import error from "#build/ui/error";
import { defineStore } from "pinia";
import { de } from "zod/locales";
import { Role } from "~/types/roles";
import { getAvatarUrl } from "~/utils/avatar";

// Helper function to safely access localStorage only on client side
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (process.client && typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (process.client && typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (process.client && typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};

// Base User interface with common properties
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  hasSecurityQuestions?: boolean;
  phone?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
}

// Student-specific interface
export interface StudentUser extends BaseUser {
  role: Role.student;
  studentId: string;
  program: string;
  year: string;
  gen?: string;
  projectCount?: number;
  achievements?: number;
}

// Teacher-specific interface
export interface TeacherUser extends BaseUser {
  role: Role.teacher;
  teacherId: string;
  department: string;
  position: string;
  courses?: string[];
  yearsOfExperience?: number;
}

export interface AdminUser extends BaseUser {
  role: Role.admin;
  adminId: string;
}

// Union type for User
export type User = StudentUser | TeacherUser | AdminUser;
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  needsSecurityQuestions: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
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
    token: (state) => safeLocalStorage.getItem("access_token"),

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
        // Validate inputs
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Invalid email format");
        }

        // Call real API via proxy
        const responseData = await $fetch("/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
          onResponseError({ response }) {
            let errorMessage = "Login failed";

            if (response._data?.message) {
              errorMessage = response._data.message;
            } else if (response.status === 401) {
              errorMessage = "Invalid email or password";
            } else if (response.status === 404) {
              errorMessage = "User not found";
            } else if (response.status >= 500) {
              errorMessage = "Server error. Please try again later";
            } else {
              errorMessage = `Login failed: ${response.statusText}`;
            }

            throw new Error(errorMessage);
          },
        });

        // Validate response structure
        if (!responseData.success || !responseData.data) {
          throw new Error("Invalid response from server");
        }

        const { data } = responseData;

        // Store tokens
        if (
          responseData.success &&
          data.access_token &&
          data.access_token.length
        ) {
          safeLocalStorage.setItem("access_token", data.access_token);
          safeLocalStorage.setItem("refresh_token", data.refresh_token);

          await this.fetchCurrentUser();

          this.isAuthenticated = true;
        } else {
          throw new Error("No access token received from server");
        }
      } catch (error) {
        // Reset auth state on error
        this.user = null;
        this.isAuthenticated = false;
        this.error = error instanceof Error ? error.message : "Login failed";

        // Clear any existing tokens
        safeLocalStorage.removeItem("access_token");
        safeLocalStorage.removeItem("refresh_token");

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
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
      }
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
        const token = this.getToken();
        if (!token) {
          throw new Error("No authentication token");
        }

        const decodedToken = this.decodeJWT(token);
        if (!decodedToken || !decodedToken.iat) {
          throw new Error("Invalid token");
        }

        const userId = decodedToken.id;
        if (!userId) {
          throw new Error("User ID not found in token");
        }

        const userData = await $fetch(`/api/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // if (!responseData.success || !responseData.data) {
        //   throw new Error("Invalid response from server");
        // }

        // Map API response to User interface based on role
        console.log("Fetched current user data:", userData.role);

        const baseUserData: BaseUser = {
          id: userData.id,
          email: userData.email,
          name: `${userData.firstName || ""} ${userData.lastName || userData.email}`.trim(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          avatar: getAvatarUrl(
            userData.avatar,
            userData.firstName || "",
            userData.lastName || "",
          ),
          departmentId: userData.department?.id,
          hasSecurityQuestions: userData.hasSecurityQuestions,
          phone: userData.phone,
          bio: userData.bio,
          skills: userData.skills || [],
          socialLinks: userData.socialLinks || {
            github: "",
            linkedin: "",
            twitter: "",
            portfolio: "",
          },
        };

        // Create role-specific user object
        if (userData.role === "STUDENT") {
          this.user = {
            ...baseUserData,
            role: "STUDENT",
            studentId: userData.studentId || userData.id,
            program: userData.program || "",
            year: userData.year || "",
            gen: userData.gen || "",
            projectCount: userData.projectCount || 0,
            achievements: userData.achievements || 0,
          } as StudentUser;
        } else if (userData.role === "TEACHER") {
          this.user = {
            ...baseUserData,
            role: "TEACHER",
            teacherId: userData.teacherId || userData.id,
            department: userData.department?.name || "",
            position: userData.position || "",
            courses: userData.courses || [],
            yearsOfExperience: userData.yearsOfExperience || 0,
          } as TeacherUser;
        } else {
          // Fallback for other roles (ADMIN, etc.)
          this.user = {
            ...baseUserData,
            role: "STUDENT", // Default fallback
            studentId: userData.id,
            program: "",
            year: "",
          } as StudentUser;
        }
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
        // Validate inputs
        if (!fullName || !email || !password || !confirmPassword) {
          throw new Error("All fields are required");
        }

        if (fullName.trim().length < 2) {
          throw new Error("Name must be at least 2 characters");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Invalid email format");
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        // Split full name into first and last name
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        /**
         * {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "password": "@password123",
        "departmentCode": "GIC",
        "bio": "Professor at GIC",
        "hashedRefreshToken": "Refresh token for easy revoking"
      }
           */

        // Call real API via proxy
        const responseData = await $fetch("/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email: email.trim().toLowerCase(),
            password,
            departmentCode: "GIC",
            bio: `${role} at GIC`,
          }),
          onResponseError({ response }) {
            let errorMessage = "Registration failed";

            if (response._data?.message) {
              errorMessage = response._data.message;
            } else if (response.status === 409 || response.status === 400) {
              errorMessage = "Email already exists";
            } else if (response.status >= 500) {
              errorMessage = "Server error. Please try again later";
            } else {
              errorMessage = `Registration failed: ${response.statusText}`;
            }

            throw new Error(errorMessage);
          },
        });

        // Validate response structure
        if (!responseData.success || !responseData.data) {
          throw new Error("Invalid response from server");
        }

        const { data } = responseData;

        // Store tokens
        if (data.access_token) {
          safeLocalStorage.setItem("access_token", data.access_token);
        }

        if (data.refresh_token) {
          safeLocalStorage.setItem("refresh_token", data.refresh_token);
        }

        // Fetch complete user details from API
        await this.fetchCurrentUser();

        // New users from signup need to set up security questions
        this.needsSecurityQuestions = true;

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
        const token = this.getToken();
        if (!token) {
          throw new Error("No authentication token");
        }

        const responseData = await $fetch(
          `/api/users/search?q=${encodeURIComponent(query)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!responseData.success || !responseData.data) {
          throw new Error("Invalid response from server");
        }

        return responseData.data
          .filter((userData: any) => userData.id !== this.user?.id)

          .map((userData: any) => ({
            id: userData.id,
            name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
            email: userData.email,
            avatar: getAvatarUrl(
              userData.avatar,
              userData.firstName || "",
              userData.lastName || "",
            ),
          }));
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
        if (!token) {
          throw new Error("No token provided");
        }

        // Store the token
        safeLocalStorage.setItem("access_token", token);

        // Store refresh token if provided
        if (refreshToken) {
          safeLocalStorage.setItem("refresh_token", refreshToken);
        }

        // Decode JWT to get user info
        const tokenPayload = this.decodeJWT(token);

        if (!tokenPayload) {
          throw new Error("Invalid token format");
        }

        console.log("Token of the user", tokenPayload);

        // Fetch complete user details from API first
        await this.fetchCurrentUser();

        // Check if this is a new user (needs security questions)
        // Backend should include hasSecurityQuestions or isNewUser in the JWT
        // Also check if user already has security questions set from the user object
        const needsQuestions =
          tokenPayload.isNewUser === true ||
          tokenPayload.hasSecurityQuestions === false ||
          tokenPayload.needsSecurityQuestions === true ||
          (this.user && !this.user.hasSecurityQuestions);

        this.needsSecurityQuestions = needsQuestions;

        console.log("Token says needs questions:", needsQuestions);
        console.log(
          "User has security questions:",
          this.user?.hasSecurityQuestions,
        );
        console.log("Actually showing modal:", this.needsSecurityQuestions);

        this.isAuthenticated = true;
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
        this.error =
          error instanceof Error ? error.message : "OAuth login failed";

        safeLocalStorage.removeItem("access_token");
        safeLocalStorage.removeItem("refresh_token");

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
      const token = safeLocalStorage.getItem("access_token");

      if (!token) {
        return false;
      }

      this.isLoading = true;

      try {
        // Decode and verify token expiration
        const tokenPayload = this.decodeJWT(token);

        if (!tokenPayload) {
          // Token is malformed, clear it
          console.error("Invalid token format");
          safeLocalStorage.removeItem("access_token");
          safeLocalStorage.removeItem("refresh_token");
          this.user = null;
          this.isAuthenticated = false;
          return false;
        }

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          // Token expired, try to refresh
          const refreshed = await this.refreshAccessToken();
          if (!refreshed) {
            // Refresh failed, clear tokens
            console.error("Token expired and refresh failed");
            safeLocalStorage.removeItem("access_token");
            safeLocalStorage.removeItem("refresh_token");
            this.user = null;
            this.isAuthenticated = false;
            return false;
          }
          return true;
        }

        // // Token is valid, fetch current user from API
        await this.fetchCurrentUser();

        this.isAuthenticated = true;
        return true;
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
      const refreshToken = safeLocalStorage.getItem("refresh_token");

      if (!refreshToken) {
        console.warn("No refresh token available");
        return false;
      }

      try {
        console.log("🔄 Attempting to refresh access token...");

        const responseData = await $fetch("/api/users/refresh", {
          body: {
            refresh_token: refreshToken,
          },
        }).catch((err) => {
          console.error("Token refresh API error:", err);
          return null;
        });

        if (!responseData) {
          console.error("❌ No response from refresh endpoint");
          return false;
        }

        if (!responseData.access_token && !responseData.refresh_token) {
          console.error("❌ No access token in refresh response");
          return false;
        }

        // Store new access token
        safeLocalStorage.setItem("access_token", responseData.access_token);

        // Update refresh token if provided
        if (responseData.refresh_token) {
          safeLocalStorage.setItem("refresh_token", responseData.refresh_token);
        }

        console.log("✅ Token refreshed successfully");

        // Fetch complete user details from API
        await this.fetchCurrentUser();

        return true;
      } catch (error) {
        console.error("❌ Failed to refresh token:", error);
        return false;
      }
    },

    /**
     * Check if token is expired or about to expire
     */
    isTokenExpired(): boolean {
      const token = this.getToken();
      if (!token) return true;

      const payload = this.decodeJWT(token);
      if (!payload?.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      // Consider expired if less than 5 minutes remaining
      return payload.exp - currentTime < 300;
    },

    /**
     * Make authenticated API request with auto-refresh
     */
    async makeAuthRequest(
      url: string,
      options: RequestInit = {},
    ): Promise<any> {
      // Check if token is expired and refresh if needed
      if (this.isTokenExpired()) {
        const refreshed = await this.refreshAccessToken();
        if (!refreshed) {
          this.logout();
          throw new Error("Session expired. Please login again.");
        }
      }

      const token = this.getToken();

      try {
        return await $fetch(url, {
          ...options,
          method: (options.method as any) || "GET",
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error: any) {
        // If unauthorized, try refreshing token once
        // Note: $fetch error has .statusCode or .status, not .response.status
        if (error?.statusCode === 401 || error?.status === 401) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            // Retry request with new token
            const newToken = this.getToken();
            return await $fetch(url, {
              ...options,
              method: (options.method as any) || "GET",
              headers: {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
              },
            });
          } else {
            this.logout();
            throw new Error("Session expired. Please login again.");
          }
        }
        throw error;
      }
    },

    /**
     * Logout user
     */
    logout(): void {
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
      this.needsSecurityQuestions = false;

      // Clear stored tokens
      safeLocalStorage.removeItem("access_token");
      safeLocalStorage.removeItem("refresh_token");
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
      return safeLocalStorage.getItem("access_token");
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
        console.error("❌ Failed to submit security questions:", error);
        this.error =
          error instanceof Error
            ? error.message
            : "Failed to save security questions";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
