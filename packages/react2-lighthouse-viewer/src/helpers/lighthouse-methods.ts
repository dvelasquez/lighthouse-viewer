import { DOM, Logger, ReportRenderer, ReportUIFeatures } from 'lighthouse-viewer';

const lhLogEventListener = () => {
  document.addEventListener('lh-log', (e: CustomEventInit) => {
    const logger = new Logger(document.querySelector('#lh-log'));
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
  });
};

const generateReport = (json: any) => {
  const dom = new DOM(document);
  const renderer = new ReportRenderer(dom);

  const container = document.querySelector('main.react2-lighthouse-viewer');

  renderer.renderReport(json, container);

  // Hook in JS features and page-level event listeners after the report
  // is in the document.
  const features = new ReportUIFeatures(dom);
  features.initFeatures(json);
};

export { lhLogEventListener, generateReport };
