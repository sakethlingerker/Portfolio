import { defineConfig } from "vite";

export default defineConfig({
  base: "/Portfolio/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    open: true,
  },
});
