<template>
  <UButton color="gray" variant="ghost" size="md" @click="toggleLocale">
    <span class="text-4xl">
      {{ locale === "kh" ? "🇬🇧" : "🇰🇭" }}
    </span>
  </UButton>
</template>

<script setup>
const { locale } = useI18n();

const emit = defineEmits(["switch-locale"]);

const toggleLocale = () => {
  const newLocale = locale.value === "en" ? "kh" : "en";
  emit("switch-locale", newLocale);
};
</script>
