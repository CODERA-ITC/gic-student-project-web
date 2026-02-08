<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
    <!-- Breadcrumbs -->
    <UContainer class="mb-6">
      <nav class="flex items-center flex-wrap gap-1 text-sm text-slate-600 dark:text-slate-300">
        <NuxtLink to="/" class="hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
          <UIcon name="i-heroicons-home" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ t("home") }}</span>
        </NuxtLink>
        <span class="text-slate-400 dark:text-slate-500">/</span>
        <NuxtLink to="/projects" class="hover:text-blue-700 dark:hover:text-blue-300">
          {{ t("projects") }}
        </NuxtLink>
        <span class="text-slate-400 dark:text-slate-500">/</span>
        <span class="text-slate-900 dark:text-white font-semibold">
          {{
            editMode ? t("projectForm.editTitle") : t("projectForm.createTitle")
          }}
        </span>
      </nav>
    </UContainer>

    <UContainer>
      <!-- Show main content only when authenticated -->
      <div v-if="!showAuthModal && authStore.isAuthenticated">
        <!-- Back Button -->
        <!-- <div class="mb-8">
          <ButtonsPresetButton
            preset="back"
            to="/projects"
            @click="mobileMenuOpen = false"
          />
        </div> -->

        <!-- Header -->
        <div class="max-w-3xl mx-auto mb-12">
          <div class="flex items-center justify-between mb-2">
            <h1 class="text-5xl font-black font-semibold text-gray-900 dark:text-white">
              {{
                editMode
                  ? t("projectForm.editTitle")
                  : t("projectForm.createTitle")
              }}
            </h1>
            <div v-if="!editMode" class="flex items-center gap-2 text-sm">
              <UIcon :name="isSaving
                ? 'i-heroicons-arrow-path'
                : 'i-heroicons-check-circle'
                " :class="[
                  'w-4 h-4',
                  isSaving ? 'text-blue-500 animate-spin' : 'text-green-500',
                ]" />
              <span class="text-gray-600 dark:text-gray-400">
                {{
                  isSaving
                    ? t("projectForm.saving")
                    : lastSaved
                      ? t("projectForm.saved", {
                        time: formatTimeAgo(lastSaved),
                      })
                      : t("projectForm.autoSave")
                }}
              </span>
            </div>
          </div>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            {{
              editMode
                ? t("projectForm.editSubtitle")
                : t("projectForm.createSubtitle")
            }}
          </p>
        </div>

        <!-- Form Card -->
        <div
          class="max-w-3xl mx-auto bg-white/80 dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-2xl p-8 space-y-8">
          <form @submit.prevent="submitForm" class="space-y-8">
            <!-- Step Indicator -->
            <div class="flex justify-between mb-12">
              <div v-for="(step, idx) in steps" :key="step.id" class="flex items-center flex-1">
                <div :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                  currentStep > idx
                    ? 'bg-blue-900 text-white'
                    : currentStep === idx
                      ? 'bg-blue-900 text-white ring-2 ring-blue-800'
                      : 'bg-gray-300 dark:bg-slate-700 text-gray-600 dark:text-gray-400',
                ]">
                  {{ idx + 1 }}
                </div>
                <div v-if="idx < steps.length - 1" :class="[
                  'flex-1 h-1 mx-2 rounded-full transition-all',
                  currentStep > idx
                    ? 'bg-blue-900'
                    : 'bg-gray-300 dark:bg-slate-700',
                ]"></div>
              </div>
            </div>

            <!-- Step 1: Basic Info -->
            <div v-if="currentStep === 0" class="space-y-6 animate-fadeIn">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ t("projectForm.basicInfo") }}
              </h2>

              <!-- Project Title -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {{ t("projectForm.projectTitle") }}
                </label>
                <input v-model="form.name" type="text" :placeholder="t('projectForm.projectTitlePlaceholder')"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required maxlength="70" />
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ t("projectForm.titleHint") }}
                </p>
              </div>

              <!-- Project Description -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {{ t("projectForm.description") }}
                </label>
                <textarea v-model="form.description" :placeholder="t('projectForm.descriptionPlaceholder')" rows="5"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  required maxlength="300"></textarea>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{
                    t("projectForm.descriptionCount", {
                      count: form.description.length,
                    })
                  }}
                </p>
              </div>

              <!-- Project Thumbnails/Previews -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {{ t("projectForm.thumbnailsLabel") }}
                </label>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {{ t("projectForm.thumbnailsHint") }}
                </p>

                <div class="space-y-4">
                  <!-- Image Upload Area -->
                  <div v-if="form.thumbnails.length < 5" @drop="handleThumbnailDrop" @dragover.prevent="handleDragOver"
                    @dragenter.prevent="handleDragEnter" @dragleave="handleDragLeave" :class="[
                      'border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200',
                      isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-lg ring-2 ring-blue-500 ring-opacity-50'
                        : 'border-gray-300 dark:border-slate-600 hover:border-blue-500 hover:bg-gray-100 dark:hover:bg-slate-700/30',
                    ]">
                    <input ref="thumbnailInput" type="file" accept="image/*" multiple @change="handleThumbnailSelect"
                      class="hidden" />

                    <div class="space-y-3">
                      <UIcon name="i-heroicons-photo" :class="[
                        'w-12 h-12 mx-auto transition-all duration-200',
                        isDragging
                          ? 'text-blue-500 dark:text-blue-400 scale-105 animate-bounce'
                          : 'text-gray-400 dark:text-gray-400',
                      ]" />
                      <div>
                        <p :class="[
                          'font-medium mb-1 transition-colors duration-200',
                          isDragging
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-900 dark:text-white',
                        ]">
                          {{
                            isDragging
                              ? t("projectForm.dropActive")
                              : t("projectForm.dropDefault")
                          }}
                        </p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                          {{ t("projectForm.fileHint") }}
                        </p>
                      </div>
                      <ButtonsPresetButton :label="t('projectForm.addImages')" icon="i-heroicons-plus" color="primary"
                        variant="solid" size="lg" :disabled="form.thumbnails.length >= 5"
                        @click="$refs.thumbnailInput?.click()" />
                    </div>
                  </div>

                  <!-- Image Preview Grid -->
                  <div v-if="form.thumbnails.length > 0" class="space-y-3">
                    <div class="flex items-center justify-between">
                      <p class="text-sm text-gray-700 dark:text-gray-300">
                        {{ form.thumbnails.length }}/5 images
                        <span v-if="form.thumbnails.length < 2" class="text-red-400">({{ 2 - form.thumbnails.length }}
                          more needed)</span>
                        <span v-else class="text-blue-600 dark:text-blue-400">✓</span>
                      </p>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div v-for="(image, index) in form.thumbnails" :key="index" class="relative group">
                        <img :src="typeof image === 'string' ? image : image.preview
                          " :alt="`Project thumbnail ${index + 1}`"
                          class="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-slate-600" />
                        <button type="button" @click="removeThumbnail(index)"
                          class="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                        </button>
                        <div class="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {{ index + 1 }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- No images state -->
                  <div v-else
                    class="text-center py-4 bg-gray-100 dark:bg-slate-700/30 rounded-lg border border-gray-300 dark:border-slate-600">
                    <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p class="text-yellow-600 dark:text-yellow-400 font-medium">
                      No images uploaded
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      Please upload at least 2 project images to continue
                    </p>
                  </div>
                </div>
              </div>

              <!-- Two Column Layout -->
              <div class="grid md:grid-cols-2 gap-6">
                <!-- Category -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Category *
                  </label>
                  <select v-model="form.category"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required>
                    <option disabled value="">Select a category</option>
                    <option v-for="category in availableCategories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>

                <!-- Academic Year -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Academic Year *
                  </label>
                  <input v-model="form.academicYear" type="text" list="academic-year-options"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="e.g., 2025-2026" required />
                  <datalist id="academic-year-options">
                    <option v-for="year in academicYearOptions" :key="year" :value="year" />
                  </datalist>
                </div>
              </div>
            </div>

            <!-- Step 2: Technical Details -->
            <div v-if="currentStep === 1" class="space-y-6 animate-fadeIn">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                Technical Details
              </h2>

              <!-- Technologies -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  Technologies Used *
                </label>
                <div class="space-y-3">
                  <div class="relative tech-suggestion-container">
                    <div class="flex gap-2">
                      <input v-model="techInput" type="text" placeholder="e.g., React, Node.js, MongoDB..."
                        class="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        @keyup.enter="addTechnology" @focus="showTechSuggestions = true"
                        @keydown.escape="showTechSuggestions = false" />
                      <ButtonsPresetButton label="Add" icon="i-heroicons-plus" color="primary" variant="solid" size="lg"
                        @click="addTechnology" />
                    </div>

                    <!-- Technology Suggestions Dropdown -->
                    <div v-if="showTechSuggestions && techSuggestions.length > 0"
                      class="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      <div v-for="suggestion in techSuggestions" :key="suggestion"
                        @click="selectTechSuggestion(suggestion)"
                        class="px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-100 dark:border-slate-700 last:border-b-0 transition-colors">
                        <span class="font-medium text-blue-900 dark:text-white">{{ suggestion }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <UBadge v-for="(tech, idx) in form.technologies" :key="idx"
                      class="cursor-pointer hover:opacity-80 bg-blue-900 text-white"
                      @click="form.technologies.splice(idx, 1)">
                      {{ tech }}
                      <UIcon name="i-heroicons-x-mark" class="w-4 h-4 ml-1" />
                    </UBadge>
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  Tags
                </label>
                <div class="space-y-3">
                  <div class="relative tag-suggestion-container">
                    <div class="flex gap-2">
                      <input v-model="tagInput" type="text" placeholder="e.g., AI, Machine Learning, Web Development..."
                        class="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        @keyup.enter="addTag" @focus="showTagSuggestions = true"
                        @keydown.escape="showTagSuggestions = false" />
                      <ButtonsPresetButton label="Add" icon="i-heroicons-plus" color="primary" variant="solid" size="lg"
                        @click="addTag" />
                    </div>

                    <!-- Tag Suggestions Dropdown -->
                    <div v-if="showTagSuggestions && tagSuggestions.length > 0"
                      class="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      <div v-for="suggestion in tagSuggestions" :key="suggestion"
                        @click="selectTagSuggestion(suggestion)"
                        class="px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-100 dark:border-slate-700 last:border-b-0 transition-colors">
                        <span class="font-medium text-blue-900 dark:text-white">{{ suggestion }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <UBadge v-for="(tag, idx) in form.tags" :key="idx"
                      class="cursor-pointer hover:opacity-80 bg-blue-900 text-white" @click="form.tags.splice(idx, 1)">
                      {{ tag }}
                      <UIcon name="i-heroicons-x-mark" class="w-4 h-4 ml-1" />
                    </UBadge>
                  </div>
                </div>
              </div>

              <!-- GitHub URL -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  GitHub Repository URL
                </label>
                <input v-model="form.githubUrl" type="url" placeholder="https://github.com/username/project"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
              </div>

              <!-- Demo URL -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Live Demo URL
                </label>
                <input v-model="form.demoUrl" type="url" placeholder="https://your-project-demo.com"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
              </div>
            </div>

            <!-- Step 3: Project Details -->
            <div v-if="currentStep === 2" class="space-y-6 animate-fadeIn">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                Project Details
              </h2>

              <!-- Team Size and Level -->
              <!-- <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Team Size (Auto-calculated)
                  </label>
                  <input
                    :value="form.teamMembers.length"
                    type="number"
                    disabled
                    class="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white cursor-not-allowed"
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Team size updates automatically based on selected members
                  </p>
                </div>
              </div> -->

              <!-- Team Members -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  Team Members ({{ form.teamMembers.length }})
                </label>
                <div class="space-y-4">
                  <!-- Prerendered Team Member Selection -->
                  <div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Select from suggested members:
                    </p>
                    <!-- Member Search -->
                    <div class="mb-3">
                      <div class="relative">
                        <input v-model="memberSearchQuery" type="text" placeholder="Search members by name or role..."
                          class="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          @keydown.escape="memberSearchQuery = ''" />
                        <UIcon v-if="isSearchingMembers" name="i-heroicons-arrow-path"
                          class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
                      </div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      <div v-for="suggestedMember in filteredSuggestedMembers" :key="suggestedMember.id"
                        @click="toggleTeamMember(suggestedMember)" :class="[
                          'p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105',
                          isTeamMemberSelected(suggestedMember)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500',
                        ]">
                        <div class="flex items-center gap-2">
                          <img :src="suggestedMember.avatar"
                            :alt="`${suggestedMember.firstName} ${suggestedMember.lastName}`"
                            class="w-8 h-8 rounded-full" />
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {{ suggestedMember.firstName }}
                              {{ suggestedMember.lastName }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {{ suggestedMember.role }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p v-if="
                      filteredSuggestedMembers.length === 0 &&
                      debouncedMemberSearchQuery
                    " class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No members found matching "{{
                        debouncedMemberSearchQuery
                      }}"
                    </p>
                  </div>

                  <!-- Selected Team Members Display -->
                  <div v-if="form.teamMembers.length > 0" class="space-y-2">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Selected Team Members:
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <div v-for="(member, idx) in form.teamMembers" :key="idx"
                        class="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <img v-if="member.avatar" :src="member.avatar" :alt="member.name"
                          class="w-6 h-6 rounded-full" />
                        <span class="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {{
                            typeof member === "string" ? member : member.name
                          }}
                        </span>
                        <button type="button" @click="form.teamMembers.splice(idx, 1)"
                          class="text-blue-400 hover:text-red-500 transition-colors">
                          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Project Features -->
              <div>
                <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Project Features / Milestones
                  </label>
                  <span :class="[
                    'text-xs font-medium',
                    featureCountState.color === 'success'
                      ? 'text-green-600 dark:text-green-400'
                      : featureCountState.color === 'warning'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-red-600 dark:text-red-400',
                  ]">
                    {{ featureCountState.message }}
                  </span>
                </div>
                <div class="space-y-4">
                  <!-- Icon Selection -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Select Icon
                    </label>
                    <!-- Icon Search -->
                    <div class="mb-3">
                      <input v-model="iconSearchQuery" type="text" placeholder="Search icons..."
                        class="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                    </div>
                    <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      <button v-for="iconOption in filteredIcons" :key="iconOption.name" type="button"
                        @click="featureInput.icon = iconOption.name" :class="[
                          'p-2 rounded-lg border-2 transition-all hover:scale-105',
                          featureInput.icon === iconOption.name
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-slate-600 hover:border-gray-300',
                        ]" :title="iconOption.label">
                        <UIcon :name="iconOption.name" class="w-5 h-5 text-gray-900 dark:text-white" />
                      </button>
                    </div>
                    <p v-if="filteredIcons.length === 0 && iconSearchQuery"
                      class="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                      No icons found matching "{{ iconSearchQuery }}"
                    </p>
                  </div>

                  <!-- Feature Details -->
                  <div class="grid grid-cols-1 md:grid-cols-1 gap-3">
                    <input v-model="featureInput.name" type="text"
                      placeholder="Feature title (e.g., User Authentication)"
                      class="px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                    <!-- <input
                                            type="date"
                      class="px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    /> -->
                  </div>

                  <div class="flex gap-2">
                    <textarea v-model="featureInput.description" placeholder="Feature description..." rows="2"
                      class="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"></textarea>
                  </div>

                  <div class="flex flex-col sm:flex-row gap-2">
                    <ButtonsPresetButton :label="editingFeatureIndex >= 0
                      ? 'Update Feature'
                      : 'Add Feature'
                      " :icon="editingFeatureIndex >= 0
                        ? 'i-heroicons-check'
                        : 'i-heroicons-plus'
                        " color="primary" variant="solid" size="lg" :disabled="!featureInput.name ||
                          !featureInput.description ||
                          (form.feature.length >= MAX_FEATURES &&
                            editingFeatureIndex < 0)
                          " @click="addFeature" />
                    <ButtonsPresetButton v-if="editingFeatureIndex >= 0" label="Cancel" icon="i-heroicons-x-mark"
                      color="gray" variant="soft" size="lg" @click="cancelEditFeature" />
                  </div>

                  <div class="space-y-2" v-if="form.feature.length > 0">
                    <div v-for="(feature, idx) in form.feature" :key="idx"
                      class="flex items-start justify-between px-4 py-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <UIcon :name="feature.icon" class="w-4 h-4 text-blue-400" />
                          <span class="font-medium text-gray-900 dark:text-white">{{ feature.name }}</span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300">
                          {{ feature.description }}
                        </p>
                      </div>
                      <div class="flex gap-1 ml-2">
                        <button type="button" @click="editFeature(idx)"
                          class="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                          title="Edit feature">
                          <UIcon name="i-heroicons-pencil-square-20-solid" class="w-4 h-4" />
                        </button>
                        <button type="button" @click="removeFeature(idx)"
                          class="text-gray-500 dark:text-gray-400 hover:text-red-400 transition-colors"
                          title="Remove feature">
                          <UIcon name="i-heroicons-trash-20-solid" class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Duration and Course -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Project Duration *
                  </label>
                  <select v-model="form.duration"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required>
                    <option value="">Select duration</option>
                    <option v-for="duration in durationOptions" :key="duration" :value="duration">
                      {{ duration }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Course / Subject *
                  </label>

                  <select v-model="form.course" required
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    <option disabled value="">Select a course</option>

                    <option v-for="course in availableCourses" :key="course.id || course.name || course"
                      :value="course.id || course.name || course">
                      {{ course.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Step 4: Review & Submit -->
            <div v-if="currentStep === 3" class="space-y-6 animate-fadeIn">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                Review Your Project
              </h2>

              <!-- Project Preview -->
              <div
                class="bg-gray-100 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl p-6 space-y-4">
                <div class="flex items-start justify-between">
                  <div class="space-y-2">
                    <div v-if="form.thumbnails.length > 0" class="flex gap-2 mb-3">
                      <div v-for="(thumbnail, index) in form.thumbnails.slice(
                        0,
                        3,
                      )" :key="index"
                        class="w-12 h-12 rounded-lg overflow-hidden border border-gray-300 dark:border-slate-600">
                        <img :src="typeof thumbnail === 'string'
                          ? thumbnail
                          : thumbnail.preview
                          " :alt="`Thumbnail ${index + 1}`" class="w-full h-full object-cover" />
                      </div>
                      <div v-if="form.thumbnails.length > 3"
                        class="w-12 h-12 rounded-lg bg-gray-300 dark:bg-slate-600 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400">
                        +{{ form.thumbnails.length - 3 }}
                      </div>
                    </div>
                    <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">
                      {{ form.name }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                      {{ form.category }} • {{ form.academicYear }}
                    </p>
                  </div>
                </div>

                <p class="text-gray-700 dark:text-gray-300">
                  {{ form.description }}
                </p>

                <div class="space-y-3 border-t border-gray-200 dark:border-slate-600 pt-4">
                  <div v-if="form.technologies.length > 0">
                    <p class="text-xs text-gray-500 dark:text-gray-500">
                      Technologies
                    </p>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <UBadge v-for="tech in form.technologies" :key="tech" color="primary" variant="soft" size="sm">
                        {{ tech }}
                      </UBadge>
                    </div>
                  </div>

                  <div v-if="form.technologies.length > 0">
                    <p class="text-xs text-gray-500 dark:text-gray-500">Tags</p>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <UBadge v-for="tag in form.tags" :key="tag" color="primary" variant="soft" size="sm">
                        {{ tag }}
                      </UBadge>
                    </div>
                  </div>

                  <div v-if="form.teamMembers.length > 0">
                    <p class="text-xs text-gray-500 dark:text-gray-500">
                      Team Members
                    </p>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <div v-for="member in form.teamMembers" :key="typeof member === 'string' ? member : member.name"
                        class="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <img v-if="typeof member === 'object' && member.avatar" :src="member.avatar" :alt="member.name"
                          class="w-5 h-5 rounded-full" />
                        <UIcon v-else name="i-heroicons-user-circle" class="w-5 h-5 text-blue-500" />
                        <span class="text-sm text-blue-700 dark:text-blue-300">
                          {{
                            typeof member === "string" ? member : member.name
                          }}
                        </span>
                        <span v-if="typeof member === 'object' && member.role"
                          class="text-xs text-blue-500 dark:text-blue-400">
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
                      <div v-for="(feature, index) in form.feature.slice(0, 3)" :key="index"
                        class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-600/30 rounded-lg">
                        <UIcon :name="feature.icon" class="w-4 h-4 text-blue-500" />
                        <span class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ feature.name }}
                        </span>
                        <UBadge variant="soft" size="xs">
                        </UBadge>
                      </div>
                      <p v-if="form.feature.length > 3" class="text-xs text-gray-400 text-center">
                        +{{ form.feature.length - 3 }} more features
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Terms Agreement -->
              <label class="flex items-start gap-3 cursor-pointer">
                <input v-model="agreedToTerms" type="checkbox"
                  class="w-4 h-4 mt-1 text-blue-600 rounded border-gray-300 dark:border-slate-600" />
                <span class="text-sm text-gray-700 dark:text-gray-300">
                  {{
                    editMode
                      ? t("projectForm.termsEdit")
                      : t("projectForm.termsCreate")
                  }}
                </span>
              </label>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between pt-8 border-t border-gray-200 dark:border-slate-700">
              <ButtonsPresetButton v-if="currentStep > 0" preset="back" @click="prevStep" />

              <div class="ml-auto flex gap-3">
                <ButtonsPresetButton v-if="editMode && currentStep < steps.length - 1"
                  :label="t('projectForm.finishUpdate')" icon="i-heroicons-forward" color="gray" variant="ghost"
                  @click="skipToReview" />
                <ButtonsPresetButton v-if="currentStep < steps.length - 1" :label="t('projectForm.next')"
                  :icon="`i-heroicons-arrow-right`" color="primary" variant="solid" size="md"
                  :disabled="!canProceedToNextStep" @click="nextStep" />

                <ButtonsPresetButton v-if="currentStep === steps.length - 1" :preset="editMode ? 'confirm' : 'submit'"
                  :disabled="!canProceedToNextStep || isSubmitting" :loading="isSubmitting" @click="submitForm">
                  {{
                    isSubmitting
                      ? editMode
                        ? t("projectForm.updating")
                        : t("projectForm.creating")
                      : editMode
                        ? t("projectForm.updateProject")
                        : t("projectForm.createProject")
                  }}
                </ButtonsPresetButton>
              </div>
            </div>
          </form>
        </div>
      </div>
      <!-- End of authenticated content wrapper -->

      <!-- Loading/Auth Check State -->
      <div v-if="showAuthModal" class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <UIcon name="i-heroicons-lock-closed" class="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
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

    <!-- Draft Restoration Modal -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showDraftModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          @click.self="dismissDraft">
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-slate-700 transform transition-all"
            @click.stop>
            <div class="p-6">
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Draft Found
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{
                      draftData
                        ? new Date(draftData.savedAt).toLocaleString()
                        : ""
                    }}
                  </p>
                </div>
                <button @click="dismissDraft"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                  <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
                </button>
              </div>

              <p class="text-gray-700 dark:text-gray-300 mb-6">
                We found a saved draft of your project. Would you like to
                restore it and continue where you left off?
              </p>

              <div class="flex gap-3">
                <ButtonsPresetButton label="Dismiss" icon="i-heroicons-x-mark" color="gray" variant="soft"
                  class="flex-1" @click="dismissDraft" />
                <ButtonsPresetButton label="Restore Draft" icon="i-heroicons-arrow-path" color="primary" variant="solid"
                  class="flex-1" @click="restoreDraft" />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProjectStore } from "~/stores/projects";
import { useAuthStore } from "~/stores/auth";
const { t } = useI18n();
import {
  availableIcons,
  searchIcons,
  getFeaturedIcons,
} from "~/constants/icons";
import {
  searchTeamMembers,
  durationOptions,
  technologiesOptions,
} from "~/constants/project-options";
import { getRandomProject } from "~/lib/RandomProject";
const toast = useToast();

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const authStore = useAuthStore();

// Check if we're in edit mode
const editMode = ref(false);
const editProjectId = ref(null);

// Initialize edit mode if edit parameter is provided
onMounted(async () => {
  // Check authentication first
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true;
    await navigateTo("/login");
    return;
  }

  // First load categories and tags

  if (
    !projectStore.availableCategories.length ||
    !projectStore.availableTags.length ||
    !projectStore.availableCourses.length
  ) {
    await Promise.all([
      projectStore.fetchCategories(),
      projectStore.fetchTags(),
      projectStore.fetchCourses(),
    ]);
  }

  // Then check for edit mode
  const editId = route.query.edit;
  if (editId) {
    editMode.value = true;
    editProjectId.value = editId;
    await loadProjectForEditing(editId);
  } else {
    // Load from localStorage only if not in edit mode
    loadFromLocalStorage();
  }

  // Save on beforeunload (page close/refresh)
  if (process.client) {
    window.addEventListener("beforeunload", (e) => {
      if (!editMode.value && !isSubmitting.value) {
        saveToLocalStorage();
      }
    });

    // Handle click outside for tag suggestions
    // Remove any existing listener first to prevent duplicates
    document.removeEventListener("click", handleClickOutsideTag);
    document.addEventListener("click", handleClickOutsideTag);
  }
});

// Hide suggestions when clicking outside
const handleClickOutsideTag = (event) => {
  const target = event.target;

  // Check if click is outside tech suggestions
  const techContainer = target.closest(".tech-suggestion-container");
  if (!techContainer) {
    showTechSuggestions.value = false;
  }

  // Check if click is outside tag suggestions
  const tagContainer = target.closest(".tag-suggestion-container");
  if (!tagContainer) {
    showTagSuggestions.value = false;
  }
};

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener("click", handleClickOutsideTag);
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
      // Normalize members structure to ensure avatar/image property consistency
      const normalizedMembers = (project.members || []).map((member) => {
        if (typeof member === "string") {
          return { name: member, role: "", avatar: "" };
        }
        return {
          name: member.name || "",
          role: member.role || "",
          avatar: getAvatarUrl(member.image || member.avatar, member.name),
        };
      });

      const categoryValue =
        typeof project.category === "object"
          ? project.category.name || project.category.id || ""
          : project.category || "";
      const courseValue =
        typeof project.course === "object"
          ? project.course.name ||
          project.course.id ||
          project.course.code ||
          ""
          : project.course ||
          project.courseName ||
          project.courseId ||
          project.courseCode ||
          "";

      const durationValue =
        project.duration ||
        project.projectDuration ||
        project.durationLabel ||
        project.durationText ||
        project.timelineDuration ||
        "";

      const normalizedThumbnails = (project.images || [])
        .map((img) => {
          if (typeof img === "string") return img;
          return (
            img.originalUrl ||
            img.thumbnailUrl ||
            img.url ||
            img.imageUrl ||
            img.path ||
            img.preview ||
            ""
          );
        })
        .filter(Boolean);

      Object.assign(form, {
        name: project.name || project.title || "",
        description: project.description || "",
        thumbnails: normalizedThumbnails,
        category: categoryValue,
        academicYear: project.academicYear || "",
        technologies: project.technologies || [],
        githubUrl: project.githubUrl || "",
        demoUrl: project.demoUrl || "",
        duration: durationValue,
        teamSize: normalizedMembers.length || 1,
        teamMembers: normalizedMembers,
        feature: project.features || project.feature || [],
        tags: Array.isArray(project.tags)
          ? project.tags.map((t) => (typeof t === "string" ? t : t.name))
          : [],
        course: courseValue,
      });
    }
  } catch (error) {
    console.error("Error loading project for editing:", error);
    toast.add({
      title: "Error",
      description: "Failed to load project data for editing",
      color: "red",
    });
  }
};

const steps = [
  { id: "basic", label: "Basic Info" },
  { id: "technical", label: "Technical" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review" },
];

const showAuthModal = ref(false);
const currentStep = ref(0);
const agreedToTerms = ref(false);
const isSubmitting = ref(false);
const lastSaved = ref(null);
const isSaving = ref(false);

const techInput = ref("");
const tagInput = ref("");
const memberInput = ref("");
const showTagSuggestions = ref(false);
const showTechSuggestions = ref(false);
const debouncedTechInput = ref("");
const debouncedTagInput = ref("");
const debouncedMemberSearchQuery = ref("");
const memberSearchQuery = ref("");
const iconSearchQuery = ref("");
const editingFeatureIndex = ref(-1);
const MIN_FEATURES = 4;
const MAX_FEATURES = 10;

const featureInput = ref({
  name: "",
  description: "",
  icon: "i-heroicons-star",
});

const featureCountState = computed(() => {
  const count = form.feature.length;
  if (count === 0) {
    return {
      color: "warning",
      message: `Add ${MIN_FEATURES} features`,
    };
  }
  if (count < MIN_FEATURES) {
    return {
      color: "warning",
      message: `${count}/${MIN_FEATURES} added · need ${MIN_FEATURES - count
        } more`,
    };
  }
  if (count > MAX_FEATURES) {
    return {
      color: "error",
      message: `${count}/${MAX_FEATURES} · remove ${count - MAX_FEATURES
        } to continue`,
    };
  }
  return {
    color: "success",
    message: `${count} features ready`,
  };
});

// Draft restoration modal
const showDraftModal = ref(false);
const draftData = ref(null);

// Dynamic team members from API search
const suggestedMembers = ref([]);
const isSearchingMembers = ref(false);

// Available categories from store
const availableCategories = computed(() => {
  return projectStore.availableCategories.filter((cat) => cat !== "All");
});

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Helper function to generate avatar URL from name
const generateAvatarFromName = (name) => {
  const initials = getInitials(name);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=random&color=fff&bold=true&size=128`;
};

// Helper functions for team members
const isTeamMemberSelected = (member) => {
  // Use ID comparison to handle users with same name but different IDs
  return form.teamMembers.some((m) => {
    // If m is a string, it's old data, compare by name
    if (typeof m === "string") {
      const memberName = `${member.firstName} ${member.lastName}`;
      return m === memberName;
    }
    // Use ID comparison for proper selection
    return m.id === member.id;
  });
};

// Computed properties for search filtering
const filteredSuggestedMembers = computed(() => {
  // Deduplicate by user ID to prevent showing same user multiple times
  const uniqueMembers = new Map();
  suggestedMembers.value.forEach((member) => {
    if (!uniqueMembers.has(member.id)) {
      uniqueMembers.set(member.id, member);
    }
  });
  return Array.from(uniqueMembers.values()).slice(0, 5);
});

// Debounce member search input and call API
let memberDebounceTimeout = null;
watch(memberSearchQuery, async (newValue) => {
  clearTimeout(memberDebounceTimeout);

  if (!newValue.trim()) {
    suggestedMembers.value = [];
    debouncedMemberSearchQuery.value = "";
    return;
  }

  memberDebounceTimeout = setTimeout(async () => {
    debouncedMemberSearchQuery.value = newValue;

    try {
      isSearchingMembers.value = true;
      const results = await authStore.searchUsers(newValue);

      // Transform API results to match TeamMember interface
      // Deduplicate results from API by ID before mapping
      const uniqueResults = [];
      const seenIds = new Set();

      results.forEach((user) => {
        const userId = user.id?.toString();
        if (userId && !seenIds.has(userId)) {
          seenIds.add(userId);
          uniqueResults.push(user);
        }
      });

      suggestedMembers.value = uniqueResults.map((user, index) => {
        const fullName = user.name || "Unknown User";
        return {
          id: user.id,
          firstName: fullName.split(" ")[0] || "",
          lastName: fullName.split(" ").slice(1).join(" ") || "",
          role: "Team Member",
          avatar: user.avatar || generateAvatarFromName(fullName),
        };
      });
    } catch (error) {
      console.error("Failed to search members:", error);
      suggestedMembers.value = [];
    } finally {
      isSearchingMembers.value = false;
    }
  }, 300);
});

const { availableCourses } = storeToRefs(projectStore);

const filteredIcons = computed(() => {
  if (!iconSearchQuery.value) {
    return getFeaturedIcons(15);
  }
  return searchIcons(iconSearchQuery.value);
});

// For demo purposes, pre-fill form with sample data
const form = reactive(getRandomProject());
const academicYearOptions = computed(() => {
  const current = new Date().getFullYear();
  const previous = current - 1;
  const earlier = previous - 1;
  return [`${previous}-${current}`, `${earlier}-${previous}`];
});
form.academicYear = academicYearOptions.value[0];

// LocalStorage management
const FORM_STORAGE_KEY = "gic-project-draft";

const saveToLocalStorage = () => {
  if (editMode.value) return; // Don't save drafts when editing

  // Check if form has any meaningful content before saving
  const hasContent =
    form.name?.trim() ||
    form.description?.trim() ||
    form.category ||
    form.academicYear ||
    (form.technologies && form.technologies.length > 0) ||
    (form.thumbnails && form.thumbnails.length > 0) ||
    form.githubUrl?.trim() ||
    form.demoUrl?.trim() ||
    (form.teamMembers && form.teamMembers.length > 0) ||
    (form.tags && form.tags.length > 0);

  if (!hasContent) {
    // Don't save completely empty drafts
    return;
  }

  try {
    isSaving.value = true;
    // Exclude thumbnails (base64 images) from localStorage to avoid quota issues
    const { thumbnails, ...formDataWithoutImages } = form;
    const formData = {
      ...formDataWithoutImages,
      thumbnailCount: thumbnails?.length || 0, // Save only the count
      currentStep: currentStep.value,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    lastSaved.value = new Date();

    setTimeout(() => {
      isSaving.value = false;
    }, 500);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    isSaving.value = false;

    // Handle quota exceeded error
    if (error.name === "QuotaExceededError") {
      // Clear the draft to free up space
      try {
        localStorage.removeItem(FORM_STORAGE_KEY);
        console.warn(
          "localStorage quota exceeded. Auto-save disabled for this session.",
        );
      } catch (clearError) {
        console.error("Failed to clear localStorage:", clearError);
      }
    }
  }
};

const loadFromLocalStorage = () => {
  if (editMode.value) return; // Don't load drafts when editing

  try {
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);

      // Store draft data and show modal
      draftData.value = parsed;
      showDraftModal.value = true;
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
};

const restoreDraft = () => {
  if (!draftData.value) return;

  const parsed = draftData.value;

  // Restore form data individually (preserving existing thumbnails and reactivity)
  form.name = parsed.name || parsed.title || ""; // Support old drafts with 'title'
  form.description = parsed.description || "";
  // Don't restore thumbnails - they weren't saved to avoid quota issues
  form.category = parsed.category || "";
  form.academicYear = parsed.academicYear || academicYearOptions.value[0];
  form.technologies = parsed.technologies || [];
  form.githubUrl = parsed.githubUrl || "";
  form.demoUrl = parsed.demoUrl || "";
  form.duration = parsed.duration || "";
  form.teamSize = parsed.teamSize || 1;
  form.teamMembers = parsed.teamMembers || [];
  form.feature = parsed.feature || [];
  form.tags = parsed.tags || [];
  form.course = parsed.course || "";

  currentStep.value = parsed.currentStep || 0;
  lastSaved.value = new Date(parsed.savedAt);

  showDraftModal.value = false;
  draftData.value = null;

  toast.add({
    title: "Draft Restored",
    description: "Your previous work has been restored.",
    color: "success",
    timeout: 3000,
  });
};

const dismissDraft = () => {
  showDraftModal.value = false;
  draftData.value = null;
  clearLocalStorage();
};

const clearLocalStorage = () => {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY);
    lastSaved.value = null;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return "today";
};

// Technology suggestions from static options
const techSuggestions = computed(() => {
  if (!debouncedTechInput.value.trim()) return [];

  const input = debouncedTechInput.value.toLowerCase();

  return technologiesOptions
    .filter(
      (tech) =>
        tech.toLowerCase().includes(input) && !form.technologies.includes(tech),
    )
    .slice(0, 5);
});

// Debounce tech input
let techDebounceTimeout = null;
watch(techInput, (newValue) => {
  clearTimeout(techDebounceTimeout);
  techDebounceTimeout = setTimeout(() => {
    debouncedTechInput.value = newValue;
  }, 300);
});

const selectTechSuggestion = (suggestion) => {
  if (!form.technologies.includes(suggestion)) {
    form.technologies.push(suggestion);
  }
  techInput.value = "";
  showTechSuggestions.value = false;
};

const addTechnology = () => {
  if (
    techInput.value.trim() &&
    !form.technologies.includes(techInput.value.trim())
  ) {
    form.technologies.push(techInput.value.trim());
    techInput.value = "";
    showTechSuggestions.value = false;
  }
};

// Watch form changes and auto-save with debounce
let saveTimeout = null;
watch(
  () => form,
  () => {
    if (!editMode.value) {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveToLocalStorage();
      }, 2000); // Save 2 seconds after user stops typing
    }
  },
  { deep: true },
);

// Watch currentStep changes and save
watch(
  () => currentStep.value,
  () => {
    if (!editMode.value) {
      saveToLocalStorage();
    }
  },
);

// Tag suggestions from store
const tagSuggestions = computed(() => {
  if (!debouncedTagInput.value.trim()) return [];

  const input = debouncedTagInput.value.toLowerCase();

  const availableTags = projectStore.availableTags || [];

  console.log("Available tags for suggestions:", availableTags);

  return availableTags
    .filter(
      (tag) => tag.toLowerCase().includes(input) && !form.tags.includes(tag),
    )
    .slice(0, 5);
});

// Debounce tag input
let tagDebounceTimeout = null;
watch(tagInput, (newValue) => {
  clearTimeout(tagDebounceTimeout);
  tagDebounceTimeout = setTimeout(() => {
    debouncedTagInput.value = newValue;
  }, 300);
});

const selectTagSuggestion = (suggestion) => {
  if (!form.tags.includes(suggestion)) {
    form.tags.push(suggestion);
  }
  tagInput.value = "";
  showTagSuggestions.value = false;
};

const addTag = () => {
  if (tagInput.value.trim() && !form.tags.includes(tagInput.value.trim())) {
    form.tags.push(tagInput.value.trim());
    tagInput.value = "";
    showTagSuggestions.value = false;
  }
};

const toggleTeamMember = (member) => {
  const memberName = `${member.firstName} ${member.lastName}`;

  // Use ID for comparison to handle users with same name
  const existingIndex = form.teamMembers.findIndex((m) => {
    // If m is a string, it's old data, use name comparison
    if (typeof m === "string") {
      return m === memberName;
    }
    // Use ID comparison for proper selection
    return m.id === member.id;
  });

  if (existingIndex >= 0) {
    // Remove member if already selected
    form.teamMembers.splice(existingIndex, 1);
  } else {
    // Add member if not selected - include ID
    form.teamMembers.push({
      id: member.id,
      name: memberName,
      role: member.role,
      avatar: member.avatar,
    });

    suggestedMembers.value = [];
    memberSearchQuery.value = "";
    debouncedMemberSearchQuery.value = "";
  }
};

const addFeature = () => {
  if (featureInput.value.name.trim() && featureInput.value.description.trim()) {
    const newFeature = {
      name: featureInput.value.name.trim(),
      description: featureInput.value.description.trim(),
      icon: featureInput.value.icon || "i-heroicons-star",
    };

    if (editingFeatureIndex.value >= 0) {
      // Update existing feature
      form.feature[editingFeatureIndex.value] = newFeature;
      editingFeatureIndex.value = -1;
    } else {
      // Add new feature
      form.feature.push(newFeature);
    }

    // Reset form
    featureInput.value = {
      name: "",
      description: "",
      icon: "i-heroicons-star",
    };
  }
};

const editFeature = (index) => {
  const feature = form.feature[index];
  featureInput.value = {
    name: feature.name || feature.title, // Support old features with 'title'
    description: feature.description,
    icon: feature.icon,
  };
  editingFeatureIndex.value = index;
};

const cancelEditFeature = () => {
  editingFeatureIndex.value = -1;
  featureInput.value = {
    name: "",
    description: "",
    icon: "i-heroicons-star",
  };
};

const removeFeature = (index) => {
  form.feature.splice(index, 1);
};

// Thumbnail upload handlers
const thumbnailInput = ref(null);
const isDragging = ref(false);
let dragCounter = 0;

const handleDragEnter = (event) => {
  event.preventDefault();
  dragCounter++;
  isDragging.value = true;
};

const handleDragLeave = (event) => {
  dragCounter--;
  if (dragCounter === 0) {
    isDragging.value = false;
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleThumbnailSelect = (event) => {
  const files = event.target.files;
  if (files) {
    processThumbnailFiles(files);
  }
};

const handleThumbnailDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;
  dragCounter = 0;
  const files = event.dataTransfer.files;
  if (files) {
    processThumbnailFiles(files);
  }
};

const processThumbnailFiles = (files) => {
  const MAX_IMAGES = 5;
  const currentCount = form.thumbnails.length;
  const remainingSlots = MAX_IMAGES - currentCount;

  if (remainingSlots <= 0) {
    toast.add({
      title: "Image Limit Reached",
      description: "You can only upload a maximum of 5 images per project.",
      color: "warning",
    });
    return;
  }

  let filesProcessed = 0;
  Array.from(files).forEach((file) => {
    if (filesProcessed >= remainingSlots) {
      toast.add({
        title: "Image Limit Reached",
        description: `Only ${remainingSlots} more image(s) can be added. Maximum is 5 images per project.`,
        color: "warning",
      });
      return;
    }

    if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
      // 5MB limit
      const reader = new FileReader();
      reader.onload = (e) => {
        form.thumbnails.push({
          preview: e.target.result,
          file: file,
        });
      };
      reader.readAsDataURL(file);
      filesProcessed++;
    } else {
      console.warn("File must be an image under 5MB");
    }
  });
};

const removeThumbnail = (index) => {
  form.thumbnails.splice(index, 1);
};

// Generate tags from form data
const generateTags = () => {
  const tags = new Set();

  // Add category as tag
  if (form.category) {
    tags.add(form.category.toLowerCase().replace(/\s+/g, "-"));
  }

  // Add some technologies as tags (first 3)
  form.technologies.slice(0, 3).forEach((tech) => {
    tags.add(tech.toLowerCase().replace(/\s+/g, "-"));
  });

  return Array.from(tags);
};

const submitForm = async () => {
  if (isSubmitting.value) return;

  try {
    isSubmitting.value = true;

    const featureCount = form.feature.length;
    if (featureCount < MIN_FEATURES || featureCount > MAX_FEATURES) {
      toast.add({
        title: "Add project features",
        description: `Please include between ${MIN_FEATURES} and ${MAX_FEATURES} features before submitting. Currently ${featureCount}.`,
        color: "warning",
      });
      isSubmitting.value = false;
      return;
    }

    // Generate tags
    // form.tags = generateTags();

    // Add current user as first team member if not already added (only for new projects)
    // if (!editMode.value) {
    //   const currentUserMember = {
    //     id: authStore.user?.id,
    //     name: authStore.user?.name || "Current User",
    //     avatarUrl: getAvatarUrl(
    //       authStore.user?.avatar,
    //       authStore.user?.firstName || "",
    //       authStore.user?.lastName || "",
    //     ),
    //   };

    //   if (!form.teamMembers.find((m) => m.name === currentUserMember.name)) {
    //     form.teamMembers.unshift(currentUserMember);
    //   }
    // }

    // Prepare project data according to Project interface
    const projectData = {
      name: form.name,
      description: form.description,
      academicYear: form.academicYear,
      author: {
        id: authStore.user?.id,
        name: authStore.user?.name || "Current User",
        avatar: getAvatarUrl(
          authStore.user?.avatar,
          authStore.user?.firstName || "",
          authStore.user?.lastName || "",
        ),
        program: authStore.user?.program || "Computer Science",
        year: authStore.user?.year || "4th Year",
      },
      technologies: form.technologies,
      category: form.category,
      status: editMode.value ? undefined : "In Progress", // Keep existing status when editing
      featured: false,
      demoUrl:
        form.demoUrl ||
        `https://${form.name.toLowerCase().replace(/\s+/g, "-")}.demo.com`,
      githubUrl:
        form.githubUrl ||
        `https://github.com/${authStore.user?.username || "user"
        }/${form.name.toLowerCase().replace(/\s+/g, "-")}`,
      images: form.thumbnails.map((t) => (typeof t === "string" ? t : t.file)),
      tags: form.tags,
      members: form.teamMembers.map((member) => {
        return {
          id: member.id,
          name: member.name || "",
          role: member.role || "",
          avatarUrl: member.avatar || member.image || "",
        };
      }),
      features: form.feature, // Use 'features' to match Project interface
      duration: form.duration || "3 months",
      course: form.course || "Project Development",
    };

    let result;
    if (editMode.value) {
      result = await projectStore.updateProject(
        editProjectId.value,
        projectData,
      );
    } else {
      // Create new project

      result = await projectStore.createProject(projectData);

      // Ensure the new project is in the store's arrays
      // Add to projects array if not already there
      const existsInProjects = projectStore.projects.find(
        (p) => p.id === result.id,
      );
      if (!existsInProjects) {
        projectStore.projects.unshift(result);
      }

      // Add to userProjects array if not already there
      const existsInUserProjects = projectStore.userProjects.find(
        (p) => p.id === result.id,
      );
      if (!existsInUserProjects) {
        console.log("Adding project to userProjects array");
        projectStore.userProjects.unshift(result);
      }
    }

    console.log(
      `Project ${editMode.value ? "updated" : "created"} successfully:`,
      result,
    );

    // Clear localStorage on successful creation
    if (!editMode.value) {
      clearLocalStorage();
    }

    // Show success message with toast
    toast.add({
      title: "Success!",
      description: `Project ${editMode.value ? "updated" : "created"
        } successfully. Redirecting...`,
      color: "success",
      timeout: 2000,
    });

    // Wait a bit for the toast to be visible, then redirect
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Navigate to the project details page
    const projectId = editMode.value ? editProjectId.value : result.id;

    // For new creations, pull fresh list; for edits, keep local updated state
    if (!editMode.value) {
      await projectStore.fetchUserProjects();
    }

    // Navigate with force flag to ensure fresh load
    await navigateTo(`/student/my-projects/${projectId}`, {
      replace: true,
      external: false,
    });
  } catch (error) {
    console.error(
      `Error ${editMode.value ? "updating" : "creating"} project:`,
      error,
    );
    toast.add({
      title: "Error",
      description: `Failed to ${editMode.value ? "update" : "create"} project`,
      color: "error",
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
        form.name &&
        form.description &&
        form.thumbnails.length >= 1 &&
        form.category &&
        form.academicYear
      );
    case 1: // Technical
      return form.technologies.length > 0;
    case 2: // Details
      return form.duration && form.course;
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
  // window.scrollTo({
  //   top: 0,
  //   behavior: "smooth",
  // });

  smoothScrollToTop(1500);
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const skipToReview = () => {
  currentStep.value = steps.length - 1;
};

useHead({
  title: "Create Project - GIC Showcase",
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
