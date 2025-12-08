<template>
    <button @click="toggleTheme"
        class="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 focus:outline-none hover:opacity-80"
        :class="[
            isDark
                ? 'bg-neutral-800 hover:bg-neutral-700'
                : 'bg-white hover:bg-neutral-100 border border-neutral-200'
        ]" :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">

        <!-- Sun icon for light mode -->
        <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-neutral-800 transition-all duration-300 animate-in spin-in" fill="currentColor"
            viewBox="0 0 24 24">
            <path
                d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>

        <!-- Moon icon for dark mode -->
        <svg v-else xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-white transition-all duration-300 animate-in spin-in" fill="currentColor"
            viewBox="0 0 24 24">
            <path fill-rule="evenodd"
                d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                clip-rule="evenodd" />
        </svg>
    </button>
</template>

<script setup lang="ts">
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const toggleTheme = () => {
    themeStore.toggle()
}

// Initialize theme on component mount
onMounted(() => {
    themeStore.initialize()
})
</script>

<style scoped>
@keyframes spin-in {
    from {
        transform: rotate(-180deg) scale(0);
        opacity: 0;
    }

    to {
        transform: rotate(0deg) scale(1);
        opacity: 1;
    }
}

.animate-in {
    animation: spin-in 0.3s ease-out;
}
</style>