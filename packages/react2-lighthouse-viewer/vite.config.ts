import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const { BUILD_TYPE } = process.env;

const libraryOptions = {
  plugins: [react()],
  build: {
    minify: 'esbuild',
    outDir: path.resolve(__dirname, 'dist'),
    lib: {
      entry: path.resolve(__dirname, 'lib/main.tsx'),
      name: 'ReactLighthouseViewer',
      fileName: (format) => `react2-lighthouse-viewer.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
    },
  },
};
const demoOptions = {
  plugins: [react()],
  base: '/lighthouse-viewer/react/',
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
