<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header Section -->
    <div
      class="py-16 bg-blue-600 dark:bg-slate-800 border-b border-blue-700/30 dark:border-slate-700"
    >
      <UContainer>
        <div class="space-y-2">
          <h1 class="text-4xl font-black text-white dark:text-white">
            My Submissions
          </h1>
          <p class="text-blue-100 dark:text-slate-300">
            Track all your project submissions and their status
          </p>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div
          v-for="stat in submissionStats"
          :key="stat.label"
          class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6"
        >
          <div class="flex items-center gap-3 mb-2">
            <UIcon :name="stat.icon" :class="stat.iconColor" class="w-6 h-6" />
            <h3 class="text-sm font-semibold text-gray-600 dark:text-slate-400">
              {{ stat.label }}
            </h3>
          </div>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ stat.value }}
          </p>
        </div>
      </div>

      <!-- Submissions List -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
      >
        <div class="p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            All Submissions
          </h2>
        </div>

        <!-- Submissions Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Project
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Submitted
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Grade
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
              <tr
                v-for="submission in submissions"
                :key="submission.id"
                class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div>
                    <p
                      class="text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      {{ submission.projectTitle }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ submission.category }}
                    </p>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                  {{ submission.submittedDate }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="getStatusBadgeClass(submission.status)"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full"
                      :class="getStatusDotClass(submission.status)"
                    ></span>
                    {{ submission.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    v-if="submission.grade"
                    class="text-sm font-semibold"
                    :class="getGradeColor(submission.grade)"
                  >
                    {{ submission.grade }}%
                  </span>
                  <span
                    v-else
                    class="text-sm text-gray-400 dark:text-slate-500"
                  >
                    Not graded
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <UButton
                      icon="i-heroicons-eye"
                      size="xs"
                      color="primary"
                      variant="ghost"
                      @click="viewSubmission(submission.id)"
                    />
                    <UButton
                      v-if="submission.feedback"
                      icon="i-heroicons-chat-bubble-left"
                      size="xs"
                      variant="ghost"
                      @click="viewFeedback(submission.id)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="submissions.length === 0" class="text-center py-12">
          <UIcon
            name="i-heroicons-inbox"
            class="w-16 h-16 text-gray-400 dark:text-slate-600 mx-auto mb-4"
          />
          <p class="text-gray-500 dark:text-slate-400 text-lg mb-4">
            No submissions yet
          </p>
          <ButtonsPresetButton
            preset="createProject"
            to="/projects/create"
            size="md"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Submission stats
const submissionStats = ref([
  {
    label: "Total Submissions",
    value: "12",
    icon: "i-heroicons-document-text",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    label: "Pending Review",
    value: "3",
    icon: "i-heroicons-clock",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    label: "Approved",
    value: "8",
    icon: "i-heroicons-check-circle",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    label: "Needs Revision",
    value: "1",
    icon: "i-heroicons-exclamation-circle",
    iconColor: "text-red-600 dark:text-red-400",
  },
]);

// Mock submissions data
const submissions = ref([
  {
    id: 1,
    projectTitle: "AI Chat Bot",
    category: "AI/ML",
    submittedDate: "Dec 15, 2025",
    status: "Approved",
    grade: 95,
    feedback: true,
  },
  {
    id: 2,
    projectTitle: "Mobile App",
    category: "Mobile Dev",
    submittedDate: "Dec 18, 2025",
    status: "Under Review",
    grade: null,
    feedback: false,
  },
  {
    id: 3,
    projectTitle: "Web Portfolio",
    category: "Web Dev",
    submittedDate: "Dec 20, 2025",
    status: "Needs Revision",
    grade: 72,
    feedback: true,
  },
  {
    id: 4,
    projectTitle: "Data Analysis Dashboard",
    category: "Data Science",
    submittedDate: "Dec 22, 2025",
    status: "Under Review",
    grade: null,
    feedback: false,
  },
]);

// Helper functions
const getStatusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    Approved:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "Under Review":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    "Needs Revision":
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    Rejected:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const getStatusDotClass = (status: string) => {
  const classes: Record<string, string> = {
    Approved: "bg-green-600 dark:bg-green-400",
    "Under Review": "bg-yellow-600 dark:bg-yellow-400",
    "Needs Revision": "bg-red-600 dark:bg-red-400",
    Rejected: "bg-gray-600 dark:bg-gray-400",
  };
  return classes[status] || "bg-gray-600";
};

const getGradeColor = (grade: number) => {
  if (grade >= 90) return "text-green-600 dark:text-green-400";
  if (grade >= 80) return "text-blue-600 dark:text-blue-400";
  if (grade >= 70) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

const viewSubmission = (id: number) => {
  router.push(`/student/submissions/${id}`);
};

const viewFeedback = (id: number) => {
  router.push(`/student/submissions/${id}#feedback`);
};

useHead({
  title: "My Submissions - GIC Student Portal",
  meta: [
    {
      name: "description",
      content: "Track your project submissions and grades",
    },
  ],
});
</script>
