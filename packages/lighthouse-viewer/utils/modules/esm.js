const topFrom = /'use strict';/;

const fileNamer = () => ({
  import: {
    from: topFrom,
    to: ``,
  },
  export: {
    from: `module.exports = {getLhrFilenamePrefix, getFilenamePrefix, getFlowResultFilenamePrefix};`,
    to: `export {getLhrFilenamePrefix,getFilenamePrefix,getFlowResultFilenamePrefix};`,
  },
});

const manifest = {
  'file-namer.js': fileNamer(),
};

module.exports = manifest;
