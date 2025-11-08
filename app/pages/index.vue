<template>
  <div class="bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Hero Section -->
    <HeroSection />

    <!-- Features Section -->
    <FeaturesSection />

    <!-- Featured Projects Section -->
    <FeaturedProjectsSection />

    <!-- CTA Section -->
    <CTASection />

  <UChip>
    <UButton icon="i-lucide-mail" color="neutral" variant="subtle" />
  </UChip>

  </div>
</template>

<script setup>
useHead({
  title: "GIC Student Portal - Showcase Your Innovation",
  meta: [
    {
      name: "description",
      content:
        "Join thousands of talented GIC students showcasing amazing projects. From AI innovations to mobile apps, discover the future of technology.",
    },
  ],
});
</script>
