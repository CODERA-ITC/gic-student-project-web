<template>
  <div class="bg-white">
    <HeroSection />

    <!-- highlighted or featured -->
    <HighlightedProjects />

    <!-- popular project -->
    <!-- <PopularProjectsSection /> -->

    <CTASection />

    <ScrollToTop />
  </div>
</template>




<script setup>
const { t } = useI18n();

useHead(() => ({
  title: t("homePage.metaTitle"),
  meta: [
    {
      name: "description",
      content: t("homePage.metaDescription"),
    },
  ],
}));
</script>
