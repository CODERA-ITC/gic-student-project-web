import { defineStore } from "pinia";
import { authService } from "~/services/AuthService";

export type ProjectMetaResource = "categories" | "courses" | "tags";

export interface ProjectMetaItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

type ResourceMap<T> = Record<ProjectMetaResource, T>;
type FetchItemParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export interface ProjectMetaPagination {
  page: number;
  limit: number;
  total: number;
  lastPage: number;
}

const resourceEndpoints: ResourceMap<string> = {
  categories: "/api/categories",
  courses: "/api/courses",
  tags: "/api/tags",
};

const normalizeRows = (payload: any): ProjectMetaItem[] => {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  return list
    .map((raw: any) => {
      if (typeof raw === "string") {
        return { id: raw, name: raw };
      }
      const id = raw?.id || raw?._id || raw?.name;
      if (!id) return null;
      return {
        id: String(id),
        name: raw?.name || "",
        code: raw?.code || "",
        description: raw?.description || "",
        createdAt: raw?.createdAt || raw?.created_at || "",
        updatedAt: raw?.updatedAt || raw?.updated_at || "",
        deletedAt: raw?.deletedAt ?? raw?.deleted_at ?? null,
      };
    })
    .filter(Boolean) as ProjectMetaItem[];
};

const normalizePagination = (
  payload: any,
  rows: ProjectMetaItem[],
): ProjectMetaPagination => {
  if (payload && typeof payload === "object" && Array.isArray(payload?.data)) {
    return {
      page: Number(payload.page) || 1,
      limit: Number(payload.limit) || rows.length || 10,
      total: Number(payload.total) || rows.length,
      lastPage: Number(payload.lastPage) || 1,
    };
  }

  return {
    page: 1,
    limit: rows.length || 10,
    total: rows.length,
    lastPage: 1,
  };
};

export const useProjectMetaStore = defineStore("project-meta", {
  state: () => ({
    itemsByResource: {
      categories: [],
      courses: [],
      tags: [],
    } as ResourceMap<ProjectMetaItem[]>,
    loadingByResource: {
      categories: false,
      courses: false,
      tags: false,
    } as ResourceMap<boolean>,
    paginationByResource: {
      categories: null,
      courses: null,
      tags: null,
    } as ResourceMap<ProjectMetaPagination | null>,
  }),

  getters: {
    getItems: (state) => (resource: ProjectMetaResource) =>
      state.itemsByResource[resource] || [],
    isLoading: (state) => (resource: ProjectMetaResource) =>
      !!state.loadingByResource[resource],
    getPagination: (state) => (resource: ProjectMetaResource) =>
      state.paginationByResource[resource],
  },

  actions: {
    async fetchItems(
      resource: ProjectMetaResource,
      params: FetchItemParams = {},
    ): Promise<ProjectMetaItem[]> {
      this.loadingByResource[resource] = true;
      try {
        const headers = await authService.getAuthHeaders();
        const query = new URLSearchParams();
        if (params.page) query.append("page", params.page.toString());
        if (params.limit) query.append("limit", params.limit.toString());
        if (params.search) query.append("search", params.search);

        const endpoint = resourceEndpoints[resource];
        const url = query.toString() ? `${endpoint}?${query.toString()}` : endpoint;

        const resp = await $fetch(url, {
          method: "GET",
          headers,
        });
        const normalized = normalizeRows(resp);
        this.itemsByResource[resource] = normalized;
        this.paginationByResource[resource] = normalizePagination(resp, normalized);
        return normalized;
      } catch (error) {
        console.error(`project-meta: fetch ${resource} failed`, error);
        this.itemsByResource[resource] = [];
        this.paginationByResource[resource] = {
          page: 1,
          limit: 10,
          total: 0,
          lastPage: 1,
        };
        return [];
      } finally {
        this.loadingByResource[resource] = false;
      }
    },

    fetchCategories(params: FetchItemParams = {}) {
      return this.fetchItems("categories", params);
    },

    fetchCourses(params: FetchItemParams = {}) {
      return this.fetchItems("courses", params);
    },

    fetchTags(params: FetchItemParams = {}) {
      return this.fetchItems("tags", params);
    },

    async createItem(
      resource: ProjectMetaResource,
      payload: Record<string, string>,
    ) {
      const headers = await authService.getAuthHeaders({
        "Content-Type": "application/json",
      });
      await $fetch(resourceEndpoints[resource], {
        method: "POST",
        headers,
        body: payload,
      });
      await this.fetchItems(resource, {
        page: this.paginationByResource[resource]?.page || 1,
        limit: this.paginationByResource[resource]?.limit || 10,
      });
    },

    async updateItem(
      resource: ProjectMetaResource,
      id: string,
      payload: Record<string, string>,
    ) {
      const headers = await authService.getAuthHeaders({
        "Content-Type": "application/json",
      });
      const path = `${resourceEndpoints[resource]}/${id}`;
      try {
        await $fetch(path, {
          method: "PATCH",
          headers,
          body: payload,
        });
      } catch {
        await $fetch(path, {
          method: "PUT",
          headers,
          body: payload,
        });
      }
      await this.fetchItems(resource, {
        page: this.paginationByResource[resource]?.page || 1,
        limit: this.paginationByResource[resource]?.limit || 10,
      });
    },

    async deleteItem(resource: ProjectMetaResource, id: string) {
      const headers = await authService.getAuthHeaders();
      await $fetch(`${resourceEndpoints[resource]}/${id}`, {
        method: "DELETE",
        headers,
      });
      this.itemsByResource[resource] = this.itemsByResource[resource].filter(
        (item) => item.id !== id,
      );
    },
  },
});
