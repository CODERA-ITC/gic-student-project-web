<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Header Section (clean card style) -->
    <div class="py-14">
      <UContainer>
        <div
          class="relative overflow-hidden rounded-3xl border border-white/10 ring-1 ring-blue-500/15
                 bg-white/90 dark:bg-slate-900/90 shadow-2xl px-8 py-10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(79,70,229,0.08),transparent_30%)] pointer-events-none"
            aria-hidden="true"
          ></div>

          <div class="relative space-y-3">
            <nav class="flex items-center flex-wrap gap-1 text-sm text-slate-600 dark:text-slate-300">
              <NuxtLink
                to="/"
                class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                {{ t("home") }}
              </NuxtLink>
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <NuxtLink
                to="/teacher/dashboard"
                class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                {{ t("nav.teacherDashboard") }}
              </NuxtLink>
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <span class="text-slate-900 dark:text-white font-semibold">
                {{ t("nav.userManagement") }}
              </span>
            </nav>
            <div class="flex items-center gap-3">
              <UIcon
                name="i-heroicons-academic-cap-solid"
                class="w-10 h-10 text-blue-500 dark:text-blue-300"
              />
              <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {{ t("nav.userManagement") }}
              </h1>
            </div>
            <p class="text-slate-700 dark:text-slate-300">
              {{ t("teacherUserManagement.subtitle") }}
            </p>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-12">
      <!-- Stats Card -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mb-8"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2
              class="text-2xl font-semibold text-gray-900 dark:text-white mb-1"
            >
              {{ total }} {{ total === 1 ? "Student" : "Students" }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Total registered students in the system
            </p>
          </div>
          <div class="flex items-center gap-2">
            <ButtonsPresetButton
              label="Create Student"
              icon="i-heroicons-plus"
              color="primary"
              variant="solid"
              size="sm"
              @click="showCreateModal = true"
            />
            <input
              ref="fileInput"
              type="file"
              accept=".csv"
              class="hidden"
              @change="handleFileSelect"
            />
            <ButtonsPresetButton
              label="Import Students"
              icon="i-heroicons-arrow-up-tray"
              color="primary"
              variant="outline"
              size="sm"
              @click="triggerFileInput"
              :disabled="uploading"
              :loading="uploading"
            />
            <ButtonsPresetButton
              label="Export List"
              icon="i-heroicons-arrow-down-tray"
              color="secondary"
              variant="outline"
              size="sm"
              @click="exportStudents"
            />
            <ButtonsPresetButton
              label="Refresh"
              icon="i-heroicons-arrow-path"
              color="primary"
              variant="outline"
              size="sm"
              @click="loadStudents"
              :disabled="loading"
            />
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 mb-8"
      >
        <div
          class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
        >
          <div class="flex-1">
            <div class="relative">
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, email, or phone..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
              >Filter by Generation:</span
            >
            <select
              v-model="selectedGeneration"
              @change="loadStudents"
              class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none"
            >
              <option value="all">All Generations</option>
              <option
                v-for="gen in availableGenerations"
                :key="gen"
                :value="gen"
              >
                Generation {{ gen }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-20"
      >
        <LoadingSpinner size="large" />
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading students...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="students.length === 0 && !loading"
        class="flex flex-col items-center justify-center py-20"
      >
        <UIcon
          name="i-heroicons-user-group"
          class="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4"
        />
        <h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {{
            searchQuery || selectedGeneration !== "all"
              ? "No students found"
              : "No students yet"
          }}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          {{
            searchQuery || selectedGeneration !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Students will appear here once they register"
          }}
        </p>
      </div>

      <!-- Students Table -->
      <div
        v-else
        class="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead
              class="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700"
            >
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Student
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Generation
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
              <tr
                v-for="student in students"
                :key="student.id"
                class="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <img
                      :src="
                        student.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(student.firstName + ' ' + (student.lastName || ''))}&background=3b82f6&color=fff`
                      "
                      :alt="student.firstName"
                      class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-slate-600"
                    />
                    <div>
                      <div class="font-medium text-gray-900 dark:text-white">
                        {{ student.firstName }} {{ student.lastName || "" }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        ID: {{ student.id.substring(0, 8) }}...
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ student.email }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="student.generation"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                  >
                    Gen {{ student.generation }}
                  </span>
                  <span v-else class="text-sm text-gray-400 dark:text-gray-500">
                    N/A
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ student.phone || "N/A" }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ student.department?.code || "N/A" }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      @click="viewStudent(student)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="View details"
                    >
                      <UIcon name="i-heroicons-eye" class="w-5 h-5" />
                    </button>
                    <button
                      @click="confirmDelete(student)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <UIcon name="i-heroicons-trash" class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="total > 0 && lastPage > 1"
        class="mt-6 flex items-center justify-between"
      >
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Showing {{ (currentPage - 1) * limit + 1 }} to
          {{ Math.min(currentPage * limit, total) }} of {{ total }} students
        </div>
        <div class="flex items-center gap-2">
          <ButtonsPresetButton
            label="Previous"
            icon="i-heroicons-chevron-left"
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          />
          <span class="text-sm text-gray-600 dark:text-gray-400">
            Page {{ currentPage }} of {{ lastPage }}
          </span>
          <ButtonsPresetButton
            label="Next"
            icon="i-heroicons-chevron-right"
            variant="outline"
            size="sm"
            :disabled="currentPage === lastPage"
            @click="changePage(currentPage + 1)"
          />
        </div>
      </div>
    </UContainer>

    <!-- Student Details Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDetailsModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showDetailsModal = false"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-gray-900/75 dark:bg-gray-900/90 backdrop-blur-sm"
            @click="showDetailsModal = false"
          ></div>

          <!-- Modal Container -->
          <div
            class="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h3
                  class="text-2xl font-semibold text-gray-900 dark:text-white"
                >
                  Student Details
                </h3>
                <button
                  @click="showDetailsModal = false"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
                </button>
              </div>

              <div v-if="selectedStudent" class="space-y-4">
                <div class="flex items-center gap-4 mb-6">
                  <img
                    :src="
                      selectedStudent.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.firstName + ' ' + (selectedStudent.lastName || ''))}&background=3b82f6&color=fff&size=128`
                    "
                    :alt="selectedStudent.firstName"
                    class="w-20 h-20 rounded-full object-cover ring-4 ring-gray-200 dark:ring-slate-600"
                  />
                  <div>
                    <h4
                      class="text-xl font-semibold text-gray-900 dark:text-white"
                    >
                      {{ selectedStudent.firstName }}
                      {{ selectedStudent.lastName || "" }}
                    </h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ selectedStudent.email }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="text-sm font-medium text-gray-500 dark:text-gray-400"
                      >Phone</label
                    >
                    <p class="text-gray-900 dark:text-white">
                      {{ selectedStudent.phone || "N/A" }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="text-sm font-medium text-gray-500 dark:text-gray-400"
                      >Generation</label
                    >
                    <p class="text-gray-900 dark:text-white">
                      {{
                        selectedStudent.generation
                          ? `Gen ${selectedStudent.generation}`
                          : "N/A"
                      }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="text-sm font-medium text-gray-500 dark:text-gray-400"
                      >Year</label
                    >
                    <p class="text-gray-900 dark:text-white">
                      {{
                        selectedStudent.year
                          ? `Year ${selectedStudent.year}`
                          : "N/A"
                      }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="text-sm font-medium text-gray-500 dark:text-gray-400"
                      >Department</label
                    >
                    <p class="text-gray-900 dark:text-white">
                      {{ selectedStudent.department?.name || "N/A" }}
                    </p>
                  </div>
                </div>

                <div v-if="selectedStudent.bio">
                  <label
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                    >Bio</label
                  >
                  <p class="text-gray-900 dark:text-white mt-1">
                    {{ selectedStudent.bio }}
                  </p>
                </div>

                <div
                  v-if="
                    selectedStudent.skill && selectedStudent.skill.length > 0
                  "
                >
                  <label
                    class="text-sm font-medium text-gray-500 dark:text-gray-400"
                    >Skills</label
                  >
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span
                      v-for="skill in selectedStudent.skill"
                      :key="skill"
                      class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showDeleteModal = false"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-gray-900/75 dark:bg-gray-900/90 backdrop-blur-sm"
            @click="showDeleteModal = false"
          ></div>

          <!-- Modal Container -->
          <div
            class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl transform transition-all"
          >
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                >
                  <UIcon
                    name="i-heroicons-exclamation-triangle"
                    class="w-6 h-6 text-red-600 dark:text-red-400"
                  />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Student?
                </h3>
              </div>

              <div v-if="studentToDelete" class="space-y-4">
                <div
                  class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                  <p class="text-red-800 dark:text-red-300 mb-2">
                    Are you sure you want to delete
                    <span class="font-semibold">
                      {{ studentToDelete.firstName }}
                      {{ studentToDelete.lastName || "" }}</span
                    >?
                  </p>
                  <p class="text-sm text-red-700 dark:text-red-400">
                    This action cannot be undone. All student data will be
                    permanently removed.
                  </p>
                </div>

                <div class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="
                        studentToDelete.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(studentToDelete.firstName + ' ' + (studentToDelete.lastName || ''))}&background=3b82f6&color=fff`
                      "
                      :alt="studentToDelete.firstName"
                      class="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-slate-600"
                    />
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white">
                        {{ studentToDelete.firstName }}
                        {{ studentToDelete.lastName || "" }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ studentToDelete.email }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Verification Input -->
                <div
                  class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                  <p class="text-red-800 dark:text-red-300 font-medium mb-3">
                    To confirm, type
                    <span class="font-semibold">DELETE</span> below:
                  </p>
                  <input
                    v-model="deleteText"
                    type="text"
                    placeholder="Type DELETE to confirm"
                    class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-red-300 dark:border-red-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                    @keyup.enter="deleteText === 'DELETE' && deleteStudent()"
                  />
                </div>

                <div
                  class="flex flex-col sm:flex-row gap-3 justify-center pt-2"
                >
                  <ButtonsPresetButton
                    preset="cancel"
                    size="lg"
                    @click="showDeleteModal = false"
                  />
                  <ButtonsPresetButton
                    preset="delete"
                    label="Delete Permanently"
                    size="lg"
                    :disabled="deleteText !== 'DELETE' || deleting"
                    :loading="deleting"
                    @click="deleteStudent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Create Student Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showCreateModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showCreateModal = false"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-gray-900/75 dark:bg-gray-900/90 backdrop-blur-sm"
            @click="showCreateModal = false"
          ></div>

          <!-- Modal Container -->
          <div
            class="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <h3
                  class="text-2xl font-semibold text-gray-900 dark:text-white"
                >
                  Create New Student
                </h3>
                <button
                  @click="showCreateModal = false"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
                </button>
              </div>

              <form @submit.prevent="createStudent" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      First Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="newStudent.firstName"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      v-model="newStudent.lastName"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="newStudent.email"
                    type="email"
                    required
                    class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="student@example.com"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Phone
                    </label>
                    <input
                      v-model="newStudent.phone"
                      type="tel"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Generation <span class="text-red-500">*</span>
                    </label>
                    <select
                      v-model="newStudent.generation"
                      required
                      class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="" disabled>Select generation</option>
                      <option
                        v-for="gen in availableGenerations"
                        :key="gen"
                        :value="gen"
                      >
                        Generation {{ gen }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Year
                    </label>
                    <input
                      v-model.number="newStudent.year"
                      type="number"
                      min="1"
                      max="6"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1-6"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Department ID
                    </label>
                    <input
                      v-model="newStudent.departmentId"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Department ID"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Bio
                  </label>
                  <textarea
                    v-model="newStudent.bio"
                    rows="3"
                    class="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description about the student"
                  ></textarea>
                </div>

                <div class="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                  <ButtonsPresetButton
                    preset="cancel"
                    size="lg"
                    type="button"
                    @click="showCreateModal = false"
                  />
                  <ButtonsPresetButton
                    label="Create Student"
                    icon="i-heroicons-plus"
                    color="primary"
                    size="lg"
                    type="submit"
                    :disabled="creating"
                    :loading="creating"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useStudentStore } from "~/stores/students";
import type { APIStudent } from "~/stores/students";
import { useDebounceFn } from "@vueuse/core";
const { t } = useI18n();

definePageMeta({
  middleware: ["auth", "teacher"],
});

const authStore = useAuthStore();
const studentStore = useStudentStore();
const config = useRuntimeConfig();
const toast = useToast();

// Local state
const showDetailsModal = ref(false);
const selectedStudent = ref<APIStudent | null>(null);
const showDeleteModal = ref(false);
const studentToDelete = ref<APIStudent | null>(null);
const deleting = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const deleteText = ref("");
const showCreateModal = ref(false);
const creating = ref(false);
const newStudent = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  generation: "",
  year: null as number | null,
  departmentId: "",
  bio: "",
});

// Computed properties from store
const students = computed(() => studentStore.apiStudents);
const loading = computed(() => studentStore.loading);
const currentPage = computed(() => studentStore.currentPage);
const limit = computed(() => studentStore.limit);
const total = computed(() => studentStore.total);
const lastPage = computed(() => studentStore.lastPage);
const availableGenerations = computed(() => studentStore.availableGenerations);

// Two-way computed for search query
const searchQuery = computed({
  get: () => studentStore.searchQuery,
  set: (value) => {
    studentStore.setSearchQuery(value);
    debouncedSearch();
  },
});

// Two-way computed for generation filter
const selectedGeneration = computed({
  get: () => studentStore.selectedGeneration,
  set: (value) => {
    studentStore.setGeneration(value);
    loadStudents();
  },
});

// Reset deleteText when modal opens
watch(showDeleteModal, (newValue) => {
  if (newValue) {
    deleteText.value = "";
  }
});

// Debounced search function
const debouncedSearch = useDebounceFn(() => {
  loadStudents();
}, 500);

// Load students from store
const loadStudents = async () => {
  await studentStore.loadStudents(authStore.token);
};

// Change page
const changePage = async (page: number) => {
  await studentStore.changePage(page, authStore.token);
};

// View student details
const viewStudent = (student: APIStudent) => {
  console.log("View student clicked:", student);
  selectedStudent.value = student;
  showDetailsModal.value = true;
  console.log("showDetailsModal:", showDetailsModal.value);
};

// Confirm delete student
const confirmDelete = (student: APIStudent) => {
  console.log("Delete confirmation clicked:", student);
  studentToDelete.value = student;
  deleteText.value = "";
  showDeleteModal.value = true;
  console.log("showDeleteModal:", showDeleteModal.value);
};

// Delete student
const deleteStudent = async () => {
  if (!studentToDelete.value) return;

  deleting.value = true;
  try {
    await studentStore.deleteStudent(studentToDelete.value.id, authStore.token);

    toast.add({
      title: "Success",
      description: "Student deleted successfully",
      color: "success",
    });

    showDeleteModal.value = false;
    studentToDelete.value = null;
    deleteText.value = "";

    // Reload students
    await loadStudents();
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to delete student",
      color: "error",
    });
  } finally {
    deleting.value = false;
  }
};

// Trigger file input click
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Handle file selection
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Validate file type
  if (!file.name.endsWith(".csv")) {
    toast.add({
      title: "Invalid File",
      description: "Please select a CSV file",
      color: "error",
    });
    return;
  }

  uploading.value = true;

  try {
    await studentStore.uploadStudentsCSV(file, authStore.token);

    toast.add({
      title: "Success",
      description: "Students imported successfully",
      color: "success",
    });

    // Clear file input
    if (fileInput.value) {
      fileInput.value.value = "";
    }

    // Reload students
    await loadStudents();
  } catch (error: any) {
    toast.add({
      title: "Import Failed",
      description: error.message || "Failed to import students",
      color: "error",
    });
  } finally {
    uploading.value = false;
  }
};

// Create new student
const createStudent = async () => {
  creating.value = true;
  try {
    await studentStore.createStudent(newStudent.value, authStore.token);

    toast.add({
      title: "Success",
      description: "Student created successfully",
      color: "success",
    });

    showCreateModal.value = false;
    // Reset form
    newStudent.value = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      generation: "",
      year: null,
      departmentId: "",
      bio: "",
    };

    // Reload students
    await loadStudents();
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.message || "Failed to create student",
      color: "error",
    });
  } finally {
    creating.value = false;
  }
};

// Export students to CSV
const exportStudents = () => {
  const csvContent =
    "Student ID,Name,Email,Phone,Generation,Year,Department\n" +
    students.value
      .map((s) => {
        const fullName = `${s.firstName} ${s.lastName || ""}`.trim();
        return `"${s.id}","${fullName}","${s.email}","${s.phone || "N/A"}","${s.generation ? `Gen ${s.generation}` : "N/A"}","${s.year ? `Year ${s.year}` : "N/A"}","${s.department?.name || "N/A"}"`;
      })
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `students-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Load students on mount
onMounted(async () => {
  await loadStudents();
});

useHead({
  title: "Student Management - GIC Teacher Portal",
  meta: [
    {
      name: "description",
      content: "Manage and monitor all students in the system",
    },
  ],
});
</script>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div > div,
.modal-leave-active > div > div {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-enter-from > div > div,
.modal-leave-to > div > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>
