import './style.css';
import { renderReport, Result } from '../lib/main';
import report from './static/report.json';

const app = document.querySelector<HTMLDivElement>('#lighthouse-viewer-element')!;

const reportHtml = renderReport(report as unknown as Result, {});
app.appendChild(reportHtml);
