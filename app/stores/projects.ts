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
  date: string;
  title: string;
  description: string;
  icon: string;
  status: "pending" | "ongoing" | "done";
}

export interface Project {
  id: number;
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
  progress?: number;
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
  availableTags: { label: string; value: string }[];
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
    // Simulate fetch project state
    // In real application, this would involve API calls
    // 1. fetch Category data from server

    async fetchFeaturedProjects(): Promise<Partial<Project[]>> {
      this.loading = true;
      try {
        // simulate network delay for 1 s

        const featuredProjects: Partial<Project[]> = [
          {
            id: 1,
            title: "AI Chat Assistant",
            description:
              "An intelligent chatbot powered by GPT-3 for customer support. This project aims to enhance user experience by providing instant and accurate responses to common inquiries.",
            academicYear: "2024-2025",
            author: {
              name: "Sarah Chen",
              avatar: "https://randomuser.me/api/portraits/women/11.jpg",
              program: "Computer Science",
              year: "4th Year",
            },
            technologies: ["Python", "GPT-3", "React", "Node.js", "MongoDB"],
            category: "Artificial Intelligence",
            status: "Completed",
            featured: true,
            likes: 342,
            views: 2500,
            demoUrl: "https://ai-chat-assistant.demo.com",
            githubUrl: "https://github.com/sarahchen/ai-chat-assistant",
            images: [
              "https://images.unsplash.com/photo-1763182198113-a9a8d0fe3144?w=900&auto=format&fit=crop&q=60",
              "https://images.unsplash.com/photo-1763669029223-74f911a9e08b?w=900&auto=format&fit=crop&q=60",
              "https://plus.unsplash.com/premium_photo-1731286446855-c0bd3d23af46?w=900&auto=format&fit=crop&q=60",
            ],
            createdAt: "2024-10-15",
            tags: ["ai", "chatbot", "customer-support"],
            duration: "3 months",
            course: "Advanced AI & Machine Learning",
            features: [
              {
                title: "Natural Language Processing",
                description: "Advanced NLP for understanding user queries",
                date: "2024-09-01",
                icon: "i-heroicons-chat-bubble-left-right",
                status: "done" as const,
              },
              {
                title: "Knowledge Base Integration",
                description: "Connect to existing FAQ and documentation",
                date: "2024-09-15",
                icon: "i-heroicons-book-open",
                status: "done" as const,
              },
              {
                title: "Analytics Dashboard",
                description: "Track conversation metrics and user satisfaction",
                date: "2024-10-01",
                icon: "i-heroicons-chart-bar",
                status: "ongoing" as const,
              },
            ],
          },

          {
            id: 2,
            title: "Mobile Fitness App",
            description:
              "Track workouts, nutrition, and health metrics on the go.",
            academicYear: "2024-2025",
            author: {
              name: "Alex Rodriguez",
              avatar: "https://randomuser.me/api/portraits/men/21.jpg",
              program: "Mobile Development",
              year: "3rd Year",
            },
            technologies: ["React Native", "Firebase", "Redux", "HealthKit"],
            category: "Mobile Development",
            status: "In Progress",
            featured: false,
            likes: 256,
            views: 1800,
            demoUrl: "https://fitness-app.demo.com",
            githubUrl: "https://github.com/arodriguez/fitness-app",
            images: [
              "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&fit=crop",
              "https://images.unsplash.com/photo-1763854492937-fb7ae2f601f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMXx8fGVufDB8fHx8fA%3D%3D",
              "https://images.unsplash.com/photo-1763667309360-30d7e3779382?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D",
            ],
            createdAt: "2024-09-22",
            tags: ["fitness", "mobile", "health"],
            duration: "4 months",
            course: "Mobile App Development",
            features: [
              {
                title: "Workout Tracking",
                description: "Log and track various types of workouts",
                date: "2024-08-15",
                icon: "i-heroicons-trophy",
                status: "done" as const,
              },
              {
                title: "Nutrition Logging",
                description: "Track daily meals and calorie intake",
                date: "2024-09-01",
                icon: "i-heroicons-heart",
                status: "ongoing" as const,
              },
              {
                title: "Social Features",
                description: "Share progress with friends and community",
                date: "2024-10-15",
                icon: "i-heroicons-user-group",
                status: "pending" as const,
              },
            ],
          },
          {
            id: 3,
            title: "E-Commerce Platform",
            description:
              "Full-stack online store with payment integration and analytics.",
            academicYear: "2024-2025",
            author: {
              name: "Priya Patel",
              avatar: "https://randomuser.me/api/portraits/women/90.jpg",
              program: "Web Development",
              year: "4th Year",
            },
            technologies: [
              "Next.js",
              "Stripe",
              "PostgreSQL",
              "Tailwind",
              "Vercel",
            ],
            category: "Web Development",
            status: "Completed",
            featured: true,
            likes: 489,
            views: 3200,
            demoUrl: "https://ecommerce-platform.demo.com",
            githubUrl: "https://github.com/ppatel/ecommerce-platform",
            images: [
              "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&fit=crop",
              "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&fit=crop",
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&fit=crop",
            ],
            features: [
              {
                date: "Aug 20, 2024",
                title: "Core Features",
                description:
                  "Developed workout tracking, nutrition logging, and health metrics dashboard.",
                icon: "i-lucide-activity",
                status: "done",
              },
              {
                date: "Sep 10, 2024",
                title: "Social Integration",
                description:
                  "Added friend connections, workout sharing, and community challenges.",
                icon: "i-lucide-users",
                status: "done",
              },
              {
                date: "Oct 5, 2024",
                title: "Wearable Sync",
                description:
                  "Integrated with HealthKit and popular fitness wearables for automatic data sync.",
                icon: "i-lucide-watch",
                status: "ongoing",
              },
              {
                date: "Nov 1, 2024",
                title: "Launch",
                description:
                  "Final testing, app store submission, and public launch preparation.",
                icon: "i-lucide-rocket",
                status: "pending",
              },
            ],
            createdAt: "2024-08-10",
            tags: ["ecommerce", "payment", "analytics"],
            duration: "6 months",
            course: "Full Stack Web Development",
          },
        ];
        // Return the featured projects
        return featuredProjects;
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
        await new Promise((resolve) => setTimeout(resolve, 100));
        // return current categories (in a real app this would come from an API)

        const categories = [
          "All",
          "Artificial Intelligence",
          "Mobile Development",
          "Web Development",
          "Web",
          "Productivity",
          "Health Tech",
          "Data Science",
        ];
        return (this.availableCategories = categories);
      } finally {
        this.loading = false;
      }
    },

    async fetchTags(): Promise<{ label: string; value: string }[]> {
      this.loading = true;
      try {
        // simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        const tags = [
          { label: "Web Development", value: "web" },
          { label: "Mobile App", value: "mobile" },
          { label: "AI/ML", value: "ai" },
          { label: "Data Science", value: "data" },
          { label: "IoT", value: "iot" },
          { label: "Blockchain", value: "blockchain" },
          { label: "Machine Learning", value: "ml" },
          {
            label: "Artificial Intelligence",
            value: "artificial-intelligence",
          },
          { label: "Software Development", value: "software" },
          { label: "Frontend", value: "frontend" },
          { label: "Backend", value: "backend" },
          { label: "Full Stack", value: "fullstack" },
        ];
        return (this.availableTags = tags);
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
            }
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
      };

      // Add to both projects arrays
      this.projects.unshift(newProject); // Add to beginning
      this.userProjects.unshift(newProject); // Add to user projects as well

      console.log("After creation:", {
        newProject: newProject,
        totalProjects: this.projects.length,
        totalUserProjects: this.userProjects.length,
        userProjectIds: this.userProjects.map((p) => p.id),
      });

      // Update pagination
      this.pagination.totalItems = this.projects.length;
      this.pagination.totalPages = Math.ceil(
        this.projects.length / this.pagination.itemsPerPage
      );

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
    ): Promise<void> {
      // Update in user projects
      const userProjectIndex = this.userProjects.findIndex(
        (p) => p.id === projectId
      );
      if (userProjectIndex !== -1) {
        this.userProjects[userProjectIndex] = {
          ...this.userProjects[userProjectIndex],
          ...updates,
        };
      }

      // Update in all projects
      const projectIndex = this.projects.findIndex((p) => p.id === projectId);
      if (projectIndex !== -1) {
        this.projects[projectIndex] = {
          ...this.projects[projectIndex],
          ...updates,
        };
      }

      // In real app, sync with backend
      // await api.updateProject(projectId, updates);
    },

    // Get next available project ID
    getNextProjectId(): number {
      return Math.max(...this.projects.map((p) => p.id)) + 1;
    },
  },
});
