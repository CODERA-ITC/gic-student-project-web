<template>
  <h1 class="text-white">List all projects</h1>

  <p class="text-white">{{ projects.projects.length }} projects found.</p>
  <p class="text-white">{{ status }}</p>
</template>
<script setup lang="ts">
const { data: projects, status } = await useFetch("/api/projects");
</script>
