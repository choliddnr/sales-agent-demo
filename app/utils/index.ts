import type { StoredProduct } from "~~/shared/types";

// cosine similarity
export const cosineSim = (a: number[], b: number[]) => {
  const dot = a.reduce((sum, v, i) => sum + v * b[i]!, 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (magA * magB);
};

export const objToText = (obj: object) => {
  let text = "";
  const keys = Object.keys(obj);
  keys.forEach((k) => {
    if (text !== "") text += " ";
    const v = (obj as any)[k];
    if (typeof v === "string") text += k + ": " + v + ".";
    if (typeof v === "number") text += k + ": " + v.toString() + ".";
    if (v instanceof Array) {
      let el = "";
      for (let i = 0; i < v.length; i++) {
        if (el !== "") el += ", ";
        if (typeof v[i] === "string") el += v[i];
        if (typeof v[i] === "number") el += v[i].toString();
      }
      text += k + ": " + el + ".";
    }
    if (typeof v === "object" && !(v instanceof Array))
      text += k + ": " + objToText(v);
  });
  return text.replaceAll("..", ".");
};

export const embed = async (text: string) => {
  return await $fetch<number[]>("/api/embed", {
    method: "post",
    body: {
      text: text,
    },
  });
};

export const getObjectStore = (
  mode: "readwrite" | "readonly"
): IDBObjectStore => {
  const { $db } = useNuxtApp();
  const tx = ($db as IDBDatabase).transaction("docs", mode);
  return tx.objectStore("docs");
};

export const getAllProducts = async (): Promise<StoredProduct[]> => {
  return new Promise((resolve) => {
    const store = getObjectStore("readonly");
    const allReq = store.getAll();
    allReq.onsuccess = () => {
      resolve(allReq.result);
    };
  });
};

export const getData = async (key: string): Promise<StoredProduct> => {
  return new Promise((resolve) => {
    const store = getObjectStore("readonly");
    const req = store.get(key);
    req.onsuccess = () => {
      resolve(req.result);
    };
  });
};

export const performActionAfterRandomDelay = (): void => {
  const minDelayMs = 5000; // 1 second
  const maxDelayMs = 10000; // 5 seconds
  const randomDelayMs = Math.random() * (maxDelayMs - minDelayMs) + minDelayMs;

  console.log(`Waiting for ${randomDelayMs.toFixed(2)} milliseconds...`);

  setTimeout(() => {
    console.log("Action performed after random delay!");
  }, randomDelayMs);
};
