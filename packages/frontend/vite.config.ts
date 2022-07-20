import path from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  publicDir: 'public',
  build: {
    outDir: '../backend/src/views',
    emptyOutDir: true,
    target: 'esnext',
  },
  resolve: {
    alias: {
      '~': path.resolve('src'),
    },
  },
});
