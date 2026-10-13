import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
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
  };
});
