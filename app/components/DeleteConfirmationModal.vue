<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-gray-900/75 dark:bg-gray-900/90 backdrop-blur-sm"
          @click="closeModal"
        ></div>

        <!-- Modal Container -->
        <div
          class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-red-200/70 dark:border-red-800/60 p-7 space-y-6 text-center"
        >
          <div class="flex flex-col items-center gap-3">
            <div
              class="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shadow-inner"
            >
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="w-7 h-7 text-red-600 dark:text-red-300"
              />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Delete Project?
            </h3>
            <p class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              This will permanently remove
              <span class="font-semibold">"{{ projectTitle }}"</span>.
            </p>
          </div>

          <div class="space-y-3">
            <input
              v-model="deleteText"
              type="text"
              placeholder="Type DELETE to confirm"
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              @keyup.enter="deleteText === 'DELETE' && handleConfirm()"
            />
            <p class="text-xs text-red-600 dark:text-red-300 font-medium">
              Type DELETE to continue.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <UButton
              color="neutral"
              block
              variant="ghost"
              label="Cancel"
              @click="closeModal"
            />
            <UButton
              color="error"
              block
              variant="solid"
              label="Delete"
              :disabled="deleteText !== 'DELETE'"
              :loading="isDeleting"
              @click="handleConfirm"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  projectTitle: {
    type: String,
    default: "this project",
  },
  isDeleting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const deleteText = ref("");

// Reset deleteText when modal opens
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      deleteText.value = "";
    }
  },
);

const closeModal = () => {
  deleteText.value = "";
  emit("update:modelValue", false);
};

const handleConfirm = () => {
  if (deleteText.value === "DELETE") {
    emit("confirm");
  }
};
</script>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
