import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~": resolve("src")
    }
  },
  test: {
    globalSetup: "./sharp.test-setup.ts"
  }
});
