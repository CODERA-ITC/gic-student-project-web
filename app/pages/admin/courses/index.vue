<template>
  <EntityManagementPage
    title="Course Management"
    subtitle="Manage course records and availability for projects."
    icon="i-heroicons-book-open"
    singular-label="Course"
    plural-label="Courses"
    resource="courses"
    :supports-code="true"
  />
</template>

<script setup>
import EntityManagementPage from "~/components/admin/EntityManagementPage.vue";

definePageMeta({
  middleware: ["auth", "admin"],
});
</script>
