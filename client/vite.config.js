import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],
  server: {
    proxy: {
      // Proxy requests starting with '/api'
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
