<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <!-- Header Section -->
    <div
      class="hero-nodes py-20 border-b border-blue-800/30 dark:border-slate-700"
    >
      <UContainer>
        <div class="text-center space-y-4 max-w-2xl mx-auto">
          <h1
            class="text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-blue-900 dark:text-white"
          >
            Meet Our Students
          </h1>
          <p class="text-xl text-blue-900/80 dark:text-gray-300">
            Discover talented students and their contributions to the GIC
            program
          </p>
        </div>
      </UContainer>
    </div>

    <!-- Search and Filter -->
    <UContainer class="py-8 bg-white dark:bg-slate-900">
      <!-- Enhanced Search Bar -->
      <div class="w-full mb-8">
        <div class="relative group">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"
          >
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors"
            />
          </div>
          <UInput
            v-model="searchInput"
            placeholder="Search students by name, program, or skills... (e.g., John, Computer Science, Python)"
            icon="i-heroicons-magnifying-glass"
            size="xl"
            class="w-full rounded-xl border-2 border-gray-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
            :ui="{
              icon: { leading: { padding: { xl: 'ps-12' } } },
              base: 'text-base',
              placeholder: 'placeholder-gray-400 dark:placeholder-gray-500',
            }"
          />
          <div
            v-if="searchInput"
            class="absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <button
              @click="searchInput = ''"
              class="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <UIcon
                name="i-heroicons-x-mark"
                class="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              />
            </button>
          </div>
        </div>
        <!-- Search hint -->
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-1">
          <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline" />
          Tip: Search by student name, academic program, or technical skills
        </p>
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
      <div class="mt-4 text-gray-700 dark:text-gray-300">
        <p class="text-lg">
          <template v-if="totalPages > 1">
            Showing {{ paginatedStudents.length }} of
          </template>
          <span class="font-bold text-blue-900 dark:text-white">{{
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
    <UContainer
      class="pb-12 bg-gradient-to-b via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
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
          class="px-4 py-2 text-sm font-medium text-blue-900 dark:text-white bg-blue-50 dark:bg-slate-800 rounded-lg"
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
