import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "assets/js",
    emptyOutDir: true,
    lib: {
      entry: "src/main.js",
      name: "DictateButton",
      fileName: () => "dictate-button-bundle.js",
      formats: ["es"],
    },
  },
});
