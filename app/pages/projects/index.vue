<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header Section -->
    <div class="hero-nodes py-20 border-b border-blue-800/30">
      <UContainer>
        <div class="space-y-6">
          <div class="text-center space-y-4 max-w-2xl mx-auto">
            <h1
              class="text-5xl lg:text-6xl font-black text-white leading-tight"
            >
              Explore All Projects
            </h1>
            <p class="text-xl text-gray-300">
              Discover amazing projects built by GIC students across all
              semesters and categories
            </p>
          </div>

          <!-- Action Buttons -->
          <div
            class="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap"
          >
            <ButtonsPresetButton preset="createProject" to="/projects/create" />

            <ButtonsPresetButton preset="viewBySemester" to="/projects/semester" />
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Filters and Projects -->
    <UContainer class="py-16">
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

            <!-- Sort -->
            <div
              class="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 space-y-4"
            >
              <h3 class="font-bold text-white text-lg">Sort By</h3>
              <select
                v-model="sortBy"
                class="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Projects Grid -->
        <div class="lg:col-span-3">
          <div class="space-y-6">
            <!-- Results Count -->
            <div class="flex justify-between items-center">
              <p class="text-gray-400">
                Showing
                <span class="text-blue-400 font-semibold">{{
                  filteredProjects.length
                }}</span>
                projects
              </p>
              <UButton
                v-if="
                  selectedCategories.length > 0 ||
                  selectedYears.length > 0 ||
                  selectedSemesters.length > 0
                "
                variant="ghost"
                size="sm"
                color="error"
                @click="clearFilters"
              >
                Clear Filters
              </UButton>
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const selectedCategories = ref([]);
const selectedYears = ref([]);
const selectedSemesters = ref([]);
const sortBy = ref("recent");
const likedProjects = ref(new Set());

const categories = [
  "AI/ML",
  "Mobile",
  "Web",
  "Sustainability",
  "IoT",
  "Data Science",
];

const years = [
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
];

const semestersByYear = {
  2024: ["Semester 1", "Semester 2"],
  2023: ["Semester 1", "Semester 2"],
  2022: ["Semester 1", "Semester 2"],
};

const projects = [
  {
    id: 1,
    title: "AI Chat Assistant",
    description:
      "An intelligent chatbot powered by GPT-3 for customer support.",
    category: "AI/ML",
    year: "2024",
    semester: "Semester 2",
    emoji: "🤖",
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
    author: "Sarah Chen",
    skills: ["Python", "GPT-3", "NLP", "React"],
    members: ["Sarah Chen", "Alex Park", "Jordan Lee", "Emma Davis"],
    views: "2.5K",
    likes: "342",
    rating: "4.8",
    course: "Advanced AI & Machine Learning",
    roadmap: [
      "Phase 1: GPT-3 Integration",
      "Phase 2: Conversation History",
      "Phase 3: Multi-language Support",
      "Phase 4: Production Deployment",
    ],
    duration: "3 months",
  },
  {
    id: 2,
    title: "Mobile Fitness App",
    description: "Track workouts, nutrition, and health metrics on the go.",
    category: "Mobile",
    year: "2024",
    semester: "Semester 1",
    emoji: "💪",
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    author: "Alex Rodriguez",
    skills: ["React Native", "Firebase", "UI/UX", "TypeScript"],
    members: ["Alex Rodriguez", "Maria Garcia", "Sam Wilson"],
    views: "1.8K",
    likes: "256",
    rating: "4.6",
    course: "Mobile App Development",
    roadmap: [
      "MVP: Basic Tracking",
      "Add Social Features",
      "Implement AI Recommendations",
      "Launch on App Stores",
    ],
    duration: "4 months",
  },
  {
    id: 3,
    title: "E-Commerce Platform",
    description:
      "Full-stack online store with payment integration and analytics.",
    category: "Web",
    year: "2024",
    semester: "Semester 2",
    emoji: "🛍️",
    gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
    author: "Priya Patel",
    skills: ["Node.js", "Vue.js", "MongoDB", "Stripe"],
    members: [
      "Priya Patel",
      "David Chen",
      "Lisa Brown",
      "Tom Anderson",
      "Sarah White",
    ],
    views: "3.2K",
    likes: "489",
    rating: "4.9",
    course: "Full Stack Web Development",
    roadmap: [
      "Backend Setup",
      "Frontend Development",
      "Payment Integration",
      "Analytics Dashboard",
      "Deployment",
    ],
    duration: "5 months",
  },
  {
    id: 4,
    title: "Climate Monitoring IoT",
    description: "IoT sensors and dashboard for environmental monitoring.",
    category: "Sustainability",
    year: "2023",
    semester: "Semester 2",
    emoji: "🌍",
    gradient: "bg-gradient-to-br from-teal-500 to-green-600",
    author: "Jordan Kim",
    skills: ["Arduino", "Python", "IoT", "Grafana"],
    members: ["Jordan Kim", "Nina Patel", "Chris Lee"],
    views: "1.2K",
    likes: "178",
    rating: "4.7",
    course: "IoT & Environmental Tech",
    roadmap: [
      "Sensor Setup",
      "Data Collection",
      "Dashboard Development",
      "Analysis & Reporting",
    ],
    duration: "3 months",
  },
  {
    id: 5,
    title: "Machine Learning Pipeline",
    description: "Automated data processing and model training framework.",
    category: "AI/ML",
    year: "2023",
    semester: "Semester 1",
    emoji: "🧠",
    gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
    author: "Emma Watson",
    skills: ["TensorFlow", "Python", "Scikit-learn", "Docker"],
    members: ["Emma Watson", "Robert Chang", "Maya Singh", "James Miller"],
    views: "2.1K",
    likes: "312",
    rating: "4.5",
    course: "Machine Learning Systems",
    roadmap: [
      "Data Pipeline",
      "Model Development",
      "Training Optimization",
      "Containerization",
    ],
    duration: "4 months",
  },
  {
    id: 6,
    title: "Social Media Dashboard",
    description: "Manage and monitor multiple social accounts in one place.",
    category: "Web",
    year: "2022",
    semester: "Semester 1",
    emoji: "📊",
    gradient: "bg-gradient-to-br from-orange-500 to-red-600",
    author: "Mike Johnson",
    skills: ["React", "Next.js", "PostgreSQL", "API Design"],
    members: ["Mike Johnson", "Jessica Lee", "Kevin Chen"],
    views: "890",
    likes: "142",
    rating: "4.4",
    course: "Advanced Web Applications",
    roadmap: ["UI Design", "Backend API", "Social Integration", "Analytics"],
    duration: "3 months",
  },
  {
    id: 7,
    title: "Data Analytics Platform",
    description: "Real-time data visualization and reporting tool.",
    category: "Data Science",
    year: "2022",
    semester: "Semester 2",
    emoji: "📈",
    gradient: "bg-gradient-to-br from-blue-400 to-cyan-500",
    author: "Lisa Wong",
    skills: ["Tableau", "Python", "SQL", "D3.js"],
    members: ["Lisa Wong", "Marcus Johnson", "Patricia Green", "Daniel White"],
    views: "1.5K",
    likes: "201",
    rating: "4.3",
    course: "Data Visualization & Analytics",
    roadmap: [
      "Database Design",
      "ETL Pipeline",
      "Dashboard Creation",
      "Real-time Updates",
    ],
    duration: "4 months",
  },
];

const availableSemesters = computed(() => {
  if (selectedYears.value.length === 0) {
    return ["Semester 1", "Semester 2"];
  }
  const semesters = new Set();
  selectedYears.value.forEach((year) => {
    semestersByYear[year]?.forEach((sem) => semesters.add(sem));
  });
  return Array.from(semesters);
});

const filteredProjects = computed(() => {
  let filtered = projects;

  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter((p) =>
      selectedCategories.value.includes(p.category)
    );
  }

  if (selectedYears.value.length > 0) {
    filtered = filtered.filter((p) => selectedYears.value.includes(p.year));
  }

  if (selectedSemesters.value.length > 0) {
    filtered = filtered.filter((p) =>
      selectedSemesters.value.includes(p.semester)
    );
  }

  return filtered.sort((a, b) => {
    if (sortBy.value === "popular") {
      return parseInt(b.likes) - parseInt(a.likes);
    } else if (sortBy.value === "trending") {
      return parseInt(b.views) - parseInt(a.views);
    }
    return 0;
  });
});

const clearFilters = () => {
  selectedCategories.value = [];
  selectedYears.value = [];
  selectedSemesters.value = [];
  sortBy.value = "recent";
};

// Like functionality
const isLiked = (projectId) => {
  return likedProjects.value.has(projectId);
};

const toggleLike = (projectId) => {
  if (likedProjects.value.has(projectId)) {
    likedProjects.value.delete(projectId);
  } else {
    likedProjects.value.add(projectId);
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
