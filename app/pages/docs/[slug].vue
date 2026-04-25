<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 py-10">
    <UContainer class="max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_260px] gap-6">
        <aside class="lg:sticky lg:top-20 self-start">
          <div class="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-semibold text-slate-900 dark:text-white">Docs</h2>
              <NuxtLink to="/docs" class="text-xs text-blue-600 dark:text-blue-300 hover:underline">
                All
              </NuxtLink>
            </div>
            <nav class="space-y-1">
              <NuxtLink
                v-for="item in projectDocs"
                :key="item.slug"
                :to="`/docs/${item.slug}`"
                :class="[
                  'block rounded-lg px-3 py-2 text-sm transition',
                  item.slug === activeDoc?.slug
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-slate-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-700/60',
                ]"
              >
                {{ item.title }}
              </NuxtLink>
            </nav>
          </div>
        </aside>

        <main class="min-w-0">
          <div v-if="activeDoc" class="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 sm:p-7">
            <div class="mb-5 pb-4 border-b border-gray-200 dark:border-slate-700">
              <nav class="flex items-center flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300 mb-2">
                <NuxtLink to="/" class="hover:text-blue-600 dark:hover:text-blue-300">Home</NuxtLink>
                <span>/</span>
                <NuxtLink to="/docs" class="hover:text-blue-600 dark:hover:text-blue-300">Docs</NuxtLink>
                <span>/</span>
                <span class="font-medium text-slate-900 dark:text-white">{{ activeDoc.title }}</span>
              </nav>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                {{ activeDoc.description }}
              </p>
            </div>

            <DocsMarkdownRenderer :content="activeDoc.content" />
          </div>

          <div v-else class="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <h1 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Document not found
            </h1>
            <p class="text-slate-600 dark:text-slate-300 mb-4">
              The requested documentation page does not exist.
            </p>
            <ButtonsPresetButton to="/docs" label="Back to Docs" icon="i-heroicons-arrow-left" />
          </div>
        </main>

        <aside
          v-if="activeDoc && tocItems.length"
          class="hidden xl:block xl:sticky xl:top-20 self-start"
        >
          <div class="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <h2 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              On this page
            </h2>
            <nav class="max-h-[70vh] overflow-auto space-y-1">
              <a
                v-for="item in tocItems"
                :key="item.id"
                :href="`#${item.id}`"
                @click.prevent="scrollToHeading(item.id)"
                :class="[
                  'block rounded-md px-2 py-1.5 text-sm transition border-l-2',
                  item.level >= 3 ? 'ml-3' : '',
                  activeHeadingId === item.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'border-transparent text-slate-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-700/60 hover:text-blue-700 dark:hover:text-blue-300',
                ]"
              >
                {{ item.text }}
              </a>
            </nav>
          </div>
        </aside>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { getProjectDocBySlug, projectDocs } from "~/lib/docs/catalog";

const route = useRoute();

const activeDoc = computed(() => getProjectDocBySlug(String(route.params.slug || "")));
const activeHeadingId = ref<string>("");
let headingObserver: IntersectionObserver | null = null;

const slugifyHeading = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[`*_]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const tocItems = computed(() => {
  const content = activeDoc.value?.content || "";
  return content
    .split("\n")
    .map((line) => line.match(/^(#{1,3})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => {
      const m = match as RegExpMatchArray;
      const text = m[2].trim();
      return {
        level: m[1].length,
        text,
        id: slugifyHeading(text),
      };
    });
});

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
};

const setupHeadingObserver = async () => {
  if (import.meta.server) return;

  headingObserver?.disconnect();
  headingObserver = null;

  await nextTick();

  const headingEls = tocItems.value
    .map((item) => document.getElementById(item.id))
    .filter(Boolean) as HTMLElement[];

  if (!headingEls.length) return;

  headingObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            (a.target as HTMLElement).getBoundingClientRect().top -
            (b.target as HTMLElement).getBoundingClientRect().top,
        );

      if (visible.length) {
        activeHeadingId.value = (visible[0].target as HTMLElement).id;
        return;
      }

      const firstPast = headingEls.find(
        (el) => el.getBoundingClientRect().top >= 0,
      );
      if (firstPast) {
        activeHeadingId.value = firstPast.id;
      } else {
        activeHeadingId.value = headingEls[headingEls.length - 1]?.id || "";
      }
    },
    {
      root: null,
      rootMargin: "-96px 0px -70% 0px",
      threshold: [0, 1],
    },
  );

  headingEls.forEach((el) => headingObserver?.observe(el));

  activeHeadingId.value = headingEls[0].id;
};

watch(
  () => route.params.slug,
  async () => {
    await setupHeadingObserver();
  },
);

watch(
  () => activeDoc.value?.content,
  async () => {
    await setupHeadingObserver();
  },
);

onMounted(async () => {
  await setupHeadingObserver();
});

onBeforeUnmount(() => {
  headingObserver?.disconnect();
});

useHead(() => ({
  title: activeDoc.value
    ? `${activeDoc.value.title} - Docs`
    : "Docs - GIC Student Project Web",
  meta: [
    {
      name: "description",
      content:
        activeDoc.value?.description ||
        "Project documentation page",
    },
  ],
}));
</script>
