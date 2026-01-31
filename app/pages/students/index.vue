<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <ScrollToTop />

    <!-- Header Section -->
    <div
      class="hero-nodes py-20 border-b border-blue-800/30 dark:border-slate-700"
    >
      <UContainer>
        <div class="space-y-6">
          <div class="text-center space-y-4 max-w-2xl mx-auto">
            <h1
              class="text-4xl lg:text-6xl font-semibold tracking-tight leading-tight text-blue-900 dark:text-white"
            >
              Meet Our Students
            </h1>
            <p class="text-xl text-blue-900/80 dark:text-gray-300">
              Discover talented students and their contributions to the GIC
              program
            </p>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap"
          >
            <ButtonsPresetButton
              preset="exploreProjects"
              to="/projects"
              size="md"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Sticky Top Bar -->
    <div
      class="sticky top-0 z-[140] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-slate-700"
    >
      <UContainer>
        <div class="flex items-center justify-between w-full gap-2 py-2">
          <!-- Sort Dropdown -->
          <div class="relative">
            <USelectMenu
              v-model="selectedSort"
              size="xl"
              :items="sortOptions"
              class="w-35 rounded-xl"
            />
          </div>

          <!-- Skills Pills -->
          <div class="flex-1">
            <div class="flex items-center justify-center gap-1 flex-wrap">
              <!-- Desktop Skills -->
              <div class="hidden md:flex flex-wrap gap-2 justify-center">
                <ButtonsPresetButton
                  v-for="skill in topSkills"
                  :key="skill"
                  :label="skill"
                  :color="selectedSkill === skill ? 'primary' : 'secondary'"
                  :variant="selectedSkill === skill ? 'solid' : 'ghost'"
                  size="md"
                  @click="toggleSkillFilter(skill)"
                />
              </div>

              <!-- Mobile Skills Select -->
              <div class="relative md:hidden w-full">
                <USelectMenu
                  v-model="selectedSkillObj"
                  size="xl"
                  :items="skillOptions"
                  placeholder="Select skill"
                  class="w-full rounded-xl"
                />
              </div>
            </div>
          </div>

          <!-- Filters Button -->
          <ButtonsPresetButton
            label="Filters"
            icon="i-heroicons-funnel"
            :color="showFilters ? 'primary' : 'secondary'"
            :variant="showFilters ? 'solid' : 'outline'"
            size="md"
            @click="toggleFilters"
          />
        </div>

        <!-- Expandable Filters Panel -->
        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 -translate-y-3"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-3"
        >
          <div
            v-if="showFilters"
            class="rounded-2xl p-6 border border-blue-200 dark:border-slate-700 bg-blue-50/30 dark:bg-slate-800/50 backdrop-blur-sm space-y-4 shadow-lg"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Search Input -->
              <div class="relative">
                <p
                  class="text-lg font-semibold mb-2 text-blue-900 dark:text-white"
                >
                  Search Students
                </p>
                <UInput
                  v-model="searchInput"
                  placeholder="Search by name, program, or skills..."
                  icon="i-heroicons-magnifying-glass"
                  class="w-full rounded-xl"
                  size="xl"
                />
              </div>

              <!-- Program Filter -->
              <div>
                <p
                  class="text-lg font-semibold mb-2 text-blue-900 dark:text-white"
                >
                  Program
                </p>
                <USelectMenu
                  v-model="selectedProgram"
                  size="xl"
                  :items="programOptions"
                  placeholder="Select program"
                  class="w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </Transition>
      </UContainer>
    </div>

    <!-- Main Content -->
    <Transition enter-active-class="transition-all ease-out duration-700">
      <UContainer
        class="py-9 bg-gradient-to-b via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      >
        <div class="space-y-6">
          <!-- Results and Active Filters -->
          <div class="flex items-center justify-between flex-wrap gap-4">
            <!-- Results Count -->
            <div class="flex items-center gap-4">
              <p class="text-lg text-gray-700 dark:text-gray-300">
                <template v-if="totalPages > 1">
                  Showing {{ paginatedStudents.length }} of
                </template>
                <span class="font-semibold text-blue-900 dark:text-white">{{
                  studentStore.filteredStudents.length
                }}</span>
                students
                <template v-if="totalPages > 1">
                  (Page {{ currentPage }} of {{ totalPages }})
                </template>
              </p>

              <!-- Active Filters -->
              <div
                v-if="
                  hasActiveFilters &&
                  selectedSkill &&
                  selectedSkill !== 'All Skills'
                "
                class="flex items-center gap-2"
              >
                <span class="text-md text-gray-500 dark:text-gray-400">•</span>
                <div class="flex flex-wrap gap-1">
                  <UBadge
                    v-if="selectedSkill && selectedSkill !== 'All Skills'"
                    color="primary"
                    variant="soft"
                    size="sm"
                    class="flex items-center gap-1"
                  >
                    {{ selectedSkill }}
                    <UButton
                      @click="selectedSkill = ''"
                      color="primary"
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-x-mark"
                      :padded="false"
                      class="ml-1"
                    />
                  </UBadge>
                  <UBadge
                    v-if="searchInput"
                    color="primary"
                    variant="soft"
                    size="sm"
                    class="flex items-center gap-1"
                  >
                    Search: "{{ searchInput }}"
                    <UButton
                      @click="searchInput = ''"
                      color="primary"
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-x-mark"
                      :padded="false"
                      class="ml-1"
                    />
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Clear All Filters Button -->
            <ButtonsPresetButton
              v-if="hasActiveFilters && selectedSkill !== 'All Skills'"
              preset="clearFilters"
              @click="clearFilters"
            />
          </div>

          <!-- Students Grid -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <StudentPortfolio
              v-for="student in paginatedStudents"
              :key="student.id"
              :name="student.name"
              :program="student.program"
              :year="student.year"
              :avatar="student.avatar"
              :bio="student.bio"
              :skills="student.skills"
              :project-count="student.projects.length"
              :gpa="student.gpa"
              :achievements="student.achievements?.length || 0"
              :graduation-year="student.graduationYear"
              :gen="student.gen"
              :social="student.social"
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
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
              {{
                Math.min(
                  currentPage * itemsPerPage,
                  studentStore.filteredStudents.length,
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
              class="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4"
            />
            <p class="text-gray-400 dark:text-gray-500 text-lg">
              No students found matching your filters
            </p>
          </div>
        </div>
      </UContainer>
    </Transition>
  </div>
</template>

<script setup>
import { useStudentStore } from "~/stores/students";

// Store
const studentStore = useStudentStore();

// Filter state
const showFilters = ref(false);

// Initialize store data on mount
onMounted(() => {
  // Ensure student store has data
  if (studentStore.students.length === 0) {
    console.warn("No students in store");
  }
});

// Top skills categories
const topSkills = [
  "All Skills",
  "Web Developer", // can be front-end or back-end
  "Full Stack Developer",
  "Mobile Developer",
  "AI/ML Engineer",
];

// Selected skill filter (default to "All Skills")
const selectedSkill = ref("All Skills");

// Search input with debounce
const searchInput = ref("");
let searchTimeout = null;

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(12);

// Sort options
const sortOptions = ref([
  { label: "Name", value: "name", icon: "i-heroicons-user" },
  { label: "Program", value: "program", icon: "i-heroicons-academic-cap" },
  { label: "Projects", value: "projects", icon: "i-heroicons-folder" },
  { label: "Year", value: "year", icon: "i-heroicons-calendar" },
]);

const selectedSort = ref(sortOptions.value[0]);

// Program options for filter
const programOptions = ref([
  { label: "All Programs", value: "All" },
  { label: "Computer Science", value: "Computer Science" },
  { label: "Software Engineering", value: "Software Engineering" },
  { label: "Information Technology", value: "Information Technology" },
  { label: "Data Science", value: "Data Science" },
]);

const selectedProgram = ref(programOptions.value[0]);

// Skill options for mobile select
const skillOptions = computed(() =>
  topSkills.map((skill) => ({ label: skill, value: skill })),
);

const selectedSkillObj = computed({
  get: () =>
    skillOptions.value.find((s) => s.value === selectedSkill.value) ||
    skillOptions.value[0],
  set: (val) => {
    selectedSkill.value = val.value;
    if (val.value === "All Skills") {
      studentStore.setFilter("search", "");
    } else {
      studentStore.setFilter("search", val.value);
    }
  },
});

// Toggle filters panel
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};
// Computed properties
const hasActiveFilters = computed(() => {
  return (
    studentStore.filters.search !== "" ||
    selectedSkill.value !== "" ||
    selectedProgram.value.value !== "All" ||
    selectedSort.value.value !== "name"
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
  if (skill === "All Skills") {
    selectedSkill.value = "All Skills";
    studentStore.setFilter("search", "");
  } else if (selectedSkill.value === skill) {
    selectedSkill.value = "All Skills";
    studentStore.setFilter("search", "");
  } else {
    selectedSkill.value = skill;
    studentStore.setFilter("search", skill);
  }
};

const clearFilters = () => {
  selectedSkill.value = "All Skills";
  searchInput.value = "";
  selectedProgram.value = programOptions.value[0];
  selectedSort.value = sortOptions.value[0];
  studentStore.clearFilters();
  currentPage.value = 1;

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
};

// Watch for filter changes to reset pagination
watch(
  [
    () => studentStore.filters.search,
    () => selectedSkill.value,
    () => selectedProgram.value,
  ],
  () => {
    currentPage.value = 1;
  },
);

// Watch for sort changes
watch(selectedSort, (newSort) => {
  if (newSort?.value) {
    studentStore.setFilter("sortBy", newSort.value);
  }
});

// Watch for program changes
watch(selectedProgram, (newProgram) => {
  if (newProgram?.value) {
    studentStore.setFilter("program", newProgram.value);
  }
});

// Debounced search functionality
watch(searchInput, (newValue) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    studentStore.setFilter("search", newValue);
  }, 2000);
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
