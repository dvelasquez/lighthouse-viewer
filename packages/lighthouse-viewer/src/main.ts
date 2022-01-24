import './style.css';
import { renderReport } from '../lib/main';
import report from './static/report.json';

const app = document.querySelector<HTMLDivElement>('#lighthouse-viewer-element')!;

const reportHtml = renderReport(report as any, {});
app.appendChild(reportHtml);
