# Lighthouse Viewer
This is the code extracted from the [lighthouse original repository](https://github.com/GoogleChrome/lighthouse/tree/master/lighthouse-core/report/html)
and packaged as an ES Modules for convenience and tree shaking.
 
The code for this repository **is automatically generated every time is built**, copying the files, adding the `imports` 
and `exports` for every file.

This is only for convenience, and it would be cool if some day the people from Lighthouse could export this code as well.

## Getting started

1. Install it using `npm i lighthouse-viewer`
2. In your code, import the following modules:

```ts
import { renderReport, Result } from 'lighthouse-viewer';
import report from './static/report.json';

const app = document.querySelector<HTMLDivElement>('#lighthouse-viewer-element')!;

const reportHtml = renderReport(report as Result, {});
app.appendChild(reportHtml);
```

3. And in your HTML

```html
<div>
  <main class="lighthouse-viewer"></main>
</div>
```
## All the credits to the Lightouse Authors
If there is any issue with the license or the copyrights, please let me know. There is no other intentions behind this 
besides making it easy to find.
