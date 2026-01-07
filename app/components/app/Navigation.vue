<template>
  <nav
    class="sticky top-0 z-[100] bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 shadow-sm backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
  >
    <div
      class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
    >
      <!-- Logo Section -->
      <NuxtLink to="/" class="flex items-center shrink-0 space-x-2">
        <NuxtImg
          src="/images/itc-logo.png"
          alt="ITC Logo"
          width="auto"
          height="54"
          class="object-contain hover:opacity-80 transition-opacity duration-200 rounded-xs"
        />
        <div class="w-px h-12 bg-gray-300 dark:bg-neutral-700 mr-3"></div>
        <NuxtImg
          src="/images/gic-logo-small.png"
          alt="GIC Student Portal"
          width="auto"
          height="47"
          class="object-contain hover:opacity-80 transition-opacity duration-200 rounded-xs"
        />
      </NuxtLink>

      <!-- Desktop Navigation -->
      <div
        class="hidden lg:flex items-center justify-center space-x-1 flex-1 mx-8"
      >
        <NavLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          :label="item.label"
          :is-active="isActiveRoute(item.to)"
        />
      </div>

      <!-- Right Section: Language Switcher, Theme Toggle & User Menu -->
      <div class="flex items-center gap-2">
        <!-- Search Icon (Always Visible) -->
        <SearchBar
          :context="searchContext"
          @search="handleSearch"
          @clear="clearSearch"
        />

        <!-- Language Switcher (Desktop Only) -->
        <div class="lg:block">
          <LanguageToggle @switch-locale="switchLocale" />
        </div>

        <!-- Theme Toggle (Desktop Only) -->
        <div class="lg:block">
          <ThemeToggle />
        </div>

        <!-- User Menu (Desktop Only) -->
        <div class="hidden lg:block">
          <UserMenu
            :is-authenticated="isAuthenticated"
            :user="user"
            @logout="handleLogout"
          />
        </div>

        <!-- Mobile Menu Button -->
        <UButton
          :icon="
            mobileMenuOpen
              ? 'i-heroicons-x-mark-20-solid'
              : 'i-heroicons-bars-3-20-solid'
          "
          color="gray"
          variant="ghost"
          size="md"
          class="lg:hidden text-neutral-700 dark:text-neutral-200"
          :ui="{ rounded: 'rounded-lg' }"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </div>
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
        <!-- User Profile Section (Mobile - If Authenticated) -->
        <div
          v-if="isAuthenticated"
          class="py-4 border-b border-gray-200 dark:border-neutral-800"
        >
          <div class="flex items-center gap-3 px-4">
            <!-- Avatar -->
            <div
              v-if="user?.avatar"
              class="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 dark:border-slate-600"
            >
              <img
                :src="user.avatar"
                :alt="user.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center border-2 border-gray-300 dark:border-slate-600"
            >
              <span class="text-base font-semibold text-white">{{
                getInitials(user?.name || "User")
              }}</span>
            </div>
            <!-- User Info -->
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-semibold text-gray-900 dark:text-white truncate"
              >
                {{ user?.name || "User" }}
              </p>
              <p class="text-xs text-gray-500 dark:text-slate-400 truncate">
                {{ user?.email || "" }}
              </p>
              <span
                class="inline-block px-2 py-0.5 mt-1 text-xs font-semibold rounded-full"
                :class="getRoleBadgeClass(authStore.userRole || 'guest')"
              >
                {{ (authStore.userRole || "guest").toUpperCase() }}
              </span>
            </div>
          </div>
        </div>

        <div class="py-4 space-y-2">
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
                to="/student/dashboard"
                class="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-chart-bar-square-20-solid" />
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/student/my-projects"
                class="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-folder-20-solid" />
                My Projects
              </NuxtLink>
              <NuxtLink
                to="/student/favorites"
                class="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-heart-20-solid" />
                Favorites
              </NuxtLink>
            </template>

            <!-- Teacher Menu -->
            <template v-if="authStore.isTeacher">
              <NuxtLink
                to="/teacher/dashboard"
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
              <NuxtLink
                to="/teacher/favorites"
                class="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-200"
                @click="mobileMenuOpen = false"
              >
                <UIcon name="i-heroicons-heart-20-solid" />
                Favorites
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
              Profile Settings
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
              size="md"
              @click="mobileMenuOpen = false"
            />
          </template>
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

const { t, setLocale } = useI18n();

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
const navigationItems = computed(() => [
  { label: t("home"), to: "/" },
  { label: t("projects"), to: "/projects" },
  { label: t("students"), to: "/students" },
  { label: t("about"), to: "/about" },
]);

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

const switchLocale = (locale) => {
  setLocale(locale);
};

const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getRoleBadgeClass = (role) => {
  const classMap = {
    student: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    teacher:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    classMap[role] ||
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
  );
};
</script>
