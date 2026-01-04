<template>
  <div class="p-0">
    <div class="p-6 border-b border-gray-200 dark:border-slate-700">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Public Profile Preview
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            This is how your profile appears to others
          </p>
        </div>
        <UIcon name="i-heroicons-eye" class="w-6 h-6 text-gray-400" />
      </div>
    </div>

    <!-- Profile Preview Content -->
    <div class="bg-gray-50 dark:bg-slate-900 p-8">
      <!-- Profile Header -->
      <div
        class="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-800 dark:via-blue-700 dark:to-cyan-700 border border-blue-400/30 dark:border-blue-800/30 rounded-t-2xl py-12 relative overflow-hidden"
      >
        <!-- Background Pattern -->
        <div
          class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzBoLTEydjEyaDEyVjMwem0tMTIgMGgtMTJ2MTJoMTJWMzB6bTEyLTEyaC0xMnYxMmgxMlYxOHptMCAxMmgxMnYxMkg0OFYzMHptMC0xMmgxMnYxMkg0OFYxOHoiLz48L2c+PC9nPjwvc3ZnPg==')]"
        ></div>

        <div class="relative px-6">
          <div
            class="flex flex-col md:flex-row gap-6 items-start md:items-center"
          >
            <!-- Avatar -->
            <div
              class="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-5xl font-bold border-4 border-white/30 shadow-xl"
            >
              {{ user?.name?.charAt(0).toUpperCase() || "S" }}
            </div>

            <!-- Profile Info -->
            <div class="flex-1">
              <h1
                class="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg"
              >
                {{ user?.name || "Student Name" }}
              </h1>
              <p class="text-lg text-white/90 mb-3 drop-shadow">
                {{ user?.role || "Student" }}
              </p>
              <div class="flex gap-2 flex-wrap">
                <span
                  class="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm font-medium"
                >
                  {{ user?.program || program || "Computer Science" }}
                </span>
                <span
                  class="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm font-medium"
                >
                  {{ user?.year || year || "4th Year" }}
                </span>
                <span
                  class="px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm font-medium"
                >
                  GPA: {{ gpa || "3.85" }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div
        class="bg-white dark:bg-slate-800 border-x border-b border-gray-200 dark:border-slate-700 rounded-b-2xl p-6"
      >
        <div class="grid lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- About Section -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UIcon
                  name="i-heroicons-information-circle"
                  class="w-5 h-5 text-blue-600 dark:text-blue-400"
                />
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  About
                </h3>
              </div>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                {{ bio || defaultBio }}
              </p>
            </div>

            <!-- Skills & Expertise -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UIcon
                  name="i-heroicons-wrench-screwdriver"
                  class="w-5 h-5 text-blue-600 dark:text-blue-400"
                />
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  Skills & Expertise
                </h3>
              </div>
              <div class="flex gap-2 flex-wrap">
                <span
                  v-for="skill in displaySkills"
                  :key="skill"
                  class="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-200 dark:border-blue-700"
                >
                  {{ skill }}
                </span>
              </div>
            </div>

            <!-- Projects Section -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UIcon
                  name="i-heroicons-briefcase"
                  class="w-5 h-5 text-blue-600 dark:text-blue-400"
                />
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                  Projects ({{ projectCount }})
                </h3>
              </div>
              <div
                class="p-8 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-center"
              >
                <UIcon
                  name="i-heroicons-folder-open"
                  class="w-12 h-12 text-gray-400 mx-auto mb-3"
                />
                <p class="text-gray-600 dark:text-gray-400">
                  No projects yet. Start contributing to showcase your work!
                </p>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Contact Info -->
            <div class="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <h4
                class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3"
              >
                <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                Contact
              </h4>
              <div class="space-y-2">
                <div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">Email</p>
                  <p
                    class="text-sm text-gray-900 dark:text-white font-medium break-all"
                  >
                    {{ user?.email || "student@gic.edu" }}
                  </p>
                </div>
                <div v-if="phone">
                  <p class="text-xs text-gray-600 dark:text-gray-400">Phone</p>
                  <p class="text-sm text-gray-900 dark:text-white font-medium">
                    {{ phone }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Statistics -->
            <div class="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <h4
                class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3"
              >
                <UIcon name="i-heroicons-chart-bar" class="w-4 h-4" />
                Statistics
              </h4>
              <div class="space-y-2">
                <div
                  class="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded"
                >
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-briefcase"
                      class="w-4 h-4 text-purple-600 dark:text-purple-400"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Projects</span
                    >
                  </div>
                  <span
                    class="text-sm text-gray-900 dark:text-white font-semibold"
                    >{{ projectCount }}</span
                  >
                </div>
                <div
                  class="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded"
                >
                  <div class="flex items-center gap-2">
                    <UIcon
                      name="i-heroicons-star"
                      class="w-4 h-4 text-yellow-600 dark:text-yellow-400"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300"
                      >Achievements</span
                    >
                  </div>
                  <span
                    class="text-sm text-gray-900 dark:text-white font-semibold"
                    >{{ achievements }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Social Links -->
            <div class="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <h4
                class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3"
              >
                <UIcon name="i-heroicons-link" class="w-4 h-4" />
                Connect
              </h4>
              <div v-if="hasSocialLinks" class="space-y-2">
                <a
                  v-if="socialLinks.github"
                  :href="socialLinks.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <UIcon
                    name="i-simple-icons-github"
                    class="w-4 h-4 text-gray-700 dark:text-gray-300"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >GitHub</span
                  >
                </a>
                <a
                  v-if="socialLinks.linkedin"
                  :href="socialLinks.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <UIcon
                    name="i-simple-icons-linkedin"
                    class="w-4 h-4 text-blue-600 dark:text-blue-400"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >LinkedIn</span
                  >
                </a>
                <a
                  v-if="socialLinks.twitter"
                  :href="socialLinks.twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <UIcon
                    name="i-simple-icons-twitter"
                    class="w-4 h-4 text-sky-500 dark:text-sky-400"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Twitter</span
                  >
                </a>
                <a
                  v-if="socialLinks.portfolio"
                  :href="socialLinks.portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <UIcon
                    name="i-heroicons-globe-alt"
                    class="w-4 h-4 text-purple-600 dark:text-purple-400"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Portfolio</span
                  >
                </a>
              </div>
              <p v-else class="text-xs text-gray-600 dark:text-gray-400">
                Add social links in your profile settings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="p-6 border-t border-gray-200 dark:border-slate-700">
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div class="flex items-start gap-3">
          <UIcon
            name="i-heroicons-information-circle"
            class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
          />
          <div class="text-sm text-blue-800 dark:text-blue-300">
            <p class="font-semibold mb-1">Preview Mode</p>
            <p>
              This preview shows how your profile appears to others. Update your
              profile information, add skills, and showcase your projects to
              make it stand out!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

interface Props {
  user?: any;
  bio?: string;
  skills?: string[];
  socialLinks?: SocialLinks;
  program?: string;
  year?: string;
  phone?: string;
  gpa?: string;
  projectCount?: number;
  achievements?: number;
}

const props = withDefaults(defineProps<Props>(), {
  bio: "",
  skills: () => [],
  socialLinks: () => ({}),
  program: "Computer Science",
  year: "4th Year",
  phone: "",
  gpa: "3.85",
  projectCount: 0,
  achievements: 0,
});

const defaultBio =
  "Passionate student at GIC, working on exciting projects and learning new technologies. Dedicated to continuous learning and innovation in software development.";

const defaultSkills = [
  "JavaScript",
  "TypeScript",
  "Vue.js",
  "Node.js",
  "Python",
  "React",
];

const displaySkills = computed(() => {
  return props.skills && props.skills.length > 0 ? props.skills : defaultSkills;
});

const hasSocialLinks = computed(() => {
  return (
    props.socialLinks.github ||
    props.socialLinks.linkedin ||
    props.socialLinks.twitter ||
    props.socialLinks.portfolio
  );
});
</script>
