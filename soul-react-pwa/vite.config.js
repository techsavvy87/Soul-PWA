import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const manifestIcons = [
  {
    src: "icons/icon-48.png",
    sizes: "48x48",
    type: "image/png",
  },
  {
    src: "icons/icon-72.png",
    sizes: "72x72",
    type: "image/png",
  },
  {
    src: "icons/icon-96.png",
    sizes: "96x96",
    type: "image/png",
  },
  {
    src: "icons/icon-144.png",
    sizes: "144x144",
    type: "image/png",
  },
  {
    src: "icons/icon-192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "icons/icon-512.png",
    sizes: "512x512",
    type: "image/png",
  },
];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Blended Soul",
        short_name: "BSA",
        description:
          "A spiritual wake-up tool delivering raw insight through powerful, unique personality oracle cards.",
        theme_color: "#132B75",
        background_color: "#132B75",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: manifestIcons,
      },
      workbox: {
        importScripts: ["/service-worker/push.js"],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173, // change if the port is blocked
    strictPort: true, // force port usage or fail
  },
});
