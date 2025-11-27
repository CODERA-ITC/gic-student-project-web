<template>
  <nav
    class="sticky top-0 z-50 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
  >
    <div
      class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
    >
      <!-- Logo Section -->
      <NuxtLink to="/" class="flex items-center shrink-0">
        <NuxtImg
          src="/gic-logo.jpg"
          alt="GIC Student Portal"
          width="150"
          height="40"
          class="object-contain hover:opacity-80 transition-opacity duration-200"
        />
      </NuxtLink>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex items-center space-x-1 flex-1 mx-8">
        <NavLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          :label="item.label"
          :is-active="isActiveRoute(item.to)"
        />
      </div>

      <!-- Right Section: Theme Toggle & User Menu -->
      <div class="flex items-center gap-2">
        <!-- Theme Toggle -->
        <ThemeToggle />

        <!-- User Menu (Desktop) -->
        <div class="hidden md:block">
          <UserMenu
            :is-authenticated="isAuthenticated"
            :user="user"
            @logout="handleLogout"
          />
        </div>

        <!-- Search Icon -->
        <SearchBar
          :context="searchContext"
          @search="handleSearch"
          @clear="clearSearch"
        />
      </div>

      <!-- Mobile Menu Button -->
      <UButton
        icon="i-heroicons-bars-3-20-solid"
        color="gray"
        variant="ghost"
        size="md"
        class="lg:hidden text-neutral-700 dark:text-neutral-200"
        :ui="{ rounded: 'rounded-lg' }"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <template v-if="mobileMenuOpen">
          <UIcon
            name="i-heroicons-x-mark-20-solid"
            class="text-neutral-700 dark:text-neutral-200"
          />
        </template>
      </UButton>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 -translate-y-2"
      enter-to-class="transform opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 translate-y-0"
      leave-to-class="transform opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="lg:hidden border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 sm:px-6 lg:px-8"
      >
        <div
          class="border-t border-gray-200 dark:border-neutral-800 py-4 space-y-2"
        >
          <!-- Mobile Navigation Links -->
          <NavLink
            v-for="item in navigationItems"
            :key="item.to"
            :to="item.to"
            :label="item.label"
            :is-active="isActiveRoute(item.to)"
            mobile
            mobile-class="w-full px-4 py-3 rounded-lg"
            @click="mobileMenuOpen = false"
          />

          <!-- Divider -->
          <hr class="my-4 border-gray-200 dark:border-neutral-700" />

          <!-- Mobile User Actions -->
          <template v-if="isAuthenticated">
            <!-- Student Menu -->
            <template v-if="authStore.isStudent">
              <NuxtLink
                to="/student"
                class="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-chart-bar-square-20-solid" />
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/projects"
                class="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-folder-20-solid" />
                My Projects
              </NuxtLink>
            </template>

            <!-- Teacher Menu -->
            <template v-if="authStore.isTeacher">
              <NuxtLink
                to="/teacher"
                class="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-chart-bar-square-20-solid" />
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/teacher/submissions"
                class="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-inbox-stack-20-solid" />
                Review Submissions
              </NuxtLink>
            </template>

            <!-- Common Links -->
            <hr class="my-2 border-gray-200 dark:border-neutral-700" />
            <NuxtLink
              to="/profile"
              class="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200"
              @click="mobileMenuOpen = false"
            >
              <UIcon name="i-heroicons-cog-6-tooth-20-solid" />
              Settings
            </NuxtLink>
            <button
              class="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors"
              @click="handleLogout"
            >
              <UIcon name="i-heroicons-arrow-left-on-rectangle-20-solid" />
              Sign Out
            </button>
          </template>
          <template v-else>
            <ButtonsPresetButton
              preset="signin"
              to="/login"
              class="w-full"
              @click="mobileMenuOpen = false"
            />
          </template>
        </div>

        <div class="py-4 border-t border-gray-200 dark:border-neutral-800">
          <SearchBar
            :context="searchContext"
            @search="handleSearch"
            @clear="clearSearch"
          />
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import { useUiStore } from "~/stores/ui";

// State
const mobileMenuOpen = ref(false);

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUiStore();

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.currentUser);

// Dynamic search context based on current route
const searchContext = computed(() => {
  if (route.path.startsWith("/students")) {
    return "students";
  }
  return "projects"; // default to projects
});

// Navigation items
const navigationItems = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Students", to: "/students" },
  { label: "Semesters", to: "/semesters" },
  { label: "About", to: "/about" },
];

// Methods
const isActiveRoute = (path) => {
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(path);
};

const handleSearch = (query) => {
  if (query.trim()) {
    const searchPath =
      searchContext.value === "students" ? "/students" : "/projects";
    navigateTo(`${searchPath}?search=${encodeURIComponent(query)}`);
    mobileMenuOpen.value = false;
  }
};

const clearSearch = () => {
  // Clear handled by SearchBar component
};

const handleLogout = async () => {
  await authStore.logout();
  mobileMenuOpen.value = false;
  navigateTo("/");
};
</script>
