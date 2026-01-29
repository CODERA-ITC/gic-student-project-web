<template>
  <section
    class="relative overflow-hidden lg:pb-40 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-900"
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
      <div class="grid lg:grid-cols-2 gap-40 items-center">
        <!-- Content -->
        <div class="space-y-8 pt-8">
          <div class="space-y-4">
            <h1
              class="text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white leading-tight"
            >
              Showcase Your Innovation
            </h1>
            <p
              class="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-lg typewriter"
            >
              {{ subtitle }}
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <ButtonsPresetButton
              preset="exploreHighlightedProjects"
              @click="scrollToProjects"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              <UIcon name="i-heroicons-arrow-right" class="w-5 h-5" />
            </ButtonsPresetButton>
            <ButtonsPresetButton preset="learnMore" to="/about" size="md" />
          </div>

          <!-- Stats Preview -->
          <div
            ref="containerRef"
            class="grid grid-cols-3 gap-4 pt-8 border-t border-gray-300 dark:border-neutral-700"
          >
            <div>
              <div
                class="text-3xl font-semibold text-slate-700 dark:text-blue-400"
              >
                {{ projects }}+
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Projects</p>
            </div>
            <div>
              <div
                class="text-3xl font-semibold text-slate-700 dark:text-blue-400"
              >
                {{ students }}+
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Students</p>
            </div>
            <div>
              <div
                class="text-3xl font-semibold text-slate-700 dark:text-blue-400"
              >
                {{ gens }}
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Gens</p>
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

import { tokenize } from "khmertokenizer";

const subtitle = "បង្កើតដោយនិស្សិត សម្រាប់និស្សិត ₍^.  ̫.^₎";
const typeWriterChars = computed(() => tokenize(subtitle).length);
const typeWriterSpeed = "4s";

// fetch stats data from API by using store
const stats = [
  { label: "Projects", value: 247, suffix: "+" },
  { label: "Students", value: 156, suffix: "+" },
  { label: "Semesters", value: 27, suffix: "" },
];

import { ref, onMounted } from "vue";

const projects = ref(0);
const students = ref(0);
const gens = ref(0);
const containerRef = ref(null);

// Smooth scroll to projects section with header offset
const scrollToProjects = () => {
  const element = document.getElementById("highlighted-projects");
  if (element) {
    const headerOffset = 80; // Adjust this value based on your header height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

const animateCount = (setter, target, duration) => {
  const start = 0;
  const startTime = Date.now();

  const animate = () => {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.floor(progress * (target - start) + start);
    setter.value = current;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(projects, stats[0].value, 2000);
          animateCount(students, stats[1].value, 2000);
          animateCount(gens, stats[2].value, 2000);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  if (containerRef.value) {
    observer.observe(containerRef.value);
  }

  onBeforeUnmount(() => observer.disconnect());
});
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

.count {
  width: 1ch;
  height: 1em;
  overflow: hidden;
  font-size: 40px;
  font-weight: bold;
  line-height: 1em;
}

.num {
  transition: transform 2s cubic-bezier(0.34, 1.56, 0.64, 1);
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
  background-image:
    linear-gradient(
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
  animation: typing v-bind("typeWriterSpeed") steps(v-bind("typeWriterChars"))
    forwards;
}

.dark .typewriter::before {
  background: rgb(23, 23, 23);
  /* neutral-900 */
}

.typewriter::after {
  width: 0.125em;
  background: black;
  animation:
    typing v-bind("typeWriterSpeed") steps(v-bind("typeWriterChars")) forwards,
    blink 1s steps(v-bind("typeWriterChars")) infinite;
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
