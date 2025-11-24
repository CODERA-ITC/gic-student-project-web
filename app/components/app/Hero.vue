<script setup>
import { motion, useTime, useTransform } from "motion-v";

const duration = 5; // 2 sec
const distance = 180;
const origin = 20;

const multiplier = Array.from({ length: 7 }, (_, i) => i * 800);

const js = useHeroRotation({
  origin,
  distance,
  timeOffset: multiplier[0] * duration,
  duration,
});
const py = useHeroRotation({
  origin,
  distance,
  timeOffset: multiplier[1] * duration + 500,
  duration,
});
const db = useHeroRotation({
  origin,
  distance,
  timeOffset: multiplier[2] * duration,
  duration,
});
const ops = useHeroRotation({
  origin,
  distance,
  timeOffset: multiplier[3] * duration,
  duration,
});
const tux = useHeroRotation({
  origin,
  distance,
  timeOffset: multiplier[4] * duration,
  duration,
});
const cool = useHeroRotation({
  origin,
  distance,
  timeOffset: multiplier[5] * duration + 500,
  duration,
});
const php = useHeroRotation({
  origin,
  distance,
  timeOffset: multiplier[6] * duration + 1500,
  duration,
});
</script>

<template>
  <section
    class="hero-section justify-center md:items-center lg:items-start md:justify-center lg:justify-around flex flex-row md:flex-col lg:flex-row"
  >
    <!-- <div class="text relative bottom-25">
      <img
        class="relative right-8 top-20"
        src="/images/gic-logo-big.png"
        width="600"
        alt="gic-logo"
      />
      <h1 class="text-4xl">See what our students built!</h1>

      <div class="flex flex-row space-x-4 text-2xl font-semibold items-center">
        <div>
          <p>250+</p>
          <p>Projects</p>
        </div>
        <USeparator orientation="vertical" class="h-20" />
        <div>
          <p>250+</p>
          <p>GICats</p>
        </div>
      </div>
      <br />
      <h2 class="text-2xl font">for students by students. ₍^. ̫.^₎</h2>
    </div> -->

    <div class="relative top-20 w-40 right-20 h-max">
      <div class="relative top-28 left-12">
        <img src="/images/tech/blackhole.png" width="120" alt="" />
      </div>

      <motion.div class="relative left-10" :style="js">
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

      <motion.div class="relative left-8" :style="py">
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

      <motion.div class="relative left-8" :style="db">
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

      <motion.div class="relative left-8" :style="ops">
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

      <motion.div class="relative left-8" :style="tux">
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

      <motion.div class="relative left-8" :style="cool">
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

      <motion.div class="relative left-8" :style="php">
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
