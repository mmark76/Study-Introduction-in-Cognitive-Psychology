import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/Study-Introduction-in-Cognitive-Psychology/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["study-icon.svg"],
      manifest: {
        name: "Generic Study App",
        short_name: "Study App",
        description: "Local-first study application for any subject",
        theme_color: "#172554",
        background_color: "#f8fafc",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            src: "study-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      }
    })
  ]
});
