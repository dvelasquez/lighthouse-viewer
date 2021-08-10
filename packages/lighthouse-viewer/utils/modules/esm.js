const topFrom = /'use strict';/;

const fileNamer = () => ({
  import: {
    from: topFrom,
    to: ``,
  },
  export: {
    from: `module.exports = {getFilenamePrefix};`,
    to: `export {getFilenamePrefix};`,
  },
});

const manifest = {
  'file-namer.js': fileNamer(),
};

module.exports = manifest;
