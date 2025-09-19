import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: useRuntimeConfig().geminiApiKey });

export default defineEventHandler(async (e) => {
  const body = await readBody<{ text: string }>(e);
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: body.text,
  });

  return response.embeddings![0].values;
});
