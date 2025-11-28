import { defineStore } from "pinia";
import type { ComputedRef } from "vue";
import { ca } from "zod/locales";

// Types
export interface ProjectAuthor {
  name: string;
  avatar: string;
  program: string;
  year: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  semester: string;
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
  roadmap?: string[];
  duration?: string;
  course?: string;
}

export interface ProjectStats {
  total: number;
  completed: number;
  inProgress: number;
  totalLikes: number;
  totalViews: number;
}

export interface ProjectState {
  projects: Project[];
  categories: string[];
  loading: boolean;
}

export const useProjectStore = defineStore("projects", {
  state: (): ProjectState => ({
    projects: [
      {
        id: 1,
        title: "AI Study Assistant",
        description:
          "Machine learning application that helps students optimize their study schedules using advanced algorithms and personalized learning patterns.",
        semester: "Fall 2024",
        author: {
          name: "Sarah Chen",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=100&h=100&fit=crop&crop=face",
          program: "Computer Science",
          year: "4th Year",
        },
        technologies: ["Python", "TensorFlow", "React", "MongoDB", "Docker"],
        category: "Artificial Intelligence",
        status: "Completed",
        featured: true,
        likes: 245,
        views: 1842,
        demoUrl: "https://ai-study-assistant.demo.com",
        githubUrl: "https://github.com/sarahchen/ai-study-assistant",
        images: [
          "https://images.unsplash.com/photo-1763182198113-a9a8d0fe3144?w=900&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1763669029223-74f911a9e08b?w=900&auto=format&fit=crop&q=60",
          "https://plus.unsplash.com/premium_photo-1731286446855-c0bd3d23af46?w=900&auto=format&fit=crop&q=60",
        ],
        createdAt: "2024-10-15",
        tags: ["machine-learning", "education", "productivity"],
        members: [
          {
            name: "Sarah Chen",
            image: "https://randomuser.me/api/portraits/women/11.jpg",
          },
          {
            name: "Alex Park",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          {
            name: "Jordan Lee",
            image: "https://randomuser.me/api/portraits/men/54.jpg",
          },
          {
            name: "Emma Davis",
            image: "https://randomuser.me/api/portraits/women/78.jpg",
          },
        ],
        roadmap: [
          "Phase 1: GPT-3 Integration",
          "Phase 2: Conversation History",
          "Phase 3: Multi-language Support",
          "Phase 4: Production Deployment",
        ],
        duration: "3 months",
        course: "Advanced AI & Machine Learning",
      },
      {
        id: 2,
        title: "Campus Navigator AR",
        description:
          "Augmented reality mobile application that helps students and visitors navigate the campus efficiently with real-time directions and points of interest.",
        semester: "Fall 2024",
        author: {
          name: "Marcus Johnson",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          program: "Software Engineering",
          year: "3rd Year",
        },
        technologies: ["Unity", "ARCore", "C#", "Firebase", "Google Maps API"],
        category: "Mobile Development",
        status: "In Progress",
        featured: true,
        likes: 189,
        views: 1337,
        demoUrl: "https://campus-navigator.demo.com",
        githubUrl: "https://github.com/mjohnson/campus-navigator",
        images: [
          "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&fit=crop",
          "https://images.unsplash.com/photo-1763854492937-fb7ae2f601f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMXx8fGVufDB8fHx8fA%3D%3D",
          "https://images.unsplash.com/photo-1763667309360-30d7e3779382?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D",
        ],
        createdAt: "2024-09-22",
        tags: ["augmented-reality", "navigation", "mobile"],
        members: [
          {
            name: "Marcus Johnson",
            image: "https://randomuser.me/api/portraits/men/21.jpg",
          },
          {
            name: "Maria Garcia",
            image: "https://randomuser.me/api/portraits/women/45.jpg",
          },
          {
            name: "Sam Wilson",
            image: "https://randomuser.me/api/portraits/men/67.jpg",
          },
        ],
        roadmap: [
          "Phase 1: AR Core Integration",
          "Phase 2: Real-time Navigation",
          "Phase 3: Points of Interest",
          "Phase 4: Production Deployment",
        ],
        duration: "4 months",
        course: "Mobile App Development",
      },
      {
        id: 3,
        title: "Sustainability Tracker",
        description:
          "Comprehensive platform for tracking and analyzing campus environmental impact with real-time monitoring and actionable insights for sustainability.",
        semester: "Summer 2024",
        author: {
          name: "Emily Rodriguez",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          program: "Environmental Science",
          year: "4th Year",
        },
        technologies: [
          "Vue.js",
          "Node.js",
          "PostgreSQL",
          "Chart.js",
          "IoT Sensors",
        ],
        category: "Environmental Tech",
        status: "Completed",
        featured: false,
        likes: 156,
        views: 892,
        demoUrl: "https://sustainability-tracker.demo.com",
        githubUrl: "https://github.com/erodriguez/sustainability-tracker",
        images: [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop",
          "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&fit=crop",
          "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVjaGFuaWNzfGVufDB8fDB8fHww",
        ],
        createdAt: "2024-08-10",
        tags: ["sustainability", "environment", "data-visualization"],
        members: [
          {
            name: "Emily Rodriguez",
            image: "https://randomuser.me/api/portraits/women/41.jpg",
          },
          {
            name: "Jordan Kim",
            image: "https://randomuser.me/api/portraits/men/88.jpg",
          },
          {
            name: "Nina Patel",
            image: "https://randomuser.me/api/portraits/women/42.jpg",
          },
        ],
        roadmap: [
          "Phase 1: IoT Sensor Integration",
          "Phase 2: Data Collection System",
          "Phase 3: Analytics Dashboard",
          "Phase 4: Reporting & Insights",
        ],
        duration: "5 months",
        course: "IoT & Environmental Tech",
      },
      {
        id: 4,
        title: "Smart Library System",
        description:
          "Digital library management system with AI-powered book recommendations, automated inventory tracking, and seamless user experience.",
        semester: "Spring 2024",
        author: {
          name: "David Kim",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          program: "Information Systems",
          year: "3rd Year",
        },
        technologies: [
          "Angular",
          "Spring Boot",
          "MySQL",
          "ElasticSearch",
          "Docker",
        ],
        category: "Information Systems",
        status: "Completed",
        featured: false,
        likes: 203,
        views: 1456,
        demoUrl: "https://smart-library.demo.com",
        githubUrl: "https://github.com/dkim/smart-library",
        images: [
          "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&fit=crop",
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&fit=crop",
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&fit=crop",
        ],
        createdAt: "2024-05-20",
        tags: ["library", "ai-recommendations", "management-system"],
        members: [
          {
            name: "David Kim",
            image: "https://randomuser.me/api/portraits/men/34.jpg",
          },
          {
            name: "Priya Patel",
            image: "https://randomuser.me/api/portraits/women/90.jpg",
          },
          {
            name: "Lisa Brown",
            image: "https://randomuser.me/api/portraits/women/23.jpg",
          },
        ],
        roadmap: [
          "Phase 1: AI Recommendation Engine",
          "Phase 2: Inventory Management",
          "Phase 3: User Interface",
          "Phase 4: Testing & Launch",
        ],
        duration: "4 months",
        course: "Information Systems Management",
      },
      {
        id: 5,
        title: "Health & Wellness Dashboard",
        description:
          "Student wellness tracking application with mental health resources, fitness goals, and peer support community features.",
        semester: "Spring 2024",
        author: {
          name: "Aisha Patel",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
          program: "Health Informatics",
          year: "4th Year",
        },
        technologies: [
          "React Native",
          "Express.js",
          "MongoDB",
          "Socket.io",
          "Chart.js",
        ],
        category: "Health Tech",
        status: "Completed",
        featured: true,
        likes: 287,
        views: 2156,
        demoUrl: "https://wellness-dashboard.demo.com",
        githubUrl: "https://github.com/apatel/wellness-dashboard",
        images: [
          "https://plus.unsplash.com/premium_photo-1664701474750-e3b51072957e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtYXJhJTIwbWFufGVufDB8fDB8fHww",
          "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&fit=crop",
          "https://images.unsplash.com/photo-1577918248023-62b9a2748a22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtYXJhJTIwbWFufGVufDB8fDB8fHww",
        ],
        createdAt: "2024-04-15",
        tags: ["health", "wellness", "community", "mental-health"],
        members: [
          {
            name: "Aisha Patel",
            image: "https://randomuser.me/api/portraits/women/16.jpg",
          },
          {
            name: "Robert Chang",
            image: "https://randomuser.me/api/portraits/men/52.jpg",
          },
          {
            name: "Maya Singh",
            image: "https://randomuser.me/api/portraits/women/33.jpg",
          },
          {
            name: "James Miller",
            image: "https://randomuser.me/api/portraits/men/44.jpg",
          },
        ],
        roadmap: [
          "Phase 1: Mental Health Resources",
          "Phase 2: Fitness Tracking",
          "Phase 3: Community Features",
          "Phase 4: Integration & Launch",
        ],
        duration: "6 months",
        course: "Health Informatics",
      },
      {
        id: 6,
        title: "Blockchain Voting System",
        description:
          "Secure and transparent student government voting platform built on blockchain technology ensuring tamper-proof elections.",
        semester: "Fall 2023",
        author: {
          name: "Alex Thompson",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
          program: "Cybersecurity",
          year: "4th Year",
        },
        technologies: ["Solidity", "Web3.js", "React", "Ethereum", "IPFS"],
        category: "Blockchain",
        status: "Completed",
        featured: false,
        likes: 178,
        views: 1234,
        demoUrl: "https://blockchain-voting.demo.com",
        githubUrl: "https://github.com/athompson/blockchain-voting",
        images: [
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&fit=crop",
          "https://plus.unsplash.com/premium_photo-1661764256397-af154e87b1b3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ],
        createdAt: "2023-11-08",
        tags: ["blockchain", "voting", "security", "ethereum"],
        members: [
          {
            name: "Alex Thompson",
            image: "https://randomuser.me/api/portraits/men/11.jpg",
          },
          {
            name: "Jessica Lee",
            image: "https://randomuser.me/api/portraits/women/29.jpg",
          },
          {
            name: "Kevin Chen",
            image: "https://randomuser.me/api/portraits/men/75.jpg",
          },
        ],
        roadmap: [
          "Phase 1: Smart Contract Development",
          "Phase 2: Web3 Integration",
          "Phase 3: Security Audit",
          "Phase 4: Deployment & Testing",
        ],
        duration: "5 months",
        course: "Blockchain & Cybersecurity",
      },
    ],
    categories: [
      "All",
      "Artificial Intelligence",
      "Mobile Development",
      "Environmental Tech",
      "Information Systems",
      "Health Tech",
      "Blockchain",
      "Web Development",
      "Data Science",
    ],
    loading: false,
  }),

  getters: {
    featuredProjects(): Project[] {
      return this.projects.filter((project) => project.featured).slice(0, 3);
    },

    projectsByCategory(): Record<string, Project[]> {
      const categoryMap: Record<string, Project[]> = {};
      this.projects.forEach((project) => {
        if (!categoryMap[project.category]) {
          categoryMap[project.category] = [];
        }
        categoryMap[project.category].push(project);
      });
      return categoryMap;
    },

    projectStats(): ProjectStats {
      return {
        total: this.projects.length,
        completed: this.projects.filter((p) => p.status === "Completed").length,
        inProgress: this.projects.filter((p) => p.status === "In Progress")
          .length,
        totalLikes: this.projects.reduce((sum, p) => sum + p.likes, 0),
        totalViews: this.projects.reduce((sum, p) => sum + p.views, 0),
      };
    },
  },

  actions: {
    // Simulate fetch project state
    // In real application, this would involve API calls
    // 1. fetch Category data from server

    async fetchFeaturedProjects(): Promise<Project[]> {
      this.loading = true;
      try {
        // simulate network delay for 1 s
        await new Promise((resolve) => setTimeout(resolve, 100));

        const featuredProjects: Project[] = [
          {
            id: 1,
            title: "AI Chat Assistant",
            description:
              "An intelligent chatbot powered by GPT-3 for customer support. This project aims to enhance user experience by providing instant and accurate responses to common inquiries.",
            semester: "Fall 2024",
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
          },

          {
            id: 2,
            title: "Mobile Fitness App",
            description:
              "Track workouts, nutrition, and health metrics on the go.",
            semester: "Fall 2024",
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
          },

          {
            id: 3,
            title: "E-Commerce Platform",
            description:
              "Full-stack online store with payment integration and analytics.",
            semester: "Summer 2024",
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
          "Environmental Tech",
          "Information Systems",
          "Health Tech",
          "Blockchain",
          "Web Development",
          "Data Science",
        ];
        return (this.categories = categories);
      } finally {
        this.loading = false;
      }
    },

    // 2. fetch Projects data from server

    async fetchProjects(): Promise<any[]> {
      this.loading = true;
      try {
        // simulate network delay
        // await new Promise((resolve) => setTimeout(resolve, 100));
        // return current projects (in a real app this would come from an API)

        // const projects: Project[] = [
        //   {
        //     id: 1,
        //     title: "AI Chat Assistant",
        //     description:
        //       "An intelligent chatbot powered by GPT-3 for customer support. This project aims to enhance user experience by providing instant and accurate responses to common inquiries.",
        //     semester: "Fall 2024",
        //     author: {
        //       name: "Sarah Chen",
        //       avatar: "https://randomuser.me/api/portraits/women/11.jpg",
        //       program: "Computer Science",
        //       year: "4th Year",
        //     },
        //     technologies: ["Python", "GPT-3", "React", "Node.js", "MongoDB"],
        //     category: "Artificial Intelligence",
        //     status: "Completed",
        //     featured: true,
        //     likes: 342,
        //     views: 2500,
        //     demoUrl: "https://ai-chat-assistant.demo.com",
        //     githubUrl: "https://github.com/sarahchen/ai-chat-assistant",
        //     images: [
        //       "https://images.unsplash.com/photo-1763182198113-a9a8d0fe3144?w=900&auto=format&fit=crop&q=60",
        //       "https://images.unsplash.com/photo-1763669029223-74f911a9e08b?w=900&auto=format&fit=crop&q=60",
        //       "https://plus.unsplash.com/premium_photo-1731286446855-c0bd3d23af46?w=900&auto=format&fit=crop&q=60",
        //     ],
        //     createdAt: "2024-10-15",
        //     tags: ["ai", "chatbot", "customer-support"],
        //     members: [
        //       {
        //         name: "Sarah Chen",
        //         image: "https://randomuser.me/api/portraits/women/11.jpg",
        //       },
        //       {
        //         name: "Alex Park",
        //         image: "https://randomuser.me/api/portraits/men/32.jpg",
        //       },
        //       {
        //         name: "Jordan Lee",
        //         image: "https://randomuser.me/api/portraits/men/54.jpg",
        //       },
        //       {
        //         name: "Emma Davis",
        //         image: "https://randomuser.me/api/portraits/women/78.jpg",
        //       },
        //     ],
        //     roadmap: [
        //       "Phase 1: GPT-3 Integration",
        //       "Phase 2: Conversation History",
        //       "Phase 3: Multi-language Support",
        //       "Phase 4: Production Deployment",
        //     ],
        //     duration: "3 months",
        //     course: "Advanced AI & Machine Learning",
        //   },

        //   {
        //     id: 2,
        //     title: "Mobile Fitness App",
        //     description:
        //       "Track workouts, nutrition, and health metrics on the go.",
        //     semester: "Fall 2024",
        //     author: {
        //       name: "Alex Rodriguez",
        //       avatar: "https://randomuser.me/api/portraits/men/21.jpg",
        //       program: "Mobile Development",
        //       year: "3rd Year",
        //     },
        //     technologies: ["React Native", "Firebase", "Redux", "HealthKit"],
        //     category: "Mobile Development",
        //     status: "In Progress",
        //     featured: false,
        //     likes: 256,
        //     views: 1800,
        //     demoUrl: "https://fitness-app.demo.com",
        //     githubUrl: "https://github.com/arodriguez/fitness-app",
        //     images: [
        //       "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&fit=crop",
        //       "https://images.unsplash.com/photo-1763854492937-fb7ae2f601f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMXx8fGVufDB8fHx8fA%3D%3D",
        //       "https://images.unsplash.com/photo-1763667309360-30d7e3779382?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D",
        //     ],
        //     createdAt: "2024-09-22",
        //     tags: ["fitness", "mobile", "health"],
        //     members: [
        //       {
        //         name: "Alex Rodriguez",
        //         image: "https://randomuser.me/api/portraits/men/21.jpg",
        //       },
        //       {
        //         name: "Maria Garcia",
        //         image: "https://randomuser.me/api/portraits/women/45.jpg",
        //       },
        //       {
        //         name: "Sam Wilson",
        //         image: "https://randomuser.me/api/portraits/men/67.jpg",
        //       },
        //     ],
        //     roadmap: [
        //       "Phase 1: Core Features",
        //       "Phase 2: Social Integration",
        //       "Phase 3: Wearable Sync",
        //       "Phase 4: Launch",
        //     ],
        //     duration: "4 months",
        //     course: "Mobile App Development",
        //   },

        //   {
        //     id: 3,
        //     title: "E-Commerce Platform",
        //     description:
        //       "Full-stack online store with payment integration and analytics.",
        //     semester: "Summer 2024",
        //     author: {
        //       name: "Priya Patel",
        //       avatar: "https://randomuser.me/api/portraits/women/90.jpg",
        //       program: "Web Development",
        //       year: "4th Year",
        //     },
        //     technologies: [
        //       "Next.js",
        //       "Stripe",
        //       "PostgreSQL",
        //       "Tailwind",
        //       "Vercel",
        //     ],
        //     category: "Web Development",
        //     status: "Completed",
        //     featured: true,
        //     likes: 489,
        //     views: 3200,
        //     demoUrl: "https://ecommerce-platform.demo.com",
        //     githubUrl: "https://github.com/ppatel/ecommerce-platform",
        //     images: [
        //       "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&fit=crop",
        //       "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&fit=crop",
        //       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&fit=crop",
        //     ],
        //     createdAt: "2024-08-10",
        //     tags: ["ecommerce", "payment", "analytics"],
        //     members: [
        //       {
        //         name: "Priya Patel",
        //         image: "https://randomuser.me/api/portraits/women/90.jpg",
        //       },
        //       {
        //         name: "David Chen",
        //         image: "https://randomuser.me/api/portraits/men/34.jpg",
        //       },
        //       {
        //         name: "Lisa Brown",
        //         image: "https://randomuser.me/api/portraits/women/23.jpg",
        //       },
        //       {
        //         name: "Tom Anderson",
        //         image: "https://randomuser.me/api/portraits/men/56.jpg",
        //       },
        //       {
        //         name: "Sarah White",
        //         image: "https://randomuser.me/api/portraits/women/12.jpg",
        //       },
        //     ],
        //     roadmap: [
        //       "Phase 1: Product Catalog",
        //       "Phase 2: Payment Integration",
        //       "Phase 3: Analytics Dashboard",
        //       "Phase 4: Production Launch",
        //     ],
        //     duration: "6 months",
        //     course: "Full Stack Web Development",
        //   },

        //   {
        //     id: 4,
        //     title: "Climate Monitoring IoT",
        //     description:
        //       "IoT sensors and dashboard for environmental monitoring.",
        //     semester: "Spring 2024",
        //     author: {
        //       name: "Jordan Kim",
        //       avatar: "https://randomuser.me/api/portraits/men/88.jpg",
        //       program: "Environmental Science",
        //       year: "4th Year",
        //     },
        //     technologies: [
        //       "Arduino",
        //       "Node.js",
        //       "MQTT",
        //       "Chart.js",
        //       "Raspberry Pi",
        //     ],
        //     category: "Environmental Tech",
        //     status: "Completed",
        //     featured: false,
        //     likes: 178,
        //     views: 1200,
        //     demoUrl: "https://climate-iot.demo.com",
        //     githubUrl: "https://github.com/jkim/climate-iot",
        //     images: [
        //       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop",
        //       "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&fit=crop",
        //       "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVjaGFuaWNzfGVufDB8fDB8fHww",
        //     ],
        //     createdAt: "2024-05-20",
        //     tags: ["iot", "environment", "sensors"],
        //     members: [
        //       {
        //         name: "Jordan Kim",
        //         image: "https://randomuser.me/api/portraits/men/88.jpg",
        //       },
        //       {
        //         name: "Nina Patel",
        //         image: "https://randomuser.me/api/portraits/women/41.jpg",
        //       },
        //       {
        //         name: "Chris Lee",
        //         image: "https://randomuser.me/api/portraits/men/25.jpg",
        //       },
        //     ],
        //     roadmap: [
        //       "Phase 1: Sensor Setup",
        //       "Phase 2: Data Collection",
        //       "Phase 3: Dashboard",
        //       "Phase 4: Deployment",
        //     ],
        //     duration: "5 months",
        //     course: "IoT & Environmental Tech",
        //   },

        //   {
        //     id: 5,
        //     title: "Machine Learning Pipeline",
        //     description:
        //       "Automated data processing and model training framework.",
        //     semester: "Spring 2024",
        //     author: {
        //       name: "Emma Watson",
        //       avatar: "https://randomuser.me/api/portraits/women/16.jpg",
        //       program: "Data Science",
        //       year: "4th Year",
        //     },
        //     technologies: [
        //       "Python",
        //       "TensorFlow",
        //       "Docker",
        //       "Airflow",
        //       "MLflow",
        //     ],
        //     category: "Artificial Intelligence",
        //     status: "Completed",
        //     featured: false,
        //     likes: 312,
        //     views: 2100,
        //     demoUrl: "https://ml-pipeline.demo.com",
        //     githubUrl: "https://github.com/ewatson/ml-pipeline",
        //     images: [
        //       "https://plus.unsplash.com/premium_photo-1664701474750-e3b51072957e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtYXJhJTIwbWFufGVufDB8fDB8fHww",
        //       "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&fit=crop",
        //       "https://images.unsplash.com/photo-1577918248023-62b9a2748a22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtYXJhJTIwbWFufGVufDB8fDB8fHww",
        //     ],
        //     createdAt: "2024-04-15",
        //     tags: ["machine-learning", "automation", "data-processing"],
        //     members: [
        //       {
        //         name: "Emma Watson",
        //         image: "https://randomuser.me/api/portraits/women/16.jpg",
        //       },
        //       {
        //         name: "Robert Chang",
        //         image: "https://randomuser.me/api/portraits/men/52.jpg",
        //       },
        //       {
        //         name: "Maya Singh",
        //         image: "https://randomuser.me/api/portraits/women/33.jpg",
        //       },
        //       {
        //         name: "James Miller",
        //         image: "https://randomuser.me/api/portraits/men/44.jpg",
        //       },
        //     ],
        //     roadmap: [
        //       "Phase 1: Pipeline Architecture",
        //       "Phase 2: Data Processing",
        //       "Phase 3: Model Training",
        //       "Phase 4: Deployment",
        //     ],
        //     duration: "5 months",
        //     course: "Machine Learning Systems",
        //   },

        //   {
        //     id: 6,
        //     title: "Social Media Dashboard",
        //     description:
        //       "Manage and monitor multiple social accounts in one place.",
        //     semester: "Fall 2023",
        //     author: {
        //       name: "Mike Johnson",
        //       avatar: "https://randomuser.me/api/portraits/men/11.jpg",
        //       program: "Web Development",
        //       year: "3rd Year",
        //     },
        //     technologies: [
        //       "Vue.js",
        //       "Express",
        //       "OAuth",
        //       "MongoDB",
        //       "Socket.io",
        //     ],
        //     category: "Web Development",
        //     status: "Completed",
        //     featured: false,
        //     likes: 142,
        //     views: 890,
        //     demoUrl: "https://social-dashboard.demo.com",
        //     githubUrl: "https://github.com/mjohnson/social-dashboard",
        //     images: [
        //       "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&fit=crop",
        //       "https://plus.unsplash.com/premium_photo-1661764256397-af154e87b1b3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //     ],
        //     createdAt: "2023-11-08",
        //     tags: ["social-media", "dashboard", "analytics"],
        //     members: [
        //       {
        //         name: "Mike Johnson",
        //         image: "https://randomuser.me/api/portraits/men/11.jpg",
        //       },
        //       {
        //         name: "Jessica Lee",
        //         image: "https://randomuser.me/api/portraits/women/29.jpg",
        //       },
        //       {
        //         name: "Kevin Chen",
        //         image: "https://randomuser.me/api/portraits/men/75.jpg",
        //       },
        //     ],
        //     roadmap: [
        //       "Phase 1: OAuth Integration",
        //       "Phase 2: Multi-platform Support",
        //       "Phase 3: Analytics",
        //       "Phase 4: Launch",
        //     ],
        //     duration: "4 months",
        //     course: "Advanced Web Applications",
        //   },

        //   {
        //     id: 7,
        //     title: "Data Analytics Platform",
        //     description: "Real-time data visualization and reporting tool.",
        //     semester: "Summer 2023",
        //     author: {
        //       name: "Lisa Wong",
        //       avatar: "https://randomuser.me/api/portraits/women/18.jpg",
        //       program: "Data Science",
        //       year: "4th Year",
        //     },
        //     technologies: ["D3.js", "React", "Python", "Pandas", "PostgreSQL"],
        //     category: "Data Science",
        //     status: "Completed",
        //     featured: false,
        //     likes: 201,
        //     views: 1500,
        //     demoUrl: "https://analytics-platform.demo.com",
        //     githubUrl: "https://github.com/lwong/analytics-platform",
        //     images: [
        //       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&fit=crop",
        //       "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzfGVufDB8fDB8fHww",
        //       "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1c2luZXNzfGVufDB8fDB8fHww",
        //     ],
        //     createdAt: "2023-08-15",
        //     tags: ["data-viz", "analytics", "reporting"],
        //     members: [
        //       {
        //         name: "Lisa Wong",
        //         image: "https://randomuser.me/api/portraits/women/18.jpg",
        //       },
        //       {
        //         name: "Marcus Johnson",
        //         image: "https://randomuser.me/api/portraits/men/24.jpg",
        //       },
        //       {
        //         name: "Patricia Green",
        //         image: "https://randomuser.me/api/portraits/women/53.jpg",
        //       },
        //       {
        //         name: "Daniel White",
        //         image: "https://randomuser.me/api/portraits/men/36.jpg",
        //       },
        //     ],
        //     roadmap: [
        //       "Phase 1: Data Connectors",
        //       "Phase 2: Visualization Engine",
        //       "Phase 3: Report Builder",
        //       "Phase 4: Production",
        //     ],
        //     duration: "5 months",
        //     course: "Data Visualization & Analytics",
        //   },
        // ];

        // test proxy api call
        // const response = await useFetch<Project[]>("/api/projects", {
        //   method: "GET",
        // });
        const response = await $fetch<Project[]>(
          "http://localhost:3017/projects"
        );
        // useFetch returns a Ref for data; unwrap with .value and fallback to an empty array
        this.projects = response ?? [];

        return this.projects;
      } finally {
        this.loading = false;
      }
    },

    async likeProject(projectId: number): Promise<void> {
      const project = this.projects.find((p) => p.id === projectId);
      if (project) {
        project.likes++;
      }
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
      this.categories.forEach((category) => {
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
  },
});
