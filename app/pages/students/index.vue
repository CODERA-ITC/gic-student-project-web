<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <UContainer>
        <div class="text-center space-y-4 max-w-2xl mx-auto">
          <h1 class="text-5xl lg:text-6xl font-black text-white leading-tight">
            Meet Our Students
          </h1>
          <p class="text-xl text-gray-200">
            Discover talented students and their contributions to the GIC
            program
          </p>
        </div>
      </UContainer>
    </div>

    <!-- Search and Filter -->
    <UContainer class="py-8">
      <!-- Full Width Search -->
      <div class="w-full mb-6">
        <div class="relative">
          <UIcon
            name="i-heroicons-magnifying-glass"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
          />
          <UInput
            v-model="searchInput"
            placeholder="Search students by name, program, or skills..."
            class="pl-10 w-full rounded-xl border border-gray-300 dark:border-gray-700"
            size="xl"
          />
        </div>
      </div>

      <!-- Top Skills Filter -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filter by Top Skills
        </h3>
        <div class="flex flex-wrap gap-3">
          <ButtonsPresetButton
            v-for="skill in topSkills"
            :key="skill"
            @click="toggleSkillFilter(skill)"
            :label="skill"
            :color="selectedSkill === skill ? 'primary' : 'secondary'"
            :variant="selectedSkill === skill ? 'solid' : 'ghost'"
            size="md"
            class="transition-all duration-200"
          >
            {{ skill }}
          </ButtonsPresetButton>
        </div>
      </div>

      <!-- Other Filters -->
      <div
        class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <!-- Clear All Filters -->
        <ButtonsPresetButton
          v-if="hasActiveFilters"
          @click="clearFilters"
          preset="clearFilters"
          class="w-full sm:w-auto"
        >
          Clear All Filters
        </ButtonsPresetButton>
      </div>

      <!-- Results Count -->
      <div class="mt-4 text-gray-600 dark:text-gray-400">
        <p class="text-sm">
          <template v-if="totalPages > 1">
            Showing {{ paginatedStudents.length }} of
          </template>
          <span class="font-bold text-blue-900">{{
            studentStore.filteredStudents.length
          }}</span>
          students
          <template v-if="totalPages > 1">
            (Page {{ currentPage }} of {{ totalPages }})
          </template>
        </p>
      </div>
    </UContainer>

    <!-- Students Grid -->
    <UContainer class="pb-12">
      <!-- Students Grid -->
      <div
        class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
      >
        <StudentCard
          v-for="student in paginatedStudents"
          :key="student.id"
          :name="student.name"
          :main-skill="student.program"
          :image="student.avatar"
          :header-image="''"
          :tech-skills="student.skills"
          :projects="student.projects.length"
          :generation="student.graduationYear.toString()"
          :joined-year="new Date(student.joinedDate).getFullYear().toString()"
          @view-profile="() => navigateTo(`/students/${student.id}`)"
        />
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center items-center gap-4 mt-8"
      >
        <ButtonsPresetButton
          label="Previous"
          icon="i-heroicons-arrow-left"
          color="secondary"
          variant="outline"
          size="md"
          :disabled="currentPage === 1"
          @click="currentPage = Math.max(1, currentPage - 1)"
        />

        <span
          class="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-50 rounded-lg"
        >
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <ButtonsPresetButton
          label="Next"
          icon="i-heroicons-arrow-right"
          color="primary"
          variant="solid"
          size="md"
          :disabled="currentPage === totalPages"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        />
      </div>

      <!-- Pagination Info -->
      <div
        v-if="studentStore.filteredStudents.length > 0"
        class="text-center mt-6"
      >
        <p class="text-sm text-gray-600">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
          {{
            Math.min(
              currentPage * itemsPerPage,
              studentStore.filteredStudents.length
            )
          }}
          of {{ studentStore.filteredStudents.length }} students
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-if="studentStore.filteredStudents.length === 0"
        class="text-center py-20"
      >
        <UIcon
          name="i-heroicons-users"
          class="w-16 h-16 text-gray-400 mx-auto mb-4"
        />
        <p class="text-gray-500 text-lg mb-2">No students found</p>
        <p class="text-gray-400 text-sm">
          Try adjusting your search criteria or filters
        </p>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { useStudentStore } from "~/stores/students";

// Store
const studentStore = useStudentStore();

// Top skills categories based on common developer roles
const topSkills = [
  "Web Developer",
  "Mobile Developer",
  "Network Administrator",
  "Data Scientist",
  "DevOps Engineer",
  "Cybersecurity",
  "AI/ML Engineer",
  "Full Stack Developer",
];

// Selected skill filter
const selectedSkill = ref("");

// Search input with debounce
const searchInput = ref("");
let searchTimeout = null;

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(12);

// Sort options for the dropdown
const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Program", value: "program" },
  { label: "Year", value: "year" },
  { label: "GPA", value: "gpa" },
  { label: "Projects", value: "projects" },
];

// Computed properties
const hasActiveFilters = computed(() => {
  return (
    studentStore.filters.program !== "All" ||
    studentStore.filters.year !== "All" ||
    studentStore.filters.search !== "" ||
    studentStore.filters.sortBy !== "name" ||
    selectedSkill.value !== ""
  );
});

// Pagination computed properties
const paginatedStudents = computed(() => {
  const filtered = studentStore.filteredStudents;
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filtered.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(studentStore.filteredStudents.length / itemsPerPage.value);
});

// Methods
const toggleSkillFilter = (skill) => {
  if (selectedSkill.value === skill) {
    selectedSkill.value = "";
    studentStore.setFilter("search", "");
  } else {
    selectedSkill.value = skill;
    // Set search to match the skill category
    studentStore.setFilter("search", skill);
  }
};

const clearSkillFilter = () => {
  selectedSkill.value = "";
  searchInput.value = "";
  studentStore.setFilter("search", "");
};

const clearFilters = () => {
  selectedSkill.value = "";
  searchInput.value = "";
  studentStore.clearFilters();
  currentPage.value = 1; // Reset to first page

  // Clear any pending search timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
};

// Watch for filter changes to reset pagination
watch([() => studentStore.filters.search, () => selectedSkill.value], () => {
  currentPage.value = 1;
});

// Debounced search functionality
watch(searchInput, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    studentStore.setFilter("search", newValue);
  }, 3000); // 3 second delay
});

// Page meta
useHead({
  title: "Students - GIC Student Portal",
  meta: [
    {
      name: "description",
      content: "Meet talented GIC students and their projects",
    },
  ],
});
</script>
