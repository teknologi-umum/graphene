import path from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const outDirPath = process.env?.NODE_ENV === 'production' ? '../dist/views' : '../backend/src/views';

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    outDir: outDirPath,
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
