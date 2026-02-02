import { defineStore } from "pinia";
import { authService } from "~/services/AuthService";

interface CountsState {
  totalProjects: number;
  totalStudents: number;
  totalTeachers: number;
  totalUsers: number;
}

interface AdminState {
  loadingCounts: boolean;
  loadingUsers: boolean;
  loadingProjects: boolean;
  counts: CountsState;
  users: any[];
  usersTotal: number;
  projects: any[];
  students: any[];
  teachers: any[];
}

const extractTotal = (resp: any, fallbackLength = 0) => {
  if (!resp) return fallbackLength;
  if (typeof resp.total === "number") return resp.total;
  if (resp.meta && typeof resp.meta.total === "number") return resp.meta.total;
  if (Array.isArray(resp.data)) return resp.data.length;
  if (Array.isArray(resp)) return resp.length;
  return fallbackLength;
};

export const useAdminStore = defineStore("admin", {
  state: (): AdminState => ({
    loadingCounts: false,
    loadingUsers: false,
    loadingProjects: false,
    counts: {
      totalProjects: 0,
      totalStudents: 0,
      totalTeachers: 0,
      totalUsers: 0,
    },
    users: [],
    usersTotal: 0,
    projects: [],
    students: [],
    teachers: [],
  }),

  actions: {
    async fetchCounts() {
      this.loadingCounts = true;
      try {
        const headers = await authService.getAuthHeaders();

        const [projectsResp, studentsResp, teachersResp] = await Promise.all([
          $fetch("/api/projects", {
            method: "GET",
            headers,
            query: { page: "1", limit: "500" },
          }),
          $fetch("/api/users", {
            method: "GET",
            headers,
            query: { page: "1", limit: "500", role: "STUDENT" },
          }),
          $fetch("/api/users", {
            method: "GET",
            headers,
            query: { page: "1", limit: "500", role: "TEACHER" },
          }),
        ]);

        this.projects = Array.isArray(projectsResp?.data)
          ? projectsResp.data
          : Array.isArray(projectsResp)
            ? projectsResp
            : [];
        this.students = Array.isArray(studentsResp?.data)
          ? studentsResp.data
          : Array.isArray(studentsResp)
            ? studentsResp
            : [];
        this.teachers = Array.isArray(teachersResp?.data)
          ? teachersResp.data
          : Array.isArray(teachersResp)
            ? teachersResp
            : [];

        const projectsTotal = extractTotal(projectsResp, this.projects.length);
        const studentsTotal = extractTotal(studentsResp, this.students.length);
        const teachersTotal = extractTotal(teachersResp, this.teachers.length);

        this.counts.totalProjects = projectsTotal;
        this.counts.totalStudents = studentsTotal;
        this.counts.totalTeachers = teachersTotal;
        this.counts.totalUsers = studentsTotal + teachersTotal;
      } catch (error) {
        console.error("AdminStore: failed to fetch counts", error);
        this.counts = {
          totalProjects: 0,
          totalStudents: 0,
          totalTeachers: 0,
          totalUsers: 0,
        };
      } finally {
        this.loadingCounts = false;
      }
    },

    async fetchUsers(
      filters: {
        role?: string;
        search?: string;
        page?: number;
        limit?: number;
      } = {},
    ) {
      this.loadingUsers = true;
      try {
        const headers = await authService.getAuthHeaders();
        const query: Record<string, string> = {
          page: String(filters.page || 1),
          limit: String(filters.limit || 20),
        };
        if (filters.role) query.role = filters.role;
        if (filters.search) query.search = filters.search;

        const resp = await $fetch("/api/users", {
          method: "GET",
          headers,
          query,
        });

        if (Array.isArray(resp?.data)) this.users = resp.data;
        else if (Array.isArray(resp)) this.users = resp;
        else this.users = [];

        this.usersTotal = extractTotal(resp, this.users.length);
      } catch (error) {
        console.error("AdminStore: failed to fetch users", error);
        this.users = [];
        this.usersTotal = 0;
      } finally {
        this.loadingUsers = false;
      }
    },

    async updateUserRole(userId: string, role: string) {
      const headers = await authService.getAuthHeaders();
      await $fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: { role },
      });
      await this.fetchUsers();
    },

    async createUser(payload: Record<string, any>) {
      const headers = await authService.getAuthHeaders();
      const body = {
        ...payload,
        role: (payload.role || "STUDENT").toUpperCase(),
      };

      await $fetch("/api/users", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body,
      });

      await this.fetchUsers();
    },

    async uploadUsersCSV(file: File) {
      // const headers = await authService.getAuthHeaders();

      const formData = new FormData();
      formData.append("file", file);

      const studentStore = useStudentStore();

      const response = await studentStore.uploadStudentsCSV(file);

      await this.fetchUsers();
    },

    async deleteUser(userId: string) {
      const headers = await authService.getAuthHeaders();
      await $fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers,
      });
      this.users = this.users.filter((u) => u.id !== userId);
      this.usersTotal = Math.max(0, this.usersTotal - 1);
    },

    async fetchUserById(userId: string) {
      const headers = await authService.getAuthHeaders();
      const resp = await $fetch(`/api/users/${userId}`, {
        method: "GET",
        headers,
      });
      return resp?.data || resp;
    },

    async updateUser(userId: string, payload: Record<string, any>) {
      const headers = await authService.getAuthHeaders();
      await $fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: payload,
      });
      await this.fetchUsers();
    },

    async fetchProjects(query: Record<string, string | number> = {}) {
      this.loadingProjects = true;
      try {
        const headers = await authService.getAuthHeaders();
        const params: Record<string, string | number> = {
          page: 1,
          limit: 500,
          ...query,
        };

        const resp = await $fetch("/api/projects", {
          method: "GET",
          headers,
          query: params,
        });

        const { projects, pagination } =
          ProjectTransformer.transformApiResponse(resp.data);

        this.counts.totalProjects = projects.length;
        extractTotal(resp, this.projects.length);
      } catch (error) {
        console.error("AdminStore: failed to fetch projects", error);
        this.projects = [];
      } finally {
        this.loadingProjects = false;
      }
    },
  },
});
