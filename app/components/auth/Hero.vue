<!-- components/Auth/Hero.vue -->
<template>
  <div
    @click="backToPrevious"
    class="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden hover:cursor-pointer"
  >
    <div
      class="absolute inset-0 bg-cover bg-center opacity-30"
      style="
        background-image: url(&quot;/images/ITCcampus.png&quot;);
        background-size: 160%;
      "
    ></div>

    <!-- Overlay Content -->
    <div class="relative h-full flex flex-col justify-between p-12 text-white">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="w-24 h-24 rounded-lg flex items-center justify-center">
          <NuxtImg
            src="/images/itc-logo.png"
            alt="ITC Logo"
            class="w-24 h-24 object-contain ml-12 mr-4"
          />
          <NuxtImg
            src="/images/gic-logo-small.png"
            alt="GIC Logo"
            class="w-24 h-24 object-contain"
          />
        </div>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div
      class="absolute top-20 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
    ></div>
    <div
      class="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
    ></div>
  </div>
</template>

<script lang="ts" setup>
const backToPrevious = () => {
  navigateTo("/");
};
</script>
