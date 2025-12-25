<template>
  <div class="flex items-center gap-4">
    <!-- Loading State -->
    <div v-if="authStore.isLoading" class="flex items-center gap-2 px-3 py-2">
      <div
        class="w-6 h-6 border-2 border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Authenticated User Section -->
    <template v-else-if="isAuthenticated">
      <!-- Notifications Bell -->
      <NotificationBell
        :notifications="notifications as any"
        @notification-click="handleNotificationClick"
        @remove="handleRemoveNotification"
        @clear-all="handleClearNotifications"
      />

      <!-- Authenticated User Dropdown -->
      <div class="relative">
        <!-- User Button -->
        <button
          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
          @click="menuOpen = !menuOpen"
        >
          <!-- Avatar -->
          <div
            v-if="user.avatar"
            class="w-8 h-8 rounded-full overflow-hidden border border-gray-300 dark:border-slate-600"
          >
            <img
              :src="user.avatar"
              :alt="user.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-700 flex items-center justify-center border border-gray-300 dark:border-slate-600"
          >
            <span class="text-xs font-semibold text-white">{{
              getInitials(user.name)
            }}</span>
          </div>
          <!-- Name and Role Badge -->
          <div class="hidden sm:block text-left">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ user.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-slate-300 capitalize">
              {{ userRole }}
            </p>
          </div>
          <UIcon
            name="i-heroicons-chevron-down-20-solid"
            class="w-4 h-4 text-gray-600 dark:text-slate-300"
          />
        </button>

        <!-- Dropdown Menu -->
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-show="menuOpen"
            class="absolute right-0 mt-2 w-64 sm:w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 max-h-[calc(100vh-100px)] overflow-y-auto"
          >
            <!-- User Info Header -->
            <div
              class="px-4 py-3 border-b border-gray-200 dark:border-slate-700"
            >
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ user.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-slate-400">
                {{ user.email }}
              </p>
              <div class="mt-2 flex items-center gap-2 flex-wrap">
                <span
                  class="inline-block px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getRoleBadgeClass(userRole)"
                >
                  {{ userRole.toUpperCase() }}
                </span>
                <span
                  v-if="user.program"
                  class="text-xs text-gray-500 dark:text-slate-400"
                >
                  {{ user.program }}
                </span>
              </div>
            </div>

            <!-- Divider -->
            <hr class="border-gray-200 dark:border-slate-700" />

            <!-- Student Menu Items -->
            <template v-if="isStudent">
              <NuxtLink
                to="/student/dashboard"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                @click="closeMenu"
              >
                <UIcon
                  name="i-heroicons-chart-bar-square-20-solid"
                  class="w-4 h-4"
                />
                My Dashboard
              </NuxtLink>
              <NuxtLink
                to="/student/my-projects"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                @click="closeMenu"
              >
                <UIcon name="i-heroicons-folder-20-solid" class="w-4 h-4" />
                My Projects
              </NuxtLink>
              <NuxtLink
                to="/student/submissions"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                @click="closeMenu"
              >
                <UIcon name="i-heroicons-inbox-20-solid" class="w-4 h-4" />
                Submissions
              </NuxtLink>

              <NuxtLink
                to="/student/favorites"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                @click="closeMenu"
              >
                <UIcon name="i-heroicons-heart-20-solid" class="w-4 h-4" />
                Favorites
              </NuxtLink>
            </template>

            <!-- Teacher Menu Items -->
            <template v-if="isTeacher || isAdmin">
              <NuxtLink
                to="/teacher/dashboard"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                @click="closeMenu"
              >
                <UIcon
                  name="i-heroicons-chart-bar-square-20-solid"
                  class="w-4 h-4"
                />
                Teacher Dashboard
              </NuxtLink>
              <NuxtLink
                to="/teacher/manage-projects"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                @click="closeMenu"
              >
                <UIcon
                  name="i-heroicons-document-check-20-solid"
                  class="w-4 h-4"
                />
                Manage Projects
              </NuxtLink>
              <NuxtLink
                to="/teacher/submissions"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                @click="closeMenu"
              >
                <UIcon
                  name="i-heroicons-inbox-stack-20-solid"
                  class="w-4 h-4"
                />
                Review Submissions
              </NuxtLink>
              <NuxtLink
                to="/teacher/favorites"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                @click="closeMenu"
              >
                <UIcon name="i-heroicons-heart-20-solid" class="w-4 h-4" />
                Favorites
              </NuxtLink>
            </template>

            <!-- Common Menu Items -->
            <hr class="border-gray-200 dark:border-slate-700" />
            <NuxtLink
              to="/profile"
              class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              @click="closeMenu"
            >
              <UIcon name="i-heroicons-user-circle-20-solid" class="w-4 h-4" />
              Profile Settings
            </NuxtLink>

            <!-- Sign Out -->
            <hr class="border-gray-200 dark:border-slate-700" />
            <button
              class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              @click="handleLogout"
            >
              <UIcon
                name="i-heroicons-arrow-left-on-rectangle-20-solid"
                class="w-4 h-4"
              />
              Sign Out
            </button>
          </div>
        </Transition>

        <!-- Backdrop -->
        <div v-if="menuOpen" class="fixed inset-0 z-40" @click="closeMenu" />
      </div>
    </template>

    <!-- Guest Sign In/Up -->
    <template v-else>
      <div class="flex items-center gap-3 relative z-50">
        <ButtonsPresetButton preset="signin" to="/login" size="sm" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useUiStore } from "~/stores/ui";
import type { Notification } from "~/stores/ui";

const props = defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: () => ({
      name: "User",
      email: "user@example.com",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    }),
  },
});

const emit = defineEmits(["logout"]);

const authStore = useAuthStore();
const uiStore = useUiStore();

const menuOpen = ref(false);

const userRole = computed(() => authStore.userRole || "guest");
const isStudent = computed(() => authStore.isStudent);
const isAdmin = computed(() => authStore.isAdmin);
const isTeacher = computed(() => authStore.isTeacher);
const notifications = computed(() => uiStore.notifications || []);

const getRoleBadgeClass = (role: string): string => {
  const classMap: Record<string, string> = {
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

const getInitials = (name: string): string => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const closeMenu = () => {
  menuOpen.value = false;
};

const handleLogout = () => {
  emit("logout");
  closeMenu();
};

const handleNotificationClick = (notification: Notification) => {
  console.log("Notification clicked:", notification);
};

const handleRemoveNotification = (id: number) => {
  uiStore.removeNotification(id);
};

const handleClearNotifications = () => {
  uiStore.notifications.forEach((n) => {
    uiStore.removeNotification(n.id);
  });
};
</script>
