import { defineConfig, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
const { BUILD_TYPE } = process.env;

const libraryOptions: UserConfig = {
  plugins: [vue()],
  build: {
    minify: 'esbuild',
    outDir: path.resolve(__dirname, 'dist'),
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: 'Vue3LighthouseViewer',
      fileName: (format: string) => `vue3-lighthouse-viewer.${format}.js`,
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
const demoOptions: UserConfig = {
  plugins: [vue()],
  base: '/lighthouse-viewer/vue3/',
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
