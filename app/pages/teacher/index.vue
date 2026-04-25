<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

// Redirect to teacher dashboard
navigateTo("/teacher/dashboard", { replace: true });
</script>
