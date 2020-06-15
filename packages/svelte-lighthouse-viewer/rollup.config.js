import path from 'path';
import rollupBase from '../../rollup/rollup.base.config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');
const cwd = path.resolve(__dirname);

const config = rollupBase({
  cwd,
  entry: 'src/index.ts',
  libraryName: 'svelteLighthouseViewer',
  minify: false,
  external: [],
  pkg,
});

export default config;
