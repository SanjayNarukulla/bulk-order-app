import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist", // Output directory for build
    rollupOptions: {
      // Ensuring that Vite correctly bundles assets
      output: {
        // Customizing file names, optional but helps with clarity
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash][extname]",
      },
    },
  },
  server: {
    // For local dev fallback (already correct)
    historyApiFallback: true, // For SPA routing in development
  },
  resolve: {
    alias: {
      // Resolve path to `src` with `@`
      "@": "/src", // Optional alias to clean up imports
    },
  },
  // Optional: helps with static assets and correct paths in production builds
  base: "/",
});
