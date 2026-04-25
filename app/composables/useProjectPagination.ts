import { useProjectStore } from "~/stores/projects";

export const useProjectPagination = () => {
  const projectStore = useProjectStore();

  // Load projects for current page with all filters
  const loadProjects = async () => {
    try {
      await projectStore.fetchProjects(projectStore.pagination.currentPage, projectStore.pagination.itemsPerPage);
    } catch (error) {
      console.error("Error loading projects:", error);
      throw error;
    }
  };

  // Navigate to a specific page
  const goToPage = async (page: number) => {
    projectStore.setCurrentPage(page);
    await loadProjects();
    scrollToTop();
  };

  // Go to next page
  const nextPage = async () => {
    projectStore.nextPage();
    await loadProjects();
    scrollToTop();
  };

  // Go to previous page
  const prevPage = async () => {
    projectStore.prevPage();
    await loadProjects();
    scrollToTop();
  };

  // Go to first page
  const firstPage = async () => {
    projectStore.setCurrentPage(1);
    await loadProjects();
    scrollToTop();
  };

  // Go to last page
  const lastPage = async () => {
    projectStore.setCurrentPage(projectStore.pagination.totalPages);
    await loadProjects();
    scrollToTop();
  };

  // Update a filter and reload
  const updateFilter = async (
    key: keyof typeof projectStore.filters,
    value: any,
  ) => {
    projectStore.setFilter(key, value);
    await loadProjects();
  };

  // Clear all filters and reload
  const clearAllFilters = async () => {
    projectStore.clearFilters();
    await loadProjects();
  };

  // Refresh current page
  const refresh = async () => {
    await loadProjects();
  };

  // Scroll to top helper
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Computed properties for easy access
  const currentPage = computed(() => projectStore.pagination.currentPage);
  const totalPages = computed(() => projectStore.pagination.totalPages);
  const totalItems = computed(() => projectStore.pagination.totalItems);
  const itemsPerPage = computed(() => projectStore.pagination.itemsPerPage);
  const projects = computed(() => projectStore.projects);
  const loading = computed(() => projectStore.loading);
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPrevPage = computed(() => currentPage.value > 1);

  // Generate page numbers for pagination UI
  const getPageNumbers = (maxVisible = 5) => {
    const current = currentPage.value;
    const total = totalPages.value;
    const pages: number[] = [];

    if (total <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Show a window of pages around current page
      let start = Math.max(1, current - Math.floor(maxVisible / 2));
      let end = Math.min(total, start + maxVisible - 1);

      // Adjust start if we're near the end
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      // Add first page and ellipsis if needed
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push(-1); // -1 represents ellipsis
        }
      }

      // Add visible page range
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis and last page if needed
      if (end < total) {
        if (end < total - 1) {
          pages.push(-1); // -1 represents ellipsis
        }
        pages.push(total);
      }
    }

    return pages;
  };

  return {
    // Methods
    loadProjects,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    updateFilter,
    clearAllFilters,
    refresh,
    getPageNumbers,

    // Computed properties
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    projects,
    loading,
    hasNextPage,
    hasPrevPage,
  };
};
