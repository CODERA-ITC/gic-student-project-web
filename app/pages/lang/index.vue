<script setup>
const { locales, setLocale } = useI18n();
</script>

<template>
  <UContainer>
    <div class="text-white">
      <button v-for="locale in locales" @click="setLocale(locale.code)">
        {{ locale.name }}
      </button>
      <h1>{{ $t("welcome") }}</h1>
    </div>
  </UContainer>
</template>
