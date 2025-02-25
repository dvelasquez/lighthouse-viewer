import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '328t6m',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://127.0.0.1:8080',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
