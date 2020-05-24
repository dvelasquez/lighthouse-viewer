# Lighthouse Viewer Monorepository

This is a monorepo-multipackage managed with Lerna to publish to NPM the following packages:

- `lighthouse-viewer`: The extracted sourcecode originally from [lighthouse](https://github.com/GoogleChrome/lighthouse).
- `vue-lighthouse-viewer`: A wrapper of the lighthouse-viewer for Vue 2.
- `demo`: A small demo of the code working

The idea is by following this pattern to be able to create wrappers to other libraries too.


## TODO
- [X] Sync at install or serve with the sources from lighthouse
- [x] Add Typescript Definitions
- [x] Generate example
- [ ] Write unit tests
- [ ] Write E2E tests
- [x] Setup CI
- [x] Migrate to Rollup
- [x] Make unnecessary to add the css manually 
- [x] Export ESM version
