<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <div class="py-14 relative overflow-hidden">
      <div
        class="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        class="absolute -bottom-32 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>

      <UContainer>
        <div
          class="relative overflow-hidden rounded-3xl border border-white/10 ring-1 ring-blue-500/15 bg-white/90 dark:bg-slate-900/90 shadow-2xl px-8 py-10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(79,70,229,0.08),transparent_30%)] pointer-events-none"
            aria-hidden="true"
          ></div>

          <div class="relative space-y-3">
            <nav
              class="flex items-center flex-wrap gap-1 text-sm text-slate-600 dark:text-slate-300"
            >
              <NuxtLink
                to="/"
                class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                >Home</NuxtLink
              >
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <NuxtLink
                to="/admin/dashboard"
                class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                Admin Dashboard
              </NuxtLink>
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <span class="text-slate-900 dark:text-white font-semibold">
                Course Management
              </span>
            </nav>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-book-open"
                class="w-10 h-10 text-blue-500 dark:text-blue-300"
              />
              <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Course Management
              </h1>
            </div>
            <p class="text-slate-700 dark:text-slate-300">
              Manage courses and assign teachers with drag-and-drop.
            </p>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="pb-14 space-y-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1 space-y-4">
          <div
            class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4"
          >
            <div class="flex items-center justify-between gap-3 mb-3">
              <div>
                <h2 class="text-base font-semibold text-gray-900 dark:text-white">
                  Teacher Pool
                </h2>
                <p class="text-xs text-gray-500 dark:text-slate-400">
                  Drag a teacher to a course to assign.
                </p>
              </div>
              <ButtonsPresetButton
                label="Refresh"
                size="sm"
                icon="i-heroicons-arrow-path"
                variant="ghost"
                :loading="teachersLoading"
                @click="loadTeachers"
              />
            </div>

            <div
              class="rounded-xl border-2 border-dashed p-3 mb-4 transition"
              :class="teacherRemoveZoneActive
                ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/20'
                : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/60'"
              @dragover.prevent="onTeacherPoolDragOver"
              @dragleave="onTeacherPoolDragLeave"
              @drop.prevent="onTeacherPoolDrop"
            >
              <div class="flex items-center gap-2 text-sm">
                <UIcon name="i-heroicons-trash" class="w-4 h-4 text-rose-500" />
                <span class="text-gray-700 dark:text-slate-300">
                  Drop assigned teacher here to remove from a course
                </span>
              </div>
            </div>

            <div class="relative mb-3">
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
              />
              <input
                v-model="teacherSearch"
                type="text"
                placeholder="Search teacher..."
                class="w-full pl-9 pr-3 py-2 rounded-3xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm text-gray-900 dark:text-white"
              />
            </div>

            <div v-if="teachersLoading" class="space-y-2">
              <USkeleton class="h-12 w-full" />
              <USkeleton class="h-12 w-full" />
              <USkeleton class="h-12 w-full" />
            </div>
            <div
              v-else-if="filteredTeachers.length === 0"
              class="text-sm text-gray-500 dark:text-slate-400 p-3 rounded-lg bg-gray-50 dark:bg-slate-900"
            >
              No teachers found.
            </div>
            <div v-else class="space-y-2 max-h-[560px] overflow-auto pr-1">
              <div
                v-for="teacher in filteredTeachers"
                :key="teacher.id"
                class="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/70 p-3 cursor-grab active:cursor-grabbing"
                draggable="true"
                @dragstart="onTeacherDragStart($event, { teacherId: teacher.id })"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shrink-0 overflow-hidden"
                  >
                    <img
                      v-if="teacher.avatar"
                      :src="teacher.avatar"
                      :alt="teacherDisplayName(teacher)"
                      class="w-full h-full object-cover"
                    />
                    <span v-else>{{ teacherDisplayName(teacher).charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {{ teacherDisplayName(teacher) }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-slate-400 truncate">
                      {{ teacher.email || '—' }}
                    </p>
                    <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      {{ teacher.courses?.length || 0 }} course{{ (teacher.courses?.length || 0) === 1 ? '' : 's' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
            <div class="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
              <div class="flex-1 relative">
                <UIcon
                  name="i-heroicons-magnifying-glass"
                  class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5"
                />
                <input
                  v-model="search"
                  type="text"
                  placeholder="Search courses by name or code..."
                  class="w-full pl-10 pr-4 py-2 min-h-[44px] bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  @keyup.enter="applyFilters"
                />
              </div>
              <div class="flex flex-wrap gap-2">
                <ButtonsPresetButton
                  label="Create Course"
                  color="primary"
                  variant="solid"
                  icon="i-heroicons-plus"
                  size="sm"
                  class="!bg-blue-900 !text-white hover:!bg-blue-800"
                  @click="openCreate"
                />
                <ButtonsPresetButton
                  label="Refresh"
                  color="primary"
                  variant="outline"
                  icon="i-heroicons-arrow-path"
                  size="sm"
                  class="!text-blue-900 !border-blue-900 hover:!bg-blue-50"
                  :loading="loading || teachersLoading"
                  @click="refreshAll"
                />
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
          >
            <div v-if="loading" class="p-8 flex flex-col gap-3">
              <USkeleton class="h-5 w-1/3" />
              <USkeleton class="h-5 w-full" />
              <USkeleton class="h-5 w-full" />
            </div>
            <div
              v-else-if="displayedItems.length === 0"
              class="p-8 text-center text-sm text-gray-600 dark:text-slate-400"
            >
              No courses found.
            </div>
            <div v-else class="divide-y divide-gray-200 dark:divide-slate-700">
              <div
                v-for="course in displayedItems"
                :key="course.id"
                class="p-4 transition"
                :class="dragOverCourseId === course.id ? 'bg-blue-50/70 dark:bg-blue-900/10' : ''"
                @dragover.prevent="onCourseDragOver(course.id)"
                @dragleave="onCourseDragLeave(course.id)"
                @drop.prevent="onCourseDrop(course.id, $event)"
              >
                <div class="flex flex-col xl:flex-row xl:items-start gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                        {{ course.name || '—' }}
                      </h3>
                      <UBadge
                        color="primary"
                        variant="soft"
                        class="!bg-blue-100 !text-blue-900 dark:!bg-blue-900/30 dark:!text-blue-300"
                      >
                        {{ course.code || 'No code' }}
                      </UBadge>
                      <UBadge color="neutral" variant="soft">
                        {{ getAssignedTeachers(course.id).length }} teacher{{ getAssignedTeachers(course.id).length === 1 ? '' : 's' }}
                      </UBadge>
                    </div>
                    <p
                      v-if="course.description"
                      class="text-sm text-gray-600 dark:text-slate-400 mt-1"
                    >
                      {{ course.description }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-slate-500 mt-1">
                      Created {{ formatDate(course.createdAt) }}
                    </p>
                  </div>

                  <div class="xl:w-[320px] w-full space-y-3">
                    <div class="flex justify-end gap-2">
                      <ButtonsPresetButton
                        label=""
                        icon="i-heroicons-pencil-square"
                        size="sm"
                        color="primary"
                        variant="ghost"
                        @click="openEdit(course)"
                      />
                      <ButtonsPresetButton
                        label=""
                        icon="i-heroicons-trash"
                        size="sm"
                        color="danger"
                        variant="ghost"
                        @click="openDelete(course)"
                      />
                    </div>

                    <div
                      class="rounded-xl border-2 border-dashed p-3 min-h-[88px] transition"
                      :class="dragOverCourseId === course.id
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/60'"
                    >
                      <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 mb-2">
                        <UIcon name="i-heroicons-hand-raised" class="w-4 h-4" />
                        Drop teacher here to assign
                      </div>

                      <div
                        v-if="getAssignedTeachers(course.id).length === 0"
                        class="text-xs text-gray-500 dark:text-slate-500"
                      >
                        No teachers assigned yet.
                      </div>

                      <div v-else class="flex flex-wrap gap-2">
                        <div
                          v-for="teacher in getAssignedTeachers(course.id)"
                          :key="`${course.id}-${teacher.id}`"
                          class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-xs"
                          draggable="true"
                          @dragstart="onTeacherDragStart($event, { teacherId: teacher.id, sourceCourseId: course.id })"
                        >
                          <span class="max-w-[140px] truncate text-gray-900 dark:text-white">
                            {{ teacherDisplayName(teacher) }}
                          </span>
                          <button
                            type="button"
                            class="text-rose-500 hover:text-rose-600"
                            title="Remove from course"
                            :disabled="assignmentLoading"
                            @click="removeTeacherFromCourse(course.id, teacher.id)"
                          >
                            <UIcon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p v-if="assignmentBusyCourseId === course.id" class="text-xs text-blue-600 dark:text-blue-300">
                      Updating teacher assignment...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-between mt-4 px-4 pb-4"
              v-if="filteredItems.length > pageSize"
            >
              <span class="text-xs text-gray-500 dark:text-slate-400">
                Showing {{ (page - 1) * pageSize + 1 }} -
                {{ Math.min(page * pageSize, filteredItems.length) }} of {{ filteredItems.length }}
              </span>
              <div class="flex items-center gap-2">
                <ButtonsPresetButton
                  label=""
                  icon="i-heroicons-chevron-left"
                  size="sm"
                  color="secondary"
                  variant="ghost"
                  :disabled="page === 1"
                  @click="changePage(page - 1)"
                />
                <ButtonsPresetButton
                  label=""
                  icon="i-heroicons-chevron-right"
                  size="sm"
                  color="secondary"
                  variant="ghost"
                  :disabled="page * pageSize >= filteredItems.length"
                  @click="changePage(page + 1)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showFormModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showFormModal = false"
        >
          <div class="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" />
          <div
            class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
          >
            <form class="p-6 space-y-5" @submit.prevent="saveItem">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ formMode === 'create' ? 'Create Course' : 'Update Course' }}
                </h3>
                <ButtonsPresetButton
                  label=""
                  icon="i-heroicons-x-mark"
                  color="secondary"
                  variant="ghost"
                  size="sm"
                  type="button"
                  @click="showFormModal = false"
                />
              </div>

              <FormSectionCard title="Basic Information">
                <UFormGroup label="Name" required>
                  <UInput
                    :ui="{ base: '!rounded-3xl !min-h-[44px]' }"
                    v-model="form.name"
                    placeholder="Enter course name"
                    required
                  />
                </UFormGroup>
                <UFormGroup label="Code" class="pt-2">
                  <UInput
                    :ui="{ base: '!rounded-3xl !min-h-[44px]' }"
                    v-model="form.code"
                    placeholder="Enter course code"
                  />
                </UFormGroup>
              </FormSectionCard>

              <FormSectionCard title="Description" subtitle="Optional details for better context">
                <UFormGroup label="Description">
                  <textarea
                    v-model="form.description"
                    rows="3"
                    class="w-full px-3 py-2 rounded-3xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional description"
                  />
                </UFormGroup>
              </FormSectionCard>

              <div class="flex justify-end gap-3 pt-2">
                <ButtonsPresetButton
                  label="Cancel"
                  variant="ghost"
                  color="secondary"
                  size="sm"
                  type="button"
                  @click="showFormModal = false"
                />
                <ButtonsPresetButton
                  :label="formMode === 'create' ? 'Create' : 'Update'"
                  color="primary"
                  size="sm"
                  type="submit"
                  :loading="saving"
                  :disabled="saving || !form.name.trim()"
                  class="!bg-blue-900 !text-white hover:!bg-blue-800"
                />
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :project-title="itemToDelete?.name || 'this course'"
      :is-deleting="deleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import DeleteConfirmationModal from "~/components/DeleteConfirmationModal.vue";
import FormSectionCard from "~/components/admin/FormSectionCard.vue";
import { useToast } from "#imports";
import { useAdminStore } from "~/stores/admin";
import type {
  CourseTeacherDragPayload,
  CourseTeacherItem,
} from "~/types/admin-course-management";
import {
  useProjectMetaStore,
  type ProjectMetaItem,
} from "~/stores/project-meta";

definePageMeta({
  middleware: ["auth", "admin"],
});

type EntityRow = ProjectMetaItem;

const toast = useToast();
const metaStore = useProjectMetaStore();
const adminStore = useAdminStore();
const { teachers: storeTeachers, loadingTeachers } = storeToRefs(adminStore);
const teachersLoading = loadingTeachers;

const saving = ref(false);
const deleting = ref(false);
const assignmentLoading = ref(false);
const assignmentBusyCourseId = ref<string | null>(null);

const search = ref("");
const teacherSearch = ref("");
const page = ref(1);
const pageSize = 20;

const loading = computed(() => metaStore.isLoading("courses"));
const items = computed(() => metaStore.getItems("courses"));

const teachers = computed<CourseTeacherItem[]>(
  () => (storeTeachers.value || []) as CourseTeacherItem[],
);

const showFormModal = ref(false);
const formMode = ref<"create" | "edit">("create");
const editingId = ref("");
const form = ref({
  name: "",
  code: "",
  description: "",
});

const showDeleteModal = ref(false);
const itemToDelete = ref<EntityRow | null>(null);

const dragOverCourseId = ref<string | null>(null);
const teacherRemoveZoneActive = ref(false);

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return items.value;
  return items.value.filter((item) => {
    return (
      (item.name || "").toLowerCase().includes(term) ||
      (item.code || "").toLowerCase().includes(term) ||
      (item.description || "").toLowerCase().includes(term)
    );
  });
});

const displayedItems = computed(() =>
  filteredItems.value.slice((page.value - 1) * pageSize, page.value * pageSize),
);

const filteredTeachers = computed(() => {
  const term = teacherSearch.value.trim().toLowerCase();
  if (!term) return teachers.value;
  return teachers.value.filter((teacher) => {
    const name = teacherDisplayName(teacher).toLowerCase();
    const email = (teacher.email || "").toLowerCase();
    return name.includes(term) || email.includes(term);
  });
});

const assignedTeachersByCourse = computed<Record<string, CourseTeacherItem[]>>(() => {
  const map: Record<string, CourseTeacherItem[]> = {};

  for (const teacher of teachers.value) {
    for (const course of teacher.courses || []) {
      if (!course?.id) continue;
      if (!map[course.id]) map[course.id] = [];
      map[course.id].push(teacher);
    }
  }

  return map;
});

onMounted(async () => {
  await refreshAll();
});

watch(search, () => {
  page.value = 1;
});

const teacherDisplayName = (teacher: CourseTeacherItem) => {
  const fullName = [teacher.firstName, teacher.lastName].filter(Boolean).join(" ").trim();
  return teacher.name || fullName || teacher.email || "Teacher";
};

const getAssignedTeachers = (courseId: string) => assignedTeachersByCourse.value[courseId] || [];

const parseTeacherDragData = (event: DragEvent): CourseTeacherDragPayload | null => {
  const raw = event.dataTransfer?.getData("application/json");
  if (!raw) return null;
  try {
    const payload = JSON.parse(raw);
    if (!payload?.teacherId) return null;
    return payload;
  } catch {
    return null;
  }
};

const onTeacherDragStart = (event: DragEvent, payload: CourseTeacherDragPayload) => {
  if (!event.dataTransfer) return;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("application/json", JSON.stringify(payload));
};

const onCourseDragOver = (courseId: string) => {
  dragOverCourseId.value = courseId;
};

const onCourseDragLeave = (courseId: string) => {
  if (dragOverCourseId.value === courseId) {
    dragOverCourseId.value = null;
  }
};

const onCourseDrop = async (courseId: string, event: DragEvent) => {
  dragOverCourseId.value = null;
  const payload = parseTeacherDragData(event);
  if (!payload?.teacherId) return;

  const alreadyAssigned = getAssignedTeachers(courseId).some(
    (teacher) => teacher.id === payload.teacherId,
  );

  if (alreadyAssigned) {
    toast.add({ title: "Teacher already assigned to this course", color: "warning" });
    return;
  }

  await assignTeacherToCourse(courseId, payload.teacherId);
};

const onTeacherPoolDragOver = () => {
  teacherRemoveZoneActive.value = true;
};

const onTeacherPoolDragLeave = () => {
  teacherRemoveZoneActive.value = false;
};

const onTeacherPoolDrop = async (event: DragEvent) => {
  teacherRemoveZoneActive.value = false;
  const payload = parseTeacherDragData(event);
  if (!payload?.teacherId || !payload.sourceCourseId) return;
  await removeTeacherFromCourse(payload.sourceCourseId, payload.teacherId);
};

const loadItems = async () => {
  try {
    await metaStore.fetchItems("courses");
    page.value = 1;
  } catch (error) {
    console.error("Failed to load courses", error);
    toast.add({ title: "Failed to load courses", color: "error" });
  }
};

const loadTeachers = async () => {
  try {
    await adminStore.fetchTeachersForCourseAssignments();
  } catch (error) {
    console.error("Failed to load teachers", error);
    toast.add({ title: "Failed to load teachers", color: "error" });
  }
};

const refreshAll = async () => {
  await Promise.all([loadItems(), loadTeachers()]);
};

const applyFilters = () => {
  page.value = 1;
};

const changePage = (next: number) => {
  if (next < 1) return;
  page.value = next;
};

const openCreate = () => {
  formMode.value = "create";
  editingId.value = "";
  form.value = { name: "", code: "", description: "" };
  showFormModal.value = true;
};

const openEdit = (item: EntityRow) => {
  formMode.value = "edit";
  editingId.value = item.id;
  form.value = {
    name: item.name || "",
    code: item.code || "",
    description: item.description || "",
  };
  showFormModal.value = true;
};

const buildBody = () => {
  const body: Record<string, string> = {
    name: form.value.name.trim(),
  };
  if (form.value.code.trim()) body.code = form.value.code.trim();
  if (form.value.description.trim()) body.description = form.value.description.trim();
  return body;
};

const saveItem = async () => {
  if (!form.value.name.trim()) return;
  saving.value = true;
  try {
    const body = buildBody();

    if (formMode.value === "create") {
      await metaStore.createItem("courses", body);
      toast.add({ title: "Course created", color: "success" });
    } else {
      await metaStore.updateItem("courses", editingId.value, body);
      toast.add({ title: "Course updated", color: "success" });
    }

    showFormModal.value = false;
    await loadItems();
  } catch (error) {
    console.error("Failed to save course", error);
    toast.add({ title: "Save course failed", color: "error" });
  } finally {
    saving.value = false;
  }
};

const openDelete = (item: EntityRow) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!itemToDelete.value?.id) return;
  deleting.value = true;
  try {
    await metaStore.deleteItem("courses", itemToDelete.value.id);
    toast.add({ title: "Course deleted", color: "success" });
    showDeleteModal.value = false;
    itemToDelete.value = null;
    await refreshAll();
  } catch (error) {
    console.error("Failed to delete course", error);
    toast.add({ title: "Delete course failed", color: "error" });
  } finally {
    deleting.value = false;
  }
};

const assignTeacherToCourse = async (courseId: string, teacherId: string) => {
  if (assignmentLoading.value) return;

  assignmentLoading.value = true;
  assignmentBusyCourseId.value = courseId;

  try {
    await adminStore.assignTeacherCourse(courseId, teacherId);

    toast.add({ title: "Teacher assigned to course", color: "success" });
    } catch (error) {
    console.error("Failed to assign teacher to course", error);
    toast.add({ title: "Assign teacher failed", color: "error" });
  } finally {
    assignmentLoading.value = false;
    assignmentBusyCourseId.value = null;
  }
};

const removeTeacherFromCourse = async (courseId: string, teacherId: string) => {
  if (assignmentLoading.value) return;

  assignmentLoading.value = true;
  assignmentBusyCourseId.value = courseId;

  try {
    await adminStore.removeTeacherCourse(courseId, teacherId);

    toast.add({ title: "Teacher removed from course", color: "success" });
    } catch (error) {
    console.error("Failed to remove teacher from course", error);
    toast.add({ title: "Remove teacher failed", color: "error" });
  } finally {
    assignmentLoading.value = false;
    assignmentBusyCourseId.value = null;
    teacherRemoveZoneActive.value = false;
  }
};

const formatDate = (date: string | undefined) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
