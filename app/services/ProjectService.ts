/**
 * ProjectService Class
 * Handles all CRUD operations for projects using OOP principles
 * Separates API logic from state management (store)
 */

import { authService } from "./AuthService";
import { projectsData } from "~/constants/projects";

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
  highlighted?: boolean;
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
        headers: await authService.getAuthHeaders({
          "Content-Type": "application/json",
        }),
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
      // Use centralized auth request to ensure token refresh and header
      return await authService.makeAuthRequest("/api/projects/submissions", {
        method: "GET",
      });
    } catch (error) {
      console.error("ProjectService: Failed to fetch submissions", error);
      throw error;
    }
  }

  async getHighlightedProjects(): Promise<any> {
    try {
      return await $fetch(`${this.baseUrl}/highlights`);
    } catch (error) {
      console.error(
        "ProjectService: Failed to fetch highlighted projects",
        error,
      );

      // Fallback to local static projects when API/cache fails.
      return projectsData.slice(0, 6).map((project) => {
        const [firstName = "", ...restName] = project.author.name.split(" ");
        const lastName = restName.join(" ");

        return {
          id: project.id,
          name: project.name,
          description: project.description,
          academicYear: project.academicYear,
          author: {
            id: project.author.id,
            firstName,
            lastName,
            avatar: project.author.avatar,
            program: project.author.program,
            year: project.author.year,
            email: project.author.email,
          },
          technologies: project.technologies,
          category: project.category,
          status: project.submissionStatus,
          highlighted: project.highlighted,
          likeCount: project.likes,
          viewCount: project.views,
          demoUrl: project.demoUrl,
          githubUrl: project.githubUrl,
          images: project.images,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          tags: project.tags,
          members: (project.members || []).map((member) => {
            const [memberFirstName = "", ...memberRestName] =
              member.name.split(" ");
            const memberLastName = memberRestName.join(" ");
            return {
              id: member.id,
              email: member.email,
              firstName: memberFirstName,
              lastName: memberLastName,
              avatar: member.image,
            };
          }),
          features: project.features || [],
          duration: project.duration,
          course: project.course,
          visibility: project.visibility,
        };
      });
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

      let response = await $fetch(this.baseUrl, {
        method: "POST",
        headers: await authService.getAuthHeaders(),
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
        headers: await authService.getAuthHeaders({
          "Content-Type": "application/json",
        }),
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
        headers: await authService.getAuthHeaders({
          "Content-Type": "application/json",
        }),
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
        headers: await authService.getAuthHeaders({
          "Content-Type": "application/json",
        }),
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
        headers: await authService.getAuthHeaders({
          "Content-Type": "application/json",
        }),
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
        headers: await authService.getAuthHeaders(),
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
        headers: await authService.getAuthHeaders(),
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
        headers: await authService.getAuthHeaders(),
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
        headers: await authService.getAuthHeaders(),
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
        headers: await authService.getAuthHeaders(),
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
