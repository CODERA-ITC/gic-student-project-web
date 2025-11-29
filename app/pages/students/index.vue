<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header Section -->
    <div class="hero-nodes py-20 border-b border-blue-800/30">
      <UContainer>
        <div class="text-center space-y-4 max-w-2xl mx-auto">
          <h1 class="text-5xl lg:text-6xl font-black text-white leading-tight">
            Meet Our Students
          </h1>
          <p class="text-xl text-gray-300">
            Discover talented students and their contributions to the GIC
            program
          </p>
        </div>
      </UContainer>
    </div>

    <!-- Search and Filter -->
    <UContainer class="py-12">
      <!-- Students Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="student in filteredStudents"
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
              <div
                class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold border-4 border-slate-800"
              >
                {{ student.name.charAt(0) }}
              </div>

              <!-- Name and Role -->
              <div>
                <h3
                  class="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1"
                >
                  {{ student.name }}
                </h3>
                <p class="text-sm text-gray-400">{{ student.role }}</p>
              </div>

              <!-- Department and Year -->
              <div class="flex gap-2 flex-wrap">
                <UBadge color="primary" variant="soft" size="xs">
                  {{ student.department }}
                </UBadge>
                <UBadge color="info" variant="soft" size="xs">
                  Year {{ student.year }}
                </UBadge>
              </div>

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
                </div>
              </div>

              <!-- Stats -->
              <div
                class="flex gap-4 pt-4 border-t border-slate-700 text-center"
              >
                <div class="flex-1">
                  <p class="text-white font-bold">
                    {{ student.projectsContributed }}
                  </p>
                  <p class="text-xs text-gray-400">Projects</p>
                </div>
                <div class="flex-1">
                  <p class="text-white font-bold">
                    {{ student.contributions }}
                  </p>
                  <p class="text-xs text-gray-400">Contributions</p>
                </div>
                <div class="flex-1">
                  <p class="text-white font-bold">{{ student.rating }}/5</p>
                  <p class="text-xs text-gray-400">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-if="filteredStudents.length === 0" class="text-center py-20">
        <UIcon
          name="i-heroicons-users"
          class="w-16 h-16 text-gray-600 mx-auto mb-4"
        />
        <p class="text-gray-400 text-lg">No students found</p>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const searchQuery = ref("");
const selectedSemester = ref("");

const semesters = ["Semester 1", "Semester 2", "Semester 3", "Semester 4"];

const students = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Full Stack Developer",
    department: "Computer Science",
    year: 3,
    gpa: "3.8",
    bio: "Passionate about building scalable web applications and AI solutions.",
    semester: "Semester 4",
    projects: 5,
    projectsContributed: 5,
    contributions: 145,
    skills: ["Python", "React", "Node.js", "Docker", "AWS", "TensorFlow"],
    followers: 342,
    likes: 1200,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    role: "Mobile Developer",
    department: "Software Engineering",
    year: 2,
    gpa: "3.7",
    bio: "Crafting beautiful mobile experiences with React Native and Flutter.",
    semester: "Semester 3",
    projects: 4,
    projectsContributed: 4,
    contributions: 98,
    skills: ["React Native", "Firebase", "TypeScript", "Swift", "Kotlin"],
    followers: 256,
    likes: 890,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Full Stack Engineer",
    department: "Computer Science",
    year: 4,
    gpa: "3.9",
    bio: "Building products that solve real problems for users worldwide.",
    semester: "Semester 4",
    projects: 6,
    projectsContributed: 6,
    contributions: 267,
    skills: ["Node.js", "Vue.js", "MongoDB", "Stripe", "AWS", "Kubernetes"],
    followers: 489,
    likes: 1500,
    rating: 4.9,
  },
  {
    id: 4,
    name: "Jordan Kim",
    role: "IoT Engineer",
    department: "Information Technology",
    year: 3,
    gpa: "3.6",
    bio: "Extracting insights from data and building predictive models.",
    semester: "Semester 2",
    projects: 3,
    projectsContributed: 3,
    contributions: 87,
    skills: ["Arduino", "Python", "IoT", "Grafana", "Linux"],
    followers: 178,
    likes: 720,
    rating: 4.6,
  },
  {
    id: 5,
    name: "Emma Watson",
    role: "ML Engineer",
    department: "Data Science",
    year: 3,
    gpa: "3.9",
    bio: "Building reliable infrastructure and CI/CD pipelines.",
    semester: "Semester 3",
    projects: 4,
    projectsContributed: 4,
    contributions: 156,
    skills: ["TensorFlow", "Python", "Scikit-learn", "Docker", "Pandas"],
    followers: 312,
    likes: 950,
    rating: 4.8,
  },
  {
    id: 6,
    name: "Mike Johnson",
    role: "Frontend Developer",
    department: "Computer Science",
    year: 2,
    gpa: "3.5",
    bio: "Creating intuitive and beautiful user interfaces.",
    semester: "Semester 1",
    projects: 2,
    projectsContributed: 2,
    contributions: 112,
    skills: ["React", "Next.js", "Tailwind", "JavaScript", "D3.js"],
    followers: 142,
    likes: 1100,
    rating: 4.7,
  },
];

const filteredStudents = computed(() => {
  let filtered = students;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.role.toLowerCase().includes(query) ||
        s.skills.some((skill) => skill.toLowerCase().includes(query))
    );
  }

  if (selectedSemester.value) {
    filtered = filtered.filter((s) => s.semester === selectedSemester.value);
  }

  return filtered;
});

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
