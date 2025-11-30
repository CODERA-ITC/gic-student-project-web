<script setup>
import { motion, useTime, useTransform } from "motion-v";
import { useHeroRotation } from "~/composables/rotation-cordonate";

// Animation configuration
const duration = 1; // Slow rotation for smooth effect
const middleDuration = 2; // Slower for middle orbit
const outerOrbitDuration = 3; // Slowest for outer orbit

const t1 = duration / 5; // 5 icons in inner orbit
const t2 = middleDuration / 8; // 8 icons in middle orbit
const t3 = outerOrbitDuration / 9; // 9 icons in outer orbit

const innerOrbit1 = useHeroRotation({
  origin: 0,
  distance: 140,
  timeOffset: t1 * 0,
  duration,
});
const innerOrbit2 = useHeroRotation({
  origin: 0,
  distance: 140,
  timeOffset: t1 * 1,
  duration,
});
const innerOrbit3 = useHeroRotation({
  origin: 0,
  distance: 140,
  timeOffset: t1 * 2,
  duration,
});
const innerOrbit4 = useHeroRotation({
  origin: 0,
  distance: 140,
  timeOffset: t1 * 3,
  duration,
});
const innerOrbit5 = useHeroRotation({
  origin: 0,
  distance: 140,
  timeOffset: t1 * 4,
  duration,
});

// Middle orbit (215px radius) - 8 icons
const middleOrbit1 = useHeroRotation({
  origin: 0,
  distance: 215,
  timeOffset: t2 * 5,
  duration: middleDuration,
});
const middleOrbit2 = useHeroRotation({
  origin: 0,
  distance: 215,
  timeOffset: t2 * 6,
  duration: middleDuration,
});
const middleOrbit3 = useHeroRotation({
  origin: 0,
  distance: 215,
  timeOffset: t2 * 7,
  duration: middleDuration,
});
const middleOrbit4 = useHeroRotation({
  origin: 0,
  distance: 215,
  timeOffset: t2 * 8,
  duration: middleDuration,
});
const middleOrbit5 = useHeroRotation({
  origin: 0,
  distance: 215,
  timeOffset: t2 * 9,
  duration: middleDuration,
});
const middleOrbit6 = useHeroRotation({
  origin: 0,
  distance: 215,
  timeOffset: t2 * 10,
  duration: middleDuration,
});
const middleOrbit7 = useHeroRotation({
  origin: 0,
  distance: 215,
  timeOffset: t2 * 11,
  duration: middleDuration,
});
const middleOrbit8 = useHeroRotation({
  origin: 0,
  distance: 215,
  timeOffset: t2 * 12,
  duration: middleDuration,
});

// Outer orbit (300px radius) - 9 icons
const outerOrbit1 = useHeroRotation({
  origin: 0,
  distance: 285,
  timeOffset: t3 * 13,
  duration: outerOrbitDuration,
});
const outerOrbit2 = useHeroRotation({
  origin: 0,
  distance: 285,
  timeOffset: t3 * 14,
  duration: outerOrbitDuration,
});
const outerOrbit3 = useHeroRotation({
  origin: 0,
  distance: 285,
  timeOffset: t3 * 15,
  duration: outerOrbitDuration,
});
const outerOrbit4 = useHeroRotation({
  origin: 0,
  distance: 285,
  timeOffset: t3 * 16,
  duration: outerOrbitDuration,
});
const outerOrbit5 = useHeroRotation({
  origin: 0,
  distance: 285,
  timeOffset: t3 * 17,
  duration: outerOrbitDuration,
});
const outerOrbit6 = useHeroRotation({
  origin: 0,
  distance: 285,
  timeOffset: t3 * 18,
  duration: outerOrbitDuration,
});
const outerOrbit7 = useHeroRotation({
  origin: 0,
  distance: 285,
  timeOffset: t3 * 19,
  duration: outerOrbitDuration,
});
const outerOrbit8 = useHeroRotation({
  origin: 0,
  distance: 285,
  timeOffset: t3 * 20,
  duration: outerOrbitDuration,
});
const outerOrbit9 = useHeroRotation({
  origin: 0,
  distance: 285,
  timeOffset: t3 * 21,
  duration: outerOrbitDuration,
});
</script>

<template>
  <section
    class="hero-section flex items-center justify-center relative min-h-[700px]"
  >
    <!-- Central content -->
    <div class="relative z-10 text-center">
      <h1 class="text-4xl mb-2 font-bold text-slate-100">TechHub</h1>
      <p class="text-xl text-slate-200">
        Showcasing student <br />tech brilliance
      </p>
    </div>

    <!-- Decorative circles for visual orbit effect -->
    <div
      class="orbit-circle outer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[570px] h-[570px] rounded-full border-2 border-gray-400/20"
    ></div>
    <div
      class="orbit-circle middle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[430px] h-[430px] rounded-full border-2 border-gray-400/30"
    ></div>
    <div
      class="orbit-circle inner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border-2 border-gray-400/40"
    ></div>

    <!-- Inner orbit icons -->
    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="innerOrbit1"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img
          src="/images/tech/javascript-logo.jpg"
          class="w-full h-full object-contain rounded-lg"
        />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...innerOrbit2, zIndex: 3 }"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/vue-logo.png" alt="Vue" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...innerOrbit3, zIndex: 2 }"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/react-logo.png" alt="React" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="innerOrbit4"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/linux-logo.png" alt="Linux" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="innerOrbit5"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/cisco-pt-logo.png" alt="Cisco Packet Tracer" />
      </div>
    </motion.div>

    <!-- Middle orbit icons -->
    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...middleOrbit1, zIndex: 1 }"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/php-logo.png" alt="PHP" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="middleOrbit2"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/laravel-logo.png" alt="Laravel" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="middleOrbit3"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/java-logo.png" alt="Java" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="middleOrbit4"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/spring-logo.png" alt="Spring" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="middleOrbit5"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/go-logo.png" alt="Go" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="middleOrbit6"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/c-logo.png" alt="C" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="middleOrbit7"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/unity-logo.png" alt="Unity" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="middleOrbit8"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/elixir-logo.png" alt="Elixir" />
      </div>
    </motion.div>

    <!-- Outer orbit icons -->
    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="outerOrbit1"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/docker-logo.png" alt="Docker" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="outerOrbit2"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/kubernetes-logo.png" alt="Kubernetes" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="outerOrbit3"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/vmware-logo.png" alt="VMware" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="outerOrbit4"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/python-logo.png" alt="Python" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="outerOrbit5"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/tensorflow-logo.png" alt="TensorFlow" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="outerOrbit6"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/torch-logo.png" alt="PyTorch" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="outerOrbit7"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/mysql-logo.png" alt="MySQL" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="outerOrbit8"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/postgres-logo.png" alt="PostgreSQL" />
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="outerOrbit9"
    >
      <div class="w-16 h-16 rounded-2xl p-3 shadow-lg">
        <img src="/images/tech/mongo-logo.png" alt="MongoDB" />
      </div>
    </motion.div>
  </section>
</template>

<style scoped>
.hero-section {
  display: flex;
  /* justify-content: space-around; */
}

.hero-section > .tech-spin {
  justify-self: right;
}

.tech-spin {
  width: 200px;
}

.tech-1 {
  position: relative;
}

.tech-1 img {
  position: absolute;
}

#vue {
  left: 60px;
}
#react {
  top: 40px;
  left: 40px;
}

.orbit-circle {
  transition: all 0.3s ease;
}

.orbit-circle.outer {
  animation: glow 4s ease-in-out infinite;
}

.orbit-circle.middle {
  animation: glow 3s ease-in-out infinite;
}

.orbit-circle.inner {
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(156, 163, 175, 0.2);
  }
  50% {
    box-shadow: 0 0 40px rgba(156, 163, 175, 0.4);
  }
}
</style>
