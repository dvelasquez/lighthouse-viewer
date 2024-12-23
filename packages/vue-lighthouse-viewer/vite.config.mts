import path from 'path';
import { defineConfig, UserConfig, PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue2';
const { BUILD_TYPE } = process.env;

const libraryOptions: UserConfig = {
  plugins: [vue() as PluginOption],
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
const demoOptions: UserConfig = {
  plugins: [vue() as PluginOption],
  base: '/lighthouse-viewer/vue/',
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
