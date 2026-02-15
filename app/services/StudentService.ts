import { baseURL } from "process";
import { AuthService } from "./AuthService";

export interface APIStudent {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  year?: number;
  generation?: number;
  gen?: string | number;
  avatar?: string;
  bio?: string;
  skill?: string[] | null;
  projectCount?: number;
  projects?: any[];
  joinedYear: string;
  createdAt?: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  courses?: any[];
  role?: string;
  socialLinks?: Array<{
    url: string;
    name: string;
  }> | null;
}

export interface PaginatedResponse {
  data: APIStudent[];
  page: number;
  limit: number;
  total: number;
  lastPage: number;
}

export interface StudentListParams {
  page?: number;
  limit?: number;
  role?: string;
  generation?: string | number;
  search?: string;
  ascending?: boolean;
}

function normalizeJoinedYear(raw: any): string {
  if (typeof raw?.joinedYear === "string") return raw.joinedYear;

  const createdAt = raw?.createdAt || raw?.created_at;
  if (createdAt) {
    const year = new Date(createdAt).getFullYear();
    if (Number.isFinite(year)) return String(year);
  }

  return "";
}

function mapSocialLinks(raw: any): APIStudent["socialLinks"] {
  if (!Array.isArray(raw?.socialLinks)) return [];
  return raw.socialLinks
    .filter((item: any) => item?.url && item?.name)
    .map((item: any) => ({
      url: String(item.url),
      name: String(item.name),
    }));
}

function mapAPIStudent(
  raw: any,
  fallback?: { id?: string; generation?: string | number },
): APIStudent {
  const firstName = raw?.firstName || raw?.firstname || raw?.name || "Student";
  const lastName = raw?.lastName || raw?.lastname || "";
  const generation =
    typeof raw?.generation === "number"
      ? raw.generation
      : Number(raw?.generation || fallback?.generation || 0) || undefined;

  return {
    id: String(raw?.id || raw?._id || fallback?.id || ""),
    firstName: String(firstName),
    lastName: String(lastName),
    email: String(raw?.email || ""),
    phone: String(raw?.phone || ""),
    year:
      typeof raw?.year === "number"
        ? raw.year
        : Number(raw?.year || 0) || undefined,
    generation,
    gen: raw?.gen ?? generation,
    avatar: String(raw?.avatar || ""),
    bio: String(raw?.bio || ""),
    skill: Array.isArray(raw?.skill)
      ? raw.skill
      : Array.isArray(raw?.skills)
        ? raw.skills
        : [],
    projectCount:
      typeof raw?.projectCount === "number"
        ? raw.projectCount
        : Array.isArray(raw?.projects)
          ? raw.projects.length
          : 0,
    projects: Array.isArray(raw?.projects) ? raw.projects : [],
    joinedYear: normalizeJoinedYear(raw),
    createdAt: String(raw?.createdAt || raw?.created_at || ""),
    department: raw?.department
      ? {
          id: String(raw.department.id || ""),
          name: String(raw.department.name || ""),
          code: String(raw.department.code || ""),
        }
      : undefined,
    courses: Array.isArray(raw?.courses) ? raw.courses : [],
    role: String(raw?.role || "STUDENT"),
    socialLinks: mapSocialLinks(raw),
  };
}

export class StudentService extends AuthService {
  private uploadUrl = "/api/real-student/upload";
  // get Base url from base class


  private async buildAuthHeaders(
    token?: string,
    extraHeaders: Record<string, string> = {},
  ): Promise<Record<string, string>> {
    if (token) {
      return {
        ...extraHeaders,
        Authorization: `Bearer ${token}`,
      };
    }
    return this.getAuthHeaders(extraHeaders);
  }

  async fetchStudents(
    params: StudentListParams,
    token?: string,
  ): Promise<PaginatedResponse> {
    const response = await $fetch<PaginatedResponse>(this.getbaseUrl(), {
      method: "GET",
      headers: await this.buildAuthHeaders(token),
      params,
    });

    const list = Array.isArray(response?.data) ? response.data : [];
    return {
      data: list.map((student) => mapAPIStudent(student)),
      page: Number(response?.page || params.page || 1),
      limit: Number(response?.limit || params.limit || 10),
      total: Number(response?.total || 0),
      lastPage: Number(response?.lastPage || 1),
    };
  }

  async createStudent(studentData: any, token?: string): Promise<any> {
    return $fetch(this.getbaseUrl(), {
      method: "POST",
      headers: await this.buildAuthHeaders(token, {
        "Content-Type": "application/json",
      }),
      body: {
        ...studentData,
        role: "STUDENT",
      },
    });
  }

  async updateStudent(
    studentId: string,
    studentData: any,
    token?: string,
  ): Promise<APIStudent | null> {
    const response = await $fetch(`/api/users/${studentId}`, {
      method: "PATCH",
      headers: await this.buildAuthHeaders(token, {
        "Content-Type": "application/json",
      }),
      body: {
        ...studentData,
        role: "STUDENT",
      },
    });

    const raw = (response as any)?.data || response;
    if (!raw || typeof raw !== "object") return null;
    return mapAPIStudent(raw, { id: studentId });
  }

  async deleteStudent(studentId: string, token?: string): Promise<void> {
    await $fetch(`/api/users/${studentId}`, {
      method: "DELETE",
      headers: await this.buildAuthHeaders(token),
    });
  }

  async uploadStudentsCSV(file: File, token?: string): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    return $fetch(this.uploadUrl, {
      method: "POST",
      headers: await this.buildAuthHeaders(token),
      body: formData,
    });
  }

  async fetchPublicStudentById(studentId: string): Promise<APIStudent | null> {
    const response = await $fetch(`/api/users/${studentId}`, { method: "GET" });
    const raw = (response as any)?.data || response;
    if (!raw) return null;
    return mapAPIStudent(raw, { id: studentId });
  }

  async fetchPublicStudentsByGeneration(
    generation = 25,
    page = 1,
    limit = 10,
    ascending = false,
  ): Promise<PaginatedResponse> {
    const response = (await $fetch(this.getbaseUrl(), {
      method: "GET",
      query: { page, limit, ascending, generation },
    })) as
      | PaginatedResponse
      | {
          data?: any[];
          page?: number;
          limit?: number;
          total?: number;
          lastPage?: number;
        };

    const list = Array.isArray((response as any)?.data)
      ? (response as any).data
      : [];

    return {
      data: list.map((student: any) => mapAPIStudent(student, { generation })),
      page: Number((response as any)?.page || page),
      limit: Number((response as any)?.limit || limit),
      total: Number((response as any)?.total || list.length),
      lastPage: Number((response as any)?.lastPage || 1),
    };
  }

  mapStudent(
    raw: any,
    fallback?: { id?: string; generation?: string | number },
  ): APIStudent {
    return mapAPIStudent(raw, fallback);
  }
}

export const studentService = new StudentService();
