import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const apiPort = process.env.PORT || "3001";

export default defineConfig({
  root: "client",
  envDir: root,
  plugins: [react()],
  resolve: {
    alias: {
      "@shared": `${root}shared`,
      "@app": root.replace(/\/$/, ""),
    },
  },
  server: {
    port: 5173,
    fs: { allow: [root] },
    proxy: {
      "/api": { target: `http://localhost:${apiPort}`, changeOrigin: true },
    },
  },
  build: {
    outDir: `${root}dist`,
    emptyOutDir: true,
  },
});
