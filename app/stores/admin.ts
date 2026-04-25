import { defineStore } from "pinia";
import { authService } from "~/services/AuthService";
import { useAuthStore } from "~/stores/auth";
import type { CourseTeacherItem } from "~/types/admin-course-management";

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
  loadingTeachers: boolean;
  counts: CountsState;
  users: any[];
  usersTotal: number;
  projects: any[];
  students: any[];
  teachers: CourseTeacherItem[];
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
    loadingTeachers: false,
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
    normalizeTeacherForCourseAssignment(user: any): CourseTeacherItem {
      return {
        id: String(user?.id || ""),
        name: user?.name,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        avatar: user?.avatar,
        role: (user?.role || "").toString().toUpperCase(),
        courses: Array.isArray(user?.courses)
          ? user.courses.map((course: any) => ({
              id: String(course?.id || ""),
              name: course?.name,
              code: course?.code,
              description: course?.description,
            }))
          : [],
      };
    },

    async fetchTeachersForCourseAssignments() {
      this.loadingTeachers = true;
      try {
        const authStore = useAuthStore();
        const resp = await authStore.makeAuthRequest("/api/users", {
          method: "GET",
          query: {
            role: "TEACHER",
            page: "1",
            limit: "500",
          },
        } as any);

        const rows = Array.isArray((resp as any)?.data)
          ? (resp as any).data
          : Array.isArray(resp)
            ? resp
            : [];

        this.teachers = rows
          .map((user: any) => this.normalizeTeacherForCourseAssignment(user))
          .filter((user) => user.role === "TEACHER");

        return this.teachers;
      } catch (error) {
        console.error("AdminStore: failed to fetch teachers for courses", error);
        this.teachers = [];
        throw error;
      } finally {
        this.loadingTeachers = false;
      }
    },

    async assignTeacherCourse(courseId: string, teacherId: string) {
      const authStore = useAuthStore();
      await authStore.makeAuthRequest("/api/courses/assign/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { courseId, teacherId },
      } as any);

      await this.fetchTeachersForCourseAssignments();
    },

    async removeTeacherCourse(courseId: string, teacherId: string) {
      const authStore = useAuthStore();
      await authStore.makeAuthRequest("/api/courses/remove/teacher", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: { courseId, teacherId },
      } as any);

      await this.fetchTeachersForCourseAssignments();
    },

    async fetchCounts() {
      this.loadingCounts = true;
      try {
        const headers = await authService.getAuthHeaders();
        const [projectsResult, usersResult] = await Promise.allSettled([
          $fetch("/api/projects", {
            method: "GET",
            headers,
            query: { page: "1", limit: "500" },
          }),
          $fetch("/api/users", {
            method: "GET",
            headers,
            query: { page: "1", limit: "500" },
          }),
        ]);

        if (projectsResult.status === "fulfilled") {
          const projectsResp: any = projectsResult.value;
          this.projects = Array.isArray(projectsResp?.data)
            ? projectsResp.data
            : Array.isArray(projectsResp)
              ? projectsResp
              : [];
          this.counts.totalProjects = extractTotal(projectsResp, this.projects.length);
        } else {
          console.error("AdminStore: failed to fetch project counts", projectsResult.reason);
          this.projects = [];
          this.counts.totalProjects = 0;
        }

        if (usersResult.status === "fulfilled") {
          const usersResp: any = usersResult.value;
          const allUsers = Array.isArray(usersResp?.data)
            ? usersResp.data
            : Array.isArray(usersResp)
              ? usersResp
              : [];

          this.students = allUsers.filter(
            (u: any) => String(u?.role || "").toUpperCase() === "STUDENT",
          );

          const teacherRows = allUsers.filter(
            (u: any) => String(u?.role || "").toUpperCase() === "TEACHER",
          );

          // Keep the course-assignment teacher state shape consistent.
          this.teachers = teacherRows.map((u: any) =>
            this.normalizeTeacherForCourseAssignment(u),
          );

          const adminsTotal = allUsers.filter(
            (u: any) => String(u?.role || "").toUpperCase() === "ADMIN",
          ).length;

          this.counts.totalStudents = this.students.length;
          this.counts.totalTeachers = teacherRows.length;
          this.counts.totalUsers = this.students.length + teacherRows.length + adminsTotal;
        } else {
          console.error("AdminStore: failed to fetch user counts", usersResult.reason);
          this.students = [];
          this.counts.totalStudents = 0;
          this.counts.totalTeachers = 0;
          this.counts.totalUsers = 0;
        }
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
