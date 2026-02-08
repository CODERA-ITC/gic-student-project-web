<template>
  <section
    class="py-20 px-4 sm:px-6 lg:px-8 rounded-t-4xl overflow-hidden border border-blue-200/30 dark:border-blue-700/50 bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 shadow-2xl">
    <UContainer>
      <div class="text-center space-y-8 max-w-2xl mx-auto">
        <h2 class="text-4xl lg:text-5xl font-semibold text-white">
          {{ t("homePage.ctaTitle") }}
        </h2>
        <p class="text-xl leading-relaxed text-blue-100 dark:text-slate-300">
          {{ t("homePage.ctaSubtitle") }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <ButtonsPresetButton
            preset="exploreProjects"
            size="lg"
            to="/projects"
            class="!bg-white !text-blue-900 !border-white hover:!bg-blue-50 !shadow-xl"
          />

          <ButtonsPresetButton
            preset="submitProject"
            size="lg"
            class="!border-white !text-white hover:!bg-white/10 dark:!border-slate-300 dark:!text-slate-100"
            @click="handleSubmitProject"
          />
        </div>
      </div>
    </UContainer>

    <AuthModal v-model="showAuthModal" context="create" />
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

const { t } = useI18n();

const authStore = useAuthStore();
const router = useRouter();
const showAuthModal = ref(false);

const handleSubmitProject = () => {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true;
  } else {
    // Redirect to create project page if authenticated
    router.push("/projects/create");
  }
};
</script>
