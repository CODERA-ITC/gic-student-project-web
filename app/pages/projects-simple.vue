<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Projects - Simple Pagination</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
      ></div>
      <p class="mt-4">Loading projects...</p>
    </div>

    <!-- Projects List -->
    <div v-else>
      <!-- Projects Grid -->
      <div v-if="projects.length > 0" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="project in projects"
            :key="project.id"
            class="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h3 class="font-bold text-xl mb-2">{{ project.name }}</h3>
            <p class="text-gray-600 text-sm mb-3">{{ project.description }}</p>
            <span
              class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {{ project.category }}
            </span>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="mt-8 space-y-4">
          <!-- Page Info -->
          <div class="text-center text-sm text-gray-600">
            Showing page {{ currentPage }} of {{ totalPages }} ({{
              totalItems
            }}
            total projects)
          </div>

          <!-- Pagination Buttons -->
          <div class="flex justify-center items-center gap-2">
            <!-- First Page -->
            <button
              @click="firstPage"
              :disabled="!hasPrevPage"
              class="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              First
            </button>

            <!-- Previous -->
            <button
              @click="prevPage"
              :disabled="!hasPrevPage"
              class="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              ← Prev
            </button>

            <!-- Page Numbers -->
            <template v-for="page in getPageNumbers()" :key="page">
              <!-- Ellipsis -->
              <span v-if="page === -1" class="px-2">...</span>

              <!-- Page Button -->
              <button
                v-else
                @click="goToPage(page)"
                :class="[
                  'px-3 py-2 border rounded',
                  page === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100',
                ]"
              >
                {{ page }}
              </button>
            </template>

            <!-- Next -->
            <button
              @click="nextPage"
              :disabled="!hasNextPage"
              class="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next →
            </button>

            <!-- Last Page -->
            <button
              @click="lastPage"
              :disabled="!hasNextPage"
              class="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 text-lg">No projects found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  // Data
  projects,
  loading,
  currentPage,
  totalPages,
  totalItems,
  hasNextPage,
  hasPrevPage,

  // Methods
  loadProjects,
  goToPage,
  nextPage,
  prevPage,
  firstPage,
  lastPage,
  getPageNumbers,
} = useProjectPagination();

// Load projects on mount
onMounted(async () => {
  await loadProjects();
});
</script>
