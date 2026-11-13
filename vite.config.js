import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const rootDir = typeof import.meta.dirname !== "undefined" ? import.meta.dirname : process.cwd();
  return {
    base: "/Portfolio/",
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: true,
      rollupOptions: {
        input: {
          main: resolve(rootDir, "index.html"),
          projects: resolve(rootDir, "projects/index.html"),
          about: resolve(rootDir, "about/index.html"),
          research: resolve(rootDir, "research/index.html"),
          contact: resolve(rootDir, "contact/index.html"),
        },
      },
    },
    resolve: {
      alias: {
        "@": resolve(rootDir, "src"),
      },
    },
    server: {
      open: true,
    },
  };
});
