<template>
  <div class="relative" ref="buttonRef">
    <!-- Bell Icon with Badge -->
    <button
      class="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
      :aria-label="`${unreadCount} notifications`"
      @click="dropdownOpen = !dropdownOpen"
    >
      <UIcon name="i-heroicons-bell-20-solid" class="w-5 h-5" />

      <!-- Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1 -translate-y-1 bg-red-500 rounded-full"
      >
        {{ unreadCount > 9 ? "9+" : unreadCount }}
      </span>
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
        v-show="dropdownOpen"
        class="absolute right-0 mt-2 w-[480px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-xl z-[110] border border-gray-200 dark:border-gray-700"
      >
        <!-- Header -->
        <div
          class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <button
              class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              @click="dropdownOpen = false"
            >
              <UIcon
                name="i-heroicons-cog-6-tooth"
                class="w-5 h-5 text-gray-600 dark:text-gray-400"
              />
            </button>
          </div>
        </div>

        <!-- Notifications List -->
        <div
          class="max-h-[70vh] overflow-y-auto bg-white dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
        >
          <div
            v-if="notifications.length === 0"
            class="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
          >
            <UIcon
              name="i-heroicons-inbox-20-solid"
              class="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500"
            />
            <p class="text-sm font-medium">No notifications yet</p>
          </div>

          <button
            v-for="notification in notifications"
            :key="notification.id"
            class="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group/item relative"
            :class="{ 'bg-blue-50 dark:bg-blue-900/10': !notification.isRead }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex gap-3">
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <img
                  v-if="notification.avatar"
                  :src="notification.avatar"
                  :alt="notification.channel"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div
                  v-else
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="getNotificationIconClass(notification.type)"
                >
                  <UIcon
                    :name="getNotificationIcon(notification.type)"
                    class="w-5 h-5"
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight mb-1"
                >
                  <span v-if="notification.channel" class="font-medium">{{
                    notification.channel
                  }}</span>
                  {{ notification.channel ? " uploaded: " : ""
                  }}{{ notification.title }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatTime(notification.timestamp) }}
                </p>
              </div>

              <!-- Thumbnail -->
              <div v-if="notification.thumbnail" class="flex-shrink-0">
                <img
                  :src="notification.thumbnail"
                  alt="Thumbnail"
                  class="w-[120px] h-[68px] object-cover rounded"
                />
              </div>

              <!-- Unread Indicator -->
              <div
                v-if="!notification.isRead"
                class="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"
              />

              <!-- More Options -->
              <button
                class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover/item:opacity-100 transition-opacity self-start"
                @click.stop="removeNotification(notification.id)"
              >
                <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5" />
              </button>
            </div>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <div
      v-if="dropdownOpen"
      class="fixed inset-0 z-[105]"
      @click="dropdownOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, watch, onUnmounted } from "vue";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type:
    | "success"
    | "error"
    | "warning"
    | "info"
    | "project"
    | "approval"
    | "comment";
  timestamp: string;
  duration?: number;
  read?: boolean;
  action?: string;
  avatar?: string;
  thumbnail?: string;
  channel?: string;
  isRead?: boolean;
}

interface Props {
  notifications?: NotificationItem[];
}

const props = withDefaults(defineProps<Props>(), {
  notifications: () => [],
});

const emit = defineEmits<{
  "notification-click": [notification: NotificationItem];
  remove: [id: number];
  "clear-all": [];
}>();

const dropdownOpen = ref(false);
const buttonRef = ref<HTMLElement | null>(null);

// Lock body scroll when dropdown is open
watch(dropdownOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
});

// Clean up on unmount
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = "";
  }
});

// Debug: Log notifications when component receives them
watchEffect(() => {
  console.log(
    "🔔 NotificationBell received notifications:",
    props.notifications
  );
  console.log(
    "🔔 NotificationBell notifications count:",
    props.notifications.length
  );
});

const unreadCount = computed(() => {
  const count = props.notifications.filter((n) => !n.isRead).length;
  console.log("🔔 Unread count:", count);
  return count;
});

const getNotificationIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    success: "i-heroicons-check-circle-20-solid",
    error: "i-heroicons-exclamation-circle-20-solid",
    warning: "i-heroicons-exclamation-triangle-20-solid",
    info: "i-heroicons-information-circle-20-solid",
    project: "i-heroicons-document-20-solid",
    approval: "i-heroicons-check-badge-20-solid",
    comment: "i-heroicons-chat-bubble-left-20-solid",
  };
  return iconMap[type] || "i-heroicons-bell-20-solid";
};

const getNotificationIconClass = (type: string): string => {
  const classMap: Record<string, string> = {
    success:
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    error: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    warning:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    info: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    project:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    approval:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    comment:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  };
  return (
    classMap[type] ||
    "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
  );
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / (7 * 86400000));

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const handleNotificationClick = (notification: NotificationItem) => {
  emit("notification-click", notification);
  // Mark as read
  notification.isRead = true;
};

const removeNotification = (id: number) => {
  emit("remove", id);
};

const clearAllNotifications = () => {
  emit("clear-all");
};
</script>
