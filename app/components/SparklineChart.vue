<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    class="sparkline-chart"
    preserveAspectRatio="none"
  >
    <!-- Area under the line -->
    <path v-if="showArea" :d="areaPath" :fill="color" fill-opacity="0.2" />

    <!-- The line itself -->
    <path
      :d="linePath"
      :stroke="color"
      :stroke-width="strokeWidth"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showArea?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  width: 100,
  height: 40,
  color: "#3b82f6",
  strokeWidth: 2,
  showArea: true,
});

// Find min and max values
const minValue = computed(() => {
  if (!props.data || props.data.length === 0) return 0;
  return Math.min(...props.data);
});

const maxValue = computed(() => {
  if (!props.data || props.data.length === 0) return 0;
  return Math.max(...props.data);
});

// Convert data numbers to Y positions on the chart
const yPositions = computed(() => {
  if (!props.data || props.data.length === 0) return [];

  const min = minValue.value;
  const max = maxValue.value;
  const range = max - min;

  // If all values are the same, put line in the middle
  if (range === 0) {
    return props.data.map(() => props.height / 2);
  }

  // Convert each value to a Y position (0 = top, height = bottom)
  return props.data.map((value) => {
    const percent = (value - min) / range; // 0 to 1
    const y = props.height - percent * (props.height - 4) - 2; // Flip and add padding
    return y;
  });
});

// Create the line path (like "M 0,10 L 20,15 L 40,8")
const linePath = computed(() => {
  if (!props.data || props.data.length === 0) return "";

  const xStep = props.width / (props.data.length - 1 || 1);
  const points = yPositions.value.map((y, i) => `${i * xStep},${y}`);

  return `M ${points.join(" L ")}`;
});

// Create the filled area path
const areaPath = computed(() => {
  if (!props.data || props.data.length === 0) return "";

  const xStep = props.width / (props.data.length - 1 || 1);
  const points = yPositions.value.map((y, i) => `${i * xStep},${y}`);
  const lastX = (props.data.length - 1) * xStep;

  // Start at line, go to bottom-right, bottom-left, then close
  return `M ${points.join(" L ")} L ${lastX},${props.height} L 0,${
    props.height
  } Z`;
});
</script>

<style scoped>
.sparkline-chart {
  display: block;
}
</style>
