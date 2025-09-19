import type { StoredProduct } from "~~/shared/types";

const DB_NAME = "vectorDB";
const DB_VERSION = 1; // Use a long long for this value (don't use a float)
const DB_STORE_NAME = "docs";

class indexeddb {
  db: IDBDatabase | undefined;

  constructor() {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    this.db = undefined;
    req.onsuccess = (evt) => {
      // Equal to: db = req.result;
      this.db = req.result;
      console.log("openDb DONE");
    };
    req.onerror = (e: any) => {
      console.error("openDb:", e.target!.errorCode);
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
  }
  getObjectStore(mode: "readwrite" | "readonly"): IDBObjectStore {
    var tx = this.db!.transaction(DB_STORE_NAME, mode);
    return tx.objectStore(DB_STORE_NAME);
  }

  async getAllProducts(): Promise<StoredProduct[]> {
    return new Promise((resolve) => {
      const store = this.getObjectStore("readonly");
      const allReq = store.getAll();
      allReq.onsuccess = () => {
        resolve(allReq.result);
      };
    });
  }

  // store vectors
  async saveDoc(obj: {
    id: string;
    objData: object;
    textData: string;
    embedded: number[];
  }) {
    const store = this.getObjectStore("readwrite");
    let req;
    req = store.add(obj);
    console.log(req);

    req.onsuccess = function (evt) {
      console.log("Insertion in DB successful");
    };
    req.onerror = function () {
      console.error("addPublication error", this.error);
    };
  }
}

export { indexeddb };
