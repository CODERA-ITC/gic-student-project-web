import { defineStore } from "pinia";

import { studentService, type APIStudent } from "~/services/StudentService";
import { studentsData } from "~/constants/students";

// Types
export interface StudentSocial {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  program: string;
  year: string;
  avatar: string;
  bio: string;
  skills: string[];
  projects: number[];
  achievements: string[];
  social: StudentSocial;
  joinedYear: string;
  graduationYear: number;
  gen: number;
}

export type { APIStudent, PaginatedResponse } from "~/services/StudentService";

export interface StudentFilters {
  program: string;
  year: string;
  search: string;
  sortBy: "name" | "program" | "year" | "gpa" | "projects";
}

export interface StudentStats {
  total: number;
  byProgram: Record<string, APIStudent[]>;
  graduating2025: number;
  graduating2026: number;
}

export interface PublicStudentCard {
  id: string;
  name: string;
  program: string;
  year: number | string;
  avatar: string;
  bio: string;
  skills: string[];
  projectCount: number;
  gpa: number;
  achievements: any[];
  graduationYear: number;
  gen: number;
  social: Record<string, string>;
}

export interface StudentState {
  filters: StudentFilters;
  // API-based state
  apiStudents: APIStudent[];
  loading: boolean;
  currentPage: number;
  limit: number;
  total: number;
  lastPage: number;
  selectedGeneration: string | number;
  availableGenerations: number[];
  searchQuery: string;
  publicSelectedGeneration: number;
  publicGenerations: number[];
}

const normalizeStudentGeneration = (student: APIStudent): number => {
  if (typeof student.generation === "number") return student.generation;
  const parsed = Number(student.gen || student.generation || 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const applyFallbackPagination = (
  items: APIStudent[],
  page: number,
  limit: number,
) => {
  const safePage = Math.max(1, page || 1);
  const safeLimit = Math.max(1, limit || 10);
  const start = (safePage - 1) * safeLimit;
  const paged = items.slice(start, start + safeLimit);

  return {
    data: paged,
    total: items.length,
    page: safePage,
    limit: safeLimit,
    lastPage: Math.max(1, Math.ceil(items.length / safeLimit)),
  };
};

export const useStudentStore = defineStore("students", {
  state: (): StudentState => ({
    filters: {
      program: "All",
      year: "All",
      search: "",
      sortBy: "name",
    },
    // API-based state
    apiStudents: [],
    loading: false,
    currentPage: 1,
    limit: 10,
    total: 0,
    lastPage: 1,
    selectedGeneration: "all",
    availableGenerations: [25, 26, 27, 28, 29, 30],
    searchQuery: "",
    publicSelectedGeneration: 25,
    publicGenerations: [27, 26, 25, 24, 23, 22, 21, 20],
  }),

  getters: {
    filteredStudents(): APIStudent[] {
      let filtered = [...this.apiStudents];

      // Apply program filter
      if (this.filters.program !== "All") {
        filtered = filtered.filter(
          (student) =>
            (student.department?.name || "").toLowerCase() ===
            this.filters.program.toLowerCase(),
        );
      }

      // Apply year filter
      if (this.filters.year !== "All") {
        filtered = filtered.filter(
          (student) =>
            String(student.year || student.joinedYear || "") ===
            this.filters.year,
        );
      }

      // Apply search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        filtered = filtered.filter(
          (student) =>
            `${student.firstName || ""} ${student.lastName || ""}`
              .toLowerCase()
              .includes(searchTerm) ||
            (student.department?.name || "").toLowerCase().includes(searchTerm) ||
            (student.bio || "").toLowerCase().includes(searchTerm) ||
            (Array.isArray(student.skill) ? student.skill : []).some((skill) =>
              skill.toLowerCase().includes(searchTerm),
            ),
        );
      }

      // Apply sorting
      switch (this.filters.sortBy) {
        case "name":
          filtered.sort((a, b) =>
            `${a.firstName || ""} ${a.lastName || ""}`
              .trim()
              .localeCompare(`${b.firstName || ""} ${b.lastName || ""}`.trim()),
          );
          break;
        case "program":
          filtered.sort((a, b) =>
            (a.department?.name || "").localeCompare(b.department?.name || ""),
          );
          break;
        case "year":
          filtered.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
          break;
        case "projects":
          filtered.sort(
            (a, b) =>
              (Array.isArray(b.projects) ? b.projects.length : 0) -
              (Array.isArray(a.projects) ? a.projects.length : 0),
          );
          break;
      }

      return filtered;
    },

    studentsByProgram(): Record<string, APIStudent[]> {
      const programMap: Record<string, APIStudent[]> = {};
      this.apiStudents.forEach((student) => {
        const program = student.department?.name || "Unknown";
        if (!programMap[program]) {
          programMap[program] = [];
        }
        programMap[program].push(student);
      });
      return programMap;
    },

    studentStats(): StudentStats {
      return {
        total: this.apiStudents.length,
        byProgram: this.studentsByProgram,
        graduating2025: this.apiStudents.filter((s) => Number(s.year) === 2025)
          .length,
        graduating2026: this.apiStudents.filter((s) => Number(s.year) === 2026)
          .length,
      };
    },

    publicMappedStudents(): PublicStudentCard[] {
      return (this.apiStudents || []).map((student: APIStudent) => {
        const firstName = (student.firstName || "").toString();
        const lastName = (student.lastName || "").toString();
        const fullName =
          (firstName + " " + lastName).trim() || student.email || "Student";
        return {
          id: student.id,
          name: fullName,
          program: "GIC",

          year: student.year || "",
          avatar: student.avatar || "",
          bio: student.bio || "",
          skills: Array.isArray(student.skill) ? student.skill : [],
          projectCount: 0,
          gpa: 0,
          achievements: [],
          graduationYear: 0,
          gen:
            typeof student.generation === "number"
              ? student.generation
              : Number(
                  student.generation || this.publicSelectedGeneration || 25,
                ),
          social: {},
        };
      });
    },

    // topPerformers(): Student[] {
    //   return [...this.students].sort((a, b) => b.gpa - a.gpa).slice(0, 5);
    // },
  },

  actions: {
    setFilter(filterType: keyof StudentFilters, value: string): void {
      this.filters[filterType] = value as never;
    },

    clearFilters(): void {
      this.filters = {
        program: "All",
        year: "All",
        search: "",
        sortBy: "name",
      };
    },

    getStudent(id: number | string): APIStudent | undefined {
      return this.apiStudents.find(
        (student) => String(student.id) === String(id),
      );
    },

    getStudentsByProgram(program: string): APIStudent[] {
      return this.apiStudents.filter(
        (student) =>
          (student.department?.name || "").toLowerCase() ===
          program.toLowerCase(),
      );
    },

    searchStudents(query: string): APIStudent[] {
      const searchTerm = query.toLowerCase();
      return this.apiStudents.filter(
        (student) =>
          `${student.firstName || ""} ${student.lastName || ""}`
            .toLowerCase()
            .includes(searchTerm) ||
          (student.department?.name || "").toLowerCase().includes(searchTerm) ||
          (Array.isArray(student.skill) ? student.skill : []).some((skill) =>
            skill.toLowerCase().includes(searchTerm),
          ),
      );
    },

    // API-backed search with structured results for search dropdown
    async searchStudentsWithResults(query: string) {
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
        studentId?: string;
      }> = [];
      const addedItems = new Set<string>();

      try {
        const response = await studentService.fetchStudents({
          page: 1,
          limit: 8,
          role: "STUDENT",
          search: query.trim(),
        });

        const apiStudents = Array.isArray(response?.data) ? response.data : [];
        const departmentCounts = new Map<string, number>();

        apiStudents.forEach((student) => {
          const departmentName = (student.department?.name || "").trim();
          if (departmentName) {
            departmentCounts.set(
              departmentName,
              (departmentCounts.get(departmentName) || 0) + 1,
            );
          }
        });

        // Category-like suggestions from API data (department names)
        departmentCounts.forEach((count, departmentName) => {
          if (
            departmentName.toLowerCase().includes(searchTerm) &&
            !addedItems.has(`dept-${departmentName}`) &&
            results.length < 10
          ) {
            addedItems.add(`dept-${departmentName}`);
            results.push({
              type: "category",
              icon: "i-heroicons-academic-cap-20-solid",
              value: departmentName,
              label: departmentName,
              subtitle: "Department",
              count,
            });
          }
        });

        apiStudents.forEach((student) => {
          if (results.length >= 10) return;

          const fullName =
            `${student.firstName || ""} ${student.lastName || ""}`
              .trim()
              .replace(/\s+/g, " ");
          const label = fullName || student.email || "Student";
          const skills = Array.isArray(student.skill) ? student.skill : [];
          const subtitle = skills.length
            ? `Skills: ${skills.slice(0, 3).join(", ")}`
            : student.department?.name || "Student";
          const key = `student-${student.id || label}`;

          if (!addedItems.has(key)) {
            addedItems.add(key);
            results.push({
              type: "title",
              icon: "i-heroicons-user-20-solid",
              value: label,
              label,
              subtitle,
              category: student.department?.name || "",
              studentId: String(student.id || ""),
            });
          }
        });

        return results.slice(0, 8);
      } catch (error) {
        console.error("Error searching students from backend:", error);
        return [];
      }
    },

    // API-based actions
    async loadStudents(token: string) {
      this.loading = true;
      const params: any = {
        page: this.currentPage,
        limit: this.limit,
        role: "STUDENT", // Only fetch students
      };

      // Add generation filter if selected
      if (this.selectedGeneration !== "all") {
        params.generation = this.selectedGeneration;
      }

      // Add search query if present
      if (this.searchQuery && this.searchQuery.trim()) {
        params.search = this.searchQuery.trim();
      }

      try {
        const response = await studentService.fetchStudents(params, token);

        if (Array.isArray(response.data)) {
          this.apiStudents = response.data;
          this.total = response.total;
          this.lastPage = response.lastPage;
          this.currentPage = response.page;
        }
      } catch (error) {
        console.error("Error loading students:", error);
        // Fallback to static students when API fails
        const generation =
          this.selectedGeneration === "all"
            ? null
            : Number(this.selectedGeneration);
        const search = (this.searchQuery || "").toLowerCase().trim();
        const filtered = studentsData.filter((student) => {
          const matchesGeneration =
            generation === null ||
            normalizeStudentGeneration(student) === generation;
          if (!matchesGeneration) return false;

          if (!search) return true;
          const haystack = [
            student.firstName,
            student.lastName,
            student.email,
            ...(Array.isArray(student.skill) ? student.skill : []),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return haystack.includes(search);
        });

        const fallback = applyFallbackPagination(
          filtered,
          Number(params.page || 1),
          Number(params.limit || 10),
        );
        this.apiStudents = fallback.data;
        this.total = fallback.total;
        this.lastPage = fallback.lastPage;
        this.currentPage = fallback.page;
      } finally {
        this.loading = false;
      }
    },

    async loadInternalStudents(token: string) {
      this.loading = true;
      try {
        const params: any = {
          page: this.currentPage,
          limit: this.limit,
        };

        if (this.searchQuery && this.searchQuery.trim()) {
          params.search = this.searchQuery.trim();
        }

        const response = await studentService.fetchInternalStudents(
          params,
          token,
        );

        if (Array.isArray(response.data)) {
          this.apiStudents = response.data;
          this.total = response.total;
          this.lastPage = response.lastPage;
          this.currentPage = response.page;
        }
      } catch (error) {
        console.error("Error loading internal students:", error);
        this.apiStudents = [];
        this.total = 0;
        this.lastPage = 1;
      } finally {
        this.loading = false;
      }
    },

    async changePage(page: number, token: string) {
      this.currentPage = page;
      await this.loadStudents(token);
    },

    setGeneration(generation: string | number) {
      this.selectedGeneration = generation;
      this.currentPage = 1; // Reset to first page when filter changes
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
      this.currentPage = 1; // Reset to first page when search changes
    },

    async createStudent(studentData: any, token: string) {
      try {
        return await studentService.createStudent(studentData, token);
      } catch (error: any) {
        console.error("Error creating student:", error);
        throw new Error(error.data?.message || "Failed to create student");
      }
    },

    async updateStudent(studentId: string, studentData: any, token: string) {
      try {
        const updated = await studentService.updateStudent(
          studentId,
          studentData,
          token,
        );

        // Refresh local state
        const idx = this.apiStudents.findIndex((s) => s.id === studentId);
        if (idx !== -1) {
          this.apiStudents[idx] =
            updated ||
            studentService.mapStudent(
              { ...this.apiStudents[idx], ...studentData },
              { id: studentId },
            );
        }
      } catch (error: any) {
        console.error("Error updating student:", error);
        throw new Error(error.data?.message || "Failed to update student");
      }
    },

    async deleteStudent(studentId: string, token: string) {
      try {
        await studentService.deleteStudent(studentId, token);

        // Remove from local state
        this.apiStudents = this.apiStudents.filter(
          (student) => student.id !== studentId,
        );
        this.total = Math.max(0, this.total - 1);

        // Recalculate last page
        this.lastPage = Math.ceil(this.total / this.limit);

        // If current page is now beyond last page, go back one page
        if (this.currentPage > this.lastPage && this.lastPage > 0) {
          this.currentPage = this.lastPage;
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        throw error;
      }
    },

    async uploadStudentsCSV(file: File) {
      try {
        return await studentService.uploadStudentsCSV(file);
      } catch (error: any) {
        console.error("Error uploading CSV:", error);
        throw new Error(error.data?.message || "Failed to upload CSV file");
      }
    },

    async fetchPublicStudentById(
      studentId: string,
    ): Promise<APIStudent | null> {
      this.loading = true;
      try {
        const mapped = await studentService.fetchPublicStudentById(studentId);
        if (!mapped) return null;

        const idx = this.apiStudents.findIndex((s) => s.id === mapped.id);
        if (idx >= 0) this.apiStudents[idx] = mapped;
        else this.apiStudents.unshift(mapped);

        return mapped;
      } catch (error) {
        console.error("Error fetching public student by id:", error);
        const fallback =
          studentsData.find((student) => String(student.id) === String(studentId)) ||
          null;

        if (fallback) {
          const idx = this.apiStudents.findIndex((s) => s.id === fallback.id);
          if (idx >= 0) this.apiStudents[idx] = fallback;
          else this.apiStudents.unshift(fallback);
        }

        return fallback;
      } finally {
        this.loading = false;
      }
    },

    async loadPublicStudentsByGeneration(
      generation = 25,
      page = 1,
      limit = 10,
      ascending = false,
    ) {
      this.loading = true;
      try {
        const response = await studentService.fetchPublicStudentsByGeneration(
          generation,
          page,
          limit,
          ascending,
        );

        this.apiStudents = response.data;

        this.publicSelectedGeneration = generation;
        this.currentPage = response.page;
        this.limit = response.limit;
        this.total = response.total;
        this.lastPage = response.lastPage;
      } catch (error) {
        console.error("Error loading public students by generation:", error);
        const filtered = studentsData.filter(
          (student) => normalizeStudentGeneration(student) === Number(generation),
        );
        const fallback = applyFallbackPagination(filtered, page, limit);

        this.apiStudents = fallback.data;
        this.publicSelectedGeneration = generation;
        this.currentPage = fallback.page;
        this.limit = fallback.limit;
        this.total = fallback.total;
        this.lastPage = fallback.lastPage;
      } finally {
        this.loading = false;
      }
    },
  },
});
