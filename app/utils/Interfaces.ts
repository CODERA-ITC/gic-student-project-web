export interface ProjectAuthor {
  id: string;
  name: string;
  avatar: string;
  program: string;
  year: string;
}

export interface FeatureItem {
  date?: string;
  name: string;
  description: string;
  icon: string;
  status: "pending" | "ongoing" | "done";
}





export interface Course {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string;
  code: string;
}



export interface ProjectImage {
  id: string;
  originalUrl: string;
  thumbnailUrl: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  departmentId?: "11111111-1111-1111-1111-111111111111"; // GIC Department ID
  academicYear?: string;
  author: ProjectAuthor;
  technologies: string[];
  category: string;
  status: "Completed" | "In Progress";
  featured: boolean;
  likes: number;
  views: number;
  demoUrl: string;
  githubUrl: string;
  images: ProjectImage[];
  createdAt: string;
  tags: string[];
  members?: { name: string; image: string }[];
  features?: FeatureItem[];
  duration?: string;
  course?: string;
  visibility?: "public" | "private";
  submissions?: {
    id: string;
    name: string;
    date: string;
    status: string;
  }[];
}

export interface ProjectStats {
  total: number;
  completed: number;
  inProgress: number;
  totalLikes: number;
  totalViews: number;
  totalTeamMembers: number;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface ProjectState {
  projects: Project[];
  userProjects: Project[];
  availableCategories: string[];
  availableTags: string[];
  categoryObjects: any[]; // Store full category objects for ID lookup
  availableCourses: string[];
  courseObjects: Course[];
  tagObjects: any[]; // Store full tag objects for ID lookup
  likedProjects: Set<string | number>;
  loading: boolean;
  pagination: PaginationState;
  nextProjectId: number; // Track next project ID independently
  filters: {
    categories: string[];
    search: string;
    tags: any[];
    year: string;
    sort: string;
  };
}
