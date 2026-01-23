# Pagination Implementation Guide

## Overview

This guide explains how to use the pagination system for listing projects with page-based navigation.

## How It Works

The pagination system fetches projects from the API using `page` and `limit` parameters:

- **Default limit**: 9 items per page
- **Default page**: 1
- **API endpoint**: `/api/projects?page=1&limit=9`

Each time you navigate to a different page, it fetches only that page's data from the backend.

## Store Methods

### Pagination Navigation

```typescript
// Set a specific page
projectStore.setCurrentPage(2); // Goes to page 2
await projectStore.fetchProjects(); // Fetch page 2 data

// Next page
projectStore.nextPage();
await projectStore.fetchProjects();

// Previous page
projectStore.prevPage();
await projectStore.fetchProjects();
```

### Accessing Pagination Data

```typescript
// Current pagination state
projectStore.pagination.currentPage; // Current page number
projectStore.pagination.totalPages; // Total number of pages
projectStore.pagination.totalItems; // Total number of items
projectStore.pagination.itemsPerPage; // Items per page (9)

// Current page projects
projectStore.projects; // Array of projects for current page
```

## Using the Composable (Recommended)

### Basic Usage

```vue
<script setup lang="ts">
const {
  // Data
  projects, // Current page projects
  loading, // Loading state
  currentPage, // Current page number
  totalPages, // Total pages
  totalItems, // Total items
  hasNextPage, // Boolean: has next page
  hasPrevPage, // Boolean: has previous page

  // Navigation methods
  goToPage, // (page: number) => Promise<void>
  nextPage, // () => Promise<void>
  prevPage, // () => Promise<void>
  firstPage, // () => Promise<void>
  lastPage, // () => Promise<void>

  // Utility methods
  loadProjects, // () => Promise<void>
  getPageNumbers, // (maxVisible?: number) => number[]
  updateFilter, // (key, value) => Promise<void>
  refresh, // () => Promise<void>
} = useProjectPagination();

// Load on mount
onMounted(() => loadProjects());
</script>

<template>
  <div>
    <!-- Project List -->
    <div v-for="project in projects" :key="project.id">
      {{ project.name }}
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" :disabled="!hasPrevPage">Previous</button>
      <button @click="nextPage" :disabled="!hasNextPage">Next</button>
    </div>
  </div>
</template>
```

### Advanced Pagination UI

```vue
<template>
  <div class="flex gap-2">
    <!-- First -->
    <button @click="firstPage" :disabled="!hasPrevPage">First</button>

    <!-- Previous -->
    <button @click="prevPage" :disabled="!hasPrevPage">← Prev</button>

    <!-- Page Numbers -->
    <template v-for="page in getPageNumbers()" :key="page">
      <span v-if="page === -1">...</span>
      <button
        v-else
        @click="goToPage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
    </template>

    <!-- Next -->
    <button @click="nextPage" :disabled="!hasNextPage">Next →</button>

    <!-- Last -->
    <button @click="lastPage" :disabled="!hasNextPage">Last</button>
  </div>

  <!-- Page Info -->
  <div class="text-center">
    Page {{ currentPage }} of {{ totalPages }} ({{ totalItems }} items)
  </div>
</template>
```

## With Filters

Filters automatically reset to page 1:

```vue
<script setup lang="ts">
const { updateFilter, loadProjects } = useProjectPagination();

// Change category
const changeCategory = async (category: string) => {
  await updateFilter("categories", [category]);
  // Automatically goes to page 1 and fetches
};

// Search
const search = async (query: string) => {
  await updateFilter("search", query);
};

// Sort
const sort = async (sortBy: string) => {
  await updateFilter("sort", sortBy);
};
</script>
```

## Direct Store Usage (Without Composable)

```vue
<script setup lang="ts">
import { useProjectStore } from "~/stores/projects";

const projectStore = useProjectStore();

// Navigate to page
const goToPage = async (page: number) => {
  projectStore.setCurrentPage(page);
  await projectStore.fetchProjects();
};

// Next/Previous
const next = async () => {
  projectStore.nextPage();
  await projectStore.fetchProjects();
};

const prev = async () => {
  projectStore.prevPage();
  await projectStore.fetchProjects();
};

// With filters
const filterByCategory = async (category: string) => {
  projectStore.setFilter("categories", [category]);
  // setFilter automatically resets to page 1
  await projectStore.fetchProjects();
};

// Load initial data
onMounted(() => projectStore.fetchProjects());
</script>
```

## API Request Examples

When you use pagination, the store automatically builds the correct API request:

```
// Page 1
GET /api/projects?page=1&limit=9

// Page 2
GET /api/projects?page=2&limit=9

// Page 3 with filter
GET /api/projects?page=3&limit=9&category=AI&search=machine

// With all filters
GET /api/projects?page=1&limit=9&category=Web&tags=Vue,Nuxt&year=2024&sort=views
```

## Example Components

### Simple Pagination

See: `/pages/projects-simple.vue`

Basic pagination with First, Prev, Page Numbers, Next, Last buttons.

### Advanced Example

See: `/pages/projects-example.vue`

Includes:

- Category filter
- Search
- Sort options
- Full pagination controls
- Loading states
- Empty states

## Common Patterns

### Auto-scroll to top on page change

```typescript
const goToPage = async (page: number) => {
  await pagination.goToPage(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
};
```

### Debounced search

```typescript
import { useDebounceFn } from "@vueuse/core";

const handleSearch = useDebounceFn(async (query: string) => {
  await updateFilter("search", query);
}, 500);
```

### Refresh after mutation

```typescript
const createProject = async (data: any) => {
  await $fetch("/api/projects", { method: "POST", body: data });
  await refresh(); // Refresh current page
};
```

## Summary

✅ **Simple**: Just call `fetchProjects()` after changing page
✅ **No caching**: Each page request fetches fresh data from API  
✅ **Filter-aware**: Changing filters resets to page 1
✅ **Type-safe**: Full TypeScript support
✅ **Flexible**: Use composable or store directly

The pagination is already implemented in your store - just use it! 🚀
