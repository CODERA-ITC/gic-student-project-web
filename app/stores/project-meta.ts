import { defineStore } from "pinia";
import { authService } from "~/services/AuthService";

export type ProjectMetaResource = "categories" | "courses" | "tags";

export interface ProjectMetaItem {
  id: string;
  name: string;
  code?: string;
  description?: string;
  createdAt?: string;
}

type ResourceMap<T> = Record<ProjectMetaResource, T>;

const resourceEndpoints: ResourceMap<string> = {
  categories: "/api/categories",
  courses: "/api/courses",
  tags: "/api/tags",
};

const mockData: ResourceMap<ProjectMetaItem[]> = {
  categories: [
    { id: "cat-ai", name: "Artificial Intelligence" },
    { id: "cat-web", name: "Web Development" },
    { id: "cat-mobile", name: "Mobile Development" },
  ],
  courses: [
    { id: "course-proj-dev", name: "Project Development", code: "PD101" },
    { id: "course-hci", name: "Human Computer Interaction", code: "HCI201" },
    { id: "course-ds", name: "Data Structures", code: "DS102" },
  ],
  tags: [
    { id: "tag-vue", name: "Vue" },
    { id: "tag-nuxt", name: "Nuxt" },
    { id: "tag-ai", name: "AI" },
  ],
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
      };
    })
    .filter(Boolean) as ProjectMetaItem[];
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
  }),

  getters: {
    getItems: (state) => (resource: ProjectMetaResource) =>
      state.itemsByResource[resource] || [],
    isLoading: (state) => (resource: ProjectMetaResource) =>
      !!state.loadingByResource[resource],
  },

  actions: {
    async fetchItems(resource: ProjectMetaResource): Promise<ProjectMetaItem[]> {
      this.loadingByResource[resource] = true;
      try {
        const headers = await authService.getAuthHeaders();
        const resp = await $fetch(resourceEndpoints[resource], {
          method: "GET",
          headers,
        });
        const normalized = normalizeRows(resp);
        this.itemsByResource[resource] = normalized;
        return normalized;
      } catch (error) {
        console.error(`project-meta: fetch ${resource} failed`, error);
        const fallback = mockData[resource];
        this.itemsByResource[resource] = fallback;
        return fallback;
      } finally {
        this.loadingByResource[resource] = false;
      }
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
      await this.fetchItems(resource);
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
      await this.fetchItems(resource);
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
