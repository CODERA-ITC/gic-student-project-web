<template>
  <Teleport to="body">
    <Transition enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4">
      <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="closeModal">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

        <!-- Modal Content -->
        <div class="relative w-full max-w-md transform">
          <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-800 to-blue-900 px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 text-white" />
                </div>
                <h3 class="text-xl font-semibold text-white">
                  {{
                    context === "create"
                      ? "Ready to Create?"
                      : "Login Required"
                  }}
                </h3>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-4">
              <div v-if="context === 'create'">
                <p class="text-gray-700 text-lg leading-relaxed">
                  Ready to share your amazing project with GIC Showcase? Let's get
                  you logged in first!
                </p>
              </div>

              <div v-else>
                <p class="text-gray-700 text-lg leading-relaxed">
                  You need to be logged in to like projects and interact with
                  the community. ❤️
                </p>

              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button @click="closeModal"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors">
                Maybe Later
              </button>
              <ButtonsPresetButton preset="signin" size="md" @click="
                () => {
                  closeModal();
                  navigateTo('/login');
                }
              ">
                <span>{{
                  context === "create" ? "Login to Create" : "Login Now"
                }}</span>
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
              </ButtonsPresetButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  context: {
    type: String,
    default: "like", // 'like' or 'create'
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
</script>
