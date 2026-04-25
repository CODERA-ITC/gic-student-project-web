<template>
  <div
    class="sparkline-container"
    :style="{ '--hover-color': color }"
    ref="container"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
  >
    <sparklines>
      <sparkline-line
        :width="width"
        :height="height"
        :data="data"
        :styles="{
          stroke: color,
          strokeWidth: strokeWidth,
          fill: showArea ? color : 'none',
          fillOpacity: showArea ? 0.2 : 0,
        }"
      />
    </sparklines>
  </div>
</template>

<script setup lang="ts">
import { Sparklines, SparklineLine } from "vue-sparklines";
import { nextTick, onMounted, ref, watch } from "vue";

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

const container = ref<HTMLElement>();

const updateHoverColors = () => {
  if (!container.value) return;

  // Update cursor line color
  const cursorLine = container.value.querySelector(
    'line[style*="stroke"]'
  ) as SVGLineElement;
  if (cursorLine) {
    cursorLine.style.stroke = props.color;
  }

  // Update tooltip dot color
  const tooltipSpan = container.value.querySelector(
    ".sparkline__tooltip span"
  ) as HTMLSpanElement;
  if (tooltipSpan) {
    tooltipSpan.style.color = props.color;
  }
};

onMounted(() => {
  nextTick(() => {
    updateHoverColors();
  });
});

watch(
  () => props.color,
  () => {
    nextTick(() => {
      updateHoverColors();
    });
  }
);

// Also update on mouse events to handle dynamic hover
const handleMouseEnter = () => {
  setTimeout(updateHoverColors, 10);
};

const handleMouseMove = () => {
  setTimeout(updateHoverColors, 10);
};
</script>

<style scoped>
.sparkline-container :deep(.sparkline__cursor),
.sparkline-container :deep(line[style*="stroke"]) {
  stroke: var(--hover-color) !important;
}

.sparkline-container :deep(.sparkline__tooltip) {
  background: rgba(0, 0, 0, 0.8) !important;
}

.sparkline-container :deep(.sparkline__tooltip span),
.sparkline-container :deep(.sparkline__tooltip span[style*="color"]) {
  color: var(--hover-color) !important;
}
</style>
