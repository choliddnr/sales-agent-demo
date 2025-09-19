export default defineNuxtPlugin(async () => {
  const DB_NAME = "vectorDB";
  const DB_VERSION = 1; // Use a long long for this value (don't use a float)
  const DB_STORE_NAME = "docs";
  const openDb = async () => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onsuccess = (evt) => {
        // Equal to: db = req.result;
        resolve(req.result);
        console.log("openDb DONE");
      };
      req.onerror = (e: any) => {
        console.error("openDb:", e.target!.errorCode);
        reject();
      };

      req.onupgradeneeded = (e: any) => {
        console.log("openDb.onupgradeneeded");
        let store = e.currentTarget.result.createObjectStore(DB_STORE_NAME, {
          keyPath: "id",
        });

        // store.createIndex("biblioid", "biblioid", { unique: true });
        // store.createIndex("title", "title", { unique: false });
        // store.createIndex("year", "year", { unique: false });
      };
    });
  };
  return {
    provide: {
      db: (import.meta.client ? await openDb() : null) as IDBDatabase,
    },
  };
});
