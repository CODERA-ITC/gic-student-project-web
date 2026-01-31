<template>
  <div
    class="group relative h-full w-full max-w-md mx-auto flex flex-col overflow-hidden rounded-3xl
           border border-white/70 dark:border-white/5 ring-1 ring-blue-500/10 hover:ring-blue-500/30
           bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950
           shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 dark:hover:shadow-blue-400/25
           transition-all duration-300 hover:-translate-y-1 hover:cursor-pointer p-4 sm:p-5 backdrop-blur-xl"
  >
    <!-- Header Image -->
    <div
      class="relative h-48 w-full overflow-hidden rounded-2xl ring-1 ring-slate-200/70 dark:ring-slate-700/60 bg-slate-100/70 dark:bg-slate-800/60"
    >
      <img
        v-if="headerImage"
        :src="headerImage"
        alt="Profile header"
        class="h-full w-full object-cover opacity-95 transition-transform duration-500 group-hover:scale-105"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
    </div>

    <!-- Content -->
    <div class="relative px-2 sm:px-3 pt-4 pb-2 flex-1 flex flex-col justify-between gap-4">
      <div class="flex-1">
        <!-- Profile Image -->
        <div class="flex justify-left -translate-y-16">
          <div
            class="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 shadow-2xl
                   ring-4 ring-white/50 dark:ring-gray-700/50 group-hover:ring-8 group-hover:ring-blue-300/60 dark:group-hover:ring-blue-500/60
                   transition-all duration-300"
          >
            <img
              v-if="image"
              :src="image"
              :alt="name"
              class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div
              v-else
              class="h-full w-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white text-2xl font-semibold"
            >
              {{ name.charAt(0) }}
            </div>
          </div>
        </div>

        <!-- Name and Main Skill -->
        <div class="text-left -mt-6">
          <h2
            class="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors duration-300"
          >
            {{ name }}
          </h2>
          <p
            class="mt-1 text-xs font-semibold text-blue-900/70 dark:text-blue-200 uppercase tracking-[0.2em]"
          >
            {{ mainSkill }}
          </p>
        </div>

        <!-- Tech/Tools Skills -->
        <div class="mt-4 h-20 overflow-hidden">
          <div class="flex flex-wrap justify-start gap-2">
            <UBadge
              v-for="(tech, index) in displayedTech"
              :key="`tech-${index}`"
              color="neutral"
              variant="soft"
              size="lg"
              class="text-xs text-slate-800 dark:text-blue-100 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700
                     bg-white/70 dark:bg-slate-800/70 shadow-sm cursor-pointer
                     hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 font-semibold"
            >
              {{ tech }}
            </UBadge>
            <UBadge
              v-if="remainingTechCount > 0"
              color="neutral"
              variant="outline"
              size="lg"
              class="text-xs bg-slate-50/80 dark:bg-slate-800/70 text-slate-700 dark:text-blue-200 px-3 py-1 rounded-xl border border-slate-300 dark:border-slate-600 font-semibold
                     hover:bg-blue-50 dark:hover:bg-blue-800/30 transition-all duration-300"
            >
              +{{ remainingTechCount }}
            </UBadge>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0">
        <!-- Stats Grid -->
        <div
          class="mt-4 grid grid-cols-3 gap-4 bg-white/80 dark:bg-slate-800/70 rounded-2xl p-4 ring-1 ring-slate-200/70 dark:ring-slate-700/60 shadow-sm"
        >
          <!-- Projects -->
          <div
            class="flex flex-col justify-center text-center group/stat hover:scale-110 transition-transform duration-300"
          >
            <div class="flex flex-row justify-center gap-1 items-center">
              <div
                class="flex items-center justify-center mb-1 p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 group-hover/stat:bg-blue-200 dark:group-hover/stat:bg-blue-800/70 transition-colors duration-300"
              >
                <UIcon
                  name="i-heroicons-folder"
                  class="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover/stat:text-blue-700 dark:group-hover/stat:text-blue-300 transition-colors duration-300"
                />
              </div>
              <div
                class="text-lg font-semibold text-gray-900 dark:text-white group-hover/stat:text-blue-600 dark:group-hover/stat:text-blue-400 transition-colors duration-300"
              >
                {{ projects }}
              </div>
            </div>
            <p
              class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              Projects
            </p>
          </div>

          <!-- Generations -->
          <div
            class="flex flex-col justify-center text-center group/stat hover:scale-110 transition-transform duration-300"
          >
            <div class="flex flex-row justify-center gap-1 items-center">
              <div
                class="flex items-center justify-center mb-1 p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/50 group-hover/stat:bg-purple-200 dark:group-hover/stat:bg-purple-800/70 transition-colors duration-300"
              >
                <UIcon
                  name="i-heroicons-academic-cap"
                  class="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover/stat:text-purple-700 dark:group-hover/stat:text-purple-300 transition-colors duration-300"
                />
              </div>
              <div
                class="text-lg font-semibold text-gray-900 dark:text-white group-hover/stat:text-purple-600 dark:group-hover/stat:text-purple-400 transition-colors duration-300"
              >
                {{ generation }}
              </div>
            </div>
            <p
              class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              Gen
            </p>
          </div>

          <!-- Joined Year -->
          <div
            class="flex flex-col justify-center text-center group/stat hover:scale-110 transition-transform duration-300"
          >
            <div class="flex flex-row justify-center gap-1 items-center">
              <div
                class="flex items-center justify-center mb-1 p-1.5 rounded-full bg-green-100 dark:bg-green-900/50 group-hover/stat:bg-green-200 dark:group-hover/stat:bg-green-800/70 transition-colors duration-300"
              >
                <UIcon
                  name="i-heroicons-calendar"
                  class="w-4 h-4 text-green-600 dark:text-green-400 group-hover/stat:text-green-700 dark:group-hover/stat:text-green-300 transition-colors duration-300"
                />
              </div>
              <div
                class="text-lg font-semibold text-gray-900 dark:text-white group-hover/stat:text-green-600 dark:group-hover/stat:text-green-400 transition-colors duration-300"
              >
                {{ joinedYear }}
              </div>
            </div>
            <p
              class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide"
            >
              Joined
            </p>
          </div>
        </div>

        <!-- View Profile Button -->
        <div class="mt-4 flex justify-center w-full">
          <ButtonsPresetButton
            @click="handleViewProfile"
            preset="viewProfileStudent"
            class="w-full transform group-hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
          >
            View Profile
          </ButtonsPresetButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  mainSkill: string;
  image?: string;
  headerImage?: string;
  techSkills: string[];
  projects: number;
  generation: string;
  joinedYear: string;
  maxTech?: number;
}

const props = withDefaults(defineProps<Props>(), {
  image: "",
  headerImage: "",
  maxTech: 3,
});

const emit = defineEmits<{
  viewProfile: [];
}>();

const displayedTech = computed(() => props.techSkills.slice(0, props.maxTech));
const remainingTechCount = computed(() =>
  Math.max(0, props.techSkills.length - props.maxTech),
);

const handleViewProfile = () => {
  emit("viewProfile");
};
</script>
