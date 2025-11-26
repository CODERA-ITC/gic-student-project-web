<template>
  <section
    class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <UContainer>
      <div class="flex justify-between items-center mb-12">
        <div>
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Featured Projects
          </h2>
          <p class="text-gray-700 dark:text-gray-300">
            Discover the latest and greatest student creations
          </p>
        </div>
        <NuxtLink to="/projects">
          <UButton variant="outline" icon="i-heroicons-arrow-right" icon-trailing color="primary">
            View All
          </UButton>
        </NuxtLink>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Project Card 1 -->
        <UCard
          class="overflow-hidden hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 group cursor-pointer bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:border-blue-500/50">
          <div
            class="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
            🤖
          </div>
          <div class="p-6">
            <div
              class="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              AI & Machine Learning
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              AI Study Assistant
            </h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
              Machine learning application that helps students optimize their
              study schedules using predictive analytics
            </p>
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">Fall 2024</span>
              <UButton variant="ghost" size="sm" icon="i-heroicons-arrow-right" icon-trailing label="Details"
                color="primary" />
            </div>
          </div>
        </UCard>

        <!-- Project Card 2 -->
        <UCard
          class="overflow-hidden hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 group cursor-pointer bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:border-blue-500/50">
          <div
            class="h-48 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
            📱
          </div>
          <div class="p-6">
            <div
              class="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              Mobile App
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Campus Navigator
            </h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
              AR-powered mobile application for navigating the campus
              efficiently with real-time indoor mapping
            </p>
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">Fall 2024</span>
              <UButton variant="ghost" size="sm" icon="i-heroicons-arrow-right" icon-trailing label="Details"
                color="primary" />
            </div>
          </div>
        </UCard>

        <!-- Project Card 3 -->
        <UCard
          class="overflow-hidden hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 group cursor-pointer bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:border-blue-500/50">
          <div
            class="h-48 bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
            🌍
          </div>
          <div class="p-6">
            <div
              class="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              Sustainability
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Sustainability Tracker
            </h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
              Platform for tracking campus environmental impact and promoting
              sustainable practices
            </p>
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
              <span class="text-sm text-gray-600 dark:text-gray-400">Summer 2024</span>
              <UButton variant="ghost" size="sm" icon="i-heroicons-arrow-right" icon-trailing label="Details"
                color="primary" />
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>