/**
 * AuthService - encapsulates all authentication-related API calls and token handling.
 * Follows the same OOP separation as ProjectService to keep stores focused on state.
 */

import type { Course } from "~/utils/Interfaces";
import type { UpdateProfilePayload } from "~/types/user-profile";
import { Role } from "~/types/roles";
import { getAvatarUrl } from "~/utils/avatar";

// Helper to safely access localStorage on client side
const safeLocalStorage = {
  getItem(key: string): string | null {
    if (process.client && typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem(key: string, value: string): void {
    if (process.client && typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
  removeItem(key: string): void {
    if (process.client && typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
  },
};

// User domain models
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
  /**
   * Flag indicating if the user has already answered security questions.
   * API currently returns `hasAnwers` (typo) or sometimes `hasAnswers`.
   */
  hasAnwers: boolean;
}

export interface StudentUser extends BaseUser {
  role: Role.student;
  studentId: string;
  program: string;
  year: string;
  gen?: string;
  projectCount?: number;
  achievements?: number;
}

export interface TeacherUser extends BaseUser {
  role: Role.teacher;
  teacherId: string;
  department: string;
  position: string;
  courses?: Course[];
  yearsOfExperience?: number;
}

export interface AdminUser extends BaseUser {
  role: Role.admin;
  adminId: string;
}

export type User = StudentUser | TeacherUser | AdminUser;

export interface AuthResult {
  user: User;
  needsSecurityQuestions: boolean;
}

export class AuthService {
  private baseUrl = "/api/users";

  protected getbaseUrl() {
    return this.baseUrl;
  }

  getAccessToken(): string | null {
    return safeLocalStorage.getItem("access_token");
  }

  getRefreshToken(): string | null {
    return safeLocalStorage.getItem("refresh_token");
  }

  private setTokens(access?: string, refresh?: string): void {
    if (access) safeLocalStorage.setItem("access_token", access);
    if (refresh) safeLocalStorage.setItem("refresh_token", refresh);
  }

  private clearTokens(): void {
    safeLocalStorage.removeItem("access_token");
    safeLocalStorage.removeItem("refresh_token");
  }

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
      console.error("AuthService: Failed to decode JWT:", error);
      return null;
    }
  }

  /**
   * Public helper to build auth headers, auto-refreshing when near expiry.
   */
  async getAuthHeaders(
    extraHeaders: Record<string, string> = {},
  ): Promise<Record<string, string>> {
    if (this.isTokenExpired()) {
      await this.refreshAccessToken();
    }

    const token = this.getAccessToken();

    return {
      ...extraHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  isTokenExpired(token?: string | null): boolean {
    const target = token || this.getAccessToken();
    if (!target) return true;

    const payload = this.decodeJWT(target);
    if (!payload?.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp - currentTime < 300; // 5-minute buffer
  }

  private mapUser(userData: any): User {
    const baseUser: BaseUser = {
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
      hasAnwers: userData.hasAnswers,
    };

    if (userData.role === Role.student) {
      return {
        ...baseUser,
        role: Role.student,
        studentId: userData.studentId || userData.id,
        program: userData.program || "",
        year: userData.year || "",
        gen: userData.gen || "",
        projectCount: userData.projectCount || 0,
        achievements: userData.achievements || 0,
      };
    }

    if (userData.role === Role.teacher) {
      return {
        ...baseUser,
        role: Role.teacher,
        teacherId: userData.teacherId || userData.id,
        department: userData.department?.name || "",
        position: userData.position || "",
        courses: userData.courses || [],
        yearsOfExperience: userData.yearsOfExperience || 0,
      };
    }

    return {
      ...baseUser,
      role: Role.admin,
      adminId: userData.adminId || userData.id,
    };
  }

  private validateEmail(email: string): void {
    // Basic email shape check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  private requireToken(): string {
    const token = this.getAccessToken();
    if (!token) throw new Error("No authentication token");
    return token;
  }

  async login(email: string, password: string): Promise<AuthResult> {
    if (!email || !password) throw new Error("Email and password are required");
    const normalizedEmail = email.trim().toLowerCase();
    this.validateEmail(normalizedEmail);

    const response = await $fetch<{
      success: boolean;
      data: { access_token: string; refresh_token?: string };
    }>(`${this.baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
      }),
      onResponseError({ response }) {
        let message = "Login failed";
        if (response._data?.message) message = response._data.message;
        else if (response.status === 401) message = "Invalid email or password";
        else if (response.status === 404) message = "User not found";
        else if (response.status >= 500)
          message = "Server error. Please try again later";
        else message = `Login failed: ${response.statusText}`;
        throw new Error(message);
      },
    });

    if (!response.success || !response.data) {
      throw new Error("Invalid response from server");
    }

    const { access_token, refresh_token } = response.data;
    if (!access_token) {
      throw new Error("No access token received from server");
    }

    this.setTokens(access_token, refresh_token);
    const user = await this.fetchCurrentUser();

    return {
      user,
      needsSecurityQuestions: !user.hasAnwers,
    };
  }

  async register(
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: Role,
  ): Promise<AuthResult> {
    if (!fullName || !email || !password || !confirmPassword) {
      throw new Error("All fields are required");
    }
    if (fullName.trim().length < 2) {
      throw new Error("Name must be at least 2 characters");
    }
    const normalizedEmail = email.trim().toLowerCase();
    this.validateEmail(normalizedEmail);
    if (password !== confirmPassword) throw new Error("Passwords do not match");
    if (password.length < 6)
      throw new Error("Password must be at least 6 characters");

    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const response = await $fetch<{
      success: boolean;
      data: { access_token?: string; refresh_token?: string };
    }>(`${this.baseUrl}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email: normalizedEmail,
        password,
        departmentCode: "GIC",
        bio: `${role} at GIC`,
      }),
      onResponseError({ response }) {
        let message = "Registration failed";
        if (response._data?.message) message = response._data.message;
        else if (response.status === 409 || response.status === 400)
          message = "Email already exists";
        else if (response.status >= 500)
          message = "Server error. Please try again later";
        else message = `Registration failed: ${response.statusText}`;
        throw new Error(message);
      },
    });

    if (!response.success || !response.data) {
      throw new Error("Invalid response from server");
    }

    const { access_token, refresh_token } = response.data;
    if (access_token) this.setTokens(access_token, refresh_token);

    const user = await this.fetchCurrentUser();
    return { user, needsSecurityQuestions: true };
  }

  async fetchCurrentUser(): Promise<User> {
    const token = this.requireToken();
    const decoded = this.decodeJWT(token);
    if (!decoded || !decoded.id) throw new Error("Invalid token");

    const userData = await $fetch(`${this.baseUrl}/${decoded.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return this.mapUser(userData);
  }

  async searchUsers(query: string): Promise<User[]> {
    const token = this.requireToken();

    const response = await $fetch<{
      success: boolean;
      data: any[];
    }>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response?.success || !Array.isArray(response.data)) {
      throw new Error("Invalid response from server");
    }

    return response.data.map((userData: any) => this.mapUser(userData));
  }

  async handleOAuthCallback(
    token: string,
    refreshToken?: string,
  ): Promise<AuthResult> {
    if (!token) throw new Error("No token provided");
    this.setTokens(token, refreshToken);

    const payload = this.decodeJWT(token);
    if (!payload) throw new Error("Invalid token format");

    const user = await this.fetchCurrentUser();
    const needsSecurityQuestions =
      payload.isNewUser === true ||
      payload.hasSecurityQuestions === false ||
      payload.needsSecurityQuestions === true ||
      !user.hasAnwers;

    return { user, needsSecurityQuestions };
  }

  async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.warn("AuthService: No refresh token available");
      return false;
    }

    try {
      const response = await $fetch<{
        access_token?: string;
        refresh_token?: string;
      }>(`${this.baseUrl}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { refresh_token: refreshToken },
      });

      if (!response?.access_token && !response?.refresh_token) {
        console.error("AuthService: No tokens returned on refresh");
        return false;
      }

      this.setTokens(response.access_token, response.refresh_token);
      return true;
    } catch (error) {
      console.error("AuthService: Failed to refresh token", error);
      return false;
    }
  }

  /**
   * Change password with security answers.
   */
  async changePassword(payload: {
    answers: Array<{ questionId: string; answer: string }>;
    newPassword: string;
  }): Promise<any> {
    const url = `${this.baseUrl}/change-password`;
    return this.makeAuthRequest(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  async updateUserProfile(
    payload: UpdateProfilePayload,
  ): Promise<User | undefined> {
    try {
      // Ensure socialLinks is an array of items
      const socialLinksArray = Array.isArray(payload.socialLinks)
        ? payload.socialLinks.filter((item) => item?.url)
        : undefined;

      const payloadToSend = socialLinksArray
        ? { ...payload, socialLinks: socialLinksArray }
        : { ...payload };

      const updated = await this.makeAuthRequest(`${this.baseUrl}/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadToSend),
      });

      // API returns the updated user object
      return this.mapUser(updated);
    } catch (error) {
      console.log("Failed to update user profile!", error);
      throw error;
    }
  }

  async makeAuthRequest(
    url: string,
    options: RequestInit & { body?: any } = {},
    onSessionExpired?: () => void,
  ): Promise<any> {
    if (this.isTokenExpired()) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        onSessionExpired?.();
        throw new Error("Session expired. Please login again.");
      }
    }

    const token = this.requireToken();

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
      if (error?.statusCode === 401 || error?.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          const retryToken = this.requireToken();
          return await $fetch(url, {
            ...options,
            method: (options.method as any) || "GET",
            headers: {
              ...options.headers,
              Authorization: `Bearer ${retryToken}`,
            },
          });
        }
        onSessionExpired?.();
        throw new Error("Session expired. Please login again.");
      }
      throw error;
    }
  }

  async restoreAuth(): Promise<{ authenticated: boolean; user: User | null }> {
    const token = this.getAccessToken();
    if (!token) return { authenticated: false, user: null };

    const payload = this.decodeJWT(token);
    if (!payload) {
      this.clearTokens();
      return { authenticated: false, user: null };
    }

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        this.clearTokens();
        return { authenticated: false, user: null };
      }
    }

    try {
      const user = await this.fetchCurrentUser();
      return { authenticated: true, user };
    } catch (error) {
      console.error("AuthService: Failed to restore auth", error);
      return { authenticated: false, user: null };
    }
  }

  async logout(userId?: string): Promise<void> {
    try {
      if (userId) {
        await $fetch(`${this.baseUrl}/logout/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch {
      // ignore logout errors
    } finally {
      this.clearTokens();
    }
  }
}

export const authService = new AuthService();
