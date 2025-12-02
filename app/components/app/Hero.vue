 <script setup>
import { motion, useTime, useTransform } from "motion-v";
import { useHeroRotation } from "~/composables/rotation-cordonate";

// Reactive state for hover
const hoveredTech = ref(null);

// Tech descriptions
const techDescriptions = {
  javascript: "Programming language for web development",
  vue: "JavaScript framework for building UIs",
  react: "Library for building user interfaces",
  linux: "Open-source operating system",
  "cisco-pt": "Network simulation software",
  php: "Server-side scripting language",
  laravel: "PHP framework for web applications",
  java: "Object-oriented programming language",
  spring: "Java framework for enterprise applications",
  go: "Compiled programming language by Google",
  c: "Low-level programming language",
  unity: "Game development engine",
  elixir: "Functional programming language",
  docker: "Containerization platform",
  kubernetes: "Container orchestration system",
  vmware: "Virtualization software",
  python: "High-level programming language",
  tensorflow: "Machine learning library",
  torch: "Deep learning framework",
  mysql: "Relational database management system",
  postgres: "Advanced open-source relational database",
  mongo: "NoSQL document database"
};

// Animation configuration
const duration = 5; // Slow rotation for smooth effect
const middleDuration = 6; // Slower for middle orbit
const outerOrbitDuration = 7; // Slowest for outer orbit

const t1 = duration / 5; // 5 icons in inner orbit
const t2 = middleDuration / 8; // 8 icons in middle orbit
const t3 = outerOrbitDuration / 9; // 9 icons in outer orbit

const innerOrbit1 = useHeroRotation({
  origin: 0,
  distance: 120,
  timeOffset: t1 * 0,
  duration,
});
const innerOrbit2 = useHeroRotation({
  origin: 0,
  distance: 120,
  timeOffset: t1 * 1,
  duration,
});
const innerOrbit3 = useHeroRotation({
  origin: 0,
  distance: 120,
  timeOffset: t1 * 2,
  duration,
});
const innerOrbit4 = useHeroRotation({
  origin: 0,
  distance: 120,
  timeOffset: t1 * 3,
  duration,
});
const innerOrbit5 = useHeroRotation({
  origin: 0,
  distance: 120,
  timeOffset: t1 * 4,
  duration,
});

// Middle orbit (195px radius) - 8 icons
const middleOrbit1 = useHeroRotation({
  origin: 0,
  distance: 195,
  timeOffset: t2 * 5,
  duration: middleDuration,
});
const middleOrbit2 = useHeroRotation({
  origin: 0,
  distance: 195,
  timeOffset: t2 * 6,
  duration: middleDuration,
});
const middleOrbit3 = useHeroRotation({
  origin: 0,
  distance: 195,
  timeOffset: t2 * 7,
  duration: middleDuration,
});
const middleOrbit4 = useHeroRotation({
  origin: 0,
  distance: 195,
  timeOffset: t2 * 8,
  duration: middleDuration,
});
const middleOrbit5 = useHeroRotation({
  origin: 0,
  distance: 195,
  timeOffset: t2 * 9,
  duration: middleDuration,
});
const middleOrbit6 = useHeroRotation({
  origin: 0,
  distance: 195,
  timeOffset: t2 * 10,
  duration: middleDuration,
});
const middleOrbit7 = useHeroRotation({
  origin: 0,
  distance: 195,
  timeOffset: t2 * 11,
  duration: middleDuration,
});
const middleOrbit8 = useHeroRotation({
  origin: 0,
  distance: 195,
  timeOffset: t2 * 12,
  duration: middleDuration,
});

// Outer orbit (300px radius) - 9 icons
const outerOrbit1 = useHeroRotation({
  origin: 0,
  distance: 265,
  timeOffset: t3 * 13,
  duration: outerOrbitDuration,
});
const outerOrbit2 = useHeroRotation({
  origin: 0,
  distance: 265,
  timeOffset: t3 * 14,
  duration: outerOrbitDuration,
});
const outerOrbit3 = useHeroRotation({
  origin: 0,
  distance: 265,
  timeOffset: t3 * 15,
  duration: outerOrbitDuration,
});
const outerOrbit4 = useHeroRotation({
  origin: 0,
  distance: 265,
  timeOffset: t3 * 16,
  duration: outerOrbitDuration,
});
const outerOrbit5 = useHeroRotation({
  origin: 0,
  distance: 265,
  timeOffset: t3 * 17,
  duration: outerOrbitDuration,
});
const outerOrbit6 = useHeroRotation({
  origin: 0,
  distance: 265,
  timeOffset: t3 * 18,
  duration: outerOrbitDuration,
});
const outerOrbit7 = useHeroRotation({
  origin: 0,
  distance: 265,
  timeOffset: t3 * 19,
  duration: outerOrbitDuration,
});
const outerOrbit8 = useHeroRotation({
  origin: 0,
  distance: 265,
  timeOffset: t3 * 20,
  duration: outerOrbitDuration,
});
const outerOrbit9 = useHeroRotation({
  origin: 0,
  distance: 265,
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
      <h1 class="text-3xl mb-2 font-bold text-slate-100">TechHub</h1>
      <p class="text-l text-slate-200">
        Showcasing student <br />tech brilliance
      </p>
    </div>

    <!-- Decorative circles for visual orbit effect -->
    <div
      class="orbit-circle outer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[535px] h-[535px] rounded-full border-2 border-gray-400/20"
    ></div>
    <div
      class="orbit-circle middle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[395px] h-[395px] rounded-full border-2 border-gray-400/30"
    ></div>
    <div
      class="orbit-circle inner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[242px] h-[242px] rounded-full border-2 border-gray-400/40"
    ></div>

    <!-- Inner orbit icons -->
    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...innerOrbit1, zIndex: hoveredTech === 'javascript' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'javascript'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img
          src="/images/tech/javascript-logo.jpg"
          class="w-full h-full object-contain rounded-lg unhighlightable-image"
        />
        <div v-show="hoveredTech === 'javascript'" class="tech-tooltip">
          {{ techDescriptions.javascript }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...innerOrbit2, zIndex: hoveredTech === 'vue' ? 10000 : 3 }"
      @mouseenter="hoveredTech = 'vue'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/vue-logo.png" alt="Vue" class="unhighlightable-image" />
        <div v-show="hoveredTech === 'vue'" class="tech-tooltip">
          {{ techDescriptions.vue }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...innerOrbit3, zIndex: hoveredTech === 'react' ? 10000 : 2 }"
      @mouseenter="hoveredTech = 'react'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/react-logo.png" alt="React" class="unhighlightable-image" />
        <div v-show="hoveredTech === 'react'" class="tech-tooltip">
          {{ techDescriptions.react }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...innerOrbit4, zIndex: hoveredTech === 'linux' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'linux'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/linux-logo.png" alt="Linux" class="unhighlightable-image" />
        <div v-show="hoveredTech === 'linux'" class="tech-tooltip">
          {{ techDescriptions.linux }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...innerOrbit5, zIndex: hoveredTech === 'cisco-pt' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'cisco-pt'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/cisco-pt-logo.png" alt="Cisco Packet Tracer" class="unhighlightable-image" />
        <div v-show="hoveredTech === 'cisco-pt'" class="tech-tooltip">
          {{ techDescriptions['cisco-pt'] }}
        </div>
      </div>
    </motion.div>

    <!-- Middle orbit icons -->
    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...middleOrbit1, zIndex: hoveredTech === 'php' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'php'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/php-logo.png" alt="PHP" class="unhighlightable-image" />
        <div v-show="hoveredTech === 'php'" class="tech-tooltip">
          {{ techDescriptions.php }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...middleOrbit2, zIndex: hoveredTech === 'laravel' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'laravel'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/laravel-logo.png" alt="Laravel" class="unhighlightable-image" />
        <div v-show="hoveredTech === 'laravel'" class="tech-tooltip">
          {{ techDescriptions.laravel }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...middleOrbit3, zIndex: hoveredTech === 'java' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'java'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/java-logo.png" alt="Java" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'java'" class="tech-tooltip">
          {{ techDescriptions.java }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...middleOrbit4, zIndex: hoveredTech === 'spring' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'spring'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/spring-logo.png" alt="Spring" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'spring'" class="tech-tooltip">
          {{ techDescriptions.spring }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...middleOrbit5, zIndex: hoveredTech === 'go' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'go'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/go-logo.png" alt="Go" class="unhighlightable-image" />
        <div v-show="hoveredTech === 'go'" class="tech-tooltip">
          {{ techDescriptions.go }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...middleOrbit6, zIndex: hoveredTech === 'c' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'c'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/c-logo.png" alt="C" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'c'" class="tech-tooltip">
          {{ techDescriptions.c }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...middleOrbit7, zIndex: hoveredTech === 'unity' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'unity'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/unity-logo.png" alt="Unity" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'unity'" class="tech-tooltip">
          {{ techDescriptions.unity }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...middleOrbit8, zIndex: hoveredTech === 'elixir' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'elixir'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/elixir-logo.png" alt="Elixir" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'elixir'" class="tech-tooltip">
          {{ techDescriptions.elixir }}
        </div>
      </div>
    </motion.div>

    <!-- Outer orbit icons -->
    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...outerOrbit1, zIndex: hoveredTech === 'docker' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'docker'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/docker-logo.png" alt="Docker" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'docker'" class="tech-tooltip">
          {{ techDescriptions.docker }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...outerOrbit2, zIndex: hoveredTech === 'kubernetes' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'kubernetes'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/kubernetes-logo.png" alt="Kubernetes" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'kubernetes'" class="tech-tooltip">
          {{ techDescriptions.kubernetes }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...outerOrbit3, zIndex: hoveredTech === 'vmware' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'vmware'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/vmware-logo.png" alt="VMware" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'vmware'" class="tech-tooltip">
          {{ techDescriptions.vmware }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...outerOrbit4, zIndex: hoveredTech === 'python' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'python'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/python-logo.png" alt="Python" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'python'" class="tech-tooltip">
          {{ techDescriptions.python }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...outerOrbit5, zIndex: hoveredTech === 'tensorflow' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'tensorflow'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/tensorflow-logo.png" alt="TensorFlow" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'tensorflow'" class="tech-tooltip">
          {{ techDescriptions.tensorflow }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...outerOrbit6, zIndex: hoveredTech === 'torch' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'torch'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/torch-logo.png" alt="PyTorch" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'torch'" class="tech-tooltip">
          {{ techDescriptions.torch }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...outerOrbit7, zIndex: hoveredTech === 'mysql' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'mysql'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/mysql-logo.png" alt="MySQL" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'mysql'" class="tech-tooltip">
          {{ techDescriptions.mysql }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...outerOrbit8, zIndex: hoveredTech === 'postgres' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'postgres'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/postgres-logo.png" alt="PostgreSQL" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'postgres'" class="tech-tooltip">
          {{ techDescriptions.postgres }}
        </div>
      </div>
    </motion.div>

    <motion.div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :style="{ ...outerOrbit9, zIndex: hoveredTech === 'mongo' ? 10000 : 1 }"
      @mouseenter="hoveredTech = 'mongo'"
      @mouseleave="hoveredTech = null"
    >
      <div class="w-12 h-12 rounded-2xl p-2 shadow-lg relative">
        <img src="/images/tech/mongo-logo.png" alt="MongoDB" class="unhighlightable-image"/>
        <div v-show="hoveredTech === 'mongo'" class="tech-tooltip">
          {{ techDescriptions.mongo }}
        </div>
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

.unhighlightable-image {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none;   /* Safari */
  -khtml-user-select: none;    /* Konqueror HTML */
  -moz-user-select: none;      /* Old versions of Firefox */
  -ms-user-select: none;       /* Internet Explorer/Edge */
  user-select: none;           /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
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

.tech-tooltip {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #374151;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 99999 !important;
  pointer-events: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tech-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(255, 255, 255, 0.95);
}
</style>
