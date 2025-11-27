<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header Section -->
    <div class="hero-nodes py-20 border-b border-blue-800/30">
      <UContainer>
        <div class="space-y-6">
          <div class="text-center space-y-4 max-w-2xl mx-auto">
            <h1
              class="text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-white"
            >
              Search Results
            </h1>
            <p class="text-xl text-gray-300">
              <span v-if="searchQuery">Results for "{{ searchQuery }}"</span>
              <span v-else-if="programFilter"
                >Students in {{ programFilter }}</span
              >
              <span v-else>Browse students</span>
            </p>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap"
          >
            <UButton
              v-if="searchQuery || programFilter"
              color="primary"
              size="lg"
              icon="i-heroicons-x-mark-20-solid"
              @click="clearSearch"
            >
              Clear & View All Students
            </UButton>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Search Results -->
    <UContainer class="py-16">
      <div class="space-y-6">
        <!-- Results Count & Active Filters -->
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <p class="text-white">
            Found
            <span class="text-blue-400 font-bold">{{
              searchResults.length
            }}</span>
            {{ searchResults.length === 1 ? "student" : "students" }}
          </p>

          <!-- Active Filters -->
          <div
            v-if="searchQuery || programFilter"
            class="flex gap-2 items-center flex-wrap"
          >
            <UBadge v-if="searchQuery" color="primary" variant="soft" size="md">
              Search: {{ searchQuery }}
            </UBadge>
            <UBadge
              v-if="programFilter"
              color="primary"
              variant="soft"
              size="md"
            >
              Program: {{ programFilter }}
            </UBadge>
          </div>
        </div>

        <!-- No Results -->
        <div
          v-if="searchResults.length === 0"
          class="text-center py-16 bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl"
        >
          <UIcon
            name="i-heroicons-users-20-solid"
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
          />
          <h3 class="text-xl font-bold text-white mb-2">No Students Found</h3>
          <p class="text-gray-300 mb-6">
            Try adjusting your search terms or browse all students
          </p>
          <UButton
            color="primary"
            size="lg"
            icon="i-heroicons-users-20-solid"
            @click="clearSearch"
          >
            View All Students
          </UButton>
        </div>

        <!-- Students Grid -->
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="student in searchResults"
            :key="student.id"
            :to="`/students/${student.id}`"
            class="group cursor-pointer"
          >
            <div
              class="relative h-full rounded-xl overflow-hidden transition-all duration-300 border border-slate-700 group-hover:border-blue-500/70 bg-slate-800/50 backdrop-blur group-hover:bg-slate-800/80 shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/20"
            >
              <!-- Background Gradient -->
              <div
                class="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
              </div>

              <!-- Content -->
              <div class="p-6 space-y-4 -mt-12 relative z-10">
                <!-- Avatar -->
                <div class="relative inline-block">
                  <img
                    v-if="student.avatar"
                    :src="student.avatar"
                    :alt="student.name"
                    class="w-20 h-20 rounded-full border-4 border-slate-800 object-cover"
                  />
                  <div
                    v-else
                    class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold border-4 border-slate-800"
                  >
                    {{ student.name.charAt(0) }}
                  </div>
                </div>

                <!-- Name and Program -->
                <div>
                  <h3
                    class="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1"
                  >
                    {{ student.name }}
                  </h3>
                  <p class="text-sm text-gray-400">{{ student.program }}</p>
                </div>

                <!-- Year Badge -->
                <div class="flex gap-2 flex-wrap">
                  <UBadge color="primary" variant="soft" size="xs">
                    {{ student.year }}
                  </UBadge>
                  <UBadge
                    v-if="student.gpa"
                    color="info"
                    variant="soft"
                    size="xs"
                  >
                    GPA: {{ student.gpa.toFixed(2) }}
                  </UBadge>
                </div>

                <!-- Bio Preview -->
                <p class="text-sm text-gray-400 line-clamp-2">
                  {{ student.bio }}
                </p>

                <!-- Skills Preview -->
                <div class="space-y-2">
                  <p class="text-xs text-gray-400">Top Skills</p>
                  <div class="flex gap-1 flex-wrap">
                    <span
                      v-for="skill in student.skills.slice(0, 3)"
                      :key="skill"
                      class="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-medium"
                    >
                      {{ skill }}
                    </span>
                    <span
                      v-if="student.skills.length > 3"
                      class="text-xs px-2 py-1 rounded bg-slate-700 text-gray-400 font-medium"
                    >
                      +{{ student.skills.length - 3 }}
                    </span>
                  </div>
                </div>

                <!-- Stats -->
                <div
                  class="flex gap-4 pt-4 border-t border-slate-700 text-center"
                >
                  <div class="flex-1">
                    <p class="text-white font-bold">
                      {{ student.projects.length }}
                    </p>
                    <p class="text-xs text-gray-400">Projects</p>
                  </div>
                  <div class="flex-1">
                    <p class="text-white font-bold">
                      {{ student.achievements.length }}
                    </p>
                    <p class="text-xs text-gray-400">Achievements</p>
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStudentStore } from "~/stores/students";

const route = useRoute();
const router = useRouter();
const studentStore = useStudentStore();

// Get query params
const searchQuery = ref(route.query.search || "");
const programFilter = ref(route.query.program || "");

// Watch for route changes
watch(
  () => route.query,
  (newQuery) => {
    searchQuery.value = newQuery.search || "";
    programFilter.value = newQuery.program || "";
  }
);

// Get all students from store
const students = computed(() => studentStore.students);

// Filter students based on search query and program
const searchResults = computed(() => {
  let results = [...students.value];

  // Filter by program if specified
  if (programFilter.value) {
    results = results.filter(
      (student) =>
        student.program.toLowerCase() === programFilter.value.toLowerCase()
    );
  }

  // Filter by search query if specified
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.program.toLowerCase().includes(query) ||
        student.bio.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.skills.some((skill) => skill.toLowerCase().includes(query)) ||
        student.location.toLowerCase().includes(query)
    );
  }

  return results;
});

// Clear search and return to students page
const clearSearch = () => {
  router.push("/students");
};

useHead({
  title: searchQuery.value
    ? `Search: ${searchQuery.value} - Students`
    : programFilter.value
    ? `${programFilter.value} Students`
    : "Search Students - GIC Student Portal",
  meta: [
    {
      name: "description",
      content: "Search and discover students from GIC program",
    },
  ],
});
</script>
