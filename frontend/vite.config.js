import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],

  server: {
    host: true, // VERY IMPORTANT for phone access
    port: 5173,
  },
});