# svelte-lighthouse-viewer
This component is a Svelte wrapper for the lighthouse-viewer. 
It depends on [lighthouse-viewer](../lighthouse-viewer), package that exports the original lighthouse-viewer from Google
as an ES modules package.

## Getting started
1. Install using `npm install svelte-lighthouse-viewer` or `yarn add svelte-lighthouse-viewer`
2. Import in your project:
```ts
import SvelteLighthouseViewer from 'svelte-lighthouse-viewer';
```
3. Load the component in your code as follows:
```ts
const svelteAppElement = document.getElementById('svelte-app');
if (svelteAppElement) {
  const app = new SvelteLighthouseViewer({
    target: svelteAppElement,
    props: {
      json: reportJson,
    },
  });
}
```
4. That's all!

