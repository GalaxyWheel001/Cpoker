import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  // Align output with Netlify publish directory
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 2000,
  },
  resolve: {
    alias: {
      components: resolve(__dirname, 'src/components'),
      pages: resolve(__dirname, 'src/pages'),
      utils: resolve(__dirname, 'src/utils'),
      services: resolve(__dirname, 'src/services'),
      store: resolve(__dirname, 'src/store'),
      styles: resolve(__dirname, 'src/styles'),
      contexts: resolve(__dirname, 'src/contexts'),
    }
  },
  plugins: [tsconfigPaths(), react(), tagger()],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  }
});