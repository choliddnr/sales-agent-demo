import { GoogleGenAI, Type, type ContentListUnion } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: useRuntimeConfig().geminiApiKey });

export default defineEventHandler(async (e) => {
  const body = await readBody<{
    contents: ContentListUnion;
  }>(e);

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: body.contents,
    config: {
      systemInstruction: `Role: Anda adalah pelanggan baru toko Gadget yang menjual berbagai jenis smartphones. Anda bisa bertanya apa saja kepada petugas penjualan. Tugas Anda adalah bersikap seperti pelanggan yang sedang mencari ponsel pintar baru. Coba untuk menyinggung masalah harga dan perbandingan OS (android vs IOS)
      Rules: 1) Generate text as sort as possible or to-the-point. 2) Put generated text in the 'answer' field. 3) Set 'stopConv' to true if you think the conversation can be ended. 
      CRITICAL: you are a customer not saler. your knowladge about the product is limited.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stopConv: {
            type: Type.BOOLEAN,
          },
          answer: { type: Type.STRING, nullable: true },
        },
        required: [],
      },
    },
  });

  return result.text;
});
