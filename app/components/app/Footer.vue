<template>
  <footer class="bg-white text-black">
    <UContainer>
      <div class="py-16">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Brand Section -->
          <div class="md:col-span-2">
            <div class="flex items-center space-x-3 mb-6">
              <UIcon
                name="i-heroicons-academic-cap"
                class="w-8 h-8 text-slate-900"
              />
              <span class="text-2xl font-bold">GIC Student Portal</span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              A showcase platform for student projects and achievements across
              semesters. Discover the amazing work done by GIC students
              throughout their academic journey.
            </p>
            <div class="flex space-x-4">
              <UButton
                variant="ghost"
                size="sm"
                color="secondary"
                icon="i-heroicons-envelope"
                to="mailto:contact@gic.edu"
              >
                Contact Us
              </UButton>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-3">
              <li>
                <NuxtLink
                  to="/"
                  class="text-gray-400 hover:text-blue-900/90 transition-colors"
                >
                  Home
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/projects"
                  class="text-gray-400 hover:text-blue-900/90 transition-colors"
                >
                  All Projects
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/semesters"
                  class="text-gray-400 hover:text-blue-900/90 transition-colors"
                >
                  Browse by Semester
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/students"
                  class="text-gray-400 hover:text-blue-900/90 transition-colors"
                >
                  Student Profiles
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Programs -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Programs</h3>
            <ul class="space-y-3">
              <li>
                <NuxtLink
                  to="/students?program=Computer%20Science"
                  class="text-gray-400 hover:text-blue-900/90 transition-colors"
                >
                  Computer Science
                </NuxtLink>
              </li>

              <li>
                <NuxtLink
                  to="/students?program=Information%20Systems"
                  class="text-gray-400 hover:text-blue-900/90 transition-colors"
                >
                  Information Technology
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/students?program=Data%20Science"
                  class="text-gray-400 hover:text-blue-900/90 transition-colors"
                >
                  Data Science
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/students?program=Software%20Engineering"
                  class="text-gray-400 hover:text-blue-900/90 transition-colors"
                >
                  System Administration
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-300 dark:border-gray-700 my-8" />

        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {{ currentYear }} GIC Student Portal. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <NuxtLink
              to="/privacy"
              class="text-gray-400 hover:text-blue-900/90 text-sm transition-colors"
            >
              Privacy Policy
            </NuxtLink>
            <NuxtLink
              to="/terms"
              class="text-gray-400 hover:text-blue-900/90 text-sm transition-colors"
            >
              Terms of Service
            </NuxtLink>
          </div>
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
// get current year for dynamic display
const currentYear = new Date().getFullYear();
</script>
