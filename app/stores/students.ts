import { defineStore } from "pinia";
import type { ComputedRef } from "vue";
import {
  studentsData,
  studentPrograms,
  studentYears,
} from "~/constants/students";
import {
  studentService,
  type APIStudent,
} from "~/services/StudentService";

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
  byProgram: Record<string, Student[]>;
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
  publicSelectedGeneration: number;
  publicGenerations: number[];
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
    publicSelectedGeneration: 25,
    publicGenerations: [27, 26, 25, 24, 23, 22, 21, 20],
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

        const response = await studentService.fetchStudents(params, token);

        if (Array.isArray(response.data)) {
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
        return null;
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
        this.apiStudents = [];
        this.total = 0;
        this.currentPage = 1;
        this.lastPage = 1;
      } finally {
        this.loading = false;
      }
    },
  },
});
