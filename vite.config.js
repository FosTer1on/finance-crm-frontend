import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
  
      "@api": path.resolve(__dirname, "./src/api"),
  
      "@store": path.resolve(__dirname, "./src/store"),
  
      "@components": path.resolve(__dirname, "./src/components"),
  
      "@pages": path.resolve(__dirname, "./src/pages"),
  
      "@hooks": path.resolve(__dirname, "./src/hooks"),
  
      "@layouts": path.resolve(__dirname, "./src/layouts"),
  
      "@assets": path.resolve(__dirname, "./src/assets"),
  
      "@utils": path.resolve(__dirname, "./src/utils"),
  
      "@constants": path.resolve(__dirname, "./src/constants"),
    },
  },
});