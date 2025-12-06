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
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

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
     * Mock users for testing
     */
    getMockUser(email: string): User {
      const mockUsers: Record<string, User> = {
        "student@gic.edu": {
          id: "STU001",
          name: "Sarah Johnson",
          email: "student@gic.edu",
          role: "student",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=100&h=100&fit=crop&crop=face",
          program: "Computer Science",
          year: "3rd Year",
        },
        "student2@gic.edu": {
          id: "STU002",
          name: "Michael Chen",
          email: "student2@gic.edu",
          role: "student",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          program: "Information Technology",
          year: "2nd Year",
        },
        "teacher@gic.edu": {
          id: "TCH001",
          name: "Dr. Emily Watson",
          email: "teacher@gic.edu",
          role: "teacher",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          program: "Computer Science",
          year: "Professor",
        },
        "teacher2@gic.edu": {
          id: "TCH002",
          name: "Prof. David Kumar",
          email: "teacher2@gic.edu",
          role: "teacher",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
          program: "Information Technology",
          year: "Associate Professor",
        },
      };

      // If email exists in mock users, return that user
      if (mockUsers[email]) {
        return mockUsers[email];
      }

      // Otherwise, determine role from email and create a generic user
      const role: "student" | "teacher" =
        email.endsWith("@teacher") || email.includes("teacher")
          ? "teacher"
          : "student";

      return {
        id: role === "student" ? "STU999" : "TCH999",
        name: role === "student" ? "Student User" : "Teacher User",
        email,
        role,
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=100&h=100&fit=crop&crop=face",
        program: role === "student" ? "Computer Science" : "Engineering",
        year: role === "student" ? "1st Year" : "Senior Lecturer",
      };
    },

    /**
     * Login user with email and password
     */
    async login(email: string, password: string): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Validate credentials (mock)
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        if (password.length < 6) {
          throw new Error("Invalid credentials");
        }

        // Get mock user or create generic one
        this.user = this.getMockUser(email);
        this.isAuthenticated = true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Login failed";
        this.isAuthenticated = false;
        throw error;
      } finally {
        this.isLoading = false;
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
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Validate inputs
        if (!fullName || !email || !password || !confirmPassword) {
          throw new Error("All fields are required");
        }

        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        if (!email.includes("@")) {
          throw new Error("Invalid email format");
        }

        // Create new user
        this.user = {
          id: role === "student" ? `STU${Date.now()}` : `TCH${Date.now()}`,
          name: fullName,
          email,
          role,
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=100&h=100&fit=crop&crop=face",
          program: role === "student" ? "Computer Science" : "Engineering",
          year: role === "student" ? "1st Year" : "Lecturer",
        };

        this.isAuthenticated = true;
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Registration failed";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Logout user
     */
    logout(): void {
      this.user = null;
      this.isAuthenticated = false;
      this.error = null;
    },

    /**
     * Check if user has specific role
     */
    hasRole(role: "student" | "teacher"): boolean {
      return this.user?.role === role;
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
  },
});
