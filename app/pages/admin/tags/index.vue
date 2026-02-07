<template>
  <EntityManagementPage
    title="Tag Management"
    subtitle="Manage tags used to classify and search projects."
    icon="i-heroicons-tag"
    singular-label="Tag"
    plural-label="Tags"
    resource="tags"
  />
</template>

<script setup>
import EntityManagementPage from "~/components/admin/EntityManagementPage.vue";

definePageMeta({
  middleware: ["auth", "admin"],
});
</script>
