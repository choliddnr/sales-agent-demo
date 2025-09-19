<script setup lang="ts">
import { useUiStore } from "@/stores/uiStore";
import { v4 as uuidv4 } from "uuid";

// const { getObjectStore } = defineProps<{
// getObjectStore: Function;
// }>();
const uiStore = useUiStore();

const { $db } = useNuxtApp();

// store vectors
const saveDoc = async (obj: {
  id: string;
  objData: object;
  textData: string;
  embedded: number[];
}) => {
  const store = getObjectStore("readwrite");
  let req;
  req = store.add(obj);
  console.log(req);

  req.onsuccess = function (e: Event) {
    console.log("Insertion in DB successful");
  };
  req.onerror = function () {
    console.error("addPublication error", this.error);
  };
};

const loadAndStoreDocs = async () => {
  const products = await $fetch<object[]>("/api/products");

  const store = getObjectStore("readwrite");
  store.clear();

  products.forEach(async (_p) => {
    const id = uuidv4();
    const p = { id, ..._p };
    const text = objToText(p);
    const embedded = await embed(text);
    await saveDoc({
      id: id,
      objData: p,
      textData: text,
      embedded: embedded || [],
    });
  });
};
</script>

<template>
  <div class="w-96 h-full bg-gray-800 p-6 overflow-y-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-100">
        Product & Service Information
      </h2>
      <button
        @click="uiStore.toggleSidebar"
        class="text-gray-400 hover:text-white lg:hidden"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    <button
      role="button"
      type="button"
      class="bg-blue-800 text-gray-200 mx-2 rounded-2xl px-5 py-3 mb-5"
      @click="loadAndStoreDocs"
    >
      Load and store Product
    </button>
    <Product />
  </div>
</template>
