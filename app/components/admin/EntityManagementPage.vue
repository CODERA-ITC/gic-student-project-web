<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900">
    <div class="py-14 relative overflow-hidden">
      <div
        class="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      <div
        class="absolute -bottom-32 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>

      <UContainer>
        <div
          class="relative overflow-hidden rounded-3xl border border-white/10 ring-1 ring-blue-500/15 bg-white/90 dark:bg-slate-900/90 shadow-2xl px-8 py-10"
        >
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(79,70,229,0.08),transparent_30%)] pointer-events-none"
            aria-hidden="true"
          ></div>

          <div class="relative space-y-3">
            <nav
              class="flex items-center flex-wrap gap-1 text-sm text-slate-600 dark:text-slate-300"
            >
              <NuxtLink
                to="/"
                class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                >Home</NuxtLink
              >
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <NuxtLink
                to="/admin/dashboard"
                class="hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                Admin Dashboard
              </NuxtLink>
              <span class="text-slate-400 dark:text-slate-500">/</span>
              <span class="text-slate-900 dark:text-white font-semibold">
                {{ title }}
              </span>
            </nav>
            <div class="flex items-center gap-3">
              <UIcon :name="icon" class="w-10 h-10 text-blue-500 dark:text-blue-300" />
              <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {{ title }}
              </h1>
            </div>
            <p class="text-slate-700 dark:text-slate-300">
              {{ subtitle }}
            </p>
          </div>
        </div>
      </UContainer>
    </div>

    <UContainer class="pb-14 space-y-8">
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
        <div class="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <div class="flex-1 relative">
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5"
            />
            <input
              v-model="search"
              type="text"
              placeholder="Search by name or code..."
              class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              @keyup.enter="applyFilters"
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton
              color="primary"
              variant="solid"
              icon="i-heroicons-plus"
              class="!bg-blue-900 !text-white hover:!bg-blue-800"
              @click="openCreate"
            >
              Create {{ singularLabel }}
            </UButton>
            <UButton
              color="primary"
              variant="outline"
              icon="i-heroicons-arrow-path"
              class="!text-blue-900 !border-blue-900 hover:!bg-blue-50"
              :loading="loading"
              @click="loadItems"
            >
              Refresh
            </UButton>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden"
      >
        <div v-if="loading" class="p-8 flex flex-col gap-3">
          <USkeleton class="h-5 w-1/3" />
          <USkeleton class="h-5 w-1/4" />
          <USkeleton class="h-5 w-full" />
          <USkeleton class="h-5 w-full" />
        </div>
        <div
          v-else-if="displayedItems.length === 0"
          class="p-8 text-center text-sm text-gray-600 dark:text-slate-400"
        >
          No {{ pluralLabel.toLowerCase() }} found.
        </div>
        <table v-else class="w-full text-sm">
          <thead class="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-slate-400">
            <tr>
              <th class="px-4 py-3 text-left">Name</th>
              <th v-if="supportsCode" class="px-4 py-3 text-left">Code</th>
              <th class="px-4 py-3 text-left">Created</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
            <tr
              v-for="item in displayedItems"
              :key="item.id"
              class="hover:bg-gray-50 dark:hover:bg-slate-700/40"
            >
              <td class="px-4 py-3">
                <div class="font-semibold text-gray-900 dark:text-white">
                  {{ item.name || "—" }}
                </div>
                <div v-if="item.description" class="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {{ item.description }}
                </div>
              </td>
              <td v-if="supportsCode" class="px-4 py-3 text-gray-700 dark:text-slate-300">
                {{ item.code || "—" }}
              </td>
              <td class="px-4 py-3 text-gray-700 dark:text-slate-300">
                {{ formatDate(item.createdAt) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-2">
                  <UButton
                    icon="i-heroicons-pencil-square"
                    size="xs"
                    color="primary"
                    variant="ghost"
                    @click="openEdit(item)"
                  />
                  <UButton
                    icon="i-heroicons-trash"
                    size="xs"
                    color="error"
                    variant="ghost"
                    @click="openDelete(item)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex items-center justify-between mt-4 px-4 pb-4" v-if="filteredItems.length > pageSize">
          <span class="text-xs text-gray-500 dark:text-slate-400">
            Showing {{ (page - 1) * pageSize + 1 }} - {{ Math.min(page * pageSize, filteredItems.length) }}
            of {{ filteredItems.length }}
          </span>
          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-chevron-left"
              size="xs"
              variant="ghost"
              :disabled="page === 1"
              @click="changePage(page - 1)"
            />
            <UButton
              icon="i-heroicons-chevron-right"
              size="xs"
              variant="ghost"
              :disabled="page * pageSize >= filteredItems.length"
              @click="changePage(page + 1)"
            />
          </div>
        </div>
      </div>
    </UContainer>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showFormModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showFormModal = false"
        >
          <div class="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" />
          <div
            class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
          >
            <form class="p-5 space-y-4" @submit.prevent="saveItem">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ formMode === "create" ? `Create ${singularLabel}` : `Update ${singularLabel}` }}
                </h3>
                <UButton
                  icon="i-heroicons-x-mark"
                  color="neutral"
                  variant="ghost"
                  type="button"
                  @click="showFormModal = false"
                />
              </div>

              <UFormGroup label="Name" required>
                <UInput v-model="form.name" placeholder="Enter name" required />
              </UFormGroup>
              <UFormGroup v-if="supportsCode" label="Code">
                <UInput v-model="form.code" placeholder="Enter code" />
              </UFormGroup>
              <UFormGroup label="Description">
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional description"
                />
              </UFormGroup>

              <div class="flex justify-end gap-3 pt-2">
                <UButton variant="ghost" color="neutral" type="button" @click="showFormModal = false">
                  Cancel
                </UButton>
                <UButton
                  color="primary"
                  type="submit"
                  :loading="saving"
                  :disabled="saving || !form.name.trim()"
                  class="!bg-blue-900 !text-white hover:!bg-blue-800"
                >
                  {{ formMode === "create" ? "Create" : "Update" }}
                </UButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <DeleteConfirmationModal
      v-model="showDeleteModal"
      :project-title="itemToDelete?.name || `this ${singularLabel.toLowerCase()}`"
      :is-deleting="deleting"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import DeleteConfirmationModal from "~/components/DeleteConfirmationModal.vue";
import { useToast } from "#imports";
import {
  useProjectMetaStore,
  type ProjectMetaItem,
  type ProjectMetaResource,
} from "~/stores/project-meta";

type EntityRow = ProjectMetaItem;

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  icon: { type: String, required: true },
  singularLabel: { type: String, required: true },
  pluralLabel: { type: String, required: true },
  resource: { type: String as () => ProjectMetaResource, required: true },
  supportsCode: { type: Boolean, default: false },
});

const toast = useToast();
const saving = ref(false);
const deleting = ref(false);
const search = ref("");
const page = ref(1);
const pageSize = 20;
const metaStore = useProjectMetaStore();
const loading = computed(() => metaStore.isLoading(props.resource));
const items = computed(() => metaStore.getItems(props.resource));

const showFormModal = ref(false);
const formMode = ref<"create" | "edit">("create");
const editingId = ref<string>("");
const form = ref({
  name: "",
  code: "",
  description: "",
});

const showDeleteModal = ref(false);
const itemToDelete = ref<EntityRow | null>(null);

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return items.value;
  return items.value.filter((item) => {
    return (
      (item.name || "").toLowerCase().includes(term) ||
      (item.code || "").toLowerCase().includes(term) ||
      (item.description || "").toLowerCase().includes(term)
    );
  });
});

const displayedItems = computed(() =>
  filteredItems.value.slice((page.value - 1) * pageSize, page.value * pageSize),
);

onMounted(async () => loadItems());

watch(search, () => {
  page.value = 1;
});

const buildBody = () => {
  const body: Record<string, string> = {
    name: form.value.name.trim(),
  };
  if (props.supportsCode && form.value.code.trim()) {
    body.code = form.value.code.trim();
  }
  if (form.value.description.trim()) {
    body.description = form.value.description.trim();
  }
  return body;
};

const loadItems = async () => {
  try {
    await metaStore.fetchItems(props.resource);
    page.value = 1;
  } catch (error) {
    console.error(`Failed to load ${props.pluralLabel.toLowerCase()}`, error);
    toast.add({ title: `Failed to load ${props.pluralLabel.toLowerCase()}`, color: "error" });
  }
};

const applyFilters = () => {
  page.value = 1;
};

const changePage = (next: number) => {
  if (next < 1) return;
  page.value = next;
};

const openCreate = () => {
  formMode.value = "create";
  editingId.value = "";
  form.value = { name: "", code: "", description: "" };
  showFormModal.value = true;
};

const openEdit = (item: EntityRow) => {
  formMode.value = "edit";
  editingId.value = item.id;
  form.value = {
    name: item.name || "",
    code: item.code || "",
    description: item.description || "",
  };
  showFormModal.value = true;
};

const saveItem = async () => {
  if (!form.value.name.trim()) return;
  saving.value = true;
  try {
    const body = buildBody();

    if (formMode.value === "create") {
      await metaStore.createItem(props.resource, body);
      toast.add({ title: `${props.singularLabel} created`, color: "success" });
    } else {
      await metaStore.updateItem(props.resource, editingId.value, body);
      toast.add({ title: `${props.singularLabel} updated`, color: "success" });
    }

    showFormModal.value = false;
    await loadItems();
  } catch (error) {
    console.error(`Failed to save ${props.singularLabel.toLowerCase()}`, error);
    toast.add({ title: `Save ${props.singularLabel.toLowerCase()} failed`, color: "error" });
  } finally {
    saving.value = false;
  }
};

const openDelete = (item: EntityRow) => {
  itemToDelete.value = item;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!itemToDelete.value?.id) return;
  deleting.value = true;
  try {
    await metaStore.deleteItem(props.resource, itemToDelete.value.id);
    toast.add({ title: `${props.singularLabel} deleted`, color: "success" });
    showDeleteModal.value = false;
    itemToDelete.value = null;
  } catch (error) {
    console.error(`Failed to delete ${props.singularLabel.toLowerCase()}`, error);
    toast.add({ title: `Delete ${props.singularLabel.toLowerCase()} failed`, color: "error" });
  } finally {
    deleting.value = false;
  }
};

const formatDate = (date: string | undefined) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
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
