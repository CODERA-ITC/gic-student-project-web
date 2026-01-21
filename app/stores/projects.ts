import { defineStore } from "pinia";
import { any } from "zod";
import { useAuthStore } from "~/stores/auth";

import { projectsData } from "~/constants/projects";

// Types
export interface ProjectAuthor {
  name: string;
  avatar: string;
  program: string;
  year: string;
}

export interface FeatureItem {
  date?: string;
  name: string;
  description: string;
  icon: string;
  status: "pending" | "ongoing" | "done";
}

export interface Project {
  id?: string | number;
  name: string;
  description: string;
  departmentId?: "11111111-1111-1111-1111-111111111111"; // GIC Department ID
  academicYear?: string;
  author: ProjectAuthor;
  technologies: string[];
  category: string;
  status: "Completed" | "In Progress";
  featured: boolean;
  likes: number;
  views: number;
  demoUrl: string;
  githubUrl: string;
  images: string[];
  createdAt: string;
  tags: string[];
  members?: { name: string; image: string }[];
  features?: FeatureItem[];
  duration?: string;
  course?: string;
  visibility?: "public" | "private";
  submissions?: {
    id: number;
    name: string;
    date: string;
    status: string;
  }[];
}

export interface ProjectStats {
  total: number;
  completed: number;
  inProgress: number;
  totalLikes: number;
  totalViews: number;
  totalTeamMembers: number;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface ProjectState {
  projects: Project[];
  userProjects: Project[];
  availableCategories: string[];
  availableTags: string[];
  categoryObjects: any[]; // Store full category objects for ID lookup
  tagObjects: any[]; // Store full tag objects for ID lookup
  likedProjects: Set<string | number>;
  loading: boolean;
  pagination: PaginationState;
  nextProjectId: number; // Track next project ID independently
  filters: {
    categories: string[];
    search: string;
    tags: any[];
    year: string;
    sort: string;
  };
}

export const useProjectStore = defineStore("projects", {
  state: (): ProjectState => ({
    projects: [],
    userProjects: [],
    availableCategories: ["All"],
    availableTags: [],
    categoryObjects: [],
    tagObjects: [],
    likedProjects: new Set(),
    loading: false,
    nextProjectId: 1000, // Start user-created projects from 1000 to avoid conflicts
    pagination: {
      currentPage: 1,
      itemsPerPage: 9,
      totalItems: 0,
      totalPages: 0,
    },
    filters: {
      categories: ["All"],
      search: "",
      tags: [],
      year: "",
      sort: "recent",
    },
  }),

  getters: {
    getFeaturedProjects(): Partial<Project[]> {
      return this.projects.filter((project) => project.featured).slice(0, 3);
    },

    // Get real-time calculated status for a project based on its features
    getProjectStatus() {
      return (projectId: number): "Completed" | "In Progress" => {
        const project = this.projects.find((p) => p.id === projectId);
        if (!project) return "In Progress";

        // Always calculate status based on current features
        if (!project.features || project.features.length === 0) {
          return "In Progress";
        }

        const allDone = project.features.every(
          (feature) => feature.status === "done",
        );
        return allDone ? "Completed" : "In Progress";
      };
    },

    projectsByCategory(): Record<string, Partial<Project>[]> {
      // it will have a table that store all category
      const categoryMap: Record<string, Partial<Project>[]> = {};
      this.projects.forEach((project) => {
        if (!categoryMap[project.category]) {
          categoryMap[project.category] = [];
        }
        categoryMap[project.category].push(project);
      });
      return categoryMap;
    },

    getProjectFilterOptions(): any {
      // This method can be removed or repurposed
      // Tags are now handled by fetchTags() and availableTags
      return {
        tags: this.availableTags,
        categories: this.availableCategories,
      };
    },

    projectStats(): ProjectStats {
      return {
        total: this.projects.length,
        completed: this.projects.filter((p) => p.status === "Completed").length,
        inProgress: this.projects.filter((p) => p.status === "In Progress")
          .length,
        totalLikes: this.projects.reduce((sum, p) => sum + p.likes, 0),
        totalViews: this.projects.reduce((sum, p) => sum + p.views, 0),
        totalTeamMembers: this.projects.reduce(
          (sum, p) => sum + (p.members?.length || 0),
          0,
        ),
      };
    },
  },

  actions: {
    // Calculate project status based on features
    calculateProjectStatus(
      features?: FeatureItem[],
    ): "Completed" | "In Progress" {
      if (!features || features.length === 0) {
        return "In Progress";
      }

      // Check if all features are done
      const allDone = features.every((feature) => feature.status === "done");
      return allDone ? "Completed" : "In Progress";
    },

    // Simulate fetch project state
    // In real application, this would involve API calls
    // 1. fetch Category data from server

    async fetchFeaturedProjects(): Promise<Partial<Project[]>> {
      this.loading = true;
      try {
        // If projects array is already populated, just return featured ones
        if (this.projects.length > 0) {
          return this.projects.filter((project) => project.featured);
        }

        // Otherwise, fetch all projects first
        await this.fetchProjects();

        // Return featured projects
        return this.projects.filter((project) => project.featured);
      } catch (error) {
        console.error(
          "Error fetching featured projects, using fallback static data:",
          error,
        );
        // Fallback: fetch from static data and filter featured
        this.projects = projectsData;
        return projectsData.filter((project) => project.featured);
      } finally {
        this.loading = false;
      }
    },

    // Helper to get category ID by name
    getCategoryIdByName(categoryName: string): string | null {
      const category = this.categoryObjects.find(
        (cat: any) => cat.name === categoryName,
      );
      return category?.id || null;
    },

    // Helper to get tag ID by name
    getTagIdByName(tagName: string): string | null {
      const tag = this.tagObjects.find((t: any) => t.name === tagName);
      return tag?.id || null;
    },

    async fetchCategories(): Promise<string[]> {
      this.loading = true;
      try {
        // simulate network delay
        // await new Promise((resolve) => setTimeout(resolve, 100));
        // // return current categories (in a real app this would come from an API)

        const categoriesMock = [
          "All",
          "Artificial Intelligence",
          "Mobile Development",
          "Web Development",
          "Web",
          "Productivity",
          "Health Tech",
          "Data Science",
        ];
        const data = await fetch("/api/categories", {
          method: "GET",
        });

        console.log("Fetch categories response:", data);

        const categories = (await data.json()) || categoriesMock;

        console.log("Fetched categories:", categories);

        // const response = await fetch("/api/users/signup", {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify({
        //         firstname,
        //         lastname,
        //         email: email.trim().toLowerCase(),
        //         password,
        //         departmentCode: "GIC",
        //         bio: `${role} at
        // GIC`,
        //       }),
        //     });

        // Store full category objects for ID lookup, but also keep string names for compatibility
        this.categoryObjects = categories; // Store full objects

        // convert the array of object json to array of string for UI display
        let categoriesString: string[] = Array.from(
          new Set(
            categories.map((cat: any) =>
              typeof cat === "string" ? cat : cat.name,
            ),
          ),
        );

        return (this.availableCategories = categoriesString);
      } catch (error) {
        console.error("Error fetching categories, using fallback data:", error);
        // Fallback to mock categories on API failure
        const categoriesMock = [
          "All",
          "Artificial Intelligence",
          "Mobile Development",
          "Web Development",
          "Web",
          "Productivity",
          "Health Tech",
          "Data Science",
        ];
        this.categoryObjects = categoriesMock;
        this.availableCategories = categoriesMock;
        return categoriesMock;
      } finally {
        this.loading = false;
      }
    },

    async fetchTags(): Promise<string[]> {
      this.loading = true;
      try {
        // simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        // for label no need to create value because value will be same as label but in lowercase and replace space with hyphen
        const tagsMock = [
          "Web Development",
          "Mobile App",
          "AI/ML",
          "Data Science",
          "IoT",
          "Blockchain",
          "Machine Learning",
          "Artificial Intelligence",
          "Software Development",
          "Frontend",
          "Backend",
          "Full Stack",
        ];

        const data = await fetch("/api/tags", {
          method: "GET",
        });

        const response = await data.json();
        // Ensure tags is an array - handle different response structures
        let tags = Array.isArray(response)
          ? response
          : response?.data || response?.tags || tagsMock;

        // Fallback to tagsMock if tags is still not an array
        if (!Array.isArray(tags)) {
          console.warn(
            "Tags response is not an array, using mock data:",
            response,
          );
          tags = tagsMock;
        }

        // Store full tag objects for ID lookup
        this.tagObjects = tags;

        let tagsString: string[] = Array.from(
          new Set(
            tags.map((tag: any) => (typeof tag === "string" ? tag : tag.name)),
          ),
        );

        return (this.availableTags = tagsString);
      } catch (error) {
        console.error("Error fetching tags, using fallback data:", error);
        // Fallback to mock tags on API failure
        const tagsMock = [
          "Web Development",
          "Mobile App",
          "AI/ML",
          "Data Science",
          "IoT",
          "Blockchain",
          "Machine Learning",
          "Artificial Intelligence",
          "Software Development",
          "Frontend",
          "Backend",
          "Full Stack",
        ];
        this.tagObjects = tagsMock;
        this.availableTags = tagsMock;
        return tagsMock;
      } finally {
        this.loading = false;
      }
    },

    // 2. fetch Projects data from server

    async fetchProjects(includePrivate = false): Promise<Project[]> {
      this.loading = true;
      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: this.pagination.currentPage.toString(),
          limit: this.pagination.itemsPerPage.toString(),
        });

        // Add search parameter if exists
        if (this.filters.search) {
          params.append("search", this.filters.search);
        }

        // Add category filter if not "All"
        if (
          this.filters.categories.length > 0 &&
          !this.filters.categories.includes("All")
        ) {
          params.append("category", this.filters.categories.join(","));
        }

        // Add tags filter if exists
        if (this.filters.tags.length > 0) {
          params.append("tags", this.filters.tags.join(","));
        }

        // Add year filter if exists
        if (this.filters.year) {
          params.append("year", this.filters.year);
        }

        // Add sort parameter
        if (this.filters.sort) {
          params.append("sort", this.filters.sort);
        }

        // Add visibility parameter
        if (includePrivate) {
          params.append("includePrivate", "true");
        }

        // Fetch from API using proxy
        const data = await fetch(`/api/projects?${params.toString()}`, {
          method: "GET",
        });

        console.log("Fetch projects response:", data);

        const response = await data.json();

        console.log("Fetched projects:", response);

        // API returns { data: Project[], total: number, page: number, limit: number, lastPage: number }
        let apiProjects = response.data || response.projects || response || [];

        // Transform API data to match frontend Project interface
        let projects: Project[] = await Promise.all(
          apiProjects.map(async (project: any) => {
            // Transform author data
            const author: ProjectAuthor = {
              name: project.author
                ? `${project.author.firstName || ""} ${project.author.lastName || ""}`.trim()
                : "Unknown",
              avatar: project.author?.avatar || DEFAULT_AVATAR_URL,
              program: project.author?.program || "",
              year: project.author?.year || "",
            };

            // Transform category (from object to string)
            const category = project.category.name || "Uncategorized";

            // Transform images - fetch full URLs from backend
            const imagesObj = Array.isArray(project.images)
              ? project.images.map((img: any) =>
                  typeof img === "string" ? img : img.id || "",
                )
              : [];

            let images: string[] = [];

            for (const imgId of imagesObj) {
              try {
                const imgData = await fetch(`/api/image/${imgId}`);
                const imgJson = await imgData.json();
                images.push(imgJson.thumbnailUrl || imgJson.originalUrl || "");
              } catch (error) {
                console.error("Error fetching image:", error);
              }
            }

            // Transform tags (from array of objects to array of strings)
            const tags = Array.isArray(project.tags)
              ? project.tags.map((tag: any) =>
                  typeof tag === "string" ? tag : tag.name || "",
                )
              : [];

            // Transform members (map to simpler structure)
            const members =
              Array.isArray(project.members) && project.members.length > 0
                ? project.members.map((member: any) => ({
                    name: `${member.firstName || ""} ${member.lastName || ""}`.trim(),
                    image:
                      member.avatar ||
                      "https://randomuser.me/api/portraits/women/50.jpg",
                  }))
                : [
                    {
                      name: "Sarah Chen",
                      image: "https://randomuser.me/api/portraits/women/11.jpg",
                    },
                    {
                      name: "Alex Park",
                      image: "https://randomuser.me/api/portraits/men/32.jpg",
                    },
                    {
                      name: "Jordan Lee",
                      image: "https://randomuser.me/api/portraits/men/54.jpg",
                    },
                    {
                      name: "Emma Davis",
                      image: "https://randomuser.me/api/portraits/women/78.jpg",
                    },
                  ];

            // Transform features (ensure proper structure)
            const features: FeatureItem[] = Array.isArray(project.features)
              ? project.features.map((feature: any) => ({
                  date: feature.date || new Date().toISOString().split("T")[0],
                  name: feature.name || "",
                  description: feature.description || "",
                  icon: feature.icon || "",
                  status: feature.status || "pending",
                }))
              : [];

            // Calculate status based on features
            const status = this.calculateProjectStatus(features);

            return {
              id: project.id,
              name: project.name || "Untitled Project",
              description: project.description || project.decription || "",
              academicYear: project.academicYear
                ? project.academicYear.toString()
                : "",
              author,
              technologies: project.technologies || [],
              category,
              status,
              featured: project.featured || project.isFeatured || false,
              likes: project.likes || project.likeCount || 0,
              views: project.views || project.viewCount || 0,
              demoUrl: project.demoUrl || "",
              githubUrl: project.githubUrl || project.repoUrl || "",
              images,
              createdAt:
                project.createdAt || new Date().toISOString().split("T")[0],
              tags,
              members,
              features,
              duration: project.duration || "",
              course: project.course || "",
              visibility:
                project.visibility === "draft"
                  ? "private"
                  : project.visibility || "public",
              submissions: project.submissions || [],
            };
          }),
        );

        this.projects = projects;

        // Update pagination state from API response
        this.pagination.totalItems = response.total || projects.length;
        this.pagination.totalPages = Math.ceil(
          this.pagination.totalItems / this.pagination.itemsPerPage,
        );
        this.pagination.currentPage =
          response.page || this.pagination.currentPage;

        // // Update nextProjectId to be higher than any existing project ID
        // if (projects.length > 0) {
        //   const maxId = Math.max(...projects.map((p) => p.id || 0), 999);
        //   this.nextProjectId = maxId + 1;
        // }

        return projects;
      } catch (error) {
        console.error(
          "Error fetching projects, using fallback static data:",
          error,
        );

        // Fallback to static projects data from constants
        this.projects = projectsData;
        this.pagination.totalItems = projectsData.length;
        this.pagination.totalPages = Math.ceil(
          projectsData.length / this.pagination.itemsPerPage,
        );

        return projectsData;
      } finally {
        this.loading = false;
      }
    },

    async likeProject(projectId: number | string): Promise<boolean> {
      // Import auth store dynamically to avoid circular imports
      const authStore = useAuthStore();

      // Check if user is authenticated
      if (!authStore.isAuthenticated || !authStore.user || !authStore.token) {
        console.warn("User must be authenticated to like projects");
        return false;
      }

      const project = this.projects.find(
        (p) => p.id?.toString() === projectId.toString(),
      );
      if (!project) {
        console.warn("Project not found");
        return false;
      }

      try {
        // Toggle like on backend
        const response = await fetch(`/api/projects/${projectId}/like`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to toggle like");
        }

        const data = await response.json();
        const isNowLiked = data.liked;

        // Update local state based on API response
        if (isNowLiked) {
          project.likes++;
          this.likedProjects.add(projectId);
        } else {
          if (project.likes > 0) {
            project.likes--;
          }
          this.likedProjects.delete(projectId);
        }

        // Save to localStorage
        await this.saveUserLikedProjects();

        return isNowLiked;
      } catch (error) {
        console.error("Error toggling like:", error);
        return false;
      }
    },

    async getProjectLikeCount(projectId: string | number): Promise<number> {
      try {
        const response = await fetch(`/api/projects/${projectId}/like-count`, {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          return data.likeCount || 0;
        }
      } catch (error) {
        console.error("Error fetching like count:", error);
      }
      return 0;
    },

    async hasUserLikedProject(projectId: string | number): Promise<boolean> {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (!token) return false;

        const response = await fetch(`/api/projects/${projectId}/has-liked`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const hasLiked = data.hasLiked || false;

          // Update local state
          if (hasLiked) {
            this.likedProjects.add(projectId);
          } else {
            this.likedProjects.delete(projectId);
          }

          return hasLiked;
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
      return false;
    },

    // Check if a project is liked by current user
    isProjectLiked(projectId: number | string): boolean {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return false;
      return this.likedProjects.has(projectId);
    },

    // Load user's liked projects (would be from backend in real app)
    async loadUserLikedProjects(): Promise<void> {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated || !authStore.user) {
        this.likedProjects.clear();
        return;
      }

      // In real app, fetch from backend based on user ID
      // const userLikes = await api.getUserLikedProjects(authStore.user.id);
      // this.likedProjects = new Set(userLikes);

      // For now, simulate loading from localStorage with user-specific key
      if (typeof window !== "undefined") {
        const key = `likedProjects_${authStore.user.id}`;
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              this.likedProjects = new Set(parsed);
              console.log(
                `📚 Loaded ${parsed.length} liked project(s) for user ${authStore.user.name}`,
              );
            }
          } else {
            console.log(
              `📚 No liked projects found for user ${authStore.user.name}`,
            );
          }
        } catch (error) {
          console.warn("Error loading user liked projects:", error);
          this.likedProjects.clear();
        }
      }
    },

    // Save user's liked projects (would sync with backend in real app)
    async saveUserLikedProjects(): Promise<void> {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated || !authStore.user) return;

      // In real app, sync with backend
      // await api.saveUserLikedProjects(authStore.user.id, Array.from(this.likedProjects));

      // For now, save to localStorage with user-specific key
      if (typeof window !== "undefined") {
        const key = `likedProjects_${authStore.user.id}`;
        try {
          localStorage.setItem(
            key,
            JSON.stringify(Array.from(this.likedProjects)),
          );
          console.log(
            `💾 Saved ${this.likedProjects.size} liked project(s) for user ${authStore.user.name}`,
          );
        } catch (error) {
          console.warn("Error saving user liked projects:", error);
        }
      }
    },

    // Clear liked projects (call when user logs out)
    clearUserLikedProjects(): void {
      this.likedProjects.clear();
    },

    // Pagination methods
    setCurrentPage(page: number): void {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.pagination.currentPage = page;
      }
    },

    nextPage(): void {
      if (this.pagination.currentPage < this.pagination.totalPages) {
        this.pagination.currentPage++;
      }
    },

    prevPage(): void {
      if (this.pagination.currentPage > 1) {
        this.pagination.currentPage--;
      }
    },

    updatePaginationForFilteredProjects(filteredCount: number): void {
      this.pagination.totalItems = filteredCount;
      this.pagination.totalPages = Math.ceil(
        filteredCount / this.pagination.itemsPerPage,
      );

      // Reset to first page if current page is beyond available pages
      if (this.pagination.currentPage > this.pagination.totalPages) {
        this.pagination.currentPage = 1;
      }
    },

    getPaginatedProjects(filteredProjects: Project[]): Project[] {
      const start =
        (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
      const end = start + this.pagination.itemsPerPage;
      return filteredProjects.slice(start, end);
    },

    resetPagination(): void {
      this.pagination.currentPage = 1;
    },

    async incrementViews(projectId: string | number): Promise<void> {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (!token) {
          console.warn("User not authenticated, skipping view tracking");
          return;
        }

        // Track view on backend
        const response = await fetch(`/api/projects/${projectId}/view`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log("✅ View tracked successfully on backend");

          // Update local state
          const project = this.projects.find(
            (p) => p.id?.toString() === projectId.toString(),
          );
          if (project) {
            project.views++;
          }
        }
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    },

    async getProjectViewCount(projectId: string | number): Promise<number> {
      try {
        const response = await fetch(`/api/projects/${projectId}/view-count`, {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          return data.viewCount || 0;
        }
      } catch (error) {
        console.error("Error fetching view count:", error);
      }
      return 0;
    },

    async hasUserViewedProject(projectId: string | number): Promise<boolean> {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (!token) return false;

        const response = await fetch(`/api/projects/${projectId}/has-viewed`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          return data.hasViewed || false;
        }
      } catch (error) {
        console.error("Error checking view status:", error);
      }
      return false;
    },

    async getProject(id: number | string): Promise<Project | undefined> {
      // Try to fetch from API first
      try {
        const project = await this.fetchProjectById(id);
        if (project) return project;
      } catch (error) {
        console.warn(
          "Failed to fetch project from API, checking local store:",
          error,
        );
      }

      // Fallback to local store
      return this.projects.find(
        (project) => project.id?.toString() === id.toString(),
      );
    },

    async fetchProjectById(id: number | string): Promise<Project | null> {
      this.loading = true;
      try {
        // Fetch from API using proxy
        const data = await fetch(`/api/projects/${id}`, {
          method: "GET",
        });

        if (!data.ok) {
          throw new Error(`Failed to fetch project: ${data.statusText}`);
        }

        const response = await data.json();

        console.log("Fetched project details:", response);

        // API might return { data: Project } or just Project
        const project = response.data || response;

        if (!project) {
          return null;
        }

        // Transform author data
        const author: ProjectAuthor = {
          name: project.author
            ? `${project.author.firstName || ""} ${project.author.lastName || ""}`.trim()
            : "Mr. Test ",
          avatar: project.author?.avatar || DEFAULT_AVATAR_URL,
          program: project.author?.program || "Computer Science",
          year: project.author?.year || "4th Year",
        };

        /*   author: {
      name: "Mr. Test",
      avatar: "https://randomuser.me/api/portraits/women/50.jpg",
      program: "Computer Science",
      year: "4th Year",
    },
    */
        // Transform category (from object to string)
        const category =
          typeof project.category === "object"
            ? project.category?.name || "Other"
            : project.category || "Other";

        // Transform images - fetch full URLs from backend
        const imagesObj = Array.isArray(project.images)
          ? project.images.map((img: any) =>
              typeof img === "string" ? img : img.id || "",
            )
          : [];

        let images: string[] = [];

        for (const imgId of imagesObj) {
          try {
            const imgData = await fetch(`/api/image/${imgId}`);
            const imgJson = await imgData.json();
            images.push(imgJson.thumbnailUrl || imgJson.originalUrl || "");
          } catch (error) {
            console.error("Error fetching image:", error);
          }
        }

        // Transform tags (from array of objects to array of strings)
        const tags = Array.isArray(project.tags)
          ? project.tags.map((tag: any) =>
              typeof tag === "string" ? tag : tag.name || "",
            )
          : [];

        // Transform members (map to simpler structure)
        const members = Array.isArray(project.members)
          ? project.members.map((member: any) => ({
              name: `${member.firstName || ""} ${member.lastName || ""}`.trim(),
              image: member.avatar || DEFAULT_AVATAR_URL,
            }))
          : [];

        // Transform features (ensure proper structure)
        const features: FeatureItem[] = Array.isArray(project.features)
          ? project.features.map((feature: any) => ({
              date: feature.date || new Date().toISOString().split("T")[0],
              name: feature.name || "",
              description: feature.description || "",
              icon: feature.icon || "",
              status: feature.status || "pending",
            }))
          : [];

        // Calculate status based on features
        const status = this.calculateProjectStatus(features);

        const transformedProject: Project = {
          id: project.id,
          name: project.title || project.name || "Untitled Project",
          description: project.description || project.decription,
          academicYear: project.academicYear
            ? project.academicYear.toString()
            : "",
          author,
          technologies: project.technologies || [],
          category,
          status,
          featured: project.featured || project.isFeatured || false,
          likes: project.likes || project.likeCount || 0,
          views: project.views || project.viewCount || 0,
          demoUrl: project.demoUrl || "",
          githubUrl: project.githubUrl || project.repoUrl || "",
          images,
          createdAt:
            project.createdAt || new Date().toISOString().split("T")[0],
          tags,
          members,
          features,
          duration: project.duration || "",
          course: project.course || "",
          visibility:
            project.visibility === "draft"
              ? "private"
              : project.visibility || "public",
          submissions: project.submissions || [],
        };

        // Update local store if project exists, otherwise add it
        const existingIndex = this.projects.findIndex(
          (p) => p.id === transformedProject.id,
        );
        if (existingIndex !== -1) {
          this.projects[existingIndex] = transformedProject;
        } else {
          this.projects.push(transformedProject);
        }

        return transformedProject;
      } catch (error) {
        console.error("Error fetching project by ID:", error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    getProjectsByAuthor(authorName: string): Project[] {
      return this.projects.filter((project) =>
        project.author.name.toLowerCase().includes(authorName.toLowerCase()),
      );
    },

    searchProjects(query: string) {
      if (!query.trim()) return [];

      const searchTerm = query.toLowerCase();
      const results: Array<{
        type: "category" | "name" | "description";
        icon: string;
        value: string;
        label: string;
        subtitle: string;
        count?: number;
        category?: string;
      }> = [];
      const addedItems = new Set<string>();

      // Search categories
      this.filters.categories.forEach((category) => {
        if (category.toLowerCase().includes(searchTerm) && category !== "All") {
          const key = `category-${category}`;
          if (!addedItems.has(key)) {
            addedItems.add(key);
            results.push({
              type: "category",
              icon: "i-heroicons-folder-20-solid",
              value: category,
              label: category,
              subtitle: "Category",
              count: this.projects.filter((p) => p.category === category)
                .length,
            });
          }
        }
      });

      // Search project titles
      this.projects.forEach((project) => {
        if (project.name.toLowerCase().includes(searchTerm)) {
          const key = `name-${project.name}`;
          if (!addedItems.has(key) && results.length < 10) {
            addedItems.add(key);
            results.push({
              type: "name",
              icon: "i-heroicons-document-text-20-solid",
              value: project.name,
              label: project.name,
              subtitle: "Project Title",
              category: project.category,
            });
          }
        }
      });

      // Search project descriptions
      this.projects.forEach((project) => {
        if (project.description.toLowerCase().includes(searchTerm)) {
          const key = `desc-${project.name}`;
          if (!addedItems.has(key) && results.length < 10) {
            addedItems.add(key);
            results.push({
              type: "description",
              icon: "i-heroicons-chat-bubble-left-right-20-solid",
              value: project.name,
              label: project.name,
              subtitle: `"${project.description.substring(0, 50)}..."`,
              category: project.category,
            });
          }
        }
      });

      return results.slice(0, 8);
    },

    // Filter management methods
    setFilter(key: keyof ProjectState["filters"], value: any): void {
      this.filters[key] = value;
      this.pagination.currentPage = 1; // Reset to first page when filters change
    },

    clearFilters(): void {
      this.filters = {
        categories: ["All"],
        search: "",
        tags: [],
        year: "",
        sort: "recent",
      };
      this.resetPagination();
    },

    getFilteredProjects(): Partial<Project[]> {
      let filtered = [...this.projects];

      // Filter by category
      if (this.filters.categories && !this.filters.categories.includes("All")) {
        filtered = filtered.filter((p) =>
          this.filters.categories.includes(p.category),
        );
      }

      // Filter by search
      if (this.filters.search.trim()) {
        const search = this.filters.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search),
        );
      }

      // Filter by tags
      if (this.filters.tags.length > 0) {
        filtered = filtered.filter((p) =>
          p.tags?.some((tag) => this.filters.tags.includes(tag)),
        );
      }

      // Filter by year
      if (this.filters.year) {
        filtered = filtered.filter((p) => {
          const year = p.academicYear?.match(/\d{4}/)?.[0];
          return year === this.filters.year;
        });
      }

      // Apply sorting
      return this.applySorting(filtered);
    },

    applySorting(projects: Project[]): Project[] {
      const sorted = [...projects];

      switch (this.filters.sort) {
        case "oldest":
          return sorted.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
        case "liked":
          return sorted.sort((a, b) => b.likes - a.likes);
        case "viewed":
          return sorted.sort((a, b) => b.views - a.views);
        case "recent":
        default:
          return sorted.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
      }
    },

    getPaginatedFilteredProjects(): Partial<Project[]> {
      const filtered = this.getFilteredProjects();
      const start =
        (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
      const end = start + this.pagination.itemsPerPage;

      // Update pagination totals
      this.pagination.totalItems = filtered.length;
      this.pagination.totalPages = Math.ceil(
        filtered.length / this.pagination.itemsPerPage,
      );

      return filtered.slice(start, end);
    },

    // Create new project
    async createProject(
      projectData: Omit<Project, "id" | "createdAt" | "likes" | "views">,
    ): Promise<Project> {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (!token || !authStore.user) {
          throw new Error("User must be authenticated to create projects");
        }

        // Prepare form data for API
        const formData = new FormData();

        // Required fields
        formData.append("name", projectData.name || "");
        formData.append("description", projectData.description || "");

        // Category - lookup ID from category name
        if (projectData.category) {
          const categoryObj = this.categoryObjects.find(
            (cat: any) => cat.name === projectData.category,
          );
          const categoryId = categoryObj?.id || projectData.category;
          formData.append("categoryId", categoryId);
        }

        // Technologies array - JSON stringify
        if (projectData.technologies && projectData.technologies.length > 0) {
          formData.append(
            "technologies",
            JSON.stringify(projectData.technologies),
          );
        }

        // Tags array - lookup IDs from tag names and JSON stringify
        if (projectData.tags && projectData.tags.length > 0) {
          const tagIds = projectData.tags.map((tagName: string) => {
            const tagObj = this.tagObjects.find((t: any) => t.name === tagName);
            return tagObj?.id || tagName;
          });
          formData.append("tags", JSON.stringify(tagIds));
        }

        // Features array - JSON stringify
        if (projectData.features && projectData.features.length > 0) {
          formData.append("features", JSON.stringify(projectData.features));
        }

        // URLs
        if (projectData.demoUrl) {
          formData.append("demoUrl", projectData.demoUrl);
        }
        if (projectData.githubUrl) {
          formData.append("repoUrl", projectData.githubUrl);
        }

        // Author ID (required)
        if (!authStore.user?.id) {
          throw new Error("User ID is required to create a project");
        }
        formData.append("authorId", authStore.user.id);

        // Department ID (required)
        if (!authStore.user?.departmentId) {
          throw new Error("Department ID is required to create a project");
        }
        formData.append("departmentId", authStore.user.departmentId);

        // Members IDs - extract IDs and JSON stringify as array
        if (projectData.members && projectData.members.length > 0) {
          const memberIds = projectData.members
            .map((m: any) => m.id)
            .filter(Boolean);
          if (memberIds.length > 0) {
            formData.append("membersIds", JSON.stringify(memberIds));
          }
        }

        // Academic year
        if (projectData.academicYear) {
          formData.append("academicYear", projectData.academicYear.toString());
        }

        // Start date - format as ISO string
        formData.append("startDate", new Date().toISOString());

        // Images/files - if they exist in projectData
        if (projectData.images && Array.isArray(projectData.images)) {
          projectData.images.forEach((image: any) => {
            if (image instanceof File) {
              formData.append("files", image);
            } else if (image instanceof Blob) {
              formData.append("files", image);
            }
          });
        }

        console.log(
          "Creating project with data:",
          Object.fromEntries(formData.entries()),
        );

        // Call API
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData - browser will set it with boundary
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to create project: ${response.statusText}`,
          );
        }

        const data = await response.json();
        console.log("✅ Project created successfully:", data);

        // Transform API response to Project interface
        const apiProject = data.data || data;

        const newProject: Project = {
          id: apiProject.id,
          name: apiProject.name || apiProject.title || "",
          departmentId: apiProject.departmentId || "",
          description: apiProject.description || "",
          academicYear: apiProject.academicYear?.toString() || "",
          author: {
            name:
              authStore.user.name ||
              `${authStore.user.firstName} ${authStore.user.lastName}`,
            avatar: authStore.user.avatar || DEFAULT_AVATAR_URL,
            program: authStore.user.program || "",
            year: authStore.user.year || "",
          },
          technologies: apiProject.technologies || [],
          category:
            typeof apiProject.category === "object"
              ? apiProject.category.name
              : apiProject.category || "Other",
          status: this.calculateProjectStatus(apiProject.features || []),
          featured: apiProject.featured || apiProject.isFeatured || false,
          likes: apiProject.likes || apiProject.likeCount || 0,
          views: apiProject.views || apiProject.viewCount || 0,
          demoUrl: apiProject.demoUrl || "",
          githubUrl: apiProject.githubUrl || apiProject.repoUrl || "",
          images:
            apiProject.images?.map((img: any) =>
              typeof img === "string" ? img : img.url || "",
            ) || [],
          createdAt:
            apiProject.createdAt || new Date().toISOString().split("T")[0],
          tags:
            apiProject.tags?.map((tag: any) =>
              typeof tag === "string" ? tag : tag.name || "",
            ) || [],
          members:
            apiProject.members?.map((member: any) => ({
              name: `${member.firstName || ""} ${member.lastName || ""}`.trim(),
              image: member.avatar || DEFAULT_AVATAR_URL,
            })) || [],
          features: apiProject.features || [],
          duration: apiProject.duration || "",
          course: apiProject.course || "",
          visibility:
            apiProject.visibility === "draft"
              ? "private"
              : apiProject.visibility || "public",
          submissions: apiProject.submissions || [],
        };

        // Add to local store
        this.projects.unshift(newProject);
        this.userProjects.unshift(newProject);

        // Update pagination
        this.pagination.totalItems = this.projects.length;
        this.pagination.totalPages = Math.ceil(
          this.projects.length / this.pagination.itemsPerPage,
        );

        return newProject;
      } catch (error) {
        console.error("Error creating project:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch user's projects
    async fetchUserProjects(): Promise<void> {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        if (!authStore.user) {
          throw new Error("User not authenticated");
        }

        // In real app, this would be an API call
        // Filter existing projects by author to show only user-created projects

        if (!authStore.isAuthenticated || !authStore.user) {
          console.warn("User not authenticated, cannot fetch user projects");
        }

        const response = await fetch("/api/projects/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user projects from API");
        } else {
          console.log("Fetched user projects from API");
        }

        // this.userProjects = this.projects.filter(
        //   (project) => project.author?.name === authStore.user?.name,
        // );

        const dataJson = await response.json();
        this.userProjects = dataJson;

        console.log("User projects loaded:", this.userProjects);
      } catch (error) {
        console.error("Failed to fetch user projects:", error);
      } finally {
        this.loading = false;
      }
    },

    // Get project by ID (works for both public and user projects)
    async getProjectById(id: string): Promise<Project | null> {
      // First try to find in user projects

      // This should handle fetch project from api for user projects as well

      // let project = this.userProjects.find(
      //   (p) => p.id === parseInt(id.toString()),
      // );

      let project = await this.fetchProjectById(id);
      console.log("getProjectById fetched for user project:", project);

      // If not found, try in all projects
      if (!project) {
        project = this.projects.find((p) => p.id === parseInt(id.toString()));
      }

      return project || null;
    },

    // Update project status
    async updateProjectStatus(
      projectId: number,
      status: string,
    ): Promise<void> {
      // Update in user projects
      const userProject = this.userProjects.find((p) => p.id === projectId);
      if (userProject) {
        userProject.status = status as any;
      }

      // Update in all projects
      const project = this.projects.find((p) => p.id === projectId);
      if (project) {
        project.status = status as any;
      }

      // In real app, sync with backend
      // await api.updateProjectStatus(projectId, status);
    },

    // Update project visibility (for teachers)
    async updateProjectVisibility(
      projectId: number,
      visibility: "public" | "private",
    ): Promise<void> {
      // Update in user projects
      const userProject = this.userProjects.find((p) => p.id === projectId);
      if (userProject) {
        userProject.visibility = visibility;
      }

      // Update in all projects
      const project = this.projects.find((p) => p.id === projectId);
      if (project) {
        project.visibility = visibility;
      }

      // In real app, sync with backend
      // await api.updateProjectVisibility(projectId, visibility);
    },

    // Update project fields
    async updateProject(
      projectId: number,
      updates: Partial<Project>,
    ): Promise<Project> {
      console.log("UpdateProject called with:", {
        projectId,
        projectIdType: typeof projectId,
        hasUpdates: !!updates,
        totalProjects: this.projects.length,
        projectIds: this.projects.map((p) => p.id),
      });

      // Ensure projectId is a number
      const numericProjectId =
        typeof projectId === "string" ? parseInt(projectId) : projectId;

      // If features are being updated, recalculate status
      if (updates.features) {
        updates.status = this.calculateProjectStatus(updates.features);
      }

      let updated = false;

      // Update in user projects
      const userProjectIndex = this.userProjects.findIndex(
        (p) => p.id === numericProjectId,
      );
      if (userProjectIndex !== -1) {
        this.userProjects[userProjectIndex] = {
          ...this.userProjects[userProjectIndex],
          ...updates,
        };
        // Recalculate status if not explicitly set and features exist
        if (!updates.status && this.userProjects[userProjectIndex].features) {
          this.userProjects[userProjectIndex].status =
            this.calculateProjectStatus(
              this.userProjects[userProjectIndex].features,
            );
        }
        updated = true;
      }

      // Update in all projects
      const projectIndex = this.projects.findIndex(
        (p) => p.id === numericProjectId,
      );
      if (projectIndex !== -1) {
        this.projects[projectIndex] = {
          ...this.projects[projectIndex],
          ...updates,
        };
        // Recalculate status if not explicitly set and features exist
        if (!updates.status && this.projects[projectIndex].features) {
          this.projects[projectIndex].status = this.calculateProjectStatus(
            this.projects[projectIndex].features,
          );
        }
        updated = true;
      }

      if (!updated) {
        console.error("Project not found in any array:", {
          projectId: numericProjectId,
          userProjects: this.userProjects.map((p) => p.id),
          allProjects: this.projects.map((p) => p.id),
        });
        throw new Error(`Project with ID ${numericProjectId} not found`);
      }

      // In real app, sync with backend
      // await api.updateProject(numericProjectId, updates);

      // Save to localStorage
      // this.saveUserCreatedProjects();

      // Return the updated project
      const updatedProject =
        this.projects.find((p) => p.id === numericProjectId) ||
        this.userProjects.find((p) => p.id === numericProjectId);

      if (!updatedProject) {
        throw new Error(
          `Project with ID ${numericProjectId} not found after update`,
        );
      }

      console.log("Project updated successfully:", updatedProject.id);
      return updatedProject;
    },

    // Delete project
    async deleteProject(projectId: number): Promise<boolean> {
      try {
        // Remove from projects array
        const projectIndex = this.projects.findIndex((p) => p.id === projectId);
        if (projectIndex !== -1) {
          this.projects.splice(projectIndex, 1);
        }

        // Remove from userProjects array
        const userProjectIndex = this.userProjects.findIndex(
          (p) => p.id === projectId,
        );
        if (userProjectIndex !== -1) {
          this.userProjects.splice(userProjectIndex, 1);
        }

        // Update pagination
        this.pagination.totalItems = this.projects.length;
        this.pagination.totalPages = Math.ceil(
          this.projects.length / this.pagination.itemsPerPage,
        );

        // Save to localStorage
        // this.saveUserCreatedProjects();

        // In real app, sync with backend
        // await api.deleteProject(projectId);

        return true;
      } catch (error) {
        console.error("Failed to delete project:", error);
        return false;
      }
    },

    // Submit project for review (add to submissions)
    async submitProjectForReview(projectId: number): Promise<boolean> {
      try {
        // Find project in user projects
        const userProject = this.userProjects.find((p) => p.id === projectId);
        if (!userProject) {
          console.error("Project not found in user projects");
          return false;
        }

        // Initialize submissions array if it doesn't exist
        if (!userProject.submissions) {
          userProject.submissions = [];
        }

        // Check if already submitted
        const alreadySubmitted = userProject.submissions.some(
          (sub) => sub.id === projectId,
        );
        if (alreadySubmitted) {
          console.warn("Project already submitted");
          return false;
        }

        // Add new submission
        const newSubmission = {
          id: projectId,
          name: userProject.name,
          date: new Date().toISOString(),
          status: "Under Review",
        };
        userProject.submissions.push(newSubmission);

        // Also update in all projects if it exists there
        const project = this.projects.find((p) => p.id === projectId);
        if (project) {
          if (!project.submissions) {
            project.submissions = [];
          }
          project.submissions.push(newSubmission);
        }

        // Save to localStorage
        // this.saveUserCreatedProjects();

        // In real app, sync with backend
        // await api.submitProject(projectId);

        return true;
      } catch (error) {
        console.error("Failed to submit project:", error);
        return false;
      }
    },

    // // Get next available project ID
    // getNextProjectId(): number {
    //   return Math.max(...this.projects.map((p) => p.id)) + 1;
    // },
  },
});
