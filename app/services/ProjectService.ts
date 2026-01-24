/**
 * ProjectService Class
 * Handles all CRUD operations for projects using OOP principles
 * Separates API logic from state management (store)
 */

import type { Project } from "~/utils/Interfaces";

export interface CreateProjectDTO {
  name: string;
  description: string;
  categoryId?: string;
  courseId?: string;
  technologies?: string[];
  tags?: string[];
  features?: any[];
  demoUrl?: string;
  repoUrl?: string;
  authorId: string;
  departmentId: string;
  memberIds?: string[];
  academicYear?: string;
  startDate?: string;
  images?: File[];
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
  categoryId?: string;
  technologies?: string[];
  tags?: string[];
  features?: any[];
  demoUrl?: string;
  repoUrl?: string;
  visibility?: "public" | "private";
}

export interface ProjectFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  tags?: string[];
  year?: string;
  sort?: string;
}

/**
 * ProjectService - Handles all project-related API operations
 * Following Single Responsibility Principle
 */
export class ProjectService {
    // static instance: ProjectService;
  private baseUrl = "/api/projects";

  /**
   * Get authentication token from auth store
   */
  private getAuthToken(): string | null {
    const authStore = useAuthStore();
    return authStore.token;
  }

  /**
   * Build authorization headers
   */
  private getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : { "Content-Type": "application/json" };
  }

  /**
   * Fetch all projects with optional filters
   */
  async fetchAll(filters?: ProjectFilters): Promise<any> {
    try {
      const params = new URLSearchParams();

      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.search) params.append("search", filters.search);
      if (filters?.categoryId) params.append("category", filters.categoryId);
      if (filters?.tags?.length) params.append("tags", filters.tags.join(","));
      if (filters?.year) params.append("year", filters.year);
      if (filters?.sort) params.append("sort", filters.sort);

      const queryString = params.toString();
      const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

      return await $fetch(url, {
        method: "GET",
      });
    } catch (error) {
      console.error("ProjectService: Failed to fetch projects", error);
      throw error;
    }
  }

  /**
   * Fetch a single project by ID
   */
  async fetchById(projectId: string): Promise<any> {
    try {
      return await $fetch(`${this.baseUrl}/${projectId}`, {
        method: "GET",
      });
    } catch (error) {
      console.error(
        `ProjectService: Failed to fetch project ${projectId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Fetch current user's projects
   */
  async fetchUserProjects(): Promise<any> {
    try {
      return await $fetch(`${this.baseUrl}/me`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error("ProjectService: Failed to fetch user projects", error);
      throw error;
    }
  }

  /**
   * Create a new project
   */
  async create(projectData: CreateProjectDTO): Promise<any> {
    try {
      const formData = new FormData();

      // Add required fields
      formData.append("name", projectData.name);
      formData.append("description", projectData.description);
      formData.append("authorId", projectData.authorId);
      formData.append("departmentId", projectData.departmentId);

      // Add optional fields
      if (projectData.categoryId)
        formData.append("categoryId", projectData.categoryId);
      if (projectData.courseId)
        formData.append("courseId", projectData.courseId);
      if (projectData.technologies?.length)
        formData.append(
          "technologies",
          JSON.stringify(projectData.technologies),
        );
      if (projectData.tags?.length)
        formData.append("tags", JSON.stringify(projectData.tags));
      if (projectData.features?.length)
        formData.append("features", JSON.stringify(projectData.features));
      if (projectData.demoUrl) formData.append("demoUrl", projectData.demoUrl);
      if (projectData.repoUrl) formData.append("repoUrl", projectData.repoUrl);
      if (projectData.memberIds?.length)
        formData.append("memberIds", JSON.stringify(projectData.memberIds));
      if (projectData.academicYear)
        formData.append("academicYear", projectData.academicYear);
      if (projectData.startDate)
        formData.append("startDate", projectData.startDate);

      // Add images
      if (projectData.images?.length) {
        projectData.images.forEach((image) => {
          formData.append("files", image);
        });
      }

      const token = this.getAuthToken();
      return await $fetch(this.baseUrl, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
    } catch (error) {
      console.error("ProjectService: Failed to create project", error);
      throw error;
    }
  }

  /**
   * Update an existing project
   */
  async update(projectId: string, updates: UpdateProjectDTO): Promise<any> {
    try {
      let response = await $fetch(`${this.baseUrl}/${projectId}`, {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: updates,
      });
      return response;
    } catch (error) {
      console.error(
        `ProjectService: Failed to update project ${projectId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Delete a project
   */
  async delete(projectId: string): Promise<void> {
    try {
      await $fetch(`${this.baseUrl}/${projectId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error(
        `ProjectService: Failed to delete project ${projectId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Like/Unlike a project
   */
  async toggleLike(projectId: string): Promise<{ liked: boolean }> {
    try {
      let response = await $fetch(`${this.baseUrl}/${projectId}/like`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error(
        `ProjectService: Failed to toggle like for ${projectId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Track project view
   */
  async trackView(projectId: string): Promise<void> {
    try {
      await $fetch(`${this.baseUrl}/${projectId}/view`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error(
        `ProjectService: Failed to track view for ${projectId}`,
        error,
      );
      // Don't throw - view tracking is non-critical
    }
  }

  /**
   * Get project like count
   */
  async getLikeCount(projectId: string): Promise<number> {
    try {
      const data = await $fetch(`${this.baseUrl}/${projectId}/like-count`, {
        method: "GET",
      });
      return data.likeCount || 0;
    } catch (error) {
      console.error(
        `ProjectService: Failed to get like count for ${projectId}`,
        error,
      );
      return 0;
    }
  }

  /**
   * Get project view count
   */
  async getViewCount(projectId: string): Promise<number> {
    try {
      const data = await $fetch(`${this.baseUrl}/${projectId}/view-count`, {
        method: "GET",
      });
      return data.viewCount || 0;
    } catch (error) {
      console.error(
        `ProjectService: Failed to get view count for ${projectId}`,
        error,
      );
      return 0;
    }
  }

  /**
   * Check if user has liked a project
   */
  async hasUserLiked(projectId: string): Promise<boolean> {
    try {
      const data = await $fetch(`${this.baseUrl}/${projectId}/has-liked`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });
      return data.hasLiked || false;
    } catch (error) {
      console.error(
        `ProjectService: Failed to check like status for ${projectId}`,
        error,
      );
      return false;
    }
  }

  /**
   * Submit project for review
   */
  async submitForReview(projectId: string): Promise<any> {
    try {
      return await $fetch(`${this.baseUrl}/submit/${projectId}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error(
        `ProjectService: Failed to submit project ${projectId}`,
        error,
      );
      throw error;
    }
  }
}

/**
 * Singleton instance for easy import
 */
export const projectService = new ProjectService();
