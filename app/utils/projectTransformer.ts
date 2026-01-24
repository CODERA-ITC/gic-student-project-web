/**
 * Project Transformer Utility
 * Handles transformation of API responses to frontend Project interface
 * Following OOP principles for clean, reusable, and maintainable code
 */

import { getAvatarUrl } from "~/utils/avatar";
import type {
  Project,
  ProjectAuthor,
  ProjectImage,
  FeatureItem,
} from "~/utils/Interfaces";

// Default project images constant
export const ProjectDefaultImages: ProjectImage[] = [
  {
    id: "1234",
    originalUrl: `https://www.pixeden.com/media/k2/galleries/856/001-screen-showcase-landing-page-devices-presentation-web-psd-projects.jpg`,
    thumbnailUrl: `https://www.pixeden.com/media/k2/galleries/856/001-screen-showcase-landing-page-devices-presentation-web-psd-projects.jpg`,
  },
  {
    id: "1235",
    originalUrl: `https://img.freepik.com/free-photo/elegant-cozy-office-lifestyle_23-2149636247.jpg?semt=ais_user_personalization&w=740&q=80`,
    thumbnailUrl: `https://img.freepik.com/free-photo/elegant-cozy-office-lifestyle_23-2149636247.jpg?semt=ais_user_personalization&w=740&q=80`,
  },
];

/**
 * ProjectTransformer Class
 * Responsible for transforming API project data to frontend format
 */
export class ProjectTransformer {
  /**
   * Transform author data from API response
   * @param authorData - Raw author data from API
   * @returns Transformed ProjectAuthor object
   */
  static transformAuthor(authorData: any): ProjectAuthor {
    const firstName = authorData?.firstName || "";
    const lastName = authorData?.lastName || "";

    return {
      id: authorData?.id || "",
      name: authorData
        ? `${firstName} ${lastName}`.trim() || "Unknown"
        : "Unknown",
      avatar: getAvatarUrl(authorData?.avatar, firstName, lastName),
      program: authorData?.program || "",
      year: authorData?.year || "",
    };
  }

  /**
   * Transform category from API response
   * @param categoryData - Raw category data from API
   * @returns Category name string
   */
  static transformCategory(categoryData: any): string {
    if (typeof categoryData === "string") {
      return categoryData;
    }
    return categoryData?.name || "Uncategorized";
  }

  /**
   * Transform images from API response
   * @param imagesData - Raw images data from API
   * @returns Array of ProjectImage objects
   */
  static transformImages(imagesData: any): ProjectImage[] {
    if (imagesData && Array.isArray(imagesData) && imagesData.length > 0) {
      return imagesData.map((img: any) => {
        if (typeof img === "string") {
          return {
            id: Math.random().toString(),
            originalUrl: img,
            thumbnailUrl: img,
          };
        }
        return {
          id: img.id || Math.random().toString(),
          originalUrl: img.originalUrl || img.url || "",
          thumbnailUrl: img.thumbnailUrl || img.url || "",
        };
      });
    }
    return ProjectDefaultImages;
  }

  /**
   * Transform tags from API response
   * @param tagsData - Raw tags data from API
   * @returns Array of tag name strings
   */
  static transformTags(tagsData: any): string[] {
    if (!Array.isArray(tagsData)) {
      return [];
    }

    return tagsData.map((tag: any) =>
      typeof tag === "string" ? tag : tag.name || "",
    );
  }

  /**
   * Transform members from API response
   * @param membersData - Raw members data from API
   * @returns Array of member objects with name and image
   */
  static transformMembers(
    membersData: any,
  ): Array<{ name: string; image: string }> {
    if (!Array.isArray(membersData) || membersData.length === 0) {
      return [];
    }

    return membersData.map((member: any) => {
      const firstName = member.firstName || "";
      const lastName = member.lastName || "";

      return {
        name: `${firstName} ${lastName}`.trim() || "Unknown",
        image: getAvatarUrl(member.avatar, firstName, lastName),
      };
    });
  }

  /**
   * Transform features from API response
   * @param featuresData - Raw features data from API
   * @returns Array of FeatureItem objects
   */
  static transformFeatures(featuresData: any): FeatureItem[] {
    if (!Array.isArray(featuresData)) {
      return [];
    }

    return featuresData.map((feature: any) => ({
      date: feature.date || new Date().toISOString().split("T")[0],
      name: feature.name || "",
      description: feature.description || "",
      icon: feature.icon || "",
      status: feature.status || "pending",
    }));
  }

  /**
   * Calculate project status based on features
   * @param features - Array of FeatureItem objects
   * @returns Project status ("Completed" | "In Progress")
   */
  static calculateStatus(
    features?: FeatureItem[],
  ): "Completed" | "In Progress" {
    if (!features || features.length === 0) {
      return "In Progress";
    }

    const allDone = features.every((feature) => feature.status === "done");
    return allDone ? "Completed" : "In Progress";
  }

  /**
   * Transform a single project from API response to frontend format
   * @param projectData - Raw project data from API
   * @returns Transformed Project object
   */
  static transformProject(projectData: any): Project {
    // Transform all related data
    const author = this.transformAuthor(projectData.author);
    const category = this.transformCategory(projectData.category);
    const images = this.transformImages(projectData.images);
    const tags = this.transformTags(projectData.tags);
    const members = this.transformMembers(projectData.members);
    const features = this.transformFeatures(projectData.features);
    const status = this.calculateStatus(features);

    // Build the complete project object
    return {
      id: projectData.id,
      name: projectData.name || "Untitled Project",
      description: projectData.description || projectData.decription || "",
      academicYear: projectData.academicYear
        ? projectData.academicYear.toString()
        : "",
      author,
      technologies: Array.isArray(projectData.technologies)
        ? projectData.technologies
        : [],
      category,
      status,
      featured: projectData.featured || projectData.isFeatured || false,
      likes: projectData.likes || projectData.likeCount || 0,
      views: projectData.views || projectData.viewCount || 0,
      demoUrl: projectData.demoUrl || "",
      githubUrl: projectData.githubUrl || projectData.repoUrl || "",
      images,
      createdAt:
        projectData.createdAt || new Date().toISOString().split("T")[0],
      tags,
      members,
      features,
      duration: projectData.duration || "",
      course:
        typeof projectData.course === "string"
          ? projectData.course
          : projectData.course?.name || "",
      visibility:
        projectData.visibility === "draft"
          ? "private"
          : projectData.visibility || "public",
      submissions: Array.isArray(projectData.submissions)
        ? projectData.submissions
        : [],
    };
  }

  /**
   * Transform multiple projects from API response
   * @param projectsData - Array of raw project data from API
   * @returns Array of transformed Project objects
   */
  static transformProjects(projectsData: any[]): Project[] {
    if (!Array.isArray(projectsData)) {
      return [];
    }

    return projectsData.map((project) => this.transformProject(project));
  }

  /**
   * Transform API response with pagination
   * @param response - API response containing projects and pagination data
   * @returns Object with transformed projects and pagination info
   */
  static transformApiResponse(response: any): {
    projects: Project[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      lastPage: number;
    };
  } {
    const projectsData = response.data || response.projects || response || [];
    const projects = this.transformProjects(projectsData);

    return {
      projects,
      pagination: {
        total: response.total || projects.length,
        page: response.page || 1,
        limit: response.limit || projects.length,
        lastPage: response.lastPage || 1,
      },
    };
  }
}

/**
 * Convenience functions for direct import
 */
export const transformProject = (data: any) =>
  ProjectTransformer.transformProject(data);
export const transformProjects = (data: any[]) =>
  ProjectTransformer.transformProjects(data);
export const calculateProjectStatus = (features?: FeatureItem[]) =>
  ProjectTransformer.calculateStatus(features);
