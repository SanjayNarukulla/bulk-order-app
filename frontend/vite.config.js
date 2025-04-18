import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
  },
  server: {
    // For local dev fallback (already correct)
    historyApiFallback: true,
  },
  // ⬇️ This part helps Vite handle SPA routes in production builds (optional but safe)
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
