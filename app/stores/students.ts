import { defineStore } from "pinia";
import type { ComputedRef } from "vue";
import {
  studentsData,
  studentPrograms,
  studentYears,
} from "~/constants/students";
import { authService } from "~/services/AuthService";

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
  joinedDate: string;
  graduationYear: number;
  gen: number;
}

// API Student Interface
export interface APIStudent {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  year?: number;
  generation?: number;
  avatar?: string;
  bio?: string;
  skill?: string[] | null;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  courses?: any[];
  role?: string;
}

export interface PaginatedResponse {
  data: APIStudent[];
  page: number;
  limit: number;
  total: number;
  lastPage: number;
}

export interface StudentFilters {
  program: string;
  year: string;
  search: string;
  sortBy: "name" | "program" | "year" | "gpa" | "projects";
}

export interface StudentStats {
  total: number;
  byProgram: Record<string, Student[]>;
  graduating2025: number;
  graduating2026: number;
}

export interface StudentState {
  students: Student[];
  programs: string[];
  years: string[];
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
}

export const useStudentStore = defineStore("students", {
  state: (): StudentState => ({
    students: studentsData,
    programs: studentPrograms,
    years: studentYears,
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
  }),

  getters: {
    filteredStudents(): Student[] {
      let filtered = [...this.students];

      // Apply program filter
      if (this.filters.program !== "All") {
        filtered = filtered.filter(
          (student) => student.program === this.filters.program,
        );
      }

      // Apply year filter
      if (this.filters.year !== "All") {
        filtered = filtered.filter(
          (student) => student.year === this.filters.year,
        );
      }

      // Apply search filter
      if (this.filters.search) {
        const searchTerm = this.filters.search.toLowerCase();
        filtered = filtered.filter(
          (student) =>
            student.name.toLowerCase().includes(searchTerm) ||
            student.program.toLowerCase().includes(searchTerm) ||
            student.bio.toLowerCase().includes(searchTerm) ||
            student.skills.some((skill) =>
              skill.toLowerCase().includes(searchTerm),
            ),
        );
      }

      // Apply sorting
      switch (this.filters.sortBy) {
        case "name":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "program":
          filtered.sort((a, b) => a.program.localeCompare(b.program));
          break;
        case "year":
          filtered.sort((a, b) => b.graduationYear - a.graduationYear);
          break;
        case "projects":
          filtered.sort((a, b) => b.projects.length - a.projects.length);
          break;
      }

      return filtered;
    },

    studentsByProgram(): Record<string, Student[]> {
      const programMap: Record<string, Student[]> = {};
      this.students.forEach((student) => {
        if (!programMap[student.program]) {
          programMap[student.program] = [];
        }
        programMap[student.program].push(student);
      });
      return programMap;
    },

    studentStats(): StudentStats {
      return {
        total: this.students.length,
        byProgram: this.studentsByProgram,
        graduating2025: this.students.filter((s) => s.graduationYear === 2025)
          .length,
        graduating2026: this.students.filter((s) => s.graduationYear === 2026)
          .length,
      };
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

    getStudent(id: number | string): Student | undefined {
      return this.students.find(
        (student) => student.id === Number.parseInt(id.toString()),
      );
    },

    getStudentsByProgram(program: string): Student[] {
      return this.students.filter((student) => student.program === program);
    },

    searchStudents(query: string): Student[] {
      const searchTerm = query.toLowerCase();
      return this.students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm) ||
          student.program.toLowerCase().includes(searchTerm) ||
          student.skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm),
          ),
      );
    },

    // Search with structured results for search dropdown
    searchStudentsWithResults(query: string) {
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

      // Search by program
      this.programs.forEach((program) => {
        if (program.toLowerCase().includes(searchTerm) && program !== "All") {
          const key = `program-${program}`;
          if (!addedItems.has(key)) {
            addedItems.add(key);
            results.push({
              type: "category",
              icon: "i-heroicons-academic-cap-20-solid",
              value: program,
              label: program,
              subtitle: "Program",
              count: this.students.filter((s) => s.program === program).length,
            });
          }
        }
      });

      // Search by student name
      this.students.forEach((student) => {
        if (student.name.toLowerCase().includes(searchTerm)) {
          const key = `name-${student.name}`;
          if (!addedItems.has(key) && results.length < 10) {
            addedItems.add(key);
            results.push({
              type: "title",
              icon: "i-heroicons-user-20-solid",
              value: student.name,
              label: student.name,
              subtitle: "Student Name",
              category: student.program,
            });
          }
        }
      });

      // Search by skills
      this.students.forEach((student) => {
        const matchingSkills = student.skills.filter((skill) =>
          skill.toLowerCase().includes(searchTerm),
        );
        if (matchingSkills.length > 0) {
          const key = `skill-${student.name}`;
          if (!addedItems.has(key) && results.length < 10) {
            addedItems.add(key);
            results.push({
              type: "description",
              icon: "i-heroicons-code-bracket-20-solid",
              value: student.name,
              label: student.name,
              subtitle: `Skills: ${matchingSkills.join(", ")}`,
              category: student.program,
            });
          }
        }
      });

      return results.slice(0, 8);
    },

    // API-based actions
    async loadStudents(token: string) {
      this.loading = true;
      try {
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

        const response = await $fetch<PaginatedResponse>(`/api/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        });

        // Set students directly from response (already filtered by API)
        if (response.data && Array.isArray(response.data)) {
          this.apiStudents = response.data;
          this.total = response.total;
          this.lastPage = response.lastPage;
          this.currentPage = response.page;
        }
      } catch (error) {
        console.error("Error loading students:", error);
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
        const response = await $fetch("/api/users", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: {
            ...studentData,
            role: "STUDENT",
          },
        });

        return response;
      } catch (error: any) {
        console.error("Error creating student:", error);
        throw new Error(error.data?.message || "Failed to create student");
      }
    },

    async updateStudent(studentId: string, studentData: any, token: string) {
      try {
        await $fetch(`/api/users/${studentId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: {
            ...studentData,
            role: "STUDENT",
          },
        });

        // Refresh local state
        const idx = this.apiStudents.findIndex((s) => s.id === studentId);
        if (idx !== -1) {
          this.apiStudents[idx] = { ...this.apiStudents[idx], ...studentData };
        }
      } catch (error: any) {
        console.error("Error updating student:", error);
        throw new Error(error.data?.message || "Failed to update student");
      }
    },

    async deleteStudent(studentId: string, token: string) {
      try {
        await $fetch(`/api/users/${studentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
        const formData = new FormData();

        const headers = await authService.getAuthHeaders();
        formData.append("file", file);

        // this api is use to upload csv file to server
        const response = await $fetch("/api/real-student/upload", {
          method: "POST",
          headers,
          body: formData,
        });

        return response;
      } catch (error: any) {
        console.error("Error uploading CSV:", error);
        throw new Error(error.data?.message || "Failed to upload CSV file");
      }
    },
  },
});
