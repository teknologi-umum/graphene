import path from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    outDir: '../backend/src/dist',
    emptyOutDir: true,
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  resolve: {
    alias: {
      '/#': path.resolve('src'),
    },
  },
});
