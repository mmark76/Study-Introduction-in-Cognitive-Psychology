import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/Markellos-Study-App/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["study-icon.svg"],
      manifest: {
        name: "Markellos Study App",
        short_name: "Study App",
        description: "A private study space for any subject",
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
