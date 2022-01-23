import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const { BUILD_TYPE } = process.env;

const libraryOptions = {
  plugins: [svelte()],

  build: {
    minify: 'esbuild',
    outDir: path.resolve(__dirname, 'dist'),
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
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
