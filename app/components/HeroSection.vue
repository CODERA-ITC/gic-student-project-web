<template>
  <section
    class="relative overflow-hidden pt-20 pb-32 lg:pb-40 px-4 sm:px-6 lg:px-8 bg-slate-900"
  >
    <!-- Animated background elements -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"
      />
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"
      />
      <div
        class="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"
      />
    </div>

    <UContainer class="relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Content -->
        <div class="space-y-8">
          <div class="space-y-4">
            <div
              class="inline-flex items-center px-4 py-2 rounded-full bg-blue-950 border border-blue-800"
            >
              <UIcon
                name="i-heroicons-star"
                class="w-4 h-4 text-blue-400 mr-2"
              />
              <span class="text-sm font-semibold text-blue-400"
                >Discover Exceptional Student Work</span
              >
            </div>
            <h1 class="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Showcase Your Innovation
            </h1>
            <p class="text-xl text-gray-300 leading-relaxed max-w-lg">
              Join thousands of talented students showcasing their amazing
              projects. From AI innovations to mobile apps, discover the future
              of technology created by GIC students.
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <ButtonsPresetButton preset="exploreProjects" to="/projects" />
            <ButtonsPresetButton preset="learnMore" to="/about" />
          </div>

          <!-- Stats Preview -->
          <div class="grid grid-cols-3 gap-4 pt-8 border-t border-slate-700">
            <div>
              <div class="text-3xl font-bold text-blue-400">247+</div>
              <p class="text-sm text-gray-400">Projects</p>
            </div>
            <div>
              <div class="text-3xl font-bold text-blue-400">156+</div>
              <p class="text-sm text-gray-400">Students</p>
            </div>
            <div>
              <div class="text-3xl font-bold text-blue-400">8</div>
              <p class="text-sm text-gray-400">Semesters</p>
            </div>
          </div>
        </div>

        <!-- Visual Element -->
        <div class="relative hidden lg:block">
          <AppHero />
        </div>
      </div>
    </UContainer>
  </section>
</template>

<script setup>
import AppHero from "~/components/app/Hero.vue";
</script>

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
