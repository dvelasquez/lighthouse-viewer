import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const { BUILD_TYPE } = process.env;

const libraryOptions = {
  plugins: [svelte()],

  build: {
    minify: 'esbuild',
    outDir: './dist',
    lib: {
      entry: './lib/main.ts',
      name: 'SvelteLighthouseViewer',
      fileName: (format) => `svelte-lighthouse-viewer.${format}.js`,
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
  plugins: [svelte()],
  build: {
    outDir: './demo',
  },
};

const returnConfig = () => {
  if (BUILD_TYPE === 'library') {
    return libraryOptions;
  }
  return demoOptions;
};

export default defineConfig(returnConfig());
