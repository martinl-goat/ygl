import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // @ts-expect-error TS is unaware of vitest additions to vite config file
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
