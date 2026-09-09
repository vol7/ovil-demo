import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

/**
 * The ServiceOntario entry page is a saved copy of ontario.ca served statically from
 * public/serviceontario/. Vite's SPA fallback would otherwise hand /serviceontario to
 * the React app, so rewrite it to the static index.html in dev and preview.
 */
function staticServiceOntario(): Plugin {
  const rewrite = (req: { url?: string }) => {
    if (req.url === "/serviceontario" || req.url === "/serviceontario/") {
      req.url = "/serviceontario/index.html"
    }
  }
  return {
    name: "static-serviceontario",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => (rewrite(req), next()))
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => (rewrite(req), next()))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [staticServiceOntario(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
