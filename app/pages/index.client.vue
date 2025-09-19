<script setup lang="ts">
import { indexeddb } from "#imports";
import type { ContentListUnion } from "@google/genai";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import type { GeminiResponse, StoredProduct } from "~~/shared/types";

const uiStore = useUiStore();
const { storedProduct } = storeToRefs(useProductsStore());

const store = ref<IDBObjectStore>();

// const { getObjectStore } = await useDB();

const query = ref<string>(
  "I'm looking for an android that good for gaming. my budget only 1000"
);

// query
const queryDocs = async (query: string, topK = 10) => {
  const queryEmbedding: number[] = await $fetch("/api/embed", {
    method: "POST",
    body: {
      text: query,
    },
  });
  console.log(queryEmbedding);

  return new Promise((resolve) => {
    const allReq = store.value!.getAll();
    allReq.onsuccess = () => {
      const docs = allReq.result;
      const ranked = docs
        .map((d: any) => ({
          ...d,
          score: cosineSim(queryEmbedding, d.embedded),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

      resolve(ranked);
    };
  });
};

const priceFilter = async (
  x: number,
  operation: "around X" | "under X" | "above X" | "between X and Y",
  y?: number
): Promise<StoredProduct[]> => {
  const items = [] as any[];

  return new Promise((resolve, reject) => {
    const cursor = store.value!.openCursor();
    cursor.onsuccess = (e) => {
      const cursor = (e.target as any).result as IDBCursorWithValue;
      if (cursor) {
        switch (operation) {
          case "around X":
            const threshold = 300;
            if (
              cursor.value.objData.price <= x + threshold &&
              cursor.value.objData.price >= x - threshold
            ) {
              items.push(cursor.value);
            }
            break;

          case "above X":
            if (cursor.value.objData.price >= x) {
              items.push(cursor.value);
            }
            break;

          case "under X":
            if (cursor.value.objData.price <= x) {
              items.push(cursor.value);
            }
            break;

          case "between X and Y":
            if (!y) {
              if (cursor.value.objData.price >= x) {
                items.push(cursor.value);
              }
              break;
            }
            if (
              cursor.value.objData.price >= x &&
              cursor.value.objData.price >= y
            ) {
              items.push(cursor.value);
            }
            break;

          default:
            break;
        }

        cursor.continue();
      } else {
        // console.log("No more entries!");
        resolve(items);
      }
    };
    cursor.onerror = (e) => {
      reject("Error getting data: " + (e.target as any).errorCode);
    };
  });
};
const runPricceFilter = async () => {
  const filteredProducts = await priceFilter(1200, "between X and Y", 1600);
  console.log("log", filteredProducts);
};

const agent = async () => {
  const contents: ContentListUnion = [
    {
      role: "user",
      parts: [
        {
          text: query.value,
        },
      ],
    },
  ];
  const res = JSON.parse(
    await $fetch("/api/gemini", {
      method: "POST",
      body: {
        contents: contents,
      },
    })
  ) as GeminiResponse;

  // console.log("res", typeof res, res);

  if (res.answer) {
    console.log(res.answer);
    return;
  }
  // Load product
  let products: StoredProduct[] | undefined = undefined;
  if (res.priceFilter !== null) {
    products = await priceFilter(
      res.priceFilter.x,
      res.priceFilter.operation,
      res.priceFilter.y ?? 0
    );
    // console.log("priceFilter", products);
  }

  if (res.requireProductData) {
    if (!products) {
      products = await getAllProducts();
    }
    const topK = 10;
    const queryEmbedding: number[] = await $fetch("/api/embed", {
      method: "POST",
      body: {
        text: query.value,
      },
    });
    products = products
      .map((p: any) => ({
        ...p,
        score: cosineSim(queryEmbedding, p.embedded),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
  // extract textData
  const productText =
    "available product list: " +
    products!.map((item, i) => `${i + 1}) ${item.textData}.`).join(" ");
  console.log(productText);

  contents.push({ role: "model", parts: [{ text: JSON.stringify(res) }] });

  contents.push({
    role: "user",
    parts: [{ text: productText }],
  });
  const finalResult = await $fetch("/api/gemini", {
    method: "POST",
    body: {
      contents,
      withProductList: true,
    },
  });
  console.log(finalResult);
};

onMounted(async () => {
  storedProduct.value = await getAllProducts();
});
</script>

<template>
  <!-- <button @click="loadStoredProduct">Load</button> -->
  <div class="relative flex h-screen">
    <!-- Sidebar for larger screens -->
    <div class="hidden lg:block flex-shrink-0">
      <Sidebar />
    </div>

    <!-- Sidebar for mobile (overlay) -->
    <div
      v-if="uiStore.isSidebarOpen"
      class="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 lg:hidden"
      @click="uiStore.toggleSidebar"
    ></div>
    <div
      class="fixed inset-y-0 left-0 z-30 w-96 transform transition-transform duration-300 lg:hidden"
      :class="{
        'translate-x-0': uiStore.isSidebarOpen,
        '-translate-x-full': !uiStore.isSidebarOpen,
      }"
    >
      <Sidebar />
    </div>

    <main class="flex-1 flex flex-col">
      <ChatWindow />
    </main>
  </div>
</template>

<style scoped></style>
