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
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        bio: "Passionate Full Stack Developer specializing in modern web applications and AI integration.",
        skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker"],
        projects: [1, 4],
        achievements: ["Dean's List 2023-2024", "Best Full Stack Project 2023"],
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
        name: "Marcus Rodriguez",
        email: "marcus.rodriguez@gic.edu",
        program: "Software Engineering",
        year: "3rd Year",
        avatar: "https://randomuser.me/api/portraits/men/25.jpg",
        bio: "Mobile Developer focused on cross-platform applications and native iOS/Android development.",
        skills: ["React Native", "Swift", "Kotlin", "Firebase", "Flutter"],
        projects: [2, 7],
        achievements: ["Best Mobile App 2024", "Google Developer Scholarship"],
        social: {
          github: "https://github.com/marcusrod",
          linkedin: "https://linkedin.com/in/marcusrodriguez",
        },
        location: "Philippines",
        joinedDate: "2022-08-20",
        graduationYear: 2026,
        gpa: 3.78,
      },
      {
        id: 3,
        name: "Priya Patel",
        email: "priya.patel@gic.edu",
        program: "Information Systems",
        year: "4th Year",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        bio: "Network Administrator with expertise in enterprise infrastructure and cybersecurity protocols.",
        skills: ["Cisco", "Linux", "Network Security", "CCNA", "VMware"],
        projects: [3, 8],
        achievements: [
          "Cisco Networking Award",
          "IT Infrastructure Excellence",
        ],
        social: {
          github: "https://github.com/priyapatel",
          linkedin: "https://linkedin.com/in/priyapatel",
        },
        location: "India",
        joinedDate: "2021-08-10",
        graduationYear: 2025,
        gpa: 3.89,
      },
      {
        id: 4,
        name: "David Kim",
        email: "david.kim@gic.edu",
        program: "Data Science",
        year: "3rd Year",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg",
        bio: "Data Scientist specializing in machine learning and statistical analysis for business insights.",
        skills: ["Python", "R", "TensorFlow", "Pandas", "Jupyter", "SQL"],
        projects: [4, 9],
        achievements: [
          "Data Science Competition Winner",
          "Research Publication",
        ],
        social: {
          github: "https://github.com/davidkim",
          linkedin: "https://linkedin.com/in/davidkim-data",
        },
        location: "South Korea",
        joinedDate: "2022-08-15",
        graduationYear: 2026,
        gpa: 3.85,
      },
      {
        id: 5,
        name: "Emma Thompson",
        email: "emma.thompson@gic.edu",
        program: "Information Technology",
        year: "4th Year",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg",
        bio: "DevOps Engineer passionate about automation, CI/CD pipelines, and cloud infrastructure.",
        skills: ["Docker", "Kubernetes", "Jenkins", "AWS", "Terraform", "Git"],
        projects: [5, 10],
        achievements: ["Cloud Infrastructure Award", "DevOps Innovation Prize"],
        social: {
          github: "https://github.com/emmathompson",
          linkedin: "https://linkedin.com/in/emmathompson-devops",
        },
        location: "Canada",
        joinedDate: "2021-08-12",
        graduationYear: 2025,
        gpa: 3.94,
      },
      {
        id: 6,
        name: "Alex Johnson",
        email: "alex.johnson@gic.edu",
        program: "Cybersecurity",
        year: "3rd Year",
        avatar: "https://randomuser.me/api/portraits/men/33.jpg",
        bio: "Cybersecurity specialist focused on penetration testing and security infrastructure.",
        skills: [
          "Ethical Hacking",
          "Penetration Testing",
          "Wireshark",
          "Metasploit",
          "CISSP",
        ],
        projects: [6, 11],
        achievements: ["Cybersecurity Excellence Award", "CEH Certification"],
        social: {
          github: "https://github.com/alexjohnson",
          linkedin: "https://linkedin.com/in/alexjohnson-security",
        },
        location: "Australia",
        joinedDate: "2022-08-18",
        graduationYear: 2026,
        gpa: 3.87,
      },
      {
        id: 7,
        name: "Lisa Wang",
        email: "lisa.wang@gic.edu",
        program: "Artificial Intelligence",
        year: "4th Year",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg",
        bio: "AI/ML Engineer developing cutting-edge machine learning models and neural networks.",
        skills: [
          "PyTorch",
          "TensorFlow",
          "Deep Learning",
          "NLP",
          "Computer Vision",
        ],
        projects: [7, 12],
        achievements: ["AI Innovation Award", "Google AI Scholarship"],
        social: {
          github: "https://github.com/lisawang",
          linkedin: "https://linkedin.com/in/lisawang-ai",
        },
        location: "China",
        joinedDate: "2021-08-08",
        graduationYear: 2025,
        gpa: 3.96,
      },
      {
        id: 8,
        name: "Miguel Santos",
        email: "miguel.santos@gic.edu",
        program: "Computer Science",
        year: "2nd Year",
        avatar: "https://randomuser.me/api/portraits/men/15.jpg",
        bio: "Full Stack Developer with expertise in modern web frameworks and cloud platforms.",
        skills: ["Vue.js", "Express.js", "PostgreSQL", "Azure", "GraphQL"],
        projects: [8, 13],
        achievements: [
          "Rising Star Developer",
          "Microsoft Azure Certification",
        ],
        social: {
          github: "https://github.com/miguelsantos",
          linkedin: "https://linkedin.com/in/miguelsantos",
        },
        location: "Brazil",
        joinedDate: "2023-08-22",
        graduationYear: 2027,
        gpa: 3.82,
      },
      {
        id: 9,
        name: "Aisha Rahman",
        email: "aisha.rahman@gic.edu",
        program: "Mobile Development",
        year: "3rd Year",
        avatar: "https://randomuser.me/api/portraits/women/52.jpg",
        bio: "Mobile Developer creating innovative iOS and Android applications with modern frameworks.",
        skills: ["Swift", "Kotlin", "React Native", "Xamarin", "Mobile UI/UX"],
        projects: [9, 14],
        achievements: ["Best Mobile Innovation", "Apple WWDC Scholarship"],
        social: {
          github: "https://github.com/aisharahman",
          linkedin: "https://linkedin.com/in/aisharahman-mobile",
        },
        location: "Bangladesh",
        joinedDate: "2022-08-10",
        graduationYear: 2026,
        gpa: 3.88,
      },
      {
        id: 10,
        name: "Thomas Mueller",
        email: "thomas.mueller@gic.edu",
        program: "Network Engineering",
        year: "4th Year",
        avatar: "https://randomuser.me/api/portraits/men/47.jpg",
        bio: "Network Administrator specializing in enterprise network design and security protocols.",
        skills: [
          "CCNP",
          "Network Security",
          "Routing",
          "Switching",
          "Firewall",
        ],
        projects: [10, 15],
        achievements: [
          "Network Engineering Excellence",
          "Cisco Gold Certification",
        ],
        social: {
          github: "https://github.com/thomasmueller",
          linkedin: "https://linkedin.com/in/thomasmueller-network",
        },
        location: "Germany",
        joinedDate: "2021-08-05",
        graduationYear: 2025,
        gpa: 3.91,
      },
      {
        id: 11,
        name: "Sofia Petrov",
        email: "sofia.petrov@gic.edu",
        program: "Data Analytics",
        year: "3rd Year",
        avatar: "https://randomuser.me/api/portraits/women/38.jpg",
        bio: "Data Scientist focused on predictive analytics and business intelligence solutions.",
        skills: [
          "Python",
          "Tableau",
          "Power BI",
          "Statistical Analysis",
          "Machine Learning",
        ],
        projects: [11, 16],
        achievements: [
          "Analytics Innovation Award",
          "Tableau Student Ambassador",
        ],
        social: {
          github: "https://github.com/sofiapetrov",
          linkedin: "https://linkedin.com/in/sofiapetrov-data",
        },
        location: "Russia",
        joinedDate: "2022-08-12",
        graduationYear: 2026,
        gpa: 3.84,
      },
      {
        id: 12,
        name: "James O'Connor",
        email: "james.oconnor@gic.edu",
        program: "Cloud Computing",
        year: "2nd Year",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        bio: "DevOps Engineer passionate about cloud architecture and infrastructure automation.",
        skills: ["AWS", "Docker", "Kubernetes", "Ansible", "CloudFormation"],
        projects: [12, 17],
        achievements: ["Cloud Excellence Award", "AWS Solutions Architect"],
        social: {
          github: "https://github.com/jamesoconnor",
          linkedin: "https://linkedin.com/in/jamesoconnor-cloud",
        },
        location: "Ireland",
        joinedDate: "2023-08-15",
        graduationYear: 2027,
        gpa: 3.79,
      },
      {
        id: 13,
        name: "Yuki Tanaka",
        email: "yuki.tanaka@gic.edu",
        program: "Information Security",
        year: "4th Year",
        avatar: "https://randomuser.me/api/portraits/women/19.jpg",
        bio: "Cybersecurity expert specializing in threat analysis and security system implementation.",
        skills: [
          "Cybersecurity",
          "Threat Analysis",
          "SIEM",
          "Incident Response",
          "Forensics",
        ],
        projects: [13, 18],
        achievements: ["Security Research Award", "SANS Certification"],
        social: {
          github: "https://github.com/yukitanaka",
          linkedin: "https://linkedin.com/in/yukitanaka-security",
        },
        location: "Japan",
        joinedDate: "2021-08-20",
        graduationYear: 2025,
        gpa: 3.93,
      },
      {
        id: 14,
        name: "Carlos Martinez",
        email: "carlos.martinez@gic.edu",
        program: "Machine Learning",
        year: "3rd Year",
        avatar: "https://randomuser.me/api/portraits/men/35.jpg",
        bio: "AI/ML Engineer developing intelligent systems and neural network architectures.",
        skills: [
          "Machine Learning",
          "Deep Learning",
          "Python",
          "TensorFlow",
          "Keras",
        ],
        projects: [14, 19],
        achievements: ["ML Innovation Prize", "NVIDIA AI Certification"],
        social: {
          github: "https://github.com/carlosmartinez",
          linkedin: "https://linkedin.com/in/carlosmartinez-ml",
        },
        location: "Spain",
        joinedDate: "2022-08-08",
        graduationYear: 2026,
        gpa: 3.86,
      },
      {
        id: 15,
        name: "Rachel Green",
        email: "rachel.green@gic.edu",
        program: "Web Development",
        year: "2nd Year",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        bio: "Full Stack Developer creating responsive web applications with modern technologies.",
        skills: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
        projects: [15, 20],
        achievements: [
          "Web Development Excellence",
          "Frontend Masters Scholarship",
        ],
        social: {
          github: "https://github.com/rachelgreen",
          linkedin: "https://linkedin.com/in/rachelgreen-fullstack",
        },
        location: "United States",
        joinedDate: "2023-08-18",
        graduationYear: 2027,
        gpa: 3.81,
      },
      {
        id: 16,
        name: "Hassan Ali",
        email: "hassan.ali@gic.edu",
        program: "Mobile Engineering",
        year: "3rd Year",
        avatar: "https://randomuser.me/api/portraits/men/56.jpg",
        bio: "Mobile Developer building cross-platform applications with focus on performance optimization.",
        skills: ["Flutter", "React Native", "Dart", "Android", "iOS"],
        projects: [16, 21],
        achievements: ["Mobile App Excellence", "Flutter Community Leader"],
        social: {
          github: "https://github.com/hassanali",
          linkedin: "https://linkedin.com/in/hassanali-mobile",
        },
        location: "Egypt",
        joinedDate: "2022-08-14",
        graduationYear: 2026,
        gpa: 3.83,
      },
      {
        id: 17,
        name: "Nina Johansson",
        email: "nina.johansson@gic.edu",
        program: "Network Security",
        year: "4th Year",
        avatar: "https://randomuser.me/api/portraits/women/27.jpg",
        bio: "Network Administrator with deep expertise in cybersecurity and network infrastructure.",
        skills: [
          "Network Administration",
          "Cisco",
          "Security Protocols",
          "VPN",
          "Firewalls",
        ],
        projects: [17, 22],
        achievements: ["Network Security Champion", "CCNA Security Certified"],
        social: {
          github: "https://github.com/ninajohansson",
          linkedin: "https://linkedin.com/in/ninajohansson-network",
        },
        location: "Sweden",
        joinedDate: "2021-08-25",
        graduationYear: 2025,
        gpa: 3.9,
      },
      {
        id: 18,
        name: "Ryan Kumar",
        email: "ryan.kumar@gic.edu",
        program: "Data Engineering",
        year: "2nd Year",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
        bio: "Data Scientist working on big data analytics and machine learning pipeline optimization.",
        skills: ["Big Data", "Apache Spark", "Hadoop", "Python", "SQL"],
        projects: [18, 23],
        achievements: ["Data Engineering Award", "Cloudera Certification"],
        social: {
          github: "https://github.com/ryankumar",
          linkedin: "https://linkedin.com/in/ryankumar-data",
        },
        location: "United Kingdom",
        joinedDate: "2023-08-10",
        graduationYear: 2027,
        gpa: 3.77,
      },
      {
        id: 19,
        name: "Isabella Rodriguez",
        email: "isabella.rodriguez@gic.edu",
        program: "DevOps Engineering",
        year: "3rd Year",
        avatar: "https://randomuser.me/api/portraits/women/31.jpg",
        bio: "DevOps Engineer specializing in continuous integration and cloud infrastructure management.",
        skills: ["DevOps", "Jenkins", "Docker", "Kubernetes", "Monitoring"],
        projects: [19, 24],
        achievements: ["DevOps Innovation Award", "Docker Captain"],
        social: {
          github: "https://github.com/isabellarodriguez",
          linkedin: "https://linkedin.com/in/isabellarodriguez-devops",
        },
        location: "Mexico",
        joinedDate: "2022-08-16",
        graduationYear: 2026,
        gpa: 3.85,
      },
      {
        id: 20,
        name: "Kevin Zhang",
        email: "kevin.zhang@gic.edu",
        program: "AI Research",
        year: "4th Year",
        avatar: "https://randomuser.me/api/portraits/men/29.jpg",
        bio: "AI/ML Engineer researching advanced neural networks and artificial intelligence applications.",
        skills: [
          "Artificial Intelligence",
          "Neural Networks",
          "Research",
          "PyTorch",
          "Computer Vision",
        ],
        projects: [20, 25],
        achievements: ["AI Research Excellence", "Published IEEE Paper"],
        social: {
          github: "https://github.com/kevinzhang",
          linkedin: "https://linkedin.com/in/kevinzhang-ai",
        },
        location: "Taiwan",
        joinedDate: "2021-08-30",
        graduationYear: 2025,
        gpa: 3.97,
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
