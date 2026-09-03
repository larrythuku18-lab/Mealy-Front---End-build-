/* global process */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Where /api requests are proxied in dev. Override with VITE_API_PROXY_TARGET
// to point the front end at a deployed or tunneled backend, e.g.:
//   VITE_API_PROXY_TARGET=https://mealy-api.example.com npm run dev
const API_PROXY_TARGET = process.env.VITE_API_PROXY_TARGET || "http://localhost:5000";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
      },
    },
  },
});