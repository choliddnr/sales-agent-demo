<script lang="ts" setup>
import { useUiStore } from "@/stores/uiStore";
import type { Product } from "~~/shared/types";

// const productStore = useProductStore();
const { storedProduct } = storeToRefs(useProductsStore());
const uiStore = useUiStore();
const minimizedProducts = ref(new Set<string>());
const newSpecKeys = ref<{ [key: string]: string }>({});

const toggleMinimize = (productId: string) => {
  if (minimizedProducts.value.has(productId)) {
    minimizedProducts.value.delete(productId);
  } else {
    minimizedProducts.value.add(productId);
  }
};

const updateProduct = (
  product: Product,
  field: "name" | "description" | "price" | "stock",
  event: Event
) => {
  const target = event.target as HTMLInputElement;
  let value: string | number;

  if (field === "price" || field === "stock") {
    value = parseFloat(target.value);
    if (isNaN(value)) return;
  } else {
    value = target.value;
  }

  const updatedProduct = { ...product, [field]: value };
  // productStore.updateProduct(updatedProduct);
};

const updateSpec = (product: Product, specKey: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const newSpecs = { ...product.specifications, [specKey]: target.value };
  const updatedProduct = { ...product, specs: newSpecs };
  // productStore.updateProduct(updatedProduct);
};

const addSpec = (product: Product) => {
  // const newKey = newSpecKeys.value[product.id];
  // if (newKey && !product.specs.hasOwnProperty(newKey)) {
  //   const newSpecs = { ...product.specs, [newKey]: "" };
  //   const updatedProduct = { ...product, specs: newSpecs };
  //   productStore.updateProduct(updatedProduct);
  //   newSpecKeys.value[product.id] = ""; // Clear the input
  // }
};
</script>
<template>
  <div class="space-y-6">
    <div
      v-for="product in storedProduct"
      :key="product.id"
      class="bg-gray-700 p-4 rounded-lg"
    >
      <div
        class="flex justify-between items-center cursor-pointer"
        @click="toggleMinimize(product.id)"
      >
        <h3 class="text-gray-300 font-medium">{{ product.objData.name }}</h3>
        <button class="text-gray-400 hover:text-white">
          <svg
            v-if="!minimizedProducts.has(product.id)"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div v-show="minimizedProducts.has(product.id)">
        <div class="mt-4 space-y-2">
          <label
            :for="`name-${product.id}`"
            class="text-sm font-medium text-gray-300"
            >Product Name:</label
          >
          <input
            :id="`name-${product.id}`"
            type="text"
            :value="product.objData.name"
            @input="updateProduct(product.objData, 'name', $event)"
            class="w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />

          <label
            :for="`name-${product.id}`"
            class="text-sm font-medium text-gray-300"
            >Product Description:</label
          >
          <textarea
            :value="product.objData.description"
            @input="updateProduct(product.objData, 'description', $event)"
            class="w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows="3"
          ></textarea>

          <h4 class="text-sm font-medium text-gray-300">Specifications:</h4>
          <div class="space-y-2">
            <div
              v-for="(value, key) in product.objData.specifications"
              :key="key"
              class="grid grid-cols-2 items-center gap-2"
            >
              <label
                :for="`spec-${product.id}-${key}`"
                class="text-sm font-medium text-gray-400"
                >{{ key }}</label
              >
              <input
                :id="`spec-${product.id}-${key}`"
                type="text"
                :value="value"
                @input="updateSpec(product.objData, key.toString(), $event)"
                class="w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div class="mt-2 flex items-center gap-2">
            <input
              v-model="newSpecKeys[product.id]"
              type="text"
              placeholder="New Spec Name"
              class="w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-1 px-2 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              @click="addSpec(product.objData)"
              class="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label
              :for="`price-${product.id}`"
              class="text-sm font-medium text-gray-300"
              >Price</label
            >
            <input
              :id="`price-${product.id}`"
              type="number"
              :value="product.objData.price"
              @input="updateProduct(product.objData, 'price', $event)"
              class="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              :for="`stock-${product.id}`"
              class="text-sm font-medium text-gray-300"
              >Stock</label
            >
            <input
              :id="`stock-${product.id}`"
              type="number"
              :value="product.objData.stock"
              @input="updateProduct(product.objData, 'stock', $event)"
              class="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
