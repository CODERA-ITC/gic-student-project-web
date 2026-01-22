<template>
  <div class="flex flex-col gap-4 relative">
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Project Header - Image Carousel -->
        <div
          class="rounded-2xl h-120 relative overflow-hidden bg-gray-200 dark:bg-slate-800 carousel"
        >
          <div class="relative w-full h-full">
            <!-- Image Transition -->
            <TransitionGroup name="carousel-fade" mode="out-in">
              <!-- Current Image -->
              <img
                v-if="project.images && project.images[currentImageIndex]"
                :key="currentImageIndex"
                :src="project.images[currentImageIndex].originalUrl.toString()"
                :alt="`${project.name} - Image ${currentImageIndex + 1}`"
                class="absolute inset-0 w-full h-full object-cover"
              />

              <!-- Fallback if no images -->
              <div
                v-else
                key="fallback"
                class="absolute inset-0 w-full h-full flex items-center justify-center text-8xl bg-gray-100 dark:bg-slate-700"
              >
                {{ project.name || "📁" }}
              </div>
            </TransitionGroup>

            <p>
              <!-- Navigation Buttons -->
              <button
                v-if="project.images && project.images.length > 1"
                @click="previousImage"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all backdrop-blur-sm z-10"
              >
                <UIcon
                  name="i-heroicons-chevron-left"
                  class="w-6 h-6 text-white"
                />
              </button>

              <button
                v-if="project.images && project.images.length > 1"
                @click="nextImage"
                class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-all backdrop-blur-sm z-10"
              >
                <UIcon
                  name="i-heroicons-chevron-right"
                  class="w-6 h-6 text-white"
                />
              </button>

              <!-- Image Indicators -->
            </p>

            <div
              v-if="project.images && project.images.length > 1"
              class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"
            >
              <button
                v-for="(img, idx) in project.images || []"
                :key="idx"
                @click="currentImageIndex = Number(idx)"
                :class="[
                  'w-2 h-2 rounded-full transition-all',
                  currentImageIndex === idx
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/75',
                ]"
              ></button>
            </div>
          </div>

          <div
            class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
          ></div>
        </div>

        <!-- Project Title and Badges -->
        <div class="space-y-4">
          <div class="flex gap-3 flex-wrap">
            <UBadge
              class="bg-blue-900 hover:bg-blue-800 text-white"
              variant="solid"
              size="md"
            >
              {{ project.category }}
            </UBadge>
            <UBadge color="info" variant="solid" size="md">
              {{ project.academicYear }}
            </UBadge>
            <UBadge
              :color="currentStatus === 'Completed' ? 'success' : 'warning'"
              variant="solid"
              size="md"
            >
              {{ currentStatus }}
            </UBadge>
          </div>
          <h1
            class="text-4xl lg:text-5x l font-black text-gray-900 dark:text-white"
          >
            {{ project.name }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ project.description }}
          </p>
        </div>

        <!-- Course / Subject -->
        <div
          ref="courseRef"
          class="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl p-6 transform transition-all duration-700 opacity-0 translate-y-8"
        >
          <div class="flex items-start gap-4">
            <UIcon
              name="i-heroicons-academic-cap"
              class="w-6 h-6 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0"
            />
            <div>
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                Course / Subject
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ project.course }}
              </p>
            </div>
          </div>
        </div>

        <!-- Duration -->
        <div
          ref="durationRef"
          class="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl p-6 transform transition-all duration-700 opacity-0 translate-y-8"
        >
          <div class="flex items-start gap-4">
            <UIcon
              name="i-heroicons-clock"
              class="w-6 h-6 text-green-500 dark:text-green-400 mt-1 flex-shrink-0"
            />
            <div>
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                Project Duration
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ project.duration }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Sticky Container for Statistics and Actions -->
        <div class="sticky top-28 space-y-6">
          <!-- Statistics Card -->
          <div
            class="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-4"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Statistics
            </h3>

            <!-- Views -->
            <div
              class="flex items-center justify-between p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-eye"
                  class="w-5 h-5 text-blue-500 dark:text-blue-400"
                />
                <span class="text-gray-600 dark:text-gray-300">Views</span>
              </div>
              <span class="text-gray-900 dark:text-white font-semibold">{{
                project.views
              }}</span>
            </div>

            <!-- Likes -->
            <div
              class="flex items-center justify-between p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg"
            >
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-heart"
                  class="w-5 h-5 text-red-500 dark:text-red-400"
                />
                <span class="text-gray-600 dark:text-gray-300">Likes</span>
              </div>
              <span class="text-gray-900 dark:text-white font-semibold">{{
                project.likes
              }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <!-- Submit for Review Button (Student Owner only) - via slot -->
            <slot name="submit-button"></slot>

            <!-- Edit and Delete Buttons (Owner only) - via slot -->
            <slot name="action-buttons"></slot>

            <!-- Hide/Show Project Button (Teacher only) -->
            <UButton
              v-if="userRole === Role.teacher"
              @click="$emit('hide')"
              :color="project.visibility === 'private' ? 'success' : 'warning'"
              variant="solid"
              class="w-full justify-center"
              size="lg"
            >
              <template #leading>
                <UIcon
                  :name="
                    project.visibility === 'private'
                      ? 'i-heroicons-eye'
                      : 'i-heroicons-eye-slash'
                  "
                  class="w-5 h-5"
                />
              </template>
              {{
                project.visibility === "private"
                  ? "Show Project"
                  : "Hide Project"
              }}
            </UButton>

            <!-- Like Button (All users) -->
            <UButton
              @click="$emit('like')"
              :class="[
                'w-full justify-center transition-all duration-300',
                isLiked
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg shadow-pink-500/20'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600',
              ]"
              size="lg"
            >
              <template #leading>
                <UIcon
                  :name="
                    isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'
                  "
                  class="w-5 h-5"
                />
              </template>
              {{ isLiked ? "Liked" : "Like Project" }}
            </UButton>

            <!-- Share Button (All users) -->
            <UButton
              @click="$emit('share')"
              class="w-full justify-center bg-blue-900 hover:bg-blue-800 text-white"
              size="lg"
            >
              <template #leading>
                <UIcon name="i-heroicons-share" class="w-5 h-5" />
              </template>
              <span class="text-white dark:text-white">Share Project</span>
            </UButton>
          </div>

          <!-- Lead Developer -->
          <div
            v-if="project.author"
            class="bg-white/80 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-4"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Lead Developer
            </h3>
            <div class="flex items-center gap-4">
              <img
                :src="
                  project.author?.avatar ||
                  'https://img.icons8.com/nolan/1200/user-default.jpg'
                "
                :alt="project.author.name"
                class="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p class="text-gray-900 dark:text-white font-semibold">
                  {{ project.author.name }}
                </p>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ project.author.program }} - {{ project.author.year }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div>Section test</div> -->
    </div>

    <!-- Project Timeline - Animated inline -->
    <section
      ref="sectionRef"
      :class="[
        'transition-all duration-700 ease-out',
        isTimelineInView ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
      ]"
    >
      <div
        :class="[
          'bg-white/80 dark:bg-slate-800/80',
          'backdrop-blur-lg border-2 border-gray-200 dark:border-slate-700 rounded-2xl',
          'hover:shadow-3xl transition-all duration-500',
          'p-6 md:p-8 lg:p-10 space-y-6',
        ]"
      >
        <div class="flex items-start gap-4 md:gap-6">
          <div>
            <UIcon
              name="i-heroicons-clock"
              class="w-6 h-6 text-blue-500 dark:text-blue-400 mt-1"
            />
          </div>
          <div class="flex-1">
            <h3
              ref="titleRef"
              class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
            >
              Project Timeline
            </h3>
            <div
              :class="[
                'w-full relative space-y-8 p-4 md:p-6 lg:p-8',
                'rounded-xl',
              ]"
            >
              <!-- Vertical line with animation -->
              <div
                :class="[
                  'absolute left-6 md:left-1/2 top-0 bottom-0 w-1 rounded-full',
                  'bg-purple-500 dark:bg-purple-400',
                  'transform md:-translate-x-1/2 transition-all duration-1000',
                  'opacity-100 scale-y-100',
                ]"
                :style="{ transformOrigin: 'top' }"
              />

              <!-- Timeline items -->
              <TimelineItem
                v-for="(item, index) in timelineItems"
                :key="index"
                :name="item.name"
                :description="item.description"
                :date="item.date"
                :status="item.status"
                :icon="item.icon"
                :index="Number(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Members -->

    <div
      ref="teamRef"
      class="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl p-6 space-y-6 transform transition-all duration-700 opacity-0 translate-y-8"
    >
      <div class="flex items-start gap-4">
        <UIcon
          name="i-heroicons-users"
          class="w-6 h-6 text-cyan-500 dark:text-cyan-400 mt-1 flex-shrink-0"
        />
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Project Team
          </h3>
          <div
            v-if="filteredMembers.length > 0"
            class="grid sm:grid-cols-2 gap-4"
          >
            <div
              v-for="(member, idx) in filteredMembers"
              :key="idx"
              class="flex items-center gap-3 p-3 rounded-lg bg-gray-100 dark:bg-slate-700/50 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <img
                v-if="member.image"
                :src="member.image"
                :alt="member.name"
                class="w-10 h-10 rounded-full object-cover flex-shrink-0"
                @error="
                  (e) => ((e.target as HTMLElement).style.display = 'none')
                "
              />
              <div
                v-if="!member.image"
                class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0"
              >
                <span class="text-white text-sm font-bold">
                  {{ getInitials(member.name) }}
                </span>
              </div>
              <p class="text-gray-800 dark:text-gray-200 font-medium truncate">
                {{ member.name }}
              </p>
            </div>
          </div>
          <p v-else class="text-gray-500 dark:text-gray-400 text-sm">
            No other team members
          </p>
        </div>
      </div>
    </div>

    <!-- Skills Used -->
    <div
      ref="skillsRef"
      class="bg-white/50 dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl p-6 transform transition-all duration-700 opacity-0 translate-y-8"
    >
      <div class="flex items-start gap-4">
        <UIcon
          name="i-heroicons-wrench-screwdriver"
          class="w-6 h-6 text-yellow-500 dark:text-yellow-400 mt-1 flex-shrink-0"
        />
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Skills & Technologies
          </h3>
          <div class="flex gap-2 flex-wrap">
            <span
              v-for="skill in project.technologies || []"
              :key="skill"
              class="px-3 py-2 rounded-full bg-blue-100 dark:bg-blue-600/30 text-blue-700 dark:text-blue-200 text-sm font-medium border border-blue-200 dark:border-blue-500/50 hover:bg-blue-200 dark:hover:bg-blue-600/40 transition-colors"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Role } from "~/types/roles";
import { useProjectStore, type Project } from "~/stores/projects";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const projectStore = useProjectStore();

// Template refs for animations
const sectionRef = ref<HTMLElement | null>(null);
const iconRef = ref<any>(null);
const titleRef = ref<HTMLElement | null>(null);
const headerRef = ref<HTMLElement | null>(null);
const courseRef = ref<HTMLElement | null>(null);
const durationRef = ref<HTMLElement | null>(null);
const teamRef = ref<HTMLElement | null>(null);
const skillsRef = ref<HTMLElement | null>(null);

// Scroll parallax state
const scrollY = ref(0);

interface Props {
  project: Project;
  isLiked?: boolean;
  userRole?: Role | null;
  isOwner?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLiked: false,
  userRole: null,
  isOwner: false,
});

defineEmits<{
  like: [];
  share: [];
  hide: [];
}>();

// Image carousel
const currentImageIndex = ref(0);
const autoPlayInterval = ref<NodeJS.Timeout | null>(null);

// Timeline scroll detection
const isTimelineInView = ref(false);
const isScrollLocked = ref(false);
const scrollPosition = ref(0);

const nextImage = () => {
  if (props.project?.images) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % props.project.images.length;
  }
};

const previousImage = () => {
  if (props.project?.images) {
    currentImageIndex.value =
      currentImageIndex.value === 0
        ? props.project.images.length - 1
        : currentImageIndex.value - 1;
  }
};

// Timeline items computed propertys
const timelineItems = computed(() => {
  if (!props.project?.features && !props.project?.features) return [];

  const features = props.project.features || props.project.features || [];

  return features.map((feature: any) => ({
    date: feature.date || "No date",
    name: feature.name,
    description: feature.description,
    icon: feature.icon || "i-lucide-star",
    status: feature.status || "completed",
  }));
});

// Filter team members to exclude the owner/author
const filteredMembers = computed(() => {
  if (!props.project?.members) return [];
  if (!props.project?.author?.name) return props.project.members;

  // Filter out the owner from the members list
  return props.project.members.filter(
    (member: any) => member.name !== props.project.author.name,
  );
});

// Get two-letter initials from member name
const getInitials = (name: string): string => {
  if (!name) return "NA";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Real-time status calculation - updates automatically when features change
const currentStatus = computed(() => {
  return props.project
    ? projectStore.getProjectStatus(props.project.id)
    : "In Progress";
});

// Scroll lock functions
const lockScroll = () => {
  if (typeof window !== "undefined") {
    scrollPosition.value = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition.value}px`;
    document.body.style.width = "100%";
    isScrollLocked.value = true;
  }
};

const unlockScroll = () => {
  if (typeof window !== "undefined") {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollPosition.value);
    isScrollLocked.value = false;
  }
};

// GSAP Animations
onMounted(() => {
  // Smooth scroll setup
  const handleScroll = () => {
    scrollY.value = window.scrollY;
  };
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Intersection Observer for reveal animations on scroll
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          });
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -100px 0px",
    },
  );

  // Observe all sections for reveal animations
  const sectionsToReveal = [
    courseRef.value,
    durationRef.value,
    teamRef.value,
    skillsRef.value,
  ];

  sectionsToReveal.forEach((section) => {
    if (section) {
      revealObserver.observe(section);
    }
  });

  // Intersection Observer for timeline section with enhanced GSAP animations
  const observerOptions = {
    threshold: 0.2, // Trigger when 20% of section is visible
    rootMargin: "-80px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isTimelineInView.value) {
        isTimelineInView.value = true;

        // Lock scroll when timeline enters view
        lockScroll();

        // Create a master timeline for timeline section entrance
        const timelineTl = gsap.timeline({
          delay: 0.2,
          onComplete: () => {
            // Unlock scroll after all animations complete (after 4 seconds)
            setTimeout(() => {
              unlockScroll();
            }, 2000);
          },
        });

        // 1. Animate the container with scale and fade
        timelineTl.fromTo(
          sectionRef.value,
          {
            scale: 0.9,
            opacity: 0,
            y: 50,
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
        );

        // 2. Animate icon with 3D rotation and bounce
        timelineTl.fromTo(
          iconRef.value?.$el,
          {
            scale: 0,
            rotationY: 180,
            rotationZ: -180,
            opacity: 0,
          },
          {
            scale: 1,
            rotationY: 0,
            rotationZ: 0,
            opacity: 1,
            duration: 1,
            ease: "back.out(2)",
          },
          "-=0.5",
        );

        // 3. Animate title with split text effect
        timelineTl.fromTo(
          titleRef.value,
          {
            opacity: 0,
            x: -100,
            rotationX: 90,
          },
          {
            opacity: 1,
            x: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "power4.out",
          },
          "-=0.6",
        );

        // 4. Animate timeline items with advanced stagger
        timelineTl.from(
          ".timeline-item",
          {
            x: -80,
            opacity: 0,
            scale: 0.8,
            rotationY: -30,
            duration: 0.8,
            stagger: {
              amount: 0.8,
              from: "start",
              ease: "power2.out",
            },
            ease: "back.out(1.5)",
          },
          "-=0.4",
        );

        // 5. Add floating animation to icon (continuous)
        gsap.to(iconRef.value?.$el, {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // 6. Add subtle rotation animation to icon (continuous)
        gsap.to(iconRef.value?.$el, {
          rotation: 12,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // 7. Animate timeline items on hover
        const timelineItems = document.querySelectorAll(".timeline-item");
        timelineItems.forEach((item) => {
          item.addEventListener("mouseenter", () => {
            gsap.to(item, {
              x: 10,
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          item.addEventListener("mouseleave", () => {
            gsap.to(item, {
              x: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        });

        // 8. Add manual unlock with keyboard (ESC or any scroll attempt)
        const handleKeyPress = (e: KeyboardEvent) => {
          if (e.key === "Escape" || e.key === "Space") {
            unlockScroll();
            document.removeEventListener("keydown", handleKeyPress);
          }
        };

        const handleWheel = () => {
          if (isScrollLocked.value) {
            unlockScroll();
            document.removeEventListener("wheel", handleWheel);
          }
        };

        document.addEventListener("keydown", handleKeyPress);
        document.addEventListener("wheel", handleWheel);
      }
    });
  }, observerOptions);

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }

  // Start carousel autoplay
  if (props.project?.images && props.project.images.length > 1) {
    autoPlayInterval.value = setInterval(() => {
      nextImage();
    }, 4000); // Change image every 4 seconds
  }

  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = "smooth";
});

// Cleanup autoplay on unmount
onUnmounted(() => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value);
  }
  // Ensure scroll is unlocked when component unmounts
  if (isScrollLocked.value) {
    unlockScroll();
  }
  // Cleanup scroll listener
  window.removeEventListener("scroll", () => {});
  // Kill all ScrollTrigger instances
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  // Reset scroll behavior
  document.documentElement.style.scrollBehavior = "";
});
</script>

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

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUpDelayed {
  0%,
  20% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-slide-in-right {
  animation: slideInRight 0.6s ease-out forwards;
}

.animate-fade-in-up-delayed {
  animation: fadeInUpDelayed 1.2s ease-out forwards;
}

/* Timeline specific animations */
:deep(.timeline-item) {
  transition: all 0.3s ease-in-out;
}

:deep(.timeline-item:hover) {
  transform: translateX(5px);
}

/* Custom timeline styling with better animations */
:deep(.timeline) {
  position: relative;
}

:deep(.timeline::before) {
  content: "";
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    rgb(147, 51, 234),
    rgb(59, 130, 246),
    rgb(34, 197, 94)
  );
  border-radius: 2px;
  animation: lineGrow 2s ease-in-out;
}

@keyframes lineGrow {
  from {
    height: 0;
  }
  to {
    height: 100%;
  }
}

/* Staggered animation for timeline items */
:deep(.timeline-item:nth-child(1)) {
  animation-delay: 0.2s;
}

:deep(.timeline-item:nth-child(2)) {
  animation-delay: 0.4s;
}

:deep(.timeline-item:nth-child(3)) {
  animation-delay: 0.6s;
}

:deep(.timeline-item:nth-child(4)) {
  animation-delay: 0.8s;
}

.carousel {
  overflow: hidden;
  width: 100%;
}

/* Smooth carousel transitions */
.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.carousel-fade-enter-from {
  opacity: 0;
  transform: scale(1.05);
}

.carousel-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.carousel-fade-enter-to,
.carousel-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
