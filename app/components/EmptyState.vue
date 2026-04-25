<template>
  <div class="flex flex-col items-center justify-center py-20 px-4">
    <!-- Icon -->
    <div class="mb-6">
      <div
        :class="[
          'w-20 h-20 rounded-full flex items-center justify-center',
          iconBackground || 'bg-slate-800/50',
        ]"
      >
        <UIcon
          :name="icon || 'i-heroicons-inbox'"
          :class="['w-10 h-10', iconColor || 'text-gray-600']"
        />
      </div>
    </div>

    <!-- Title -->
    <h3 class="text-xl font-semibold text-white mb-2">{{ title }}</h3>

    <!-- Description -->
    <p class="text-gray-400 text-center max-w-md mb-6">{{ description }}</p>

    <!-- Action button -->
    <button
      v-if="actionLabel && !hideAction"
      :class="[
        'px-6 py-2 rounded-lg font-medium transition-colors',
        'bg-blue-600 hover:bg-blue-700 text-white',
      ]"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>

    <!-- Custom slot -->
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: "i-heroicons-inbox",
  },
  iconColor: {
    type: String,
    default: "text-gray-600",
  },
  iconBackground: {
    type: String,
    default: "bg-slate-800/50",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actionLabel: {
    type: String,
    default: null,
  },
  hideAction: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["action"]);
</script>
