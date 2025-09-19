<script setup lang="ts">
import { ref, computed } from "vue";
import { useUiStore } from "@/stores/uiStore";
import ChatMessage from "./ChatMessage.vue";
import ChatInput from "./ChatInput.vue";
import type { Content } from "@google/genai";

const uiStore = useUiStore();
const aiCustomerAgent = ref<boolean>(false);

const contents = ref<Content[]>([]);
const customerContents = computed<Content[]>(() => {
  return contents.value.map((c) => ({
    parts: c.parts,
    role: c.role === "user" ? "model" : "user",
  }));
});

const handleSendMessage = async (message: string) => {
  contents.value.push({ role: "user", parts: [{ text: message }] });
  const loop = ref<boolean>(true);
  if (aiCustomerAgent.value) {
    while (loop.value) {
      const res = await agent(contents.value);

      performActionAfterRandomDelay();

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
      if (custRes.stopConv || !aiCustomerAgent.value) loop.value = false;
      performActionAfterRandomDelay();
      // console.log("customerContents", customerContents.value);
    }
  } else {
    const res = await agent(contents.value);
    contents.value.push({ role: "model", parts: [{ text: res ?? "" }] });
  }
};
</script>

<template>
  <div class="flex flex-col h-full bg-gray-600">
    <header
      class="flex items-center justify-between p-4 border-b border-gray-700"
    >
      <button @click="uiStore.toggleSidebar" class="text-white lg:hidden">
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
      <h1 class="text-xl font-bold text-gray-100">AI Sales Agent</h1>
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-white">AI Customer Agent</span>
        <button
          @click="aiCustomerAgent = !aiCustomerAgent"
          :class="[
            'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
            aiCustomerAgent ? 'bg-indigo-600' : 'bg-gray-400',
          ]"
        >
          <span
            aria-hidden="true"
            :class="[
              'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
              aiCustomerAgent ? 'translate-x-5' : 'translate-x-0',
            ]"
          />
        </button>
      </div>
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
