<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <!-- Hero Section -->
    <div class="hero-nodes py-20 border-b border-blue-800/30 dark:border-slate-700">
      <UContainer>
        <div class="text-center space-y-4 max-w-3xl mx-auto">
          <h1 class="text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-blue-900 dark:text-white">
            About GIC Student Portal
          </h1>
          <p class="text-xl text-blue-900/80 dark:text-gray-300">
            Celebrating innovation, creativity, and collaboration in the GIC
            program
          </p>
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-16 space-y-20">
      <!-- Mission Section -->
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <div class="space-y-3">
            <h2 class="text-4xl font-bold text-gray-900 dark:text-white">
              Empowering Student Innovators
            </h2>
            <div class="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"></div>
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
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <ButtonsPresetButton preset="exploreProjects" to="/projects" size="md" />
            <ButtonsPresetButton preset="meetStudent" to="/students" size="md" />
          </div>
        </div>

        <div
          class="flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700">
          <img src="/images/gic-logo-small.png" alt="GIC Logo" class="w-full max-w-md object-contain" />
        </div>
      </div>

      <!-- Core Values -->
      <div class="space-y-12">
        <div class="text-center space-y-3">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white">
            What We Believe In
          </h2>
          <div class="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mx-auto"></div>
          <p class="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Our core values drive everything we do
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="value in coreValues" :key="value.title"
            class="bg-white dark:bg-slate-800/50 backdrop-blur border border-gray-200 dark:border-slate-700 rounded-xl p-8 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 group">
            <div
              class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
      <div class="space-y-12">
        <div class="text-center space-y-3">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white">
            Built for Students
          </h2>
          <div class="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mx-auto"></div>
          <p class="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to showcase your work and connect with others
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="feature in features" :key="feature.title"
            class="flex gap-4 p-6 bg-white dark:bg-slate-800/30 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-blue-500/50 hover:shadow-md transition-all duration-300">
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
              <UIcon :name="feature.icon" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white mb-1">
                {{ feature.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div
        class="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-12">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Our Impact
          </h2>
          <p class="text-gray-700 dark:text-gray-300">
            Growing together as a community
          </p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="stat in statistics" :key="stat.label" class="text-center">
            <p class="text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {{ stat.value }}
            </p>
            <p class="text-gray-700 dark:text-gray-300 font-medium">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="space-y-12">
        <div class="text-center space-y-3">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white">
            Meet Our Team
          </h2>
          <div class="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mx-auto"></div>
          <p class="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            The passionate people behind the platform
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="member in teamMembers" :key="member.name" class="text-center group">
            <div
              class="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br mx-auto mb-4 flex items-center justify-center text-white text-2xl md:text-3xl font-bold group-hover:scale-110 transition-transform shadow-lg"
              :class="member.gradient">
              {{ member.initials }}
            </div>
            <h3
              class="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
              {{ member.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ member.role }}
            </p>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- CTA Section -->
    <div
      class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
      <UContainer>
        <div class="text-center text-gray-900 dark:text-white space-y-8 max-w-2xl mx-auto">
          <h2 class="text-4xl lg:text-5xl font-bold">
            Ready to Showcase Your Innovation?
          </h2>
          <p class="text-xl text-gray-700 dark:text-white dark:opacity-90 leading-relaxed">
            Join our community of innovators and showcase your amazing projects.
            Get feedback, build your portfolio, and inspire others.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <ButtonsPresetButton preset="createProject" to="/projects/create" size="lg" />
            <ButtonsPresetButton preset="exploreProjects" to="/projects" size="lg" />
          </div>
        </div>
      </UContainer>
    </div>
  </div>
</template>

<script setup>
const coreValues = [
  {
    title: "Innovation",
    description:
      "We celebrate and showcase cutting-edge projects and creative solutions that push boundaries.",
    icon: "i-heroicons-light-bulb",
  },
  {
    title: "Community",
    description:
      "We foster collaboration and connection among talented students across semesters.",
    icon: "i-heroicons-users",
  },
  {
    title: "Growth",
    description:
      "We help students build portfolios and gain recognition for their exceptional work.",
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
