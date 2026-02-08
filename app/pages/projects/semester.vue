<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header Section -->
    <div class="hero-nodes py-20 border-b border-blue-800/30">
      <UContainer>
        <!--   All content inside this div will be centered and have a max-width   -->
        <div class="text-center space-y-4 max-w-2xl mx-auto">
          <h1 class="text-5xl lg:text-6xl font-black text-white leading-tight">
            Projects by Semester
          </h1>
          <p class="text-xl text-gray-300">
            Browse projects organized by academic semester
          </p>
        </div>
      </UContainer>
    </div>

    <!-- Semester Tabs -->
    <UContainer class="py-12">
      <div class="space-y-12">
        <!-- Semester Selector -->
        <div class="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 lg:mx-0 lg:px-0">
          <button v-for="sem in semesters" :key="sem" @click="selectedSemester = sem" :class="[
            'px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300',
            selectedSemester === sem
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700',
          ]">
            {{ sem }}
            <span class="ml-2 text-sm opacity-70">
              ({{ projectsBySemester(sem).length }})
            </span>
          </button>
        </div>

        <!-- Current Semester Projects -->
        <div class="space-y-8">
          <!-- By Category -->
          <div v-for="category in categoriesInSemester" :key="category" class="space-y-4">
            <div class="flex items-center gap-3 pb-4 border-b border-slate-700">
              <div class="w-1 h-6 bg-blue-500 rounded"></div>
              <h2 class="text-2xl font-semibold text-white">{{ category }}</h2>
              <span class="ml-auto text-gray-400">
                {{ projectsByCategory(category).length }} projects
              </span>
            </div>

            <!-- Projects Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NuxtLink v-for="project in projectsByCategory(category)" :key="project.id"
                :to="`/projects/${project.id}`" class="group cursor-pointer">
                <div
                  class="relative h-full rounded-xl overflow-hidden transition-all duration-300 border border-slate-700 group-hover:border-blue-500/70 bg-slate-800/50 backdrop-blur group-hover:bg-slate-800/80 shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                  <!-- Emoji Header -->
                  <div :class="[
                    project.gradient,
                    'h-28 flex items-center justify-center text-5xl transform group-hover:scale-110 transition-transform duration-300',
                  ]">
                    {{ project.emoji }}
                  </div>

                  <!-- Content -->
                  <div class="p-6 space-y-4">
                    <div>
                      <h3
                        class="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                        {{ project.title }}
                      </h3>
                      <p class="text-gray-400 text-sm line-clamp-2 mt-2">
                        {{ project.description }}
                      </p>
                    </div>

                    <!-- Category Badge -->
                    <div>
                      <UBadge color="primary" variant="soft" size="sm">
                        {{ project.category }}
                      </UBadge>
                    </div>

                    <!-- Author Info -->
                    <div class="pt-4 border-t border-slate-700">
                      <p class="text-xs text-gray-500">Author</p>
                      <p class="text-sm font-medium text-gray-300">
                        {{ project.author }}
                      </p>
                    </div>

                    <!-- Stats Footer -->
                    <div class="flex items-center justify-between pt-4 border-t border-slate-700 text-xs text-gray-400">
                      <div class="flex gap-3">
                        <span>👁️ {{ project.views }}</span>
                        <span class="cursor-pointer hover:text-pink-400 transition-colors">
                          ❤️ {{ project.likes }}
                        </span>
                      </div>
                      <span class="text-yellow-400">★ {{ project.rating }}</span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="projectsBySemester(selectedSemester).length === 0" class="text-center py-20">
            <UIcon name="i-heroicons-inbox" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p class="text-gray-400 text-lg">
              No projects found for {{ selectedSemester }}
            </p>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Statistics Section -->
    <div class="py-12 bg-slate-800/50 border-t border-slate-700 mt-12">
      <UContainer>
        <div class="grid md:grid-cols-4 gap-6">
          <div v-for="stat in statistics" :key="stat.label"
            class="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <p class="text-3xl font-semibold text-blue-400">{{ stat.value }}</p>
            <p class="text-gray-400 text-sm mt-2">{{ stat.label }}</p>
          </div>
        </div>
      </UContainer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const selectedSemester = ref("Semester 1, 2024");

const semesters = [
  "Semester 1, 2024",
  "Semester 2, 2024",
  "Semester 1, 2023",
  "Semester 2, 2023",
];

// Mock projects data
const allProjects = [
  {
    id: 1,
    title: "AI Chat Assistant",
    description:
      "An intelligent chatbot powered by GPT-3 for customer support.",
    category: "AI/ML",
    semester: "Semester 2, 2024",
    emoji: "🤖",
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
    author: "Sarah Chen",
    views: "2.5K",
    likes: "342",
    rating: "4.8",
  },
  {
    id: 2,
    title: "Mobile Fitness App",
    description: "Track workouts, nutrition, and health metrics on the go.",
    category: "Mobile",
    semester: "Semester 1, 2024",
    emoji: "💪",
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    author: "Alex Rodriguez",
    views: "1.8K",
    likes: "256",
    rating: "4.6",
  },
  {
    id: 3,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with payment integration.",
    category: "Web",
    semester: "Semester 2, 2024",
    emoji: "🛍️",
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
    author: "Priya Patel",
    views: "3.2K",
    likes: "521",
    rating: "4.9",
  },
  {
    id: 4,
    title: "Climate Monitoring IoT",
    description: "Real-time environmental monitoring using IoT sensors.",
    category: "IoT",
    semester: "Semester 1, 2024",
    emoji: "🌍",
    gradient: "bg-gradient-to-br from-cyan-500 to-blue-600",
    author: "Jordan Kim",
    views: "890",
    likes: "167",
    rating: "4.5",
  },
  {
    id: 5,
    title: "Machine Learning Pipeline",
    description:
      "Automated ML pipeline for data processing and model training.",
    category: "AI/ML",
    semester: "Semester 1, 2024",
    emoji: "🧠",
    gradient: "bg-gradient-to-br from-orange-500 to-red-600",
    author: "Emma Watson",
    views: "1.2K",
    likes: "298",
    rating: "4.7",
  },
  {
    id: 6,
    title: "Social Media Dashboard",
    description: "Analytics dashboard for social media metrics and insights.",
    category: "Web",
    semester: "Semester 2, 2024",
    emoji: "📊",
    gradient: "bg-gradient-to-br from-yellow-500 to-orange-600",
    author: "Mike Johnson",
    views: "2.1K",
    likes: "445",
    rating: "4.8",
  },
];

const projectsBySemester = (semester) => {
  return allProjects.filter((p) => p.semester === semester);
};

const categoriesInSemester = computed(() => {
  const projects = projectsBySemester(selectedSemester.value);
  const cats = new Set(projects.map((p) => p.category));
  return Array.from(cats);
});

const projectsByCategory = (category) => {
  return projectsBySemester(selectedSemester.value).filter(
    (p) => p.category === category,
  );
};

const statistics = computed(() => {
  const projects = projectsBySemester(selectedSemester.value);
  return [
    {
      label: "Total Projects",
      value: projects.length,
    },
    {
      label: "Total Likes",
      value: projects
        .reduce(
          (sum, p) =>
            sum + parseInt(p.likes.replace("K", "000").replace(",", "")),
          0,
        )
        .toLocaleString(),
    },
    {
      label: "Total Views",
      value: projects
        .reduce(
          (sum, p) =>
            sum + parseInt(p.views.replace("K", "000").replace(",", "")),
          0,
        )
        .toLocaleString(),
    },
    {
      label: "Avg Rating",
      value: (
        projects.reduce((sum, p) => sum + parseFloat(p.rating), 0) /
        projects.length || 0
      ).toFixed(1),
    },
  ];
});

useHead({
  title: "Projects by Semester - GIC Showcase",
  meta: [
    {
      name: "description",
      content: "Browse all projects organized by semester",
    },
  ],
});
</script>
