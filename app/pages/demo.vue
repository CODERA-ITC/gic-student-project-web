<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Hero Section -->
    <div class="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-semibold mb-2">Notification & Auth Demo</h1>
        <p class="text-slate-300">
          Test the dynamic navbar and notification system
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Authentication Controls -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            Authentication
          </h2>
          <p class="text-gray-600 mb-6">
            Test logging in as different user roles to see how the navbar and
            menu change
          </p>

          <div class="space-y-4">
            <!-- Guest (Logout) -->
            <button
              class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              @click="loginAsGuest"
            >
              👤 Login as Guest
            </button>

            <!-- Student Login -->
            <button
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              @click="loginAsStudent"
            >
              🎓 Login as Student
            </button>

            <!-- Teacher Login -->
            <button
              class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              @click="loginAsTeacher"
            >
              👨‍🏫 Login as Teacher
            </button>

            <!-- Divider -->
            <div class="border-t border-gray-200 my-4"></div>

            <!-- Quick Links -->
            <div class="space-y-2">
              <p class="text-sm font-semibold text-gray-700 mb-3">
                Or try the auth pages:
              </p>
              <NuxtLink
                to="/login"
                class="block w-full px-4 py-2 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
              >
                📝 Go to Login Page
              </NuxtLink>
              <NuxtLink
                to="/signup"
                class="block w-full px-4 py-2 bg-green-500 text-white text-center rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
              >
                ✍️ Go to Signup Page
              </NuxtLink>
            </div>

            <!-- Demo Credentials -->
            <div
              class="bg-slate-100 border border-slate-300 rounded-lg p-4 mt-4"
            >
              <p class="text-xs font-semibold text-slate-700 mb-2 uppercase">
                Demo Credentials:
              </p>
              <div class="space-y-2 text-xs text-slate-600">
                <div>
                  <p class="font-semibold text-slate-700">Student:</p>
                  <p>📧 student@gic.edu</p>
                  <p>🔐 password</p>
                </div>
                <div>
                  <p class="font-semibold text-slate-700">Teacher:</p>
                  <p>📧 teacher@gic.edu</p>
                  <p>🔐 password</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Current User Info -->
          <div
            v-if="authStore.isAuthenticated"
            class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p class="text-sm text-gray-600 mb-2">
              <span class="font-semibold">Current User:</span>
            </p>
            <p class="text-lg font-medium text-gray-900">
              {{ authStore.currentUser?.name }}
            </p>
            <p class="text-sm text-gray-600">
              {{ authStore.currentUser?.email }}
            </p>
            <div class="mt-2 flex items-center gap-2">
              <span
                class="inline-block px-3 py-1 text-xs font-semibold rounded-full"
                :class="{
                  'bg-blue-100 text-blue-700': authStore.isStudent,
                  'bg-purple-100 text-purple-700': authStore.isTeacher,
                }"
              >
                {{ authStore.userRole?.toUpperCase() }}
              </span>
              <span
                v-if="authStore.currentUser?.program"
                class="text-xs text-gray-500"
              >
                {{ authStore.currentUser.program }}
              </span>
            </div>
          </div>
        </div>

        <!-- Notification Controls -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            Notifications
          </h2>
          <p class="text-gray-600 mb-6">
            Trigger different types of notifications to see them in the
            notification bell
          </p>

          <div class="space-y-4">
            <!-- Success -->
            <button
              class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
              @click="
                () =>
                  notify.notifySuccess(
                    'Success!',
                    'Operation completed successfully',
                  )
              "
            >
              ✓ Success Notification
            </button>

            <!-- Error -->
            <button
              class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
              @click="
                () =>
                  notify.notifyError(
                    'Error!',
                    'Something went wrong. Please try again.',
                  )
              "
            >
              ✗ Error Notification
            </button>

            <!-- Warning -->
            <button
              class="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm"
              @click="
                () =>
                  notify.notifyWarning(
                    'Warning!',
                    'Please review this important message',
                  )
              "
            >
              ⚠ Warning Notification
            </button>

            <!-- Info -->
            <button
              class="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm"
              @click="
                () =>
                  notify.notifyInfo('Info', 'Here is some useful information')
              "
            >
              ℹ Info Notification
            </button>
          </div>
        </div>

        <!-- Project Notifications (Student) -->
        <div
          v-if="authStore.isStudent"
          class="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            Project Notifications
          </h2>
          <p class="text-gray-600 mb-6">Available for students</p>

          <div class="space-y-4">
            <!-- Project Submitted -->
            <button
              class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              @click="() => notify.notifyProjectSubmitted('Web App Project')"
            >
              📤 Project Submitted
            </button>

            <!-- Project Approved -->
            <button
              class="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
              @click="() => notify.notifyProjectApproved('Web App Project')"
            >
              ✅ Project Approved
            </button>

            <!-- Project Rejected -->
            <button
              class="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
              @click="
                () =>
                  notify.notifyProjectRejected(
                    'Web App Project',
                    'Please fix the layout issues',
                  )
              "
            >
              🔄 Project Rejected
            </button>

            <!-- Comment Received -->
            <button
              class="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium text-sm"
              @click="
                () =>
                  notify.notifyProjectCommentReceived(
                    'Web App Project',
                    'Dr. Sarah',
                  )
              "
            >
              💬 Comment Received
            </button>
          </div>
        </div>

        <!-- Teacher Notifications (Teacher Only) -->
        <div
          v-if="authStore.isTeacher"
          class="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            Teacher Notifications
          </h2>
          <p class="text-gray-600 mb-6">Available for teachers</p>

          <div class="space-y-4">
            <!-- Student Submitted -->
            <button
              class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              @click="
                () =>
                  notify.notifyStudentSubmitted(
                    'Sarah Chen',
                    'AI Learning System',
                  )
              "
            >
              📥 Student Submitted
            </button>

            <!-- Feedback Received -->
            <button
              class="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm"
              @click="
                () =>
                  notify.notifyTeacherFeedback(
                    'Prof. Johnson',
                    'AI Learning System',
                  )
              "
            >
              💭 Feedback Received
            </button>
          </div>
        </div>

        <!-- Notification History -->
        <div class="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            Notification History
          </h2>
          <p class="text-gray-600 mb-6">
            Current notifications:
            <span class="font-semibold">{{
              uiStore.notifications.length
            }}</span>
          </p>

          <div
            v-if="uiStore.notifications.length === 0"
            class="text-center text-gray-500 py-8"
          >
            <p>No notifications yet</p>
          </div>

          <div v-else class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="notif in uiStore.notifications"
              :key="notif.id"
              class="p-4 border border-gray-200 rounded-lg flex items-start justify-between hover:bg-gray-50 transition-colors"
            >
              <div>
                <p class="font-medium text-gray-900">{{ notif.title }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ notif.message }}</p>
                <p class="text-xs text-gray-400 mt-2">
                  Type:
                  <span class="font-mono text-gray-500">{{ notif.type }}</span>
                </p>
              </div>
              <button
                class="text-gray-400 hover:text-gray-600 flex-shrink-0"
                @click="() => uiStore.removeNotification(notif.id)"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Box -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h3 class="text-lg font-semibold text-blue-900 mb-2">
          💡 How It Works
        </h3>
        <ul class="text-blue-800 text-sm space-y-2">
          <li>
            • <strong>Login:</strong> Click the role buttons above to simulate
            user login. The navbar will automatically update to show
            role-specific menu items.
          </li>
          <li>
            • <strong>Notifications:</strong> Click notification buttons to
            trigger different notification types. You'll see them appear in the
            bell icon at the top right of the navbar.
          </li>
          <li>
            • <strong>Check the Navbar:</strong> Look at the top navigation bar
            to see how it changes based on your login status and role.
          </li>
          <li>
            • <strong>Open User Menu:</strong> Click your profile/avatar in the
            navbar to see role-specific menu items.
          </li>
          <li>
            • <strong>Notification Bell:</strong> Click the bell icon to see all
            active notifications with timestamps and close options.
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useUiStore } from "~/stores/ui";
import { useNotifications } from "~/composables/useNotifications";

const authStore = useAuthStore();
const uiStore = useUiStore();
const notify = useNotifications();

// Login functions
const loginAsGuest = () => {
  authStore.logout();
};

const loginAsStudent = async () => {
  await authStore.login("student@gic.edu", "password");
};

const loginAsTeacher = async () => {
  await authStore.login("teacher@gic.edu", "password");
};
</script>
