import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import analyzer from 'rollup-plugin-analyzer';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import htmlString from 'rollup-plugin-html';
import dev from 'rollup-plugin-dev';
import alias from '@rollup/plugin-alias';

const isDev = process.env.ROLLUP_WATCH === 'true';

export default (
  {
    cwd,
    pkg,
    entry = './src/index.ts',
    external = [],
    libraryName,
    minify = false,
    extensions = ['js', 'jsx', 'mjs', 'ts', 'tsx'],
    type = 'lib',
  },
  sourcemap = true,
) => {
  console.log(isDev, type);
  if (type === 'app') {
    const rollupAppConfig = {
      input: `${cwd}/${entry}`,
      output: [
        {
          file: pkg.main,
          format: 'es',
          exports: 'named',
          sourcemap: sourcemap,
        },
      ],
      external,
      plugins: [
        typescript({ tsconfig: `${cwd}/tsconfig.json` }),
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        postcss(),
        alias({ entries: [{ find: 'vue', replacement: `${cwd}/node_modules/vue/dist/vue.esm.browser.js` }] }),
        resolve({
          mainFields: ['module', 'main'], // Since the target of this is ESM, we will prioritise modules, and then main
          extensions: extensions, // List of extensions of files to be included
        }),
        commonjs(),
        !isDev && terser({ module: true, output: { comments: false } }),
        isDev && dev({ dirs: ['dist', 'public'] }),
      ],
    };
    return [rollupAppConfig];
  }
  if (type === 'lib') {
    const rollupESMConfig = {
      input: `${cwd}/${entry}`,
      output: [
        {
          file: pkg.module,
          format: 'esm',
          exports: 'named',
          sourcemap: sourcemap,
        },
      ],
      external,
      plugins: [
        typescript({ tsconfig: `${cwd}/tsconfig.json` }),
        htmlString({
          htmlMinifierOptions: {
            caseSensitive: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            conservativeCollapse: true,
            minifyCSS: true,
            minifyJS: true,
          },
        }),
        postcss({ minimize: true }),
        // Some libraries (such as React) needs to be in production mode, or you risk have unusable code
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        // Tells the compiler the preference of modules when importing a library.
        resolve({
          mainFields: ['module', 'main'], // Since the target of this is ESM, we will prioritise modules, and then main
          extensions: extensions, // List of extensions of files to be included
        }),
        minify && terser({ module: true, output: { comments: false } }), // If minify is true, the code will be minified
        analyzer({ summaryOnly: true }), // Useful plugin to check what is using most of the space in the bundle
      ],
    };

    const rollupUMDConfig = {
      input: `${cwd}/${entry}`,
      output: [
        {
          file: pkg.main,
          format: 'umd',
          name: libraryName,
          exports: 'named',
          sourcemap: sourcemap,
        },
      ],
      external,
      plugins: [
        typescript({ lib: ['es5', 'es6', 'dom'], target: 'es5' }),
        htmlString({
          htmlMinifierOptions: {
            caseSensitive: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            conservativeCollapse: true,
            minifyCSS: true,
            minifyJS: true,
          },
        }),
        postcss(),
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        resolve({
          mainFields: ['main'],
          modulesOnly: true,
          extensions: extensions,
        }),
        commonjs(),
        minify && terser({ output: { comments: false } }),
        analyzer({ summaryOnly: true }),
      ],
    };

    return [rollupESMConfig, rollupUMDConfig];
  }
};
