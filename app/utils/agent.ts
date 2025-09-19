import type { Content, ContentListUnion } from "@google/genai";
import type { GeminiResponse, StoredProduct } from "~~/shared/types";

const priceFilter = async (
  x: number,
  operation: "around X" | "under X" | "above X" | "between X and Y",
  y?: number
): Promise<StoredProduct[]> => {
  const items = [] as any[];

  return new Promise((resolve, reject) => {
    const cursor = getObjectStore("readonly").openCursor();
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

export const agent = async (contents: Content[]) => {
  //     {
  //       role: "user",
  //       parts: [
  //         {
  //           text: query,
  //         },
  //       ],
  //     },
  //   ];

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
    return res.answer;
  }
  // Load product
  let products: StoredProduct[] | undefined = undefined;
  if (res.priceFilter) {
    products = await priceFilter(
      res.priceFilter.x,
      res.priceFilter.operation,
      res.priceFilter.y ?? 0
    );
  }

  if (res.requireProductData) {
    if (!products) {
      products = await getAllProducts();
    }
    const topK = 10;
    const queryEmbedding: number[] = await $fetch("/api/embed", {
      method: "POST",
      body: {
        text: contents.at(-1)?.parts![0]?.text,
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
  // console.log(productText);

  const extendedContent = [] as Content[];
  extendedContent.push({
    role: "model",
    parts: [{ text: JSON.stringify(res) }],
  });

  extendedContent.push({
    role: "user",
    parts: [{ text: productText }],
  });
  const finalResult = JSON.parse(
    await $fetch("/api/gemini", {
      method: "POST",
      body: {
        contents: contents.concat(extendedContent),
        withProductList: true,
      },
    })
  ) as GeminiResponse;

  return finalResult.answer;
};
