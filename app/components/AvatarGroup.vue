<template>
  <div class="flex items-center gap-2">
    <!-- Avatars -->
    <div class="flex -space-x-2">
      <img
        v-for="(member, index) in displayedMembers"
        :key="member.id || index"
        :src="member.avatar || defaultAvatar"
        :alt="member.name"
        :title="member.name"
        class="w-10 h-10 rounded-full border-2 border-slate-900 object-cover hover:z-10 transition-all duration-200 cursor-pointer"
      />

      <!-- More count -->
      <div
        v-if="hasMore"
        :title="`+${remainingCount} more`"
        class="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs font-bold text-white hover:bg-slate-600 cursor-pointer transition-colors"
      >
        +{{ remainingCount }}
      </div>
    </div>

    <!-- Total count -->
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-gray-300">{{
        members.length
      }}</span>
      <span class="text-xs text-gray-500">members</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  members: {
    type: Array,
    required: true,
  },
  maxDisplay: {
    type: Number,
    default: 3,
  },
  defaultAvatar: {
    type: String,
    default: "https://img.icons8.com/nolan/1200/user-default.jpg",
  },
});

const displayedMembers = computed(() => {
  return props.members.slice(0, props.maxDisplay);
});

const remainingCount = computed(() => {
  return Math.max(0, props.members.length - props.maxDisplay);
});

const hasMore = computed(() => {
  return props.members.length > props.maxDisplay;
});
</script>
