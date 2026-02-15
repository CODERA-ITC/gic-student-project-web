<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <ScrollToTop />

    <div class="hero-nodes py-14 sm:py-16 lg:py-20 border-b border-blue-800/30 dark:border-slate-700">
      <UContainer>
        <div class="space-y-5 sm:space-y-6">
          <div class="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto px-2">
            <h1
              class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-blue-900 dark:text-white">
              Meet Our Students
            </h1>
            <p class="text-base sm:text-lg lg:text-xl text-blue-900/80 dark:text-gray-300">
              Discover talented students and their contributions to the GIC
              program
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap px-2">
            <ButtonsPresetButton preset="exploreProjects" to="/projects" size="md" />
          </div>
        </div>
      </UContainer>
    </div>

    <div
      class="sticky top-0 z-[200] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-slate-700">
      <UContainer>
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between w-full gap-2 sm:gap-3 py-2 sm:py-3">
          <div class="w-full lg:w-auto lg:flex-1 flex justify-center">
            <div class="w-full sm:max-w-xs">
              <USelectMenu v-model="selectedGeneration" size="lg" :items="generationOptions"
                class="w-full rounded-xl" />
            </div>
          </div>

          <div class="w-full lg:w-auto lg:flex-1">
            <div class="flex items-center justify-center gap-1 flex-wrap">
              <div
                class="hidden md:flex w-full items-center gap-2 justify-start flex-nowrap overflow-x-auto whitespace-nowrap pb-1">
                <ButtonsPresetButton v-for="skill in topSkills" :key="skill" :label="skill"
                  :color="selectedSkill === skill ? 'primary' : 'secondary'"
                  :variant="selectedSkill === skill ? 'solid' : 'ghost'" size="md" @click="selectedSkill = skill" />
              </div>

              <div class="relative md:hidden w-full">
                <USelectMenu v-model="selectedSkillObj" size="lg" :items="skillOptions" placeholder="All skills"
                  class="w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <Transition enter-active-class="transition-all ease-out duration-700">
      <UContainer
        class="py-7 sm:py-9 bg-gradient-to-b via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div class="space-y-6">
          <template v-if="isLoadingStudents">
            <div class="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
              <div class="h-5 sm:h-6 w-44 sm:w-64 rounded bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              <div
                v-for="n in 6"
                :key="`student-skeleton-${n}`"
                class="rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 animate-pulse space-y-4"
              >
                <div class="h-32 rounded-2xl bg-gray-200 dark:bg-slate-700"></div>
                <div class="mx-auto h-20 w-20 rounded-full bg-gray-200 dark:bg-slate-700 -mt-12 border-4 border-white dark:border-slate-800"></div>
                <div class="space-y-2 pt-2">
                  <div class="h-5 w-3/5 mx-auto rounded bg-gray-200 dark:bg-slate-700"></div>
                  <div class="h-4 w-2/5 mx-auto rounded bg-gray-200 dark:bg-slate-700"></div>
                </div>
                <div class="flex justify-center gap-2 pt-1">
                  <div class="h-6 w-16 rounded-xl bg-gray-200 dark:bg-slate-700"></div>
                  <div class="h-6 w-16 rounded-xl bg-gray-200 dark:bg-slate-700"></div>
                  <div class="h-6 w-16 rounded-xl bg-gray-200 dark:bg-slate-700"></div>
                </div>
                <div class="h-16 rounded-2xl bg-gray-200 dark:bg-slate-700"></div>
                <div class="h-10 rounded-2xl bg-gray-200 dark:bg-slate-700"></div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
              <div class="flex items-center gap-3 sm:gap-4 flex-wrap">
                <p class="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300">
                  <template v-if="totalPages > 1">
                    Showing {{ paginatedStudents.length }} of
                  </template>
                  <span class="font-semibold text-blue-900 dark:text-white">{{
                    filteredTotal
                  }}</span>
                  students
                  <template v-if="totalPages > 1">
                    (Page {{ currentPage }} of {{ totalPages }})
                  </template>
                </p>

                <div v-if="hasActiveFilters" class="flex items-center gap-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400">•</span>
                  <div class="flex items-center gap-2 flex-wrap">
                    <UBadge
                      v-if="isGenerationFiltered"
                      color="primary"
                      variant="soft"
                      size="sm"
                      class="flex items-center gap-1"
                    >
                      {{ selectedGeneration?.label || `Gen ${defaultGeneration}` }}
                      <UButton
                        color="primary"
                        variant="ghost"
                        size="xs"
                        icon="i-heroicons-x-mark"
                        :padded="false"
                        class="ml-1"
                        @click="clearGenerationFilter"
                      />
                    </UBadge>

                    <UBadge
                      v-if="selectedSkill"
                      color="primary"
                      variant="soft"
                      size="sm"
                      class="flex items-center gap-1"
                    >
                      {{ selectedSkill }}
                      <UButton
                        color="primary"
                        variant="ghost"
                        size="xs"
                        icon="i-heroicons-x-mark"
                        :padded="false"
                        class="ml-1"
                        @click="clearSkillFilter"
                      />
                    </UBadge>
                  </div>
                </div>
              </div>

              <ButtonsPresetButton v-if="hasActiveFilters" preset="clearFilters" @click="clearFilters" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              <StudentPortfolio v-for="student in paginatedStudents" :key="student.id" :name="student.name"
                :program="student.program" :year="String(student.year || '')" :avatar="student.avatar" :bio="student.bio"
                :skills="student.skills" :project-count="student.projectCount || 0" :gpa="student.gpa"
                :achievements="student.achievements?.length || 0" :graduation-year="student.graduationYear"
                :gen="student.gen" :social="student.social" @view-profile="() => navigateTo(`/students/${student.id}`)" />
            </div>

            <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 sm:gap-4 mt-8 flex-wrap">
              <ButtonsPresetButton label="Previous" icon="i-heroicons-arrow-left" color="secondary" variant="outline"
                size="sm" :disabled="currentPage === 1" @click="goToPage(Math.max(1, currentPage - 1))" />

              <span
                class="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-900 dark:text-white bg-blue-50 dark:bg-slate-800 rounded-lg">
                Page {{ currentPage }} of {{ totalPages }}
              </span>

              <ButtonsPresetButton label="Next" icon="i-heroicons-arrow-right" color="primary" variant="solid" size="sm"
                :disabled="currentPage === totalPages" @click="goToPage(Math.min(totalPages, currentPage + 1))" />
            </div>

            <div v-if="filteredTotal > 0" class="text-center mt-6">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
                {{
                  Math.min(
                    (currentPage - 1) * itemsPerPage + paginatedStudents.length,
                    filteredTotal,
                  )
                }}
                of {{ filteredTotal }} students
              </p>
            </div>

            <div v-if="filteredTotal === 0" class="text-center py-20">
              <UIcon name="i-heroicons-users" class="w-16 h-16 text-gray-600 dark:text-gray-400 mx-auto mb-4" />
              <p class="text-gray-400 dark:text-gray-500 text-lg">
                No students found matching your filters
              </p>
            </div>
          </template>
        </div>
      </UContainer>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useStudentStore } from "~/stores/students";

const studentStore = useStudentStore();
const route = useRoute();
const router = useRouter();

const currentPage = ref(1);
const itemsPerPage = ref(10);
const isLoadingStudents = ref(false);


const allTopSkills = [
  "Full Stack",
  "Frontend",
  "Database Analyst", // Corrected the spelling for you!
  "Backend",
  "DevOps",
  "Network",
  "Cybersecurity",
  "Cloud Architect",
];
const topSkills = computed(() => allTopSkills.slice(0, 6));
const selectedSkill = ref("");
const skillOptions = computed(() =>
  topSkills.value.map((skill) => ({ label: skill, value: skill })),
);
const selectedSkillObj = computed({
  get: () =>
    skillOptions.value.find((s) => s.value === selectedSkill.value) || null,
  set: (val: { label: string; value: string } | null) => {
    selectedSkill.value = val?.value || "";
  },
});

const generationOptions = computed(() =>
  studentStore.publicGenerations.map((gen) => ({
    label: `Gen ${gen}`,
    value: gen,
  })),
);
const defaultGeneration = computed(() => {
  return (
    generationOptions.value.find((x) => x.value === 25)?.value ||
    generationOptions.value[0]?.value ||
    25
  );
});
const routeGeneration = computed(() => {
  const raw = Array.isArray(route.query.generation)
    ? route.query.generation[0]
    : route.query.generation;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return defaultGeneration.value;
  return parsed;
});
const selectedGeneration = ref(
  generationOptions.value.find((x) => x.value === routeGeneration.value)
  || generationOptions.value.find((x) => x.value === defaultGeneration.value)
  || generationOptions.value[0],
);

const mappedStudents = computed(() => studentStore.publicMappedStudents);

const filteredStudents = computed(() => {
  if (!selectedSkill.value) {
    return mappedStudents.value;
  }

  const selected = selectedSkill.value.toLowerCase();
  return mappedStudents.value.filter((student) => {
    const skills = Array.isArray(student.skills) ? student.skills : [];
    return skills.some((skill) =>
      (skill || "").toString().toLowerCase().includes(selected),
    );
  });
});

const filteredTotal = computed(() => {
  if (!selectedSkill.value) {
    return studentStore.total;
  }

  return filteredStudents.value.length;
});

const isGenerationFiltered = computed(
  () => (selectedGeneration.value?.value || defaultGeneration.value) !== defaultGeneration.value,
);

const hasActiveFilters = computed(() => {
  const genFiltered = isGenerationFiltered.value;
  const skillFiltered = !!selectedSkill.value;
  return genFiltered || skillFiltered;
});

const paginatedStudents = computed(() => filteredStudents.value);

const totalPages = computed(() => Math.max(1, studentStore.lastPage || 1));

const clearFilters = () => {
  selectedGeneration.value =
    generationOptions.value.find((x) => x.value === defaultGeneration.value) || generationOptions.value[0];
  selectedSkill.value = "";
  currentPage.value = 1;
};

const clearGenerationFilter = () => {
  selectedGeneration.value =
    generationOptions.value.find((x) => x.value === defaultGeneration.value) || generationOptions.value[0];
};

const clearSkillFilter = () => {
  selectedSkill.value = "";
};

const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  await loadStudentsByGeneration(
    selectedGeneration.value?.value || defaultGeneration.value,
    page,
  );
};

const loadStudentsByGeneration = async (
  generation: number,
  page: number,
) => {
  isLoadingStudents.value = true;
  try {
    await studentStore.loadPublicStudentsByGeneration(
      generation,
      page,
      itemsPerPage.value,
      false,
    );
  } finally {
    isLoadingStudents.value = false;
  }
};

watch(selectedSkill, () => {
  currentPage.value = 1;
});

watch(routeGeneration, (gen) => {
  const match =
    generationOptions.value.find((x) => x.value === gen) ||
    generationOptions.value.find((x) => x.value === defaultGeneration.value) ||
    generationOptions.value[0];
  if (match && selectedGeneration.value?.value !== match.value) {
    selectedGeneration.value = match;
  }
});

watch(selectedGeneration, async (next) => {
  if (!next?.value) return;
  currentPage.value = 1;
  await router.replace({
    query: {
      ...route.query,
      generation: String(next.value),
    },
  });
  await loadStudentsByGeneration(next.value, 1);
});

onMounted(async () => {
  if (!route.query.generation) {
    await router.replace({
      query: {
        ...route.query,
        generation: String(selectedGeneration.value?.value || defaultGeneration.value),
      },
    });
  }
  await loadStudentsByGeneration(
    selectedGeneration.value?.value || defaultGeneration.value,
    1,
  );
  currentPage.value = studentStore.currentPage || 1;
});

useHead({
  title: "Students - GIC Showcase",
  meta: [
    {
      name: "description",
      content: "Meet talented GIC students and their projects",
    },
  ],
});
</script>
