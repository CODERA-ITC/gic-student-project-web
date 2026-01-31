<template>
  <section
    class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700"
  >
    <UContainer>
      <div
        class="text-center text-gray-900 dark:text-white space-y-8 max-w-2xl mx-auto"
      >
        <h2 class="text-4xl lg:text-5xl font-semibold">
          Ready to Showcase Your Innovation?
        </h2>
        <p
          class="text-xl text-gray-700 dark:text-white dark:opacity-90 leading-relaxed"
        >
          Join our community of innovators and showcase your amazing projects.
          Get feedback, build your portfolio, and inspire others.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <ButtonsPresetButton
            preset="exploreProjects"
            size="lg"
            to="/projects"
          />

          <ButtonsPresetButton
            preset="submitProject"
            size="lg"
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
