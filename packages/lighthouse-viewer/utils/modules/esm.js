const topFrom = /'use strict';/;

const fileNamer = () => ({
  import: {
    from: topFrom,
    to: ``,
  },
  export: {
    from: `module.exports = {getLhrFilenamePrefix, getFilenamePrefix};`,
    to: `export {getLhrFilenamePrefix,getFilenamePrefix};`,
  },
});

const manifest = {
  'file-namer.js': fileNamer(),
};

module.exports = manifest;
