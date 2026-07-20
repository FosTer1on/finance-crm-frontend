import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const resolveSrc = (path) =>
  fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": resolveSrc(""),
      "@api": resolveSrc("api"),
      "@store": resolveSrc("store"),
      "@components": resolveSrc("components"),
      "@pages": resolveSrc("pages"),
      "@hooks": resolveSrc("hooks"),
      "@layouts": resolveSrc("layouts"),
      "@assets": resolveSrc("assets"),
      "@utils": resolveSrc("utils"),
      "@constants": resolveSrc("constants"),
    },
  },
});