<template>
  <!-- public page -->
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Back Button -->
    <div
      class="sticky top-0 z-40 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700 shadow-sm"
    >
      <UContainer class="py-4">
        <div class="flex items-center justify-between">
          <ButtonsPresetButton preset="back" to="/students" />
        </div>
      </UContainer>
    </div>

    <!-- Profile Header -->
    <div
      class="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-800 dark:via-blue-700 dark:to-cyan-700 border-b border-blue-400/30 dark:border-blue-800/30 py-16 relative overflow-hidden"
    >
      <!-- Background Pattern -->
      <div
        class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzBoLTEydjEyaDEyVjMwem0tMTIgMGgtMTJ2MTJoMTJWMzB6bTEyLTEyaC0xMnYxMmgxMlYxOHptMCAxMmgxMnYxMkg0OFYzMHptMC0xMmgxMnYxMkg0OFYxOHoiLz48L2c+PC9nPjwvc3ZnPg==')]"
      ></div>

      <UContainer class="relative">
        <div
          class="flex flex-col md:flex-row gap-8 items-start md:items-center"
        >
          <!-- Avatar -->
          <div
            class="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-6xl md:text-8xl font-bold border-4 border-white/30 shadow-2xl"
          >
            {{ student.name.charAt(0) }}
          </div>

          <!-- Profile Info -->
          <div class="flex-1">
            <h1
              class="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg"
            >
              {{ student.name }}
            </h1>
            <p class="text-xl text-white/90 mb-4 drop-shadow">
              {{ student.role }}
            </p>
            <div class="flex gap-3 flex-wrap">
              <span
                class="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium"
              >
                {{ student.department }}
              </span>
              <span
                class="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium"
              >
                Year {{ student.year }}
              </span>
              <span
                class="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium"
              >
                GPA: {{ student.gpa }}
              </span>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- About Section -->
          <div
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 space-y-4"
          >
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-information-circle"
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
              />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                About
              </h2>
            </div>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ student.bio }}
            </p>
          </div>

          <!-- Skills & Expertise -->
          <div
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 space-y-4"
          >
            <div class="flex items-center gap-3 mb-4">
              <UIcon
                name="i-heroicons-wrench-screwdriver"
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
              />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Skills & Expertise
              </h2>
            </div>
            <div class="flex gap-2 flex-wrap">
              <span
                v-for="skill in student.skills"
                :key="skill"
                class="px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-200 dark:border-blue-700"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- Achievements -->
          <div
            v-if="student.achievements && student.achievements.length > 0"
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 space-y-4"
          >
            <div class="flex items-center gap-3 mb-4">
              <UIcon
                name="i-heroicons-star"
                class="w-6 h-6 text-yellow-500 dark:text-yellow-400"
              />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Achievements
              </h2>
            </div>
            <div class="space-y-3">
              <div
                v-for="(achievement, idx) in student.achievements"
                :key="idx"
                class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600"
              >
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p class="text-gray-900 dark:text-white font-semibold">
                    {{ achievement.title }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">
                    {{ achievement.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Projects Contributed -->
          <div
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 space-y-4"
          >
            <div class="flex items-center gap-3 mb-4">
              <UIcon
                name="i-heroicons-briefcase"
                class="w-6 h-6 text-blue-600 dark:text-blue-400"
              />
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Projects ({{ student.projectsContributed.length }})
              </h2>
            </div>
            <div class="space-y-3">
              <div
                v-for="project in student.projectsContributed"
                :key="project.id"
                class="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group/proj"
              >
                <NuxtLink
                  :to="`/projects/${project.id}`"
                  class="flex items-start gap-3"
                >
                  <span class="text-3xl">{{ project.emoji }}</span>
                  <div class="flex-1">
                    <h3
                      class="text-gray-900 dark:text-white font-semibold group-hover/proj:text-blue-600 dark:group-hover/proj:text-blue-300 transition-colors"
                    >
                      {{ project.title }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">
                      {{ project.category }} • {{ project.year }}
                    </p>
                  </div>
                  <UIcon
                    name="i-heroicons-arrow-right"
                    class="w-5 h-5 text-gray-400 group-hover/proj:text-blue-400 transition-colors mt-1"
                  />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Contact Info -->
          <div
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 space-y-4"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
              Contact
            </h3>
            <div class="space-y-3">
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Email</p>
                <p class="text-gray-900 dark:text-white font-medium break-all">
                  {{ student.email }}
                </p>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Phone</p>
                <p class="text-gray-900 dark:text-white font-medium">
                  {{ student.phone }}
                </p>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 space-y-4"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <UIcon name="i-heroicons-chart-bar" class="w-5 h-5" />
              Statistics
            </h3>
            <div class="space-y-3">
              <!-- Projects -->
              <div
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-briefcase"
                    class="w-5 h-5 text-purple-600 dark:text-purple-400"
                  />
                  <span class="text-gray-700 dark:text-gray-300">Projects</span>
                </div>
                <span class="text-gray-900 dark:text-white font-semibold">{{
                  student.projectsContributed.length
                }}</span>
              </div>

              <!-- Contributions -->
              <div
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <UIcon
                    name="i-heroicons-code-bracket"
                    class="w-5 h-5 text-green-600 dark:text-green-400"
                  />
                  <span class="text-gray-700 dark:text-gray-300"
                    >Contributions</span
                  >
                </div>
                <span class="text-gray-900 dark:text-white font-semibold">{{
                  student.contributions
                }}</span>
              </div>
            </div>
          </div>

          <!-- Social Links -->
          <div
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-4 shadow-sm"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
            >
              <UIcon
                name="i-heroicons-link"
                class="w-5 h-5 text-blue-600 dark:text-blue-400"
              />
              Connect
            </h3>
            <div class="space-y-2">
              <a
                v-if="student.github"
                :href="student.github"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all border border-transparent hover:border-gray-300 dark:hover:border-slate-600 group"
              >
                <div class="p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <UIcon
                    name="i-simple-icons-github"
                    class="w-5 h-5 text-gray-700 dark:text-gray-300"
                  />
                </div>
                <span
                  class="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white"
                  >GitHub Profile</span
                >
                <UIcon
                  name="i-heroicons-arrow-top-right-on-square"
                  class="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600 dark:group-hover:text-gray-300"
                />
              </a>
              <a
                v-if="student.linkedin"
                :href="student.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800 group"
              >
                <div class="p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <UIcon
                    name="i-simple-icons-linkedin"
                    class="w-5 h-5 text-blue-600 dark:text-blue-400"
                  />
                </div>
                <span
                  class="text-gray-700 dark:text-gray-300 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300"
                  >LinkedIn Profile</span
                >
                <UIcon
                  name="i-heroicons-arrow-top-right-on-square"
                  class="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-600 dark:group-hover:text-blue-400"
                />
              </a>
              <a
                v-if="student.portfolio"
                :href="student.portfolio"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all border border-transparent hover:border-purple-200 dark:hover:border-purple-800 group"
              >
                <div class="p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <UIcon
                    name="i-heroicons-globe-alt"
                    class="w-5 h-5 text-purple-600 dark:text-purple-400"
                  />
                </div>
                <span
                  class="text-gray-700 dark:text-gray-300 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300"
                  >Portfolio Website</span
                >
                <UIcon
                  name="i-heroicons-arrow-top-right-on-square"
                  class="w-4 h-4 text-gray-400 ml-auto group-hover:text-purple-600 dark:group-hover:text-purple-400"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
import { computed } from "vue";

const route = useRoute();
const studentId = parseInt(route.params.id);

// Mock student data
const students = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Full Stack Developer",
    department: "Computer Science",
    year: 3,
    gpa: "3.8",
    bio: "Passionate about AI and machine learning with 3+ years of development experience. Love working on innovative projects that solve real-world problems.",
    email: "sarah.chen@gic.edu",
    phone: "+1 (555) 123-4567",
    skills: [
      "Python",
      "GPT-3",
      "NLP",
      "React",
      "Node.js",
      "Docker",
      "AWS",
      "TensorFlow",
    ],
    achievements: [
      {
        title: "AI Innovation Award 2024",
        description: "Recognized for outstanding contributions to AI projects",
      },
      {
        title: "Dean's List",
        description: "Maintained 3.8+ GPA for 3 consecutive semesters",
      },
      {
        title: "Hackathon Winner",
        description: "Won first place in Regional Tech Hackathon 2024",
      },
    ],
    projectsContributed: [
      {
        id: 1,
        title: "AI Chat Assistant",
        emoji: "🤖",
        category: "AI/ML",
        year: "2024",
      },
    ],
    contributions: 145,
    followers: 342,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    portfolio: "https://sarahchen.dev",
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    role: "Mobile App Developer",
    department: "Software Engineering",
    year: 2,
    gpa: "3.7",
    bio: "Mobile-first developer specializing in React Native and cross-platform applications. Enthusiast of clean code and user experience design.",
    email: "alex.rodriguez@gic.edu",
    phone: "+1 (555) 234-5678",
    skills: [
      "React Native",
      "Firebase",
      "UI/UX",
      "TypeScript",
      "JavaScript",
      "Swift",
      "Kotlin",
    ],
    achievements: [
      {
        title: "Mobile App Excellence 2024",
        description: "Best mobile application design",
      },
      {
        title: "App Store Feature",
        description: "App featured on multiple app stores",
      },
    ],
    projectsContributed: [
      {
        id: 2,
        title: "Mobile Fitness App",
        emoji: "💪",
        category: "Mobile",
        year: "2024",
      },
    ],
    contributions: 98,
    followers: 256,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    portfolio: "https://alexrodriguez.dev",
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Full Stack Engineer",
    department: "Computer Science",
    year: 4,
    gpa: "3.9",
    bio: "Experienced full-stack engineer with expertise in both frontend and backend development. Passionate about scalable architecture and DevOps.",
    email: "priya.patel@gic.edu",
    phone: "+1 (555) 345-6789",
    skills: [
      "Node.js",
      "Vue.js",
      "MongoDB",
      "Stripe",
      "AWS",
      "Docker",
      "Kubernetes",
      "PostgreSQL",
    ],
    achievements: [
      {
        title: "Technical Excellence Award",
        description: "Outstanding code quality and architecture",
      },
      {
        title: "Leadership Award",
        description: "Led 15+ student developers in projects",
      },
      {
        title: "Published Research",
        description: "Paper published in peer-reviewed conference",
      },
    ],
    projectsContributed: [
      {
        id: 3,
        title: "E-Commerce Platform",
        emoji: "🛍️",
        category: "Web",
        year: "2024",
      },
    ],
    contributions: 267,
    followers: 489,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    portfolio: "https://priyapatel.dev",
  },
];

const student = computed(() => {
  return students.find((s) => s.id === studentId) || students[0];
});

useHead({
  title: `${student.value.name} - Student Profile`,
  meta: [
    {
      name: "description",
      content: `${student.value.name} - ${student.value.role}`,
    },
  ],
});
</script>
