<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <ScrollToTop />

    <div class="hero-nodes py-20 border-b border-blue-800/30 dark:border-slate-700">
      <UContainer>
        <div class="space-y-6">
          <div class="text-center space-y-4 max-w-2xl mx-auto">
            <h1 class="text-4xl lg:text-6xl font-semibold tracking-tight leading-tight text-blue-900 dark:text-white">
              Meet Our Students
            </h1>
            <p class="text-xl text-blue-900/80 dark:text-gray-300">
              Discover talented students and their contributions to the GIC
              program
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap">
            <ButtonsPresetButton preset="exploreProjects" to="/projects" size="md" />
          </div>
        </div>
      </UContainer>
    </div>

    <div
      class="sticky top-0 z-[140] bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-slate-700">
      <UContainer>
        <div class="flex items-center justify-between w-full gap-2 py-2">
          <div class="flex-1 flex justify-center">
            <div class="w-full max-w-xs">
              <USelectMenu v-model="selectedGeneration" size="xl" :items="generationOptions"
                class="w-full rounded-xl" />
            </div>
          </div>

          <div class="flex-1">
            <div class="flex items-center justify-center gap-1 flex-wrap">
              <div
                class="hidden md:flex items-center gap-2 justify-start flex-nowrap overflow-x-auto whitespace-nowrap pb-1">
                <ButtonsPresetButton v-for="skill in topSkills" :key="skill" :label="skill"
                  :color="selectedSkill === skill ? 'primary' : 'secondary'"
                  :variant="selectedSkill === skill ? 'solid' : 'ghost'" size="md" @click="selectedSkill = skill" />
              </div>

              <div class="relative md:hidden w-full">
                <USelectMenu v-model="selectedSkillObj" size="xl" :items="skillOptions" placeholder="All skills"
                  class="w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <Transition enter-active-class="transition-all ease-out duration-700">
      <UContainer
        class="py-9 bg-gradient-to-b via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div class="space-y-6">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-4">
              <p class="text-lg text-gray-700 dark:text-gray-300">
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
            </div>

            <ButtonsPresetButton v-if="hasActiveFilters" preset="clearFilters" @click="clearFilters" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <StudentPortfolio v-for="student in paginatedStudents" :key="student.id" :name="student.name"
              :program="student.program" :year="String(student.year || '')" :avatar="student.avatar" :bio="student.bio"
              :skills="student.skills" :project-count="student.projectCount || 0" :gpa="student.gpa"
              :achievements="student.achievements?.length || 0" :graduation-year="student.graduationYear"
              :gen="student.gen" :social="student.social" @view-profile="() => navigateTo(`/students/${student.id}`)" />
          </div>

          <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
            <ButtonsPresetButton label="Previous" icon="i-heroicons-arrow-left" color="secondary" variant="outline"
              size="md" :disabled="currentPage === 1" @click="goToPage(Math.max(1, currentPage - 1))" />

            <span
              class="px-4 py-2 text-sm font-medium text-blue-900 dark:text-white bg-blue-50 dark:bg-slate-800 rounded-lg">
              Page {{ currentPage }} of {{ totalPages }}
            </span>

            <ButtonsPresetButton label="Next" icon="i-heroicons-arrow-right" color="primary" variant="solid" size="md"
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

const topSkills = [
  "Full Stack",
  "Frontend",
  "Backend",
  "DevOps",
  "Network",
];
const selectedSkill = ref("");
const skillOptions = computed(() =>
  topSkills.map((skill) => ({ label: skill, value: skill })),
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

const hasActiveFilters = computed(() => {
  const genFiltered = (selectedGeneration.value?.value || 25) !== 25;
  const skillFiltered = !!selectedSkill.value;
  return genFiltered || skillFiltered;
});

const paginatedStudents = computed(() => filteredStudents.value);

const totalPages = computed(() => Math.max(1, studentStore.lastPage || 1));

const clearFilters = () => {
  selectedGeneration.value =
    generationOptions.value.find((x) => x.value === 25) || generationOptions.value[0];
  selectedSkill.value = "";
  currentPage.value = 1;
};

const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  await studentStore.loadPublicStudentsByGeneration(
    selectedGeneration.value?.value || 25,
    page,
    itemsPerPage.value,
    false,
  );
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
  await studentStore.loadPublicStudentsByGeneration(
    next.value,
    1,
    itemsPerPage.value,
    false,
  );
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
  await studentStore.loadPublicStudentsByGeneration(
    selectedGeneration.value?.value || defaultGeneration.value,
    1,
    itemsPerPage.value,
    false,
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
