/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { defineConfig } = require('vite');

const { BUILD_TYPE } = process.env;

const libraryOptions = {
  build: {
    minify: 'esbuild',
    outDir: path.resolve(__dirname, 'dist'),
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: 'LighthouseViewer',
      fileName: (format) => `lighthouse-viewer.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
    },
  },
};
const demoOptions = {
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
