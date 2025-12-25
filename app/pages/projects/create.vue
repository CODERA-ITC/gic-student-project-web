<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
    <UContainer>
      <!-- Show main content only when authenticated -->
      <div v-if="!showAuthModal && authStore.isAuthenticated">
        <!-- Back Button -->
        <div class="mb-8">
          <ButtonsPresetButton
            preset="back"
            to="/projects"
            @click="mobileMenuOpen = false"
          />
        </div>

        <!-- Header -->
        <div class="max-w-3xl mx-auto mb-12">
          <h1
            class="text-5xl font-black font-semibold text-gray-900 dark:text-white mb-2"
          >
            {{ editMode ? "Edit Project" : "Create New Project" }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            {{
              editMode
                ? "Update your project information"
                : "Share your amazing project with the GIC community"
            }}
          </p>
        </div>

        <!-- Form Card -->
        <div
          class="max-w-3xl mx-auto bg-white/80 dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-2xl p-8 space-y-8"
        >
          <form @submit.prevent="submitForm" class="space-y-8">
            <!-- Step Indicator -->
            <div class="flex justify-between mb-12">
              <div
                v-for="(step, idx) in steps"
                :key="step.id"
                class="flex items-center flex-1"
              >
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all',
                    currentStep > idx
                      ? 'bg-green-600 text-white'
                      : currentStep === idx
                      ? 'bg-blue-900 text-white ring-2 ring-blue-800'
                      : 'bg-gray-300 dark:bg-slate-700 text-gray-600 dark:text-gray-400',
                  ]"
                >
                  {{ idx + 1 }}
                </div>
                <div
                  v-if="idx < steps.length - 1"
                  :class="[
                    'flex-1 h-1 mx-2 rounded-full transition-all',
                    currentStep > idx
                      ? 'bg-green-600'
                      : 'bg-gray-300 dark:bg-slate-700',
                  ]"
                ></div>
              </div>
            </div>

            <!-- Step 1: Basic Info -->
            <div v-if="currentStep === 0" class="space-y-6 animate-fadeIn">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Basic Information
              </h2>

              <!-- Project Title -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Project Title *
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  placeholder="Enter a descriptive project title"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Maximum 100 characters
                </p>
              </div>

              <!-- Project Description -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Description *
                </label>
                <textarea
                  v-model="form.description"
                  placeholder="Describe your project in detail. What does it do? Why is it important?"
                  rows="5"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  required
                ></textarea>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ form.description.length }}/500 characters
                </p>
              </div>

              <!-- Project Thumbnails/Previews -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Project Thumbnails/Previews *
                </label>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Upload at least 1 images showcasing your project (screenshots,
                  mockups, demos)
                </p>

                <div class="space-y-4">
                  <!-- Image Upload Area -->
                  <div
                    @drop="handleThumbnailDrop"
                    @dragover.prevent
                    @dragenter.prevent
                    class="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center transition-colors hover:border-blue-500 hover:bg-gray-100 dark:hover:bg-slate-700/30"
                  >
                    <input
                      ref="thumbnailInput"
                      type="file"
                      accept="image/*"
                      multiple
                      @change="handleThumbnailSelect"
                      class="hidden"
                    />

                    <div class="space-y-3">
                      <UIcon
                        name="i-heroicons-photo"
                        class="w-12 h-12 text-gray-400 dark:text-gray-400 mx-auto"
                      />
                      <div>
                        <p
                          class="text-gray-900 dark:text-white font-medium mb-1"
                        >
                          Drop project images here or click to browse
                        </p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          PNG, JPG, GIF up to 5MB each • Minimum 3 images
                          required
                        </p>
                      </div>
                      <UButton
                        type="button"
                        color="primary"
                        variant="outline"
                        @click="$refs.thumbnailInput?.click()"
                        icon="i-heroicons-plus"
                      >
                        Add Images
                      </UButton>
                    </div>
                  </div>

                  <!-- Image Preview Grid -->
                  <div v-if="form.thumbnails.length > 0" class="space-y-3">
                    <div class="flex items-center justify-between">
                      <p class="text-sm text-gray-700 dark:text-gray-300">
                        {{ form.thumbnails.length }}/3+ images
                        <span
                          v-if="form.thumbnails.length < 1"
                          class="text-red-400"
                          >({{ 1 - form.thumbnails.length }} more needed)</span
                        >
                        <span v-else class="text-green-400">✓</span>
                      </p>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div
                        v-for="(image, index) in form.thumbnails"
                        :key="index"
                        class="relative group"
                      >
                        <img
                          :src="image"
                          :alt="`Project thumbnail ${index + 1}`"
                          class="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-slate-600"
                        />
                        <button
                          type="button"
                          @click="removeThumbnail(index)"
                          class="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                        </button>
                        <div
                          class="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
                        >
                          {{ index + 1 }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- No images state -->
                  <div
                    v-else
                    class="text-center py-4 bg-gray-100 dark:bg-slate-700/30 rounded-lg border border-gray-300 dark:border-slate-600"
                  >
                    <UIcon
                      name="i-heroicons-exclamation-triangle"
                      class="w-8 h-8 text-yellow-400 mx-auto mb-2"
                    />
                    <p class="text-yellow-600 dark:text-yellow-400 font-medium">
                      No images uploaded
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Please upload at least 3 project images to continue
                    </p>
                  </div>
                </div>
              </div>

              <!-- Two Column Layout -->
              <div class="grid md:grid-cols-2 gap-6">
                <!-- Category -->
                <div>
                  <label
                    class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Category *
                  </label>
                  <select
                    v-model="form.category"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  >
                    <option value="">Select a category</option>
                    <option
                      v-for="category in availableCategories"
                      :key="category"
                      :value="category"
                    >
                      {{ category }}
                    </option>
                  </select>
                </div>

                <!-- Academic Year -->
                <div>
                  <label
                    class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Academic Year *
                  </label>
                  <input
                    v-model="form.academicYear"
                    type="text"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="e.g., 2024-2025"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Step 2: Technical Details -->
            <div v-if="currentStep === 1" class="space-y-6 animate-fadeIn">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Technical Details
              </h2>

              <!-- Technologies -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3"
                >
                  Technologies Used *
                </label>
                <div class="space-y-3">
                  <div class="flex gap-2">
                    <input
                      v-model="techInput"
                      type="text"
                      placeholder="e.g., React, Node.js, MongoDB..."
                      class="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      @keyup.enter="addTechnology"
                    />
                    <UButton
                      type="button"
                      @click="addTechnology"
                      color="primary"
                      variant="solid"
                      size="lg"
                      icon="i-heroicons-plus"
                    >
                      Add
                    </UButton>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <UBadge
                      v-for="(tech, idx) in form.technologies"
                      :key="idx"
                      color="primary"
                      class="cursor-pointer hover:opacity-80"
                      @click="form.technologies.splice(idx, 1)"
                    >
                      {{ tech }}
                      <UIcon name="i-heroicons-x-mark" class="w-4 h-4 ml-1" />
                    </UBadge>
                  </div>
                </div>
              </div>

              <!-- GitHub URL -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  GitHub Repository URL
                </label>
                <input
                  v-model="form.githubUrl"
                  type="url"
                  placeholder="https://github.com/username/project"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <!-- Demo URL -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Live Demo URL
                </label>
                <input
                  v-model="form.demoUrl"
                  type="url"
                  placeholder="https://your-project-demo.com"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <!-- Repository Visibility -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3"
                >
                  Repository Visibility
                </label>
                <div class="flex gap-4">
                  <label
                    v-for="visibility in ['public', 'private']"
                    :key="visibility"
                    class="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      :value="visibility"
                      v-model="form.visibility"
                      class="w-4 h-4 text-blue-600"
                    />
                    <span class="text-gray-900 dark:text-white capitalize">{{
                      visibility
                    }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Step 3: Project Details -->
            <div v-if="currentStep === 2" class="space-y-6 animate-fadeIn">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Project Details
              </h2>

              <!-- Team Size and Level -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Team Size
                  </label>
                  <input
                    v-model.number="form.teamSize"
                    type="number"
                    min="1"
                    max="20"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <!-- Team Members -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3"
                >
                  Team Members
                </label>
                <div class="space-y-4">
                  <!-- Prerendered Team Member Selection -->
                  <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Select from suggested members:
                    </p>
                    <!-- Member Search -->
                    <div class="mb-3">
                      <input
                        v-model="memberSearchQuery"
                        type="text"
                        placeholder="Search members by name or role..."
                        class="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <div
                      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                    >
                      <div
                        v-for="suggestedMember in filteredSuggestedMembers"
                        :key="suggestedMember.name"
                        @click="toggleTeamMember(suggestedMember)"
                        :class="[
                          'p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105',
                          isTeamMemberSelected(suggestedMember)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500',
                        ]"
                      >
                        <div class="flex items-center gap-2">
                          <img
                            :src="suggestedMember.avatar"
                            :alt="suggestedMember.name"
                            class="w-8 h-8 rounded-full"
                          />
                          <div class="flex-1 min-w-0">
                            <p
                              class="text-sm font-medium text-gray-900 dark:text-white truncate"
                            >
                              {{ suggestedMember.name }}
                            </p>
                            <p
                              class="text-xs text-gray-500 dark:text-gray-400 truncate"
                            >
                              {{ suggestedMember.role }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p
                      v-if="
                        filteredSuggestedMembers.length === 0 &&
                        memberSearchQuery
                      "
                      class="text-sm text-gray-500 dark:text-gray-400 text-center py-4"
                    >
                      No members found matching "{{ memberSearchQuery }}"
                    </p>
                  </div>

                  <!-- Custom Team Member Input -->
                  <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Or add a custom member:
                    </p>
                    <div class="flex gap-2">
                      <input
                        v-model="memberInput"
                        type="text"
                        placeholder="Enter team member name"
                        class="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        @keyup.enter="addTeamMember"
                      />
                      <UButton
                        type="button"
                        @click="addTeamMember"
                        color="primary"
                        variant="solid"
                        size="lg"
                        icon="i-heroicons-plus"
                      >
                        Add
                      </UButton>
                    </div>
                  </div>

                  <!-- Selected Team Members Display -->
                  <div v-if="form.teamMembers.length > 0" class="space-y-2">
                    <p
                      class="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Selected Team Members:
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <div
                        v-for="(member, idx) in form.teamMembers"
                        :key="idx"
                        class="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                      >
                        <img
                          v-if="member.avatar"
                          :src="member.avatar"
                          :alt="member.name"
                          class="w-6 h-6 rounded-full"
                        />
                        <span
                          class="text-sm font-medium text-blue-900 dark:text-blue-100"
                        >
                          {{
                            typeof member === "string" ? member : member.name
                          }}
                        </span>
                        <button
                          type="button"
                          @click="form.teamMembers.splice(idx, 1)"
                          class="text-blue-400 hover:text-red-500 transition-colors"
                        >
                          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Project Features -->
              <div>
                <label
                  class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3"
                >
                  Project Features / Milestones
                </label>
                <div class="space-y-4">
                  <!-- Icon Selection -->
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                      Select Icon
                    </label>
                    <!-- Icon Search -->
                    <div class="mb-3">
                      <input
                        v-model="iconSearchQuery"
                        type="text"
                        placeholder="Search icons..."
                        class="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      <button
                        v-for="iconOption in filteredIcons"
                        :key="iconOption.name"
                        type="button"
                        @click="featureInput.icon = iconOption.name"
                        :class="[
                          'p-2 rounded-lg border-2 transition-all hover:scale-105',
                          featureInput.icon === iconOption.name
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-slate-600 hover:border-gray-300',
                        ]"
                        :title="iconOption.label"
                      >
                        <UIcon :name="iconOption.name" class="w-5 h-5" />
                      </button>
                    </div>
                    <p
                      v-if="filteredIcons.length === 0 && iconSearchQuery"
                      class="text-sm text-gray-500 dark:text-gray-400 text-center py-2"
                    >
                      No icons found matching "{{ iconSearchQuery }}"
                    </p>
                  </div>

                  <!-- Feature Details -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      v-model="featureInput.title"
                      type="text"
                      placeholder="Feature title (e.g., User Authentication)"
                      class="px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <input
                      v-model="featureInput.date"
                      type="date"
                      class="px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <!-- Status Selection -->
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                    >
                      Status
                    </label>
                    <div class="flex gap-3">
                      <label
                        v-for="statusOption in availableStatuses"
                        :key="statusOption.value"
                        class="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          :value="statusOption.value"
                          v-model="featureInput.status"
                          class="w-4 h-4 text-blue-600"
                        />
                        <span class="text-sm text-gray-700 dark:text-gray-300">
                          {{ statusOption.label }}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <textarea
                      v-model="featureInput.description"
                      placeholder="Feature description..."
                      rows="2"
                      class="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    ></textarea>
                    <UButton
                      type="button"
                      @click="
                        editingFeatureIndex >= 0 ? addFeature() : addFeature()
                      "
                      color="primary"
                      variant="solid"
                      size="lg"
                      :icon="
                        editingFeatureIndex >= 0
                          ? 'i-heroicons-check'
                          : 'i-heroicons-plus'
                      "
                      :disabled="
                        !featureInput.title || !featureInput.description
                      "
                    >
                      {{
                        editingFeatureIndex >= 0
                          ? "Update Feature"
                          : "Add Feature"
                      }}
                    </UButton>
                    <UButton
                      v-if="editingFeatureIndex >= 0"
                      type="button"
                      @click="cancelEditFeature"
                      color="gray"
                      variant="soft"
                      size="lg"
                      icon="i-heroicons-x-mark"
                    >
                      Cancel
                    </UButton>
                  </div>

                  <div class="space-y-2" v-if="form.feature.length > 0">
                    <div
                      v-for="(feature, idx) in form.feature"
                      :key="idx"
                      class="flex items-start justify-between px-4 py-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600"
                    >
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <UIcon
                            :name="feature.icon"
                            class="w-4 h-4 text-blue-400"
                          />
                          <span
                            class="font-medium text-gray-900 dark:text-white"
                            >{{ feature.title }}</span
                          >
                          <UBadge
                            :color="getStatusColor(feature.status)"
                            variant="soft"
                            size="sm"
                          >
                            {{ getStatusLabel(feature.status) }}
                          </UBadge>
                          <UBadge color="gray" variant="soft" size="sm">{{
                            feature.date || "TBD"
                          }}</UBadge>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                          {{ feature.description }}
                        </p>
                      </div>
                      <div class="flex gap-1 ml-2">
                        <button
                          type="button"
                          @click="editFeature(idx)"
                          class="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                          title="Edit feature"
                        >
                          <UIcon
                            name="i-heroicons-pencil-square-20-solid"
                            class="w-4 h-4"
                          />
                        </button>
                        <button
                          type="button"
                          @click="removeFeature(idx)"
                          class="text-gray-500 dark:text-gray-400 hover:text-red-400 transition-colors"
                          title="Remove feature"
                        >
                          <UIcon
                            name="i-heroicons-trash-20-solid"
                            class="w-4 h-4"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Duration and Course -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Project Duration *
                  </label>
                  <select
                    v-model="form.duration"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  >
                    <option value="">Select duration</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="4 months">4 months</option>
                    <option value="5 months">5 months</option>
                    <option value="6 months">6 months</option>
                  </select>
                </div>

                <div>
                  <label
                    class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Course / Subject *
                  </label>
                  <input
                    v-model="form.course"
                    type="text"
                    placeholder="e.g., Web Development, Mobile Apps"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
            </div>

            <!-- Step 4: Review & Submit -->
            <div v-if="currentStep === 3" class="space-y-6 animate-fadeIn">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                Review Your Project
              </h2>

              <!-- Project Preview -->
              <div
                class="bg-gray-100 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl p-6 space-y-4"
              >
                <div class="flex items-start justify-between">
                  <div class="space-y-2">
                    <div
                      v-if="form.thumbnails.length > 0"
                      class="flex gap-2 mb-3"
                    >
                      <div
                        v-for="(thumbnail, index) in form.thumbnails.slice(
                          0,
                          3
                        )"
                        :key="index"
                        class="w-12 h-12 rounded-lg overflow-hidden border border-gray-300 dark:border-slate-600"
                      >
                        <img
                          :src="thumbnail"
                          :alt="`Thumbnail ${index + 1}`"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        v-if="form.thumbnails.length > 3"
                        class="w-12 h-12 rounded-lg bg-gray-300 dark:bg-slate-600 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400"
                      >
                        +{{ form.thumbnails.length - 3 }}
                      </div>
                    </div>
                    <h3
                      class="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      {{ form.title }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                      {{ form.category }} • {{ form.academicYear }}
                    </p>
                  </div>
                </div>

                <p class="text-gray-700 dark:text-gray-300">
                  {{ form.description }}
                </p>

                <div
                  class="space-y-3 border-t border-gray-200 dark:border-slate-600 pt-4"
                >
                  <div v-if="form.technologies.length > 0">
                    <p class="text-xs text-gray-500 dark:text-gray-500">
                      Technologies
                    </p>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <UBadge
                        v-for="tech in form.technologies"
                        :key="tech"
                        color="primary"
                        variant="soft"
                        size="sm"
                      >
                        {{ tech }}
                      </UBadge>
                    </div>
                  </div>

                  <div v-if="form.teamMembers.length > 0">
                    <p class="text-xs text-gray-500 dark:text-gray-500">
                      Team Members
                    </p>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <div
                        v-for="member in form.teamMembers"
                        :key="typeof member === 'string' ? member : member.name"
                        class="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg"
                      >
                        <img
                          v-if="typeof member === 'object' && member.avatar"
                          :src="member.avatar"
                          :alt="member.name"
                          class="w-5 h-5 rounded-full"
                        />
                        <UIcon
                          v-else
                          name="i-heroicons-user-circle"
                          class="w-5 h-5 text-blue-500"
                        />
                        <span class="text-sm text-blue-700 dark:text-blue-300">
                          {{
                            typeof member === "string" ? member : member.name
                          }}
                        </span>
                        <span
                          v-if="typeof member === 'object' && member.role"
                          class="text-xs text-blue-500 dark:text-blue-400"
                        >
                          ({{ member.role }})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div v-if="form.duration">
                    <p class="text-xs text-gray-500 dark:text-gray-500">
                      Duration
                    </p>
                    <p class="text-gray-900 dark:text-white">
                      {{ form.duration }}
                    </p>
                  </div>

                  <div v-if="form.feature.length > 0">
                    <p class="text-xs text-gray-500 dark:text-gray-500">
                      Project Features
                    </p>
                    <div class="space-y-2 mt-2">
                      <div
                        v-for="(feature, index) in form.feature.slice(0, 3)"
                        :key="index"
                        class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-600/30 rounded-lg"
                      >
                        <UIcon
                          :name="feature.icon"
                          class="w-4 h-4 text-blue-500"
                        />
                        <span
                          class="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {{ feature.title }}
                        </span>
                        <UBadge
                          :color="getStatusColor(feature.status)"
                          variant="soft"
                          size="xs"
                        >
                          {{ getStatusLabel(feature.status) }}
                        </UBadge>
                      </div>
                      <p
                        v-if="form.feature.length > 3"
                        class="text-xs text-gray-400 text-center"
                      >
                        +{{ form.feature.length - 3 }} more features
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Terms Agreement -->
              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  v-model="agreedToTerms"
                  type="checkbox"
                  class="w-4 h-4 mt-1 text-blue-600 rounded border-gray-300 dark:border-slate-600"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {{
                    editMode
                      ? "I confirm that all updated information is accurate and the project remains my original work."
                      : "I agree that my project will be shared with the GIC community and confirm all information is accurate and original work."
                  }}
                </span>
              </label>
            </div>

            <!-- Navigation Buttons -->
            <div
              class="flex justify-between pt-8 border-t border-gray-200 dark:border-slate-700"
            >
              <ButtonsPresetButton
                v-if="currentStep > 0"
                preset="back"
                @click="prevStep"
              />

              <div class="ml-auto flex gap-3">
                <ButtonsPresetButton
                  v-if="currentStep < steps.length - 1"
                  :label="`Next`"
                  :icon="`i-heroicons-arrow-right`"
                  color="primary"
                  variant="solid"
                  size="md"
                  :disabled="!canProceedToNextStep"
                  @click="nextStep"
                />

                <ButtonsPresetButton
                  v-if="currentStep === steps.length - 1"
                  preset="submit"
                  :disabled="!canProceedToNextStep || isSubmitting"
                  :loading="isSubmitting"
                  @click="submitForm"
                >
                  {{
                    isSubmitting
                      ? editMode
                        ? "Updating..."
                        : "Creating..."
                      : editMode
                      ? "Update Project"
                      : "Create Project"
                  }}
                </ButtonsPresetButton>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- End of authenticated content wrapper -->

      <!-- Loading/Auth Check State -->
      <div
        v-if="showAuthModal"
        class="min-h-screen flex items-center justify-center"
      >
        <div class="text-center">
          <UIcon
            name="i-heroicons-lock-closed"
            class="w-16 h-16 text-blue-500 mx-auto mb-4"
          />
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            Please login to continue creating your project
          </p>
        </div>
      </div>

      <!-- Success Toast (optional) -->
      <Teleport to="body">
        <!-- Success notification handled by toast -->
      </Teleport>
    </UContainer>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const authStore = useAuthStore();

// Check if we're in edit mode
const editMode = ref(false);
const editProjectId = ref(null);

// Initialize edit mode if edit parameter is provided
onMounted(async () => {
  // First load categories
  await projectStore.fetchCategories();

  // Then check for edit mode
  const editId = route.query.edit;
  if (editId) {
    editMode.value = true;
    editProjectId.value = editId;
    await loadProjectForEditing(editId);
  }
});

// Load project data for editing
const loadProjectForEditing = async (projectId) => {
  try {
    const project = await projectStore.getProjectById(projectId);
    if (project) {
      console.log("Loading project for editing:", project);
      console.log("Project features:", project.features);

      // Pre-fill form with existing project data
      form.value = {
        title: project.title || "",
        description: project.description || "",
        thumbnails: project.images || [],
        category: project.category || "",
        academicYear: project.academicYear || "",
        technologies: project.technologies || [],
        githubUrl: project.githubUrl || "",
        demoUrl: project.demoUrl || "",
        visibility: project.visibility || "public",
        duration: project.duration || "",
        teamSize: project.members?.length || 1,
        teamMembers: project.members || [],
        feature: project.features || project.feature || [],
        tags: project.tags || [],
        course: project.course || "",
      };

      console.log("Form features after loading:", form.value.feature);
    }
  } catch (error) {
    console.error("Error loading project for editing:", error);
    const toast = useToast();
    toast.add({
      title: "Error",
      description: "Failed to load project data for editing",
      color: "red",
    });
  }
};

// Ensure user is authenticated
if (!authStore.isAuthenticated) {
  await navigateTo("/login");
}

const steps = [
  { id: "basic", label: "Basic Info" },
  { id: "technical", label: "Technical" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review" },
];

const currentStep = ref(0);
const agreedToTerms = ref(false);
const isSubmitting = ref(false);

const techInput = ref("");
const memberInput = ref("");
const memberSearchQuery = ref("");
const iconSearchQuery = ref("");
const editingFeatureIndex = ref(-1);
const featureInput = ref({
  title: "",
  description: "",
  date: "",
  icon: "i-heroicons-star",
  status: "pending",
});

// Suggested team members
const suggestedMembers = ref([
  {
    name: "Sarah Chen",
    role: "Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Alex Kumar",
    role: "Backend Developer",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Maya Rodriguez",
    role: "UI/UX Designer",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    name: "David Park",
    role: "DevOps Engineer",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    name: "Emma Thompson",
    role: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    name: "James Wilson",
    role: "Full Stack Developer",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
]);

// Available icons for features
const availableIcons = ref([
  { name: "i-lucide-server", label: "Server" },
  { name: "i-lucide-bar-chart", label: "Analytics" },
  { name: "i-heroicons-star", label: "Feature" },
  { name: "i-heroicons-shield-check", label: "Security" },
  { name: "i-heroicons-cog-6-tooth", label: "Settings" },
  { name: "i-heroicons-chart-bar", label: "Dashboard" },
  { name: "i-heroicons-user-group", label: "Team" },
  { name: "i-heroicons-lock-closed", label: "Auth" },
  { name: "i-heroicons-device-phone-mobile", label: "Mobile" },
  { name: "i-heroicons-globe-alt", label: "Web" },
  { name: "i-heroicons-cloud", label: "Cloud" },
]);

// Available status options
const availableStatuses = ref([
  { value: "pending", label: "In Pending" },
  { value: "ongoing", label: "Ongoing" },
  { value: "done", label: "Done" },
]);

// Helper functions
const getStatusColor = (status) => {
  switch (status) {
    case "done":
      return "green";
    case "ongoing":
      return "blue";
    case "pending":
    default:
      return "yellow";
  }
};

const getStatusLabel = (status) => {
  const statusOption = availableStatuses.value.find((s) => s.value === status);
  return statusOption ? statusOption.label : status;
};

const isTeamMemberSelected = (member) => {
  return form.value.teamMembers.some(
    (m) => (typeof m === "string" ? m : m.name) === member.name
  );
};

const toggleTeamMember = (member) => {
  const existingIndex = form.value.teamMembers.findIndex(
    (m) => (typeof m === "string" ? m : m.name) === member.name
  );

  if (existingIndex >= 0) {
    form.value.teamMembers.splice(existingIndex, 1);
  } else {
    form.value.teamMembers.push({
      name: member.name,
      role: member.role,
      avatar: member.avatar,
    });
  }
};

// Available categories from store
const availableCategories = computed(() => {
  return projectStore.availableCategories.filter((cat) => cat !== "All");
});

// Computed properties for search filtering
const filteredSuggestedMembers = computed(() => {
  if (!memberSearchQuery.value.trim()) {
    return suggestedMembers.value;
  }
  const query = memberSearchQuery.value.toLowerCase();
  return suggestedMembers.value.filter(
    (member) =>
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
  );
});

const filteredIcons = computed(() => {
  if (!iconSearchQuery.value.trim()) {
    return availableIcons.value;
  }
  const query = iconSearchQuery.value.toLowerCase();
  return availableIcons.value.filter(
    (icon) =>
      icon.label.toLowerCase().includes(query) ||
      icon.name.toLowerCase().includes(query)
  );
});

// Current academic year options
const academicYearOptions = ["2024-2025", "2025-2026", "2026-2027"];

const form = ref({
  title: "",
  description: "",
  thumbnails: [], // Project preview images
  category: "",
  academicYear: "2024-2025",
  technologies: [],
  githubUrl: "",
  demoUrl: "",
  visibility: "public",
  duration: "",
  teamSize: 1,
  teamMembers: [],
  feature: [],
  tags: [],
  course: "",
});

const addTechnology = () => {
  if (
    techInput.value.trim() &&
    !form.value.technologies.includes(techInput.value.trim())
  ) {
    form.value.technologies.push(techInput.value.trim());
    techInput.value = "";
  }
};

const removeTechnology = (index) => {
  form.value.technologies.splice(index, 1);
};

const addTeamMember = () => {
  if (memberInput.value.trim()) {
    const newMember = {
      name: memberInput.value.trim(),
      role: "Team Member",
      avatar: `https://randomuser.me/api/portraits/${
        Math.random() > 0.5 ? "men" : "women"
      }/${Math.floor(Math.random() * 99)}.jpg`,
    };

    if (
      !form.value.teamMembers.find(
        (m) => (typeof m === "string" ? m : m.name) === newMember.name
      )
    ) {
      form.value.teamMembers.push(newMember);
      memberInput.value = "";
    }
  }
};

const removeTeamMember = (index) => {
  form.value.teamMembers.splice(index, 1);
};

const addFeature = () => {
  if (
    featureInput.value.title.trim() &&
    featureInput.value.description.trim()
  ) {
    const newFeature = {
      title: featureInput.value.title.trim(),
      description: featureInput.value.description.trim(),
      date: featureInput.value.date || "",
      icon: featureInput.value.icon || "i-heroicons-star",
      status: featureInput.value.status || "pending",
    };

    if (editingFeatureIndex.value >= 0) {
      // Update existing feature
      form.value.feature[editingFeatureIndex.value] = newFeature;
      editingFeatureIndex.value = -1;
    } else {
      // Add new feature
      form.value.feature.push(newFeature);
    }

    // Reset form
    featureInput.value = {
      title: "",
      description: "",
      date: "",
      icon: "i-heroicons-star",
      status: "pending",
    };
  }
};

const editFeature = (index) => {
  const feature = form.value.feature[index];
  featureInput.value = {
    title: feature.title,
    description: feature.description,
    date: feature.date,
    icon: feature.icon,
    status: feature.status,
  };
  editingFeatureIndex.value = index;
};

const cancelEditFeature = () => {
  editingFeatureIndex.value = -1;
  featureInput.value = {
    title: "",
    description: "",
    date: "",
    icon: "i-heroicons-star",
    status: "pending",
  };
};

const removeFeature = (index) => {
  form.value.feature.splice(index, 1);
};

// Thumbnail upload handlers
const thumbnailInput = ref(null);

const handleThumbnailSelect = (event) => {
  const files = event.target.files;
  if (files) {
    processThumbnailFiles(files);
  }
};

const handleThumbnailDrop = (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files) {
    processThumbnailFiles(files);
  }
};

const processThumbnailFiles = (files) => {
  Array.from(files).forEach((file) => {
    if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
      // 5MB limit
      const reader = new FileReader();
      reader.onload = (e) => {
        form.value.thumbnails.push(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.warn("File must be an image under 5MB");
    }
  });
};

const removeThumbnail = (index) => {
  form.value.thumbnails.splice(index, 1);
};

// Generate tags from form data
const generateTags = () => {
  const tags = new Set();

  // Add category as tag
  if (form.value.category) {
    tags.add(form.value.category.toLowerCase().replace(/\s+/g, "-"));
  }

  // Add some technologies as tags (first 3)
  form.value.technologies.slice(0, 3).forEach((tech) => {
    tags.add(tech.toLowerCase().replace(/\s+/g, "-"));
  });

  return Array.from(tags);
};

const submitForm = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;

    // Generate tags
    form.value.tags = generateTags();

    // Add current user as first team member if not already added (only for new projects)
    if (!editMode.value) {
      const currentUserMember = {
        name: authStore.user?.name || "Current User",
        image:
          authStore.user?.avatar ||
          `https://randomuser.me/api/portraits/women/50.jpg`,
      };

      if (
        !form.value.teamMembers.find((m) => m.name === currentUserMember.name)
      ) {
        form.value.teamMembers.unshift(currentUserMember);
      }
    }

    console.log("=== PROJECT CREATION DEBUG ===");
    console.log("Current user from auth store:", authStore.user);
    console.log("User name:", authStore.user?.name);

    // Prepare project data according to Project interface
    const projectData = {
      title: form.value.title,
      description: form.value.description,
      academicYear: form.value.academicYear,
      author: {
        name: authStore.user?.name || "Current User",
        avatar:
          authStore.user?.avatar ||
          `https://randomuser.me/api/portraits/women/50.jpg`,
        program: authStore.user?.program || "Computer Science",
        year: authStore.user?.year || "4th Year",
      },
      technologies: form.value.technologies,
      category: form.value.category,
      status: editMode.value ? undefined : "In Progress", // Keep existing status when editing
      featured: false,
      visibility: form.value.visibility || "public", // Ensure visibility is included
      demoUrl:
        form.value.demoUrl ||
        `https://${form.value.title
          .toLowerCase()
          .replace(/\s+/g, "-")}.demo.com`,
      githubUrl:
        form.value.githubUrl ||
        `https://github.com/${
          authStore.user?.username || "user"
        }/${form.value.title.toLowerCase().replace(/\s+/g, "-")}`,
      images: form.value.thumbnails,
      tags: form.value.tags,
      members: form.value.teamMembers,
      features: form.value.feature, // Use 'features' to match Project interface
      duration: form.value.duration || "3 months",
      course: form.value.course || "Project Development",
    };

    console.log(
      "Project data to be created:",
      JSON.stringify(projectData, null, 2)
    );
    console.log("Author in project data:", projectData.author);

    let result;
    if (editMode.value) {
      // Update existing project
      result = await projectStore.updateProject(
        editProjectId.value,
        projectData
      );
    } else {
      // Create new project
      console.log("Creating project with data:", projectData);
      console.log(
        "Store projects before creation:",
        projectStore.projects.length
      );

      result = await projectStore.createProject(projectData);

      console.log("Project created with result:", result);
      console.log("Result ID:", result.id, "Type:", typeof result.id);

      // Ensure the new project is in the store's arrays
      // Add to projects array if not already there
      const existsInProjects = projectStore.projects.find(
        (p) => p.id === result.id
      );
      if (!existsInProjects) {
        console.log("Adding project to projects array");
        projectStore.projects.unshift(result);
      }

      // Add to userProjects array if not already there
      const existsInUserProjects = projectStore.userProjects.find(
        (p) => p.id === result.id
      );
      if (!existsInUserProjects) {
        console.log("Adding project to userProjects array");
        projectStore.userProjects.unshift(result);
      }

      console.log(
        "Project added to store. Total projects:",
        projectStore.projects.length,
        "User projects:",
        projectStore.userProjects.length
      );
    }

    console.log(
      `Project ${editMode.value ? "updated" : "created"} successfully:`,
      result
    );

    // Validate project ID before proceeding
    if (!result.id || result.id === -Infinity || isNaN(result.id)) {
      console.error("Invalid project ID:", result.id);
      const toast = useToast();
      toast.add({
        title: "Error",
        description: "Failed to generate valid project ID. Please try again.",
        color: "red",
      });
      return;
    }

    // Show success message with toast
    const toast = useToast();
    toast.add({
      title: "Success!",
      description: `Project ${
        editMode.value ? "updated" : "created"
      } successfully. Redirecting...`,
      color: "green",
      timeout: 2000,
    });

    // Wait a bit for the toast to be visible, then redirect
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Navigate to the project details page
    const projectId = editMode.value ? editProjectId.value : result.id;
    console.log(
      "Navigating to project:",
      projectId,
      "Path:",
      `/student/my-projects/${projectId}`
    );

    // Final validation before navigation
    if (!projectId || projectId === -Infinity || isNaN(projectId)) {
      console.error("Cannot navigate with invalid project ID:", projectId);
      const errorToast = useToast();
      errorToast.add({
        title: "Navigation Error",
        description: "Invalid project ID. Redirecting to projects list.",
        color: "red",
      });
      await navigateTo("/student/my-projects");
      return;
    }

    await navigateTo(`/student/my-projects/${projectId}`);
  } catch (error) {
    console.error(
      `Error ${editMode.value ? "updating" : "creating"} project:`,
      error
    );
    const toast = useToast();
    toast.add({
      title: "Error",
      description: `Failed to ${editMode.value ? "update" : "create"} project`,
      color: "red",
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Validation
const canProceedToNextStep = computed(() => {
  switch (currentStep.value) {
    case 0: // Basic Info
      return (
        form.value.title &&
        form.value.description &&
        form.value.thumbnails.length >= 1 &&
        form.value.category &&
        form.value.academicYear
      );
    case 1: // Technical
      return form.value.technologies.length > 0;
    case 2: // Details
      return form.value.duration && form.value.course;
    case 3: // Review
      return agreedToTerms.value;
    default:
      return false;
  }
});

const nextStep = () => {
  if (currentStep.value < steps.length - 1 && canProceedToNextStep.value) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

useHead({
  title: "Create Project - GIC Student Portal",
  meta: [
    {
      name: "description",
      content: "Create and share your student project with the GIC community",
    },
  ],
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
