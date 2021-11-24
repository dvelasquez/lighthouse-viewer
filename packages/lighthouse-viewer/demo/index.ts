// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { renderReport } from '..';
import reportJson from './report-v8.0.0.json';
// import reportJson7 from './report-v7.5.0.json';
// import reportJson6 from './report.json';

const generateReport = (lighthouseReport: any) => {
  const renderedReport = renderReport(lighthouseReport);
  return renderedReport;
};

const mountViewer = (report: any) => {
  const renderedReport = generateReport(report);
  const container = document.getElementById('lighthouse-viewer-element');
  container.innerHTML = null;
  container.appendChild(renderedReport);
};

mountViewer(reportJson);
// let index = 0;
// const reports = [reportJson, reportJson7, reportJson6];
// setInterval(() => {
//   mountViewer(reports[index]);
//   index = (index + 1) % reports.length;
// }, 5000);
