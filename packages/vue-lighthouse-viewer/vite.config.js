/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { defineConfig } = require('vite');
import { createVuePlugin } from 'vite-plugin-vue2';

const { BUILD_TYPE } = process.env;

const libraryOptions = {
  plugins: [createVuePlugin()],
  build: {
    minify: 'esbuild',
    outDir: path.resolve(__dirname, 'dist'),
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: 'VueLighthouseViewer',
      fileName: (format) => `vue-lighthouse-viewer.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
};
const demoOptions = {
  plugins: [createVuePlugin()],
  build: {
    outDir: path.resolve(__dirname, 'demo'),
  },
};

const returnConfig = () => {
  if (BUILD_TYPE === 'library') {
    return libraryOptions;
  }
  return demoOptions;
};

module.exports = defineConfig(returnConfig());
