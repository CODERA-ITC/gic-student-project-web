<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" />

        <div
          class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
        >
          <form class="p-6 space-y-5" @submit.prevent="submit" aria-label="User form">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-14 h-14 rounded-full overflow-hidden bg-blue-600 text-white font-semibold flex items-center justify-center ring-2 ring-blue-100 dark:ring-slate-700"
                >
                  <img
                    v-if="formState.avatar"
                    :src="formState.avatar"
                    alt="avatar"
                    class="w-full h-full object-cover"
                  />
                  <span v-else>{{ (formState.name || formState.email || "U").charAt(0).toUpperCase() }}</span>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    {{ title }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-slate-400">
                    {{ formState.email || "No email" }}
                  </p>
                </div>
              </div>
              <UButton
                icon="i-heroicons-x-mark"
                color="neutral"
                variant="ghost"
                type="button"
                @click="close"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormGroup label="Full Name" required>
                <UInput v-model="formState.name" placeholder="Full name" required />
              </UFormGroup>
              <UFormGroup label="Email" required>
                <UInput
                  v-model="formState.email"
                  type="email"
                  placeholder="user@example.com"
                  required
                />
              </UFormGroup>
              <div class="sm:col-span-2">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="role in effectiveRoleOptions"
                    :key="role"
                    type="button"
                    :class="[
                      'px-3 py-2 rounded-lg border text-sm font-semibold transition-colors',
                      formState.role === role
                        ? 'bg-blue-900 text-white border-blue-900'
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-300 dark:border-slate-600 hover:border-blue-500 hover:text-blue-700 dark:hover:text-blue-300',
                      props.fixedRole ? 'cursor-not-allowed opacity-80' : '',
                    ]"
                    :disabled="!!props.fixedRole"
                    @click="setRole(role)"
                  >
                    {{ role }}
                  </button>
                </div>
              </div>
              <UFormGroup label="Phone Number">
                <UInput v-model="formState.phone" placeholder="+855..." />
              </UFormGroup>
              <UFormGroup label="Department Code">
                <UInput v-model="formState.departmentCode" placeholder="e.g., GIC" />
                <p class="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Use the department short code (e.g., GIC).
                </p>
              </UFormGroup>
              <UFormGroup :label="passwordLabel">
                <UInput
                  v-model="formState.password"
                  type="password"
                  autocomplete="new-password"
                  :placeholder="passwordPlaceholder"
                />
              </UFormGroup>
              <UFormGroup
                v-if="formState.role === 'STUDENT'"
                label="Generation (Gen)"
              >
                <UInput v-model="formState.generation" placeholder="e.g., 19" />
              </UFormGroup>
              <UFormGroup v-if="formState.role === 'STUDENT'" label="Academic Year">
                <UInput v-model="formState.year" placeholder="e.g., 3" />
              </UFormGroup>
            </div>

            <UFormGroup label="Bio (optional)">
              <textarea
                v-model="formState.bio"
                rows="3"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description"
              />
            </UFormGroup>

            <div class="flex justify-end gap-3 pt-2">
              <UButton variant="ghost" color="neutral" type="button" @click="close">
                Cancel
              </UButton>
              <UButton
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="loading || isDisabled"
                class="!bg-blue-900 !text-white hover:!bg-blue-800"
              >
                {{ actionLabel }}
              </UButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  user: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: "create", // "create" | "edit"
  },
  loading: {
    type: Boolean,
    default: false,
  },
  fixedRole: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const roleOptions = ["STUDENT", "TEACHER", "ADMIN"];
const effectiveRoleOptions = computed(() =>
  props.fixedRole ? [props.fixedRole] : roleOptions,
);
const isFixedRole = computed(() => !!props.fixedRole);

const formState = reactive({
  name: "",
  email: "",
  role: "STUDENT",
  phone: "",
  departmentCode: "",
  password: "",
  generation: "",
  year: "",
  bio: "",
  avatar: "",
});

const syncFromProps = () => {
  const src: any = props.user || {};
  formState.name = src.name || "";
  formState.email = src.email || "";
  formState.role = (
    props.fixedRole || src.role || "STUDENT"
  )
    .toString()
    .toUpperCase();
  formState.phone = src.phone || "";
  formState.departmentCode =
    src.department?.code || src.departmentCode || src.departmentId || "";
  formState.password = "";
  formState.generation = src.gen || src.generation || "";
  formState.year = src.year || "";
  formState.bio = src.bio || "";
  formState.avatar = src.avatar || "";
};

watch(
  () => props.user,
  () => syncFromProps(),
  { immediate: true, deep: true },
);

const isDisabled = computed(
  () => !formState.name.trim() || !formState.email.trim(),
);

const title = computed(() =>
  props.mode === "edit" ? "Update User" : "Create Student",
);
const actionLabel = computed(() =>
  props.mode === "edit" ? "Update" : "Create Student",
);
const passwordLabel = computed(() =>
  props.mode === "edit" ? "Password (optional)" : "Password (optional)",
);
const passwordPlaceholder = computed(() =>
  props.mode === "edit"
    ? "Leave blank to keep current password"
    : "Leave blank to auto-generate",
);

const close = () => emit("update:modelValue", false);

const submit = () => {
  if (isDisabled.value) return;
  emit("submit", { ...formState });
};

const setRole = (role: string) => {
  if (isFixedRole.value) return;
  formState.role = role;
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
