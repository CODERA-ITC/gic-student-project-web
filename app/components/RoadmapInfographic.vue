<script setup lang="ts">
import { computed, h, resolveComponent, onMounted, ref } from "vue";
import { Check, Clock, Circle } from "lucide-vue-next";

type MilestoneStatus = "done" | "ongoing" | "pending";

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
        status: "ongoing",
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
  "text-milestone-1 dark:text-blue-400",
  "text-milestone-2 dark:text-purple-400",
  "text-milestone-3 dark:text-pink-400",
  "text-milestone-4 dark:text-orange-400",
  "text-milestone-5 dark:text-emerald-400",
  "text-milestone-6 dark:text-yellow-400",
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

// Positions calculated from SVG coordinates (100/1200 = 8.33%, 280/1200 = 23.33%, etc.)
const positions = ["8.33%", "23.33%", "38.33%", "53.33%", "68.33%", "83.33%"];

const sliceDesktopMilestones = computed(() => props.milestones);

// Dynamic bullet positions based on number of milestones
const bulletData = computed(() => {
  const count = Math.min(sliceDesktopMilestones.value.length, 6);
  const bullets = [];
  const colors = [
    {
      fill: "#3b82f6",
      darkFill: "blue-400",
      bg: "bg-blue-500/20",
      darkBg: "bg-blue-500/30",
    },
    {
      fill: "#8b5cf6",
      darkFill: "purple-400",
      bg: "bg-purple-500/20",
      darkBg: "bg-purple-500/30",
    },
    {
      fill: "#ec4899",
      darkFill: "pink-400",
      bg: "bg-pink-500/20",
      darkBg: "bg-pink-500/30",
    },
    {
      fill: "#f97316",
      darkFill: "orange-400",
      bg: "bg-orange-500/20",
      darkBg: "bg-orange-500/30",
    },
    {
      fill: "#10b981",
      darkFill: "emerald-400",
      bg: "bg-emerald-500/20",
      darkBg: "bg-emerald-500/30",
    },
    {
      fill: "#eab308",
      darkFill: "yellow-400",
      bg: "bg-yellow-500/20",
      darkBg: "bg-yellow-500/30",
    },
  ];

  for (let i = 0; i < count; i++) {
    const x = 100 + (i * 1000) / (count - 1);
    const isTop = i % 2 === 0;

    // Calculate Y position on the S-curve road
    // Road path: M0,120 C80,120 100,30 180,30 C260,30 280,210 360,210 C440,210 460,25 540,25 C620,25 640,215 720,215 C800,215 820,30 900,30 C980,30 1000,120 1200,120
    let y = 120; // default center
    if (x <= 180) {
      // First curve: from 120 down to 30
      y = 120 - (x / 180) * 90;
    } else if (x <= 360) {
      // Second curve: from 30 up to 210
      y = 30 + ((x - 180) / 180) * 180;
    } else if (x <= 540) {
      // Third curve: from 210 down to 25
      y = 210 - ((x - 360) / 180) * 185;
    } else if (x <= 720) {
      // Fourth curve: from 25 up to 215
      y = 25 + ((x - 540) / 180) * 190;
    } else if (x <= 900) {
      // Fifth curve: from 215 down to 30
      y = 215 - ((x - 720) / 180) * 185;
    } else {
      // Last curve: from 30 back to 120
      y = 30 + ((x - 900) / 300) * 90;
    }

    bullets.push({
      x,
      y,
      isTop,
      position: `${(x / 1200) * 100}%`,
      ...colors[i],
    });
  }
  return bullets;
});

const cls = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

// Refs for scroll animations
const mobileContainer = ref<HTMLElement | null>(null);
const desktopContainer = ref<HTMLElement | null>(null);
const milestoneRefs = ref<HTMLElement[]>([]);

// Setup intersection observer for scroll animations
onMounted(() => {
  if (typeof window === "undefined") return;

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observe mobile milestones
  if (mobileContainer.value) {
    const milestones =
      mobileContainer.value.querySelectorAll(".milestone-item");
    milestones.forEach((milestone) => observer.observe(milestone));
  }

  // Observe desktop milestones
  if (desktopContainer.value) {
    const milestones =
      desktopContainer.value.querySelectorAll(".milestone-item");
    milestones.forEach((milestone) => observer.observe(milestone));
  }
});

// StatusBadge component
const StatusBadge = (props: { status: MilestoneStatus }) => {
  const statusConfig = {
    done: {
      label: "Done",
      icon: () => h(Check, { class: "w-3 h-3" }),
      className:
        "bg-status-done/15 text-status-done dark:text-green-400 border-status-done/30 dark:border-green-400/30",
    },
    ongoing: {
      label: "Ongoing",
      icon: () => h(Clock, { class: "w-3 h-3 animate-pulse" }),
      className:
        "bg-status-progress/15 text-status-progress dark:text-blue-400 border-status-progress/30 dark:border-blue-400/30",
    },
    pending: {
      label: "Pending",
      icon: () => h(Circle, { class: "w-3 h-3" }),
      className:
        "bg-status-pending/15 text-status-pending dark:text-gray-400 border-status-pending/30 dark:border-gray-400/30",
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

// Helper to get card background classes
const getCardBgClasses = (index: number) => {
  const bullet = bulletData.value[index];
  if (!bullet) return "bg-blue-50 dark:bg-blue-900/30";
  return `${bullet.bg} dark:${bullet.darkBg}`;
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
    class: [
      "w-6 h-6 shrink-0",
      milestoneTextColors[props.index],
      "dark:text-white",
    ],
  });

  return h("div", { class: ["relative group", opacityClass] }, [
    h("div", {
      class: [
        "absolute rounded-full border-2 border-dotted transition-all duration-500 group-hover:scale-125 group-hover:rotate-180",
        ringOffset,
        milestoneRingColors[props.index],
      ],
    }),
    // Outer glow for ongoing status
    props.status === "ongoing"
      ? h("div", {
          class: [
            "absolute rounded-full bg-blue-400 dark:bg-blue-500 opacity-30 animate-ping",
            "-inset-4",
          ],
        })
      : null,
    h(
      "div",
      {
        class: [
          "rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ease-in-out group-hover:shadow-2xl group-hover:scale-110",
          sizeClasses,
          getCardBgClasses(props.index),
          props.status === "ongoing"
            ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 animate-pulse"
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
    class="w-full py-10 md:py-16 px-4 overflow-x-hidden min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
  >
    <!-- Desktop Layout -->
    <div
      ref="desktopContainer"
      class="hidden lg:block relative max-w-6xl mx-auto mt-20 mb-20 pt-10"
    >
      <!-- Special layout for single milestone -->
      <div
        v-if="sliceDesktopMilestones.length === 1"
        class="flex flex-col items-center justify-center min-h-[400px]"
      >
        <div
          class="milestone-item flex flex-col items-center gap-4 opacity-0 transition-all duration-700"
        >
          <div
            class="rounded-xl p-6 border-2 max-w-[300px] text-center transition-all duration-500 ease-in-out cursor-pointer shadow-lg backdrop-blur-sm hover:shadow-2xl hover:scale-105 group"
            :class="[
              milestoneShadowColors[0],
              sliceDesktopMilestones[0].status === 'pending'
                ? 'opacity-60 grayscale-[0.3]'
                : '',
              sliceDesktopMilestones[0].status === 'ongoing'
                ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                : '',
              getCardBgClasses(0),
            ]"
            :style="{
              borderColor: bulletData[0]?.fill || '#3b82f6',
            }"
          >
            <!-- Progress indicator for ongoing -->
            <div
              v-if="sliceDesktopMilestones[0].status === 'ongoing'"
              class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"
            />
            <div
              v-if="sliceDesktopMilestones[0].status === 'ongoing'"
              class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
            />

            <div class="flex items-center justify-center gap-2 mb-3">
              <span
                class="text-xs text-blue-700 dark:text-blue-300 font-medium"
              >
                {{ sliceDesktopMilestones[0].date }}
              </span>
              <StatusBadge :status="sliceDesktopMilestones[0].status" />
            </div>
            <h3
              class="font-bold text-base mb-2"
              :class="milestoneTextColors[0]"
            >
              {{ getMilestoneTitle(sliceDesktopMilestones[0]) }}
            </h3>
            <p
              class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
            >
              {{ sliceDesktopMilestones[0].description }}
            </p>
          </div>

          <IconCircle
            :icon="sliceDesktopMilestones[0].icon"
            :index="0"
            :status="sliceDesktopMilestones[0].status"
            size="lg"
          />
        </div>
      </div>

      <!-- Road SVG for multiple milestones -->
      <div v-else class="relative h-64 flex items-center my-56">
        <svg
          viewBox="0 0 1200 240"
          class="w-full h-full"
          preserveAspectRatio="none"
        >
          <!-- Gray outline -->
          <path
            d="M0,120 C80,120 100,30 180,30 C260,30 280,210 360,210 C440,210 460,25 540,25 C620,25 640,215 720,215 C800,215 820,30 900,30 C980,30 1000,120 1200,120"
            fill="none"
            stroke="#cbd5e1"
            class="dark:stroke-gray-600"
            stroke-width="50"
            stroke-linecap="round"
          />
          <!-- Dark road -->
          <path
            d="M0,120 C80,120 100,30 180,30 C260,30 280,210 360,210 C440,210 460,25 540,25 C620,25 640,215 720,215 C800,215 820,30 900,30 C980,30 1000,120 1200,120"
            fill="none"
            stroke="#475569"
            class="dark:stroke-gray-700"
            stroke-width="40"
            stroke-linecap="round"
          />
          <!-- Yellow center line -->
          <path
            d="M0,120 C80,120 100,30 180,30 C260,30 280,210 360,210 C440,210 460,25 540,25 C620,25 640,215 720,215 C800,215 820,30 900,30 C980,30 1000,120 1200,120"
            fill="none"
            stroke="#fbbf24"
            class="dark:stroke-yellow-500"
            stroke-width="3"
            stroke-dasharray="20,15"
            stroke-linecap="round"
          />

          <!-- Dynamic Road dots and connector lines -->
          <template v-for="(bullet, index) in bulletData" :key="index">
            <!-- Bullet dot -->
            <circle
              :cx="bullet.x"
              :cy="bullet.y"
              r="7"
              :fill="bullet.fill"
              :class="`dark:fill-${bullet.darkFill}`"
            />

            <!-- Dashed connector line -->
            <line
              :x1="bullet.x"
              :y1="bullet.y"
              :x2="bullet.x"
              :y2="bullet.isTop ? -50 : 290"
              :stroke="bullet.fill"
              stroke-width="2"
              stroke-dasharray="5,5"
              :class="`dark:stroke-${bullet.darkFill}`"
              opacity="0.7"
            />
          </template>
        </svg>

        <!-- Milestone items -->
        <div
          v-for="(milestone, index) in sliceDesktopMilestones"
          :key="getMilestoneKey(milestone, index)"
          class="milestone-item absolute flex flex-col items-center gap-4 opacity-0 transition-all duration-700"
          :class="
            bulletData[index]?.isTop
              ? 'bottom-full mb-[20px]'
              : 'top-full mt-[20px]'
          "
          :style="{
            left: bulletData[index]?.position || '0',
            marginLeft: '-100px',
            transitionDelay: `${index * 100}ms`,
          }"
        >
          <template v-if="bulletData[index]?.isTop">
            <!-- Card first for top -->
            <div
              class="rounded-xl p-4 border-2 max-w-[200px] text-center transition-all duration-500 ease-in-out cursor-pointer shadow-lg backdrop-blur-sm hover:shadow-2xl hover:scale-105 group"
              :class="[
                milestoneShadowColors[index],
                milestone.status === 'pending'
                  ? 'opacity-60 grayscale-[0.3]'
                  : '',
                milestone.status === 'ongoing'
                  ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                  : '',
                getCardBgClasses(index),
              ]"
              :style="{
                borderColor: bulletData[index]?.fill || '#3b82f6',
              }"
            >
              <!-- Progress indicator for ongoing -->
              <div
                v-if="milestone.status === 'ongoing'"
                class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"
              />
              <div
                v-if="milestone.status === 'ongoing'"
                class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
              />

              <div class="flex items-center justify-center gap-2 mb-3">
                <span
                  class="text-xs font-semibold text-blue-800 dark:text-blue-200 tracking-wide"
                >
                  {{ milestone.date }}
                </span>
                <StatusBadge :status="milestone.status" />
              </div>
              <h3
                class="font-bold text-base mb-2 group-hover:scale-105 transition-transform duration-300"
                :class="milestoneTextColors[index]"
              >
                {{ getMilestoneTitle(milestone) }}
              </h3>
              <p
                class="text-slate-600 dark:text-slate-400 text-xs leading-relaxed"
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
          </template>
          <template v-else>
            <!-- Connector -->

            <!-- Icon -->
            <IconCircle
              :icon="milestone.icon"
              :index="index"
              :status="milestone.status"
            />
            <!-- Card -->
            <div
              class="rounded-xl p-4 border-2 max-w-[200px] text-center transition-all duration-500 ease-in-out cursor-pointer shadow-lg backdrop-blur-sm hover:shadow-2xl hover:scale-105 group"
              :class="[
                milestoneShadowColors[index],
                milestone.status === 'pending'
                  ? 'opacity-60 grayscale-[0.3]'
                  : '',
                milestone.status === 'ongoing'
                  ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                  : '',
                getCardBgClasses(index),
              ]"
              :style="{
                borderColor: bulletData[index]?.fill || '#3b82f6',
              }"
            >
              <div class="flex items-center justify-center gap-2 mb-2">
                <span
                  class="text-xs text-blue-700 dark:text-blue-300 font-medium"
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
                class="text-slate-700 dark:text-slate-300 text-xs leading-relaxed"
              >
                {{ milestone.description }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile/Tablet Layout -->
    <div
      ref="mobileContainer"
      class="lg:hidden relative max-w-md mx-auto px-4 mt-10 min-h-[1200px]"
    >
      <!-- Vertical road SVG -->
      <svg
        viewBox="0 0 300 1300"
        class="absolute left-1/2 -translate-x-1/2 h-full w-[300px] top-0 z-0"
        preserveAspectRatio="xMidYMin slice"
      >
        <!-- Gray outline -->
        <path
          d="M150,0 C150,50 170,80 210,130 C250,180 250,220 210,270 C170,320 150,360 190,420 C230,480 250,520 210,580 C170,640 150,680 190,740 C230,800 250,840 210,900 C170,960 150,1000 150,1100 C150,1200 150,1250 150,1300"
          fill="none"
          stroke="#cbd5e1"
          class="dark:stroke-gray-600"
          stroke-width="45"
          stroke-linecap="round"
        />
        <!-- Dark road -->
        <path
          d="M150,0 C150,50 170,80 210,130 C250,180 250,220 210,270 C170,320 150,360 190,420 C230,480 250,520 210,580 C170,640 150,680 190,740 C230,800 250,840 210,900 C170,960 150,1000 150,1100 C150,1200 150,1250 150,1300"
          fill="none"
          stroke="#475569"
          class="dark:stroke-gray-700"
          stroke-width="35"
          stroke-linecap="round"
        />
        <!-- Yellow center line -->
        <path
          d="M150,0 C150,50 170,80 210,130 C250,180 250,220 210,270 C170,320 150,360 190,420 C230,480 250,520 210,580 C170,640 150,680 190,740 C230,800 250,840 210,900 C170,960 150,1000 150,1100 C150,1200 150,1250 150,1300"
          fill="none"
          stroke="#fbbf24"
          class="dark:stroke-yellow-500"
          stroke-width="2.5"
          stroke-dasharray="12,10"
          stroke-linecap="round"
        />
      </svg>

      <!-- Milestones -->
      <div class="relative z-20 space-y-6 py-8">
        <div
          v-for="(milestone, index) in props.milestones"
          :key="getMilestoneKey(milestone, index)"
          class="milestone-item flex items-center gap-3 opacity-0"
          :class="index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
        >
          <!-- Content Card -->
          <div
            class="flex-1 rounded-xl p-3 sm:p-4 border transition-all duration-300 cursor-pointer shadow-sm backdrop-blur-sm"
            :class="[
              milestoneShadowColors[index],
              index % 2 === 0 ? 'text-right' : 'text-left',
              milestone.status === 'pending' ? 'opacity-60' : '',
              getCardBgClasses(index),
            ]"
            :style="{
              borderColor: bulletData[index]?.fill || '#3b82f6',
            }"
          >
            <div
              class="flex items-center gap-2 mb-2"
              :class="index % 2 === 0 ? 'justify-end' : 'justify-start'"
            >
              <span
                class="text-[10px] sm:text-xs text-blue-700 dark:text-blue-300 font-medium"
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
              class="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed"
            >
              {{ milestone.description }}
            </p>
          </div>

          <!-- Icon with dotted border -->
          <div class="flex-shrink-0 relative z-30">
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

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  animation-fill-mode: both;
}

/* Scroll-triggered animation */
.milestone-item {
  transition: all 0.5s ease-in-out;
}

.milestone-item.is-visible {
  opacity: 1 !important;
  transform: translateY(0) scale(1) !important;
  animation: float 3s ease-in-out infinite;
}

/* Hover state for cards */
.milestone-item:hover {
  z-index: 50;
}

/* Dark mode transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
