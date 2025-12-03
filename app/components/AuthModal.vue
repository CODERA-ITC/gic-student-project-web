<template>
  <!-- Simple Modal Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    @click="closeModal"
  >
    <!-- Dark Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50"></div>

    <!-- Modal Card -->
    <div
      class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10"
      @click.stop
    >
      <!-- Header with Close Button -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          Ready to Join with Us?
        </h3>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <!-- Content -->
      <div class="text-center space-y-4">
        <!-- Heart Icon -->
        <div class="flex justify-center">
          <div
            class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- Message -->
        <div>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">
            Join Our Community!
          </h4>
          <p class="text-sm text-gray-600">
            Create an account to like projects, connect with fellow students,
            and showcase your own amazing work!
          </p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex gap-3 mt-6">
        <button
          @click="goToSignup"
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign Up Now
        </button>
        <button
          @click="closeModal"
          class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const closeModal = () => {
  isOpen.value = false;
};

const goToSignup = () => {
  closeModal();
  navigateTo("/signup");
};
</script>
