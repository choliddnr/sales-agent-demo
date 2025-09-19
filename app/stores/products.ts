import { defineStore, acceptHMRUpdate } from "pinia";
import type { StoredProduct } from "~~/shared/types";

export const useProductsStore = defineStore("products", () => {
  const storedProduct = ref<StoredProduct[]>([]);

  return { storedProduct };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductsStore, import.meta.hot));
}
