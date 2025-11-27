<template>
  <div class="relative">
    <!-- Search Icon Button -->
    <Transition
      enter-active-class="transition-all duration-400 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <div>
        <UButton
          v-if="!isOpen"
          icon="i-heroicons-magnifying-glass-20-solid"
          color="gray"
          variant="ghost"
          size="xl"
          :ui="{ rounded: 'rounded-lg' }"
          class="text-neutral-700 dark:text-neutral-200"
          @click="toggleSearch"
        />

        <UButton
          v-else
          icon="i-heroicons-x-mark-20-solid"
          color="gray"
          variant="ghost"
          size="xl"
          :ui="{ rounded: 'rounded-lg' }"
          class="text-neutral-700 dark:text-neutral-200"
          @click="closeSearch"
        />
      </div>
    </Transition>

    <!-- Search Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="isOpen"
        class="fixed left-0 right-0 top-16 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div
          class="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden"
        >
          <!-- Search Input -->
          <div
            class="p-4 border-b border-gray-200 dark:border-neutral-800 w-full justify-center flex gap-1 items-center"
          >
            <UInput
              v-model="localQuery"
              :placeholder="placeholder"
              icon="i-heroicons-magnifying-glass-20-solid"
              size="lg"
              color="neutral"
              autofocus
              @keyup.enter="handleSearch"
              @keyup.esc="closeSearch"
            />
            <p class="text-xs text-gray-500 dark:text-neutral-400">
              Press
              <kbd
                class="px-1 py-0.5 border rounded text-xs bg-gray-100 dark:bg-neutral-800"
                >Esc</kbd
              >
              to close
            </p>
          </div>

          <!-- Search Results -->
          <div v-if="searchResults.length > 0" class="max-h-96 overflow-y-auto">
            <div
              v-for="result in searchResults"
              :key="`${result.type}-${result.value}`"
              class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors border-b border-gray-100 dark:border-neutral-800 last:border-0"
              @click="selectResult(result)"
            >
              <UIcon
                :name="result.icon"
                class="text-gray-400 dark:text-neutral-500 flex-shrink-0"
                size="20"
              />
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate"
                >
                  {{ result.label }}
                </p>
                <p class="text-xs text-gray-500 dark:text-neutral-400 truncate">
                  {{ result.subtitle }}
                </p>
              </div>
              <UBadge
                v-if="result.count"
                :label="result.count.toString()"
                color="gray"
                variant="subtle"
              />
              <UBadge
                v-else-if="result.category"
                :label="result.category"
                color="primary"
                variant="subtle"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <div v-if="isOpen" class="fixed inset-0 z-40" @click="closeSearch"></div>
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

const localQuery = ref("");
const debouncedQuery = ref("");
const isOpen = ref(false);
const projectStore = useProjectStore();
const studentStore = useStudentStore();

// Debounce search input
let debounceTimer = null;
watch(localQuery, (newValue) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = newValue;
  }, 300); // 300ms delay
});

// Dynamic search results based on context
const searchResults = computed(() => {
  if (props.context === "students") {
    return studentStore.searchStudentsWithResults(debouncedQuery.value);
  }
  return projectStore.searchProjects(debouncedQuery.value);
});

// Dynamic placeholder based on context
const placeholder = computed(() => {
  return props.context === "students"
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
  isOpen.value = false;
  localQuery.value = "";
  emit("clear");
};

const handleSearch = () => {
  if (localQuery.value.trim()) {
    emit("search", localQuery.value);
    // Use context-aware search when pressing enter
    const searchPath =
      props.context === "students" ? "/students/search" : "/projects/search";
    navigateTo(`${searchPath}?search=${encodeURIComponent(localQuery.value)}`);
    closeSearch();
  }
};

const selectResult = (result) => {
  if (props.context === "students") {
    if (result.type === "category") {
      navigateTo(
        `/students/search?program=${encodeURIComponent(result.value)}`
      );
    } else {
      navigateTo(`/students/search?search=${encodeURIComponent(result.value)}`);
    }
  } else {
    if (result.type === "category") {
      navigateTo(
        `/projects/search?category=${encodeURIComponent(result.value)}`
      );
    } else if (result.type === "title" || result.type === "description") {
      const searchTerm =
        result.type === "title" ? result.value : localQuery.value;
      navigateTo(`/projects/search?search=${encodeURIComponent(searchTerm)}`);
    }
  }
  closeSearch();
};
</script>
