import { defineStore } from "pinia";
import { useAuthStore } from "~/stores/auth";
import { useProjectMetaStore } from "~/stores/project-meta";
import { getAvatarUrl } from "~/utils/avatar";
import { projectService } from "~/services/ProjectService";
import type {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectFilters,
} from "~/services/ProjectService";

import { projectsData } from "~/constants/projects";
import { transformProjects, transformProject } from "~/utils/projectTransformer";

// Types

export const useProjectStore = defineStore("projects", {
  state: (): ProjectState => ({
    projects: [],
    userProjects: [],
    likedProjects: new Set(),
    likedProjectList: [],
    loading: false,
    pagination: {
      currentPage: 1,
      itemsPerPage: 9,
      totalItems: 0,
      totalPages: 0,
    },
    filters: {
      categoryId: "",
      search: "",
      courseId: "",
      gen: "",
      sort: "recent",
      ascending: true,
    },
    highlightedProjects: [],
    submissionProjects: [],
    totalProject: 0,
  }),

  getters: {
    categoryObjects: () => {
      const projectMetaStore = useProjectMetaStore();
      return projectMetaStore.getItems("categories");
    },

    tagObjects: () => {
      const projectMetaStore = useProjectMetaStore();
      return projectMetaStore.getItems("tags");
    },

    courseObjects: (): Course[] => {
      const projectMetaStore = useProjectMetaStore();
      return projectMetaStore.getItems("courses") as Course[];
    },

    availableCategories(): string[] {
      return Array.from(
        new Set(
          this.categoryObjects
            .map((category) => category.name)
            .filter((name): name is string => Boolean(name)),
        ),
      );
    },

    availableTags(): string[] {
      return Array.from(
        new Set(
          this.tagObjects
            .map((tag) => tag.name)
            .filter((name): name is string => Boolean(name)),
        ),
      );
    },

    availableCourses(): Course[] {
      return this.courseObjects;
    },

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

    getCourseIdByName() {
      return (courseName: string): string | null => {
        return (
          this.courseObjects.find((course) => course.name === courseName)?.id ||
          null
        );
      };
    },

    getStudentProjects(): Project[] {
      let projects: Project[] = [];
      projects = this.projects.slice(0, 6);

      console.log("getStudentProjects called, returning:", projects);

      return projects;
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

    // Get similar projects by category, excluding the current project
    getSimilarProjects() {
      return (
        currentProjectId: string | number,
        category?: string,
      ): Project[] => {
        let filteredProjects = this.projects.filter(
          (p) => p.id !== currentProjectId,
        );

        // If category is provided, filter by same category first
        if (category) {
          const sameCategoryProjects = filteredProjects.filter(
            (p) => p.category === category,
          );
          // If we have enough projects in the same category, use those
          if (sameCategoryProjects.length >= 6) {
            return sameCategoryProjects.slice(0, 6);
          }
          // Otherwise, prioritize same category and fill with others
          const otherProjects = filteredProjects.filter(
            (p) => p.category !== category,
          );
          return [...sameCategoryProjects, ...otherProjects].slice(0, 6);
        }

        // No category filter, just return first 6
        return filteredProjects.slice(0, 6);
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
        completed: this.projects.filter((p) => p.projectStatus === "Completed")
          .length,
        inProgress: this.projects.filter(
          (p) => p.projectStatus === "In Progress",
        ).length,
        totalLikes: this.projects.reduce((sum, p) => sum + p.likes, 0),
        totalViews: this.projects.reduce((sum, p) => sum + p.views, 0),
        totalTeamMembers: this.projects.reduce(
          (sum, p) => sum + (p.members?.length || 0),
          0,
        ),
      };
    },

    getHighlightedProjects: (state) => state.highlightedProjects,

    /**
     * Top popular projects by views (fallback to likes), limited to count
     */
    getPopularProjects: (state) => (limit: number = 6) =>
      [...state.projects]
        .sort(
          (a, b) =>
            (b.views || 0) - (a.views || 0) ||
            (b.likes || 0) - (a.likes || 0),
        )
        .slice(0, limit),

    getSubmissionProjects: (state) => state.submissionProjects,
  },

  actions: {
    // Calculate project status based on features
    calculateProjectStatus(
      features?: FeatureItem[],
    ): "Completed" | "In Progress" {
      return calculateProjectStatus(features);
    },

    async fetchCategories(): Promise<string[]> {
      this.loading = true;
      try {
        const projectMetaStore = useProjectMetaStore();
        await projectMetaStore.fetchCategories();
        return this.availableCategories;
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchTags(): Promise<string[]> {
      this.loading = true;
      try {
        const projectMetaStore = useProjectMetaStore();
        await projectMetaStore.fetchTags();
        return this.availableTags;
      } catch (error) {
        console.error("Error fetching tags:", error);
        return [];
      } finally {
        this.loading = false;
      }
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
          courseId: this.filters.courseId || undefined,
          gen: this.filters.gen || undefined,
          sort: this.filters.sort || undefined,
          ascending: this.filters.ascending,
          categoryId: "", // will be set below if needed
        };

        // Add category filter if set
        if (this.filters.categoryId) {
          filters.categoryId = this.filters.categoryId;
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
        this.totalProject = pagination.total;
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
        // Optionally logout and redirect

        // call refresh to new one
        authStore.refreshAccessToken();

        // await authStore.logout();
        // return false;
      }

      const project =
        this.projects.find((p) => p.id?.toString() === projectId.toString()) ||
        this.likedProjectList.find(
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
      // if (!authStore.isAuthenticated || !authStore.user || !authStore.token) {
      //   this.likedProjects.clear();
      //   this.likedProjectList = [];
      //   return;
      // }

      try {
        // Fetch user's liked projects from API
        const likedData = await projectService.getUserLikedProjects();

        // API can return either:
        // 1) like records with `project` object, or
        // 2) raw project objects (as currently returned by /projects/me/likes).
        const likedProjectObjects = likedData
          .map((item: any) =>
            item.project ? transformProject(item.project) : transformProject(item),
          )
          .filter((p: any) => p && p.id);

        const finalIds = likedProjectObjects.map((p: any) => p.id);

        this.likedProjects = new Set(finalIds);

        // We already have full project objects from the API in most cases.
        // If for some reason we didn't, fallback to fetching by id.
        if (likedProjectObjects.length > 0) {
          this.likedProjectList = likedProjectObjects;
        } else if (finalIds.length > 0) {
          const fetchedProjects = await Promise.all(
            finalIds.map((id: string | number) =>
              this.fetchProjectById(id.toString()),
            ),
          );
          this.likedProjectList = fetchedProjects.filter(Boolean) as Project[];
        } else {
          this.likedProjectList = [];
        }
        console.log(
          `📚 Loaded ${finalIds.length} liked project(s) for user ${authStore.user.name} from API`,
        );
      } catch (error) {
        console.error("Error loading user liked projects from API:", error);

        // Fallback to localStorage if API fails
        if (typeof window !== "undefined") {
          const key = `likedProjects_${authStore.user.id}`;
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) {
                this.likedProjects = new Set(parsed);
                this.likedProjectList = [];
                console.log(
                  `📚 Loaded ${parsed.length} liked project(s) from localStorage fallback`,
                );
              }
            }
          } catch (e) {
            console.warn("Error loading from localStorage fallback:", e);
            this.likedProjects.clear();
            this.likedProjectList = [];
          }
        }
      }
    },

    async fetchHighlightedProjects(): Promise<void> {
      ///  use api directly
      let projects: Project[] = [];
      let selectProject: Project[] = []; // only 3 projects will be selected

      const highlightedProjects = await projectService.getHighlightedProjects();

      // tranform api response

      projects = transformProjects(highlightedProjects);
      let total = projects.length;
      let numToSelect = Math.min(6, total); // select up to 6 projects
      selectProject = projects.slice(0, numToSelect);

      // for (let i = 0; i < total; i++) {
      //   let index = Math.floor(Math.random() * total);

      //   if (!selectProject.includes(projects[index])) {
      //     selectProject = [...selectProject, projects[index]];
      //   }
      //   if (numToSelect === selectProject.length) break;

      //   // projects.splice(index, 1); // remove selected project to avoid duplicates
      // }

      this.highlightedProjects = selectProject;
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
        // Track view regardless of authentication status
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

    /**
     * Fetch submission projects for the current user
     * Returns projects where:
     * - Author ID matches current user ID
     * - Visibility is 'reviewing' or 'accepted'
     */
    async fetchUserSubmissions(): Promise<Project[]> {
      this.loading = true;
      try {
        const authStore = useAuthStore();

        // Check if user is authenticated
        if (!authStore.isAuthenticated || !authStore.user?.id) {
          console.warn("User not authenticated, cannot fetch submissions");
          return [];
        }

        const currentUserId = authStore.user.id;

        // Fetch all projects (in real implementation, this would be a dedicated API endpoint)
        // For now, we fetch all projects and filter client-side
        const allProjects = await this.fetchProjects(1, 100); // Fetch more items to get all user projects

        // Filter projects by author ID and visibility status
        const userSubmissions = allProjects.filter((project) => {
          const isUserProject = project.author?.id === currentUserId;
          const isSubmissionStatus =
            project.visibility === "reviewing" ||
            project.visibility === "accepted";

          return isUserProject && isSubmissionStatus;
        });

        console.log(
          `Found ${userSubmissions.length} submission projects for user ${currentUserId}`,
        );

        return userSubmissions;
      } catch (error) {
        console.error("Error fetching user submissions:", error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch all submissions (for teachers)
     * Returns all student submissions across all courses
     */
    async fetchAllSubmissions(): Promise<Project[]> {
      this.loading = true;

      try {
        const authStore = useAuthStore();

        // Check if user is authenticated and is a teacher
        // if (!authStore.isAuthenticated) {
        //   console.warn("User not authenticated, cannot fetch submissions");
        //   return [];
        // }

        // Use ProjectService to fetch submissions
        const response = await projectService.fetchAllSubmissions();

        console.log("Fetched submissions response:", response);

        // Transform API response using ProjectTransformer
        // API returns array directly, not wrapped in data property
        const submissions = Array.isArray(response?.data || response)
          ? (response.data || response).map((item: any) =>
              transformProject(item),
            )
          : [];

        console.log(`Found ${submissions.length} total submissions`);

        this.submissionProjects = submissions;

        // Update store state with fetched submissions
        // projects = submissions;

        return submissions;
      } catch (error) {
        console.error("Error fetching all submissions:", error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    async searchProjects(query: string) {
      if (!query.trim()) return [];

      const searchTerm = query.toLowerCase();
      // Search Result Format
      const results: Array<{
        type: "category" | "name" | "description";
        icon: string;
        value: string;
        label: string;
        subtitle: string;
        count?: number;
        category?: string;
        projectId?: string;
      }> = [];
      const addedItems = new Set<string>();

      try {
        // Fetch search results from backend with only search parameter
        const response = await projectService.fetchAll({
          search: query,
          limit: 8, // Get more results for better filtering
        });

        // Transform API response
        const { projects } = ProjectTransformer.transformApiResponse(response);

        // Search categories from available categories
        this.availableCategories.forEach((category) => {
          if (category.toLowerCase().includes(searchTerm)) {
            const key = `category-${category}`;
            if (!addedItems.has(key)) {
              addedItems.add(key);
              results.push({
                type: "category",
                icon: "i-heroicons-folder-20-solid",
                value: category,
                label: category,
                subtitle: "Category",
                count: projects.filter((p) => p.category === category).length,
              });
            }
          }
        });

        // Process projects from backend search results
        projects.forEach((project) => {
          // Use project ID as unique key to prevent duplicates
          const projectKey = `project-${project.id}`;

          // Skip if this project is already added or if we have enough results
          if (addedItems.has(projectKey) || results.length >= 10) {
            return;
          }

          // Add project by title match
          if (project.name.toLowerCase().includes(searchTerm)) {
            addedItems.add(projectKey);
            results.push({
              type: "name",
              icon: "i-heroicons-document-text-20-solid",
              value: project.name,
              label: project.name,
              subtitle: project.description,
              category: project.category,
              projectId: project.id,
            });
          }
        });

        return results;
      } catch (error) {
        console.error("Error searching projects from backend:", error);
        return [];
      }
    },

    // Filter management methods
    setFilter<K extends keyof ProjectFilters>(
      key: K,
      value: ProjectFilters[K],
    ): void {
      (this.filters as any)[key] = value;
      this.pagination.currentPage = 1; // Reset to first page when filters change
    },

    clearFilters(): void {
      this.filters = {
        categoryId: "",
        search: "",
        courseId: "",
        gen: "",
        sort: "recent",
        ascending: true,
      };
      this.resetPagination();
    },

    getFilteredProjects(): Partial<Project[]> {
      let filtered = [...this.projects];

      // Filter by search (client-side for immediate feedback)
      if (this.filters.search.trim()) {
        const search = this.filters.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search) ||
            p.category.toLowerCase().includes(search),
        );
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
      // Prefer locally-updated state first (important after edits)
      const cachedProject =
        this.userProjects.find((p) => p.id === id) ||
        this.projects.find((p) => p.id === id);
      if (cachedProject) {
        return cachedProject;
      }

      // Fallback to API fetch
      const fetchedProject = await this.fetchProjectById(id);
      console.log("getProjectById fetched from API:", fetchedProject);
      return fetchedProject || null;
    },

    // Update project status
    async updateProjectStatus(
      projectId: string,
      status: string,
    ): Promise<void> {
      // Update in user projects
      const userProject = this.userProjects.find((p) => p.id === projectId);
      if (userProject) {
        userProject.projectStatus = status as any;
      }

      // Update in all projects
      const project = this.projects.find((p) => p.id === projectId);
      if (project) {
        project.projectStatus = status as any;
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
      projectId: string | number,
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

      // Send patch to backend first to get canonical data
      let apiProject: Project | null = null;
      try {
        const response = await projectService.update(
          stringProjectId,
          updates as any,
        );
        apiProject = transformProject(response);
      } catch (error) {
        console.error("API update failed, aborting local update", error);
        throw error;
      }

      // Use API response as the source of truth; fallback to updates if missing
      const incoming = apiProject || (updates as Project);

      // If features are being updated, recalculate status
      if (incoming.features) {
        incoming.projectStatus = this.calculateProjectStatus(incoming.features);
      }

      let updated = false;

      // Update in user projects
      const userProjectIndex = this.userProjects.findIndex(
        (p) => p.id === stringProjectId,
      );
      if (userProjectIndex !== -1) {
        this.userProjects[userProjectIndex] = {
          ...this.userProjects[userProjectIndex],
          ...incoming,
        };
        // Recalculate status if not explicitly set and features exist
        if (
          !incoming.projectStatus &&
          this.userProjects[userProjectIndex].features
        ) {
          this.userProjects[userProjectIndex].projectStatus =
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
          ...incoming,
        };
        // Recalculate status if not explicitly set and features exist
        if (!incoming.projectStatus && this.projects[projectIndex].features) {
          this.projects[projectIndex].projectStatus =
            this.calculateProjectStatus(this.projects[projectIndex].features);
        }
        updated = true;
      }

      // Update in submission projects (used by teacher dashboards)
      const submissionIndex = this.submissionProjects.findIndex(
        (p) => p.id === stringProjectId,
      );
      if (submissionIndex !== -1) {
        this.submissionProjects[submissionIndex] = {
          ...this.submissionProjects[submissionIndex],
          ...incoming,
        };
        if (
          !incoming.projectStatus &&
          this.submissionProjects[submissionIndex].features
        ) {
          this.submissionProjects[submissionIndex].projectStatus =
            this.calculateProjectStatus(
              this.submissionProjects[submissionIndex].features,
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
        const response = await projectService.submitForReview(projectId);
        if (response) {
          console.log("✅ Project submitted for review successfully");
        }

        return true;
      } catch (error) {
        console.error("Failed to submit project:", error);
        return false;
      }
    },

    // this will fetch all course details from backend
    async fetchCourses(): Promise<Course[]> {
      this.loading = true;
      try {
        const projectMetaStore = useProjectMetaStore();
        await projectMetaStore.fetchCourses();
        return this.availableCourses;
      } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
      } finally {
        this.loading = false;
      }
    },

    // async fetchSubmissionProjects(): Promise<Project[]> {
    //   let projects: Project[] = [];
    //   projects = await projectService.fetchSubmissionProjectForTeacher();
    //   return projects;
    // },

    // Accept project submission
    async acceptProject(projectId: string): Promise<void> {
      try {
        await projectService.acceptProject(projectId);
        console.log(`Project ${projectId} accepted successfully`);
      } catch (error) {
        console.error(`Failed to accept project ${projectId}`, error);
        throw error;
      }
    },

    async rejectProject(projectId: string): Promise<void> {
      try {
        await projectService.rejectProject(projectId);
        console.log(`Project ${projectId} rejected successfully`);
      } catch (error) {
        console.error(`Failed to reject project ${projectId}`, error);
        throw error;
      }
    },
  },
});
