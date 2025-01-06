import './style.css';
import { renderReport } from '../lib/main';
import report from './static/report.json';
import Result from 'lighthouse/types/lhr/lhr.d';

const app = document.querySelector<HTMLDivElement>('#lighthouse-viewer-element')!;

const reportHtml = renderReport(report as unknown as Result, {});
app.appendChild(reportHtml);
