<template>
  <div class="relative">
    <!-- Search Input Trigger -->
    <div class="relative group">
      <UInput v-model="localQuery" :placeholder="placeholder" :icon="icon" :trailing-icon="clearIcon" size="md"
        color="blue" :ui="inputUI" @focus="isOpen = true" @update:model-value="$emit('update:model-value', $event)"
        @keyup.enter="handleSearch" @click:trailing="clearSearch" />
      <!-- Keyboard Shortcut Hint -->
      <div
        class="absolute right-3 top-1/2 -translate-y-1/2 hidden group-focus-within:flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-400 pointer-events-none">
        <kbd
          class="px-2 py-1 rounded bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-200 text-xs font-semibold">Enter</kbd>
      </div>
    </div>

    <!-- Search Modal/Popup -->
    <Transition enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="closeSearch"></div>

        <!-- Modal Content -->
        <div class="flex items-start justify-center min-h-screen pt-20 px-4">
          <div class="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-2xl relative">
            <!-- Header -->
            <div
              class="sticky top-0 bg-gradient-to-b from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-6">
              <div class="flex items-center gap-3 mb-4">
                <UIcon name="i-heroicons-magnifying-glass-20-solid" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 class="text-2xl font-bold text-gray-900 dark:text-neutral-100">
                  Search Projects
                </h2>
                <UButton icon="i-heroicons-x-mark-20-solid" color="gray" variant="ghost" size="sm"
                  class="absolute top-4 right-4 text-gray-700 dark:text-neutral-300" @click="closeSearch" />
              </div>
              <div class="relative">
                <UInput v-model="localQuery" placeholder="Search projects by title, category, author..."
                  icon="i-heroicons-magnifying-glass-20-solid" size="lg" color="blue" :ui="{ rounded: 'rounded-xl' }"
                  @keyup.enter="handleSearch" @keyup.esc="closeSearch" autofocus />
              </div>
            </div>

            <!-- Search Results/Suggestions -->
            <div class="max-h-96 overflow-y-auto p-6">
              <div v-if="!localQuery.trim()" class="text-center py-12">
                <UIcon name="i-heroicons-spark-les-20-solid"
                  class="w-12 h-12 text-gray-300 dark:text-neutral-600 mx-auto mb-4" />
                <p class="text-gray-500 dark:text-neutral-400 text-lg font-medium">
                  Enter keywords to search
                </p>
                <p class="text-gray-400 dark:text-neutral-500 text-sm mt-2">
                  Search across all projects in the GIC portal
                </p>
              </div>

              <div v-else-if="searchResults.length > 0" class="space-y-4">
                <p class="text-sm font-semibold text-gray-600 dark:text-neutral-400 mb-4">
                  Found {{ searchResults.length }} result(s)
                </p>
                <div v-for="result in searchResults" :key="result.id"
                  class="p-4 border border-gray-200 dark:border-neutral-700 rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group"
                  @click="selectResult(result)">
                  <div class="flex items-start gap-3">
                    <div class="text-2xl mt-1">{{ result.emoji }}</div>
                    <div class="flex-1">
                      <h3
                        class="font-semibold text-gray-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {{ result.title }}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                        {{ result.description }}
                      </p>
                      <div class="flex gap-2 mt-3">
                        <UBadge color="primary" variant="soft" size="sm">
                          {{ result.category }}
                        </UBadge>
                        <UBadge color="info" variant="soft" size="sm">
                          {{ result.year }}
                        </UBadge>
                        <UBadge color="success" variant="soft" size="sm">
                          By {{ result.author }}
                        </UBadge>
                      </div>
                    </div>
                    <UIcon name="i-heroicons-arrow-right-20-solid"
                      class="w-5 h-5 text-gray-400 dark:text-neutral-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 mt-1" />
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-12">
                <UIcon name="i-heroicons-magnifying-glass-20-solid"
                  class="w-12 h-12 text-gray-300 dark:text-neutral-600 mx-auto mb-4" />
                <p class="text-gray-500 dark:text-neutral-400 text-lg font-medium">
                  No projects found
                </p>
                <p class="text-gray-400 dark:text-neutral-500 text-sm mt-2">
                  Try adjusting your search keywords
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="sticky bottom-0 bg-gradient-to-t from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 border-t border-gray-200 dark:border-neutral-700 p-4 flex justify-between items-center">
              <p class="text-xs text-gray-500 dark:text-neutral-400">
                <kbd
                  class="px-2 py-1 rounded bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-200 text-xs font-semibold">ESC</kbd>
                to close
              </p>
              <UButton color="primary" icon="i-heroicons-arrow-right-20-solid" trailing @click="handleSearch"
                :disabled="!localQuery.trim()">
                View All Results
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Search projects...",
  },
  icon: {
    type: String,
    default: "i-heroicons-magnifying-glass",
  },
  projects: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:model-value", "search", "clear"]);

const localQuery = ref(props.modelValue);
const isOpen = ref(false);

watch(
  () => props.modelValue,
  (newVal) => {
    localQuery.value = newVal;
  }
);

const clearIcon = computed(() => {
  return localQuery.value ? "i-heroicons-x-mark" : "";
});

// Mock projects data - in real app, this would come from props
const allProjects = [
  {
    id: 1,
    title: "AI Chat Assistant",
    description: "An intelligent chatbot powered by GPT-3",
    category: "AI/ML",
    year: "2024",
    author: "Sarah Chen",
    emoji: "🤖",
  },
  {
    id: 2,
    title: "Mobile Fitness App",
    description: "Track workouts and health metrics",
    category: "Mobile",
    year: "2024",
    author: "Alex Rodriguez",
    emoji: "💪",
  },
  {
    id: 3,
    title: "E-Commerce Platform",
    description: "Full-stack online store with payment",
    category: "Web",
    year: "2024",
    author: "Priya Patel",
    emoji: "🛍️",
  },
  {
    id: 4,
    title: "Climate Monitoring IoT",
    description: "Environmental monitoring system",
    category: "Sustainability",
    year: "2023",
    author: "Jordan Kim",
    emoji: "🌍",
  },
  {
    id: 5,
    title: "Machine Learning Pipeline",
    description: "Automated data processing framework",
    category: "AI/ML",
    year: "2023",
    author: "Emma Watson",
    emoji: "🧠",
  },
];

const searchResults = computed(() => {
  if (!localQuery.value.trim()) return [];

  const query = localQuery.value.toLowerCase();
  return allProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query) ||
      project.author.toLowerCase().includes(query)
  );
});

const inputUI = {
  base: "relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus-within:z-10",
  rounded: "rounded-lg",
  placeholder: "placeholder-gray-400 dark:placeholder-neutral-500",
  size: {
    md: "px-3 py-2",
  },
  icon: {
    base: "flex items-center pointer-events-none",
    leading: {
      wrapper: "absolute inset-y-0 left-0 pl-3 flex items-center",
      pointer: "pointer-events-auto",
    },
    trailing: {
      wrapper: "absolute inset-y-0 right-0 pr-3 flex items-center",
      pointer: "pointer-events-auto cursor-pointer hover:text-blue-600 dark:hover:text-blue-400",
    },
  },
};

const clearSearch = () => {
  localQuery.value = "";
  emit("update:model-value", "");
  emit("clear");
};

const closeSearch = () => {
  isOpen.value = false;
  clearSearch();
};

const handleSearch = () => {
  if (localQuery.value.trim()) {
    emit("search", localQuery.value);
    // Navigate to projects page with search query
    navigateTo(`/projects?search=${encodeURIComponent(localQuery.value)}`);
    closeSearch();
  }
};

const selectResult = (project) => {
  // Navigate to projects page and filter by selected project
  navigateTo(`/projects?search=${encodeURIComponent(project.title)}`);
  closeSearch();
};
</script>