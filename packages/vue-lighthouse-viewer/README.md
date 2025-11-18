# vue-lighthouse-viewer
This component is a Vue wrapper for the lighthouse-viewer. 
It depends on [lighthouse-viewer](../lighthouse-viewer), package that exports the original lighthouse-viewer from Google
as an ES modules package.

## Getting started
1. Install using `npm install vue-lighthouse-viewer` or `yarn add vue-lighthouse-viewer`
2. Import in your project:
```ts
import VueLighthouseViewer from "vue-lighthouse-viewer";
```
3. Load the component in your code as follows:
```vue
<div id="app">
    <VueLighthouseViewer :json="json" />
</div>
```
4. That's all!

Made with ❤️ by [Danilo Velasquez](https://d13z.dev/)