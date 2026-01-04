import { defineStore } from "pinia";
import type { ComputedRef } from "vue";
import { studentsData, studentPrograms, studentYears } from "~/constants/students";

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
  location: string;
  joinedDate: string;
  graduationYear: number;
  gen: number;
  gpa: number;
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
  averageGPA: string;
  graduating2025: number;
  graduating2026: number;
}

export interface StudentState {
  students: Student[];
  programs: string[];
  years: string[];
  filters: StudentFilters;
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
  }),

  getters: {
    filteredStudents(): Student[] {
      let filtered = [...this.students];

      // Apply program filter
      if (this.filters.program !== "All") {
        filtered = filtered.filter(
          (student) => student.program === this.filters.program
        );
      }

      // Apply year filter
      if (this.filters.year !== "All") {
        filtered = filtered.filter(
          (student) => student.year === this.filters.year
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
              skill.toLowerCase().includes(searchTerm)
            )
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
        case "gpa":
          filtered.sort((a, b) => b.gpa - a.gpa);
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
        averageGPA: (
          this.students.reduce((sum, s) => sum + s.gpa, 0) /
          this.students.length
        ).toFixed(2),
        graduating2025: this.students.filter((s) => s.graduationYear === 2025)
          .length,
        graduating2026: this.students.filter((s) => s.graduationYear === 2026)
          .length,
      };
    },

    topPerformers(): Student[] {
      return [...this.students].sort((a, b) => b.gpa - a.gpa).slice(0, 5);
    },
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
        (student) => student.id === Number.parseInt(id.toString())
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
            skill.toLowerCase().includes(searchTerm)
          )
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
          skill.toLowerCase().includes(searchTerm)
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
  },
});
