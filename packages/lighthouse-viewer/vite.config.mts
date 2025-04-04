import path from 'path';
import { defineConfig, UserConfig } from 'vite';

const { BUILD_TYPE } = process.env;

const libraryOptions: UserConfig = {
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
const demoOptions: UserConfig = {
  base: '/lighthouse-viewer/vanillajs/',
  build: {
    outDir: path.resolve(__dirname, 'demo'),
  },
};

const returnConfig = (): UserConfig => {
  if (BUILD_TYPE === 'library') {
    return libraryOptions;
  }
  return demoOptions;
};

export default defineConfig(returnConfig());
