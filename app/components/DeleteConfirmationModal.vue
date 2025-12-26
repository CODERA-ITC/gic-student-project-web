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
          class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl transform transition-all"
        >
          <div class="p-8">
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-exclamation-triangle"
                  class="w-6 h-6 text-red-600 dark:text-red-400"
                />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Project?
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete "<span class="font-semibold">{{
                projectTitle
              }}</span
              >"? This will permanently remove the project and all its data.
            </p>

            <!-- Verification Input -->
            <div
              class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
            >
              <p class="text-red-800 dark:text-red-300 font-medium mb-3">
                ⚠️ To confirm, type <span class="font-bold">DELETE</span> below:
              </p>
              <input
                v-model="deleteText"
                type="text"
                placeholder="Type DELETE to confirm"
                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-red-300 dark:border-red-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                @keyup.enter="deleteText === 'DELETE' && handleConfirm()"
              />
            </div>

            <div class="flex flex-col sm:flex-row gap-3 justify-end">
              <ButtonsPresetButton
                preset="cancel"
                size="lg"
                @click="closeModal"
              />
              <ButtonsPresetButton
                preset="delete"
                label="Delete Permanently"
                size="lg"
                :disabled="deleteText !== 'DELETE'"
                :loading="isDeleting"
                @click="handleConfirm"
              />
            </div>
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
  }
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
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>
