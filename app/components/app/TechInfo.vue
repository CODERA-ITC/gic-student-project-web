<script setup lang="ts">
interface TechInfo {
  title: string
  content: string
}

const props = defineProps<{
  techInfo: TechInfo
}>()

const { techInfo } = props
</script>

<template>
  <UCard>
    <template #header>
      <h2>{{ techInfo.title }}</h2>
    </template>
    <p>{{ techInfo.content }}</p>
  </UCard>
</template>
