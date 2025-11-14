<template>
  <section class="relative overflow-hidden pt-10 pb-10 lg:pb-40 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-900">
    <!-- Animated background elements -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob" />
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
      <div
        class="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
    </div>

    <UContainer class="relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-start">
        <!-- Content -->
        <div class="space-y-8 pt-8">
          <div class="space-y-4">
            <div
              class="inline-flex items-center px-4 py-2 rounded-full bg-blue-950 dark:bg-blue-900 border border-blue-800 dark:border-blue-700">
              <UIcon name="i-heroicons-star" class="w-4 h-4 text-blue-400 dark:text-blue-300 mr-2" />
              <span class="text-sm font-semibold text-blue-400 dark:text-blue-300">Discover Exceptional Student
                Work</span>
            </div>
            <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Showcase Your Innovation
            </h1>
            <p class="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-lg typewriter">
              {{ subtitle }}
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <ButtonsPresetButton preset="exploreProjects" to="/projects" />
            <ButtonsPresetButton preset="learnMore" to="/about" />
          </div>

          <!-- Stats Preview -->
          <div class="grid grid-cols-3 gap-4 pt-8 border-t border-gray-300 dark:border-neutral-700">
            <div>
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">247+</div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Projects</p>
            </div>
            <div>
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">156+</div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Students</p>
            </div>
            <div>
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">8</div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Semesters</p>
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
import { tokenize } from 'khmertokenizer';

const subtitle = "បង្កើតដោយនិស្សិត សម្រាប់និស្សិត ₍^.  ̫.^₎"
const typeWriterChars = computed(() => tokenize(subtitle).length)
const typeWriterSpeed = '4s'
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
  background-image: linear-gradient(0deg,
      transparent 24%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent),
    linear-gradient(90deg,
      transparent 24%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent);
  background-size: 50px 50px;
}

.typewriter {
  position: relative;
  width: max-content;
}

.typewriter::before,
.typewriter::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.typewriter::before {
  background: white;
  animation: typing v-bind('typeWriterSpeed') steps(v-bind('typeWriterChars')) forwards;
}

.dark .typewriter::before {
  background: rgb(23, 23, 23);
  /* neutral-900 */
}

.typewriter::after {
  width: 0.125em;
  background: black;
  animation:
    typing v-bind('typeWriterSpeed') steps(v-bind('typeWriterChars')) forwards,
    blink 1s steps(v-bind('typeWriterChars')) infinite;
  margin-left: 2px;
}

.dark .typewriter::after {
  background: white;
}

@keyframes blink {
  to {
    background: transparent;
  }
}

@keyframes typing {
  to {
    left: 100%;
  }
}
</style>