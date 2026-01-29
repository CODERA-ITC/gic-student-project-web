/**
 * Button Types and Configurations
 * Provides consistent button styling patterns across the application
 */

/**
 * Button variant type
 */
export type ButtonVariant = "solid" | "outline" | "ghost" | "gradient";

/**
 * Button color type
 */
export type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "blue"
  | "gradient-primary"
  | "gradient-success"
  | "gradient-danger";

/**
 * Button size type
 */
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Button configuration interface
 */
export interface ButtonConfig {
  label: string;
  icon?: string;
  color: ButtonColor;
  variant: ButtonVariant;
  size: ButtonSize;
  textSize?: ButtonSize;
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

/**
 * Color palette configuration
 */
export const BUTTON_COLORS = {
  primary: {
    solid:
      "bg-blue-900 hover:bg-blue-800 hover:cursor-pointer dark:bg-blue-700 text-white dark:text-white",
    outline:
      "border-2 border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:cursor-pointer",
    ghost:
      "text-blue-900 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:cursor-pointer",
    gradient:
      "bg-gradient-to-r from-blue-600 to-cyan-600 text-white dark:text-white hover:shadow-lg hover:shadow-blue-500/50 hover:cursor-pointer",
  },
  secondary: {
    solid:
      "bg-indigo-900 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 hover:cursor-pointer text-white dark:text-white",
    outline:
      "border-2 border-indigo-900 text-indigo-900 dark:border-indigo-400 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:cursor-pointer",
    ghost:
      "text-indigo-900 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 hover:cursor-pointer",
    gradient:
      "bg-gradient-to-r from-indigo-600 to-blue-600 text-white dark:text-white hover:shadow-lg hover:shadow-indigo-500/50 hover:cursor-pointer",
  },
  success: {
    solid:
      "bg-gray-600/90 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 hover:cursor-pointer text-white dark:text-white",
    outline:
      "border-2 border-gray-600 text-gray-600 dark:border-gray-400 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/20 hover:cursor-pointer",
    ghost:
      "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/20 hover:cursor-pointer",
    gradient:
      "bg-gradient-to-r from-gray-600 to-gray-600 text-white dark:text-white hover:shadow-lg hover:shadow-gray-500/50 hover:cursor-pointer",
  },
  danger: {
    solid:
      "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 hover:cursor-pointer text-white dark:text-white",
    outline:
      "border-2 border-red-600 text-red-600 dark:border-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:cursor-pointer",
    ghost:
      "text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover:cursor-pointer",
    gradient:
      "bg-gradient-to-r from-red-600 to-orange-600 text-white dark:text-white hover:shadow-lg hover:shadow-red-500/50 hover:cursor-pointer",
  },
  warning: {
    solid:
      "bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 hover:cursor-pointer text-white dark:text-white",
    outline:
      "border-2 border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:cursor-pointer",
    ghost:
      "text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20 hover:cursor-pointer",
    gradient:
      "bg-gradient-to-r from-amber-600 to-orange-600 text-white dark:text-white hover:shadow-lg hover:shadow-amber-500/50 hover:cursor-pointer",
  },
  info: {
    solid:
      "bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 hover:cursor-pointer text-white dark:text-white",
    outline:
      "border-2 border-cyan-600 text-cyan-600 dark:border-cyan-400 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:cursor-pointer",
    ghost:
      "text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/20 hover:cursor-pointer",
    gradient:
      "bg-gradient-to-r from-cyan-600 to-blue-600 text-white dark:text-white hover:shadow-lg hover:shadow-cyan-500/50 hover:cursor-pointer",
  },
  blue: {
    solid:
      "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 hover:cursor-pointer text-white dark:text-white",
    outline:
      "border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:cursor-pointer",
    ghost:
      "text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:cursor-pointer",
    gradient:
      "bg-gradient-to-r from-blue-600 to-cyan-600 text-white dark:text-white hover:shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-blue-400/30 hover:cursor-pointer",
  },
  "gradient-primary": {
    solid:
      "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-700 dark:via-blue-600 dark:to-cyan-600 text-white dark:text-white hover:shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-blue-400/30 hover:cursor-pointer",
    outline:
      "border-2 border-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-700 dark:via-blue-600 dark:to-cyan-600 text-white dark:text-white hover:shadow-lg dark:hover:shadow-blue-400/30 hover:cursor-pointer",
    ghost:
      "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 dark:from-blue-500/30 dark:to-cyan-500/30 text-blue-600 dark:text-blue-400 hover:shadow-lg hover:cursor-pointer",
    gradient:
      "bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700 text-white dark:text-white hover:shadow-xl hover:shadow-blue-500/60 dark:hover:shadow-blue-400/40 hover:cursor-pointer",
  },
  "gradient-success": {
    solid:
      "bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-700 dark:via-teal-600 dark:to-cyan-600 text-white dark:text-white hover:shadow-lg hover:shadow-emerald-500/50 dark:hover:shadow-emerald-400/30 hover:cursor-pointer",
    outline:
      "border-2 border-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-700 dark:to-teal-600 text-white dark:text-white hover:shadow-lg dark:hover:shadow-emerald-400/30 hover:cursor-pointer",
    ghost:
      "bg-gradient-to-r from-emerald-600/20 to-teal-600/20 dark:from-emerald-500/30 dark:to-teal-500/30 text-emerald-600 dark:text-emerald-400 hover:shadow-lg hover:cursor-pointer",
    gradient:
      "bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 text-white dark:text-white hover:shadow-xl hover:shadow-emerald-500/60 dark:hover:shadow-emerald-400/40 hover:cursor-pointer",
  },
  "gradient-danger": {
    solid:
      "bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 dark:from-red-700 dark:via-orange-600 dark:to-amber-600 text-white dark:text-white hover:shadow-lg hover:shadow-red-500/50 dark:hover:shadow-red-400/30 hover:cursor-pointer",
    outline:
      "border-2 border-transparent bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-700 dark:to-orange-600 text-white dark:text-white hover:shadow-lg dark:hover:shadow-red-400/30 hover:cursor-pointer",
    ghost:
      "bg-gradient-to-r from-red-600/20 to-orange-600/20 dark:from-red-500/30 dark:to-orange-500/30 text-red-600 dark:text-red-400 hover:shadow-lg hover:cursor-pointer",
    gradient:
      "bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-700 dark:to-orange-700 text-white dark:text-white hover:shadow-xl hover:shadow-red-500/60 dark:hover:shadow-red-400/40 hover:cursor-pointer",
  },
};

/**
 * Size configuration
 * Enhanced for mobile touch targets (minimum 44x44px for accessibility)
 */
export const BUTTON_SIZES = {
  xs: "px-2 py-1 text-xs min-h-[32px]",
  sm: "px-3 py-2 text-sm min-h-[36px]",
  md: "px-4 py-2.5 text-base min-h-[44px]",
  lg: "px-6 py-3 text-lg min-h-[48px]",
  xl: "px-8 py-4 text-xl min-h-[56px]",
};

/**
 * Base button styles (always applied)
 * Enhanced for mobile accessibility with proper touch targets
 */
export const BUTTON_BASE =
  "inline-flex items-center font-medium justify-center gap-2 rounded-md transition-all duration-300 focus:outline-none touch-manipulation select-none active:scale-95";

/**
 * Get button classes based on configuration
 */
export function getButtonClasses(
  color: ButtonColor,
  variant: ButtonVariant = "solid",
  size: ButtonSize = "sm", //default size of buttons
  fullWidth: boolean = false
): string {
  const colorClasses =
    BUTTON_COLORS[color]?.[variant] || BUTTON_COLORS.primary.solid;
  const sizeClasses = BUTTON_SIZES[size];
  const widthClasses = fullWidth ? "w-full" : "";

  return `${BUTTON_BASE} ${colorClasses} ${sizeClasses} ${widthClasses}`;
}

/**
 * Predefined button configurations
 */
export const BUTTON_PRESETS = {
  // Primary Action Buttons
  exploreProjects: {
    label: "Explore Projects",
    icon: "i-heroicons-rocket-launch",
    color: "primary" as ButtonColor,
    variant: "solid" as ButtonVariant,
    size: "lg" as ButtonSize,
  },
  exploreHighlightedProjects: {
    label: "Highlighted Projects",
    icon: "i-heroicons-rocket-launch",
    color: "primary" as ButtonColor,
    variant: "solid" as ButtonVariant,
    size: "lg" as ButtonSize,
  },
  createProject: {
    label: "Create Project",
    icon: "i-heroicons-plus",
    color: "primary",
    variant: "solid",
    size: "lg",
  },
  learnMore: {
    label: "Learn More",
    icon: "i-heroicons-arrow-top-right-on-square",
    color: "primary",
    variant: "outline",
    size: "lg",
  },

  // Secondary Action Buttons
  meetStudent: {
    label: "Meet Our Student",
    icon: "i-heroicons-user-group",
    color: "success",
    variant: "solid",
    size: "lg",
  },
  viewDashboard: {
    label: "View Dashboard",
    icon: "i-heroicons-chart-bar",
    color: "secondary",
    variant: "solid",
    size: "lg",
  },

  // Tertiary Action Buttons
  viewCalendar: {
    label: "View Calendar",
    icon: "i-heroicons-calendar",
    color: "info",
    variant: "outline",
    size: "lg",
  },
  submitProject: {
    label: "Submit Your Project",
    icon: "i-heroicons-clipboard-document-check",
    color: "primary",
    variant: "outline",
    size: "lg",
  },
  viewProfileStudent: {
    label: "View Profile",
    color: "primary",
    variant: "solid",
    size: "lg",
    fullWidth: true,
  },
  // Admin/Teacher Buttons
  manageStudents: {
    label: "Manage Students",
    icon: "i-heroicons-user-group",
    color: "primary",
    variant: "solid",
    size: "lg",
  },
  reviewProjects: {
    label: "Review Projects",
    icon: "i-heroicons-document-check",
    color: "success",
    variant: "solid",
    size: "lg",
  },
  viewAnalytics: {
    label: "View Analytics",
    icon: "i-heroicons-chart-bar",
    color: "primary",
    variant: "solid",
    size: "lg",
  },
  viewAll: {
    label: "View All",
    icon: "i-heroicons-arrow-right-20-solid",
    color: "primary",
    variant: "outline",
    size: "sm",
  },

  // Common Buttons
  save: {
    label: "Save",
    icon: "i-heroicons-check",
    color: "success",
    variant: "solid",
    size: "md",
  },
  cancel: {
    label: "Cancel",
    icon: "i-heroicons-x-mark",
    color: "danger",
    variant: "ghost",
    size: "md",
  },
  secondary: {
    label: "Secondary",
    color: "secondary",
    variant: "outline",
    size: "md",
  },
  delete: {
    label: "Delete",
    icon: "i-heroicons-trash",
    color: "danger",
    variant: "outline",
    size: "md",
  },
  edit: {
    label: "Edit",
    icon: "i-heroicons-pencil",
    color: "info",
    variant: "outline",
    size: "md",
  },
  back: {
    label: "Back",
    icon: "i-heroicons-arrow-left",
    color: "secondary",
    variant: "ghost",
    size: "md",
  },
  signin: {
    label: "Sign In",
    icon: "i-heroicons-arrow-right-on-rectangle-20-solid",
    color: "primary",
    variant: "solid",
    size: "md",
  },
  signup: {
    label: "Sign Up",
    icon: "i-heroicons-user-plus-20-solid",
    color: "primary",
    variant: "solid",
    size: "md",
  },
  submit: {
    label: "Submit",
    icon: "i-heroicons-check",
    color: "primary",
    variant: "solid",
    size: "md",
  },
  confirm: {
    label: "Confirm",
    icon: "i-heroicons-check",
    color: "primary",
    variant: "solid",
    size: "md",
  },
  close: {
    label: "Close",
    icon: "i-heroicons-x-mark",
    color: "secondary",
    variant: "ghost",
    size: "md",
  },
  search: {
    label: "Search",
    icon: "i-heroicons-magnifying-glass",
    color: "primary",
    variant: "solid",
    size: "md",
  },
  filter: {
    label: "Filter",
    icon: "i-heroicons-funnel",
    color: "secondary",
    variant: "outline",
    size: "md",
  },
  reset: {
    label: "Reset",
    icon: "i-heroicons-arrow-path",
    color: "warning",
    variant: "ghost",
    size: "md",
  },
  viewDetails: {
    label: "View Details",
    icon: null,
    color: "primary",
    variant: "solid",
    text: "text-white",
    size: "md",
  },
  clearFilters: {
    label: "Clear Filters",
    icon: "i-heroicons-trash",
    color: "danger",
    variant: "solid",
    size: "md",
  },
  // Filter buttons for teacher dashboard
  // activeProjects: {
  //   label: "Active Projects",
  //   icon: null,
  //   color: "blue",
  //   variant: "ghost",
  //   size: "md",
  // },

  activeProjects: {
    label: "Active Project",
    icon: "",
    color: "primary",
    variant: "solid",
    size: "sm",
  },
  pendingReviews: {
    label: "Pending Reviews",
    icon: null,
    color: "blue",
    variant: "solid",
    size: "sm",
  },
};

/**
 * Role-based button configurations
 */
export const ROLE_BASED_BUTTONS = {
  student: {
    primary: BUTTON_PRESETS.exploreProjects,
    secondary: BUTTON_PRESETS.createProject,
    tertiary: BUTTON_PRESETS.learnMore,
  },
  teacher: {
    primary: BUTTON_PRESETS.reviewProjects,
    secondary: BUTTON_PRESETS.viewAnalytics,
    tertiary: BUTTON_PRESETS.manageStudents,
  },
};
