<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-110 flex items-center justify-center group"
      aria-label="Scroll to top"
    >
      <UIcon
        name="i-heroicons-arrow-up"
        class="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1"
      />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { smoothScrollToTop } from "~/utils/scrollBehavior";

const isVisible = ref(false);

const handleScroll = () => {
  // Show button when user scrolls down 300px
  isVisible.value = window.scrollY > 300;
};

const scrollToTop = () => {
  smoothScrollToTop(800);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Check initial scroll position
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
