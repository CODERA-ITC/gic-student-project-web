<script setup>
import { motion, MotionValue, useAnimationControls, useAnimationFrame, useMotionValue, useTime, useTransform } from "motion-v";
import { stop } from "vue";

const duration = 5; // 2 sec
const distance = 180;
const origin = 20;

const isPaused = ref(false)
const time = useTime()
const pausedTime = useMotionValue(0)
const pauseOffset = useMotionValue(0)

// Track paused time
useAnimationFrame(() => {
  if (isPaused.value) {
    pauseOffset.set(time.get() - pausedTime.get())
  } else {
    pausedTime.set(time.get() - pauseOffset.get())
  }
})

function togglePause() {
  isPaused.value = !isPaused.value
}

const count = 7
const multiplier = Array.from({ length: count }, (_, i) => i * 850);
const pos = Array.from({ length: count }, (_, i) => {
  const timeOffset = multiplier[i] * duration
  
  return {
    x: useTransform(() => 
      Math.cos((pausedTime.get() + timeOffset) / 1000 / duration) * distance + origin
    ),
    y: useTransform(() => 
      Math.sin((pausedTime.get() + timeOffset) / 1000 / duration) * distance + origin
    ),
  }
})

</script>

<template>
  <section
    class="hero-section justify-center md:items-center lg:items-start md:justify-center lg:justify-around flex flex-row md:flex-col lg:flex-row"
  >
  
    <div class="relative top-20 w-40 right-20 h-max">
      <div class="relative top-28 left-12">
        <img src="/images/tech/blackhole.png" width="120" alt="" />
      </div>

      <motion.div class="relative left-10" 
      @mouseenter="togglePause()" @mouseleave="togglePause()" 
      :style="pos[0]"
      >
        <img
          class="absolute"
          src="/images/tech/javascript-logo.jpg"
          width="60"
          alt=""
        />
        <img
          class="absolute left-15"
          src="/images/tech/vue-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-10 top-10"
          src="/images/tech/react-logo.png"
          width="60"
          alt=""
        />
      </motion.div>

      <motion.div class="relative left-8"
      @mouseenter="togglePause()" @mouseleave="togglePause()" 
      :style="pos[1]">
        <img
          class="absolute"
          src="/images/tech/python-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-15"
          src="/images/tech/tensorflow-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-10 top-10"
          src="/images/tech/torch-logo.png"
          width="60"
          alt=""
        />
      </motion.div>

      <motion.div class="relative left-8"
      @mouseenter="togglePause()" @mouseleave="togglePause()"
      :style="pos[2]">
        <img
          class="absolute"
          src="/images/tech/mysql-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-15"
          src="/images/tech/postgres-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-10 top-10"
          src="/images/tech/mongo-logo.png"
          width="60"
          alt=""
        />
      </motion.div>

      <motion.div class="relative left-8"
      @mouseenter="togglePause()" @mouseleave="togglePause()"
      :style="pos[3]">
        <img
          class="absolute"
          src="/images/tech/docker-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-15"
          src="/images/tech/kubernetes-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-10 top-10"
          src="/images/tech/vmware-logo.png"
          width="60"
          alt=""
        />
      </motion.div>

      <motion.div class="relative left-8"
      @mouseenter="togglePause()" @mouseleave="togglePause()"
      :style="pos[4]">
        <img
          class="absolute"
          src="/images/tech/linux-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-12"
          src="/images/tech/cisco-pt-logo.png"
          width="60"
          alt=""
        />
      </motion.div>

      <motion.div class="relative left-8"
      @mouseenter="togglePause()" @mouseleave="togglePause()"
      :style="pos[5]">
        <img
          class="absolute left-4"
          src="/images/tech/go-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-18"
          src="/images/tech/c-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-2 top-12"
          src="/images/tech/unity-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-15 top-16"
          src="/images/tech/elixir-logo.png"
          width="60"
          alt=""
        />
      </motion.div>

      <motion.div class="relative left-8"
      @mouseenter="togglePause()" @mouseleave="togglePause()"
      :style="pos[6]">
        <img
          class="absolute left-4"
          src="/images/tech/java-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-18"
          src="/images/tech/spring-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-2 top-14"
          src="/images/tech/php-logo.png"
          width="60"
          alt=""
        />
        <img
          class="absolute left-16 top-14"
          src="/images/tech/laravel-logo.png"
          width="60"
          alt=""
        />
      </motion.div>
    </div>
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
</style>
