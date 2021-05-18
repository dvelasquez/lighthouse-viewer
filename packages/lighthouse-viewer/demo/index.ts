// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DOM, ReportRenderer, ReportUIFeatures, Logger, template } from '..';
import reportJson from './report-v7.5.0.json';

const generateReport = (lighthouseReport: any) => {
  const dom = new DOM(document);
  const renderer = new ReportRenderer(dom);
  const container = document.querySelector('main.lighthouse-viewer');
  renderer.renderReport(lighthouseReport, container);
  const features = new ReportUIFeatures(dom);
  features.initFeatures(lighthouseReport);
};

const mountViewer = () => {
  const htmlTemplate = document.createElement('div');
  htmlTemplate.innerHTML = template;
  const htmlTemplateElement = document.getElementById('html-template');
  if (htmlTemplateElement) {
    htmlTemplateElement.appendChild(htmlTemplate);

    document.addEventListener('lh-log', (e: any) => {
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
  }

  generateReport(reportJson);
};

mountViewer();
