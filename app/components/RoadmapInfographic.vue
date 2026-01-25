<script setup lang="ts">
import { computed, h, resolveComponent } from "vue";
import {
  MapPin,
  Mail,
  Home,
  Settings,
  MessageCircle,
  Lightbulb,
  Check,
  Clock,
  Circle,
} from "lucide-vue-next";

type MilestoneStatus = "done" | "in-progress" | "pending";

interface MilestoneData {
  number?: string;
  title?: string;
  name?: string; // Alternative to title
  description: string;
  icon: string; // Icon class string (e.g., "i-lucide-book-open")
  date: string;
  status: MilestoneStatus;
}

// Props with default milestones data
const props = withDefaults(
  defineProps<{
    milestones?: MilestoneData[];
  }>(),
  {
    milestones: () => [
      {
        number: "01",
        title: "Discovery",
        description:
          "Research and understand the project requirements, goals, and user needs.",
        icon: "i-lucide-map-pin",
        date: "Jan 2024",
        status: "done",
      },
      {
        number: "02",
        title: "Planning",
        description:
          "Create detailed project plans, timelines, and resource allocation.",
        icon: "i-lucide-mail",
        date: "Mar 2024",
        status: "done",
      },
      {
        number: "03",
        title: "Development",
        description:
          "Build and implement the solution following best practices.",
        icon: "i-lucide-home",
        date: "Jun 2024",
        status: "in-progress",
      },
      {
        number: "04",
        title: "Testing",
        description:
          "Thoroughly test all features to ensure quality and reliability.",
        icon: "i-lucide-settings",
        date: "Sep 2024",
        status: "pending",
      },
      {
        number: "05",
        title: "Launch",
        description: "Deploy the final product and provide ongoing support.",
        icon: "i-lucide-message-circle",
        date: "Nov 2024",
        status: "pending",
      },
      {
        number: "06",
        title: "Optimize",
        description: "Continuously improve based on feedback and metrics.",
        icon: "i-lucide-lightbulb",
        date: "Jan 2025",
        status: "pending",
      },
    ],
  },
);

// Helper to get title from milestone (supports both title and name)
const getMilestoneTitle = (milestone: MilestoneData) =>
  milestone.title || milestone.name || "";

// Helper to get unique key for milestone
const getMilestoneKey = (milestone: MilestoneData, index: number) =>
  milestone.number || `milestone-${index}`;

const milestoneColors = [
  "bg-milestone-1",
  "bg-milestone-2",
  "bg-milestone-3",
  "bg-milestone-4",
  "bg-milestone-5",
  "bg-milestone-6",
];

const milestoneTextColors = [
  "text-milestone-1",
  "text-milestone-2",
  "text-milestone-3",
  "text-milestone-4",
  "text-milestone-5",
  "text-milestone-6",
];

const milestoneShadowColors = [
  "hover:shadow-[0_10px_40px_-10px_hsl(var(--milestone-1)/0.4)]",
  "hover:shadow-[0_10px_40px_-10px_hsl(var(--milestone-2)/0.4)]",
  "hover:shadow-[0_10px_40px_-10px_hsl(var(--milestone-3)/0.4)]",
  "hover:shadow-[0_10px_40px_-10px_hsl(var(--milestone-4)/0.4)]",
  "hover:shadow-[0_10px_40px_-10px_hsl(var(--milestone-5)/0.4)]",
  "hover:shadow-[0_10px_40px_-10px_hsl(var(--milestone-6)/0.4)]",
];

const milestoneRingColors = [
  "border-milestone-1",
  "border-milestone-2",
  "border-milestone-3",
  "border-milestone-4",
  "border-milestone-5",
  "border-milestone-6",
];

const positions = ["8%", "26%", "45%", "64%", "82%"];

const sliceDesktopMilestones = computed(() => props.milestones.slice(0, 5));

const cls = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

// StatusBadge component
const StatusBadge = (props: { status: MilestoneStatus }) => {
  const statusConfig = {
    done: {
      label: "Done",
      icon: () => h(Check, { class: "w-3 h-3" }),
      className: "bg-status-done/15 text-status-done border-status-done/30",
    },
    "in-progress": {
      label: "In Progress",
      icon: () => h(Clock, { class: "w-3 h-3 animate-pulse" }),
      className:
        "bg-status-progress/15 text-status-progress border-status-progress/30",
    },
    pending: {
      label: "Pending",
      icon: () => h(Circle, { class: "w-3 h-3" }),
      className:
        "bg-status-pending/15 text-status-pending border-status-pending/30",
    },
  };

  const config = statusConfig[props.status];

  return h(
    "span",
    {
      class: [
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border",
        config.className,
      ],
    },
    [config.icon(), config.label],
  );
};

// IconCircle component
const IconCircle = (props: {
  icon: string;
  index: number;
  size?: string;
  status: MilestoneStatus;
}) => {
  const sizeClasses =
    props.size === "sm" ? "w-10 h-10" : "w-12 h-12 md:w-14 md:h-14";
  const ringOffset = props.size === "sm" ? "-inset-1.5" : "-inset-2";
  const opacityClass =
    props.status === "pending" ? "opacity-50" : "opacity-100";

  // Render icon - use UIcon component from Nuxt UI with milestone color
  const iconContent = h(resolveComponent("UIcon"), {
    name: props.icon,
    class: ["w-6 h-6 shrink-0", milestoneTextColors[props.index]],
  });

  return h("div", { class: ["relative group", opacityClass] }, [
    h("div", {
      class: [
        "absolute rounded-full border-2 border-dotted transition-transform duration-300 group-hover:scale-110",
        ringOffset,
        milestoneRingColors[props.index],
      ],
    }),
    h(
      "div",
      {
        class: [
          "rounded-full flex items-center justify-center text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-105",
          sizeClasses,
          milestoneColors[props.index],
          props.status === "in-progress"
            ? "ring-2 ring-status-progress ring-offset-2 ring-offset-background"
            : "",
        ],
      },
      [iconContent],
    ),
  ]);
};
</script>

<template>
  <div
    class="w-full py-10 md:py-16 px-4 overflow-hidden min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
  >
    <!-- Desktop Layout -->
    <div class="hidden lg:block relative max-w-6xl mx-auto mt-10">
      <!-- Road SVG -->
      <div class="relative h-32 flex items-center my-40">
        <svg
          viewBox="0 0 1200 120"
          class="w-full h-full"
          preserveAspectRatio="none"
        >
          <!-- Gray outline -->
          <path
            d="M0,60 C100,60 150,25 250,25 C350,25 400,95 500,95 C600,95 650,25 750,25 C850,25 900,95 1000,95 C1100,95 1150,60 1200,60"
            fill="none"
            stroke="#cbd5e1"
            stroke-width="50"
            stroke-linecap="round"
          />
          <!-- Dark road -->
          <path
            d="M0,60 C100,60 150,25 250,25 C350,25 400,95 500,95 C600,95 650,25 750,25 C850,25 900,95 1000,95 C1100,95 1150,60 1200,60"
            fill="none"
            stroke="#475569"
            stroke-width="40"
            stroke-linecap="round"
          />
          <!-- Yellow center line -->
          <path
            d="M0,60 C100,60 150,25 250,25 C350,25 400,95 500,95 C600,95 650,25 750,25 C850,25 900,95 1000,95 C1100,95 1150,60 1200,60"
            fill="none"
            stroke="#fbbf24"
            stroke-width="3"
            stroke-dasharray="20,15"
            stroke-linecap="round"
          />

          <!-- Road dots -->
          <circle cx="100" cy="55" r="6" fill="#3b82f6" />
          <circle cx="320" cy="35" r="6" fill="#8b5cf6" />
          <circle cx="550" cy="85" r="6" fill="#ec4899" />
          <circle cx="780" cy="35" r="6" fill="#f97316" />
          <circle cx="1000" cy="85" r="6" fill="#10b981" />
        </svg>

        <!-- Milestone items -->
        <div
          v-for="(milestone, index) in sliceDesktopMilestones"
          :key="getMilestoneKey(milestone, index)"
          class="absolute flex flex-col items-center gap-2"
          :class="index % 2 === 1 ? 'bottom-full mb-4' : 'top-full mt-4'"
          :style="{ left: positions[index], transform: 'translateX(-50%)' }"
        >
          <template v-if="index % 2 === 1">
            <!-- Card first for top -->
            <div
              class="rounded-xl p-4 border max-w-[180px] text-center transition-all duration-300 cursor-pointer hover:-translate-y-1"
              :class="[
                milestoneShadowColors[index],
                milestone.status === 'pending' ? 'opacity-60' : '',
                index === 0
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                  : index === 1
                    ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                    : index === 2
                      ? 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800'
                      : index === 3
                        ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
              ]"
            >
              <div class="flex items-center justify-center gap-2 mb-2">
                <span
                  class="text-xs text-gray-700 dark:text-gray-300 font-medium"
                >
                  {{ milestone.date }}
                </span>
                <StatusBadge :status="milestone.status" />
              </div>
              <h3
                class="font-bold text-sm mb-1"
                :class="milestoneTextColors[index]"
              >
                {{ getMilestoneTitle(milestone) }}
              </h3>
              <p
                class="text-gray-700 dark:text-gray-300 text-xs leading-relaxed"
              >
                {{ milestone.description }}
              </p>
            </div>
            <!-- Icon -->
            <IconCircle
              :icon="milestone.icon"
              :index="index"
              :status="milestone.status"
            />
            <!-- Connector -->
            <div
              class="w-px h-6 border-l-2 border-dashed"
              :class="milestoneRingColors[index]"
            />
          </template>
          <template v-else>
            <!-- Connector -->
            <div
              class="w-px h-6 border-l-2 border-dashed"
              :class="milestoneRingColors[index]"
            />
            <!-- Icon -->
            <IconCircle
              :icon="milestone.icon"
              :index="index"
              :status="milestone.status"
            />
            <!-- Card -->
            <div
              class="rounded-xl p-4 border max-w-[180px] text-center transition-all duration-300 cursor-pointer hover:-translate-y-1"
              :class="[
                milestoneShadowColors[index],
                milestone.status === 'pending' ? 'opacity-60' : '',
                index === 0
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                  : index === 1
                    ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                    : index === 2
                      ? 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800'
                      : index === 3
                        ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
              ]"
            >
              <div class="flex items-center justify-center gap-2 mb-2">
                <span
                  class="text-xs text-gray-700 dark:text-gray-300 font-medium"
                >
                  {{ milestone.date }}
                </span>
                <StatusBadge :status="milestone.status" />
              </div>
              <h3
                class="font-bold text-sm mb-1"
                :class="milestoneTextColors[index]"
              >
                {{ getMilestoneTitle(milestone) }}
              </h3>
              <p
                class="text-gray-700 dark:text-gray-300 text-xs leading-relaxed"
              >
                {{ milestone.description }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile/Tablet Layout -->
    <div class="lg:hidden relative max-w-md mx-auto px-4 mt-10">
      <!-- Vertical road SVG -->
      <svg
        viewBox="0 0 300 1300"
        class="absolute left-1/2 -translate-x-1/2 h-full w-[300px] top-0"
        preserveAspectRatio="xMidYMin slice"
      >
        <!-- Gray outline -->
        <path
          d="M150,0 
             C150,40 240,70 240,130 
             C240,190 60,220 60,280 
             C60,340 240,370 240,430 
             C240,490 60,520 60,580 
             C60,640 240,670 240,730 
             C240,790 60,820 60,880
             C60,940 150,970 150,1300"
          fill="none"
          stroke="#cbd5e1"
          stroke-width="45"
          stroke-linecap="round"
        />
        <!-- Dark road -->
        <path
          d="M150,0 
             C150,40 240,70 240,130 
             C240,190 60,220 60,280 
             C60,340 240,370 240,430 
             C240,490 60,520 60,580 
             C60,640 240,670 240,730 
             C240,790 60,820 60,880
             C60,940 150,970 150,1300"
          fill="none"
          stroke="#475569"
          stroke-width="35"
          stroke-linecap="round"
        />
        <!-- Yellow center line -->
        <path
          d="M150,0 
             C150,40 240,70 240,130 
             C240,190 60,220 60,280 
             C60,340 240,370 240,430 
             C240,490 60,520 60,580 
             C60,640 240,670 240,730 
             C240,790 60,820 60,880
             C60,940 150,970 150,1300"
          fill="none"
          stroke="#fbbf24"
          stroke-width="2.5"
          stroke-dasharray="12,10"
          stroke-linecap="round"
        />
      </svg>

      <!-- Milestones -->
      <div class="relative z-10 space-y-6 py-8">
        <div
          v-for="(milestone, index) in props.milestones"
          :key="getMilestoneKey(milestone, index)"
          class="flex items-center gap-3 opacity-0 animate-fade-in-up"
          :class="index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
          :style="{ animationDelay: `${index * 0.12}s` }"
        >
          <!-- Content Card -->
          <div
            class="flex-1 rounded-xl p-3 sm:p-4 border transition-all duration-300 cursor-pointer hover:-translate-y-1"
            :class="[
              milestoneShadowColors[index],
              index % 2 === 0 ? 'text-right' : 'text-left',
              milestone.status === 'pending' ? 'opacity-60' : '',
              index === 0
                ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                : index === 1
                  ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                  : index === 2
                    ? 'bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800'
                    : index === 3
                      ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
                      : index === 4
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                        : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
            ]"
          >
            <div
              class="flex items-center gap-2 mb-2"
              :class="index % 2 === 0 ? 'justify-end' : 'justify-start'"
            >
              <span
                class="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 font-medium"
              >
                {{ milestone.date }}
              </span>
              <StatusBadge :status="milestone.status" />
            </div>
            <h3
              class="font-bold text-sm sm:text-base mb-1"
              :class="milestoneTextColors[index]"
            >
              {{ getMilestoneTitle(milestone) }}
            </h3>
            <p
              class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed"
            >
              {{ milestone.description }}
            </p>
          </div>

          <!-- Icon with dotted border -->
          <div class="flex-shrink-0">
            <IconCircle
              :icon="milestone.icon"
              :index="index"
              size="sm"
              :status="milestone.status"
            />
          </div>

          <!-- Spacer -->
          <div class="flex-1" />
        </div>
      </div>
    </div>
  </div>
</template>
