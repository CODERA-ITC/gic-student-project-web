<template>
  <section
    class="relative overflow-hidden pt-20 pb-32 lg:pb-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100"
  >
    <!-- Animated background elements -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
      />
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
      />
      <div
        class="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
      />
    </div>

    <UContainer class="relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Content -->
        <div class="space-y-8">
          <div class="space-y-4">
            <div
              class="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200"
            >
              <UIcon
                name="i-heroicons-star"
                class="w-4 h-4 text-blue-600 mr-2"
              />
              <span class="text-sm font-semibold text-blue-600">Discover Exceptional Student Work</span>
            </div>
            <h1
              class="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
            >
              Showcase Your Innovation
            </h1>
            <p class="text-xl text-gray-600 leading-relaxed max-w-lg">
              Join thousands of talented students showcasing their amazing
              projects. From AI innovations to mobile apps, discover the future
              of technology created by GIC students.
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <UButton
              size="lg"
              to="/projects"
              class="flex-1 sm:flex-none rounded-full"
              icon="i-heroicons-rocket-launch"
            >
              Explore Projects
            </UButton>
            <UButton
              size="lg"
              variant="outline"
              class="flex-1 sm:flex-none rounded-full"
              icon="i-heroicons-arrow-top-right-on-square"
              to="/about"
            >
              Learn More
            </UButton>
          </div>

          <!-- Stats Preview -->
          <div class="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
            <div>
              <div class="text-3xl font-bold text-blue-600">
                247+
              </div>
              <p class="text-sm text-gray-600">
                Projects
              </p>
            </div>
            <div>
              <div class="text-3xl font-bold text-purple-600">
                156+
              </div>
              <p class="text-sm text-gray-600">
                Students
              </p>
            </div>
            <div>
              <div class="text-3xl font-bold text-pink-600">
                8
              </div>
              <p class="text-sm text-gray-600">
                Semesters
              </p>
            </div>
          </div>
        </div>

        <!-- Visual Element -->
        <div class="relative hidden lg:block">
          <div
            class="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 shadow-2xl overflow-hidden"
          >
            <!-- Grid pattern -->
            <div class="absolute inset-0 bg-grid-pattern opacity-10" />

            <!-- Animated circles -->
            <div
              class="absolute top-12 left-12 w-24 h-24 bg-white rounded-full opacity-20 animate-pulse"
            />
            <div
              class="absolute bottom-20 right-8 w-32 h-32 border-2 border-white rounded-full opacity-10 animate-spin"
              style="animation-duration: 20s"
            />
            <div
              class="absolute top-1/3 right-1/4 w-16 h-16 bg-yellow-300 rounded-full opacity-30 blur-xl"
            />

            <!-- Icon showcase -->
            <div class="absolute inset-0 flex items-center justify-center">
              <UIcon
                name="i-heroicons-academic-cap"
                class="w-32 h-32 text-white opacity-40"
              />
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
/* Animations */
@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Grid pattern background */
.bg-grid-pattern {
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent
    );
  background-size: 50px 50px;
}
</style>
