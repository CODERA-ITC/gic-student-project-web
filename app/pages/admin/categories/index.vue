<template>
  <EntityManagementPage
    title="Category Management"
    subtitle="Manage project categories used across the platform."
    icon="i-heroicons-rectangle-stack"
    singular-label="Category"
    plural-label="Categories"
    resource="categories"
  />
</template>

<script setup>
import EntityManagementPage from "~/components/admin/EntityManagementPage.vue";

definePageMeta({
  middleware: ["auth", "admin"],
});
</script>
