import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import analyzer from 'rollup-plugin-analyzer';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import html from '@rollup/plugin-html';
import postcss from 'rollup-plugin-postcss';

export default (
  {
    cwd,
    pkg,
    entry = './src/index.ts',
    external = [],
    libraryName,
    minify = false,
    extensions = ['js', 'jsx', 'mjs', 'ts', 'tsx'],
  },
  sourcemap = true,
) => {
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
      html(),
      postcss(),
      typescript({ tsconfig: `${cwd}/tsconfig.json` }),
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
      html(),
      postcss(),
      typescript({ lib: ['es5', 'es6', 'dom'], target: 'es5' }),
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
};
