<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <!-- Hero -->
    <div class="py-14 relative overflow-hidden">
      <div class="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl" />
      <div class="absolute -bottom-32 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />

      <UContainer>
        <div
          class="relative overflow-hidden rounded-3xl border border-white/10 ring-1 ring-blue-500/15 bg-white/90 dark:bg-slate-900/90 shadow-2xl px-8 py-10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(79,70,229,0.08),transparent_30%)]"
          />

          <div class="relative space-y-3">
            <nav class="flex items-center flex-wrap gap-1 text-sm text-slate-600 dark:text-slate-300">
              <NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors">Home</NuxtLink>
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <NuxtLink
                to="/admin/dashboard"
                class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                Admin Dashboard
              </NuxtLink>
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <span class="text-slate-900 dark:text-white font-semibold">Profile Settings</span>
            </nav>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-shield-check" class="w-10 h-10 text-blue-500 dark:text-blue-300" />
              <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Profile Settings
              </h1>
            </div>
            <p class="text-slate-700 dark:text-slate-300">
              Update your admin profile, security questions, and preferences.
            </p>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Body -->
    <UContainer class="pb-14">
      <div class="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <p class="text-sm text-gray-600 dark:text-slate-300">
          Implementation placeholder — reuse existing profile form components for admin (avatar, bio, security
          questions). Tie into `/api/users/me` with admin token.
        </p>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth", "admin"],
});
</script>
