<script setup lang="ts">
defineProps<{
  text: string;
  isUser: boolean;
}>();
</script>

<template>
  <div
    class="flex"
    :class="{ 'justify-end': isUser, 'justify-start': !isUser }"
  >
    <div
      class="rounded-xl px-4 py-3 max-w-2xl"
      :class="{
        'bg-green-700 text-white': isUser,
        'bg-gray-700 text-gray-200': !isUser,
      }"
    >
      {{ text }}
    </div>
  </div>
</template>
