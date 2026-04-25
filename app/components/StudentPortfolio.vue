<template>
  <div
    class="group relative h-full w-full max-w-md mx-auto overflow-hidden rounded-3xl
           border border-white/70 dark:border-white/5 ring-1 ring-blue-500/10 hover:ring-blue-500/30
           bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950
           shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 dark:hover:shadow-blue-400/25
           transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl"
    @mouseenter="showSocial = true"
    @mouseleave="showSocial = false"
  >
    <!-- Header Image Background -->
    <div
      class="h-36 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-800 dark:via-blue-700 dark:to-cyan-700 relative overflow-hidden
             ring-1 ring-slate-200/70 dark:ring-slate-700/60 rounded-2xl m-3"
    >
      <div
        class="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzBoLTEydjEyaDEyVjMwem0tMTIgMGgtMTJ2MTJoMTJWMzB6bTEyLTEyaC0xMnYxMmgxMlYxOHptMCAxMmgxMnYxMkg0OFYzMHptMC0xMmgxMnYxMkg0OFYxOHoiLz48L2c+PC9nPjwvc3ZnPg==')]"
      ></div>
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
    </div>

    <!-- Content -->
    <div class="px-5 pb-6 pt-2">
      <!-- Avatar -->
      <div class="flex justify-center -mt-20 mb-4">
        <div
          class="relative w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden bg-white dark:bg-slate-800
                 ring-4 ring-white/50 dark:ring-slate-700/50 group-hover:ring-8 group-hover:ring-blue-300/60 dark:group-hover:ring-blue-500/60
                 transition-all duration-300"
        >
          <img
            v-if="avatar"
            :src="avatar"
            :alt="name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            @error="handleImageError"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-3xl font-semibold text-gray-400 dark:text-gray-500"
          >
            {{ initials }}
          </div>
        </div>
      </div>

      <!-- Student Info -->
      <div class="text-center mb-4">
        <h3
          class="text-xl font-semibold text-slate-900 dark:text-white mb-1 line-clamp-1 tracking-tight"
        >
          {{ name }}
        </h3>
        <p
          class="text-xs font-semibold text-blue-900/70 dark:text-blue-200 uppercase tracking-[0.2em] mb-2 line-clamp-1"
        >
          {{ program }}
        </p>
        <div
          class="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400"
        >
          <!-- <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5" />
            {{ year }}
          </span>
          <span>•</span>
          <span class="flex items-center gap-1">
            <UIcon name="i-heroicons-academic-cap" class="w-3.5 h-3.5" />
            Class of {{ gen }}
          </span> -->
        </div>
      </div>

      <!-- Bio -->
      <!-- <p
        v-if="bio"
        class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-center"
      >
        {{ bio }}
      </p> -->

      <!-- Skills -->
      <div v-if="skills && skills.length > 0" class="mb-4">
        <div class="flex flex-wrap gap-1.5 justify-center">
          <span
            v-for="(skill, index) in displaySkills"
            :key="index"
            class="px-3 py-1 text-xs font-semibold bg-white/80 dark:bg-slate-800/70 text-slate-800 dark:text-blue-100 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            {{ skill }}
          </span>
          <span
            v-if="skills.length > maxSkills"
            class="px-3 py-1 text-xs font-semibold bg-slate-50/80 dark:bg-slate-800/70 text-slate-700 dark:text-blue-200 rounded-xl border border-slate-300 dark:border-slate-600"
          >
            +{{ skills.length - maxSkills }}
          </span>
        </div>
      </div>

      <!-- Stats -->
      <div
        class="flex items-center justify-around py-4 mb-5 rounded-2xl ring-1 ring-slate-200/70 dark:ring-slate-700/60 bg-white/80 dark:bg-slate-800/70 shadow-sm"
      >
        <div class="text-center">
          <div class="text-lg font-semibold text-slate-900 dark:text-white">
            {{ projectCount }}
          </div>
          <div class="text-xs text-slate-500 dark:text-gray-400">Projects</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold text-slate-900 dark:text-white">
            {{ joined || "2026" }}
          </div>
          <div class="text-xs text-slate-500 dark:text-gray-400">Joined</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold text-slate-900 dark:text-white">
            {{ gen }}
          </div>
          <div class="text-xs text-slate-500 dark:text-gray-400">Gen</div>
        </div>
      </div>

      <!-- Actions & Social Links -->
      <div class="flex items-center gap-2">
        <!-- View Profile Button - Always visible -->
        <ButtonsPresetButton
          preset="viewProfileStudent"
          size="md"
          class="flex-1"
          @click="$emit('view-profile')"
        />

        <!-- Social Links - Show on card hover -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-75 translate-x-2"
          enter-to-class="opacity-100 scale-100 translate-x-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-x-0"
          leave-to-class="opacity-0 scale-75 translate-x-2"
        >
          <div
            v-if="
              social &&
              (social.github || social.linkedin || social.portfolio) &&
              showSocial
            "
            class="flex items-center gap-1.5"
          >
            <a
              v-if="social.github"
              :href="social.github"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-900 dark:hover:bg-gray-800 hover:text-white text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200"
              title="GitHub"
            >
              <UIcon name="i-simple-icons-github" class="w-4 h-4" />
            </a>
            <a
              v-if="social.linkedin"
              :href="social.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 rounded-lg transition-all duration-200"
              title="LinkedIn"
            >
              <UIcon name="i-simple-icons-linkedin" class="w-4 h-4" />
            </a>
            <a
              v-if="social.portfolio"
              :href="social.portfolio"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-600 hover:text-white text-purple-600 dark:text-purple-400 rounded-lg transition-all duration-200"
              title="Portfolio"
            >
              <UIcon name="i-heroicons-globe-alt" class="w-4 h-4" />
            </a>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Hover Effect Overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface StudentSocial {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

interface Props {
  name: string;
  program: string;
  year: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  projectCount?: number;
  gpa?: number;
  joined?: string;
  gen?: number;
  social?: StudentSocial;
  maxSkills?: number;
}

const props = withDefaults(defineProps<Props>(), {
  avatar: "",
  bio: "",
  skills: () => [],
  projectCount: 0,
  gpa: 0,
  gen: new Date().getFullYear(),
  social: () => ({}),
  maxSkills: 4,
});

const emit = defineEmits<{
  "view-profile": [];
}>();

const showSocial = ref(false);
const imageError = ref(false);

const initials = computed(() => {
  return props.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const displaySkills = computed(() => {
  return props.skills.slice(0, props.maxSkills);
});

const toggleSocial = () => {
  showSocial.value = !showSocial.value;
};

const handleImageError = () => {
  imageError.value = true;
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
