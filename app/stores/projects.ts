import { defineStore } from "pinia";
import { any } from "zod";
import { useAuthStore } from "~/stores/auth";

import { projectsData } from "~/constants/projects";
import { ca } from "zod/locales";
// Types
export interface ProjectAuthor {
  name: string;
  avatar: string;
  program: string;
  year: string;
}

export interface FeatureItem {
  date?: string;
  title: string;
  description: string;
  icon: string;
  status: "pending" | "ongoing" | "done";
}

export interface Project {
  id?: number;
  title: string;
  description: string;
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
    title: string;
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
  likedProjects: Set<number>;
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
          (feature) => feature.status === "done"
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
          0
        ),
      };
    },
  },

  actions: {
    // Calculate project status based on features
    calculateProjectStatus(
      features?: FeatureItem[]
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
        return [];
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

        // convert the array of object json to array of string
        let categoriesString: string[] = Array.from(
          new Set(
            categories.map((cat: any) =>
              typeof cat === "string" ? cat : cat.name
            )
          )
        );

        return (this.availableCategories = categoriesString);
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
            response
          );
          tags = tagsMock;
        }

        let tagsString: string[] = Array.from(
          new Set(
            tags.map((tag: any) => (typeof tag === "string" ? tag : tag.name))
          )
        );

        return (this.availableTags = tagsString);
      } finally {
        this.loading = false;
      }
    },

    // 2. fetch Projects data from server

    async fetchProjects(includePrivate = false): Promise<Project[]> {
      this.loading = true;
      try {
        // simulate network delay
        // await new Promise((resolve) => setTimeout(resolve, 100));
        // return current projects (in a real app this would come from an API)\

        // Only load from projectsData if projects array is empty (initial load)
        if (this.projects.length === 0) {
          let projects: Project[] = projectsData;

          // Add default visibility to projects that don't have it
          projects = projects.map((project) => ({
            ...project,
            visibility: project.visibility || "public", // Default to public if not set
          }));

          this.projects = projects;

          // Load user-created projects from localStorage and merge
          if (typeof window !== "undefined") {
            try {
              const stored = localStorage.getItem("userCreatedProjects");
              if (stored) {
                const userProjects = JSON.parse(stored);
                if (Array.isArray(userProjects)) {
                  // Add user projects that don't already exist
                  userProjects.forEach((userProject) => {
                    if (!this.projects.find((p) => p.id === userProject.id)) {
                      this.projects.unshift(userProject);
                    }
                  });

                  // Update nextProjectId to be higher than any existing project ID
                  const maxId = Math.max(
                    ...this.projects.map((p) => p.id),
                    999
                  );
                  this.nextProjectId = maxId + 1;
                }
              }
            } catch (error) {
              console.warn("Error loading user created projects:", error);
            }
          }
        }

        // Filter by visibility for return value
        let projects = [...this.projects]; // Create a copy to avoid mutating state
        if (!includePrivate) {
          projects = projects.filter(
            (project) => project.visibility !== "private"
          );
        }

        // Update pagination state
        this.pagination.totalItems = projects.length;
        this.pagination.totalPages = Math.ceil(
          projects.length / this.pagination.itemsPerPage
        );

        return projects;
      } finally {
        this.loading = false;
      }
    },

    async likeProject(projectId: number): Promise<boolean> {
      // Import auth store dynamically to avoid circular imports
      const authStore = useAuthStore();

      // Check if user is authenticated
      if (!authStore.isAuthenticated || !authStore.user) {
        console.warn("User must be authenticated to like projects");
        return false;
      }

      const project = this.projects.find((p) => p.id === projectId);
      if (!project) {
        console.warn("Project not found");
        return false;
      }

      const isCurrentlyLiked = this.likedProjects.has(projectId);

      if (isCurrentlyLiked) {
        // Unlike: decrement count and remove from liked
        if (project.likes > 0) {
          project.likes--;
        }
        this.likedProjects.delete(projectId);
      } else {
        // Like: increment count and add to liked
        project.likes++;
        this.likedProjects.add(projectId);
      }

      // In a real app, this would sync with the backend
      // await this.syncLikesWithServer(authStore.user.id, Array.from(this.likedProjects));

      return !isCurrentlyLiked; // Return new liked state
    },

    // Check if a project is liked by current user
    isProjectLiked(projectId: number): boolean {
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
                `📚 Loaded ${parsed.length} liked project(s) for user ${authStore.user.name}`
              );
            }
          } else {
            console.log(
              `📚 No liked projects found for user ${authStore.user.name}`
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
            JSON.stringify(Array.from(this.likedProjects))
          );
          console.log(
            `💾 Saved ${this.likedProjects.size} liked project(s) for user ${authStore.user.name}`
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

    // Save user-created projects to localStorage
    saveUserCreatedProjects(): void {
      if (typeof window !== "undefined") {
        try {
          // Get only user-created projects (ID >= 1000)
          const userCreatedProjects = this.projects.filter((p) => p.id >= 1000);
          localStorage.setItem(
            "userCreatedProjects",
            JSON.stringify(userCreatedProjects)
          );
        } catch (error) {
          console.warn("Error saving user created projects:", error);
        }
      }
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
        filteredCount / this.pagination.itemsPerPage
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

    async incrementViews(projectId: number): Promise<void> {
      const project = this.projects.find((p) => p.id === projectId);
      if (project) {
        project.views++;
        console.log(`📊 Project "${project.title}" - Views: ${project.views}`);
      }
    },

    async getProject(id: number | string): Promise<Project | undefined> {
      // fetch project by id from API or local store
      await new Promise((resolve) => setTimeout(resolve, 50));

      return this.projects.find(
        (project) => project.id === Number.parseInt(id.toString())
      );
    },

    getProjectsByAuthor(authorName: string): Project[] {
      return this.projects.filter((project) =>
        project.author.name.toLowerCase().includes(authorName.toLowerCase())
      );
    },

    searchProjects(query: string) {
      if (!query.trim()) return [];

      const searchTerm = query.toLowerCase();
      const results: Array<{
        type: "category" | "title" | "description";
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
        if (project.title.toLowerCase().includes(searchTerm)) {
          const key = `title-${project.title}`;
          if (!addedItems.has(key) && results.length < 10) {
            addedItems.add(key);
            results.push({
              type: "title",
              icon: "i-heroicons-document-text-20-solid",
              value: project.title,
              label: project.title,
              subtitle: "Project Title",
              category: project.category,
            });
          }
        }
      });

      // Search project descriptions
      this.projects.forEach((project) => {
        if (project.description.toLowerCase().includes(searchTerm)) {
          const key = `desc-${project.title}`;
          if (!addedItems.has(key) && results.length < 10) {
            addedItems.add(key);
            results.push({
              type: "description",
              icon: "i-heroicons-chat-bubble-left-right-20-solid",
              value: project.title,
              label: project.title,
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
          this.filters.categories.includes(p.category)
        );
      }

      // Filter by search
      if (this.filters.search.trim()) {
        const search = this.filters.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search)
        );
      }

      // Filter by tags
      if (this.filters.tags.length > 0) {
        filtered = filtered.filter((p) =>
          p.tags?.some((tag) => this.filters.tags.includes(tag))
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
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "liked":
          return sorted.sort((a, b) => b.likes - a.likes);
        case "viewed":
          return sorted.sort((a, b) => b.views - a.views);
        case "recent":
        default:
          return sorted.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
        filtered.length / this.pagination.itemsPerPage
      );

      return filtered.slice(start, end);
    },

    // Create new project
    async createProject(
      projectData: Omit<Project, "id" | "createdAt" | "likes" | "views">
    ): Promise<Project> {
      // Generate new ID using independent counter (starts at 1000 to avoid conflicts with seed data)
      const newId = this.nextProjectId++;

      console.log("ID Generation Debug:", {
        newId: newId,
        nextProjectId: this.nextProjectId,
        totalProjects: this.projects.length,
        totalUserProjects: this.userProjects.length,
      });

      // Create new project with defaults
      const newProject: Project = {
        ...projectData,
        id: newId,
        createdAt: new Date().toISOString().split("T")[0],
        likes: 0,
        views: 0,
        visibility: projectData.visibility || "public", // Default to public
        status: this.calculateProjectStatus(projectData.features), // Auto-calculate status
      };

      // Add to both projects arrays
      this.projects.unshift(newProject); // Add to beginning
      this.userProjects.unshift(newProject); // Add to user projects as well

      console.log("After creation:", {
        newProject,
      });

      // Update pagination
      this.pagination.totalItems = this.projects.length;
      this.pagination.totalPages = Math.ceil(
        this.projects.length / this.pagination.itemsPerPage
      );

      // Save to localStorage
      this.saveUserCreatedProjects();

      // In real app, this would sync with backend
      // await api.createProject(newProject);

      return newProject;
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
        this.userProjects = this.projects.filter(
          (project) => project.author?.name === authStore.user?.name
        );
      } catch (error) {
        console.error("Failed to fetch user projects:", error);
      } finally {
        this.loading = false;
      }
    },

    // Get project by ID (works for both public and user projects)
    async getProjectById(id: number): Promise<Project | null> {
      // First try to find in user projects
      let project = this.userProjects.find(
        (p) => p.id === parseInt(id.toString())
      );

      // If not found, try in all projects
      if (!project) {
        project = this.projects.find((p) => p.id === parseInt(id.toString()));
      }

      return project || null;
    },

    // Update project status
    async updateProjectStatus(
      projectId: number,
      status: string
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
      visibility: "public" | "private"
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
      updates: Partial<Project>
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
        (p) => p.id === numericProjectId
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
              this.userProjects[userProjectIndex].features
            );
        }
        updated = true;
      }

      // Update in all projects
      const projectIndex = this.projects.findIndex(
        (p) => p.id === numericProjectId
      );
      if (projectIndex !== -1) {
        this.projects[projectIndex] = {
          ...this.projects[projectIndex],
          ...updates,
        };
        // Recalculate status if not explicitly set and features exist
        if (!updates.status && this.projects[projectIndex].features) {
          this.projects[projectIndex].status = this.calculateProjectStatus(
            this.projects[projectIndex].features
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
      this.saveUserCreatedProjects();

      // Return the updated project
      const updatedProject =
        this.projects.find((p) => p.id === numericProjectId) ||
        this.userProjects.find((p) => p.id === numericProjectId);

      if (!updatedProject) {
        throw new Error(
          `Project with ID ${numericProjectId} not found after update`
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
          (p) => p.id === projectId
        );
        if (userProjectIndex !== -1) {
          this.userProjects.splice(userProjectIndex, 1);
        }

        // Update pagination
        this.pagination.totalItems = this.projects.length;
        this.pagination.totalPages = Math.ceil(
          this.projects.length / this.pagination.itemsPerPage
        );

        // Save to localStorage
        this.saveUserCreatedProjects();

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
          (sub) => sub.id === projectId
        );
        if (alreadySubmitted) {
          console.warn("Project already submitted");
          return false;
        }

        // Add new submission
        const newSubmission = {
          id: projectId,
          title: userProject.title,
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
        this.saveUserCreatedProjects();

        // In real app, sync with backend
        // await api.submitProject(projectId);

        return true;
      } catch (error) {
        console.error("Failed to submit project:", error);
        return false;
      }
    },

    // Get next available project ID
    getNextProjectId(): number {
      return Math.max(...this.projects.map((p) => p.id)) + 1;
    },
  },
});
