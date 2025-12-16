/**
 * Auth Store - User authentication and role management
 * Handles user login, role assignment (student/teacher), and auth state
 */

import { defineStore } from "pinia";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
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
}

const API_BASE_URL = "https://gic-project.darororo.dev";

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    isStudent: (state) => state.user?.role === "student",
    isTeacher: (state) => state.user?.role === "teacher",
    isAdmin: (state) => state.user?.role === "teacher",
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

        // Call real API
        const response = await fetch(`${API_BASE_URL}/users/login`, {
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
          localStorage.setItem("access_token", data.access_token);
        } else {
          throw new Error("No access token received from server");
        }

        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }

        // Decode JWT to get user info (basic decode, not validation)
        const tokenPayload = this.decodeJWT(data.access_token);

        if (!tokenPayload) {
          throw new Error("Invalid token format");
        }

        // Map token payload to User interface
        this.user = {
          id: tokenPayload.id,
          email: tokenPayload.email,
          name: `${tokenPayload.firstname || ""} ${
            tokenPayload.lastname || ""
          }`.trim(),
          firstname: tokenPayload.firstname,
          lastname: tokenPayload.lastname,
          role: tokenPayload.role || "student", // Default to student if not provided
          // avatar: tokenPayload.avatar || "/default-avatar.png",
          avatar: "default-avatar.png",
          program: tokenPayload.program,
          year: tokenPayload.year,
        };

        this.isAuthenticated = true;
      } catch (error) {
        // Reset auth state on error
        this.user = null;
        this.isAuthenticated = false;
        this.error = error instanceof Error ? error.message : "Login failed";

        // Clear any existing tokens
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

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
     * Register new user
     */
    async register(
      fullName: string,
      email: string,
      password: string,
      confirmPassword: string,
      role: "student" | "teacher"
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
        const firstname = nameParts[0];
        const lastname = nameParts.slice(1).join(" ") || "";

        // Call real API
        const response = await fetch(`${API_BASE_URL}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstname,
            lastname,
            email: email.trim().toLowerCase(),
            password,
            role,
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
          localStorage.setItem("access_token", data.access_token);
        }

        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }

        // Decode JWT to get user info
        const tokenPayload = this.decodeJWT(data.access_token);

        if (!tokenPayload) {
          throw new Error("Invalid token format");
        }

        // Map token payload to User interface
        this.user = {
          id: tokenPayload.id,
          email: tokenPayload.email,
          name: `${tokenPayload.firstname || ""} ${
            tokenPayload.lastname || ""
          }`.trim(),
          firstname: tokenPayload.firstname,
          lastname: tokenPayload.lastname,
          role: tokenPayload.role || role,
          avatar: tokenPayload.avatar,
          program: tokenPayload.program,
          year: tokenPayload.year,
        };

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
        localStorage.setItem("access_token", token);

        // Store refresh token if provided
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        // Decode JWT to get user info
        const tokenPayload = this.decodeJWT(token);

        if (!tokenPayload) {
          throw new Error("Invalid token format");
        }

        // Map token payload to User interface
        this.user = {
          id: tokenPayload.id,
          email: tokenPayload.email,
          name: `${tokenPayload.firstname || ""} ${
            tokenPayload.lastname || ""
          }`.trim(),
          firstname: tokenPayload.firstname,
          lastname: tokenPayload.lastname,
          role: tokenPayload.role || "student",
          avatar: tokenPayload.avatar,
          program: tokenPayload.program,
          year: tokenPayload.year,
        };

        this.isAuthenticated = true;
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
        this.error =
          error instanceof Error ? error.message : "OAuth login failed";

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

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
      const token = localStorage.getItem("access_token");

      if (!token) {
        return false;
      }

      this.isLoading = true;

      try {
        // Decode and verify token expiration
        const tokenPayload = this.decodeJWT(token);

        if (!tokenPayload) {
          throw new Error("Invalid token");
        }

        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          // Token expired, try to refresh
          const refreshed = await this.refreshAccessToken();
          if (!refreshed) {
            throw new Error("Token expired");
          }
          return true;
        }

        // Token is valid, restore user from token
        this.user = {
          id: tokenPayload.id,
          email: tokenPayload.email,
          name: `${tokenPayload.firstname || ""} ${
            tokenPayload.lastname || ""
          }`.trim(),
          firstname: tokenPayload.firstname,
          lastname: tokenPayload.lastname,
          role: tokenPayload.role || "student",
          avatar: tokenPayload.avatar,
          program: tokenPayload.program,
          year: tokenPayload.year,
        };

        this.isAuthenticated = true;
        return true;
      } catch (error) {
        // Silent fail - just clear the tokens
        console.error("Failed to restore auth:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        this.user = null;
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
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        return false;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/refresh`, {
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
        localStorage.setItem("access_token", responseData.data.access_token);

        // Update refresh token if provided
        if (responseData.data.refresh_token) {
          localStorage.setItem(
            "refresh_token",
            responseData.data.refresh_token
          );
        }

        // Update user info from new token
        const tokenPayload = this.decodeJWT(responseData.data.access_token);
        if (tokenPayload) {
          this.user = {
            id: tokenPayload.id,
            email: tokenPayload.email,
            name: `${tokenPayload.firstname || ""} ${
              tokenPayload.lastname || ""
            }`.trim(),
            firstname: tokenPayload.firstname,
            lastname: tokenPayload.lastname,
            role: tokenPayload.role || "student",
            avatar: tokenPayload.avatar,
            program: tokenPayload.program,
            year: tokenPayload.year,
          };
        }

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
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },

    /**
     * Check if user has specific role
     */
    hasRole(role: "student" | "teacher"): boolean {
      return this.user?.role === role;
    },

    /**
     * Get authentication token
     */
    getToken(): string | null {
      return localStorage.getItem("access_token");
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
  },
});
