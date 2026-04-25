import type { Project } from "~/utils/Interfaces";

export const projectsData: Project[] = [
  {
    id: "1",
    name: "Campus Event Planner",
    description:
      "A web platform for managing student events, registrations, and schedules in one dashboard.",
    academicYear: "2025-2026",
    author: {
      id: "author-1",
      name: "Sokha Chann",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
      program: "Computer Science",
      year: "4th Year",
      email: "sokha@example.edu",
    },
    technologies: ["Nuxt", "TypeScript", "Pinia", "PostgreSQL"],
    category: "Web Development",
    submissionStatus: "accepted",
    projectStatus: "Completed",
    highlighted: true,
    likes: 412,
    views: 2840,
    demoUrl: "https://example.com/campus-event-planner",
    githubUrl: "https://github.com/example/campus-event-planner",
    images: [
      {
        id: "fallback-1-img-1",
        originalUrl:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&fit=crop",
      },
      {
        id: "fallback-1-img-2",
        originalUrl:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&fit=crop",
      },
    ],
    createdAt: "2025-09-10T08:30:00.000Z",
    updatedAt: "2026-01-12T10:15:00.000Z",
    tags: ["events", "students", "dashboard"],
    members: [
      {
        id: "m-1",
        email: "sokha@example.edu",
        name: "Sokha Chann",
        image: "https://randomuser.me/api/portraits/men/31.jpg",
      },
      {
        id: "m-2",
        email: "vichea@example.edu",
        name: "Vichea Mean",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    ],
    features: [
      {
        date: "2025-10-01",
        name: "Event Creation",
        description: "Admins can create events with date, venue, and capacity.",
        icon: "i-lucide-calendar-plus",
        status: "done",
      },
      {
        date: "2025-11-12",
        name: "QR Check-in",
        description: "Participant check-in with generated QR code per registration.",
        icon: "i-lucide-qr-code",
        status: "done",
      },
    ],
    duration: "4 months",
    course: "Advanced Web Application Development",
    visibility: "public",
  },
  {
    id: "2",
    name: "Smart Library Assistant",
    description:
      "Recommendation and book tracking system that helps students discover and reserve books quickly.",
    academicYear: "2025-2026",
    author: {
      id: "author-2",
      name: "Dara Lim",
      avatar: "https://randomuser.me/api/portraits/women/58.jpg",
      program: "Information Technology",
      year: "3rd Year",
      email: "dara@example.edu",
    },
    technologies: ["Vue", "Node.js", "MongoDB", "Redis"],
    category: "Artificial Intelligence",
    submissionStatus: "pending",
    projectStatus: "In Progress",
    highlighted: false,
    likes: 265,
    views: 1902,
    demoUrl: "https://example.com/smart-library-assistant",
    githubUrl: "https://github.com/example/smart-library-assistant",
    images: [
      {
        id: "fallback-2-img-1",
        originalUrl:
          "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&fit=crop",
      },
    ],
    createdAt: "2025-08-21T06:00:00.000Z",
    updatedAt: "2026-02-03T09:20:00.000Z",
    tags: ["library", "recommendation", "search"],
    members: [
      {
        id: "m-3",
        email: "dara@example.edu",
        name: "Dara Lim",
        image: "https://randomuser.me/api/portraits/women/58.jpg",
      },
      {
        id: "m-4",
        email: "pisey@example.edu",
        name: "Pisey Rath",
        image: "https://randomuser.me/api/portraits/men/52.jpg",
      },
      {
        id: "m-5",
        email: "maly@example.edu",
        name: "Maly Chan",
        image: "https://randomuser.me/api/portraits/women/14.jpg",
      },
    ],
    features: [
      {
        date: "2025-09-20",
        name: "Catalog Import",
        description: "Imported and indexed 20,000+ library records.",
        icon: "i-lucide-book-open",
        status: "done",
      },
      {
        date: "2026-01-04",
        name: "Recommendation Engine",
        description:
          "Deployed collaborative filtering for personalized suggestions.",
        icon: "i-lucide-brain",
        status: "ongoing",
      },
    ],
    duration: "5 months",
    course: "Applied AI Systems",
    visibility: "public",
  },
  {
    id: "3",
    name: "Food Waste Tracker",
    description:
      "A lightweight mobile-first tracker for recording canteen leftovers and reducing food waste.",
    academicYear: "2025-2026",
    author: {
      id: "author-3",
      name: "Rithy Son",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      program: "Software Engineering",
      year: "2nd Year",
      email: "rithy@example.edu",
    },
    technologies: ["Nuxt", "Supabase", "Tailwind", "Chart.js"],
    category: "Sustainability",
    submissionStatus: "draft",
    projectStatus: "In Progress",
    highlighted: false,
    likes: 118,
    views: 860,
    demoUrl: "https://example.com/food-waste-tracker",
    githubUrl: "https://github.com/example/food-waste-tracker",
    images: [
      {
        id: "fallback-3-img-1",
        originalUrl:
          "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&fit=crop",
      },
    ],
    createdAt: "2026-01-06T03:10:00.000Z",
    updatedAt: "2026-03-11T02:00:00.000Z",
    tags: ["sustainability", "mobile", "analytics"],
    members: [
      {
        id: "m-6",
        email: "rithy@example.edu",
        name: "Rithy Son",
        image: "https://randomuser.me/api/portraits/men/22.jpg",
      },
    ],
    features: [
      {
        date: "2026-01-15",
        name: "Daily Entry Log",
        description: "Staff can record waste quantities by meal period.",
        icon: "i-lucide-clipboard-list",
        status: "done",
      },
      {
        date: "2026-02-20",
        name: "Trend Dashboard",
        description: "Weekly trend charts with category filters.",
        icon: "i-lucide-line-chart",
        status: "ongoing",
      },
      {
        date: "2026-04-01",
        name: "Action Insights",
        description: "Suggested actions based on recurring waste patterns.",
        icon: "i-lucide-lightbulb",
        status: "pending",
      },
    ],
    duration: "3 months",
    course: "Mobile Application Development",
    visibility: "private",
  },
  {
    id: "4",
    name: "Internship Matcher",
    description:
      "A matching platform that helps students find internships based on skills, interests, and location.",
    academicYear: "2025-2026",
    author: {
      id: "author-4",
      name: "Nary Heng",
      avatar: "https://randomuser.me/api/portraits/women/37.jpg",
      program: "Information Systems",
      year: "4th Year",
      email: "nary@example.edu",
    },
    technologies: ["Nuxt", "Express", "Prisma", "PostgreSQL"],
    category: "Career Platform",
    submissionStatus: "accepted",
    projectStatus: "Completed",
    highlighted: true,
    likes: 356,
    views: 2275,
    demoUrl: "https://example.com/internship-matcher",
    githubUrl: "https://github.com/example/internship-matcher",
    images: [
      {
        id: "fallback-4-img-1",
        originalUrl:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&fit=crop",
      },
    ],
    createdAt: "2025-07-11T06:40:00.000Z",
    updatedAt: "2026-02-17T09:00:00.000Z",
    tags: ["internship", "matching", "students"],
    members: [
      {
        id: "m-7",
        email: "nary@example.edu",
        name: "Nary Heng",
        image: "https://randomuser.me/api/portraits/women/37.jpg",
      },
      {
        id: "m-8",
        email: "sovann@example.edu",
        name: "Sovann Kim",
        image: "https://randomuser.me/api/portraits/men/48.jpg",
      },
    ],
    features: [
      {
        date: "2025-08-14",
        name: "Profile Scoring",
        description: "Scores student profiles against internship requirements.",
        icon: "i-lucide-star",
        status: "done",
      },
      {
        date: "2025-11-21",
        name: "Recommendation Feed",
        description: "Personalized feed of top internship opportunities.",
        icon: "i-lucide-list-checks",
        status: "done",
      },
    ],
    duration: "4 months",
    course: "Enterprise Web Systems",
    visibility: "public",
  },
  {
    id: "5",
    name: "Dormitory Issue Reporter",
    description:
      "Students can report dormitory issues with photo evidence and track maintenance progress.",
    academicYear: "2025-2026",
    author: {
      id: "author-5",
      name: "Phearun Keo",
      avatar: "https://randomuser.me/api/portraits/men/63.jpg",
      program: "Software Engineering",
      year: "3rd Year",
      email: "phearun@example.edu",
    },
    technologies: ["Vue", "Firebase", "Cloud Functions"],
    category: "Campus Services",
    submissionStatus: "pending",
    projectStatus: "In Progress",
    highlighted: false,
    likes: 205,
    views: 1468,
    demoUrl: "https://example.com/dormitory-issue-reporter",
    githubUrl: "https://github.com/example/dormitory-issue-reporter",
    images: [
      {
        id: "fallback-5-img-1",
        originalUrl:
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&fit=crop",
      },
    ],
    createdAt: "2025-10-02T04:20:00.000Z",
    updatedAt: "2026-03-20T07:10:00.000Z",
    tags: ["dormitory", "maintenance", "reporting"],
    members: [
      {
        id: "m-9",
        email: "phearun@example.edu",
        name: "Phearun Keo",
        image: "https://randomuser.me/api/portraits/men/63.jpg",
      },
      {
        id: "m-10",
        email: "linna@example.edu",
        name: "Linna Chhay",
        image: "https://randomuser.me/api/portraits/women/29.jpg",
      },
      {
        id: "m-11",
        email: "thida@example.edu",
        name: "Thida Ouk",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
      },
    ],
    features: [
      {
        date: "2025-10-18",
        name: "Ticket Submission",
        description: "Created issue ticket form with image upload support.",
        icon: "i-lucide-clipboard-pen",
        status: "done",
      },
      {
        date: "2026-01-09",
        name: "Maintenance Workflow",
        description: "Tracking pipeline for open, assigned, and resolved issues.",
        icon: "i-lucide-wrench",
        status: "ongoing",
      },
    ],
    duration: "4 months",
    course: "Cloud-Native Applications",
    visibility: "public",
  },
  {
    id: "6",
    name: "Khmer Learning Companion",
    description:
      "A language learning assistant with quizzes and spaced repetition tailored for Khmer learners.",
    academicYear: "2025-2026",
    author: {
      id: "author-6",
      name: "Sreypov Try",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      program: "Educational Technology",
      year: "2nd Year",
      email: "sreypov@example.edu",
    },
    technologies: ["Nuxt", "TypeScript", "Supabase"],
    category: "EdTech",
    submissionStatus: "accepted",
    projectStatus: "Completed",
    highlighted: true,
    likes: 441,
    views: 3011,
    demoUrl: "https://example.com/khmer-learning-companion",
    githubUrl: "https://github.com/example/khmer-learning-companion",
    images: [
      {
        id: "fallback-6-img-1",
        originalUrl:
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&fit=crop",
      },
    ],
    createdAt: "2025-06-28T05:00:00.000Z",
    updatedAt: "2026-02-26T10:35:00.000Z",
    tags: ["education", "quiz", "language"],
    members: [
      {
        id: "m-12",
        email: "sreypov@example.edu",
        name: "Sreypov Try",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
      },
      {
        id: "m-13",
        email: "chenda@example.edu",
        name: "Chenda Lim",
        image: "https://randomuser.me/api/portraits/men/71.jpg",
      },
    ],
    features: [
      {
        date: "2025-07-30",
        name: "Lesson Modules",
        description: "Structured lessons by level with progress tracking.",
        icon: "i-lucide-book-text",
        status: "done",
      },
      {
        date: "2025-12-05",
        name: "Spaced Repetition",
        description: "Adaptive review scheduler for long-term retention.",
        icon: "i-lucide-repeat",
        status: "done",
      },
      {
        date: "2026-02-10",
        name: "Speaking Practice",
        description: "Prompt-based pronunciation exercises with feedback.",
        icon: "i-lucide-mic",
        status: "done",
      },
    ],
    duration: "5 months",
    course: "Learning Experience Design",
    visibility: "public",
  },
];

export default projectsData;
