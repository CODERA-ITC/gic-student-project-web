<template>
  <ButtonsAppButton :label="buttonConfig.label" :icon="buttonConfig.icon" :color="buttonConfig.color"
    :variant="buttonConfig.variant" :size="buttonConfig.size" :textSize="buttonConfig.textSize"
    :to="buttonConfig.to || props.to" :disabled="disabled" :loading="loading" @click="emit('click', $event)"
    v-bind="$attrs" />
</template>

<script setup lang="ts">
import type {
  ButtonConfig,
  ButtonColor,
  ButtonVariant,
  ButtonSize,
} from "~/types/buttons";
import { BUTTON_PRESETS, ROLE_BASED_BUTTONS } from "~/types/buttons";
import { useAuthStore } from "~/stores/auth";

interface Props {
  preset?: keyof typeof BUTTON_PRESETS;
  roleAware?: boolean;
  to?: string;
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;
  // Override properties
  label?: string;
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  textSize?: ButtonSize;
}

const props = withDefaults(defineProps<Props>(), {
  preset: undefined,
  roleAware: false,
  disabled: false,
  loading: false,
  active: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const { t } = useI18n();
const authStore = useAuthStore();

const buttonConfig = computed<ButtonConfig>(() => {
  let config: ButtonConfig;

  if (props.roleAware && authStore.userRole) {
    const roleBased = ROLE_BASED_BUTTONS[authStore.userRole];
    config = roleBased.primary as ButtonConfig;
  } else if (props.preset && BUTTON_PRESETS[props.preset]) {
    config = BUTTON_PRESETS[props.preset] as ButtonConfig;
  } else {
    config = {
      label: props.label ?? "Button",
      color: props.color || "primary",
      variant: props.variant || "solid",
      size: props.size || "md",
      icon: props.icon,
      textSize: props.textSize,
    };
  }

  // Override with props
  if (props.label !== undefined) config.label = props.label;
  if (props.color) config.color = props.color;
  if (props.variant) config.variant = props.variant;
  if (props.size) config.size = props.size;
  if (props.icon !== undefined) config.icon = props.icon;
  if (props.textSize) config.textSize = props.textSize;

  // Handle active state
  if (props.active) {
    config.color = "primary";
    config.variant = "solid";
  }

  // Apply localization without mutating shared presets
  const localizedLabel =
    props.label ??
    (config.labelKey ? t(config.labelKey) : config.label || "Button");

  return {
    ...config,
    label: localizedLabel,
  };
});
</script>
