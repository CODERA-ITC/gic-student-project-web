<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

// Redirect to student dashboard
navigateTo("/student/dashboard", { replace: true });
</script>
