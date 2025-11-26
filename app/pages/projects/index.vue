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
            <ButtonsPresetButton preset="createProject" to="/projects/create" />

            <ButtonsPresetButton
              preset="viewBySemester"
              to="/projects/semester"
            />
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Filters and Projects -->
    <UContainer class="py-16 bg-blue-900/70">
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const selectedCategories = ref([]);
const selectedYears = ref([]);
const selectedSemesters = ref([]);

const likedProjects = ref({});
// Simple object to track like counts for each project
// Will be moved to store later
const categories = [
  "AI/ML",
  "Mobile",
  "Web",
  "Sustainability",
  "IoT",
  "Data Science",
];

// Years and Semesters
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

// Sample Projects Data - Updated for FancyProjectCard
// Sample Projects Data - Updated for FancyProjectCard
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
    images: [
      "https://images.unsplash.com/photo-1763182198113-a9a8d0fe3144?w=900&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1763669029223-74f911a9e08b?w=900&auto=format&fit=crop&q=60",
      "https://plus.unsplash.com/premium_photo-1731286446855-c0bd3d23af46?w=900&auto=format&fit=crop&q=60",
    ],
    members: [
      {
        name: "Sarah Chen",
        image: "https://randomuser.me/api/portraits/women/11.jpg",
      },
      {
        name: "Alex Park",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        name: "Jordan Lee",
        image: "https://randomuser.me/api/portraits/men/54.jpg",
      },
      {
        name: "Emma Davis",
        image: "https://randomuser.me/api/portraits/women/78.jpg",
      },
    ],
    views: 2500,
    likes: 342,
    featured: true,
    course: "Advanced AI & Machine Learning",
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
    images: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&fit=crop",
      "https://images.unsplash.com/photo-1763854492937-fb7ae2f601f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMXx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1763667309360-30d7e3779382?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D",
    ],
    members: [
      {
        name: "Alex Rodriguez",
        image: "https://randomuser.me/api/portraits/men/21.jpg",
      },
      {
        name: "Maria Garcia",
        image: "https://randomuser.me/api/portraits/women/45.jpg",
      },
      {
        name: "Sam Wilson",
        image: "https://randomuser.me/api/portraits/men/67.jpg",
      },
    ],
    views: 1800,
    likes: 256,
    featured: false,
    course: "Mobile App Development",
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
    images: [
      "https://images.unsplash.com/photo-1557821552-17105176677c?w=500&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&fit=crop",
    ],
    members: [
      {
        name: "Priya Patel",
        image: "https://randomuser.me/api/portraits/women/90.jpg",
      },
      {
        name: "David Chen",
        image: "https://randomuser.me/api/portraits/men/34.jpg",
      },
      {
        name: "Lisa Brown",
        image: "https://randomuser.me/api/portraits/women/23.jpg",
      },
      {
        name: "Tom Anderson",
        image: "https://randomuser.me/api/portraits/men/56.jpg",
      },
      {
        name: "Sarah White",
        image: "https://randomuser.me/api/portraits/women/12.jpg",
      },
    ],
    views: 3200,
    likes: 489,
    featured: true,
    course: "Full Stack Web Development",
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
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&fit=crop",
      "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVjaGFuaWNzfGVufDB8fDB8fHww",
    ],
    members: [
      {
        name: "Jordan Kim",
        image: "https://randomuser.me/api/portraits/men/88.jpg",
      },
      {
        name: "Nina Patel",
        image: "https://randomuser.me/api/portraits/women/41.jpg",
      },
      {
        name: "Chris Lee",
        image: "https://randomuser.me/api/portraits/men/25.jpg",
      },
    ],
    views: 1200,
    likes: 178,
    featured: false,
    course: "IoT & Environmental Tech",
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
    images: [
      "https://plus.unsplash.com/premium_photo-1664701474750-e3b51072957e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtYXJhJTIwbWFufGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=500&fit=crop",
      "https://images.unsplash.com/photo-1577918248023-62b9a2748a22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtYXJhJTIwbWFufGVufDB8fDB8fHww",
    ],
    members: [
      {
        name: "Emma Watson",
        image: "https://randomuser.me/api/portraits/women/16.jpg",
      },
      {
        name: "Robert Chang",
        image: "https://randomuser.me/api/portraits/men/52.jpg",
      },
      {
        name: "Maya Singh",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
      },
      {
        name: "James Miller",
        image: "https://randomuser.me/api/portraits/men/44.jpg",
      },
    ],
    views: 2100,
    likes: 312,
    featured: false,
    course: "Machine Learning Systems",
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
    images: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&fit=crop",
      "https://plus.unsplash.com/premium_photo-1661764256397-af154e87b1b3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    members: [
      {
        name: "Mike Johnson",
        image: "https://randomuser.me/api/portraits/men/11.jpg",
      },
      {
        name: "Jessica Lee",
        image: "https://randomuser.me/api/portraits/women/29.jpg",
      },
      {
        name: "Kevin Chen",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
      },
    ],
    views: 890,
    likes: 142,
    featured: false,
    course: "Advanced Web Applications",
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
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&fit=crop",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzfGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1c2luZXNzfGVufDB8fDB8fHww",
    ],
    members: [
      {
        name: "Lisa Wong",
        image: "https://randomuser.me/api/portraits/women/18.jpg",
      },
      {
        name: "Marcus Johnson",
        image: "https://randomuser.me/api/portraits/men/24.jpg",
      },
      {
        name: "Patricia Green",
        image: "https://randomuser.me/api/portraits/women/53.jpg",
      },
      {
        name: "Daniel White",
        image: "https://randomuser.me/api/portraits/men/36.jpg",
      },
    ],
    views: 1500,
    likes: 201,
    featured: false,
    course: "Data Visualization & Analytics",
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

  return filtered;
});

const clearFilters = () => {
  selectedCategories.value = [];
  selectedYears.value = [];
  selectedSemesters.value = [];
};

const toggleLike = (projectId) => {
  // Find the project and increment/decrement its like count
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;

  if (likedProjects.value[projectId]) {
    // Unlike: decrement count and remove from liked
    project.likes--;
    delete likedProjects.value[projectId];
  } else {
    // Like: increment count and add to liked
    project.likes++;
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
