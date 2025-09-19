// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      baseURL: import.meta.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000",
    },
    geminiApiKey: import.meta.env.NUXT_GEMINI_API_KEY || "",
    mcpEndpoint: import.meta.env.NUXT_MCP_ENDPOINT,
  },
});
