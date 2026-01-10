/**
 * Auth Store - User authentication and role management
 * Handles user login, role assignment (student/teacher), and auth state
 */

import { defineStore } from "pinia";
import { de } from "zod/locales";
import { Role } from "~/types/roles";

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

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  program?: string;
  year?: string;
  firstname?: string;
  lastname?: string;
}

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
    isStudent: (state) => state.user?.role === "STUDENT",
    isTeacher: (state) => state.user?.role === "TEACHER",
    isAdmin: (state) => state.user?.role === "ADMIN",
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role || null,
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
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        });

        // Handle different error statuses
        if (!response.ok) {
          let errorMessage = "Login failed";

          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // If response is not JSON, use status-based messages
            if (response.status === 401) {
              errorMessage = "Invalid email or password";
            } else if (response.status === 404) {
              errorMessage = "User not found";
            } else if (response.status >= 500) {
              errorMessage = "Server error. Please try again later";
            } else {
              errorMessage = `Login failed: ${response.statusText}`;
            }
          }

          throw new Error(errorMessage);
        }

        const responseData = await response.json();

        // Validate response structure
        if (!responseData.success || !responseData.data) {
          throw new Error("Invalid response from server");
        }

        const { data } = responseData;

        // Store tokens
        if (data.access_token) {
          safeLocalStorage.setItem("access_token", data.access_token);
        } else {
          throw new Error("No access token received from server");
        }

        if (data.refresh_token) {
          safeLocalStorage.setItem("refresh_token", data.refresh_token);
        }

        // Fetch complete user details from API
        await this.fetchCurrentUser();

        this.isAuthenticated = true;
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
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
      }
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

        const response = await fetch(`/api/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userData = await response.json();

        // if (!responseData.success || !responseData.data) {
        //   throw new Error("Invalid response from server");
        // }

        // Map API response to User interface

        console.log("Fetched current user data:", userData.role.name);

        this.user = {
          id: userData.id,
          email: userData.email,
          name: `${userData.firstname || ""} ${userData.lastname || userData.email}`.trim(),
          firstname: userData.firstname,
          lastname: userData.lastname,
          role: userData.role.name,
          avatar: userData.avatar || undefined,
          program: userData.program,
          year: userData.year,
        };
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
      role: Role
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
        "firstname": "John",
        "lastname": "Doe",
        "email": "john@example.com",
        "password": "@password123",
        "departmentCode": "GIC",
        "bio": "Professor at GIC",
        "hashedRefreshToken": "Refresh token for easy revoking"
      }
           */

        // Call real API via proxy
        const response = await fetch("/api/users/signup", {
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
        });

        if (!response.ok) {
          let errorMessage = "Registration failed";

          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            if (response.status === 409 || response.status === 400) {
              errorMessage = "Email already exists";
            } else if (response.status >= 500) {
              errorMessage = "Server error. Please try again later";
            } else {
              errorMessage = `Registration failed: ${response.statusText}`;
            }
          }

          throw new Error(errorMessage);
        }

        const responseData = await response.json();

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

        const response = await fetch(
          `/api/users/search?q=${encodeURIComponent(query)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to search users");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("Invalid response from server");
        }

        return responseData.data.map((userData: any) => ({
          id: userData.id,
          name: `${userData.firstname || ""} ${userData.lastname || ""}`.trim(),
          email: userData.email,
          avatar:
            userData.avatar ||
           "" , // default avatar empty string if not provided
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
      refreshToken?: string
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

        // Check if this is a new user (needs security questions)
        // Backend should include hasSecurityQuestions or isNewUser in the JWT

        // Check multiple possible flags from the token
        const needsQuestions =
          tokenPayload.isNewUser === true ||
          tokenPayload.hasSecurityQuestions === false ||
          tokenPayload.needsSecurityQuestions === true;

        // TEMPORARY: Always show for OAuth until backend implements the flag
        // TODO: Remove this override once backend sends proper flag
        this.needsSecurityQuestions = true; // Override for testing

        console.log("Token says needs questions:", needsQuestions);
        console.log("Actually showing modal:", this.needsSecurityQuestions);

        // Fetch complete user details from API
        await this.fetchCurrentUser();

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

        // Token is valid, fetch current user from API
        await this.fetchCurrentUser();

        this.isAuthenticated = true;
        return true;
      } catch (error) {
        // Network or temporary errors - keep tokens, just set loading to false
        // User can try again on next navigation or refresh
        console.error(
          "Failed to restore auth (keeping tokens for retry):",
          error
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
        return false;
      }

      try {
        const response = await fetch("/api/users/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        });

        if (!response.ok) {
          return false;
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data?.access_token) {
          return false;
        }

        // Store new access token
        safeLocalStorage.setItem(
          "access_token",
          responseData.data.access_token
        );

        // Update refresh token if provided
        if (responseData.data.refresh_token) {
          safeLocalStorage.setItem(
            "refresh_token",
            responseData.data.refresh_token
          );
        }

        // Fetch complete user details from API
        await this.fetchCurrentUser();

        return true;
      } catch (error) {
        console.error("Failed to refresh token:", error);
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
      options: RequestInit = {}
    ): Promise<Response> {
      // Check if token is expired and refresh if needed
      if (this.isTokenExpired()) {
        const refreshed = await this.refreshAccessToken();
        if (!refreshed) {
          this.logout();
          throw new Error("Session expired. Please login again.");
        }
      }

      const token = this.getToken();

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      // If unauthorized, try refreshing token once
      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry request with new token
          const newToken = this.getToken();
          return fetch(url, {
            ...options,
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

      return response;
    },

    /**
     * Logout user
     */
    logout(): void {
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;

      // Clear stored tokens
      safeLocalStorage.removeItem("access_token");
      safeLocalStorage.removeItem("refresh_token");
    },

    /**
     * Check if user has specific role
     */
    hasRole(role: "STUDENT" | "TEACHER"): boolean {
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
        this.user = { ...this.user, ...updates };
      }
    },

    /**
     * Submit security question answers for new OAuth users
     */
    async submitSecurityQuestions(answers: {
      question1: { question: string; answer: string };
      question2: { question: string; answer: string };
      question3: { question: string; answer: string };
    }): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        const token = this.getToken();
        if (!token) {
          throw new Error("Not authenticated");
        }

        console.log("🔵 Submitting security questions...");

        // TODO: Remove this mock when backend endpoint is ready
        // For now, simulate successful submission for testing
        const USE_MOCK = true; // Set to false when backend is ready

        if (USE_MOCK) {
          console.log("🔵 Using mock response (backend endpoint not ready)");
          await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
          console.log("✅ Security questions saved successfully (mocked)");
        } else {
          const response = await fetch("/api/users/security-questions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              securityQuestions: [
                {
                  question: answers.question1.question,
                  answer: answers.question1.answer,
                },
                {
                  question: answers.question2.question,
                  answer: answers.question2.answer,
                },
                {
                  question: answers.question3.question,
                  answer: answers.question3.answer,
                },
              ],
            }),
          });

          console.log("🔵 Response status:", response.status);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.log("❌ Error response:", errorData);
            throw new Error(
              errorData.message || "Failed to save security questions"
            );
          }

          const responseData = await response.json().catch(() => ({}));
          console.log(
            "✅ Security questions saved successfully:",
            responseData
          );
        }

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
