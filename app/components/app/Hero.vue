<script setup>
import { motion, useAnimationFrame, useMotionValue, useTime, useTransform } from 'motion-v'

const duration = 5 // 2 sec
const distance = 180
const origin = 20

const isPaused = ref(false)
const time = useTime()
const pausedTime = useMotionValue(0)
const pauseOffset = useMotionValue(0)

// Track paused time
useAnimationFrame(() => {
  if (isPaused.value) {
    pauseOffset.set(time.get() - pausedTime.get())
  }
  else {
    pausedTime.set(time.get() - pauseOffset.get())
  }
})

function togglePause() {
  isPaused.value = !isPaused.value
}

const count = 7
const multiplier = Array.from({ length: count }, (_, i) => i * 850)
const pos = Array.from({ length: count }, (_, i) => {
  const timeOffset = multiplier[i] * duration

  return {
    x: useTransform(() =>
      Math.cos((pausedTime.get() + timeOffset) / 1000 / duration) * distance + origin,
    ),
    y: useTransform(() =>
      Math.sin((pausedTime.get() + timeOffset) / 1000 / duration) * distance + origin,
    ),
  }
})

const techInfoShouldShow = ref([true, false])
function handleTechMouseEnter(index) {
  // togglePause()
  techInfoShouldShow.value[index] = true
  isPaused.value = true
}
function handleTechMouseLeave(index) {
  // togglePause()
  techInfoShouldShow.value[index] = false
  isPaused.value = false
}
const techInfoData = ref(
  [
    {
      title: 'Javascript',
      content: 'Web Development',
    },
    {
      title: 'VueJs',
      content: 'Frontend Development',
    },
    {
      title: 'o ro cute',
      content: 'Frontend Development',
    },
  ],
)
</script>

<template>
  <section
    id="hero"
    class="hero-section justify-center md:items-center lg:items-start md:justify-center lg:justify-around flex flex-row md:flex-col lg:flex-row"
  >
    <div class="relative top-20 w-40 right-20 h-max">
      <div class="relative top-28 left-12">
        <img src="/images/tech/blackhole.png" width="120" alt="">
      </div>

      <motion.div
        class="relative left-10"
        :style="pos[0]"
      >
        <div
          class="relative"
          @mouseenter="handleTechMouseEnter(0)"
          @mouseleave="handleTechMouseLeave(0)"
        >
          <AppTechInfo
            v-if="techInfoShouldShow[0]"
            class="absolute z-100 t"
            :tech-info="techInfoData[2]"
          />
          <img
            class="absolute"
            src="/images/tech/javascript-logo.jpg"
            width="60"
            alt=""
          >
        </div>

        <div
          class="relative"
          @mouseenter="handleTechMouseEnter(1)"
          @mouseleave="handleTechMouseLeave(1)"
        >
          <AppTechInfo
            v-if="techInfoShouldShow[1]"
            class="absolute left-20 top-10 z-100"
            :tech-info="techInfoData[1]"
          />
          <img
            class="absolute left-15"
            src="/images/tech/vue-logo.png"
            width="60"
            alt=""
          >
        </div>
        <img
          class="absolute left-10 top-10"
          src="/images/tech/react-logo.png"
          width="60"
          alt=""
        >
      </motion.div>

      <motion.div
        class="relative left-8"
        :style="pos[1]"
      >
        <img
          class="absolute"
          src="/images/tech/python-logo.png"
          width="60"
          alt=""
          @mouseenter="handleTechMouseEnter(3)"
          @mouseleave="handleTechMouseLeave(3)"
        >
        <img
          class="absolute left-15"
          src="/images/tech/tensorflow-logo.png"
          width="60"
          alt=""
          @mouseenter="handleTechMouseEnter(3)"
          @mouseleave="togglePause(3)"
        >
        <img
          class="absolute left-10 top-10"
          src="/images/tech/torch-logo.png"
          width="60"
          alt=""
          @mouseenter="handleTechMouseEnter(3)"
          @mouseleave="togglePause(3)"
        >
      </motion.div>

      <motion.div
        class="relative left-8"
        :style="pos[2]"
        @mouseenter="togglePause()"
        @mouseleave="togglePause()"
      >
        <img
          class="absolute"
          src="/images/tech/mysql-logo.png"
          width="60"
          alt=""
          @mouseenter="togglePause()"
          @mouseleave="togglePause()"
        >
        <img
          class="absolute left-15"
          src="/images/tech/postgres-logo.png"
          width="60"
          alt=""
        >
        <img
          class="absolute left-10 top-10"
          src="/images/tech/mongo-logo.png"
          width="60"
          alt=""
        >
      </motion.div>

      <motion.div
        class="relative left-8"
        :style="pos[3]" @mouseenter="togglePause()"
        @mouseleave="togglePause()"
      >
        <img
          class="absolute"
          src="/images/tech/docker-logo.png"
          width="60"
          alt=""
        >
        <img
          class="absolute left-15"
          src="/images/tech/kubernetes-logo.png"
          width="60"
          alt=""
        >
        <img
          class="absolute left-10 top-10"
          src="/images/tech/vmware-logo.png"
          width="60"
          alt=""
        >
      </motion.div>

      <motion.div
        class="relative left-8"
        :style="pos[4]" @mouseenter="togglePause()"
        @mouseleave="togglePause()"
      >
        <img
          class="absolute"
          src="/images/tech/linux-logo.png"
          width="60"
          alt=""
        >
        <img
          class="absolute left-12"
          src="/images/tech/cisco-pt-logo.png"
          width="60"
          alt=""
        >
      </motion.div>

      <motion.div
        class="relative left-8"
        :style="pos[5]" @mouseenter="togglePause()"
        @mouseleave="togglePause()"
      >
        <img
          class="absolute left-4"
          src="/images/tech/go-logo.png"
          width="60"
          alt=""
        >
        <img
          class="absolute left-18"
          src="/images/tech/c-logo.png"
          width="60"
          alt=""
        >
        <img
          class="absolute left-2 top-12"
          src="/images/tech/unity-logo.png"
          width="60"
          alt=""
        >
        <img
          class="absolute left-15 top-16"
          src="/images/tech/elixir-logo.png"
          width="60"
          alt=""
        >
      </motion.div>

      <motion.div
        class="relative left-8"
        :style="pos[6]" @mouseenter="togglePause()"
        @mouseleave="togglePause()"
      >
        <img
          class="absolute left-4"
          src="/images/tech/java-logo.png"
          width="60"
          alt=""
        >
        <img
          class="absolute left-18"
          src="/images/tech/spring-logo.png"
          width="60"
          alt=""
        >
        <img
          class="absolute left-2 top-14"
          src="/images/tech/php-logo.png"
          width="60"
          alt=""
        >
        <img
          class="absolute left-16 top-14"
          src="/images/tech/laravel-logo.png"
          width="60"
          alt=""
        >
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
