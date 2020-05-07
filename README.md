# vue-lighthouse-viewer
This component is a Vue wrapper for the lighthouse-viewer for Vue. For now is using the sourcefiles
from `lighthouse@next` (v6). It should be compatible with early reports from Lighthouse.

## Getting started
1. Install using `npm install vue-lighthouse-viewer` or `yarn add vue-lighthouse-viewer`
2. Import in your project:
```ts
import "vue-lighthouse-viewer/dist/vuelighthouseviewer.css";
import VueLighthouseViewer from "vue-lighthouse-viewer";
```
3. Load the component in your code as follows:
```vue
<div id="app">
    <VueLighthouseViewer :json="json" />
  </div>
```
4. That's all!

## TODO
- [X] Sync at install or serve with the sources from lighthouse
- [ ] Add Typescript Definitions
- [ ] Generate example
- [ ] Write unit tests
- [ ] Write E2E tests
- [ ] Setup CI
- [ ] Migrate to Rollup
- [ ] Make unnecessary to add the css manually 
- [ ] Export ESM version
