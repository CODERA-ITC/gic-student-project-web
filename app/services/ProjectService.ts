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
  courseId?: string;
  gen?: string;
  sort?: string;
  ascending?: boolean;
}

/**
 * ProjectService - Handles all project-related API operations
 * Following Single Responsibility Principle
 */
export class ProjectService {
  // static instance: ProjectService;
  private baseUrl = "/api/projects";

  /**
   * Build authorization headers
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const authStore = useAuthStore();

    // Refresh if token is expired or about to expire
    if (authStore.isTokenExpired()) {
      await authStore.refreshAccessToken();
    }

    const token = authStore.token;

    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : { "Content-Type": "application/json" };
  }

  /**
   * Fetch all projects with optional filters
   * When search is provided, only search parameter is sent (debounced mode)
   */
  async fetchAll(filters?: ProjectFilters): Promise<any> {
    try {
      const params = new URLSearchParams();

      // If search is provided, only send search parameter (debounced search mode)
      if (filters?.search) {
        params.append("search", filters.search);
        // Optionally keep pagination for search results
        if (filters?.page) params.append("page", filters.page.toString());
        if (filters?.limit) params.append("limit", filters.limit.toString());
      } else {
        // Normal filtering mode - apply all filters
        if (filters?.page) params.append("page", filters.page.toString());
        if (filters?.limit) params.append("limit", filters.limit.toString());
        if (filters?.categoryId)
          params.append("categoryId", filters.categoryId);
        if (filters?.courseId) params.append("courseId", filters.courseId);
        if (filters?.gen) params.append("gen", filters.gen);
        if (filters?.sort) params.append("sort", filters.sort);
        if (filters?.ascending !== undefined)
          params.append("ascending", filters.ascending.toString());
      }

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
        headers: await this.getAuthHeaders(),
      });
    } catch (error) {
      console.error("ProjectService: Failed to fetch user projects", error);
      throw error;
    }
  }

  /**
   * Fetch all submissions (for teachers)
   * Endpoint: GET /courses/submissions
   */
  async fetchAllSubmissions(): Promise<any> {
    try {
      const authStore = useAuthStore();

      // Use centralized auth request to ensure token refresh and header
      return await authStore.makeAuthRequest("/api/courses/submissions", {
        method: "GET",
      });
    } catch (error) {
      console.error("ProjectService: Failed to fetch submissions", error);
      throw error;
    }
  }

  async getHighlightedProjects(): Promise<any> {
    let projects: any;

    try {
      const response = await $fetch(`${this.baseUrl}/highlights`);
      return (projects = response);
    } catch (error) {
      console.error(
        "ProjectService: Failed to fetch highlighted projects",
        error,
      );
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

      const token = this.getAuthHeaders();

      let response = await $fetch(this.baseUrl, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      return response;
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
        headers: await this.getAuthHeaders(),
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
   * Accept a project (Teacher only)
   */
  async acceptProject(projectId: string): Promise<any> {
    try {
      const response = await $fetch(`${this.baseUrl}/accept/${projectId}`, {
        method: "PATCH",
        headers: await this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error(
        `ProjectService: Failed to accept project ${projectId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Reject a project (Teacher only)
   */
  async rejectProject(projectId: string): Promise<any> {
    try {
      const response = await $fetch(`${this.baseUrl}/${projectId}`, {
        method: "PATCH",
        body: {
          status: SubmissionStatus.REJECTED,
        },
        headers: await this.getAuthHeaders(),
      });
      return response;
    } catch (error) {
      console.error(
        `ProjectService: Failed to reject project ${projectId}`,
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
        headers: await this.getAuthHeaders(),
      });
    } catch (error) {
      console.error(
        `ProjectService: Failed to delete project ${projectId}`,
        error,
      );
      throw error;
    }
  }

  async submitProjectForReview(projectId: string): Promise<any> {
    try {
      return await $fetch(`${this.baseUrl}/submit/${projectId}`, {
        method: "POST",
        headers: await this.getAuthHeaders(),
      });
    } catch (error) {
      console.error(
        `ProjectService: Failed to submit project ${projectId}`,
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
        headers: await this.getAuthHeaders(),
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
        headers: await this.getAuthHeaders(),
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
   * Fetch all projects liked by the current user
   * Returns array of like objects with project info
   */
  async getUserLikedProjects(): Promise<any[]> {
    try {
      const response = await $fetch(`${this.baseUrl}/me/likes`, {
        method: "GET",
        headers: await this.getAuthHeaders(),
      });
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error(
        "ProjectService: Failed to fetch user liked projects",
        error,
      );
      return [];
    }
  }

  /**
   * Submit project for review
   */
  async submitForReview(projectId: string): Promise<any> {
    try {
      return await $fetch(`${this.baseUrl}/submit/${projectId}`, {
        method: "POST",
        headers: await this.getAuthHeaders(),
      });
    } catch (error) {
      console.error(
        `ProjectService: Failed to submit project ${projectId}`,
        error,
      );
      throw error;
    }
  }

  // async fetchSubmissionProjectForTeacher(): Promise<Project[]> {
  //   try {
  //     return await $fetch(`${this.baseUrl}/submissions/teacher`, {
  //       headers: await this.getAuthHeaders(),
  //     });
  //   } catch (error) {
  //     console.error(
  //       `ProjectService: Failed to fetch submission projects for teacher`,
  //       error,
  //     );
  //     throw error;
  //   }
  // }
}

/**
 * Singleton instance for easy import
 */
export const projectService = new ProjectService();
