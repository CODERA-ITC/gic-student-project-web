<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <div class="py-14">
      <UContainer>
        <div
          class="relative overflow-hidden rounded-3xl border border-white/10 ring-1 ring-blue-500/15 bg-white/90 dark:bg-slate-900/90 shadow-2xl px-8 py-10">
          <div class="relative space-y-3">
            <nav class="flex items-center flex-wrap gap-1 text-sm text-slate-600 dark:text-slate-300">
              <NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors">Home</NuxtLink>
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <NuxtLink to="/admin/dashboard" class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                Admin Dashboard
              </NuxtLink>
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <span class="text-slate-900 dark:text-white font-semibold">Internal Student</span>
            </nav>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-identification" class="w-10 h-10 text-blue-500 dark:text-blue-300" />
              <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Internal Student
              </h1>
            </div>
            <p class="text-slate-700 dark:text-slate-300">
              Structure matches signup verification: <code>studentId</code>, <code>nameEn</code>, <code>nameKh</code>,
              <code>gender</code>, <code>dob</code>, <code>phoneNumber</code>, <code>group</code>.
            </p>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="pb-14 space-y-6">
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-4">
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div class="flex-1 relative">
            <UIcon name="i-heroicons-magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
            <input v-model="searchInput" type="text" placeholder="Search internal student..."
              class="w-full pl-10 pr-4 py-2 min-h-[44px] bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
          </div>
          <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="handleFileSelect" />
          <ButtonsPresetButton label="Import Student CSV" size="sm" color="primary" variant="outline"
            icon="i-heroicons-arrow-up-tray" :loading="uploading" :disabled="uploading" @click="triggerFileInput" />
          <ButtonsPresetButton label="Refresh" size="sm" color="primary" variant="outline" icon="i-heroicons-arrow-path"
            :loading="loading" @click="loadInternalStudents" />
        </div>
      </div>

      <div v-if="usingMockData"
        class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 text-sm text-amber-800 dark:text-amber-300">
        API returned empty data, showing 5 mock users.
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div v-if="loading" class="p-8 flex flex-col gap-3">
          <USkeleton class="h-5 w-1/3" />
          <USkeleton class="h-5 w-1/4" />
          <USkeleton class="h-5 w-full" />
          <USkeleton class="h-5 w-full" />
        </div>
        <div v-else-if="filteredStudents.length === 0"
          class="p-8 text-center text-sm text-gray-600 dark:text-slate-400">
          No internal students found.
        </div>
        <table v-else class="w-full text-sm">
          <thead class="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-400">
            <tr>
              <th class="px-4 py-3 text-left">Student</th>
              <th class="px-4 py-3 text-left">Student ID</th>
              <th class="px-4 py-3 text-left">Gender</th>
              <th class="px-4 py-3 text-left">DOB</th>
              <th class="px-4 py-3 text-left">Phone</th>
              <th class="px-4 py-3 text-left">Group</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
            <template v-for="student in pagedStudents" :key="getRowId(student)">
              <tr class="hover:bg-gray-50 dark:hover:bg-slate-700/40">
                <td class="px-4 py-3 text-gray-900 dark:text-white">
                  {{ getDisplayName(student) }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-slate-300">
                  {{ student.studentId || student.id || "—" }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-slate-300">
                  {{ student.gender || "—" }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-slate-300">
                  {{ student.dob || "—" }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-slate-300">
                  {{ student.phoneNumber || student.phone || "—" }}
                </td>
                <td class="px-4 py-3 text-gray-700 dark:text-slate-300">
                  {{ student.group || "—" }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex justify-end gap-2">
                    <ButtonsPresetButton label="" icon="i-heroicons-eye" size="sm" variant="ghost"
                      @click="toggleDetails(student)" />
                    <ButtonsPresetButton label="" icon="i-heroicons-pencil-square" size="sm" color="primary"
                      variant="ghost" @click="openEdit(student)" />
                    <ButtonsPresetButton label="" icon="i-heroicons-trash" size="sm" color="warning" variant="ghost"
                      @click="openDelete(student)" />
                  </div>
                </td>
              </tr>

              <tr v-if="expandedId === getRowId(student)" class="bg-gray-50/80 dark:bg-slate-900/50">
                <td colspan="7" class="px-4 py-4">
                  <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div class="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700">
                      <p class="text-gray-500 dark:text-slate-400">studentId</p>
                      <p class="text-gray-900 dark:text-white font-medium">{{ student.studentId || "—" }}</p>
                    </div>
                    <div class="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700">
                      <p class="text-gray-500 dark:text-slate-400">nameEn</p>
                      <p class="text-gray-900 dark:text-white font-medium">{{ student.nameEn || getDisplayName(student)
                        }}</p>
                    </div>
                    <div class="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700">
                      <p class="text-gray-500 dark:text-slate-400">nameKh</p>
                      <p class="text-gray-900 dark:text-white font-medium">{{ student.nameKh || "—" }}</p>
                    </div>
                    <div class="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700">
                      <p class="text-gray-500 dark:text-slate-400">gender</p>
                      <p class="text-gray-900 dark:text-white font-medium">{{ student.gender || "—" }}</p>
                    </div>
                    <div class="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700">
                      <p class="text-gray-500 dark:text-slate-400">dob</p>
                      <p class="text-gray-900 dark:text-white font-medium">{{ student.dob || "—" }}</p>
                    </div>
                    <div class="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700">
                      <p class="text-gray-500 dark:text-slate-400">phoneNumber</p>
                      <p class="text-gray-900 dark:text-white font-medium">{{ student.phoneNumber || student.phone ||
                        "—" }}</p>
                    </div>
                    <div class="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-200 dark:border-slate-700">
                      <p class="text-gray-500 dark:text-slate-400">group</p>
                      <p class="text-gray-900 dark:text-white font-medium">{{ student.group || "—" }}</p>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>

        <div class="flex items-center justify-between mt-4 px-4 pb-4" v-if="filteredStudents.length > pageSize">
          <span class="text-xs text-gray-500 dark:text-slate-400">
            Showing {{ (page - 1) * pageSize + 1 }} - {{ Math.min(page * pageSize, filteredStudents.length) }} of
            {{ filteredStudents.length }}
          </span>
          <div class="flex items-center gap-2">
            <ButtonsPresetButton label="" icon="i-heroicons-chevron-left" size="sm" variant="ghost"
              :disabled="page === 1" @click="page = page - 1" />
            <ButtonsPresetButton label="" icon="i-heroicons-chevron-right" size="sm" variant="ghost"
              :disabled="page >= lastPage" @click="page = page + 1" />
          </div>
        </div>
      </div>
    </UContainer>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal && editForm" class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showEditModal = false">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div
            class="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-slate-900 dark:text-white">Edit Internal Student</h3>
              <ButtonsPresetButton label="" icon="i-heroicons-x-mark" size="sm" variant="ghost"
                @click="showEditModal = false" />
            </div>

            <form class="grid grid-cols-1 sm:grid-cols-2 gap-4" @submit.prevent="saveEdit">
              <div>
                <label class="block text-sm mb-1 text-slate-700 dark:text-slate-300">Student ID</label>
                <input v-model="editForm.studentId" type="text"
                  class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm mb-1 text-slate-700 dark:text-slate-300">nameEn</label>
                <input v-model="editForm.nameEn" type="text"
                  class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm mb-1 text-slate-700 dark:text-slate-300">nameKh</label>
                <input v-model="editForm.nameKh" type="text"
                  class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm mb-1 text-slate-700 dark:text-slate-300">gender</label>
                <input v-model="editForm.gender" type="text"
                  class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm mb-1 text-slate-700 dark:text-slate-300">dob</label>
                <input v-model="editForm.dob" type="text" placeholder="dd/mm/yyyy"
                  class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm mb-1 text-slate-700 dark:text-slate-300">phoneNumber</label>
                <input v-model="editForm.phoneNumber" type="text"
                  class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label class="block text-sm mb-1 text-slate-700 dark:text-slate-300">group</label>
                <input v-model="editForm.group" type="text"
                  class="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
              </div>
              <div class="sm:col-span-2 flex justify-end gap-2 pt-2">
                <ButtonsPresetButton preset="cancel" size="sm" type="button" @click="showEditModal = false" />
                <ButtonsPresetButton label="Save" icon="i-heroicons-check" color="primary" size="sm" type="submit" />
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal && deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showDeleteModal = false">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">Delete Internal Student</h3>
            <p class="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Delete <strong>{{ getDisplayName(deleteTarget) }}</strong> ({{ deleteTarget.studentId || "—" }})?
            </p>
            <div class="flex justify-end gap-2">
              <ButtonsPresetButton preset="cancel" size="sm" @click="showDeleteModal = false" />
              <ButtonsPresetButton preset="delete" size="sm" label="Delete" @click="confirmDelete" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useAuthStore } from "~/stores/auth";
import { useStudentStore, type APIStudent } from "~/stores/students";

definePageMeta({
  middleware: ["auth", "admin"],
});

type InternalStudentRow = APIStudent & {
  studentId?: string;
  nameEn?: string;
  nameKh?: string;
  gender?: string;
  dob?: string;
  phoneNumber?: number | string;
  group?: string;
  isMock?: boolean;
};

const authStore = useAuthStore();
const studentStore = useStudentStore();
const toast = useToast();

const loading = computed(() => studentStore.loading);
const internalStudents = computed(
  () => (studentStore.apiStudents || []) as InternalStudentRow[],
);
const usingMockData = computed(() =>
  internalStudents.value.length > 0 &&
  internalStudents.value.every((item) => Boolean(item.isMock)),
);

const searchInput = ref("");
const searchQuery = ref("");
const page = ref(1);
const pageSize = 10;
const expandedId = ref<string | null>(null);
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const showEditModal = ref(false);
const showDeleteModal = ref(false);
const editForm = ref<InternalStudentRow | null>(null);
const deleteTarget = ref<InternalStudentRow | null>(null);

const filteredStudents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return internalStudents.value;

  return internalStudents.value.filter((student) => {
    const haystack = [
      student.studentId,
      student.firstName,
      student.lastName,
      student.nameEn,
      student.nameKh,
      student.gender,
      student.dob,
      String(student.phoneNumber || student.phone || ""),
      student.group,
      student.email,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
});

const lastPage = computed(() =>
  Math.max(1, Math.ceil(filteredStudents.value.length / pageSize)),
);

const pagedStudents = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredStudents.value.slice(start, start + pageSize);
});

watch(searchQuery, () => {
  page.value = 1;
});

const applyDebouncedSearch = useDebounceFn((value: string) => {
  searchQuery.value = value;
}, 350);

watch(searchInput, (value) => {
  applyDebouncedSearch(value);
});

watch(filteredStudents, () => {
  if (page.value > lastPage.value) page.value = lastPage.value;
});

const loadInternalStudents = async () => {
  studentStore.setSearchQuery("");
  await studentStore.loadInternalStudents(authStore.token);
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".csv")) {
    toast.add({
      title: "Invalid file",
      description: "Please choose a CSV file.",
      color: "warning",
    });
    return;
  }

  uploading.value = true;
  try {
    await studentStore.uploadStudentsCSV(file);
    toast.add({
      title: "Import complete",
      description: "Internal students imported successfully.",
      color: "success",
    });
    await loadInternalStudents();
  } catch (error) {
    console.error("CSV upload failed", error);
    toast.add({
      title: "Import failed",
      description: "Could not import student CSV.",
      color: "error",
    });
  } finally {
    uploading.value = false;
    if (fileInput.value) fileInput.value.value = "";
  }
};

const getDisplayName = (student: InternalStudentRow) => {
  const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim();
  return fullName || student.nameEn || student.nameKh || student.email || "Student";
};

const getRowId = (student: InternalStudentRow) =>
  String(student.id || student.studentId || "");

const toggleDetails = (student: InternalStudentRow) => {
  const id = getRowId(student);
  expandedId.value = expandedId.value === id ? null : id;
};

const openEdit = (student: InternalStudentRow) => {
  editForm.value = { ...student };
  showEditModal.value = true;
};

const saveEdit = () => {
  if (!editForm.value) return;
  const id = editForm.value.id;
  const idx = studentStore.apiStudents.findIndex((item) => item.id === id);
  if (idx >= 0) {
    studentStore.apiStudents[idx] = {
      ...studentStore.apiStudents[idx],
      ...editForm.value,
    };
  }
  showEditModal.value = false;
  toast.add({
    title: "Updated",
    description: "Internal student updated locally.",
    color: "success",
  });
};

const openDelete = (student: InternalStudentRow) => {
  deleteTarget.value = student;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  if (!deleteTarget.value) return;
  const targetId = deleteTarget.value.id;
  studentStore.apiStudents = studentStore.apiStudents.filter(
    (item) => item.id !== targetId,
  );
  if (expandedId.value === targetId) expandedId.value = null;
  deleteTarget.value = null;
  showDeleteModal.value = false;
  toast.add({
    title: "Deleted",
    description: "Internal student removed from the list.",
    color: "success",
  });
};

onMounted(async () => {
  await loadInternalStudents();
});
</script>
