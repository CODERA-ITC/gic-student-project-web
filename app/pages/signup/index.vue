<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-neutral-900">
    <!-- Security Questions Modal -->
    <SecurityQuestionsModal
      :is-open="showSecurityQuestions"
      :allow-close="false"
      @submit="handleSecurityQuestionsSubmit"
    />

    <!-- Main Content - Centered Form -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {{ currentStep === 1 ? 'Your GIC Information' : 'Create your account' }}
          </h1>
          <p class="text-slate-600 dark:text-neutral-400 text-sm">
            Step {{ currentStep }} of {{ totalSteps }}
          </p>
        </div>

        <!-- Error Message (Global) -->
        <div
          v-if="error"
          class="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400"
        >
          {{ error }}
        </div>

        <!-- Step Container with Animation -->
        <div class="relative overflow-hidden">
          <Transition :name="transitionName" mode="out-in">
            <!-- Step 1: Verify Account -->
            <div v-if="currentStep === 1" key="step1" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label
                    class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                  >
                    ត្រកូល <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="familyNameKh"
                    type="text"
                    placeholder="គង់"
                    required
                    class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                  >
                    នាម <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="givenNameKh"
                    type="text"
                    placeholder="សុខា"
                    required
                    class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                >
                  Date of Birth <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="dob"
                  type="date"
                  required
                  class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                >
                  Phone Number <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="phone"
                  type="tel"
                  placeholder="012 345 678"
                  required
                  class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                >
                  Student ID <span class="text-red-500">*</span>
                </label>
                <input v-model="studentId" type="text" placeholder="e2021xxx" required
                  class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all" />
              </div>

              <div class="pt-4">
                <ButtonsPresetButton
                  preset="primary"
                  label="NEXT"
                  @click="nextStep"
                  size="lg"
                  class="w-full"
                />
              </div>
            </div>

            <!-- Step 2: Create Your Account -->
            <div v-else-if="currentStep === 2" key="step2" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label
                    class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                  >
                    Family Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="familyName"
                    type="text"
                    placeholder="Kong"
                    required
                    class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                  >
                    Given Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="givenName"
                    type="text"
                    placeholder="Sokha"
                    required
                    class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                >
                  Email Address <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                  class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                />
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                >
                  Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    class="w-full px-4 py-3 pr-12 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                  >
                    <UIcon
                      :name="
                        showPassword
                          ? 'i-heroicons-eye-slash'
                          : 'i-heroicons-eye'
                      "
                      class="w-5 h-5"
                    />
                  </button>
                </div>
                <p class="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                  Must be at least 8 characters long
                </p>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                >
                  Verify Password <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    class="w-full px-4 py-3 pr-12 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors"
                  >
                    <UIcon
                      :name="
                        showConfirmPassword
                          ? 'i-heroicons-eye-slash'
                          : 'i-heroicons-eye'
                      "
                      class="w-5 h-5"
                    />
                  </button>
                </div>
              </div>

              <div
                class="flex items-start gap-2 p-4 bg-slate-50 dark:bg-neutral-800 rounded-lg"
              >
                <input
                  v-model="agreeToTerms"
                  type="checkbox"
                  required
                  class="w-4 h-4 mt-1 rounded border-slate-300 dark:border-neutral-600 text-blue-900 focus:ring-blue-900 focus:ring-offset-0 cursor-pointer"
                />
                <label
                  class="text-sm text-slate-700 dark:text-neutral-300 cursor-pointer"
                >
                  I agree to the
                  <NuxtLink
                    to="/terms"
                    class="text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Terms & Conditions
                  </NuxtLink>
                  and
                  <NuxtLink
                    to="/privacy"
                    class="text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                  >
                    Privacy Policy
                  </NuxtLink>
                </label>
              </div>

              <div class="flex gap-3 pt-4">
                <ButtonsPresetButton
                  preset="secondary"
                  label="BACK"
                  @click="previousStep"
                  size="lg"
                  class="w-1/3"
                />
                <ButtonsPresetButton
                  preset="primary"
                  label="CREATE ACCOUNT"
                  :loading="isLoading"
                  :disabled="isLoading || !agreeToTerms"
                  @click="handleSignup"
                  size="lg"
                  class="w-2/3"
                />
              </div>
            </div>
          </Transition>
        </div>

        <!-- Sign In Link -->
        <div class="text-center mt-6">
          <p class="text-sm text-slate-600 dark:text-neutral-400">
            Already have an account?
            <NuxtLink
              to="/login"
              class="text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors"
            >
              Sign in here
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Progress Bar - Fixed at Bottom -->
    <div
      class="fixed bottom-0 left-0 w-full bg-slate-200 dark:bg-neutral-700 h-2"
    >
      <div
        class="h-full bg-blue-900 dark:bg-blue-600 transition-all duration-500 ease-out"
        :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
  middleware: ["guest"],
});

import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

// Form fields
const familyNameKh = ref(""); // ត្រកូល
const givenNameKh = ref(""); // នាម
const dob = ref("");
const phone = ref("");
const studentId = ref("");
const familyName = ref(""); // Family name in English
const givenName = ref(""); // Given name in English
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const agreeToTerms = ref(false);
const isLoading = ref(false);
const error = ref("");
const showSecurityQuestions = ref(false);

// Step management
const currentStep = ref(1);
const totalSteps = 2;
const transitionName = ref("slide-left");

// Password visibility toggles
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Step labels
const getStepLabel = (step) => {
  const labels = {
    1: "Verify",
    2: "Create",
  };
  return labels[step] || "";
};

// Step navigation
const nextStep = () => {
  error.value = "";

  // Validate current step before proceeding
  if (currentStep.value === 1) {
    if (!familyNameKh.value.trim()) {
      error.value = "Please enter your family name in Khmer (ត្រកូល)";
      return;
    }
    if (!givenNameKh.value.trim()) {
      error.value = "Please enter your given name in Khmer (នាម)";
      return;
    }
    if (!dob.value) {
      error.value = "Please enter your date of birth";
      return;
    }
    if (!phone.value.trim()) {
      error.value = "Please enter your phone number";
      return;
    }
    // Basic phone validation (Cambodia format)
    const phoneRegex = /^\d{8,9}$/;
    if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
      error.value = "Please enter a valid phone number (e.g., 12345678)";
      return;
    }
    if (!studentId.value.trim()) {
      error.value = "Please enter your student ID";
      return;
    }
  }

  if (currentStep.value === 2) {
    if (!familyName.value.trim()) {
      error.value = "Please enter your family name";
      return;
    }
    if (!givenName.value.trim()) {
      error.value = "Please enter your given name";
      return;
    }
    if (!email.value.trim()) {
      error.value = "Please enter your email address";
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      error.value = "Please enter a valid email address";
      return;
    }
    if (!password.value) {
      error.value = "Please enter a password";
      return;
    }
    if (password.value.length < 8) {
      error.value = "Password must be at least 8 characters long";
      return;
    }
    if (password.value !== confirmPassword.value) {
      error.value = "Passwords do not match";
      return;
    }
    if (!agreeToTerms.value) {
      error.value = "You must agree to the Terms & Conditions";
      return;
    }
  }

  if (currentStep.value < totalSteps) {
    transitionName.value = "slide-left";
    currentStep.value++;
  }
};

const previousStep = () => {
  error.value = "";
  if (currentStep.value > 1) {
    transitionName.value = "slide-right";
    currentStep.value--;
  }
};

const handleSecurityQuestionsSubmit = async (answers) => {
  try {
    isLoading.value = true;
    await authStore.submitSecurityQuestions(answers);

    // Redirect to dashboard after successfully saving security questions
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (authStore.isTeacher) {
      await router.push("/teacher/dashboard");
    } else {
      await router.push("/student/dashboard");
    }
  } catch (err) {
    error.value = err.message || "Failed to save security questions";
    showSecurityQuestions.value = false;
    isLoading.value = false;
  }
};

const handleSignup = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    const config = useRuntimeConfig();
    const apiBase = config.public.apiBase || 'https://gic-project.darororo.dev';

    const response = await $fetch(`${apiBase}/users/signup`, {
      method: 'POST',
      body: {
        firstName: familyName.value,
        lastName: givenName.value,
        email: email.value,
        password: password.value,
        departmentCode: "GIC",
        bio: "Student at GIC",
        studentId: studentId.value,
        nameKh: `${familyNameKh.value} ${givenNameKh.value}`,
        dob: dob.value,
        phoneNumber: phone.value
      }
    });

    // Success - redirect to login or dashboard
    await router.push('/login');
  } catch (err) {
    error.value = err?.data?.message || err?.message || "Sign up failed. Please try again.";
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Slide animations */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
