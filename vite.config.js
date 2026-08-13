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
      setupMiddlewares(middlewares) {
        middlewares.use(async (req, res, next) => {
          if (req.url === "/api/chat" && req.method === "POST") {
            let body = "";
            req.on("data", chunk => { body += chunk; });
            req.on("end", async () => {
              try {
                const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
                if (!apiKey) {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  return res.end(JSON.stringify({ fallback: true, reason: "NO_API_KEY" }));
                }
                const { contents, systemInstruction } = JSON.parse(body || "{}");
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    contents,
                    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
                  })
                });
                const data = await response.json();
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.end(JSON.stringify(data));
              } catch (err) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.end(JSON.stringify({ fallback: true, error: err.message }));
              }
            });
            return;
          }
          next();
        });
        return middlewares;
      }
    },
  };
});
