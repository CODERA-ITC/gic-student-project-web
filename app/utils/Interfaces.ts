import type { ProjectFilters } from "~/services/ProjectService";

export interface ProjectAuthor {
  id: string;
  name: string;
  avatar: string;
  program: string;
  year: string;
  email?: string;
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
  submissionStatus: "draft" | "pending" | "accepted" | "rejected";
  projectStatus?: string; // For backward compatibility
  highlighted: boolean;
  likes: number;
  views: number;
  demoUrl: string;
  githubUrl: string;
  images: ProjectImage[];
  createdAt: string;
  updatedAt?: string;
  tags: string[];
  members?: { id?: string; email?: string; name: string; image: string }[];
  features?: FeatureItem[];
  duration?: string;
  course?: string;
  visibility?: string;
  submissions?: {
    id: string;
    name: string;
    date: string;
    status: string;
    updatedAt?: string;
  };
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
  likedProjects: Set<string | number>;
  loading: boolean;
  pagination: PaginationState;
  filters: ProjectFilters;
  highlightedProjects: Project[];
  submissionProjects: Project[];
  totalProject: number;
  likedProjectList: Project[];
}
