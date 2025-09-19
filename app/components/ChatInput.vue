<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["send-message"]);

const message = ref("saya cari hp buat fotografi, ada rekomendasi?");

function sendMessage() {
  if (message.value.trim()) {
    emit("send-message", message.value);
    message.value = "";
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}
</script>

<template>
  <div class="p-4">
    <form
      @submit.prevent="sendMessage"
      class="relative rounded-xl border border-gray-600 bg-gray-800"
    >
      <textarea
        v-model="message"
        @keydown="handleKeydown"
        rows="1"
        placeholder="Type a message..."
        class="w-full bg-transparent p-4 pr-16 resize-none focus:outline-none text-white"
        style="caret-color: #3b82f6"
      ></textarea>
      <button
        type="submit"
        class="absolute top-1/2 right-4 -translate-y-1/2 rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 focus:outline-none disabled:bg-gray-600"
        :disabled="!message.trim()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </form>
  </div>
</template>
