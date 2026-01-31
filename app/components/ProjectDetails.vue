<template>
  <div class="flex flex-col gap-4 sm:gap-6 relative">
    <!-- Scroll Progress Indicator -->
    <div
      class="fixed top-0 left-0 h-1 bg-blue-900 z-50 transition-all duration-150"
      :style="{ width: scrollProgress + '%' }"
    ></div>

    <!-- Breadcrumb Navigation -->
    <nav
      class="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 overflow-x-auto pb-1"
    >
      <NuxtLink
        to="/"
        class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 flex-shrink-0"
      >
        <UIcon name="i-heroicons-home" class="w-4 h-4" />
        <span class="hidden sm:inline">Home</span>
      </NuxtLink>
      <UIcon
        name="i-heroicons-chevron-right"
        class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
      />
      <NuxtLink
        :to="breadcrumbBase.path"
        class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 flex-shrink-0"
      >
        <UIcon
          v-if="breadcrumbBase.icon"
          :name="breadcrumbBase.icon"
          class="w-4 h-4"
        />
        <span class="hidden xs:inline">{{ breadcrumbBase.label }}</span>
      </NuxtLink>
      <UIcon
        name="i-heroicons-chevron-right"
        class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
      />
      <span
        class="text-gray-900 dark:text-white font-medium truncate max-w-[150px] sm:max-w-xs"
      >
        {{ project.name }}
      </span>
    </nav>

    <!-- Main Content: Project Details First -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <!-- Primary Content - Project Details -->
      <div class="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
        <!-- Project Header: Title, Badges, Description -->
        <div class="space-y-4">
          <!-- Category & Status Row -->
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex gap-2 flex-wrap">
              <UBadge
                class="bg-blue-900 text-white shadow-sm"
                variant="solid"
                size="sm"
              >
                <UIcon name="i-heroicons-folder" class="w-3 h-3 mr-1" />
                {{ project.category }}
              </UBadge>
              <UBadge color="info" variant="soft" size="sm">
                <UIcon name="i-heroicons-calendar" class="w-3 h-3 mr-1" />
                {{ project.academicYear }}
              </UBadge>
              <UBadge
                :color="currentStatus === 'Completed' ? 'success' : 'warning'"
                variant="soft"
                size="sm"
              >
                <UIcon
                  :name="
                    currentStatus === 'Completed'
                      ? 'i-heroicons-check-circle'
                      : 'i-heroicons-clock'
                  "
                  class="w-3 h-3 mr-1"
                />
                {{ currentStatus }}
              </UBadge>
              <!-- Submission Status Badge -->
              <UBadge
                v-if="showSubmissionStatus && project.submissionStatus"
                :color="submissionStatusColor"
                variant="soft"
                size="sm"
              >
                <UIcon :name="submissionStatusIcon" class="w-3 h-3 mr-1" />
                {{ submissionStatusLabel }}
              </UBadge>
            </div>
          </div>

          <!-- Project Title with Accent -->
          <div class="relative pl-4 sm:pl-0">
            <div
              class="absolute left-0 sm:-left-4 top-0 bottom-0 w-1 bg-blue-900 rounded-full"
            ></div>
            <h1
              class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              {{ project.name }}
            </h1>
          </div>

          <!-- Short Summary -->
          <p
            class="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            {{ project.description }}
          </p>

          <!-- Created Date -->
          <p
            v-if="project.createdAt"
            class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"
          >
            <UIcon name="i-heroicons-calendar-days" class="w-4 h-4" />
            Created {{ formatDate(project.createdAt) }}
          </p>

          <!-- Demo & GitHub Links -->
          <div
            class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2"
          >
            <button
              v-if="project.demoUrl"
              @click="openVideoPopup"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <UIcon name="i-heroicons-play-circle" class="w-4 h-4" />
              Watch Demo
            </button>
            <a
              v-if="project.githubUrl"
              :href="project.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <UIcon name="i-simple-icons-github" class="w-4 h-4" />
              Repository
            </a>
          </div>
        </div>

        <!-- Key Details Grid -->
        <div class="grid grid-cols-2 gap-3 sm:gap-4">
          <!-- Course / Subject -->
          <div
            v-if="project.course"
            ref="courseRef"
            class="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 transform transition-all duration-500 opacity-0 translate-y-4"
          >
            <div class="flex items-center gap-2 sm:gap-3">
              <div
                class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0"
              >
                <UIcon
                  name="i-heroicons-academic-cap"
                  class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div class="min-w-0">
                <p
                  class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  Course
                </p>
                <p
                  class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate"
                >
                  {{ project.course }}
                </p>
              </div>
            </div>
          </div>

          <!-- Duration -->
          <div
            v-if="project.duration"
            ref="durationRef"
            class="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 transform transition-all duration-500 opacity-0 translate-y-4"
          >
            <div class="flex items-center gap-2 sm:gap-3">
              <div
                class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0"
              >
                <UIcon
                  name="i-heroicons-clock"
                  class="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400"
                />
              </div>
              <div class="min-w-0">
                <p
                  class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  Duration
                </p>
                <p
                  class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate"
                >
                  {{ project.duration }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tech Stack -->
        <div
          v-if="project.technologies && project.technologies.length > 0"
          ref="skillsRef"
          class="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-4 sm:p-5 transform transition-all duration-500 opacity-0 translate-y-4"
        >
          <div class="flex items-center gap-2 mb-2 sm:mb-3">
            <UIcon
              name="i-heroicons-wrench-screwdriver"
              class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400"
            />
            <h3
              class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide"
            >
              Tech Stack
            </h3>
          </div>
          <div class="flex gap-1.5 sm:gap-2 flex-wrap">
            <span
              v-for="skill in project.technologies"
              :key="skill"
              class="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <!-- Team Members -->
        <div
          v-if="allTeamMembers.length > 0"
          ref="teamRef"
          class="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-4 sm:p-5 transform transition-all duration-500 opacity-0 translate-y-4"
        >
          <div class="flex items-center gap-2 mb-3 sm:mb-4">
            <UIcon
              name="i-heroicons-users"
              class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400"
            />
            <h3
              class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide"
            >
              Team
            </h3>
          </div>

          <!-- All Team Members -->
          <div class="grid grid-cols-2 gap-2 sm:gap-3">
            <div
              v-for="(member, idx) in allTeamMembers"
              :key="idx"
              class="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg bg-gray-50 dark:bg-slate-700/30"
            >
              <img
                v-if="member.image"
                :src="member.image"
                :alt="member.name"
                class="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                @error="
                  (e) => ((e.target as HTMLElement).style.display = 'none')
                "
              />
              <div
                v-else
                class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-white text-[10px] sm:text-xs font-semibold">{{
                  getInitials(member.name)
                }}</span>
              </div>
              <p
                class="text-xs sm:text-sm text-gray-700 dark:text-gray-200 truncate"
              >
                {{ member.name }}
              </p>
            </div>
          </div>
        </div>

        <!-- Image Gallery Section -->
        <div class="space-y-2 sm:space-y-3">
          <div class="flex items-center justify-between">
            <h3
              class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-1.5 sm:gap-2"
            >
              <UIcon
                name="i-heroicons-photo"
                class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400"
              />
              Gallery
              <span
                v-if="project.images"
                class="text-[10px] sm:text-xs font-normal text-gray-500"
                >({{ project.images.length }})</span
              >
            </h3>
            <button
              v-if="project.images && project.images.length > 0"
              @click="openLightbox"
              class="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <UIcon
                name="i-heroicons-arrows-pointing-out"
                class="w-3.5 h-3.5 sm:w-4 sm:h-4"
              />
              <span class="hidden sm:inline">Fullscreen</span>
            </button>
          </div>

          <!-- Main Carousel -->
          <div
            class="rounded-xl h-48 sm:h-64 md:h-80 relative overflow-hidden bg-gray-100 dark:bg-slate-800 carousel group"
          >
            <div class="relative w-full h-full">
              <TransitionGroup name="carousel-fade" mode="out-in">
                <img
                  v-if="project.images && project.images[currentImageIndex]"
                  :key="currentImageIndex"
                  :src="
                    project.images[currentImageIndex].originalUrl.toString()
                  "
                  :alt="`${project.name} - Image ${currentImageIndex + 1}`"
                  class="absolute inset-0 w-full h-full object-cover cursor-pointer"
                  @click="openLightbox"
                />
                <div
                  v-else
                  key="fallback"
                  class="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-6xl bg-gray-100 dark:bg-slate-700"
                >
                  <UIcon
                    name="i-heroicons-photo"
                    class="w-16 h-16 text-gray-400"
                  />
                  <p class="text-sm text-gray-500 mt-2">No images available</p>
                </div>
              </TransitionGroup>

              <!-- Image Counter Badge -->
              <div
                v-if="project.images && project.images.length > 1"
                class="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/50 text-white text-xs backdrop-blur-sm z-10"
              >
                {{ currentImageIndex + 1 }} / {{ project.images.length }}
              </div>

              <!-- Navigation Buttons (always visible on mobile, hover on desktop) -->
              <button
                v-if="project.images && project.images.length > 1"
                @click="
                  previousImage();
                  resetAutoplay();
                "
                class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 sm:bg-black/40 hover:bg-black/60 flex items-center justify-center transition-all backdrop-blur-sm z-10 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <UIcon
                  name="i-heroicons-chevron-left"
                  class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                />
              </button>
              <button
                v-if="project.images && project.images.length > 1"
                @click="
                  nextImage();
                  resetAutoplay();
                "
                class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 sm:bg-black/40 hover:bg-black/60 flex items-center justify-center transition-all backdrop-blur-sm z-10 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <UIcon
                  name="i-heroicons-chevron-right"
                  class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                />
              </button>
            </div>
          </div>

          <!-- Thumbnail Strip -->
          <div
            v-if="project.images && project.images.length > 1"
            class="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-thin -mx-1 px-1"
          >
            <button
              v-for="(img, idx) in project.images"
              :key="idx"
              @click="
                currentImageIndex = idx;
                resetAutoplay();
              "
              :class="[
                'flex-shrink-0 w-12 h-9 sm:w-16 sm:h-12 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all',
                currentImageIndex === idx
                  ? 'border-blue-500 ring-2 ring-blue-500/30'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 opacity-70 hover:opacity-100',
              ]"
            >
              <img
                :src="img.originalUrl.toString()"
                :alt="`Thumbnail ${idx + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar - Stats & Actions (First on mobile for quick access) -->
      <div class="lg:col-span-1 order-1 lg:order-2">
        <div class="lg:sticky lg:top-24 space-y-4">
          <!-- Project Author Card -->
          <div
            v-if="project.author"
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm"
          >
            <div class="flex items-center gap-2 mb-3 sm:mb-4">
              <UIcon
                name="i-heroicons-user-circle"
                class="w-4 h-4 text-blue-600 dark:text-blue-400"
              />
              <p
                class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
              >
                Project Lead
              </p>
            </div>
            <div class="flex items-center gap-3 sm:gap-4">
              <img
                :src="
                  project.author?.avatar ||
                  'https://img.icons8.com/nolan/1200/user-default.jpg'
                "
                :alt="project.author.name"
                class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-blue-100 dark:ring-slate-600 shadow"
              />
              <div class="flex-1 min-w-0">
                <p
                  class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate"
                >
                  {{ project.author.name }}
                </p>
                <p
                  class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate"
                >
                  {{ project.author.program }}
                </p>
              </div>
            </div>
          </div>

          <!-- Stats Card -->
          <div
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm"
          >
            <div class="flex items-center gap-2 mb-3 sm:mb-4">
              <UIcon
                name="i-heroicons-chart-bar"
                class="w-4 h-4 text-blue-600 dark:text-blue-400"
              />
              <p
                class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
              >
                Stats
              </p>
            </div>
            <div class="flex items-center justify-around">
              <div class="text-center">
                <div
                  class="flex items-center justify-center gap-1 sm:gap-1.5 mb-1"
                >
                  <UIcon
                    name="i-heroicons-eye"
                    class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                  />
                  <span
                    class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    {{ formatNumber(project.views) }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Views</p>
              </div>
              <div class="h-8 sm:h-10 w-px bg-gray-200 dark:bg-slate-600"></div>
              <div class="text-center">
                <div
                  class="flex items-center justify-center gap-1 sm:gap-1.5 mb-1"
                >
                  <UIcon
                    name="i-heroicons-heart"
                    class="w-4 h-4 sm:w-5 sm:h-5 text-red-400"
                  />
                  <span
                    class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
                  >
                    {{ formatNumber(likesCount) }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">Likes</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm"
          >
            <div class="flex items-center gap-2 mb-3 sm:mb-4">
              <UIcon
                name="i-heroicons-cursor-arrow-rays"
                class="w-4 h-4 text-blue-600 dark:text-blue-400"
              />
              <p
                class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </p>
            </div>
            <div class="space-y-2 sm:space-y-3">
              <!-- Submit for Review Button (Student Owner only) - via slot -->
              <slot name="submit-button"></slot>

              <!-- Edit and Delete Buttons (Owner only) - via slot -->
              <slot name="action-buttons"></slot>

              <!-- Hide/Show Project Button (Teacher only when project is not public) -->
              <UButton
                v-if="userRole === (Role.teacher || Role.admin) && !isPublic"
                @click="$emit('hide')"
                :color="
                  project.visibility === 'private' ? 'success' : 'warning'
                "
                variant="soft"
                class="w-full justify-center rounded-lg"
                size="md"
              >
                <template #leading>
                  <UIcon
                    :name="
                      project.visibility === 'private'
                        ? 'i-heroicons-eye'
                        : 'i-heroicons-eye-slash'
                    "
                    class="w-5 h-5"
                  />
                </template>
                {{
                  project.visibility === "private"
                    ? "Show Project"
                    : "Hide Project"
                }}
              </UButton>

              <!-- Like Button -->
              <UButton
                @click="$emit('like')"
                :class="[
                  'w-full justify-center rounded-lg font-medium',
                  isLiked
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600',
                ]"
                size="md"
              >
                <template #leading>
                  <UIcon
                    :name="
                      isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'
                    "
                    :class="isLiked ? 'text-red-500' : ''"
                    class="w-5 h-5"
                  />
                </template>
                {{ isLiked ? "Liked" : "Like this project" }}
              </UButton>

              <!-- Share Button -->
              <UButton
                @click="sharePopupOpen = true"
                class="w-full justify-center rounded-lg font-medium bg-blue-900 hover:bg-blue-800 text-white"
                size="md"
              >
                <template #leading>
                  <UIcon name="i-heroicons-share" class="w-5 h-5" />
                </template>
                Share Project
              </UButton>
            </div>
          </div>

          <!-- Quick Links Card -->
          <div
            v-if="project.demoUrl || project.githubUrl"
            class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 shadow-sm"
          >
            <div class="flex items-center gap-2 mb-3 sm:mb-4">
              <UIcon
                name="i-heroicons-link"
                class="w-4 h-4 text-blue-600 dark:text-blue-400"
              />
              <p
                class="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
              >
                Resources
              </p>
            </div>
            <div class="space-y-2 sm:space-y-3">
              <a
                v-if="project.demoUrl"
                :href="project.demoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group"
              >
                <div
                  class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center"
                >
                  <UIcon name="i-heroicons-play-circle" class="w-4 h-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium">Live Demo</p>
                  <p class="text-xs text-blue-500 dark:text-blue-300 truncate">
                    {{ project.demoUrl }}
                  </p>
                </div>
                <UIcon
                  name="i-heroicons-arrow-top-right-on-square"
                  class="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity"
                />
              </a>
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all group"
              >
                <div
                  class="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center"
                >
                  <UIcon name="i-simple-icons-github" class="w-4 h-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium">Source Code</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                    View on GitHub
                  </p>
                </div>
                <UIcon
                  name="i-heroicons-arrow-top-right-on-square"
                  class="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="lightboxOpen && project.images && project.images.length > 0"
          class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 sm:p-4"
          @click.self="closeLightbox"
        >
          <button
            @click="closeLightbox"
            class="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <UIcon
              name="i-heroicons-x-mark"
              class="w-5 h-5 sm:w-6 sm:h-6 text-white"
            />
          </button>
          <button
            v-if="project.images.length > 1"
            @click="previousImage"
            class="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <UIcon
              name="i-heroicons-chevron-left"
              class="w-6 h-6 sm:w-8 sm:h-8 text-white"
            />
          </button>
          <img
            :src="project.images[currentImageIndex].originalUrl.toString()"
            :alt="`${project.name} - Image ${currentImageIndex + 1}`"
            class="max-w-[95vw] sm:max-w-[90vw] max-h-[85vh] sm:max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          <button
            v-if="project.images.length > 1"
            @click="nextImage"
            class="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <UIcon
              name="i-heroicons-chevron-right"
              class="w-6 h-6 sm:w-8 sm:h-8 text-white"
            />
          </button>
          <div
            class="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 text-white text-xs sm:text-sm bg-black/50 px-3 py-1 rounded-full"
          >
            {{ currentImageIndex + 1 }} / {{ project.images.length }}
          </div>
        </div>
      </Transition>

      <!-- Video Popup Modal -->
      <Transition name="fade">
        <div
          v-if="videoPopupOpen && project.demoUrl"
          class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 sm:p-4"
          @click.self="closeVideoPopup"
        >
          <!-- Close Button -->
          <button
            @click="closeVideoPopup"
            class="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
          >
            <UIcon
              name="i-heroicons-x-mark"
              class="w-5 h-5 sm:w-6 sm:h-6 text-white"
            />
          </button>

          <!-- Video Container -->
          <div class="w-full max-w-5xl">
            <!-- Video Header -->
            <div class="flex items-center justify-between mb-2 sm:mb-4">
              <div class="flex items-center gap-2 sm:gap-3">
                <div
                  class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center"
                >
                  <UIcon
                    name="i-heroicons-play"
                    class="w-4 h-4 sm:w-5 sm:h-5 text-white"
                  />
                </div>
                <div>
                  <h3
                    class="text-white font-semibold text-sm sm:text-lg line-clamp-1"
                  >
                    {{ project.name }}
                  </h3>
                  <p class="text-gray-400 text-xs sm:text-sm">Demo Video</p>
                </div>
              </div>
              <a
                :href="project.demoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
              >
                <UIcon
                  name="i-heroicons-arrow-top-right-on-square"
                  class="w-4 h-4"
                />
                Open in new tab
              </a>
            </div>

            <!-- Video Player -->
            <div
              class="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl"
              style="aspect-ratio: 16/9"
            >
              <!-- YouTube Embed -->
              <iframe
                v-if="youtubeVideoId"
                :src="`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`"
                class="absolute inset-0 w-full h-full"
                frameborder="0"
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture;
                "
                allowfullscreen
              ></iframe>

              <!-- Vimeo Embed -->
              <iframe
                v-else-if="vimeoVideoId"
                :src="`https://player.vimeo.com/video/${vimeoVideoId}?autoplay=1`"
                class="absolute inset-0 w-full h-full"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen
              ></iframe>

              <!-- Generic Video / Fallback -->
              <div
                v-else
                class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900"
              >
                <UIcon
                  name="i-heroicons-video-camera"
                  class="w-16 h-16 text-gray-600 mb-4"
                />
                <p class="text-gray-400 mb-4">Video preview not available</p>
                <a
                  :href="project.demoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <UIcon name="i-heroicons-play" class="w-4 h-4" />
                  Open Demo Link
                </a>
              </div>
            </div>

            <!-- Video Info -->
            <div
              class="mt-2 sm:mt-4 flex items-center justify-center sm:justify-between text-xs sm:text-sm text-gray-400"
            >
              <p class="hidden sm:block">Press ESC or click outside to close</p>
              <div class="flex items-center gap-3 sm:gap-4">
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-eye" class="w-3 h-3 sm:w-4 sm:h-4" />
                  {{ formatNumber(project.views) }} views
                </span>
                <span class="flex items-center gap-1">
                  <UIcon
                    name="i-heroicons-heart"
                    class="w-3 h-3 sm:w-4 sm:h-4"
                  />
                  {{ formatNumber(likesCount) }} likes
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Share Popup Modal -->
      <Transition name="fade">
        <div
          v-if="sharePopupOpen"
          class="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
          @click.self="sharePopupOpen = false"
        >
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <!-- Modal Header -->
            <div
              class="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-slate-700"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                >
                  <UIcon
                    name="i-heroicons-share"
                    class="w-5 h-5 text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <h3
                    class="text-lg font-semibold text-gray-900 dark:text-white"
                  >
                    Share Project
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Share with friends and colleagues
                  </p>
                </div>
              </div>
              <button
                @click="sharePopupOpen = false"
                class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <UIcon
                  name="i-heroicons-x-mark"
                  class="w-5 h-5 text-gray-500"
                />
              </button>
            </div>

            <!-- Social Media Buttons -->
            <div class="p-4 sm:p-5">
              <p
                class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              >
                Share via
              </p>
              <div class="grid grid-cols-4 gap-3">
                <!-- Facebook -->
                <button
                  @click="shareToFacebook"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center group-hover:scale-110 transition-transform"
                  >
                    <UIcon
                      name="i-simple-icons-facebook"
                      class="w-6 h-6 text-white"
                    />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-400"
                    >Facebook</span
                  >
                </button>

                <!-- Twitter/X -->
                <button
                  @click="shareToTwitter"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform"
                  >
                    <UIcon name="i-simple-icons-x" class="w-5 h-5 text-white" />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-400"
                    >X</span
                  >
                </button>

                <!-- LinkedIn -->
                <button
                  @click="shareToLinkedIn"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center group-hover:scale-110 transition-transform"
                  >
                    <UIcon
                      name="i-simple-icons-linkedin"
                      class="w-6 h-6 text-white"
                    />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-400"
                    >LinkedIn</span
                  >
                </button>

                <!-- Telegram -->
                <button
                  @click="shareToTelegram"
                  class="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group"
                >
                  <div
                    class="w-12 h-12 rounded-full bg-[#26A5E4] flex items-center justify-center group-hover:scale-110 transition-transform"
                  >
                    <UIcon
                      name="i-simple-icons-telegram"
                      class="w-6 h-6 text-white"
                    />
                  </div>
                  <span class="text-xs text-gray-600 dark:text-gray-400"
                    >Telegram</span
                  >
                </button>
              </div>
            </div>

            <!-- Copy Link Section -->
            <div
              class="p-4 sm:p-5 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50"
            >
              <p
                class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              >
                Or copy link
              </p>
              <div class="flex gap-2">
                <div
                  class="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5 overflow-hidden"
                >
                  <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {{ shareUrl }}
                  </p>
                </div>
                <button
                  @click="copyLink"
                  :class="[
                    'px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2',
                    linkCopied
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white',
                  ]"
                >
                  <UIcon
                    :name="
                      linkCopied
                        ? 'i-heroicons-check'
                        : 'i-heroicons-clipboard-document'
                    "
                    class="w-4 h-4"
                  />
                  {{ linkCopied ? "Copied!" : "Copy" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Project Roadmap Section -->
    <div
      v-if="roadmap.length > 0"
      class="bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6"
    >
      <h3
        class="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white flex items-center gap-2"
      >
        <UIcon
          name="i-heroicons-flag"
          class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400"
        />
        Development Roadmap
      </h3>
      <RoadmapInfographic :milestones="roadmap" />
    </div>

    <!-- Similar Projects Section -->
    <div
      v-if="showSimilarProjects && similarProjects.length > 0"
      class="space-y-4 sm:space-y-6"
    >
      <div class="flex items-center justify-between">
        <h3
          class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <UIcon
            name="i-heroicons-squares-2x2"
            class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400"
          />
          Similar Projects
        </h3>
        <div class="flex items-center gap-2">
          <!-- Navigation Buttons -->
          <button
            @click="prevSimilarProjects"
            :disabled="similarProjectsIndex === 0"
            class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <UIcon
              name="i-heroicons-chevron-left"
              class="w-5 h-5 text-gray-600 dark:text-gray-300"
            />
          </button>
          <button
            @click="nextSimilarProjects"
            :disabled="
              similarProjectsIndex + visibleSimilarCount >=
              similarProjects.length
            "
            class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <UIcon
              name="i-heroicons-chevron-right"
              class="w-5 h-5 text-gray-600 dark:text-gray-300"
            />
          </button>
          <NuxtLink
            to="/projects"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 ml-2"
          >
            View all
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- Projects Carousel Row -->
      <div class="relative overflow-hidden">
        <div
          class="flex gap-4 sm:gap-6 transition-transform duration-300 ease-in-out"
          :style="{
            transform: `translateX(-${similarProjectsIndex * (100 / visibleSimilarCount)}%)`,
          }"
        >
          <div
            v-for="similarProject in similarProjects"
            :key="similarProject.id"
            class="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <ProjectCard
              :project="similarProject"
              :show-like-button="false"
              :show-edit-button="false"
              base-route="/projects"
            />
          </div>
        </div>
      </div>
    </div>

    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Role } from "~/types/roles";
import { useProjectStore } from "~/stores/projects";
import type { Project } from "~/utils/Interfaces";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const projectStore = useProjectStore();

// Template refs for animations
const courseRef = ref<HTMLElement | null>(null);
const durationRef = ref<HTMLElement | null>(null);
const teamRef = ref<HTMLElement | null>(null);
const skillsRef = ref<HTMLElement | null>(null);

interface Props {
  project: Project;
  isLiked?: boolean;
  userRole?: Role | null;
  isPublic?: boolean;
  isOwner?: boolean;
  showSubmissionStatus?: boolean;
  showSimilarProjects?: boolean;
  // Breadcrumb customization
  breadcrumbBase?: {
    label: string;
    path: string;
    icon?: string;
  };
}

const props = withDefaults(defineProps<Props>(), {
  isLiked: false,
  userRole: null,
  isOwner: false,
  showSubmissionStatus: false,
  showSimilarProjects: true,
  breadcrumbBase: () => ({
    label: "Projects",
    path: "/projects",
    icon: "i-heroicons-rectangle-stack",
  }),
});

defineEmits<{
  like: [];
  share: [];
  hide: [];
}>();

// Local like count that stays responsive to parent changes and toggle events
const likesCount = ref(props.project?.likes ?? 0);

watch(
  () => props.project?.likes,
  (val) => {
    likesCount.value = val ?? 0;
  },
  { immediate: true },
);

watch(
  () => props.isLiked,
  (newVal, oldVal) => {
    if (newVal === oldVal) return;
    likesCount.value += newVal ? 1 : -1;
    if (likesCount.value < 0) likesCount.value = 0;
  },
);

// Image carousel
const currentImageIndex = ref(0);
const autoPlayInterval = ref<NodeJS.Timeout | null>(null);
const lightboxOpen = ref(false);
const linkCopied = ref(false);
const scrollProgress = ref(0);
const videoPopupOpen = ref(false);
const sharePopupOpen = ref(false);

// Similar projects
const similarProjects = ref<Project[]>([]);
const loadingSimilar = ref(false);
const similarProjectsIndex = ref(0);

// Compute visible count based on screen size (3 on lg, 2 on sm, 1 on mobile)
const visibleSimilarCount = computed(() => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
});

// Navigation functions for similar projects carousel
const prevSimilarProjects = () => {
  if (similarProjectsIndex.value > 0) {
    similarProjectsIndex.value--;
  }
};

const nextSimilarProjects = () => {
  if (
    similarProjectsIndex.value + visibleSimilarCount.value <
    similarProjects.value.length
  ) {
    similarProjectsIndex.value++;
  }
};

// Submission status computed properties
const submissionStatusColor = computed(() => {
  const status = props.project?.submissionStatus?.toLowerCase();
  switch (status) {
    case "draft":
      return "neutral";
    case "pending":
    case "reviewing":
      return "warning";
    case "accepted":
    case "public":
      return "success";
    case "rejected":
      return "error";
    default:
      return "neutral";
  }
});

const submissionStatusIcon = computed(() => {
  const status = props.project?.submissionStatus?.toLowerCase();
  switch (status) {
    case "draft":
      return "i-heroicons-document";
    case "pending":
    case "reviewing":
      return "i-heroicons-clock";
    case "accepted":
    case "public":
      return "i-heroicons-check-circle";
    case "rejected":
      return "i-heroicons-x-circle";
    default:
      return "i-heroicons-document";
  }
});

const submissionStatusLabel = computed(() => {
  const status = props.project?.submissionStatus?.toLowerCase();
  switch (status) {
    case "draft":
      return "Draft";
    case "pending":
      return "Pending Review";
    case "reviewing":
      return "Under Review";
    case "accepted":
      return "Accepted";
    case "public":
      return "Published";
    case "rejected":
      return "Rejected";
    default:
      return status || "Unknown";
  }
});

// Fetch similar projects based on category or course
// Fetch similar projects using store getter
const fetchSimilarProjects = async () => {
  if (!props.project?.id || !props.showSimilarProjects) return;

  loadingSimilar.value = true;
  try {
    // Ensure projects are loaded in the store
    if (projectStore.projects.length === 0) {
      await projectStore.fetchProjects(1, 20);
    }

    // Use the store getter to get similar projects
    similarProjects.value = projectStore.getSimilarProjects(
      props.project.id,
      props.project.category,
    );

    console.log("Similar projects from store:", similarProjects.value.length);
  } catch (error) {
    console.error("Error fetching similar projects:", error);
    similarProjects.value = [];
  } finally {
    loadingSimilar.value = false;
  }
};

// Extract YouTube video ID from URL
const youtubeVideoId = computed(() => {
  if (!props.project?.demoUrl) return null;
  const url = props.project.demoUrl;

  // Match various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
});

// Extract Vimeo video ID from URL
const vimeoVideoId = computed(() => {
  if (!props.project?.demoUrl) return null;
  const url = props.project.demoUrl;

  const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  return match ? match[1] : null;
});

// Open/close video popup
const openVideoPopup = () => {
  videoPopupOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeVideoPopup = () => {
  videoPopupOpen.value = false;
  document.body.style.overflow = "";
};

// Open/close lightbox
const openLightbox = () => {
  lightboxOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = "";
};

// Copy project link
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
      sharePopupOpen.value = false;
    }, 1500);
  } catch (err) {
    console.error("Failed to copy link:", err);
  }
};

// Share to social media
const shareUrl = computed(() => {
  if (typeof window !== "undefined") {
    return window.location.href;
  }
  return "";
});

const shareToFacebook = () => {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`,
    "_blank",
    "width=600,height=400",
  );
};

const shareToTwitter = () => {
  const text = `Check out this project: ${props.project?.name}`;
  window.open(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(text)}`,
    "_blank",
    "width=600,height=400",
  );
};

const shareToLinkedIn = () => {
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl.value)}`,
    "_blank",
    "width=600,height=400",
  );
};

const shareToTelegram = () => {
  const text = `Check out this project: ${props.project?.name}`;
  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(text)}`,
    "_blank",
    "width=600,height=400",
  );
};

// Format number (1000 -> 1K)
const formatNumber = (num: number): string => {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

// Format date
const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Scroll progress handler
const handleScroll = () => {
  const winScroll = document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  scrollProgress.value = (winScroll / height) * 100;
};

// ESC key handler for modals
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    if (videoPopupOpen.value) closeVideoPopup();
    if (lightboxOpen.value) closeLightbox();
    if (sharePopupOpen.value) sharePopupOpen.value = false;
  }
};

const resetAutoplay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value);
  }
  if (props.project?.images && props.project.images.length > 1) {
    autoPlayInterval.value = setInterval(() => {
      nextImage();
    }, 5000);
  }
};

const nextImage = () => {
  if (props.project?.images) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % props.project.images.length;
  }
};

const previousImage = () => {
  if (props.project?.images) {
    currentImageIndex.value =
      currentImageIndex.value === 0
        ? props.project.images.length - 1
        : currentImageIndex.value - 1;
  }
};

// Timeline/Roadmap computed
const roadmap = computed(() => {
  if (!props.project?.features) return [];
  return props.project.features.map((feature: any) => ({
    date: feature.date || "No date",
    name: feature.name,
    description: feature.description,
    icon: feature.icon || "i-lucide-star",
    status: feature.status || "completed",
  }));
});

// Filter team members to exclude the owner/author
const filteredMembers = computed(() => {
  if (!props.project?.members) return [];
  if (!props.project?.author?.name) return props.project.members;
  return props.project.members.filter(
    (member: any) => member.name !== props.project.author.name,
  );
});

// All team members (only from members array, excludes author)
const allTeamMembers = computed(() => {
  if (!props.project?.members) return [];
  return props.project.members.map((member: any) => ({
    name: member.name,
    image: member.image || null,
  }));
});

// Get initials from name
const getInitials = (name: string): string => {
  if (!name) return "NA";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Real-time status calculation
const currentStatus = computed(() => {
  return props.project
    ? projectStore.getProjectStatus(props.project.features)
    : "In Progress";
});

// GSAP Animations
onMounted(() => {
  // Add scroll listener for progress bar
  window.addEventListener("scroll", handleScroll);
  // Add keydown listener for ESC key
  window.addEventListener("keydown", handleKeydown);

  // Fetch similar projects
  fetchSimilarProjects();

  // Intersection Observer for reveal animations
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          });
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
  );

  // Observe sections for reveal animations
  const sectionsToReveal = [
    courseRef.value,
    durationRef.value,
    teamRef.value,
    skillsRef.value,
  ];
  sectionsToReveal.forEach((section) => {
    if (section) revealObserver.observe(section);
  });

  // Start carousel autoplay
  if (props.project?.images && props.project.images.length > 1) {
    autoPlayInterval.value = setInterval(() => {
      nextImage();
    }, 5000);
  }
});

// Cleanup on unmount
onUnmounted(() => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value);
  }
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
</script>

<style scoped>
.carousel {
  overflow: hidden;
  width: 100%;
}

.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: all 0.4s ease-in-out;
}

.carousel-fade-enter-from {
  opacity: 0;
  transform: scale(1.02);
}

.carousel-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.carousel-fade-enter-to,
.carousel-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* Lightbox fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Thumbnail scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
