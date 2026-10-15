
import { defineConfig } from "vite";

export default defineConfig({
  base: "/LaboratoriosDS4/",
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true
  }
});
