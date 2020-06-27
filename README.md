[![Build Status](https://travis-ci.org/dvelasquez/lighthouse-viewer.svg?branch=main)](https://travis-ci.org/dvelasquez/lighthouse-viewer)
# Lighthouse Viewer Monorepository

This is a monorepo-multipackage managed with Lerna to publish to NPM the following packages:

- [lighthouse-viewer](./packages/lighthouse-viewer): The extracted sourcecode originally from [lighthouse](https://github.com/GoogleChrome/lighthouse). [Online demo](https://codesandbox.io/s/lighthouse-viewer-vanillajs-demo-zw2bj)
- [vue-lighthouse-viewer](./packages/vue-lighthouse-viewer): A wrapper of the lighthouse-viewer for Vue 2.
- [react2-lighthouse-viewer](./packages/react2-lighthouse-viewer): A wrapper of the lighthouse-viewer for React.
- [svelte-lighthouse-viewer](./packages/svelte-lighthouse-viewer): A wrapper of the lighthouse-viewer for Svelte 3.

If you want a wrapper in for another library/framework, just open an issue ;)