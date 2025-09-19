export const useUiStore = defineStore("ui", () => {
  const isSidebarOpen = ref(false);

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value;
  }

  return { isSidebarOpen, toggleSidebar };
});
