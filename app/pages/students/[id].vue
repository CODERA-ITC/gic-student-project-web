<template>
  <div
    class="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
    <div
      class="relative z-20 border-b border-gray-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
      <UContainer class="py-3">
        <div class="flex items-center justify-between gap-3">
          <nav
            class="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 overflow-x-auto pb-1">
            <NuxtLink to="/"
              class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 flex-shrink-0">
              <UIcon name="i-heroicons-home" class="w-4 h-4" />
              <span class="hidden sm:inline">Home</span>
            </NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <NuxtLink to="/students"
              class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 flex-shrink-0">
              <UIcon name="i-heroicons-user-group" class="w-4 h-4" />
              <span class="hidden sm:inline">Students</span>
            </NuxtLink>
            <UIcon name="i-heroicons-chevron-right" class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span class="text-gray-900 dark:text-white font-medium truncate max-w-[150px] sm:max-w-xs">
              {{ student?.name || "Student Profile" }}
            </span>
          </nav>
          <ButtonsPresetButton preset="back" to="/students" size="sm" />
        </div>
      </UContainer>
    </div>

    <template v-if="hasStudent && student">
      <UContainer class="py-8 sm:py-10">
        <div
          class="rounded-3xl overflow-hidden border border-white/20 ring-1 ring-blue-200/50 dark:ring-blue-900/40 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 dark:from-blue-900 dark:via-blue-800 dark:to-cyan-700 shadow-xl">
          <div class="px-6 sm:px-8 lg:px-10 py-8 sm:py-10 relative">
            <div
              class="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.18),transparent_30%)]">
            </div>
            <div class="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7">
              <div
                class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/20 border border-white/40 backdrop-blur flex items-center justify-center text-white text-4xl sm:text-5xl font-semibold shadow-2xl overflow-hidden">
                <img v-if="student.avatar" :src="student.avatar" :alt="student.name"
                  class="w-full h-full object-cover" />
                <span v-else>{{ student.name.charAt(0) }}</span>
              </div>
              <div class="flex-1">
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
                  {{ student.name }}
                </h1>
                <p class="text-white/90 mt-1 text-base sm:text-lg">{{ student.role }}</p>
                <div class="flex flex-wrap gap-2 mt-4">
                  <UBadge color="neutral" variant="soft" size="sm"
                    class="!bg-white/20 !text-white border border-white/35">
                    <UIcon name="i-heroicons-building-office-2" class="w-4 h-4 mr-1" />
                    {{ student.department }}
                  </UBadge>
                  <UBadge color="neutral" variant="soft" size="sm"
                    class="!bg-white/20 !text-white border border-white/35">
                    <UIcon name="i-heroicons-user-group" class="w-4 h-4 mr-1" />
                    {{ student.projectCount }} Projects
                  </UBadge>
                  <UBadge color="neutral" variant="soft" size="sm"
                    class="!bg-white/20 !text-white border border-white/35">
                    <UIcon name="i-heroicons-academic-cap" class="w-4 h-4 mr-1" />
                    Gen {{ student.gen }}
                  </UBadge>
                  <UBadge color="neutral" variant="soft" size="sm"
                    class="!bg-white/20 !text-white border border-white/35">
                    <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 mr-1" />
                    Joined {{ student.joinedYear }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>

      <UContainer class="pb-12 sm:pb-16">
        <div class="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div
              class="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div class="flex items-center gap-2.5 mb-3">
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  About
                </h2>
              </div>
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {{ student.bio }}
              </p>
            </div>

            <div
              class="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div class="flex items-center gap-2.5 mb-4">
                <UIcon name="i-heroicons-wrench-screwdriver" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  Skills & Expertise
                </h2>
              </div>
              <div class="flex gap-2 flex-wrap" v-if="student.skills.length">
                <span v-for="skill in student.skills" :key="skill"
                  class="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-200 dark:border-blue-700">
                  {{ skill }}
                </span>
              </div>
              <p v-else class="text-sm text-gray-500 dark:text-gray-400">No skills added yet.</p>
            </div>

            <div v-if="student.achievements && student.achievements.length > 0"
              class="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div class="flex items-center gap-2.5 mb-4">
                <UIcon name="i-heroicons-star" class="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  Achievements
                </h2>
              </div>
              <div class="space-y-3">
                <div v-for="(achievement, idx) in student.achievements" :key="idx"
                  class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                  <UIcon name="i-heroicons-check-circle"
                    class="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
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

            <div
              class="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div class="flex items-center gap-2.5 mb-4">
                <UIcon name="i-heroicons-briefcase" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                  Projects ({{ student.projectCount }})
                </h2>
              </div>
              <div class="space-y-3" v-if="student.projectsContributed.length">
                <div v-for="project in student.projectsContributed" :key="project.id"
                  class="p-4 bg-gray-50 dark:bg-slate-700/60 rounded-xl border border-gray-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group/proj">
                  <NuxtLink :to="`/projects/${project.id}`" class="flex items-start gap-3">
                    <span class="text-3xl">{{ project.emoji }}</span>
                    <div class="flex-1">
                      <h3
                        class="text-gray-900 dark:text-white font-semibold group-hover/proj:text-blue-600 dark:group-hover/proj:text-blue-300 transition-colors">
                        {{ project.title }}
                      </h3>
                      <p class="text-gray-600 dark:text-gray-400 text-sm">
                        {{ project.category }} • {{ project.year }}
                      </p>
                    </div>
                    <UIcon name="i-heroicons-arrow-right"
                      class="w-5 h-5 text-gray-400 group-hover/proj:text-blue-400 transition-colors mt-1" />
                  </NuxtLink>
                </div>
              </div>
              <div v-else
                class="rounded-xl border border-dashed border-gray-300 dark:border-slate-600 p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                No project contributions available yet.
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div
              class="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
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

            <div
              class="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <UIcon name="i-heroicons-chart-bar" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Statistics
              </h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-briefcase" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span class="text-gray-700 dark:text-gray-300">Projects</span>
                  </div>
                  <span class="text-gray-900 dark:text-white font-semibold">{{
                    student.projectCount
                  }}</span>
                </div>

                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-code-bracket" class="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span class="text-gray-700 dark:text-gray-300">Contributions</span>
                  </div>
                  <span class="text-gray-900 dark:text-white font-semibold">{{
                    student.contributions
                  }}</span>
                </div>
              </div>
            </div>

            <div
              class="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <UIcon name="i-heroicons-link" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Connect
              </h3>
              <div class="space-y-2" v-if="student.github || student.linkedin || student.portfolio">
                <a v-if="student.github" :href="student.github" target="_blank" rel="noopener noreferrer"
                  class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-all border border-transparent hover:border-gray-300 dark:hover:border-slate-600 group">
                  <div class="p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <UIcon name="i-simple-icons-github" class="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <span
                    class="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white">GitHub
                    Profile</span>
                  <UIcon name="i-heroicons-arrow-top-right-on-square"
                    class="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </a>
                <a v-if="student.linkedin" :href="student.linkedin" target="_blank" rel="noopener noreferrer"
                  class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800 group">
                  <div class="p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <UIcon name="i-simple-icons-linkedin" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span
                    class="text-gray-700 dark:text-gray-300 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300">LinkedIn
                    Profile</span>
                  <UIcon name="i-heroicons-arrow-top-right-on-square"
                    class="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </a>
                <a v-if="student.portfolio" :href="student.portfolio" target="_blank" rel="noopener noreferrer"
                  class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all border border-transparent hover:border-purple-200 dark:hover:border-purple-800 group">
                  <div class="p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <UIcon name="i-heroicons-globe-alt" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span
                    class="text-gray-700 dark:text-gray-300 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300">Portfolio
                    Website</span>
                  <UIcon name="i-heroicons-arrow-top-right-on-square"
                    class="w-4 h-4 text-gray-400 ml-auto group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                </a>
              </div>
              <p v-else class="text-sm text-gray-500 dark:text-gray-400">
                No social links available.
              </p>
            </div>
          </div>
        </div>
      </UContainer>
    </template>
    <UContainer v-else class="py-14 sm:py-20">
      <div
        class="max-w-xl mx-auto rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-8 text-center shadow-sm">
        <UIcon name="i-heroicons-user-circle" class="w-14 h-14 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Student Not Found</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          This student profile does not exist or is not publicly available.
        </p>
        <div class="flex justify-center">
          <ButtonsPresetButton preset="back" to="/students" />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useStudentStore } from "~/stores/students";

const route = useRoute();
const studentStore = useStudentStore();
const studentId = computed(() => String(route.params.id || ""));

const loadStudent = async (id: string) => {
  if (!id) return;
  await studentStore.fetchPublicStudentById(id);
};

onMounted(async () => {
  await loadStudent(studentId.value);
});

watch(studentId, async (nextId) => {
  await loadStudent(nextId);
});

const currentStudent = computed(() =>
  (studentStore.apiStudents || []).find((s) => String(s.id) === studentId.value),
);

const hasStudent = computed(() => Boolean(currentStudent.value));

const student = computed(() => {
  const current = currentStudent.value;
  if (!current) return null;

  const socialList = Array.isArray(current.socialLinks)
    ? current.socialLinks
    : [];
  const socialMap = socialList.reduce(
    (acc: Record<string, string>, item) => {
      if (!item?.name || !item?.url) return acc;
      acc[String(item.name).toLowerCase()] = String(item.url);
      return acc;
    },
    {},
  );

  const name =
    `${current.firstName || ""} ${current.lastName || ""}`.trim() ||
    current.email ||
    "Student";
  const joinedYear = current.joinedYear || new Date().getFullYear();

  return {
    id: current.id,
    name,
    avatar: current.avatar || "",
    role: "Student",
    department: "GIC",
    gen:
      typeof current.generation === "number"
        ? current.generation
        : Number(current.gen || current.generation || 0) || "-",
    joinedYear,
    bio: current.bio || "No bio added yet.",
    email: current.email || "",
    phone: current.phone || "-",
    skills: Array.isArray(current.skill) ? current.skill : [],
    achievements: [],
    projectCount:
      typeof current.projectCount === "number"
        ? current.projectCount
        : Array.isArray(current.projects)
          ? current.projects.length
          : 0,
    projectsContributed: Array.isArray(current.projects)
      ? current.projects.map((project: any, idx: number) => ({
        id: String(project?.id || project?._id || idx),
        emoji: project?.emoji || "📁",
        title: project?.name || project?.title || "Untitled Project",
        category: project?.category || "General",
        year:
          project?.year ||
          project?.academicYear ||
          (project?.createdAt
            ? new Date(project.createdAt).getFullYear()
            : ""),
      }))
      : [],
    contributions: 0,
    followers: 0,
    github: socialMap.github || "",
    linkedin: socialMap.linkedin || "",
    portfolio: socialMap.portfolio || "",
  };
});

useHead({
  title: hasStudent.value && student.value
    ? `${student.value.name} - Student Profile`
    : "Student Not Found - GIC Showcase",
  meta: [
    {
      name: "description",
      content: hasStudent.value && student.value
        ? `${student.value.name} - ${student.value.role}`
        : "Student profile not found",
    },
  ],
});
</script>
