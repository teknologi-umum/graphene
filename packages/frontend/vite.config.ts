import path from 'path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  publicDir: 'public',
  build: {
    outDir: process.env.NODE_ENV === 'production' ? '../dist/views' : '../backend/src/views',
    emptyOutDir: true,
    target: 'esnext',
  },
  resolve: {
    alias: {
      '~': path.resolve('src'),
    },
  },
});
