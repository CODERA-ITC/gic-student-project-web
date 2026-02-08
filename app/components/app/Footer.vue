<template>
  <footer class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    <UContainer>
      <div class="py-16">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Brand Section -->
          <div class="md:col-span-2">
            <div class="flex items-center space-x-3 mb-6">
              <UIcon name="i-heroicons-academic-cap" class="w-8 h-8 text-slate-900 dark:text-slate-100" />
              <span class="text-2xl font-semibold">GIC Showcase</span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-3 max-w-md">
              A showcase platform for student projects and achievements across
              semesters. Discover the amazing work done by GIC students
              throughout their academic journey.
            </p>
            <div class="flex cursor-pointer" @click="OpenCoderaWeb">
              <!-- <UButton variant="ghost" size="sm" color="secondary" icon="i-heroicons-envelope"
                to="mailto:contact@gic.edu">
                Contact Us
              </UButton> -->

              <NuxtImg src="../public/images/PoweredByCodera-Light.png" alt="Powered by Codera" width="150" height="150"
                class="block dark:hidden" />

              <NuxtImg src="../public/images/PoweredByCodera-Dark.png" alt="Powered by Codera" width="150" height="150"
                class="hidden dark:block" />
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Quick Links
            </h3>
            <ul class="space-y-3">
              <li>
                <NuxtLink to="/"
                  class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Home
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/projects"
                  class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  All Projects
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/students"
                  class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Students
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/about"
                  class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About Us
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Programs -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Programs
            </h3>
            <ul class="space-y-3">
              <li>
                <NuxtLink to="https://gic.itc.edu.kh/degree/1/text_detail" target="_blank"
                  class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Engineering
                </NuxtLink>
              </li>

              <li>
                <NuxtLink to="https://gic.itc.edu.kh/degree/2/text_detail" target="_blank"
                  class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Master
                </NuxtLink>
              </li>
              <!-- <li>
                <NuxtLink to="/students?program=Data%20Science"
                  class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Data Science
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/students?program=Software%20Engineering"
                  class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  System Administration
                </NuxtLink>
              </li> -->
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-300 dark:border-gray-700 my-8" />

        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {{ currentYear }} GIC Showcase. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <NuxtLink to="/privacy"
              class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
              Privacy Policy
            </NuxtLink>
            <NuxtLink to="/terms"
              class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors">
              Terms of Service
            </NuxtLink>
          </div>
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
// Get current year for dynamic display
const currentYear = new Date().getFullYear();
const OpenCoderaWeb = () => {

  window.open('https://codera.club/', '_blank', 'noopener,noreferrer')
}
</script>
