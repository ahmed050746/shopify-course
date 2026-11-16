import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(dir, "../assets/desktop-hero"),
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(dir, "src/embed.jsx"),
      output: {
        entryFileNames: "hero.js",
        chunkFileNames: "hero-[name].js",
        assetFileNames: "hero.[ext]",
      },
    },
  },
});