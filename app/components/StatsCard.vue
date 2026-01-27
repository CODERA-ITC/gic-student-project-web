<template>
  <div
    :class="[
      'rounded-lg p-6 border backdrop-blur transition-all duration-300',
      variant === 'filled'
        ? 'bg-slate-800/50 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/70'
        : 'bg-transparent border-slate-700 hover:border-blue-500/50',
    ]"
  >
    <!-- Header with icon -->
    <div class="flex items-start justify-between mb-4">
      <div
        v-if="icon"
        :class="[
          'p-3 rounded-lg w-12 h-12 flex items-center justify-center',
          iconBackground || 'bg-blue-500/20',
        ]"
      >
        <UIcon
          :name="icon"
          :class="['w-6 h-6', iconColor || 'text-blue-400']"
        />
      </div>
      <div v-if="badge" class="text-xs font-semibold" :class="badgeColor">
        {{ badge }}
      </div>
    </div>

    <!-- Value -->
    <div class="mb-2">
      <p class="text-3xl font-semibold text-white">{{ value }}</p>
    </div>

    <!-- Label -->
    <p class="text-gray-400 text-sm mb-4">{{ label }}</p>

    <!-- Trend -->
    <div v-if="trend" class="flex items-center gap-1">
      <UIcon
        :name="
          trend > 0
            ? 'i-heroicons-arrow-trending-up'
            : 'i-heroicons-arrow-trending-down'
        "
        :class="['w-4 h-4', trend > 0 ? 'text-green-400' : 'text-red-400']"
      />
      <span
        :class="[
          trend > 0 ? 'text-green-400' : 'text-red-400',
          'text-sm font-medium',
        ]"
      >
        {{ Math.abs(trend) }}% from last month
      </span>
    </div>

    <!-- Footer slot for additional content -->
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-slate-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: String,
    default: null,
  },
  iconColor: {
    type: String,
    default: "text-blue-400",
  },
  iconBackground: {
    type: String,
    default: "bg-blue-500/20",
  },
  badge: {
    type: String,
    default: null,
  },
  badgeColor: {
    type: String,
    default: "text-blue-300",
  },
  trend: {
    type: Number,
    default: null,
  },
  variant: {
    type: String,
    enum: ["filled", "outline"],
    default: "filled",
  },
});
</script>
