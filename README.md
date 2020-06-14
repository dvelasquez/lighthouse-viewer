[![Build Status](https://travis-ci.org/dvelasquez/lighthouse-viewer.svg?branch=master)](https://travis-ci.org/dvelasquez/lighthouse-viewer)
# Lighthouse Viewer Monorepository

This is a monorepo-multipackage managed with Lerna to publish to NPM the following packages:

- [lighthouse-viewer](./packages/lighthouse-viewer): The extracted sourcecode originally from [lighthouse](https://github.com/GoogleChrome/lighthouse).
- [vue-lighthouse-viewer](./packages/vue-lighthouse-viewer): A wrapper of the lighthouse-viewer for Vue 2.
- [react2-lighthouse-viewer](./packages/react2-lighthouse-viewer): A wrapper of the lighthouse-viewer for React.

The idea is by following this pattern to be able to create wrappers to other libraries too.