# OOP CRUD Refactoring Guide

## 📖 Overview

This guide demonstrates how to refactor your Pinia store's CRUD operations using **Service Layer Pattern** - a key OOP concept that separates concerns and improves maintainability.

---

## 🔴 Before: Procedural Approach (Current)

**Problems:**
- Store handles EVERYTHING: state + API calls + error handling
- Hard to test (tightly coupled)
- Difficult to reuse API logic outside store
- Violates Single Responsibility Principle

```typescript
// stores/projects.ts
export const useProjectStore = defineStore("projects", () => {
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  
  async function fetchProjects() {
    loading.value = true;
    try {
      const response = await $fetch('/api/projects', {
        method: 'GET',
      });
      const transformedData = transformApiResponse(response);
      projects.value = transformedData;
    } catch (error) {
      console.error("Failed to fetch projects", error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function createProject(data: any) {
    loading.value = true;
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      // ... 50 more lines of formData setup
      
      const response = await $fetch('/api/projects', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      projects.value.push(transformProject(response));
      return response;
    } catch (error) {
      console.error("Failed to create project", error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProject(id: string) {
    loading.value = true;
    try {
      await $fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      projects.value = projects.value.filter(p => p.id !== id);
    } catch (error) {
      console.error("Failed to delete project", error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  // ... more CRUD operations
});
```

---

## 🟢 After: Service Layer Pattern (Recommended)

**Benefits:**
- ✅ Clear separation of concerns
- ✅ Store = State management only
- ✅ Service = API calls + business logic
- ✅ Easy to test (mock the service)
- ✅ Reusable API logic
- ✅ Follows SOLID principles

### Step 1: Create the Service (Already Done!)

```typescript
// services/ProjectService.ts
export class ProjectService {
  private baseUrl = "/api/projects";

  async fetchAll(filters?: ProjectFilters): Promise<any> {
    // API logic here
  }

  async create(data: CreateProjectDTO): Promise<any> {
    // API logic here
  }

  async delete(projectId: string): Promise<void> {
    // API logic here
  }
}

export const projectService = new ProjectService();
```

### Step 2: Refactor the Store

```typescript
// stores/projects.ts
import { projectService } from "~/services/ProjectService";
import { transformApiResponse, transformProject } from "~/utils/projectTransformer";

export const useProjectStore = defineStore("projects", () => {
  // ============================================
  // STATE (Store's responsibility)
  // ============================================
  const projects = ref<Project[]>([]);
  const currentProject = ref<Project | null>(null);
  const userProjects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // ============================================
  // ACTIONS (Now much cleaner!)
  // ============================================

  /**
   * Fetch all projects
   */
  async function fetchProjects(filters?: ProjectFilters) {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectService.fetchAll(filters);
      projects.value = transformApiResponse(response);
    } catch (err: any) {
      error.value = err.message || "Failed to fetch projects";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch single project by ID
   */
  async function fetchProjectById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectService.fetchById(id);
      currentProject.value = transformProject(response);
    } catch (err: any) {
      error.value = err.message || "Failed to fetch project";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch current user's projects
   */
  async function fetchUserProjects() {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectService.fetchUserProjects();
      userProjects.value = transformApiResponse(response);
    } catch (err: any) {
      error.value = err.message || "Failed to fetch user projects";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create a new project
   */
  async function createProject(data: CreateProjectDTO) {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectService.create(data);
      const transformedProject = transformProject(response);
      projects.value.push(transformedProject);
      return transformedProject;
    } catch (err: any) {
      error.value = err.message || "Failed to create project";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update a project
   */
  async function updateProject(id: string, updates: UpdateProjectDTO) {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectService.update(id, updates);
      const transformedProject = transformProject(response);
      
      // Update in projects array
      const index = projects.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        projects.value[index] = transformedProject;
      }
      
      // Update current project if it's the same
      if (currentProject.value?.id === id) {
        currentProject.value = transformedProject;
      }
      
      return transformedProject;
    } catch (err: any) {
      error.value = err.message || "Failed to update project";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a project
   */
  async function deleteProject(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await projectService.delete(id);
      
      // Remove from state
      projects.value = projects.value.filter((p) => p.id !== id);
      userProjects.value = userProjects.value.filter((p) => p.id !== id);
      
      if (currentProject.value?.id === id) {
        currentProject.value = null;
      }
    } catch (err: any) {
      error.value = err.message || "Failed to delete project";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Toggle like on a project
   */
  async function toggleLike(id: string) {
    try {
      const result = await projectService.toggleLike(id);
      
      // Update local state
      const project = projects.value.find((p) => p.id === id);
      if (project) {
        project.liked = result.liked;
        project.likeCount = result.liked
          ? project.likeCount + 1
          : project.likeCount - 1;
      }
      
      return result;
    } catch (err: any) {
      error.value = err.message || "Failed to toggle like";
      throw err;
    }
  }

  /**
   * Track project view
   */
  async function trackView(id: string) {
    try {
      await projectService.trackView(id);
      
      // Update view count locally (optimistic update)
      const project = projects.value.find((p) => p.id === id);
      if (project) {
        project.viewCount = (project.viewCount || 0) + 1;
      }
    } catch (err) {
      // Silent fail - view tracking is non-critical
      console.warn("Failed to track view", err);
    }
  }

  return {
    // State
    projects,
    currentProject,
    userProjects,
    loading,
    error,
    
    // Actions
    fetchProjects,
    fetchProjectById,
    fetchUserProjects,
    createProject,
    updateProject,
    deleteProject,
    toggleLike,
    trackView,
  };
});
```

---

## 📊 Comparison

| Aspect | Before (Procedural) | After (Service Layer) |
|--------|---------------------|----------------------|
| **Lines per action** | 30-50 lines | 10-15 lines |
| **API logic location** | Mixed in store | Centralized in service |
| **Testability** | Hard (need to mock store) | Easy (mock service) |
| **Reusability** | None (tied to store) | High (service can be used anywhere) |
| **Responsibility** | Store does everything | Store = state, Service = API |
| **Error handling** | Scattered | Consistent pattern |
| **Type safety** | Weak | Strong (DTOs) |

---

## 🎯 Key OOP Principles Applied

### 1. **Single Responsibility Principle (SRP)**
- `ProjectService` → Handles API calls only
- `ProjectStore` → Handles state management only
- `ProjectTransformer` → Handles data transformation only

### 2. **Dependency Injection**
```typescript
// Service is injected into store
import { projectService } from "~/services/ProjectService";

// Could easily swap with a mock for testing
const mockService = new MockProjectService();
```

### 3. **Encapsulation**
```typescript
class ProjectService {
  private baseUrl = "/api/projects";  // Hidden implementation
  private getAuthToken() { ... }       // Private helper
  
  public async fetchAll() { ... }      // Public API
}
```

### 4. **Interface Segregation**
```typescript
// Clear contracts for data shapes
interface CreateProjectDTO { ... }
interface UpdateProjectDTO { ... }
interface ProjectFilters { ... }
```

---

## 🧪 Testing Benefits

### Before (Hard to Test)
```typescript
test("fetchProjects", async () => {
  // Need to mock $fetch globally
  // Need to mock entire store
  // Hard to isolate
});
```

### After (Easy to Test)
```typescript
test("ProjectService.fetchAll", async () => {
  const service = new ProjectService();
  const result = await service.fetchAll();
  expect(result).toBeDefined();
});

test("Store uses service correctly", async () => {
  const mockService = {
    fetchAll: vi.fn().mockResolvedValue([...mockData])
  };
  // Inject mock service
  // Test store logic in isolation
});
```

---

## 🚀 Usage in Components

### Before
```typescript
// Component directly uses store methods
const projectStore = useProjectStore();
await projectStore.createProject(formData);
```

### After (Same API!)
```typescript
// Component still uses store - no change needed!
const projectStore = useProjectStore();
await projectStore.createProject(formData);

// But now you can ALSO use service directly if needed
import { projectService } from "~/services/ProjectService";
const data = await projectService.fetchAll();
```

---

## 🎓 Advanced: Repository Pattern (Optional)

For even more abstraction, you could add a Repository layer:

```typescript
// Repository = Higher-level business operations
export class ProjectRepository {
  constructor(private service: ProjectService) {}

  async getPublicProjects(): Promise<Project[]> {
    const response = await this.service.fetchAll({ 
      visibility: 'public' 
    });
    return transformApiResponse(response);
  }

  async getProjectWithStats(id: string): Promise<ProjectWithStats> {
    const [project, likeCount, viewCount] = await Promise.all([
      this.service.fetchById(id),
      this.service.getLikeCount(id),
      this.service.getViewCount(id),
    ]);

    return {
      ...transformProject(project),
      stats: { likeCount, viewCount }
    };
  }
}
```

---

## 📝 Migration Checklist

- [x] Create `services/ProjectService.ts`
- [ ] Refactor store to use service
- [ ] Update imports in store
- [ ] Test all CRUD operations
- [ ] Verify components still work
- [ ] Add unit tests for service
- [ ] Document new architecture

---

## 🎯 Next Steps

1. **Immediate**: Refactor your store to use `projectService`
2. **Soon**: Create similar services for other entities (User, Category, etc.)
3. **Future**: Add Repository layer if needed for complex business logic

---

## 💡 Pro Tips

1. **Keep DTOs simple** - Just data shape, no methods
2. **Service returns raw data** - Let store/transformer handle formatting
3. **One service per entity** - ProjectService, UserService, CategoryService
4. **Use singleton pattern** - Export `projectService` instance
5. **Error handling** - Let errors bubble up, handle in store/components

---

**Result**: Your code is now more maintainable, testable, and follows industry best practices! 🎉
