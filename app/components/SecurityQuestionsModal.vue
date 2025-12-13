<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="handleBackdropClick">
        <div
            class="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-lg shadow-xl p-6 md:p-8 m-4 max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <UIcon name="i-heroicons-shield-check" class="w-7 h-7 text-blue-900 dark:text-blue-400" />
                    Security Questions Setup
                </h2>
                <p class="text-sm text-slate-600 dark:text-neutral-400">
                    Please answer these security questions. They will help verify your
                    identity for password recovery.
                </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Question 1 -->
                <div>
                    <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        1. What is your mother's maiden name?
                        <span class="text-red-500">*</span>
                    </label>
                    <input v-model="answers.question1" type="text" required :disabled="isLoading"
                        placeholder="Enter your answer"
                        class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
                    <p class="text-xs text-slate-500 dark:text-neutral-500 mt-1">
                        This will be used for account recovery
                    </p>
                </div>

                <!-- Question 2 -->
                <div>
                    <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        2. What was the name of your first pet?
                        <span class="text-red-500">*</span>
                    </label>
                    <input v-model="answers.question2" type="text" required :disabled="isLoading"
                        placeholder="Enter your answer"
                        class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
                    <p class="text-xs text-slate-500 dark:text-neutral-500 mt-1">
                        This will be used for account recovery
                    </p>
                </div>

                <!-- Question 3 -->
                <div>
                    <label class="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        3. What city were you born in?
                        <span class="text-red-500">*</span>
                    </label>
                    <input v-model="answers.question3" type="text" required :disabled="isLoading"
                        placeholder="Enter your answer"
                        class="w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
                    <p class="text-xs text-slate-500 dark:text-neutral-500 mt-1">
                        This will be used for account recovery
                    </p>
                </div>

                <!-- Error Message -->
                <div v-if="error"
                    class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
                    {{ error }}
                </div>

                <!-- Info Message -->
                <div
                    class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-400">
                    <div class="flex gap-2">
                        <UIcon name="i-heroicons-information-circle" class="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <p class="font-medium">Important:</p>
                            <p class="mt-1">
                                Your answers will be encrypted and securely stored. Make sure to
                                remember them as they will be required for password recovery.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 pt-4">
                    <ButtonsPresetButton preset="primary" label="Save Security Questions" :loading="isLoading"
                        :disabled="isLoading || !isFormValid" size="lg" type="submit" />
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    allowClose: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["submit", "close"]);

const answers = ref({
    question1: "",
    question2: "",
    question3: "",
});

const isLoading = ref(false);
const error = ref("");

const isFormValid = computed(() => {
    return (
        answers.value.question1.trim().length > 0 &&
        answers.value.question2.trim().length > 0 &&
        answers.value.question3.trim().length > 0
    );
});

const handleSubmit = async () => {
    console.log('🟡 SecurityQuestionsModal - handleSubmit called');
    console.log('🟡 Answers:', answers.value);
    console.log('🟡 isFormValid:', isFormValid.value);

    error.value = "";

    if (!isFormValid.value) {
        error.value = "Please answer all security questions";
        return;
    }

    // Validate minimum length
    if (
        answers.value.question1.trim().length < 2 ||
        answers.value.question2.trim().length < 2 ||
        answers.value.question3.trim().length < 2
    ) {
        error.value = "Each answer must be at least 2 characters long";
        return;
    }

    isLoading.value = true;
    console.log('🟡 SecurityQuestionsModal - Emitting submit event');

    try {
        // Emit the answers to parent component (emits are not async in Vue 3)
        const payload = {
            question1: {
                question: "What is your mother's maiden name?",
                answer: answers.value.question1.trim(),
            },
            question2: {
                question: "What was the name of your first pet?",
                answer: answers.value.question2.trim(),
            },
            question3: {
                question: "What city were you born in?",
                answer: answers.value.question3.trim(),
            },
        };

        console.log('🟡 SecurityQuestionsModal - Payload:', payload);
        emit("submit", payload);
        console.log('✅ SecurityQuestionsModal - Submit event emitted');

        // Note: We don't reset loading here because the parent should close the modal
        // The loading state will reset when modal is closed (watch on isOpen)
    } catch (err) {
        console.error('❌ SecurityQuestionsModal - Error:', err);
        error.value = err.message || "Failed to save security questions";
        isLoading.value = false;
    }
};

const handleBackdropClick = () => {
    if (props.allowClose) {
        emit("close");
    }
};

// Reset form when modal closes
watch(
    () => props.isOpen,
    (newVal) => {
        console.log('SecurityQuestionsModal - isOpen changed to:', newVal);
        if (!newVal) {
            answers.value = {
                question1: "",
                question2: "",
                question3: "",
            };
            error.value = "";
        }
    }
);
</script>
