# Lighthouse Viewer
This is the code extracted from the [lighthouse original repository](https://github.com/GoogleChrome/lighthouse/tree/master/lighthouse-core/report/html)
and packaged as an ES Modules for convenience and tree shaking.
 
The code for this repository **is automatically generated every time is built**, copying the files, adding the `imports` 
and `exports` for every file.

This is only for convenience, and it would be cool if some day the people from Lighthouse could export this code as well.

## Getting started

1. Install it using `npm i lighthouse-viewer`
2. In your code, import the following modules:
```js
import { 
    DOM, 
    ReportRenderer,
    ReportUIFeatures,
    Logger,
    template, // The html template of the report as a string
    reportStyles // this are the css styles exported as an string 
    } from 'lighthouse-viewer';

    const mountViewer = () => {
        const style = document.createElement('link');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.innerText = reportStyles;
        document.head.appendChild(style);
        const htmlTemplate = document.createElement('div');
        htmlTemplate.innerText = template;
        document.getElementById('html-template').appendChild(htmlTemplate)
        
        document.addEventListener('lh-log', (e) => {
            const lhLogElement = document.querySelector('#lh-log');
            if (lhLogElement) {
                const logger = new Logger(lhLogElement);
                switch (e.detail.cmd) {
                    case 'log':
                        logger.log(e.detail.msg);
                        break;
                    case 'warn':
                        logger.warn(e.detail.msg);
                        break;
                    case 'error':
                        logger.error(e.detail.msg);
                        break;
                    case 'hide':
                        logger.hide();
                        break;
                    default:
                }
            }
        });
        generateReport()
    }
    const generateReport = (lighthouseReport) => {
        const dom = new DOM(document);
        const renderer = new ReportRenderer(dom);
        const container = document.querySelector('main.lighthouse-viewer');
        renderer.renderReport(lighthouseReport, container);
        const features = new ReportUIFeatures(dom);
        features.initFeatures(lighthouseReport);
    }
```
3. And in your HTML
```html
<div>
    <div class="lh-root lh-vars">
        <div id="html-template"></div>
        <main class="lighthouse-viewer"></main>
        <div id="lh-log"></div>
    </div>
</div>
```
## All the credits to the Lightouse Authors
If there is any issue with the license or the copyrights, please let me know. There is no other intentions behind this 
besides making it easy to find.
