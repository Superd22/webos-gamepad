import { defineConfig } from "vite";

// vite.config.js
export default defineConfig({

  build: {
    manifest: true,
    outDir: "../../dist/service-web-input",
    emptyOutDir: true,
    target: "es2015",
    lib: {
      entry: 'src/index.ts',
      name: 'main&'
    },
    rollupOptions: {
      "external": ["webos-service", "fs"]
    }
  },
  base: ""
})