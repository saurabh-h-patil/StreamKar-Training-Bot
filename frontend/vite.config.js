import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // RAG backend (port 8000)
      "/api/rag": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rag/, ""),
      },
      // TF-IDF backend (port 8001)
      "/api/tfidf": {
        target: "http://localhost:8001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tfidf/, ""),
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
