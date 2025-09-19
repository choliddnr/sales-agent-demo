<script setup lang="ts">
import { storeToRefs } from "pinia";

const uiStore = useUiStore();
const { storedProduct } = storeToRefs(useProductsStore());
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
