<template>
  <div class="min-h-screen bg-white">
    <!-- Header Section -->
    <div class="hero-nodes py-20 border-b border-blue-800/30">
      <UContainer>
        <div class="space-y-6">
          <div class="text-center space-y-4 max-w-2xl mx-auto">
            <h1
              class="text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-blue-900"
            >
              Explore All Projects
            </h1>
            <p class="text-xl text-blue-900/80">
              Discover amazing projects built by GIC students across all
              semesters and categories
            </p>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap"
          >
            <ButtonsPresetButton
              preset="createProject"
              to="/projects/create"
              size="md"
            />

            <ButtonsPresetButton
              preset="viewBySemester"
              to="/projects/semester"
              size="md"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Filters and Projects -->
    <UContainer
      class="py-16 bg-gradient-to-b via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 space-y-6">
            <!-- Category Filter -->
            <div
              class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 space-y-4"
            >
              <h3 class="font-bold text-white text-lg">Categories</h3>
              <div class="space-y-3">
                <label
                  v-for="cat in categories"
                  :key="cat"
                  class="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    :value="cat"
                    v-model="selectedCategories"
                    class="w-4 h-4 rounded border-slate-600 text-blue-600"
                  />
                  <span
                    class="text-gray-200 group-hover:text-blue-300 transition-colors"
                    >{{ cat }}</span
                  >
                </label>
              </div>
            </div>

            <!-- Year Filter -->
            <div
              class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 space-y-4"
            >
              <h3 class="font-bold text-white text-lg">Year</h3>
              <div class="space-y-3">
                <label
                  v-for="year in years"
                  :key="year.value"
                  class="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    :value="year.value"
                    v-model="selectedYears"
                    class="w-4 h-4 rounded border-slate-600 text-blue-600"
                  />
                  <span
                    class="text-gray-200 group-hover:text-blue-300 transition-colors"
                    >{{ year.label }}</span
                  >
                </label>
              </div>
            </div>

            <!-- Semester Filter -->
            <div
              class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 space-y-4"
            >
              <h3 class="font-bold text-white text-lg">Semester</h3>
              <div class="space-y-3">
                <label
                  v-for="sem in availableSemesters"
                  :key="sem"
                  class="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    :value="sem"
                    v-model="selectedSemesters"
                    class="w-4 h-4 rounded border-slate-600 text-blue-600"
                  />
                  <span
                    class="text-gray-200 group-hover:text-blue-300 transition-colors"
                    >{{ sem }}</span
                  >
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects Grid -->
        <div class="lg:col-span-3">
          <div class="space-y-6">
            <!-- Results Count -->
            <div class="flex justify-between items-center">
              <p class="text-white">
                Showing
                <span class="text-white font-bold">{{
                  filteredProjects.length
                }}</span>
                projects
              </p>

              <!-- Sort -->

              <ButtonsPresetButton
                v-if="
                  selectedCategories.length > 0 ||
                  selectedYears.length > 0 ||
                  selectedSemesters.length > 0
                "
                preset="clearFilters"
                @click="clearFilters"
              />
            </div>

            <!-- Projects Cards -->
            <div class="grid md:grid-cols-2 gap-6">
              <ProjectCard
                v-for="project in filteredProjects"
                :key="project.id"
                :project="project"
                :liked-projects="likedProjects"
                @toggle-like="toggleLike"
              />
            </div>

            <!-- Empty State -->
            <div v-if="filteredProjects.length === 0" class="text-center py-20">
              <UIcon
                name="i-heroicons-inbox"
                class="w-16 h-16 text-gray-600 mx-auto mb-4"
              />
              <p class="text-gray-400 text-lg">
                No projects found matching your filters
              </p>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProjectStore } from "~/stores/projects";

const projectStore = useProjectStore();

// Fetch categories and semesters on mount
onMounted(async () => {
  await projectStore.fetchCategories();
  await projectStore.fetchProjects();
});

const categories = computed(() => projectStore.categories);
const projects = computed(() => projectStore.projects);

const selectedCategories = ref([]);
const selectedYears = ref([]);
const selectedSemesters = ref([]);

const likedProjects = ref({});
// Simple object to track like counts for each project
// Will be moved to store later

// Years and Semesters
const years = [
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
];

const availableSemesters = ["Semester 1", "Semester 2"];

const filteredProjects = computed(() => {
  let filtered = projects.value;

  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter((p) =>
      selectedCategories.value.includes(p.category)
    );
  }

  if (selectedYears.value.length > 0) {
    filtered = filtered.filter((p) => {
      // Extract year from semester string (e.g., "Fall 2024" -> "2024")
      const year = p.semester.match(/\d{4}/)?.[0];
      return year && selectedYears.value.includes(year);
    });
  }

  if (selectedSemesters.value.length > 0) {
    filtered = filtered.filter((p) => {
      // Map semester strings to Semester 1 or Semester 2
      // Fall/Spring = Semester 1, Summer = Semester 2 (or customize as needed)
      const semesterMap = {
        Fall: "Semester 1",
        Spring: "Semester 1",
        Summer: "Semester 2",
      };

      const semesterType = p.semester.split(" ")[0]; // Get "Fall", "Spring", or "Summer"
      const mappedSemester = semesterMap[semesterType];

      return mappedSemester && selectedSemesters.value.includes(mappedSemester);
    });
  }

  return filtered;
});

const clearFilters = () => {
  selectedCategories.value = [];
  selectedYears.value = [];
  selectedSemesters.value = [];
};

const toggleLike = (projectId) => {
  if (likedProjects.value[projectId]) {
    // Unlike: decrement count and remove from liked
    const project = projects.value.find((p) => p.id === projectId);
    if (project) {
      project.likes--;
    }
    delete likedProjects.value[projectId];
  } else {
    // Like: increment count and add to liked
    projectStore.likeProject(projectId);
    likedProjects.value[projectId] = true;
  }
};

useHead({
  title: "Projects - GIC Student Portal",
  meta: [
    {
      name: "description",
      content: "Browse all student projects from GIC program",
    },
  ],
});
</script>
