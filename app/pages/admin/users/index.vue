<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Hero -->
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
                User Management
              </span>
            </nav>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-users"
                class="w-10 h-10 text-blue-500 dark:text-blue-300"
              />
              <h1
                class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white"
              >
                User Management
              </h1>
            </div>
            <p class="text-slate-700 dark:text-slate-300">
              Manage teachers and students, reset access, and assign roles.
            </p>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Body -->
    <UContainer class="pb-14 space-y-8">
      <!-- KPI cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          v-for="kpi in kpis"
          :key="kpi.label"
          class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div
                class="w-11 h-11 rounded-lg flex items-center justify-center"
                :class="kpi.iconBg"
              >
                <UIcon
                  :name="kpi.icon"
                  class="w-5 h-5"
                  :class="kpi.iconColor"
                />
              </div>
              <span class="text-sm text-gray-600 dark:text-slate-400">{{
                kpi.label
              }}</span>
            </div>
            <!-- <UBadge color="neutral" variant="soft" size="xs">Live</UBadge> -->
          </div>
          <p class="text-3xl font-semibold text-gray-900 dark:text-white">
            <span v-if="!loading">{{ kpi.value }}</span>
            <USkeleton v-else class="h-7 w-16" />
          </p>
          <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {{ kpi.caption }}
          </p>
        </div>
      </div>

      <!-- Filters & Actions -->
      <div
        class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4"
      >
        <div
          class="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center"
        >
          <div class="flex-1 relative">
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5"
            />
            <input
              v-model="search"
              type="text"
              placeholder="Search by name or email..."
              class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              @keyup.enter="applyFilters"
            />
          </div>
          <USelect
            v-model="selectedRole"
            :items="roleOptions"
            class="w-full sm:w-52"
            placeholder="Filter by role"
            @change="applyFilters"
          />
          <div class="flex flex-wrap gap-2">
          <UButton
            color="primary"
            variant="solid"
            icon="i-heroicons-plus"
            class="!bg-blue-900 !text-white hover:!bg-blue-800"
            @click="openCreateUser"
          >
              Create User
            </UButton>
            <input
              ref="fileInput"
              type="file"
              accept=".csv"
              class="hidden"
              @change="handleFileSelect"
            />
            <UButton
              color="primary"
              variant="outline"
              icon="i-heroicons-arrow-up-tray"
              class="!text-blue-900 !border-blue-900 hover:!bg-blue-50"
              :loading="uploading"
              :disabled="uploading"
              @click="triggerFileInput"
            >
              Import CSV
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              icon="i-heroicons-arrow-down-tray"
              @click="exportUsers"
            >
              Export
            </UButton>
            <UButton
              color="primary"
              variant="outline"
              icon="i-heroicons-arrow-path"
              class="!text-blue-900 !border-blue-900 hover:!bg-blue-50"
              :loading="loadingUsers"
              @click="applyFilters"
            >
              Refresh
            </UButton>
          </div>
        </div>
      </div>

      <!-- Users table -->
      <div
        class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
      >
        <div v-if="loadingUsers" class="p-8 flex flex-col gap-3">
          <USkeleton class="h-5 w-1/3" />
          <USkeleton class="h-5 w-1/4" />
          <USkeleton class="h-5 w-full" />
          <USkeleton class="h-5 w-full" />
        </div>
        <div
          v-else-if="filteredUsers.length === 0"
          class="p-8 text-center text-sm text-gray-600 dark:text-slate-400"
        >
          No users found.
        </div>
        <table v-else class="w-full text-sm">
          <thead
            class="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-400"
          >
            <tr>
              <th class="px-4 py-3 text-left">User</th>
              <th class="px-4 py-3 text-left">Role</th>
              <th class="px-4 py-3 text-left">Department</th>
              <th class="px-4 py-3 text-left">Joined</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
            <tr
              v-for="user in displayedUsers"
              :key="user.id"
              class="hover:bg-gray-50 dark:hover:bg-slate-700/40"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full overflow-hidden bg-blue-600 dark:bg-blue-700 flex items-center justify-center text-white text-sm font-semibold"
                  >
                    <img
                      v-if="user.avatar"
                      :src="user.avatar"
                      :alt="user.name || user.email"
                      class="w-full h-full object-cover"
                    />
                    <span v-else>{{
                      (user.name || user.email || "U").charAt(0).toUpperCase()
                    }}</span>
                  </div>
                  <div class="min-w-0">
                    <p
                      class="text-sm font-semibold text-gray-900 dark:text-white truncate"
                    >
                      {{
                        user.name ||
                        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                        "—"
                      }}
                    </p>
                    <p
                      class="text-xs text-gray-500 dark:text-slate-400 truncate"
                    >
                      {{ user.email }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <UBadge
                  :color="user.role === 'TEACHER' ? 'secondary' : 'neutral'"
                  variant="soft"
                  :class="
                    user.role === 'ADMIN'
                      ? '!bg-blue-100 !text-blue-900 dark:!bg-blue-900/30 dark:!text-blue-300'
                      : ''
                  "
                >
                  {{ user.role || "STUDENT" }}
                </UBadge>
              </td>
              <td class="px-4 py-3 text-gray-700 dark:text-slate-300">
                {{ user.department?.name || user.department || "—" }}
              </td>
              <td class="px-4 py-3 text-gray-700 dark:text-slate-300">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <UButton
                    icon="i-heroicons-eye"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    @click="viewUser(user)"
                  />
                  <UButton
                    icon="i-heroicons-pencil-square"
                    size="xs"
                    color="primary"
                    variant="ghost"
                    class="!text-blue-900 hover:!bg-blue-50 dark:!text-blue-300 dark:hover:!bg-blue-900/20"
                    @click="editUser(user)"
                  />
                  <UButton
                    icon="i-heroicons-key"
                    size="xs"
                    color="warning"
                    variant="ghost"
                    title="Reset password"
                    @click="openResetPasswordModal(user)"
                  />
                  <UButton
                    icon="i-heroicons-trash"
                    size="xs"
                    color="error"
                    variant="ghost"
                    @click="deleteUser(user)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          class="flex items-center justify-between mt-4"
          v-if="total > pageSize"
        >
          <span class="text-xs text-gray-500 dark:text-slate-400">
            Showing {{ (page - 1) * pageSize + 1 }} -
            {{ Math.min(page * pageSize, total) }} of {{ total }}
          </span>
          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-chevron-left"
              size="xs"
              variant="ghost"
              :disabled="page === 1"
              @click="changePage(page - 1)"
            />
            <UButton
              icon="i-heroicons-chevron-right"
              size="xs"
              variant="ghost"
              :disabled="page * pageSize >= total"
              @click="changePage(page + 1)"
            />
          </div>
        </div>
      </div>
    </UContainer>

    <!-- Create / Edit User Modal -->
    <UserFormModal
      v-model="showCreateModal"
      :user="formUser"
      :mode="formMode"
      :loading="creating"
      @submit="handleCreateSubmit"
    />

    <!-- View User Modal (Teleport) -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showUserModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showUserModal = false"
        >
          <div class="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" />
          <div
            class="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
          >
            <div class="p-6 space-y-4" v-if="selectedUser">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <img
                    :src="
                      selectedUser.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name || selectedUser.email || 'User')}&background=0D8ABC&color=fff`
                    "
                    alt="avatar"
                    class="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100 dark:ring-slate-700"
                  />
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                      {{ selectedUser.name || selectedUser.email }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-slate-400">
                      {{ selectedUser.email }}
                    </p>
                  </div>
                </div>
                <UBadge
                  variant="soft"
                  class="!bg-blue-100 !text-blue-900 dark:!bg-blue-900/30 dark:!text-blue-300"
                >
                  {{ (selectedUser.role || "STUDENT").toUpperCase() }}
                </UBadge>
              </div>

              <div class="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500 dark:text-slate-400">Phone</p>
                  <p class="text-gray-900 dark:text-white">
                    {{ selectedUser.phone || "—" }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-slate-400">Department</p>
                  <p class="text-gray-900 dark:text-white">
                    {{ selectedUser.department?.name || selectedUser.department || "—" }}
                  </p>
                </div>
                <div v-if="selectedUser.bio">
                  <p class="text-gray-500 dark:text-slate-400">Bio</p>
                  <p class="text-gray-900 dark:text-white">
                    {{ selectedUser.bio }}
                  </p>
                </div>
                <div v-if="selectedUser.studentId || selectedUser.teacherId || selectedUser.adminId">
                  <p class="text-gray-500 dark:text-slate-400">Identifier</p>
                  <p class="text-gray-900 dark:text-white">
                    {{
                      selectedUser.studentId ||
                      selectedUser.teacherId ||
                      selectedUser.adminId
                    }}
                  </p>
                </div>
                <div v-if="selectedUser.program || selectedUser.position">
                  <p class="text-gray-500 dark:text-slate-400">Program / Position</p>
                  <p class="text-gray-900 dark:text-white">
                    {{ selectedUser.program || selectedUser.position }}
                  </p>
                </div>
                <div v-if="selectedUser.year || selectedUser.gen">
                  <p class="text-gray-500 dark:text-slate-400">Year / Gen</p>
                  <p class="text-gray-900 dark:text-white">
                    {{ selectedUser.year ? `Year ${selectedUser.year}` : "" }}
                    {{ selectedUser.gen ? `Gen ${selectedUser.gen}` : "" }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-slate-400">Joined</p>
                  <p class="text-gray-900 dark:text-white">
                    {{ formatDate(selectedUser.createdAt) }}
                  </p>
                </div>
              </div>

              <div v-if="selectedUser.skills?.length" class="space-y-2">
                <p class="text-gray-500 dark:text-slate-400 text-sm">Skills</p>
                <div class="flex flex-wrap gap-2">
                  <UBadge
                    v-for="skill in selectedUser.skills"
                    :key="skill"
                    color="neutral"
                    variant="soft"
                  >
                    {{ skill }}
                  </UBadge>
                </div>
              </div>

              <div
                v-if="selectedUser.socialLinks && hasSocialLinks(selectedUser.socialLinks)"
                class="space-y-2"
              >
                <p class="text-gray-500 dark:text-slate-400 text-sm">Social Links</p>
                <div class="flex flex-wrap gap-2">
                  <NuxtLink
                    v-if="selectedUser.socialLinks.github"
                    :href="selectedUser.socialLinks.github"
                    target="_blank"
                    rel="noopener"
                    class="text-blue-600 dark:text-blue-300 text-sm underline"
                  >
                    GitHub
                  </NuxtLink>
                  <NuxtLink
                    v-if="selectedUser.socialLinks.linkedin"
                    :href="selectedUser.socialLinks.linkedin"
                    target="_blank"
                    rel="noopener"
                    class="text-blue-600 dark:text-blue-300 text-sm underline"
                  >
                    LinkedIn
                  </NuxtLink>
                  <NuxtLink
                    v-if="selectedUser.socialLinks.twitter"
                    :href="selectedUser.socialLinks.twitter"
                    target="_blank"
                    rel="noopener"
                    class="text-blue-600 dark:text-blue-300 text-sm underline"
                  >
                    Twitter
                  </NuxtLink>
                  <NuxtLink
                    v-if="selectedUser.socialLinks.portfolio"
                    :href="selectedUser.socialLinks.portfolio"
                    target="_blank"
                    rel="noopener"
                    class="text-blue-600 dark:text-blue-300 text-sm underline"
                  >
                    Portfolio
                  </NuxtLink>
                </div>
              </div>

              <div class="flex justify-end">
                <UButton variant="ghost" color="neutral" @click="showUserModal = false">
                  Close
                </UButton>
              </div>
            </div>
            <div v-else class="p-6">
              <USkeleton class="h-6 w-32 mb-3" />
              <USkeleton class="h-4 w-full" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete confirmation -->
    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :project-title="userToDelete?.email || 'this user'"
      :is-deleting="deleting"
      @confirm="confirmDelete"
    />

    <!-- Reset Password Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showResetPasswordModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closeResetPasswordModal"
        >
          <div class="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" />
          <div
            class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
          >
            <form class="p-6 space-y-4" @submit.prevent="submitResetPassword">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Reset Password
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-slate-400">
                    {{ resetPasswordTarget?.email || "Selected user" }}
                  </p>
                </div>
                <UButton
                  icon="i-heroicons-x-mark"
                  color="neutral"
                  variant="ghost"
                  type="button"
                  @click="closeResetPasswordModal"
                />
              </div>

              <UFormGroup label="New Password" required>
                <UInput
                  v-model="resetPasswordValue"
                  type="text"
                  autocomplete="off"
                  placeholder="Enter new password"
                  required
                />
                <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Minimum 8 characters.
                </p>
              </UFormGroup>

              <div class="flex flex-wrap gap-2">
                <UButton
                  type="button"
                  color="primary"
                  variant="outline"
                  icon="i-heroicons-sparkles"
                  class="!text-blue-900 !border-blue-900 hover:!bg-blue-50"
                  @click="generatePassword"
                >
                  Auto Generate (8)
                </UButton>
                <UButton
                  type="button"
                  color="neutral"
                  variant="outline"
                  icon="i-heroicons-clipboard-document"
                  :disabled="!resetPasswordValue"
                  @click="copyGeneratedPassword"
                >
                  Copy
                </UButton>
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <UButton
                  type="button"
                  variant="ghost"
                  color="neutral"
                  @click="closeResetPasswordModal"
                >
                  Cancel
                </UButton>
                <UButton
                  color="warning"
                  type="submit"
                  icon="i-heroicons-key"
                  :loading="resettingPassword"
                  :disabled="resettingPassword || resetPasswordValue.trim().length < 8"
                >
                  Reset Password
                </UButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { authService } from "~/services/AuthService";
import { useStudentStore } from "~/stores/students";
import { useAdminStore } from "~/stores/admin";
import { storeToRefs } from "pinia";
import { useToast } from "#imports";
import DeleteConfirmationModal from "~/components/DeleteConfirmationModal.vue";
import UserFormModal from "~/components/UserFormModal.vue";

definePageMeta({
  middleware: ["auth", "admin"],
});

const loading = ref(true);
const studentsStore = useStudentStore();
const adminStore = useAdminStore();
const { counts, loadingCounts, loadingUsers, users } = storeToRefs(adminStore);
const toast = useToast();
const search = ref("");
const selectedRole = ref("ALL");
const roleOptions = ["ALL", "STUDENT", "TEACHER", "ADMIN"];
const page = ref(1);
const pageSize = 20;
const total = ref(0);
const showUserModal = ref(false);
const userModalLoading = ref(false);
const selectedUser = ref<any | null>(null);
const showCreateModal = ref(false);
const formMode = ref<"create" | "edit">("create");
const formUser = ref<any | null>(null);
const creating = ref(false);
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const showDeleteModal = ref(false);
const deleting = ref(false);
const userToDelete = ref<any | null>(null);
const showResetPasswordModal = ref(false);
const resettingPassword = ref(false);
const resetPasswordTarget = ref<any | null>(null);
const resetPasswordValue = ref("");
const isCreateDisabled = computed(
  () => !newUser.value.name.trim() || !newUser.value.email.trim(),
);
const newUser = ref({
  name: "",
  email: "",
  role: "STUDENT",
  phone: "",
  departmentId: "",
  password: "",
});
const filteredUsers = computed(() => {
  const role = selectedRole.value;
  const term = search.value.trim().toLowerCase();
  return (users.value || [])
    .filter((u) =>
      role === "ALL" ? true : (u.role || "STUDENT").toUpperCase() === role,
    )
    .filter((u) => {
      if (!term) return true;
      const name =
        `${u.name || ""} ${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      return (
        name.includes(term) || (u.email || "").toLowerCase().includes(term)
      );
    });
});
const displayedUsers = computed(() =>
  filteredUsers.value.slice((page.value - 1) * pageSize, page.value * pageSize),
);

const kpis = computed(() => [
  {
    label: "All Users",
    value: counts.value.totalUsers,
    caption: "Admins, teachers, students",
    icon: "i-heroicons-user-group",
    iconBg: "bg-blue-50 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-300",
  },
  {
    label: "Students",
    value: counts.value.totalStudents,
    caption: "Registered students",
    icon: "i-heroicons-academic-cap",
    iconBg: "bg-blue-50 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-300",
  },
  {
    label: "Teachers",
    value: counts.value.totalTeachers,
    caption: "Registered teachers",
    icon: "i-heroicons-briefcase",
    iconBg: "bg-amber-50 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-300",
  },
]);

onMounted(async () => {
  try {
    loading.value = true;
    const accessToken = authService.getAccessToken() || "";

    // Keep student store hydrated for other views
    await studentsStore.loadStudents(accessToken);

    await adminStore.fetchCounts();
    await fetchUsers();
  } catch (error) {
    console.error("Failed to load admin user KPIs", error);
  } finally {
    loading.value = false;
  }
});

const fetchUsers = async () => {
  await adminStore.fetchUsers({
    search: search.value.trim() || undefined,
    role: selectedRole.value !== "ALL" ? selectedRole.value : undefined,
    page: page.value,
    limit: pageSize,
  });
  total.value = adminStore.usersTotal || users.value?.length || 0;
};

const applyFilters = async () => {
  page.value = 1;
  await fetchUsers();
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
};

const editUser = async (user) => {
  try {
    const newRole = window
      .prompt("Set role (STUDENT/TEACHER/ADMIN):", user.role)
      ?.trim()
      .toUpperCase();
    if (!newRole) return;
    if (!["STUDENT", "TEACHER", "ADMIN"].includes(newRole)) {
      toast.add({ title: "Invalid role", color: "warning" });
      return;
    }

    await adminStore.updateUserRole(user.id, newRole);
    toast.add({ title: "Role updated", color: "success" });
    await fetchUsers();
  } catch (error) {
    console.error("Failed to update user", error);
    toast.add({ title: "Update failed", color: "error" });
  }
};

const openResetPasswordModal = (user) => {
  resetPasswordTarget.value = user;
  resetPasswordValue.value = "";
  showResetPasswordModal.value = true;
  generatePassword();
};

const closeResetPasswordModal = () => {
  showResetPasswordModal.value = false;
  resetPasswordTarget.value = null;
  resetPasswordValue.value = "";
};

const generatePassword = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}?";
  const all = letters + numbers + symbols;

  const pick = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)];

  const passwordChars = [
    pick(letters),
    pick(numbers),
    pick(symbols),
    pick(all),
    pick(all),
    pick(all),
    pick(all),
    pick(all),
  ];

  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  resetPasswordValue.value = passwordChars.join("");
};

const copyGeneratedPassword = async () => {
  if (!resetPasswordValue.value) return;
  try {
    await navigator.clipboard.writeText(resetPasswordValue.value);
    toast.add({ title: "Password copied", color: "success" });
  } catch (error) {
    console.error("Failed to copy password", error);
    toast.add({ title: "Copy failed", color: "error" });
  }
};

const submitResetPassword = async () => {
  if (!resetPasswordTarget.value?.id) return;
  if (resetPasswordValue.value.trim().length < 8) {
    toast.add({
      title: "Password must be at least 8 characters",
      color: "warning",
    });
    return;
  }

  resettingPassword.value = true;
  try {
    await adminStore.updateUser(resetPasswordTarget.value.id, {
      password: resetPasswordValue.value.trim(),
    });
    toast.add({ title: "Password reset successful", color: "success" });
    closeResetPasswordModal();
  } catch (error) {
    console.error("Failed to reset password", error);
    toast.add({ title: "Password reset failed", color: "error" });
  } finally {
    resettingPassword.value = false;
  }
};

const deleteUser = async (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const viewUser = async (user) => {
  try {
    userModalLoading.value = true;
    selectedUser.value = null;
    const detail = await adminStore.fetchUserById(user.id);
    selectedUser.value = detail || user;
    formUser.value = selectedUser.value;
    formMode.value = "edit";
    showCreateModal.value = true;
  } catch (error) {
    console.error("Failed to load user", error);
    toast.add({ title: "Failed to load user", color: "error" });
  } finally {
    userModalLoading.value = false;
  }
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;
  deleting.value = true;
  try {
    await adminStore.deleteUser(userToDelete.value.id);
    toast.add({ title: "User deleted", color: "success" });
    showDeleteModal.value = false;
    userToDelete.value = null;
    await fetchUsers();
  } catch (error) {
    console.error("Failed to delete user", error);
    toast.add({ title: "Delete failed", color: "error" });
  } finally {
    deleting.value = false;
  }
};

const changePage = async (next: number) => {
  if (next < 1) return;
  page.value = next;
  await fetchUsers();
};

watch(selectedRole, () => {
  applyFilters();
});

const hasSocialLinks = (links: any) =>
  !!(links?.github || links?.linkedin || links?.twitter || links?.portfolio);

const handleCreateSubmit = async (payload) => {
  creating.value = true;
  try {
    if (formMode.value === "edit" && formUser.value?.id) {
      await adminStore.updateUser(formUser.value.id, payload);
      // Optional password reset if provided
      if (payload.password) {
        await adminStore.updateUser(formUser.value.id, {
          password: payload.password,
        });
      }
      toast.add({ title: "User updated", color: "success" });
    } else {
      await adminStore.createUser(payload);
      toast.add({ title: "User created", color: "success" });
    }
    showCreateModal.value = false;
    formUser.value = null;
    formMode.value = "create";
    await fetchUsers();
  } catch (error) {
    console.error("Save user failed", error);
    toast.add({ title: "Save failed", color: "error" });
  } finally {
    creating.value = false;
  }
};

const openCreateUser = () => {
  formUser.value = {
    name: "",
    email: "",
    role: "STUDENT",
    phone: "",
    departmentCode: "",
    password: "",
  };
  formMode.value = "create";
  showCreateModal.value = true;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  if (!file.name.endsWith(".csv")) {
    toast.add({ title: "Please choose a CSV file", color: "warning" });
    return;
  }
  uploading.value = true;
  try {
    await adminStore.uploadUsersCSV(file);
    toast.add({ title: "Import complete", color: "success" });
    await fetchUsers();
  } catch (error) {
    console.error("CSV upload failed", error);
    toast.add({ title: "Import failed", color: "error" });
  } finally {
    uploading.value = false;
    if (fileInput.value) fileInput.value.value = "";
  }
};

const createUser = async () => {
  try {
    creating.value = true;
    await adminStore.createUser({ ...newUser.value });
    toast.add({ title: "User created", color: "success" });
    showCreateModal.value = false;
    newUser.value = {
      name: "",
      email: "",
      role: "STUDENT",
      phone: "",
      departmentId: "",
      password: "",
    };
    await fetchUsers();
  } catch (error) {
    console.error("Create user failed", error);
    toast.add({ title: "Create failed", color: "error" });
  } finally {
    creating.value = false;
  }
};

const exportUsers = () => {
  if (!users.value?.length) return;
  const header = "Name,Email,Role,Department,Created\n";
  const rows = users.value
    .map((u) => {
      const name =
        u.name ||
        `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
        u.email ||
        "";
      const dept = u.department?.name || u.department || "";
      return `"${name}","${u.email || ""}","${u.role || "STUDENT"}","${dept}","${formatDate(u.createdAt)}"`;
    })
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
</script>
