// composables/useMap.js
import { ref } from "vue";

export const useMap = (initialEntries = []) => {
  const map = ref(new Map(initialEntries));

  const set = (key: any, value: any) => {
    map.value.set(key, value);
  };

  const get = (key: any) => {
    return map.value.get(key);
  };

  const remove = (key: any) => {
    map.value.delete(key);
  };

  const clear = () => {
    map.value.clear();
  };

  const has = (key: any) => {
    return map.value.has(key);
  };

  const entries = () => Array.from(map.value.entries());
  const keys = () => Array.from(map.value.keys());
  const values = () => Array.from(map.value.values());

  return {
    map,
    set,
    get,
    remove,
    clear,
    has,
    entries,
    keys,
    values,
  };
};
