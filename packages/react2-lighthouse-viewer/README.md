# react2-lighthouse-viewer
This component is a React wrapper for the lighthouse-viewer. 
It depends on [lighthouse-viewer](../lighthouse-viewer), package that exports the original lighthouse-viewer from Google
as an ES modules package.

## Getting started
1. Install using `npm install react2-lighthouse-viewer` or `yarn add react2-lighthouse-viewer`
2. Import in your project:
```ts
import React2LighthouseViewer from "react2-lighthouse-viewer";
```
3. Load the component in your code as follows:
```jsx
<div id="app">
  <React2LighthouseViewer json={json} />
</div>
```
4. That's all!

You can also refer to the examples in the [examples](/examples) folder.

1. [Create React App example](/examples/create-react-app)

