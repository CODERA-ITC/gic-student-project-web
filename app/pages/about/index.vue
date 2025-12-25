<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <!-- Hero Section -->
    <div class="py-20 bg-white dark:bg-blue-900 border-b border-blue-700/30">
      <UContainer>
        <div class="text-center space-y-4 max-w-3xl mx-auto">
          <h1
            class="text-5xl lg:text-6xl font-black text-blue-900 dark:text-white leading-tight"
          >
            About GIC Student Portal
          </h1>
          <p class="text-xl text-blue-900/90 dark:text-blue-200">
            Celebrating innovation, creativity, and collaboration in the GIC
            program
          </p>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-16 space-y-16">
      <!-- Mission Section -->
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <div class="space-y-2">
            <UBadge color="primary" variant="soft">Our Mission</UBadge>
            <h2 class="text-4xl font-black text-gray-900 dark:text-white">
              Empowering Student Innovators
            </h2>
          </div>
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            The GIC Student Portal is designed to showcase the incredible work
            of students in the Global Innovation Challenge program. We believe
            in celebrating creativity, fostering collaboration, and connecting
            talented students with opportunities.
          </p>
          <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Our platform enables students to share their innovations, build
            professional portfolios, and get recognized by peers and industry
            professionals.
          </p>
          <div class="flex gap-4 pt-4">
            <UButton color="primary" size="lg" icon="i-heroicons-rocket-launch">
              Get Started
            </UButton>
            <UButton
              variant="outline"
              color="primary"
              size="lg"
              icon="i-heroicons-arrow-top-right-on-square"
              trailing
            >
              Learn More
            </UButton>
          </div>
        </div>

        <div
          class="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-10 dark:opacity-20"
          ></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <UIcon
              name="i-heroicons-light-bulb"
              class="w-32 h-32 text-blue-500 dark:text-blue-400 opacity-20 dark:opacity-30"
            />
          </div>
        </div>
      </div>

      <!-- Core Values -->
      <div class="space-y-8">
        <div class="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <UBadge color="primary" variant="soft">Core Values</UBadge>
          <h2 class="text-4xl font-black text-gray-900 dark:text-white">
            What We Believe In
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="value in coreValues"
            :key="value.title"
            class="bg-white dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 group shadow-sm dark:shadow-none"
          >
            <div
              class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
            >
              <UIcon :name="value.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {{ value.title }}
            </h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="space-y-8">
        <div class="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <UBadge color="primary" variant="soft">Features</UBadge>
          <h2 class="text-4xl font-black text-gray-900 dark:text-white">
            Built for Students
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="flex gap-4 p-6 bg-gray-50 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-blue-500/50 transition-all duration-300"
          >
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0"
            >
              <UIcon :name="feature.icon" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">
                {{ feature.title }}
              </h3>
              <p
                class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed"
              >
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="space-y-8">
        <div class="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <UBadge color="primary" variant="soft">Team</UBadge>
          <h2 class="text-4xl font-black text-gray-900 dark:text-white">
            Meet the People Behind It
          </h2>
        </div>

        <div class="grid md:grid-cols-4 gap-6">
          <div
            v-for="member in teamMembers"
            :key="member.name"
            class="text-center group"
          >
            <div
              class="w-32 h-32 rounded-full bg-gradient-to-br mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold group-hover:scale-110 transition-transform shadow-lg"
              :class="member.gradient"
            >
              {{ member.initials }}
            </div>
            <h3
              class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors"
            >
              {{ member.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ member.role }}
            </p>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div
        class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/50 dark:to-slate-800/30 border border-blue-200 dark:border-slate-700 rounded-2xl p-12"
      >
        <div class="grid md:grid-cols-4 gap-8">
          <div v-for="stat in statistics" :key="stat.label" class="text-center">
            <p
              class="text-4xl lg:text-5xl font-black text-blue-600 dark:text-blue-300 mb-2"
            >
              {{ stat.value }}
            </p>
            <p class="text-gray-700 dark:text-gray-200 font-semibold">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center space-y-6 py-12">
        <h2 class="text-4xl font-black text-gray-900 dark:text-white">
          Ready to Join?
        </h2>
        <p class="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Showcase your projects, connect with other students, and build your
          professional portfolio today.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <UButton color="primary" size="xl" icon="i-heroicons-rocket-launch">
            Get Started
          </UButton>
          <UButton
            variant="outline"
            color="primary"
            size="xl"
            icon="i-heroicons-envelope"
            trailing
          >
            Contact Us
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
const coreValues = [
  {
    title: "Innovation",
    description:
      "We celebrate and showcase cutting-edge projects and creative solutions.",
    icon: "i-heroicons-light-bulb",
  },
  {
    title: "Community",
    description:
      "We foster collaboration and connection among talented students.",
    icon: "i-heroicons-users",
  },
  {
    title: "Growth",
    description:
      "We help students build portfolios and gain recognition for their work.",
    icon: "i-heroicons-chart-bar",
  },
];

const features = [
  {
    title: "Project Showcase",
    description:
      "Display your projects with rich media, detailed descriptions, and metrics.",
    icon: "i-heroicons-presentation-chart-line",
  },
  {
    title: "Student Profiles",
    description:
      "Build a professional profile highlighting your skills and achievements.",
    icon: "i-heroicons-user-circle",
  },
  {
    title: "Discovery",
    description:
      "Find and explore amazing projects from other talented students.",
    icon: "i-heroicons-magnifying-glass",
  },
  {
    title: "Analytics",
    description: "Track views, engagement, and insights about your projects.",
    icon: "i-heroicons-chart-bar",
  },
  {
    title: "Community",
    description:
      "Connect with peers, exchange ideas, and collaborate on new projects.",
    icon: "i-heroicons-chat-bubble-left-right",
  },
  {
    title: "Recognition",
    description:
      "Get recognized by industry professionals and potential employers.",
    icon: "i-heroicons-star",
  },
];

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    initials: "SC",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    name: "Alex Rodriguez",
    role: "Product Lead",
    initials: "AR",
    gradient: "from-purple-500 to-purple-700",
  },
  {
    name: "Priya Patel",
    role: "Head of Design",
    initials: "PP",
    gradient: "from-pink-500 to-pink-700",
  },
  {
    name: "Jordan Kim",
    role: "Engineering Lead",
    initials: "JK",
    gradient: "from-green-500 to-green-700",
  },
];

const statistics = [
  { value: "500+", label: "Projects" },
  { value: "200+", label: "Students" },
  { value: "8", label: "Semesters" },
  { value: "4.8/5", label: "Rating" },
];

useHead({
  title: "About - GIC Student Portal",
  meta: [
    {
      name: "description",
      content:
        "Learn about GIC Student Portal and our mission to celebrate student innovation",
    },
  ],
});
</script>
