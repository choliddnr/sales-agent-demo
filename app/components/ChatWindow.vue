<script setup lang="ts">
import { ref } from "vue";
import { useUiStore } from "@/stores/uiStore";
import ChatMessage from "./ChatMessage.vue";
import ChatInput from "./ChatInput.vue";
import type { Content, ContentListUnion } from "@google/genai";
import type { GeminiResponse } from "~~/shared/types";

const uiStore = useUiStore();

const contents = ref<Content[]>([]);
const customerContents = computed<Content[]>(() => {
  return contents.value.map((c) => ({
    parts: c.parts,
    role: c.role === "user" ? "model" : "user",
  }));
});

const handleSendMessage = async (message: string) => {
  const stop = ref<boolean>(false);
  contents.value.push({ role: "user", parts: [{ text: message }] });
  while (!stop.value) {
    const res = await agent(contents.value);
    contents.value.push({ role: "model", parts: [{ text: res ?? "" }] });
    const custRes = JSON.parse(
      await $fetch("/api/customer", {
        method: "POST",
        body: {
          contents: customerContents.value,
        },
      })
    ) as { answer: string; stopConv: boolean };

    contents.value.push({ role: "user", parts: [{ text: custRes.answer }] });
    if (custRes.stopConv) stop.value = true;
    // console.log("customerContents", customerContents.value);
  }
};
</script>

<template>
  <div class="flex flex-col h-full bg-gray-600">
    <header
      class="flex items-center justify-between p-4 border-b border-gray-700 lg:hidden"
    >
      <button @click="uiStore.toggleSidebar" class="text-white">
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 class="text-xl font-bold">AI Sales Agent</h1>
    </header>
    <div class="flex-grow p-4 space-y-4 overflow-y-auto">
      <ChatMessage
        v-for="(content, index) in contents"
        :key="index"
        :text="content.parts![0]?.text ?? ''"
        :is-user="content.role === 'user'"
      />
    </div>
    <ChatInput @send-message="handleSendMessage" />
  </div>
</template>
