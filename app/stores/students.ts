import { defineStore } from "pinia";
import type { ComputedRef } from "vue";

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
    students: [
      {
        id: 1,
        name: "Sarah Chen",
        email: "sarah.chen@gic.edu",
        program: "Computer Science",
        year: "4th Year",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=200&h=200&fit=crop&crop=face",
        bio: "Passionate about AI and machine learning applications in education. Currently working on my thesis about adaptive learning systems.",
        skills: [
          "Python",
          "TensorFlow",
          "React",
          "MongoDB",
          "Docker",
          "Machine Learning",
          "Data Science",
        ],
        projects: [1, 4],
        achievements: [
          "Dean's List 2023-2024",
          "Best AI Project Award 2023",
          "Google Summer of Code Participant 2023",
        ],
        social: {
          github: "https://github.com/sarahchen",
          linkedin: "https://linkedin.com/in/sarahchen",
          portfolio: "https://sarahchen.dev",
        },
        location: "Singapore",
        joinedDate: "2021-08-15",
        graduationYear: 2025,
        gpa: 3.92,
      },
      {
        id: 2,
        name: "Marcus Johnson",
        email: "marcus.johnson@gic.edu",
        program: "Software Engineering",
        year: "3rd Year",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        bio: "Mobile development enthusiast with a focus on augmented reality and cross-platform applications. Love creating intuitive user experiences.",
        skills: [
          "Unity",
          "ARCore",
          "C#",
          "Firebase",
          "Kotlin",
          "Swift",
          "React Native",
        ],
        projects: [2],
        achievements: [
          "Best Mobile App Award 2024",
          "Hackathon Winner 2023",
          "Google Developer Student Club Lead",
        ],
        social: {
          github: "https://github.com/mjohnson",
          linkedin: "https://linkedin.com/in/marcusjohnson",
          portfolio: "https://marcusj.dev",
        },
        location: "Malaysia",
        joinedDate: "2022-08-20",
        graduationYear: 2026,
        gpa: 3.78,
      },
      {
        id: 3,
        name: "Emily Rodriguez",
        email: "emily.rodriguez@gic.edu",
        program: "Environmental Science",
        year: "4th Year",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
        bio: "Environmental data scientist working on sustainability solutions. Combining technology with environmental research for positive impact.",
        skills: [
          "Vue.js",
          "Node.js",
          "PostgreSQL",
          "Chart.js",
          "IoT",
          "Data Analysis",
          "GIS",
        ],
        projects: [3],
        achievements: [
          "Environmental Innovation Award 2024",
          "Sustainability Research Grant Recipient",
          "Published Research Paper on Campus Sustainability",
        ],
        social: {
          github: "https://github.com/erodriguez",
          linkedin: "https://linkedin.com/in/emilyrodriguez",
          portfolio: "https://emilyrodriguez.eco",
        },
        location: "Philippines",
        joinedDate: "2021-08-10",
        graduationYear: 2025,
        gpa: 3.89,
      },
      {
        id: 4,
        name: "David Kim",
        email: "david.kim@gic.edu",
        program: "Information Systems",
        year: "3rd Year",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
        bio: "Full-stack developer with expertise in enterprise systems and database design. Interested in scalable architecture and cloud technologies.",
        skills: [
          "Angular",
          "Spring Boot",
          "MySQL",
          "ElasticSearch",
          "Docker",
          "AWS",
          "Microservices",
        ],
        projects: [4],
        achievements: [
          "Outstanding Academic Performance 2023",
          "AWS Certified Solutions Architect",
          "Internship at Tech Innovation Lab",
        ],
        social: {
          github: "https://github.com/dkim",
          linkedin: "https://linkedin.com/in/davidkim",
          portfolio: "https://davidkim.tech",
        },
        location: "South Korea",
        joinedDate: "2022-08-15",
        graduationYear: 2026,
        gpa: 3.85,
      },
      {
        id: 5,
        name: "Aisha Patel",
        email: "aisha.patel@gic.edu",
        program: "Health Informatics",
        year: "4th Year",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
        bio: "Health technology advocate combining healthcare knowledge with software development. Passionate about improving healthcare accessibility.",
        skills: [
          "React Native",
          "Express.js",
          "MongoDB",
          "Socket.io",
          "Chart.js",
          "FHIR",
          "Healthcare APIs",
        ],
        projects: [5],
        achievements: [
          "Health Innovation Award 2024",
          "Research Assistant in Digital Health Lab",
          "Presented at International Health Informatics Conference",
        ],
        social: {
          github: "https://github.com/apatel",
          linkedin: "https://linkedin.com/in/aishapatel",
          portfolio: "https://aishapatel.health",
        },
        location: "India",
        joinedDate: "2021-08-12",
        graduationYear: 2025,
        gpa: 3.94,
      },
      {
        id: 6,
        name: "Alex Thompson",
        email: "alex.thompson@gic.edu",
        program: "Cybersecurity",
        year: "4th Year",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
        bio: "Blockchain and cybersecurity specialist. Focused on developing secure, decentralized systems and protecting digital assets.",
        skills: [
          "Solidity",
          "Web3.js",
          "React",
          "Ethereum",
          "IPFS",
          "Penetration Testing",
          "Cryptography",
        ],
        projects: [6],
        achievements: [
          "Cybersecurity Excellence Award 2023",
          "Certified Ethical Hacker (CEH)",
          "Blockchain Hackathon Winner 2023",
        ],
        social: {
          github: "https://github.com/athompson",
          linkedin: "https://linkedin.com/in/alexthompson",
          portfolio: "https://alexthompson.security",
        },
        location: "Canada",
        joinedDate: "2021-08-18",
        graduationYear: 2025,
        gpa: 3.87,
      },
    ],
    programs: [
      "All",
      "Computer Science",
      "Software Engineering",
      "Environmental Science",
      "Information Systems",
      "Health Informatics",
      "Cybersecurity",
      "Data Science",
      "Digital Innovation",
    ],
    years: ["All", "1st Year", "2nd Year", "3rd Year", "4th Year"],
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
