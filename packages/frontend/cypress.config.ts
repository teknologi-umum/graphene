import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.baseUrl = 'http://localhost:5173';
      return config;
    },
  },
});
