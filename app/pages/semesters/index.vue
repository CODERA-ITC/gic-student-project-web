<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12 px-4"
  >
    <UContainer class="max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-semibold text-white mb-4">
          Academic Semesters
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl mx-auto">
          Explore projects and achievements from different semesters at GIC
        </p>
      </div>

      <!-- Semesters Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- Semester Card Template -->
        <div
          v-for="semester in semesters"
          :key="semester.id"
          class="group cursor-pointer"
        >
          <div
            class="h-full bg-gradient-to-br p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
            :style="`background: linear-gradient(135deg, ${semester.color}20 0%, ${semester.color}05 100%)`"
          >
            <!-- Semester Icon -->
            <div class="text-5xl mb-4">{{ semester.icon }}</div>

            <!-- Semester Info -->
            <h3 class="text-2xl font-semibold text-white mb-2">
              {{ semester.title }}
            </h3>
            <p class="text-gray-400 mb-4">{{ semester.period }}</p>

            <!-- Stats -->
            <div
              class="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-white/10"
            >
              <div class="text-center">
                <div class="text-2xl font-semibold text-blue-400">
                  {{ semester.projects }}
                </div>
                <div class="text-xs text-gray-400">Projects</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-semibold text-blue-400">
                  {{ semester.students }}
                </div>
                <div class="text-xs text-gray-400">Students</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-semibold text-blue-400">
                  {{ semester.year }}
                </div>
                <div class="text-xs text-gray-400">Year</div>
              </div>
            </div>

            <!-- Description -->
            <p class="text-gray-300 text-sm mb-6">{{ semester.description }}</p>

            <!-- View Button -->
            <button
              @click="viewSemester(semester.id)"
              class="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 group-hover:scale-105"
            >
              View Projects
              <UIcon
                name="i-heroicons-arrow-right"
                class="inline w-4 h-4 ml-2"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Additional Info Section -->
      <div
        class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto"
      >
        <h2 class="text-2xl font-semibold text-white mb-4">
          About Our Semesters
        </h2>
        <p class="text-gray-300 leading-relaxed mb-4">
          GIC (Global Innovation Challenge) is structured in academic semesters,
          with each semester showcasing the best projects and innovations from
          our student community. Each semester introduces new themes,
          challenges, and opportunities for students to demonstrate their
          skills.
        </p>
        <p class="text-gray-300 leading-relaxed">
          Browse through different semesters to discover projects, connect with
          talented students, and explore the evolution of innovation at GIC.
          Whether you're looking for inspiration or seeking collaboration
          opportunities, you'll find it here.
        </p>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const semesters = ref([
  {
    id: 1,
    title: "Semester 1",
    period: "Aug 2024 - Dec 2024",
    year: 2024,
    projects: 124,
    students: 89,
    icon: "🚀",
    color: "#3b82f6",
    description:
      "Foundational projects focusing on core technologies and problem-solving skills.",
  },
  {
    id: 2,
    title: "Semester 2",
    period: "Jan 2024 - May 2024",
    year: 2024,
    projects: 98,
    students: 76,
    icon: "💡",
    color: "#8b5cf6",
    description:
      "Advanced projects with focus on innovation and real-world applications.",
  },
  {
    id: 3,
    title: "Semester 1",
    period: "Aug 2023 - Dec 2023",
    year: 2023,
    projects: 156,
    students: 102,
    icon: "🎓",
    color: "#06b6d4",
    description:
      "Comprehensive projects showcasing diverse technical domains and expertise.",
  },
  {
    id: 4,
    title: "Semester 2",
    period: "Jan 2023 - May 2023",
    year: 2023,
    projects: 112,
    students: 85,
    icon: "🏆",
    color: "#ec4899",
    description:
      "Award-winning projects and notable achievements in student development.",
  },
  {
    id: 5,
    title: "Semester 1",
    period: "Aug 2022 - Dec 2022",
    year: 2022,
    projects: 89,
    students: 67,
    icon: "⭐",
    color: "#f59e0b",
    description:
      "Historical semester featuring pioneering projects and innovations.",
  },
  {
    id: 6,
    title: "Semester 2",
    period: "Jan 2022 - May 2022",
    year: 2022,
    projects: 76,
    students: 58,
    icon: "🔥",
    color: "#10b981",
    description: "Milestone projects that shaped the future of our community.",
  },
]);

const viewSemester = (semesterId) => {
  navigateTo(`/semesters/${semesterId}`);
};
</script>
