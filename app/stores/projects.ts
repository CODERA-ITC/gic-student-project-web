import { defineStore } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { getAvatarUrl } from "~/utils/avatar";
import { projectService } from "~/services/ProjectService";
import type {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectFilters,
} from "~/services/ProjectService";

import { projectsData } from "~/constants/projects";

// Types

export const useProjectStore = defineStore("projects", {
  state: (): ProjectState => ({
    projects: [],
    userProjects: [],
    availableCategories: ["All"],
    availableTags: [],
    categoryObjects: [],
    tagObjects: [],
    availableCourses: [],
    courseObjects: [],
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
    getProjectStatus() {
      return (features?: FeatureItem[]): "Completed" | "In Progress" => {
        if (!features || features.length === 0) {
          return "In Progress";
        }

        // Check if all features are done
        const allDone = features.every((feature) => feature.status === "done");
        return allDone ? "Completed" : "In Progress";
      };
    },

    getFeaturedProjects(): Partial<Project[]> {
      return this.projects.filter((project) => project.featured).slice(0, 3);
    },

    getCourseIdByName() {
      return (courseName: string): string | null => {
        return (
          this.courseObjects.find((course) => course.name === courseName)?.id ||
          null
        );
      };
    },

    getCategoryIdByName() {
      return (categoryName: string): string | null => {
        return (
          this.categoryObjects.find(
            (category) => category.name === categoryName,
          )?.id || null
        );
      };
    },
    // Get real-time calculated status for a project based on its features

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
      return calculateProjectStatus(features);
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
        const categories = await $fetch("/api/categories", {
          method: "GET",
        }).catch(() => categoriesMock);

        console.log("Fetch categories response:", categories);

        console.log("Fetched categories:", categories);

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

      const response = await $fetch("/api/tags");

      // Ensure tags is an array - handle different response structures

      let tags = (await response).data || [];

      // Store full tag objects for ID lookup

      this.tagObjects = tags;
      let tagsString: string[] = tags.map((tag: any) => tag.name);
      this.loading = false;

      return (this.availableTags = tagsString);
    },

    // 2. fetch Projects data from server

    async fetchProjects(
      currentPage?: number,
      itemsPerPage?: number,
    ): Promise<Project[]> {
      this.loading = true;
      try {
        // Use provided params or fall back to state
        const page = currentPage ?? this.pagination.currentPage;
        const limit = itemsPerPage ?? this.pagination.itemsPerPage;

        // Build filters object
        const filters: ProjectFilters = {
          page,
          limit,
          search: this.filters.search || undefined,
          tags: this.filters.tags.length > 0 ? this.filters.tags : undefined,
          year: this.filters.year || undefined,
          sort: this.filters.sort || undefined,
        };

        // Add category filter if not "All"
        if (
          this.filters.categories.length > 0 &&
          !this.filters.categories.includes("All")
        ) {
          filters.categoryId = this.filters.categories.join(",");
        }

        // Use ProjectService to fetch
        const response = await projectService.fetchAll(filters);

        console.log("Fetch projects response:", response);

        // Transform API response using ProjectTransformer
        const { projects, pagination } =
          ProjectTransformer.transformApiResponse(response);

        this.projects = projects;

        // Update pagination state from API response
        this.pagination.totalItems = pagination.total;
        this.pagination.totalPages = pagination.lastPage;
        this.pagination.currentPage =
          pagination.page || this.pagination.currentPage;

        console.log("Pagination state:", JSON.stringify(this.pagination));

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
        console.warn("❌ User must be authenticated to like projects");
        return false;
      }

      // Validate token before making request
      if (!authStore.isTokenValid()) {
        console.error("❌ Token is invalid or expired. Please log in again.");
        // Show notification to user (you can add a toast/notification here)
        alert("Your session has expired. Please log in again.");
        // Optionally logout and redirect
        await authStore.logout();
        return false;
      }

      const project = this.projects.find(
        (p) => p.id?.toString() === projectId.toString(),
      );
      if (!project) {
        console.warn("❌ Project not found:", projectId);
        return false;
      }

      try {
        // Decode token to show payload (for debugging)
        const decoded = authStore.decodeJWT(authStore.token!);

        // Use ProjectService to toggle like
        const data = await projectService.toggleLike(projectId.toString());
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
        console.error("❌ Error toggling like:", error);
        return false;
      }
    },

    async getProjectLikeCount(projectId: string | number): Promise<number> {
      try {
        return await projectService.getLikeCount(projectId.toString());
      } catch (error) {
        console.error("Error fetching like count:", error);
        return 0;
      }
    },

    async hasUserLikedProject(projectId: string | number): Promise<boolean> {
      try {
        const authStore = useAuthStore();
        if (!authStore.token) return false;

        const hasLiked = await projectService.hasUserLiked(
          projectId.toString(),
        );

        // Update local state
        if (hasLiked) {
          this.likedProjects.add(projectId);
        } else {
          this.likedProjects.delete(projectId);
        }

        return hasLiked;
      } catch (error) {
        console.error("Error checking like status:", error);
        return false;
      }
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
        if (!authStore.token) {
          console.warn("User not authenticated, skipping view tracking");
          return;
        }

        // Use ProjectService to track view
        await projectService.trackView(projectId.toString());

        console.log("✅ View tracked successfully on backend");

        // Update local state
        const project = this.projects.find(
          (p) => p.id?.toString() === projectId.toString(),
        );
        if (project) {
          project.views++;
        }
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    },

    async getProjectViewCount(projectId: string | number): Promise<number> {
      try {
        return await projectService.getViewCount(projectId.toString());
      } catch (error) {
        console.error("Error fetching view count:", error);
        return 0;
      }
    },

    async hasUserViewedProject(projectId: string | number): Promise<boolean> {
      try {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (!token) return false;

        const data = await $fetch(`/api/projects/${projectId}/has-viewed`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return data.hasViewed || false;
      } catch (error) {
        console.error("Error checking view status:", error);
        return false;
      }
    },

    async fetchProjectById(id: string): Promise<Project | null> {
      this.loading = true;

      try {
        // Use ProjectService to fetch
        const response = await projectService.fetchById(id);

        console.log("Fetched project details:", response);

        if (!response) return null;

        // Transform project using ProjectTransformer
        const transformedProject = transformProject(response);

        // Update or add to projects array
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

        if (!authStore.user) {
          throw new Error("User must be authenticated to create projects");
        }

        // Build CreateProjectDTO
        const createData: CreateProjectDTO = {
          name: projectData.name || "",
          description: projectData.description || "",
          authorId: authStore.user.id,
          departmentId: authStore.user.departmentId,
          categoryId: projectData.category
            ? this.getCategoryIdByName(projectData.category)
            : undefined,
          courseId: projectData.course
            ? this.getCourseIdByName(projectData.course)
            : undefined,
          technologies: projectData.technologies,
          tags: projectData.tags,
          features: projectData.features,
          demoUrl: projectData.demoUrl,
          repoUrl: projectData.githubUrl,
          memberIds: projectData.members?.map((m: any) => m.id),
          academicYear: projectData.academicYear,
          startDate: new Date().toISOString(),
          // Images will be File[] from form upload, not ProjectImage[]
          images: (projectData.images as any)?.filter?.(
            (img: any) => img instanceof File,
          ) as File[] | undefined,
        };

        // Use ProjectService to create
        const response = await projectService.create(createData);

        console.log("✅ Project created successfully:", response);

        // Transform API response using ProjectTransformer
        const newProject = transformProject(response);

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

        if (!authStore.isAuthenticated || !authStore.user) {
          console.warn("User not authenticated, cannot fetch user projects");
          return;
        }

        // Use ProjectService to fetch user projects
        const response = await projectService.fetchUserProjects();

        const apiProjects = await response;

        // Transform projects using ProjectTransformer
        const projects = transformProjects(apiProjects);

        this.userProjects = projects;

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
        project = this.projects.find((p) => p.id === id);
      }

      return project || null;
    },

    // Update project status
    async updateProjectStatus(
      projectId: string,
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
      projectId: string,
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

      // Ensure projectId is a string
      const stringProjectId =
        typeof projectId === "number" ? projectId.toString() : projectId;

      // If features are being updated, recalculate status
      if (updates.features) {
        updates.status = this.calculateProjectStatus(updates.features);
      }

      let updated = false;

      // Update in user projects
      const userProjectIndex = this.userProjects.findIndex(
        (p) => p.id === stringProjectId,
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
        (p) => p.id === stringProjectId,
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
          projectId: stringProjectId,
          userProjects: this.userProjects.map((p) => p.id),
          allProjects: this.projects.map((p) => p.id),
        });
        throw new Error(`Project with ID ${stringProjectId} not found`);
      }

      // In real app, sync with backend
      // await api.updateProject(stringProjectId, updates);

      // Save to localStorage
      // this.saveUserCreatedProjects();

      // Return the updated project
      const updatedProject =
        this.projects.find((p) => p.id === stringProjectId) ||
        this.userProjects.find((p) => p.id === stringProjectId);

      if (!updatedProject) {
        throw new Error(
          `Project with ID ${stringProjectId} not found after update`,
        );
      }

      console.log("Project updated successfully:", updatedProject.id);
      return updatedProject;
    },

    // Delete project
    async deleteProject(projectId: string): Promise<boolean> {
      try {
        // Use ProjectService to delete
        await projectService.delete(projectId);

        console.log("✅ Project deleted successfully");
        // Remove from projects array
        this.projects = this.projects.filter(
          (project) => project.id !== projectId,
        );

        // Remove from user projects array
        this.userProjects = this.userProjects.filter(
          (project) => project.id !== projectId,
        );

        // Update pagination
        this.pagination.totalItems = this.projects.length;
        this.pagination.totalPages = Math.ceil(
          this.projects.length / this.pagination.itemsPerPage,
        );

        return true;
      } catch (error) {
        console.error("Failed to delete project:", error);
        return false;
      }
    },

    // Submit project for review (add to submissions)
    async submitProjectForReview(projectId: string): Promise<boolean> {
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

    // this will fetch all course details from backend
    async fetchCourses(): Promise<Course[]> {
      let response = await $fetch("/api/courses");

      this.courseObjects = (await response).data;

      console.log("Fetched courses:", this.courseObjects);

      this.availableCourses = this.courseObjects.map((course) => course.name);

      return this.courseObjects;
    },
  },
});
