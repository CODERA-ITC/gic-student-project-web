<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[
      getButtonClasses(color, variant, size, fullWidth),
      {
        'opacity-50 cursor-not-allowed': disabled || loading,
        relative: loading,
        'pointer-events-none': disabled || loading,
      },
    ]"
    @click="handleClick"
    v-bind="$attrs"
  >
    <!-- Loading spinner -->
    <UIcon
      v-if="loading"
      name="i-heroicons-arrow-path"
      class="w-5 h-5 animate-spin"
    />

    <!-- Icon -->
    <UIcon
      v-else-if="icon"
      :name="icon"
      :class="[iconSize, trailingIcon ? 'order-last' : '']"
    />

    <!-- Label -->
    <span class="truncate">{{ label }}</span>
  </NuxtLink>

  <button
    v-else
    :type="type"
    :disabled="disabled || loading"
    :class="[
      getButtonClasses(color, variant, size, fullWidth),
      {
        'opacity-50 cursor-not-allowed': disabled || loading,
        relative: loading,
      },
    ]"
    @click="handleClick"
    v-bind="$attrs"
  >
    <!-- Loading spinner -->
    <UIcon
      v-if="loading"
      name="i-heroicons-arrow-path"
      class="w-5 h-5 animate-spin"
    />

    <!-- Icon -->
    <UIcon
      v-else-if="icon"
      :name="icon"
      :class="[iconSize, trailingIcon ? 'order-last' : '']"
    />

    <!-- Label -->
    <span class="truncate">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ButtonVariant, ButtonColor, ButtonSize } from "~/types/buttons";
import { getButtonClasses } from "~/types/buttons";

interface Props {
  label: string;
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  to?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  trailingIcon?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  variant: "solid",
  size: "md",
  type: "button",
  disabled: false,
  loading: false,
  trailingIcon: false,
  fullWidth: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const iconSize = computed(() => {
  const sizes: Record<ButtonSize, string> = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7",
  };
  // Ensure consistent rendering on server and client
  return sizes[props.size];
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>
