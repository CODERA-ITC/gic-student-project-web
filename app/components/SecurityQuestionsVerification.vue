<!-- 
  EXAMPLE: Security Questions Verification Component
  This is a reference implementation showing how to use security questions
  for password reset verification in the future.
  
  To integrate this into your forgot-password flow:
  1. After user enters email, show this component
  2. Verify answers with backend
  3. Allow password reset if answers match
-->

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Verify Your Identity
      </h2>
      <p class="text-sm text-slate-600 dark:text-neutral-400">
        Please answer your security questions to verify your identity.
      </p>
    </div>

    <form @submit.prevent="handleVerify" class="space-y-4">
      <!-- Security Questions (loaded from backend) -->
      <div v-for="(question, index) in securityQuestions" :key="index">
        <label
          class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
        >
          {{ index + 1 }}. {{ question.question }}
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="answers[index]"
          type="text"
          required
          :disabled="isLoading"
          placeholder="Enter your answer"
          class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400"
      >
        {{ error }}
      </div>

      <!-- Warning about attempts -->
      <div
        v-if="attemptsRemaining < 3"
        class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 text-sm text-yellow-700 dark:text-yellow-400"
      >
        {{ attemptsRemaining }} attempt(s) remaining. Account will be locked
        after 0 attempts.
      </div>

      <!-- Verify Button -->
      <ButtonsPresetButton
        preset="primary"
        label="VERIFY ANSWERS"
        :loading="isLoading"
        :disabled="isLoading || !allAnswersFilled"
        size="lg"
        class="w-full"
        type="submit"
      />
    </form>

    <!-- Back Link -->
    <div class="text-center">
      <button
        type="button"
        @click="$emit('back')"
        :disabled="isLoading"
        class="text-sm text-blue-900 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-2 disabled:opacity-50"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Try a different method
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["verified", "back", "locked"]);

const API_BASE_URL = "https://gic-project.darororo.dev";

const securityQuestions = ref([]);
const answers = ref([]);
const isLoading = ref(false);
const error = ref("");
const attemptsRemaining = ref(3);

const allAnswersFilled = computed(() => {
  return answers.value.every((answer) => answer && answer.trim().length > 0);
});

// Load user's security questions from backend
const loadSecurityQuestions = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const data = await $fetch(
      `${API_BASE_URL}/users/security-questions?email=${encodeURIComponent(
        props.email,
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (data.success && data.data.questions) {
      securityQuestions.value = data.data.questions;
      answers.value = new Array(data.data.questions.length).fill("");
    } else {
      throw new Error("No security questions found for this account");
    }
  } catch (err) {
    error.value =
      err.message || "Failed to load security questions. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

// Verify security question answers
const handleVerify = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    const data = await $fetch(
      `${API_BASE_URL}/users/verify-security-questions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: props.email,
          answers: securityQuestions.value.map((q, index) => ({
            question: q.question,
            answer: answers.value[index].trim(),
          })),
        }),
        onResponseError({ response }) {
          attemptsRemaining.value = response._data?.attemptsRemaining || 0;

          if (attemptsRemaining.value === 0) {
            emit("locked");
            throw new Error(
              "Account locked due to too many failed attempts. Please contact support.",
            );
          }

          throw new Error(
            response._data?.message ||
              `Incorrect answers. ${attemptsRemaining.value} attempt(s) remaining.`,
          );
        },
      },
    );

    // Verification successful - emit event with reset token
    if (data.success && data.data.resetToken) {
      emit("verified", data.data.resetToken);
    } else {
      throw new Error("Verification failed. Please try again.");
    }
  } catch (err) {
    error.value = err.message || "Verification failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadSecurityQuestions();
});
</script>

<!--
BACKEND API REQUIREMENTS:

1. GET /users/security-questions?email=user@example.com
   Response:
   {
     "success": true,
     "data": {
       "questions": [
         { "id": "1", "question": "What is your mother's maiden name?" },
         { "id": "2", "question": "What was the name of your first pet?" },
         { "id": "3", "question": "What city were you born in?" }
       ]
     }
   }

2. POST /users/verify-security-questions
   Request:
   {
     "email": "user@example.com",
     "answers": [
       { "question": "What is your mother's maiden name?", "answer": "Smith" },
       { "question": "What was the name of your first pet?", "answer": "Fluffy" },
       { "question": "What city were you born in?", "answer": "New York" }
     ]
   }
   
   Success Response:
   {
     "success": true,
     "data": {
       "resetToken": "temp-token-for-password-reset"
     }
   }
   
   Error Response:
   {
     "success": false,
     "message": "Incorrect answers",
     "attemptsRemaining": 2
   }

USAGE EXAMPLE:
See SECURITY_QUESTIONS_SETUP.md for complete integration examples with forgot-password flow.

Basic usage:
- Import component in forgot-password page
- Show after email verification
- Handle @verified event to get reset token
- Handle @back event to return to email input
- Handle @locked event for account lockout
-->
