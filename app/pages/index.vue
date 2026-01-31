<template>
  <div>
    <HeroSection />

    <!-- highlighted or featured -->
    <FeaturedProjectsSection />

    <!-- popular project -->
    <PopularProjectsSection />

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
