<template>
  <footer class="bg-gray-900 text-white">
    <UContainer>
      <div class="py-16">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Brand Section -->
          <div class="md:col-span-2">
            <div class="flex items-center space-x-3 mb-6">
              <UIcon
                name="i-heroicons-academic-cap"
                class="w-8 h-8 text-primary"
              />
              <span class="text-2xl font-bold">GIC Student Portal</span>
            </div>
            <p class="text-gray-400 mb-6 max-w-md">
              A showcase platform for student projects and achievements across
              semesters. Discover the amazing work done by GIC students
              throughout their academic journey.
            </p>
            <div class="flex space-x-4">
              <UButton
                variant="ghost"
                size="sm"
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
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/projects"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  All Projects
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/semesters"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  Browse by Semester
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  to="/students"
                  class="text-gray-400 hover:text-white transition-colors"
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
              <li class="text-gray-400">Computer Science</li>
              <li class="text-gray-400">Information Technology</li>
              <li class="text-gray-400">Digital Innovation</li>
              <li class="text-gray-400">Data Science</li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-700 my-8" />

        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            &copy; 2025 GIC Student Portal. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <NuxtLink
              to="/privacy"
              class="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </NuxtLink>
            <NuxtLink
              to="/terms"
              class="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </NuxtLink>
          </div>
        </div>
      </div>
    </UContainer>
  </footer>
</template>
