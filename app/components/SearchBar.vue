<template>
  <div class="relative">
    <!-- Search Icon Button -->
    <Transition enter-active-class="transition-all duration-400 ease-out" enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-90">
      <div>
        <UButton v-if="!isOpen" icon="i-heroicons-magnifying-glass-20-solid" color="gray" variant="ghost" size="xl"
          :ui="{ rounded: 'rounded-lg' }" class="text-neutral-700 dark:text-neutral-200" @click="toggleSearch" />

        <UButton v-else icon="i-heroicons-x-mark-20-solid" color="gray" variant="ghost" size="xl"
          :ui="{ rounded: 'rounded-lg' }" class="text-neutral-700 dark:text-neutral-200" @click="closeSearch" />
      </div>
    </Transition>

    <!-- Centered Search Popup -->
    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-20 sm:pt-24">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="closeSearch"></div>

        <div
          class="relative mx-auto w-full max-w-2xl max-h-[80vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.35)] ring-1 ring-gray-200/80 dark:ring-neutral-700/80 border border-gray-200 dark:border-neutral-800 overflow-hidden">
          <!-- Search Input -->
          <div class="p-5 sm:p-6 border-b border-gray-200 dark:border-neutral-800 flex flex-col items-center">
            <UInput v-model="localQuery" :placeholder="placeholder" icon="i-heroicons-magnifying-glass-20-solid"
              size="lg" color="neutral" class="w-full max-w-2xl"
              :ui="{ base: '!rounded-3xl !min-h-[52px]' }" autofocus @keyup.enter="handleSearch" @keyup.esc="closeSearch" />
            <p class="mt-2 text-xs text-gray-500 dark:text-neutral-400">
              Press
              <kbd class="px-1 py-0.5 border rounded-lg text-xs bg-gray-100 dark:bg-neutral-800">Esc</kbd>
              to close
            </p>
          </div>

          <!-- Search Results -->
          <div v-if="searchResults.length > 0" class="max-h-[calc(80vh-120px)] overflow-y-auto">
            <div v-for="result in searchResults" :key="`${result.type}-${result.value}`"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors border-b border-gray-100 dark:border-neutral-800 last:border-0"
              @click="selectResult(result)">
              <UIcon :name="result.icon" class="text-gray-400 dark:text-neutral-500 flex-shrink-0" size="20" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate">
                  {{ result.label }}
                </p>
                <p class="text-xs text-gray-500 dark:text-neutral-400 truncate">
                  {{ result.subtitle }}
                </p>
              </div>
              <UBadge v-if="result.count" :label="result.count.toString()" color="gray" variant="subtle" />
              <UBadge v-else-if="result.category" :label="result.category" color="primary" variant="subtle" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useProjectStore } from "~/stores/projects";
import { useStudentStore } from "~/stores/students";

const props = defineProps({
  context: {
    type: String,
    default: "projects", // 'projects' or 'students'
    validator: (value) => ["projects", "students"].includes(value),
  },
});

const emit = defineEmits(["search", "clear"]);

const SEARCH_DEBOUNCE_MS = 300;

const localQuery = ref("");
const debouncedQuery = ref("");
const isOpen = ref(false);
const searchResults = ref([]);
const projectStore = useProjectStore();
const studentStore = useStudentStore();
const route = useRoute();
let activeSearchRequest = 0;

const activeContext = computed(() => {
  if (route.path.startsWith("/students")) return "students";
  if (route.path.startsWith("/projects")) return "projects";
  return props.context;
});

// Debounce search input and fetch results
let debounceTimer = null;
watch(localQuery, (newValue) => {
  if (debounceTimer) clearTimeout(debounceTimer);

  // Clear results if query is empty
  if (!newValue.trim()) {
    searchResults.value = [];
    return;
  }

  debounceTimer = setTimeout(async () => {
    debouncedQuery.value = newValue;
    const requestId = ++activeSearchRequest;

    // Fetch search results based on context
    try {
      if (activeContext.value === "students") {
        const results = await studentStore.searchStudentsWithResults(
          debouncedQuery.value,
        );
        if (requestId === activeSearchRequest) {
          searchResults.value = results;
        }
      } else {
        const results = await projectStore.searchProjects(
          debouncedQuery.value,
        );
        if (requestId === activeSearchRequest) {
          searchResults.value = results;
        }
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      if (requestId === activeSearchRequest) {
        searchResults.value = [];
      }
    }
  }, SEARCH_DEBOUNCE_MS);
});

// Handle scroll to close search
const handleScroll = () => {
  if (isOpen.value) {
    closeSearch();
  }
};

onMounted(() => {
  // Close search on route change
  useRouter().afterEach(() => {
    closeSearch();
    searchResults.value = [];
  });

  // Add scroll listener
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  // Remove scroll listener
  window.removeEventListener("scroll", handleScroll);
});

// Dynamic placeholder based on context
const placeholder = computed(() => {
  return activeContext.value === "students"
    ? "Search students, programs, skills..."
    : "Search projects...";
});

const toggleSearch = () => {
  isOpen.value = !isOpen.value;
  if (!isOpen.value) {
    localQuery.value = "";
  }
};

const closeSearch = () => {
  activeSearchRequest++;
  isOpen.value = false;
  localQuery.value = "";
  emit("clear");
};

const handleSearch = () => {
  if (localQuery.value.trim()) {
    emit("search", localQuery.value);

    if (activeContext.value === "students") {
      navigateTo(`/students?search=${encodeURIComponent(localQuery.value)}`);
    } else {
      navigateTo(`/projects?search=${encodeURIComponent(localQuery.value)}`);
    }
    closeSearch();
  }
};

const selectResult = (result) => {
  if (activeContext.value === "students") {
    if (result.studentId) {
      navigateTo(`/students/${result.studentId}`);
    } else if (result.type === "category") {
      navigateTo(`/students?search=${encodeURIComponent(result.value)}`);
    } else {
      navigateTo(`/students?search=${encodeURIComponent(result.value)}`);
    }
  } else {
    if (result.type === "category") {
      navigateTo(`/projects?search=${encodeURIComponent(result.value)}`);
    } else if (
      (result.type === "name" || result.type === "description") &&
      result.projectId
    ) {
      // Navigate directly to project details page
      navigateTo(`/projects/${result.projectId}`);
    }
  }
  closeSearch();
};
</script>
